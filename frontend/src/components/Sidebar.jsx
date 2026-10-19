// Import standard React hooks
import React from 'react';
// Import icons from lucide-react library
import { LayoutDashboard, PhoneCall, Calendar as CalendarIcon, Activity, ChevronRight, Sparkles } from 'lucide-react';

// Sidebar component providing navigation across all screens
export default function Sidebar({ currentTab, setTab, planSubTab, setPlanSubTab, isMobileOpen, setIsMobileOpen }) {
  // Navigation item click handler that also handles mobile drawer closing
  const handleNav = (tabId) => {
    // Set the active tab in main state
    setTab(tabId);
    // Close mobile drawer on navigation
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  // Sub navigation click handler for Plan section
  const handlePlanSub = (subId, e) => {
    // Prevent event bubbling to parent item
    e.stopPropagation();
    // Switch main tab to plan
    setTab('plan');
    // Set active sub-tab
    setPlanSubTab(subId);
    // Close mobile drawer if open
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    // Outer sidebar navigation element with dark green background styling
    <aside style={{
      width: '240px',
      backgroundColor: '#0a1714',
      borderRight: '1px solid #142a24',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      flexShrink: 0,
    }}>
      {/* Sidebar header branding */}
      <div style={{
        padding: '18px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: '1px solid #142a24'
      }}>
        {/* On-Ground logo circular icon */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '16px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
        }}>
          OG
        </div>
        {/* Company and team name */}
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#f1f5f9', letterSpacing: '-0.2px' }}>On-Ground.ai</div>
          <div style={{ fontSize: '11px', color: '#6ee7b7' }}>Call Centre Portal</div>
        </div>
      </div>

      {/* Main navigation list */}
      <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {/* Dashboard Nav Button */}
        <button
          onClick={() => handleNav('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: currentTab === 'dashboard' ? 600 : 500,
            color: currentTab === 'dashboard' ? '#ffffff' : '#94a3b8',
            backgroundColor: currentTab === 'dashboard' ? '#14382e' : 'transparent',
            textAlign: 'left',
            width: '100%',
            transition: 'all 0.15s ease'
          }}
        >
          {/* Dashboard Icon */}
          <LayoutDashboard size={18} color={currentTab === 'dashboard' ? '#34d399' : '#94a3b8'} />
          <span>Dashboard</span>
        </button>

        {/* Plan Section with Expandable Sub-items */}
        <div>
          {/* Parent Plan Button */}
          <button
            onClick={() => handleNav('plan')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: currentTab === 'plan' ? 600 : 500,
              color: currentTab === 'plan' ? '#ffffff' : '#94a3b8',
              backgroundColor: currentTab === 'plan' ? '#14382e' : 'transparent',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Phone Call Icon */}
              <PhoneCall size={18} color={currentTab === 'plan' ? '#34d399' : '#94a3b8'} />
              <span>Plan</span>
            </div>
            {/* Small Chevron */}
            <ChevronRight size={14} style={{ transform: currentTab === 'plan' ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {/* Sub-items for Plan */}
          {currentTab === 'plan' && (
            <div style={{ margin: '4px 0 6px 32px', display: 'flex', flexDirection: 'column', gap: '2px', borderLeft: '1px solid #142a24', paddingLeft: '8px' }}>
              {/* Calls to make sub-item */}
              <button
                onClick={(e) => handlePlanSub('calls-to-make', e)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  textAlign: 'left',
                  color: planSubTab === 'calls-to-make' ? '#34d399' : '#94a3b8',
                  backgroundColor: planSubTab === 'calls-to-make' ? '#0d2821' : 'transparent',
                  fontWeight: planSubTab === 'calls-to-make' ? 600 : 400
                }}
              >
                Calls to make
              </button>
              {/* Incoming calls sub-item */}
              <button
                onClick={(e) => handlePlanSub('incoming', e)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  textAlign: 'left',
                  color: planSubTab === 'incoming' ? '#34d399' : '#94a3b8',
                  backgroundColor: planSubTab === 'incoming' ? '#0d2821' : 'transparent',
                  fontWeight: planSubTab === 'incoming' ? 600 : 400
                }}
              >
                Incoming
              </button>
              {/* Recent calls sub-item */}
              <button
                onClick={(e) => handlePlanSub('recent', e)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  textAlign: 'left',
                  color: planSubTab === 'recent' ? '#34d399' : '#94a3b8',
                  backgroundColor: planSubTab === 'recent' ? '#0d2821' : 'transparent',
                  fontWeight: planSubTab === 'recent' ? 600 : 400
                }}
              >
                Recent
              </button>
              {/* Practice a call bonus sub-item */}
              <button
                onClick={(e) => handlePlanSub('practice', e)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  textAlign: 'left',
                  color: planSubTab === 'practice' ? '#f59e0b' : '#94a3b8',
                  backgroundColor: planSubTab === 'practice' ? '#291e0a' : 'transparent',
                  fontWeight: planSubTab === 'practice' ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={12} color="#f59e0b" />
                <span>Practice a call</span>
              </button>
            </div>
          )}
        </div>

        {/* Calendar Nav Button */}
        <button
          onClick={() => handleNav('calendar')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: currentTab === 'calendar' ? 600 : 500,
            color: currentTab === 'calendar' ? '#ffffff' : '#94a3b8',
            backgroundColor: currentTab === 'calendar' ? '#14382e' : 'transparent',
            textAlign: 'left',
            width: '100%',
            transition: 'all 0.15s ease'
          }}
        >
          {/* Calendar Icon */}
          <CalendarIcon size={18} color={currentTab === 'calendar' ? '#34d399' : '#94a3b8'} />
          <span>Calendar</span>
        </button>

        {/* Pulse Nav Button */}
        <button
          onClick={() => handleNav('pulse')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: currentTab === 'pulse' ? 600 : 500,
            color: currentTab === 'pulse' ? '#ffffff' : '#94a3b8',
            backgroundColor: currentTab === 'pulse' ? '#14382e' : 'transparent',
            textAlign: 'left',
            width: '100%',
            transition: 'all 0.15s ease'
          }}
        >
          {/* Pulse Activity Icon */}
          <Activity size={18} color={currentTab === 'pulse' ? '#34d399' : '#94a3b8'} />
          <span>Pulse</span>
        </button>
      </nav>

      {/* Footer status card inside sidebar */}
      <div style={{
        padding: '14px',
        margin: '12px',
        backgroundColor: '#07120f',
        borderRadius: '8px',
        border: '1px solid #142a24'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          {/* Pulsing green status dot */}
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 6px #10b981'
          }}></span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#34d399' }}>LiveKit & Twilio Ready</span>
        </div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>Outbound voice engine active</div>
      </div>
    </aside>
  );
}
