// Import standard React hooks
import React from 'react';
// Import icons from lucide-react library
import { Zap, PhoneCall } from 'lucide-react';

// DemoStrip component providing floating quick demo call buttons matching the PDF mock footer
export default function DemoStrip({ onTriggerInAppCall, onTriggerPhoneCall }) {
  return (
    // Fixed bottom floating demo strip pill
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#07120f',
      border: '1px solid #14382e',
      borderRadius: '30px',
      padding: '6px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
      zIndex: 35
    }}>
      {/* Demo Tool label */}
      <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
        Demo Mode
      </span>

      {/* In-app call trigger */}
      <button
        onClick={() => onTriggerInAppCall('Demo In-App Caller')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#38bdf8',
          backgroundColor: '#0c2838',
          padding: '5px 12px',
          borderRadius: '20px',
          border: '1px solid #154e6b'
        }}
      >
        <Zap size={12} />
        <span>In-app call</span>
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '14px', backgroundColor: '#142a24' }}></div>

      {/* Phone call trigger */}
      <button
        onClick={() => onTriggerPhoneCall('+919113027924', 'Verified Agent Phone')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          fontWeight: 600,
          color: '#34d399',
          backgroundColor: '#0d2821',
          padding: '5px 12px',
          borderRadius: '20px',
          border: '1px solid #14382e'
        }}
      >
        <PhoneCall size={12} />
        <span>Phone call</span>
      </button>
    </div>
  );
}
