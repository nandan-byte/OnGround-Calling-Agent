// Import standard React hooks
import React, { useState, useEffect, useRef, useCallback } from 'react';
// Import icons from lucide-react library
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Send, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

// Speak out loud through the device speakers using browser Speech Synthesis
function speakVoice(text, onEnd = null) {
  if (!('speechSynthesis' in window)) {
    if (onEnd) setTimeout(onEnd, 1200);
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05; // Natural responsive tempo
    utterance.pitch = 0.95; // Natural customer voice pitch
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.startsWith('en'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    let ended = false;
    const safeEnd = () => {
      if (!ended) {
        ended = true;
        if (onEnd) onEnd();
      }
    };

    utterance.onend = safeEnd;
    utterance.onerror = safeEnd;
    window.speechSynthesis.speak(utterance);
    
    // Safety fallback in case onend never fires
    const estimatedMs = Math.max(1500, (text.split(' ').length / 2.5) * 1000);
    setTimeout(safeEnd, estimatedMs + 1000);
  } catch (e) {
    if (onEnd) setTimeout(onEnd, 1200);
  }
}

// Intelligent Conversational AI Evaluator with Negation Detection & Contextual Reactions
function evaluateCustomerResponse(agentText, stage, currentScore) {
  const lower = agentText.toLowerCase().trim();

  // 1. Detect Negations and Refusals
  const hasNegation = (
    lower.includes('not ') ||
    lower.includes("won't") ||
    lower.includes("will not") ||
    lower.includes("can't") ||
    lower.includes("cannot") ||
    lower.includes("don't") ||
    lower.includes("no ") ||
    lower === "no" ||
    lower.includes("never") ||
    lower.includes("refuse")
  );

  // Objection: Refusal to send quote / link / WhatsApp
  if ((lower.includes('send') || lower.includes('link') || lower.includes('quote') || lower.includes('whatsapp') || lower.includes('share')) && hasNegation) {
    return {
      reply: "Wait, why won't you send the quotation? Is there an issue with my number, or can you share it over email or SMS instead? I need to review the price.",
      hint: "⚠️ Customer Objection: Apologize and confirm you can send the quote, or offer email/SMS.",
      scoreDelta: -10,
      nextStage: stage,
      isComplete: false
    };
  }

  // Objection: Out of stock / refusal of product availability
  if ((lower.includes('stock') || lower.includes('mattress') || lower.includes('item') || lower.includes('product')) && (hasNegation || lower.includes('sold out') || lower.includes('out of stock'))) {
    return {
      reply: "Oh, that's really disappointing. When is the next shipment arriving at Indiranagar? Or do you have the Queen size or Luxe model in stock?",
      hint: "💡 Cross-sell Opportunity: Offer the Queen size or offer to pre-book the incoming King size mattress.",
      scoreDelta: 0,
      nextStage: 1,
      isComplete: false
    };
  }

  // Objection: Refusal of EMI / financing
  if ((lower.includes('emi') || lower.includes('bajaj') || lower.includes('finserv') || lower.includes('zero cost')) && hasNegation) {
    return {
      reply: "No zero-cost EMI? The store executive yesterday mentioned Bajaj Finserv 6-month EMI was available. Are there any other payment schemes or bank card discounts?",
      hint: "⚠️ Payment Objection: Explain available bank card cashback or interest-free installments.",
      scoreDelta: -5,
      nextStage: 2,
      isComplete: false
    };
  }

  // 2. Detect Gibberish / Nonsense / Extremely Off-Topic (e.g., 'i am iron', random non-words)
  const relevantKeywords = [
    'sleep company', 'arvind', 'store', 'mattress', 'grid', 'smartgrid', 'ortho',
    'king', 'queen', 'stock', 'available', 'emi', 'bajaj', 'finserv', 'warranty',
    'whatsapp', 'quote', 'quotation', 'link', 'send', 'discount', 'price', 'cost',
    'offer', 'yes', 'hello', 'hi', 'indiranagar', 'hsr', 'sure', 'order'
  ];
  const isRelevant = relevantKeywords.some(k => lower.includes(k));

  if (!isRelevant && lower.length < 28) {
    return {
      reply: "Excuse me? I didn't quite catch that. I was asking about the SmartGRID mattress from your Indiranagar store.",
      hint: "⚠️ Customer Confusion: Address the customer's question clearly.",
      scoreDelta: 0,
      nextStage: stage,
      isComplete: false
    };
  }

  // 3. Contextual Progression based on conversation stage
  if (stage === 0) {
    // Initial greeting
    return {
      reply: "Oh yes! I visited your Indiranagar store yesterday to check the Ortho King size mattress. Is it still in stock?",
      hint: "Confirm that the SmartGRID Ortho King size mattress is in stock today.",
      scoreDelta: 25,
      nextStage: 1,
      isComplete: false
    };
  }

  if (stage === 1) {
    // Stock stage
    if (lower.includes('stock') || lower.includes('yes') || lower.includes('available') || lower.includes('have') || lower.includes('king') || lower.includes('smartgrid') || lower.includes('sure')) {
      return {
        reply: "That's great to hear! What about payment? Do you offer 6-month zero-cost EMI on Bajaj Finserv?",
        hint: "Explain the 6-month zero-cost EMI on Bajaj Finserv and the 10-year warranty.",
        scoreDelta: 25,
        nextStage: 2,
        isComplete: false
      };
    } else {
      return {
        reply: "I see, but is the King size SmartGRID Ortho mattress in stock for immediate delivery?",
        hint: "Confirm stock availability for the King size Ortho mattress.",
        scoreDelta: 5,
        nextStage: 1,
        isComplete: false
      };
    }
  }

  if (stage === 2) {
    // Payment / EMI stage
    if ((lower.includes('emi') || lower.includes('bajaj') || lower.includes('finserv') || lower.includes('zero') || lower.includes('month') || lower.includes('warranty') || lower.includes('yes') || lower.includes('sure')) && !hasNegation) {
      return {
        reply: "Sounds very reasonable! Can you send the official quotation and payment link directly to my WhatsApp?",
        hint: "Confirm sending the official quotation and discount link to WhatsApp.",
        scoreDelta: 25,
        nextStage: 3,
        isComplete: false
      };
    } else {
      return {
        reply: "Could you clarify the payment options? Can I get 6-month zero-cost financing on Bajaj Finserv?",
        hint: "Explain the zero-cost EMI terms clearly to reassure the customer.",
        scoreDelta: 5,
        nextStage: 2,
        isComplete: false
      };
    }
  }

  if (stage >= 3) {
    // WhatsApp quote stage
    if ((lower.includes('send') || lower.includes('whatsapp') || lower.includes('link') || lower.includes('quote') || lower.includes('yes') || lower.includes('sure') || lower.includes('right away') || lower.includes('sharing')) && !hasNegation) {
      return {
        reply: "Perfect! Please send the link to this number and I will finalize my order today. Thank you Arvind!",
        hint: "🎉 Great job! Customer confirmed order. End call and mark lead as Recovered.",
        scoreDelta: 25,
        nextStage: 4,
        isComplete: true
      };
    } else {
      return {
        reply: "So are you able to send the quotation and payment link to my WhatsApp right now?",
        hint: "Confirm that you will send the link to their WhatsApp.",
        scoreDelta: 5,
        nextStage: 3,
        isComplete: false
      };
    }
  }

  // Fallback
  return {
    reply: "Thanks for the information Arvind. Could you share the official quotation and discount link on my WhatsApp?",
    hint: "Offer to send the quotation link on WhatsApp.",
    scoreDelta: 10,
    nextStage: 3,
    isComplete: false
  };
}

// Turn states for the call
const TURN = {
  CUSTOMER_SPEAKING: 'customer_speaking',
  AGENT_TURN: 'agent_turn',
  AGENT_RECORDING: 'agent_recording',
  PROCESSING: 'processing'
};

// Interactive CallModal — Click-to-Speak / Hold-to-Talk with live transcription & quick pitches
export default function CallModal({ callState, onHangup }) {
  const [seconds, setSeconds] = useState(0);
  const [turn, setTurn] = useState(TURN.CUSTOMER_SPEAKING);
  const [userTranscript, setUserTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [responseStep, setResponseStep] = useState(0);
  const [manualInput, setManualInput] = useState('');
  const [currentHint, setCurrentHint] = useState('Listen to the customer, then respond');
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callScore, setCallScore] = useState(0);
  const [micError, setMicError] = useState(null);

  const recognitionRef = useRef(null);
  const transcriptRef = useRef(null);
  const liveTranscriptRef = useRef('');
  const isRecordingRef = useRef(false);
  const isHoldingRef = useRef(false);
  const holdTimeoutRef = useRef(null);

  // Quick pitch responses for the agent dynamically personalized to contact name
  const customerName = callState.contactName || 'Mukunda';
  const quickPitches = [
    `Hello ${customerName}! This is Arvind calling from The Sleep Company Indiranagar store.`,
    `Yes ${customerName}, the SmartGRID Ortho King Size mattress and pillows are in stock today.`,
    `We have our 6-month zero-cost EMI on Bajaj Finserv available today with our 10-year warranty.`,
    `I'll send the official quotation and 25% discount link directly to your WhatsApp right away.`
  ];

  // Auto-scroll transcript container
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [conversationHistory, userTranscript, turn]);

  // Call duration timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initial Customer Greeting on mount
  useEffect(() => {
    const custName = callState.contactName || 'Mukunda';
    const customerGreeting = `Hello? This is ${custName} speaking. Who is this?`;

    setConversationHistory([
      { speaker: custName, text: customerGreeting, isCustomer: true, timestamp: new Date() }
    ]);
    setCurrentHint('Introduce yourself as Arvind from The Sleep Company');

    if (!isSpeakerMuted) {
      speakVoice(customerGreeting, () => {
        setTurn(TURN.AGENT_TURN);
      });
    } else {
      setTimeout(() => setTurn(TURN.AGENT_TURN), 1200);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
    };
  }, [callState.contactName]);

  // Start Voice Recording (Supports seamless single click toggle and hold-to-talk)
  const startRecording = useCallback(async () => {
    if (turn !== TURN.AGENT_TURN && turn !== TURN.AGENT_RECORDING) return;
    if (isRecordingRef.current) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicError('Speech recognition is not supported in this browser. Please use Quick Pitches or type your message below.');
      return;
    }

    // Proactively verify browser mic permission via getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.warn('Microphone permission request error:', err);
        setMicError('Microphone blocked. Please click the camera/mic icon in your browser address bar to allow microphone access, or use Quick Pitches below.');
        return;
      }
    }

    setMicError(null);
    liveTranscriptRef.current = '';
    setUserTranscript('');
    isRecordingRef.current = true;
    setTurn(TURN.AGENT_RECORDING);

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event) => {
        let fullSpeech = '';
        for (let i = 0; i < event.results.length; i++) {
          fullSpeech += event.results[i][0].transcript;
        }
        liveTranscriptRef.current = fullSpeech;
        setUserTranscript(fullSpeech);
      };

      recognition.onerror = (e) => {
        console.warn('SpeechRecognition error:', e.error);
        if (e.error === 'not-allowed') {
          setMicError('Microphone permission blocked. Please allow mic in browser settings, or click any Quick Pitch below.');
          isRecordingRef.current = false;
          setTurn(TURN.AGENT_TURN);
        } else if (e.error === 'audio-capture') {
          setMicError('No microphone detected. Please connect a mic or use Quick Pitches below.');
          isRecordingRef.current = false;
          setTurn(TURN.AGENT_TURN);
        }
      };

      recognition.onend = () => {
        if (isRecordingRef.current && turn === TURN.AGENT_RECORDING) {
          const text = (liveTranscriptRef.current || '').trim();
          if (text.length > 1) {
            isRecordingRef.current = false;
            handleAgentSpeech(text);
          }
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Failed to start recognition:', err);
      isRecordingRef.current = false;
      setTurn(TURN.AGENT_TURN);
    }
  }, [turn]);

  // Stop Recording and Dispatch Speech
  const stopRecordingAndSend = useCallback(() => {
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    setTimeout(() => {
      const textToSend = (liveTranscriptRef.current || userTranscript || '').trim();
      if (textToSend.length > 1) {
        handleAgentSpeech(textToSend);
      } else {
        setTurn(TURN.AGENT_TURN);
        setMicError('No speech detected. Please speak clearly into your mic or click a Quick Pitch below.');
      }
    }, 200);
  }, [turn, userTranscript]);

  // Unified Toggle / Click to Speak handler with hold-to-talk isolation
  const handleMouseDown = () => {
    isHoldingRef.current = false;
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    // If user holds down for more than 280ms, activate hold-to-talk mode
    holdTimeoutRef.current = setTimeout(() => {
      isHoldingRef.current = true;
      if (!isRecordingRef.current) {
        startRecording();
      }
    }, 280);
  };

  const handleMouseUp = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (isHoldingRef.current) {
      stopRecordingAndSend();
    }
  };

  const handleButtonClick = () => {
    // If the click is the end of a hold gesture, do not toggle
    if (isHoldingRef.current) {
      isHoldingRef.current = false;
      return;
    }

    if (turn !== TURN.AGENT_TURN && turn !== TURN.AGENT_RECORDING) return;

    // Normal Click: Clean toggle
    if (isRecordingRef.current || turn === TURN.AGENT_RECORDING) {
      stopRecordingAndSend();
    } else {
      startRecording();
    }
  };

  // Dispatches Agent speech (from Voice, Quick Pitch, or Typed input)
  const handleAgentSpeech = (agentText) => {
    if (!agentText || agentText.trim().length === 0) return;

    // Reset recording state
    isRecordingRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }

    setTurn(TURN.PROCESSING);
    setUserTranscript('');
    setManualInput('');
    setMicError(null);

    // Append agent message to conversation
    setConversationHistory(prev => [...prev, {
      speaker: 'You (Agent Arvind)',
      text: agentText,
      isCustomer: false,
      timestamp: new Date()
    }]);

    // Evaluate customer response dynamically based on agent input and context
    const evalResult = evaluateCustomerResponse(agentText, responseStep, callScore);

    // Update call score dynamically based on quality and sentiment of agent speech
    if (evalResult.scoreDelta !== 0) {
      setCallScore(prev => Math.max(0, Math.min(prev + evalResult.scoreDelta, 100)));
    }

    // Advance or hold conversational stage based on response validity
    setResponseStep(evalResult.nextStage);

    // Natural customer conversational delay (Snappy 750ms)
    setTimeout(() => {
      const customerName = callState.contactName || 'Mukunda';
      const reply = evalResult.reply;
      const hint = evalResult.hint;

      setConversationHistory(prev => [...prev, {
        speaker: customerName,
        text: reply,
        isCustomer: true,
        timestamp: new Date()
      }]);

      setCurrentHint(hint);
      setTurn(TURN.CUSTOMER_SPEAKING);

      if (!isSpeakerMuted) {
        speakVoice(reply, () => {
          if (evalResult.isComplete) {
            setCurrentHint('🎉 Call complete! Customer confirmed order. Ready to close.');
            setCallScore(100);
          }
          setTurn(TURN.AGENT_TURN);
        });
      } else {
        setTimeout(() => {
          if (evalResult.isComplete) {
            setCurrentHint('🎉 Call complete! Customer confirmed order. Ready to close.');
            setCallScore(100);
          }
          setTurn(TURN.AGENT_TURN);
        }, 1200);
      }
    }, 750);
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleHangup = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    onHangup();
  };

  const isAgentTurn = turn === TURN.AGENT_TURN;
  const isRecording = turn === TURN.AGENT_RECORDING;

  // Banner status
  const getTurnStatus = () => {
    switch (turn) {
      case TURN.CUSTOMER_SPEAKING:
        return { text: '🗣️ Customer is speaking...', color: '#38bdf8', bg: '#082f49' };
      case TURN.AGENT_TURN:
        return { text: '🎤 YOUR TURN — Click to speak, hold to talk, or use Quick Pitches', color: '#34d399', bg: '#064e3b' };
      case TURN.AGENT_RECORDING:
        return { text: '🔴 LISTENING... Speak now (Click button or hit Send when done)', color: '#ef4444', bg: '#450a0a' };
      case TURN.PROCESSING:
        return { text: '⏳ Customer is listening...', color: '#f59e0b', bg: '#451a03' };
      default:
        return { text: 'In call', color: '#94a3b8', bg: '#1e293b' };
    }
  };

  const turnStatus = getTurnStatus();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 60,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#0a1714',
        border: '1px solid #14382e',
        borderRadius: '16px',
        padding: '20px',
        width: '100%',
        maxWidth: '560px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        maxHeight: '92vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: '#38bdf8',
              backgroundColor: '#0c2838',
              padding: '3px 8px',
              borderRadius: '10px',
              border: '1px solid #154e6b'
            }}>
              Practice Call · Live Voice Roleplay
            </span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginTop: '6px' }}>
              Calling {callState.contactName || 'Mukunda'}
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
              Store Walkout Recovery · The Sleep Company Indiranagar
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>
              {formatTime(seconds)}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              Score: <span style={{ color: callScore >= 75 ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{callScore}%</span>
            </div>
          </div>
        </div>

        {/* Turn Status Banner */}
        <div style={{
          backgroundColor: turnStatus.bg,
          border: `1px solid ${turnStatus.color}40`,
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '8px',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: turnStatus.color,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            {turnStatus.text}
          </span>
        </div>

        {/* Dynamic Agent Hint */}
        <div style={{
          backgroundColor: '#0b1a15',
          border: '1px dashed #14382e',
          borderRadius: '6px',
          padding: '6px 10px',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Sparkles size={13} style={{ color: '#34d399', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
            <strong style={{ color: '#34d399' }}>Goal:</strong> {currentHint}
          </span>
        </div>

        {/* Mic Error Notice if permission denied */}
        {micError && (
          <div style={{
            backgroundColor: '#451a03',
            border: '1px solid #d97706',
            borderRadius: '6px',
            padding: '6px 10px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertCircle size={14} style={{ color: '#fbbf24', flexShrink: 0 }} />
            <span style={{ fontSize: '11px', color: '#fef3c7' }}>{micError}</span>
          </div>
        )}

        {/* Live Conversation Transcript Feed */}
        <div
          ref={transcriptRef}
          style={{
            backgroundColor: '#06100c',
            border: '1px solid #14382e',
            borderRadius: '12px',
            padding: '12px',
            height: '160px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginBottom: '10px'
          }}
        >
          {conversationHistory.map((item, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: item.isCustomer ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                backgroundColor: item.isCustomer ? '#0f241d' : '#14382e',
                border: `1px solid ${item.isCustomer ? '#174033' : '#1e5243'}`,
                borderRadius: '10px',
                padding: '7px 11px'
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 700, color: item.isCustomer ? '#38bdf8' : '#34d399', display: 'block', marginBottom: '2px' }}>
                {item.isCustomer ? `🗣️ ${item.speaker} (Customer)` : `🎧 ${item.speaker}`}
              </span>
              <p style={{ fontSize: '0.85rem', color: '#f8fafc', lineHeight: 1.35, margin: 0 }}>
                {item.text}
              </p>
            </div>
          ))}

          {/* Real-time speech transcription preview while microphone is open */}
          {isRecording && (
            <div style={{
              alignSelf: 'flex-end',
              maxWidth: '85%',
              backgroundColor: '#2b0b0b',
              border: '1px dashed #ef4444',
              borderRadius: '10px',
              padding: '7px 11px',
              animation: 'pulse 1.5s infinite'
            }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#fca5a5', display: 'block', marginBottom: '2px' }}>
                🔴 Listening to your voice...
              </span>
              <p style={{ fontSize: '0.85rem', color: '#ffffff', margin: 0, fontStyle: userTranscript ? 'normal' : 'italic' }}>
                {userTranscript || 'Speak into your microphone now...'}
              </p>
            </div>
          )}
        </div>

        {/* Main Microphone Button: Dual Click-to-Speak + Hold-to-Talk */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <button
            onClick={handleButtonClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            disabled={!isAgentTurn && !isRecording}
            style={{
              flex: 1,
              backgroundColor: isRecording ? '#dc2626' : isAgentTurn ? '#10b981' : '#1e293b',
              color: isRecording ? '#ffffff' : isAgentTurn ? '#022c22' : '#64748b',
              border: isRecording ? '2px solid #ef4444' : isAgentTurn ? '2px solid #34d399' : '2px solid #334155',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: isAgentTurn || isRecording ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.15s ease',
              userSelect: 'none',
              boxShadow: isRecording ? '0 0 20px rgba(239, 68, 68, 0.6)' : isAgentTurn ? '0 0 15px rgba(16, 185, 129, 0.3)' : 'none'
            }}
          >
            {isRecording ? (
              <>
                <Mic size={18} />
                <span>🔴 Recording... Click when Done to Send</span>
              </>
            ) : isAgentTurn ? (
              <>
                <Mic size={18} />
                <span>🎤 Click to Speak / Hold to Talk</span>
              </>
            ) : (
              <>
                <MicOff size={18} />
                <span>Wait for customer turn...</span>
              </>
            )}
          </button>

          {/* Quick Send Button if recording has captured speech */}
          {isRecording && (
            <button
              onClick={stopRecordingAndSend}
              style={{
                backgroundColor: '#10b981',
                color: '#022c22',
                border: 'none',
                borderRadius: '10px',
                padding: '0 18px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Send size={14} />
              <span>Send Now</span>
            </button>
          )}
        </div>

        {/* Quick Pitch Shortcuts — 1-Click Replies for Instant Flow */}
        <div style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
            ⚡ Quick Pitches (1-Click Instant Reply):
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {quickPitches.map((pitch, idx) => (
              <button
                key={idx}
                onClick={() => handleAgentSpeech(pitch)}
                disabled={!isAgentTurn}
                style={{
                  backgroundColor: '#0d2821',
                  border: '1px solid #14382e',
                  color: isAgentTurn ? '#34d399' : '#475569',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '10px',
                  cursor: isAgentTurn ? 'pointer' : 'not-allowed',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  opacity: !isAgentTurn ? 0.4 : (idx <= responseStep ? 1 : 0.7)
                }}
                onMouseEnter={(e) => { if (isAgentTurn) e.target.style.backgroundColor = '#14382e'; }}
                onMouseLeave={(e) => { if (isAgentTurn) e.target.style.backgroundColor = '#0d2821'; }}
              >
                {pitch}
              </button>
            ))}
          </div>
        </div>

        {/* Custom text input */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder={isAgentTurn ? "Type your response and hit Enter..." : "Wait for your turn..."}
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isAgentTurn && manualInput.trim()) {
                handleAgentSpeech(manualInput.trim());
              }
            }}
            disabled={!isAgentTurn}
            style={{
              flex: 1,
              backgroundColor: '#06100c',
              border: `1px solid ${isAgentTurn ? '#14382e' : '#0f1f1a'}`,
              borderRadius: '8px',
              padding: '8px 12px',
              color: isAgentTurn ? '#f8fafc' : '#475569',
              fontSize: '12px',
              outline: 'none',
              opacity: isAgentTurn ? 1 : 0.5
            }}
          />
          <button
            onClick={() => handleAgentSpeech(manualInput.trim())}
            disabled={!isAgentTurn || !manualInput.trim()}
            style={{
              backgroundColor: isAgentTurn && manualInput.trim() ? '#10b981' : '#1e293b',
              color: isAgentTurn && manualInput.trim() ? '#022c22' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: isAgentTurn && manualInput.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Send size={12} />
            <span>Send</span>
          </button>
        </div>

        {/* Footer Controls: Speaker Toggle + Hang Up */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
            style={{
              backgroundColor: isSpeakerMuted ? '#78350f' : '#142a24',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {isSpeakerMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <span>{isSpeakerMuted ? 'Muted' : 'Audio On'}</span>
          </button>

          <button
            onClick={handleHangup}
            style={{
              flex: 1,
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
            }}
          >
            <PhoneOff size={14} />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
}
