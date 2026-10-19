// Import standard React hooks
import React, { useState } from 'react';
// Import Sidebar component
import Sidebar from './components/Sidebar';
// Import TopBar component
import TopBar from './components/TopBar';
// Import Dashboard view
import Dashboard from './components/Dashboard';
// Import Plan view
import Plan from './components/Plan';
// Import Calendar view
import CalendarView from './components/CalendarView';
// Import Pulse view
import Pulse from './components/Pulse';
// Import LeadsModal component
import LeadsModal from './components/LeadsModal';
// Import CallModal overlay
import CallModal from './components/CallModal';
// Import DemoStrip bottom floating toolbar
import DemoStrip from './components/DemoStrip';
// Import phone call API service
import { triggerPhoneCall } from './services/callingService';

// Main Application Component
export default function App() {
  // Main view navigation tab ('dashboard' | 'plan' | 'calendar' | 'pulse')
  const [currentTab, setCurrentTab] = useState('dashboard');
  // Plan sub-tab ('calls-to-make' | 'incoming' | 'recent' | 'practice')
  const [planSubTab, setPlanSubTab] = useState('calls-to-make');
  // State for active Lead Modal (null or leadId string)
  const [activeLeadId, setActiveLeadId] = useState(null);
  // State for active call overlay (null or call object)
  const [activeCall, setActiveCall] = useState(null);
  // State for temporary toast notification message
  const [toastMessage, setToastMessage] = useState(null);
  // Mobile drawer open state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Trigger outbound Twilio phone call with full lead context
  const handleTriggerPhoneCall = async (phoneNumber, contactName = 'Customer', leadContext = {}) => {
    // Show calling modal immediately
    setActiveCall({
      mode: 'phone',
      contactName: contactName,
      phone: phoneNumber,
      status: `Calling for ${contactName}...`
    });

    // Make API request to calling-backend /api/call with customer context
    const result = await triggerPhoneCall(phoneNumber, {
      customerName: contactName,
      product: leadContext.product,
      store: leadContext.store
    });

    // If call dispatched successfully
    if (result.success) {
      setActiveCall((prev) => prev ? {
        ...prev,
        status: `Ringing agent phone... ${contactName} dialogue ready on answer`
      } : null);
      showToast(`Call initiated for ${contactName} (SID: ${result.callSid.slice(0, 8)}...)`);
    } else {
      setActiveCall((prev) => prev ? {
        ...prev,
        status: `Call error: ${result.error}`
      } : null);
      showToast(`Failed: ${result.error}`);
    }
  };

  // Trigger in-app WebRTC call
  const handleTriggerInAppCall = (contactName = 'Customer') => {
    // Open call modal with in-app WebRTC mode
    setActiveCall({
      mode: 'in-app',
      contactName: contactName,
      phone: 'WebRTC Room #callcentre',
      status: 'In-app audio room active'
    });
    showToast(`In-app call active with ${contactName}`);
  };

  // Show temporary toast notification
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Hang up active call
  const handleHangup = () => {
    setActiveCall(null);
    showToast('Call ended.');
  };

  return (
    // Outer layout container
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b1318' }}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setTab={setCurrentTab}
        planSubTab={planSubTab}
        setPlanSubTab={setPlanSubTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header Bar */}
        <TopBar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onTriggerCall={handleTriggerPhoneCall}
        />

        {/* View Switcher based on currentTab */}
        <main style={{ flex: 1, paddingBottom: '70px' }}>
          {currentTab === 'dashboard' && (
            <Dashboard
              onOpenLeadModal={(leadId) => setActiveLeadId(leadId)}
              onTriggerCall={handleTriggerPhoneCall}
            />
          )}

          {currentTab === 'plan' && (
            <Plan
              subTab={planSubTab}
              setSubTab={setPlanSubTab}
              onOpenLeadModal={(leadId) => setActiveLeadId(leadId)}
              onTriggerCall={handleTriggerPhoneCall}
            />
          )}

          {currentTab === 'calendar' && (
            <CalendarView
              onTriggerCall={handleTriggerPhoneCall}
            />
          )}

          {currentTab === 'pulse' && (
            <Pulse />
          )}
        </main>
      </div>

      {/* Leads Modal Popup */}
      {activeLeadId && (
        <LeadsModal
          leadId={activeLeadId}
          onClose={() => setActiveLeadId(null)}
          onTriggerCall={handleTriggerPhoneCall}
          onTriggerInAppCall={handleTriggerInAppCall}
        />
      )}

      {/* Live Call Control Overlay */}
      {activeCall && (
        <CallModal
          callState={activeCall}
          onHangup={handleHangup}
        />
      )}

      {/* Floating Demo Strip Toolbar */}
      <DemoStrip
        onTriggerInAppCall={handleTriggerInAppCall}
        onTriggerPhoneCall={handleTriggerPhoneCall}
      />

      {/* Temporary Toast Alert Message */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '68px',
          right: '24px',
          backgroundColor: '#0a1714',
          border: '1px solid #10b981',
          color: '#34d399',
          padding: '10px 16px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)',
          zIndex: 70
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}
