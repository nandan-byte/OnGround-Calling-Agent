// Import required Node.js path module to locate files
const path = require('path');
// Load environment variables (supports cloud hosting, local root, or local subfolder)
require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
// Import express framework to create the HTTP server
const express = require('express');
// Import cors middleware to allow cross-origin requests from React
const cors = require('cors');
// Import the official twilio SDK library
const twilio = require('twilio');
const { spawn } = require('child_process');

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
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const agentPhone = process.env.AGENT_PHONE;

// Initialize the Twilio client using the credentials from .env
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Track active tunnel URL for real-time Twilio speech webhook callbacks
let activeTunnelUrl = null;
let pinggyProcess = null;

// Connect high-speed SSH tunnel so Twilio cloud speech recognition connects to local PC
function startPinggyTunnel(port) {
  return new Promise((resolve) => {
    if (process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL) {
      activeTunnelUrl = (process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL).replace(/\/$/, '');
      console.log(`[Public Cloud URL Detected]: ${activeTunnelUrl}`);
      return resolve(activeTunnelUrl);
    }

    try {
      pinggyProcess = spawn('ssh', [
        '-o', 'StrictHostKeyChecking=no',
        '-o', 'ServerAliveInterval=30',
        '-p', '443',
        `-R0:localhost:${port}`,
        'a.pinggy.io'
      ]);

      let resolved = false;

      const handleData = (data) => {
        const text = data.toString();
        const match = text.match(/https:\/\/[a-zA-Z0-9\.\-]+\.(?:free\.pinggy\.net|pinggy-free\.link|pinggy\.link)/);
        if (match && !resolved) {
          resolved = true;
          activeTunnelUrl = match[0].replace(/\/$/, '');
          console.log(`=======================================================`);
          console.log(`[Interactive Two-Way Voice Tunnel Active]: ${activeTunnelUrl}`);
          console.log(`Customer phone speech will reach this backend in real-time`);
          console.log(`=======================================================`);
          resolve(activeTunnelUrl);
        }
      };

      pinggyProcess.stdout.on('data', handleData);
      pinggyProcess.stderr.on('data', handleData);

      pinggyProcess.on('close', () => {
        console.log('[Pinggy Tunnel Disconnected]');
        activeTunnelUrl = null;
      });

      // Timeout fallback after 6s
      setTimeout(() => {
        if (!resolved) {
          console.log('[Tunnel Status]: Initializing in background...');
          resolve(activeTunnelUrl);
        }
      }, 6000);
    } catch (err) {
      console.warn('[Pinggy Tunnel Error]:', err.message);
      resolve(null);
    }
  });
}

// Clean up background SSH tunnel on process exit
process.on('SIGINT', () => {
  if (pinggyProcess) pinggyProcess.kill();
  process.exit(0);
});
process.on('SIGTERM', () => {
  if (pinggyProcess) pinggyProcess.kill();
  process.exit(0);
});

// Helper function to normalize phone number string into clean digits with leading plus
function normalizePhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

// Helper to determine the effective public base URL
function getEffectiveBaseUrl(req) {
  if (process.env.PUBLIC_URL && process.env.PUBLIC_URL.startsWith('http') && !process.env.PUBLIC_URL.includes('localhost')) {
    return process.env.PUBLIC_URL.replace(/\/$/, '');
  }
  if (process.env.RENDER_EXTERNAL_URL && process.env.RENDER_EXTERNAL_URL.startsWith('http')) {
    return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, '');
  }
  if (activeTunnelUrl && activeTunnelUrl.startsWith('http')) {
    return activeTunnelUrl.replace(/\/$/, '');
  }
  if (req) {
    const fHost = req.headers['x-forwarded-host'] || req.get('host');
    const fProto = req.headers['x-forwarded-proto'] || 'https';
    if (fHost && !fHost.includes('localhost') && !fHost.includes('127.0.0.1')) {
      return `${fProto}://${fHost}`;
    }
  }
  return null;
}

