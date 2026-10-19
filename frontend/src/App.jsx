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
// Import CallModal overlay for In-App voice roleplay
import CallModal from './components/CallModal';
// Import PhoneCallModal overlay for real PSTN mobile phone calls
import PhoneCallModal from './components/PhoneCallModal';
// Import DemoStrip bottom floating toolbar
import DemoStrip from './components/DemoStrip';
// Import phone call API service
import { triggerPhoneCall } from './services/callingService';
// Import initial mock data
import { initialTasks, whoIsWaiting, mockLeads } from './mockData';

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

  // Dynamic reactive state for shift tasks, waiting queue, and KPIs
  const [tasks, setTasks] = useState(initialTasks);
  const [waitingQueue, setWaitingQueue] = useState(whoIsWaiting);
  const [callsPlacedCount, setCallsPlacedCount] = useState(18);
  const [leadsClosedToday, setLeadsClosedToday] = useState(6);
  const [leadsList, setLeadsList] = useState(mockLeads);

  // Helper to mark lead and task as completed dynamically on call action
  const markLeadAndTaskCompleted = (contactName, leadId) => {
    setCallsPlacedCount(c => c + 1);
    setLeadsClosedToday(c => Math.min(c + 1, 10));

    // Update tasks matching contact name or leadId
    setTasks(prev => prev.map(t => {
      const matchName = contactName && t.title.toLowerCase().includes(contactName.toLowerCase());
      const matchLead = leadId && t.leadId === leadId;
      if (matchName || matchLead) {
        return {
          ...t,
          completed: true,
          completedAt: 'Called just now',
          priority: 'Completed'
        };
      }
      return t;
    }));

    // Update waiting queue if matched
    setWaitingQueue(prev => prev.map(w => {
      if (contactName && w.name.toLowerCase().includes(contactName.toLowerCase())) {
        return { ...w, waitTime: 'Resolved just now', called: true };
      }
      return w;
    }));

    // Update leads list
    setLeadsList(prev => prev.map(l => {
      if ((contactName && l.name.toLowerCase().includes(contactName.toLowerCase())) || (leadId && l.id === leadId)) {
        return { ...l, status: 'Contacted', lastContacted: 'Just now' };
      }
      return l;
    }));
  };

  // Toggle task completion status directly from dashboard checkbox
  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextDone = !t.completed;
        if (nextDone) {
          setLeadsClosedToday(c => Math.min(c + 1, 10));
          setCallsPlacedCount(c => c + 1);
        } else {
          setLeadsClosedToday(c => Math.max(c - 1, 0));
        }
        return {
          ...t,
          completed: nextDone,
          completedAt: nextDone ? 'Completed just now' : null,
          priority: nextDone ? 'Completed' : (t.category === 'hot_lead' ? 'High Priority' : t.category === 'callback' ? 'Callback' : 'Pending Outcome')
        };
      }
      return t;
    }));
  };

  // Trigger outbound Twilio phone call with full lead context
  const handleTriggerPhoneCall = async (phoneNumber, contactName = 'Customer', leadContext = {}) => {
    // Immediately mark task and lead as contacted
    markLeadAndTaskCompleted(contactName, leadContext.leadId);

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
        callSid: result.callSid,
        status: `Ringing agent phone... ${contactName} dialogue ready on answer`
      } : null);
      showToast(`Call initiated for ${contactName} (SID: ${result.callSid ? result.callSid.slice(0, 8) : 'active'}...)`);
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
    // Immediately mark task and lead as contacted
    markLeadAndTaskCompleted(contactName, null);

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
              onTriggerInAppCall={handleTriggerInAppCall}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              waitingQueue={waitingQueue}
              callsPlacedCount={callsPlacedCount}
              leadsClosedToday={leadsClosedToday}
            />
          )}

          {currentTab === 'plan' && (
            <Plan
              subTab={planSubTab}
              setSubTab={setPlanSubTab}
              leads={leadsList}
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

      {/* In-App Browser Voice Roleplay Modal */}
      {activeCall && activeCall.mode === 'in-app' && (
        <CallModal
          callState={activeCall}
          onHangup={handleHangup}
        />
      )}

      {/* Real PSTN Mobile Phone Call Widget */}
      {activeCall && activeCall.mode === 'phone' && (
        <PhoneCallModal
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
