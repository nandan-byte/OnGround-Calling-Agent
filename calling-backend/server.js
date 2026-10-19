// Import required Node.js path module to locate files
const path = require('path');
// Load environment variables from the root .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// Import express framework to create the HTTP server
const express = require('express');
// Import cors middleware to allow cross-origin requests from React
const cors = require('cors');
// Import the official twilio SDK library
const twilio = require('twilio');

// Initialize the Express web application instance
const app = express();
// Define the port number where the server will listen
const PORT = process.env.PORT || 5000;

// Enable CORS for all incoming requests from the frontend
app.use(cors());
// Parse incoming requests with JSON payloads
app.use(express.json());
// Parse URL-encoded bodies for standard form submissions and Twilio webhooks
app.use(express.urlencoded({ extended: true }));
// Serve static test files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Retrieve Twilio configuration safely from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
// Retrieve Twilio authentication token from environment variables
const authToken = process.env.TWILIO_AUTH_TOKEN;
// Retrieve the Twilio phone number used as the caller ID
const twilioNumber = process.env.TWILIO_NUMBER;
// Retrieve the agent's verified phone number that receives the initial call
const agentPhone = process.env.AGENT_PHONE;

// Initialize the Twilio client using the credentials from .env
const twilioClient = twilio(accountSid, authToken);

// Health check endpoint to verify backend status without exposing secrets
app.get('/api/health', (req, res) => {
  // Check if all necessary environment variables are defined
  const isTwilioConfigured = Boolean(accountSid && authToken && twilioNumber && agentPhone);
  // Send back JSON response confirming server health and config state
  res.json({
    status: 'ok',
    twilioConfigured: isTwilioConfigured,
    twilioNumber: twilioNumber ? `${twilioNumber.slice(0, 4)}...` : null,
    agentPhone: agentPhone ? `${agentPhone.slice(0, 5)}...` : null
  });
});

