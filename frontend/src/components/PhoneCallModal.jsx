import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Signal, CheckCircle2, Clock } from 'lucide-react';

export default function PhoneCallModal({ callState, onHangup }) {
  const [seconds, setSeconds] = useState(0);
  const [callStatus, setCallStatus] = useState(callState.status || 'Dialing phone network...');
  const [isCompleted, setIsCompleted] = useState(false);
  const [callDuration, setCallDuration] = useState(null);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll Twilio call status every 1.5 seconds so that when the phone hangs up, the UI automatically closes!
  useEffect(() => {
    const callSid = callState.callSid;
    if (!callSid) return;

    let isMounted = true;
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/call-status/${callSid}`);
        const data = await res.json();
        if (data.success && isMounted) {
          if (data.status === 'in-progress') {
            setCallStatus('Call connected · Active on your mobile phone');
          } else if (data.status === 'ringing') {
            setCallStatus('Ringing your mobile phone...');
          } else if (['completed', 'busy', 'no-answer', 'canceled', 'failed'].includes(data.status)) {
            setIsCompleted(true);
            setCallDuration(data.duration || seconds);
            setCallStatus(`Call ended (${data.status})`);
            clearInterval(pollInterval);
            // Auto close after 1.5 seconds
            setTimeout(() => {
              if (isMounted) onHangup();
            }, 1500);
          }
        }
      } catch (e) {
        // Ignore network polling glitches
      }
    }, 1500);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [callState.callSid, seconds, onHangup]);

  const handleRemoteHangup = async () => {
    if (callState.callSid) {
      try {
        await fetch('/api/call/hangup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callSid: callState.callSid })
        });
      } catch (e) {}
    }
    onHangup();
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(6px)',
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
        padding: '24px 28px',
        width: '100%',
        maxWidth: '460px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)',
        textAlign: 'center'
      }}>
        {/* Header Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'center', marginBottom: '14px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#34d399',
            backgroundColor: '#0d2821',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid #14382e',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <Signal size={12} />
            <span>Twilio Real Phone Call (PSTN)</span>
          </span>
        </div>

        {/* Contact Name & Phone */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', margin: '0 0 4px 0' }}>
          {callState.contactName || 'Customer'}
        </h2>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0 0 16px 0', fontFamily: 'monospace' }}>
          {callState.phone || 'Phone Network'}
        </p>

        {/* Call Status Card */}
        <div style={{
          backgroundColor: isCompleted ? '#064e3b' : '#071511',
          border: `1px solid ${isCompleted ? '#10b981' : '#14382e'}`,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: isCompleted ? '#34d399' : '#38bdf8',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '6px'
          }}>
            {isCompleted ? (
              <CheckCircle2 size={16} />
            ) : (
              <Phone size={16} style={{ animation: 'bounce 1s infinite' }} />
            )}
            <span>{callStatus}</span>
          </div>

          <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
            {isCompleted ? (
              `Duration: ${callDuration || seconds}s. Auto-closing window...`
            ) : (
              'Audio is routed through your physical telephone carrier network. Speak and listen via your mobile phone.'
            )}
          </p>

          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Clock size={13} style={{ color: '#94a3b8' }} />
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399', fontFamily: 'monospace' }}>
              {formatTime(seconds)}
            </span>
          </div>
        </div>

        {/* Hang Up Button */}
        <button
          onClick={handleRemoteHangup}
          style={{
            backgroundColor: '#dc2626',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '12px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
            transition: 'all 0.15s'
          }}
        >
          <PhoneOff size={16} />
          <span>Hang Up Phone Call</span>
        </button>
      </div>
    </div>
  );
}
