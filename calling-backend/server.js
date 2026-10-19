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

      // The Sleep Company AI Representative greeting the customer
      twimlResponse.say(
        { voice: 'alice', language: 'en-IN' },
        `Hello ${name}! This is Sarah calling from The Sleep Company ${loc}.`
      );
      // Brief natural conversational pause
      twimlResponse.pause({ length: 1 });
      // Announcing product availability, EMI, and warranty to the customer
      twimlResponse.say(
        { voice: 'alice', language: 'en-IN' },
        `I am following up on your inquiry for the ${prod}. I am happy to let you know that this item is in stock, and our 6 month zero cost EMI on Bajaj Finserv is available today with our 10 year warranty.`
      );
      // Wait for customer response
      twimlResponse.pause({ length: 2 });
      // Offering to send quotation on WhatsApp to finalize order
      twimlResponse.say(
        { voice: 'alice', language: 'en-IN' },
        `I can send the official quotation and discount link directly to your WhatsApp so you can place your order. Thank you for choosing The Sleep Company!`
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

// Serve the quick HTML test page on the root or /test route
app.get('/test', (req, res) => {
  // Send the test HTML file located in the public directory
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Start listening for HTTP connections on the designated port
app.listen(PORT, () => {
  // Output a simple confirmation message indicating the server is running
  console.log(`Calling backend running on http://localhost:${PORT}`);
});