// Helper function to normalize phone number string into clean digits with leading plus
function normalizePhone(phone) {
  // Return empty string if phone is not provided
  if (!phone) return '';
  // Strip all whitespace, parentheses, and dashes
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Ensure leading plus sign exists
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

// Endpoint to initiate a human-to-human call sequence
app.post('/api/call', async (req, res) => {
  try {
    // Extract customer target phone, simulation flag, and lead context from request body
    const { to, simulate, customerName, product, store } = req.body;
    // Validate that the target phone number is provided
    if (!to) {
      // Return a 400 Bad Request error if the target number is missing
      return res.status(400).json({ error: 'Target phone number "to" is required' });
    }
    // Validate that the agent phone number is configured in .env
    if (!agentPhone || !twilioNumber) {
      // Return a 500 Server Error if phone numbers are not set
      return res.status(500).json({ error: 'AGENT_PHONE or TWILIO_NUMBER is missing in .env' });
    }

    // Normalize phone numbers for safe comparison and dialing
    const cleanTo = normalizePhone(to);
    // Normalize configured agent phone
    const cleanAgent = normalizePhone(agentPhone);
    // Determine if this is a solo testing simulation (calling own phone)
    const isSoloSimulation = Boolean(simulate) || (cleanTo === cleanAgent);

    // Build the TwiML instructions executed when the agent answers the call
    const twimlResponse = new twilio.twiml.VoiceResponse();
    // Add a 2-second pause so the mobile phone audio bearer is fully open after pickup
    twimlResponse.pause({ length: 2 });

    // Handle solo testing simulation where The Sleep Company AI Agent calls the customer
    if (isSoloSimulation) {
      // Safe fallback customer name from lead data
      const name = customerName || 'valued customer';
      // Safe fallback product of interest from lead data
      const prod = product || 'Ortho GRID King Size mattress';
      // Safe fallback store location from lead data
      const loc = store || 'Indiranagar store';

      // Determine public webhook URL if tunnel or domain is configured
      const baseUrl = process.env.PUBLIC_URL || '';
      const actionUrl = baseUrl ? `${baseUrl}/api/twilio/voice-reply` : '/api/twilio/voice-reply';

      // The Sleep Company AI Representative greeting the customer
      twimlResponse.say(
        { voice: 'alice', language: 'en-IN' },
        `Hello ${name}! This is Sarah calling from The Sleep Company ${loc} regarding your inquiry for the ${prod}. How can I help you today?`
      );

      // Listen to the caller's microphone on their phone using Speech Recognition
      const gather = twimlResponse.gather({
        input: 'speech',
        action: actionUrl,
        language: 'en-IN',
        speechTimeout: 'auto',
        timeout: 4
      });
      gather.say({ voice: 'alice', language: 'en-IN' }, 'Go ahead, I am listening.');

      // Fallback if no speech was detected
      twimlResponse.say(
        { voice: 'alice', language: 'en-IN' },
        `I am happy to let you know that the ${prod} is in stock, and our 6-month zero-cost EMI on Bajaj Finserv is available today with our 10-year warranty. We will send the quotation link directly to your WhatsApp. Thank you for choosing The Sleep Company!`
      );
    } else {
      // Use conference-based bridge: both agent and customer join the same room
      // This avoids Dial verb failures on Twilio trial for international calls
      const confName = `bridge_${Date.now()}`;

      // Build TwiML for the agent: short announcement then join conference
      twimlResponse.say({ voice: 'alice', language: 'en-IN' }, 'Connecting you to the customer now. Please hold.');
      twimlResponse.dial().conference({
        startConferenceOnEnter: true,
        endConferenceOnExit: true
      }, confName);

      // Build TwiML for the customer: greeting then join the same conference
      const custTwiml = new twilio.twiml.VoiceResponse();
      custTwiml.pause({ length: 2 });
      const custName = customerName || 'valued customer';
      const prod = product || 'SmartGRID mattress';
      const loc = store || 'our store';
      custTwiml.say(
        { voice: 'alice', language: 'en-IN' },
        `Hello ${custName}! This is a call from The Sleep Company ${loc} regarding your inquiry for the ${prod}. Connecting you to our representative now.`
      );
      custTwiml.dial().conference({
        startConferenceOnEnter: true,
        endConferenceOnExit: true
      }, confName);

      // Call the agent phone first
      const agentCall = await twilioClient.calls.create({
        twiml: twimlResponse.toString(),
        to: agentPhone,
        from: twilioNumber
      });

      // Call the customer phone simultaneously (independent call leg)
      const customerCall = await twilioClient.calls.create({
        twiml: custTwiml.toString(),
        to: cleanTo,
        from: twilioNumber
      });

      // Send success response back to the client with call metadata
      return res.json({
        success: true,
        message: 'Conference bridge: calling both agent and customer into the same room',
        agentCallSid: agentCall.sid,
        customerCallSid: customerCall.sid,
        conferenceName: confName,
        agentPhone: agentPhone,
        customerPhone: to,
        customerName: customerName || 'Customer',
        product: product,
        isSoloSimulation: false
      });
    }

    // Trigger an outbound call to the agent first using the twiml instructions (solo simulation only)
    const call = await twilioClient.calls.create({
      twiml: twimlResponse.toString(),
      to: agentPhone,
      from: twilioNumber
    });

    // Send success response back to the client with call metadata
    res.json({
      success: true,
      message: `Calling your phone with simulated customer ${customerName || 'Mukunda'} dialogue`,
      callSid: call.sid,
      agentPhone: agentPhone,
      customerPhone: to,
      customerName: customerName || 'Mukunda',
      product: product,
      isSoloSimulation: isSoloSimulation
    });
  } catch (error) {
    // Return friendly error details if Twilio rejects the call
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to place call'
    });
  }
});