// Health check endpoint to verify backend status without exposing secrets
app.get('/api/health', (req, res) => {
  const isTwilioConfigured = Boolean(accountSid && authToken && twilioNumber && agentPhone);
  const effectiveUrl = getEffectiveBaseUrl(req);
  res.json({
    status: 'ok',
    twilioConfigured: isTwilioConfigured,
    twilioNumber: twilioNumber ? `${twilioNumber.slice(0, 4)}...` : null,
    agentPhone: agentPhone ? `${agentPhone.slice(0, 5)}...` : null,
    publicWebhookUrl: effectiveUrl,
    speechInteractiveReady: Boolean(effectiveUrl)
  });
});

// Endpoint to initiate a phone call sequence
app.post('/api/call', async (req, res) => {
  try {
    const { to, customerName, product, store } = req.body;
    if (!to && !agentPhone) {
      return res.status(400).json({ error: 'Target phone number is required' });
    }
    if (!agentPhone || !twilioNumber || !twilioClient) {
      return res.status(500).json({ error: 'Twilio configuration is missing in .env' });
    }

    const name = customerName || 'valued customer';
    const prod = product || 'SmartGRID Luxe mattress';
    const loc = store || 'Indiranagar store';
    const effectiveBaseUrl = getEffectiveBaseUrl(req);

    const twimlResponse = new twilio.twiml.VoiceResponse();
    twimlResponse.pause({ length: 2 });

    // Step 1: Personalized store representative greeting
    twimlResponse.say(
      { voice: 'alice', language: 'en-IN' },
      `Hello ${name}! This is Sarah calling from The Sleep Company ${loc} regarding your inquiry for the ${prod}.`
    );

    if (effectiveBaseUrl) {
      // Two-way interactive speech mode: AI asks an open question and listens to customer speech
      const actionUrl = `${effectiveBaseUrl}/api/twilio/voice-reply`;
      const gather = twimlResponse.gather({
        input: 'speech',
        action: actionUrl,
        method: 'POST',
        language: 'en-IN',
        speechTimeout: 'auto',
        timeout: 5
      });
      gather.say(
        { voice: 'alice', language: 'en-IN' },
        'I am calling to check how I can help you today with pricing, stock availability, or zero cost EMI? Go ahead, I am listening.'
      );

      // Fallback if the customer stays silent before gather timeout
      twimlResponse.say(
        { voice: 'alice', language: 'en-IN' },
        `We are offering an exclusive 25% walkout recovery discount with 6-month zero-cost EMI on Bajaj Finserv, 10-year warranty, and free delivery on the ${prod}. I have just sent your quotation link directly to WhatsApp. Thank you for choosing The Sleep Company, have a wonderful day!`
      );
      twimlResponse.hangup();
    } else {
      // Safe fallback when running without tunnel: delivers full pitch cleanly
      twimlResponse.pause({ length: 1 });
      twimlResponse.say(
        { voice: 'alice', language: 'en-IN' },
        `I am following up on your store visit to share that the ${prod} is available in stock today with our exclusive 25% walkout recovery discount. Our 6-month zero-cost EMI on Bajaj Finserv is pre-approved for you with zero down payment, complete with our 10-year warranty and two complimentary luxury pillows.`
      );
      twimlResponse.pause({ length: 1 });
      twimlResponse.say(
        { voice: 'alice', language: 'en-IN' },
        `I have just dispatched your official quotation and payment link directly to your WhatsApp. You can review the details and confirm your order anytime today. Thank you for choosing The Sleep Company, have a wonderful day!`
      );
      twimlResponse.hangup();
    }

    // Twilio trial account dials the verified agent phone
    const targetDialNumber = agentPhone;

    console.log(`[Placing Call]: Dialing ${targetDialNumber} for lead "${name}" (${prod}) - Interactive Mode: ${Boolean(effectiveBaseUrl)}`);

    const call = await twilioClient.calls.create({
      twiml: twimlResponse.toString(),
      to: targetDialNumber,
      from: twilioNumber
    });

    console.log(`[Call Placed Successfully]: SID ${call.sid}`);

    res.json({
      success: true,
      message: `Calling your phone with AI representative Sarah dialogue for ${name}`,
      callSid: call.sid,
      agentPhone: targetDialNumber,
      customerPhone: to || targetDialNumber,
      customerName: name,
      product: prod,
      interactive: Boolean(effectiveBaseUrl)
    });
  } catch (error) {
    console.error('[Error placing call]:', error);
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
      status: call.status,
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

// Two-way interactive webhook: evaluates user's speech and dynamically answers
app.post('/api/twilio/voice-reply', (req, res) => {
  try {
    const speech = req.body.SpeechResult || '';
    const twiml = new twilio.twiml.VoiceResponse();
    const lower = speech.toLowerCase();
    const effectiveBaseUrl = getEffectiveBaseUrl(req);
    const nextAction = effectiveBaseUrl ? `${effectiveBaseUrl}/api/twilio/voice-reply` : undefined;

    console.log(`[Twilio Call Audio from Phone]: "${speech}" (PublicUrl: ${effectiveBaseUrl || 'none'})`);

    // Intent 1: Price / Cost / Discount / Offers
    if (lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rate') || lower.includes('quote') || lower.includes('discount') || lower.includes('offer')) {
      if (effectiveBaseUrl) {
        const gather = twiml.gather({
          input: 'speech',
          action: nextAction,
          method: 'POST',
          language: 'en-IN',
          speechTimeout: 'auto',
          timeout: 5
        });
        gather.say(
          { voice: 'alice', language: 'en-IN' },
          "The special walkout price is 25% off today, bringing it down to 9,000 rupees with 6-month zero-cost EMI on Bajaj Finserv and free express delivery. Should I send this official quotation directly to your WhatsApp?"
        );
        twiml.say({ voice: 'alice', language: 'en-IN' }, "I have sent the official quotation link with your 25% discount to your WhatsApp right now. Thank you for choosing The Sleep Company, have a wonderful day!");
        twiml.hangup();
      } else {
        twiml.say({ voice: 'alice', language: 'en-IN' }, "The special walkout price is 25% off today, with 6-month zero-cost EMI on Bajaj Finserv. I have sent the quotation link directly to your WhatsApp right now. Thank you for choosing The Sleep Company, have a wonderful day!");
        twiml.hangup();
      }
    }
    // Intent 2: Stock availability / Delivery timeline
    else if (lower.includes('stock') || lower.includes('available') || lower.includes('have') || lower.includes('deliver') || lower.includes('ready') || lower.includes('when')) {
      if (effectiveBaseUrl) {
        const gather = twiml.gather({
          input: 'speech',
          action: nextAction,
          method: 'POST',
          language: 'en-IN',
          speechTimeout: 'auto',
          timeout: 5
        });
        gather.say(
          { voice: 'alice', language: 'en-IN' },
          "Yes! The mattress is in stock today at our store with guaranteed 48-hour free delivery, 10-year warranty, and 6-month zero-cost EMI. Can I send the quotation link to your WhatsApp?"
        );
        twiml.say({ voice: 'alice', language: 'en-IN' }, "I have sent the quotation link to your WhatsApp right now. Thank you for choosing The Sleep Company, have a great day!");
        twiml.hangup();
      } else {
        twiml.say({ voice: 'alice', language: 'en-IN' }, "Yes! The mattress is in stock today with 48-hour free delivery. I have sent the quotation link directly to your WhatsApp. Thank you for choosing The Sleep Company, have a great day!");
        twiml.hangup();
      }
    }
    // Intent 3: EMI / Financing / Payment options
    else if (lower.includes('emi') || lower.includes('bajaj') || lower.includes('finance') || lower.includes('pay') || lower.includes('installment')) {
      if (effectiveBaseUrl) {
        const gather = twiml.gather({
          input: 'speech',
          action: nextAction,
          method: 'POST',
          language: 'en-IN',
          speechTimeout: 'auto',
          timeout: 5
        });
        gather.say(
          { voice: 'alice', language: 'en-IN' },
          "Our 6-month zero-cost EMI on Bajaj Finserv has zero interest and zero down payment. Would you like me to send the pre-approved EMI quotation to your WhatsApp?"
        );
        twiml.say({ voice: 'alice', language: 'en-IN' }, "I have sent your pre-approved EMI quotation directly to your WhatsApp. Thank you for choosing The Sleep Company, have a great day!");
        twiml.hangup();
      } else {
        twiml.say({ voice: 'alice', language: 'en-IN' }, "Our 6-month zero-cost EMI on Bajaj Finserv has zero down payment. I have sent the EMI link directly to your WhatsApp. Thank you for choosing The Sleep Company!");
        twiml.hangup();
      }
    }
    // Intent 4: Dimensions / Size / Technology / Specs
    else if (lower.includes('size') || lower.includes('king') || lower.includes('queen') || lower.includes('dimension') || lower.includes('ortho') || lower.includes('spec') || lower.includes('thick')) {
      if (effectiveBaseUrl) {
        const gather = twiml.gather({
          input: 'speech',
          action: nextAction,
          method: 'POST',
          language: 'en-IN',
          speechTimeout: 'auto',
          timeout: 5
        });
        gather.say(
          { voice: 'alice', language: 'en-IN' },
          "It is available in standard king and queen sizes with our patented Japanese SmartGRID orthopedic comfort layer. Should I send the specification sheet to your WhatsApp?"
        );
        twiml.say({ voice: 'alice', language: 'en-IN' }, "I have sent the full specification sheet to your WhatsApp right now. Thank you for choosing The Sleep Company!");
        twiml.hangup();
      } else {
        twiml.say({ voice: 'alice', language: 'en-IN' }, "It comes in king and queen sizes with patented Japanese SmartGRID technology. I have sent the full specifications to your WhatsApp. Thank you for choosing The Sleep Company!");
        twiml.hangup();
      }
    }
    // Intent 5: User agrees (Yes / Sure / Send it / Okay / WhatsApp)
    else if (lower.includes('yes') || lower.includes('sure') || lower.includes('send') || lower.includes('whatsapp') || lower.includes('okay') || lower.includes('ok') || lower.includes('yeah') || lower.includes('please') || lower.includes('do that')) {
      twiml.say(
        { voice: 'alice', language: 'en-IN' },
        "Wonderful! I have just sent your official quotation, 25% discount voucher, and payment link directly to your WhatsApp. You can review the details and confirm your order directly from your phone. Thank you for choosing The Sleep Company, have a great day!"
      );
      twiml.hangup();
    }
    // Intent 6: User declines (No / Cancel / Not interested / Later)
    else if (lower.includes('no') || lower.includes('not') || lower.includes('cancel') || lower.includes('dont') || lower.includes("don't") || lower.includes('stop') || lower.includes('later')) {
      twiml.say(
        { voice: 'alice', language: 'en-IN' },
        "No problem at all! Feel free to visit our store anytime or reach out whenever you're ready. Thank you for visiting The Sleep Company, have a wonderful day!"
      );
      twiml.hangup();
    }
    // Intent 7: Default fallback for any other speech
    else {
      twiml.say(
        { voice: 'alice', language: 'en-IN' },
        "Understood! I have dispatched the complete product catalogue, quotation, and store manager contact directly to your WhatsApp so you can review everything at your convenience. Thank you for choosing The Sleep Company, have a wonderful day!"
      );
      twiml.hangup();
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (err) {
    console.error('[voice-reply error]', err);
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say({ voice: 'alice', language: 'en-IN' }, "Thank you for visiting The Sleep Company. We have sent your special quotation to WhatsApp. Have a great day!");
    twiml.hangup();
    res.type('text/xml');
    res.send(twiml.toString());
  }
});

// Serve the quick HTML test page on the root or /test route
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Serve the interactive browser-to-browser WebRTC calling simulator
app.get('/browser-call', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'browser-call.html'));
});

// Start listening for HTTP connections on the designated port
app.listen(PORT, async () => {
  console.log(`Calling backend running on http://localhost:${PORT}`);
  // Connect high-performance SSH tunnel for Twilio speech webhooks
  await startPinggyTunnel(PORT);
});
