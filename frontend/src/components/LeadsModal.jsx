// Import standard React hooks
import React, { useState } from 'react';
// Import icons from lucide-react library
import { X, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, PhoneCall, Zap, ShieldCheck, Check, Clock, AlertTriangle } from 'lucide-react';
// Import mock leads data
import { mockLeads } from '../mockData';

// LeadsModal component showing the in-depth lead dossier with ICP breakdown and calling buttons
export default function LeadsModal({ leadId, onClose, onTriggerCall, onTriggerInAppCall }) {
  // Find initial lead index based on passed leadId
  const initialIndex = Math.max(0, mockLeads.findIndex((l) => l.id === leadId));
  // State for active lead index in the modal (0 to 4)
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  // State for collapsible sections
  const [openSection, setOpenSection] = useState({
    breakdown: true,
    howWeGotHere: true,
    signals: true,
  });

  // Current lead object
  const currentLead = mockLeads[currentIndex] || mockLeads[0];

  // Next lead handler
  const handleNext = () => {
    // Increment index if within bounds
    if (currentIndex < mockLeads.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Previous lead handler
  const handlePrev = () => {
    // Decrement index if within bounds
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Toggle section visibility
  const toggleSection = (key) => {
    // Invert boolean state for the section
    setOpenSection((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    // Modal backdrop overlay
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px'
    }}>
      {/* Modal Dialog Card */}
      <div style={{
        backgroundColor: '#0f1c18',
        border: '1px solid #19332c',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '540px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #142a24',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0a1714'
        }}>
          {/* Lead Paging indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
              Lead {currentIndex + 1} of {mockLeads.length}
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: '#2d220b',
              color: '#f59e0b',
              border: '1px solid #78350f'
            }}>
              {currentLead.status}
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              borderRadius: '6px',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Lead Name and Product Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>{currentLead.name}</h2>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                Interested in: <strong style={{ color: '#34d399' }}>{currentLead.product}</strong>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#10b981' }}>{currentLead.price}</div>
              <div style={{ fontSize: '11px', color: '#f87171' }}>{currentLead.timeLeft}</div>
            </div>
          </div>

          {/* Dual Score Bars: ICP Fit & Lead Intent */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            backgroundColor: '#0a1714',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #142a24'
          }}>
            {/* ICP Score */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>ICP Fit Score</span>
                <span style={{ color: '#34d399', fontWeight: 700 }}>{currentLead.icpScore}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#142a24', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${currentLead.icpScore}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '3px' }}></div>
              </div>
            </div>

            {/* Intent Score */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Lead Intent Score</span>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>{currentLead.intentScore}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#142a24', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${currentLead.intentScore}%`, height: '100%', backgroundColor: '#f59e0b', borderRadius: '3px' }}></div>
              </div>
            </div>
          </div>

          {/* Section 1: Collapsible ICP Fit Breakdown */}
          <div style={{ border: '1px solid #142a24', borderRadius: '8px', overflow: 'hidden' }}>
            <div
              onClick={() => toggleSection('breakdown')}
              style={{
                padding: '10px 14px',
                backgroundColor: '#0a1714',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>ICP Fit Breakdown</span>
              {openSection.breakdown ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
            </div>
            {openSection.breakdown && (
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#07120f' }}>
                {currentLead.icpBreakdown.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                    <Check size={13} color="#10b981" />
                    <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{item.label}:</span>
                    <span style={{ color: '#94a3b8' }}>{item.detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Collapsible How We Got Here */}
          <div style={{ border: '1px solid #142a24', borderRadius: '8px', overflow: 'hidden' }}>
            <div
              onClick={() => toggleSection('howWeGotHere')}
              style={{
                padding: '10px 14px',
                backgroundColor: '#0a1714',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>How We Got Here</span>
              {openSection.howWeGotHere ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
            </div>
            {openSection.howWeGotHere && (
              <div style={{ padding: '12px 14px', backgroundColor: '#07120f' }}>
                <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.45' }}>{currentLead.howWeGotHere}</p>
              </div>
            )}
          </div>

          {/* Section 3: Collapsible Where We Picked Up Signals */}
          <div style={{ border: '1px solid #142a24', borderRadius: '8px', overflow: 'hidden' }}>
            <div
              onClick={() => toggleSection('signals')}
              style={{
                padding: '10px 14px',
                backgroundColor: '#0a1714',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>Where We Picked Up Signals</span>
              {openSection.signals ? <ChevronUp size={14} color="#94a3b8" /> : <ChevronDown size={14} color="#94a3b8" />}
            </div>
            {openSection.signals && (
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#07120f' }}>
                {currentLead.buyingSignals.map((sig, idx) => (
                  <div key={idx} style={{ padding: '8px 10px', backgroundColor: '#0a1714', borderRadius: '6px', border: '1px solid #142a24' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', marginBottom: '2px' }}>
                      {idx + 1}. {sig.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1' }}>{sig.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cumulative Missed Footer Badge */}
          <div style={{
            padding: '10px 14px',
            backgroundColor: '#0a1714',
            borderRadius: '6px',
            border: '1px solid #142a24',
            fontSize: '11px',
            color: '#64748b',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Cumulative missed: <strong style={{ color: '#f87171' }}>{currentLead.cumulativeMissed}</strong></span>
            <span>Store: {currentLead.store}</span>
          </div>
        </div>

        {/* Modal Bottom Actions with Calling triggers and pagination */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid #142a24',
          backgroundColor: '#0a1714',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Paging controls */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #142a24',
                color: currentIndex === 0 ? '#475569' : '#cbd5e1',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ChevronLeft size={14} />
              <span>Prev</span>
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex === mockLeads.length - 1}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #142a24',
                color: currentIndex === mockLeads.length - 1 ? '#475569' : '#cbd5e1',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Calling Action Buttons: In-App Call & Phone Call */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* In-App Call Button */}
            <button
              onClick={() => onTriggerInAppCall(currentLead.name)}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Zap size={14} />
              <span>In-app call</span>
            </button>

            {/* Phone Call Button triggering real Twilio call with full lead context */}
            <button
              onClick={() => onTriggerCall(currentLead.phone, currentLead.name, {
                product: currentLead.product,
                store: currentLead.store
              })}
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
            >
              <PhoneCall size={14} />
              <span>Phone call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
