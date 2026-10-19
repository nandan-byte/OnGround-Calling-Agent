// Import standard React hooks
import React, { useState, useEffect } from 'react';
// Import icons from lucide-react library
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, Shield, Radio, CheckCircle, Clock } from 'lucide-react';

// CallModal component displaying the live active call overlay for phone or in-app calling
export default function CallModal({ callState, onHangup }) {
  // Call elapsed seconds timer
  const [seconds, setSeconds] = useState(0);
  // Microphone muted state
  const [isMuted, setIsMuted] = useState(false);
  // Speaker muted state
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);

  // Set up second counter effect during active call
  useEffect(() => {
    // Timer interval incrementing every second
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Format seconds to mm:ss
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    // Backdrop blur container
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 60,
      padding: '20px'
    }}>
      {/* Active Call Control Card */}
      <div style={{
        backgroundColor: '#0a1714',
        border: '1px solid #14382e',
        borderRadius: '16px',
        padding: '32px 28px',
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Call mode tag badge */}
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: callState.mode === 'phone' ? '#10b981' : '#38bdf8',
          backgroundColor: callState.mode === 'phone' ? '#0d2821' : '#0c2838',
          padding: '4px 10px',
          borderRadius: '12px',
          border: `1px solid ${callState.mode === 'phone' ? '#14382e' : '#154e6b'}`,
          marginBottom: '16px'
        }}>
          {callState.mode === 'phone' ? 'Twilio Voice Call' : 'In-App LiveKit Call'}
        </span>

        {/* Contact Name */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
          {callState.contactName || 'Customer'}
        </h2>
        {/* Contact Phone */}
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
          {callState.phone || '+91 9113027924'}
        </p>

        {/* Animated Sound Waveform Bars */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          height: '36px',
          marginBottom: '20px'
        }}>
          <span style={{ width: '4px', height: '14px', backgroundColor: '#10b981', borderRadius: '2px', animation: 'soundWave 1.2s infinite ease-in-out' }}></span>
          <span style={{ width: '4px', height: '24px', backgroundColor: '#10b981', borderRadius: '2px', animation: 'soundWave 0.9s infinite ease-in-out' }}></span>
          <span style={{ width: '4px', height: '32px', backgroundColor: '#34d399', borderRadius: '2px', animation: 'soundWave 1.5s infinite ease-in-out' }}></span>
          <span style={{ width: '4px', height: '20px', backgroundColor: '#10b981', borderRadius: '2px', animation: 'soundWave 1.1s infinite ease-in-out' }}></span>
          <span style={{ width: '4px', height: '28px', backgroundColor: '#34d399', borderRadius: '2px', animation: 'soundWave 0.8s infinite ease-in-out' }}></span>
          <span style={{ width: '4px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px', animation: 'soundWave 1.3s infinite ease-in-out' }}></span>
        </div>

        {/* Live Call Duration Timer */}
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace', marginBottom: '8px' }}>
          {formatTime(seconds)}
        </div>

        {/* Status Message */}
        <div style={{
          fontSize: '12px',
          color: callState.status === 'Calling...' ? '#f59e0b' : '#34d399',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Radio size={14} />
          <span>{callState.status || 'Active Connection'}</span>
        </div>

        {/* Audio Control Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: isMuted ? '#ef4444' : '#142a24',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: isSpeakerMuted ? '#ef4444' : '#142a24',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            {isSpeakerMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Hang Up End Call Button */}
        <button
          onClick={onHangup}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
          }}
        >
          <PhoneOff size={16} />
          <span>End Call</span>
        </button>
      </div>
    </div>
  );
}