// Endpoint to fetch real-time Twilio call status and duration
app.get('/api/call-status/:callSid', async (req, res) => {
  try {
    const { callSid } = req.params;
    if (!callSid || !twilioClient) {
      return res.status(400).json({ error: 'callSid is required' });
    }
    const call = await twilioClient.calls(callSid).fetch();
    res.json({
      success: true,
      sid: call.sid,
      status: call.status, // queued, ringing, in-progress, completed, busy, failed, no-answer, canceled
      duration: call.duration,
      to: call.to,
      from: call.from
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to remotely hang up an active Twilio call
app.post('/api/call/hangup', async (req, res) => {
  try {
    const { callSid } = req.body;
    if (!callSid || !twilioClient) {
      return res.status(400).json({ error: 'callSid is required' });
    }
    const call = await twilioClient.calls(callSid).update({ status: 'completed' });
    res.json({ success: true, message: 'Call terminated', status: call.status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Twilio webhook to evaluate spoken words from mobile phone and dynamically answer back
app.post('/api/twilio/voice-reply', (req, res) => {
  const speech = req.body.SpeechResult || '';
  const twiml = new twilio.twiml.VoiceResponse();
  const lower = speech.toLowerCase();
  const baseUrl = process.env.PUBLIC_URL || '';
  const nextAction = baseUrl ? `${baseUrl}/api/twilio/voice-reply` : '/api/twilio/voice-reply';

  console.log(`[Twilio Call Audio from Phone]: "${speech}"`);

  if (lower.includes('stock') || lower.includes('available') || lower.includes('have')) {
    twiml.say({ voice: 'alice', language: 'en-IN' }, "Yes! The SmartGRID Ortho King size mattress is in stock today at our Indiranagar store, and we offer 6-month zero-cost EMI on Bajaj Finserv. Can I send the quotation and payment link to your WhatsApp?");
    twiml.gather({ input: 'speech', action: nextAction, language: 'en-IN', speechTimeout: 'auto', timeout: 4 });
  } else if (lower.includes('emi') || lower.includes('price') || lower.includes('cost') || lower.includes('bajaj') || lower.includes('discount')) {
    twiml.say({ voice: 'alice', language: 'en-IN' }, "Our 6-month zero-cost EMI on Bajaj Finserv has zero down payment, and includes our 10-year warranty with 2 free pillows. Should I send the official quote to your WhatsApp?");
    twiml.gather({ input: 'speech', action: nextAction, language: 'en-IN', speechTimeout: 'auto', timeout: 4 });
  } else if (lower.includes('yes') || lower.includes('sure') || lower.includes('send') || lower.includes('whatsapp') || lower.includes('okay') || lower.includes('ok')) {
    twiml.say({ voice: 'alice', language: 'en-IN' }, "Perfect! I have sent the quotation and discount link to your WhatsApp right now. You can finalize your order today. Thank you for choosing The Sleep Company!");
    twiml.hangup();
  } else if (lower.includes('no') || lower.includes('not') || lower.includes("don't") || lower.includes("won't")) {
    twiml.say({ voice: 'alice', language: 'en-IN' }, "No worries at all! Would you prefer me to email the details, or would you like to visit our Indiranagar store to try the mattress in person?");
    twiml.gather({ input: 'speech', action: nextAction, language: 'en-IN', speechTimeout: 'auto', timeout: 4 });
  } else {
    twiml.say({ voice: 'alice', language: 'en-IN' }, "Understood! I can send the official quotation and discount link directly to your WhatsApp so you can review the details. Would you like me to send that now?");
    twiml.gather({ input: 'speech', action: nextAction, language: 'en-IN', speechTimeout: 'auto', timeout: 4 });
  }

  res.type('text/xml');
  res.send(twiml.toString());
});

// Serve the quick HTML test page on the root or /test route
app.get('/test', (req, res) => {
  // Send the test HTML file located in the public directory
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Serve the interactive browser-to-browser WebRTC calling simulator
app.get('/browser-call', (req, res) => {
  // Send the browser calling simulator HTML file
  res.sendFile(path.join(__dirname, 'public', 'browser-call.html'));
});

// Start listening for HTTP connections on the designated port
app.listen(PORT, () => {
  // Output a simple confirmation message indicating the server is running
  console.log(`Calling backend running on http://localhost:${PORT}`);
});
