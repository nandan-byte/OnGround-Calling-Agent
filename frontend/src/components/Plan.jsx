// Import standard React hooks
import React, { useState } from 'react';
// Import icons from lucide-react library
import { PhoneCall, PhoneIncoming, Clock, ChevronDown, ChevronUp, AlertCircle, Play, CheckCircle2, Sparkles, User, FileText, ArrowRight } from 'lucide-react';
// Import mock data lists
import { mockLeads, incomingCalls, recentCalls } from '../mockData';

// Plan component providing Calls to make, Incoming, Recent, and Practice a call tabs
export default function Plan({ subTab, setSubTab, onOpenLeadModal, onTriggerCall }) {
  // State for which row in "Calls to make" is expanded
  const [expandedRowId, setExpandedRowId] = useState('lead-1');
  // State for active page in "Calls to make"
  const [currentPage, setCurrentPage] = useState(1);
  // State for selected call review in "Recent" tab
  const [selectedReviewCall, setSelectedReviewCall] = useState(recentCalls[0]);
  // State for practice simulation
  const [practiceScenario, setPracticeScenario] = useState('price_objection');
  // State for practice feedback message
  const [practiceFeedback, setPracticeFeedback] = useState(null);

  // Calculate total value at stake from incoming missed calls
  const totalValueAtStake = incomingCalls.reduce((acc, curr) => acc + curr.expectedValue, 0);

  // Function to simulate practicing a call
  const handlePracticePitch = (responseType) => {
    // Provide instant feedback based on agent's selected response
    if (responseType === 'empathy') {
      setPracticeFeedback({
        score: '96%',
        comment: 'Excellent empathy! Acknowledging competitor mattress firmness while highlighting SmartGRID patented pressure relief increases conversion by 28%.',
        type: 'success'
      });
    } else {
      setPracticeFeedback({
        score: '84%',
        comment: 'Good factual explanation. Try leading with the 100-night risk-free trial before discussing discount matching.',
        type: 'info'
      });
    }
  };

  return (
    // Plan container with tab navigation and views
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Tab Navigation Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid #142a24',
        paddingBottom: '14px'
      }}>
        {/* Sub-tab pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Calls to make tab */}
          <button
            onClick={() => setSubTab('calls-to-make')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: subTab === 'calls-to-make' ? '#14382e' : '#0a1714',
              color: subTab === 'calls-to-make' ? '#34d399' : '#94a3b8',
              border: `1px solid ${subTab === 'calls-to-make' ? '#10b981' : '#142a24'}`
            }}
          >
            Calls to make ({mockLeads.length})
          </button>

          {/* Incoming missed calls tab */}
          <button
            onClick={() => setSubTab('incoming')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: subTab === 'incoming' ? '#14382e' : '#0a1714',
              color: subTab === 'incoming' ? '#34d399' : '#94a3b8',
              border: `1px solid ${subTab === 'incoming' ? '#10b981' : '#142a24'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Incoming</span>
            {/* Red badge for missed calls count */}
            <span style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '10px',
              fontWeight: 700
            }}>
              {incomingCalls.length}
            </span>
          </button>

          {/* Recent calls tab */}
          <button
            onClick={() => setSubTab('recent')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: subTab === 'recent' ? '#14382e' : '#0a1714',
              color: subTab === 'recent' ? '#34d399' : '#94a3b8',
              border: `1px solid ${subTab === 'recent' ? '#10b981' : '#142a24'}`
            }}
          >
            Recent Calls
          </button>

          {/* Practice a call bonus tab */}
          <button
            onClick={() => setSubTab('practice')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: subTab === 'practice' ? '#291e0a' : '#0a1714',
              color: subTab === 'practice' ? '#f59e0b' : '#94a3b8',
              border: `1px solid ${subTab === 'practice' ? '#d97706' : '#142a24'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} color="#f59e0b" />
            <span>Practice a Call</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: CALLS TO MAKE */}
      {subTab === 'calls-to-make' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Today's calling plan</h2>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Ranked by AI ICP fit & buying intent score</p>
            </div>
            {/* Pagination indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#94a3b8' }}>
              <span>Page {currentPage} of 2</span>
              <button
                onClick={() => setCurrentPage(currentPage === 1 ? 2 : 1)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#0a1714',
                  border: '1px solid #142a24',
                  borderRadius: '4px',
                  color: '#34d399',
                  fontSize: '11px'
                }}
              >
                {currentPage === 1 ? 'Next →' : '← Prev'}
              </button>
            </div>
          </div>

          {/* Table List of Outgoing Calls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {mockLeads.map((lead, idx) => {
              const isExpanded = expandedRowId === lead.id;
              return (
                <div
                  key={lead.id}
                  style={{
                    backgroundColor: '#0f1c18',
                    border: '1px solid #19332c',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Row Header */}
                  <div
                    onClick={() => setExpandedRowId(isExpanded ? null : lead.id)}
                    style={{
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderBottom: isExpanded ? '1px solid #142a24' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Priority Rank Indicator */}
                      <span style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#14382e',
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '11px'
                      }}>
                        #{idx + 1}
                      </span>
                      {/* Customer Name and Product */}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#f8fafc' }}>{lead.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{lead.product} · <strong style={{ color: '#10b981' }}>{lead.price}</strong></div>
                      </div>
                    </div>

                    {/* Scores and Call Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Intent Score Badge */}
                      <span style={{
                        backgroundColor: '#2d220b',
                        color: '#f59e0b',
                        border: '1px solid #78350f',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        Intent {lead.intentScore}%
                      </span>
                      {/* Time left */}
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{lead.timeLeft}</span>
                      {/* Call Trigger Button with full lead context */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTriggerCall(lead.phone, lead.name, {
                            product: lead.product,
                            store: lead.store
                          });
                        }}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <PhoneCall size={12} />
                        <span>Call</span>
                      </button>
                      {/* Expand Chevron */}
                      {isExpanded ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
                    </div>
                  </div>

                  {/* Expandable Details Drawer */}
                  {isExpanded && (
                    <div style={{ padding: '16px 18px', backgroundColor: '#07120f', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Store Visited</div>
                          <div style={{ fontSize: '12px', color: '#f1f5f9' }}>{lead.store} ({lead.lastVisited})</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Cumulative Missed</div>
                          <div style={{ fontSize: '12px', color: '#f87171' }}>{lead.cumulativeMissed}</div>
                        </div>
                      </div>

                      {/* How we got here summary */}
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>AI Lead Context</div>
                        <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>{lead.howWeGotHere}</p>
                      </div>

                      {/* Modal Open Link */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <button
                          onClick={() => onOpenLeadModal(lead.id)}
                          style={{
                            fontSize: '11px',
                            color: '#34d399',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>View Full ICP Fit & Buying Signals</span>
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: INCOMING MISSED CALLS */}
      {subTab === 'incoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Header Banner with Value at Stake */}
          <div style={{
            backgroundColor: '#0f1c18',
            border: '1px solid #19332c',
            borderRadius: '10px',
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Missed calls today</span>
                <span style={{
                  backgroundColor: '#3b1212',
                  color: '#f87171',
                  border: '1px solid #7f1d1d',
                  padding: '1px 8px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  {incomingCalls.length} Missed
                </span>
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>High-value store customers awaiting callback</p>
            </div>

            {/* Expected Value at Stake Badge */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Expected value at stake</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f59e0b' }}>
                ₹{totalValueAtStake.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Missed Calls Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {incomingCalls.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#0f1c18',
                  border: '1px solid #19332c',
                  borderRadius: '8px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Missed Call Red Icon */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#3b1212',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PhoneIncoming size={16} color="#f87171" />
                  </div>
                  {/* Caller Details */}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: '#f8fafc' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {item.product} · <span style={{ color: '#f87171' }}>{item.time}</span>
                    </div>
                  </div>
                </div>

                {/* Expected Value and Call back button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Value at Stake</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b' }}>₹{item.expectedValue.toLocaleString()}</div>
                  </div>

                  {/* Immediate Call back CTA with lead context */}
                  <button
                    onClick={() => onTriggerCall(item.phone, item.name, {
                      product: item.product,
                      store: 'Store floor walk-out'
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
                    <PhoneCall size={13} />
                    <span>Call back</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: RECENT CALLS & REVIEW PANEL */}
      {subTab === 'recent' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Left Column: Call Logs List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>Recent Calls Log</h3>
            {recentCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedReviewCall(call)}
                style={{
                  backgroundColor: selectedReviewCall?.id === call.id ? '#14382e' : '#0f1c18',
                  border: `1px solid ${selectedReviewCall?.id === call.id ? '#10b981' : '#19332c'}`,
                  borderRadius: '8px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '12px', color: '#f8fafc' }}>{call.name}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{call.duration}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
                  <span>{call.type} · {call.time}</span>
                  <span style={{ color: '#34d399' }}>{call.outcome}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Review Panel for selected call */}
          {selectedReviewCall && (
            <div style={{
              backgroundColor: '#0f1c18',
              border: '1px solid #19332c',
              borderRadius: '10px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #142a24', paddingBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Call Review: {selectedReviewCall.name}</h3>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{selectedReviewCall.time} · Length: {selectedReviewCall.duration}</div>
                </div>
                {/* Re-dial Button with lead context */}
                <button
                  onClick={() => onTriggerCall(selectedReviewCall.phone, selectedReviewCall.name, {
                    product: selectedReviewCall.name === 'Mukunda R.' ? 'Ortho GRID Mattress' : 'SmartGRID Mattress',
                    store: 'The Sleep Company Experience Centre'
                  })}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <PhoneCall size={12} />
                  <span>Call again</span>
                </button>
              </div>

              {/* Sentiment Score */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                <span style={{ color: '#94a3b8' }}>AI Sentiment:</span>
                <span style={{ fontWeight: 600, color: '#34d399', backgroundColor: '#0d2821', padding: '2px 8px', borderRadius: '4px' }}>
                  {selectedReviewCall.sentiment}
                </span>
              </div>

              {/* Key Summary */}
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Executive Summary</div>
                <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.45' }}>{selectedReviewCall.summary}</p>
              </div>

              {/* Transcript Snippet */}
              <div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>Dialogue Snippet</div>
                <div style={{
                  backgroundColor: '#07120f',
                  border: '1px solid #142a24',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  fontSize: '11px',
                  color: '#94a3b8',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.5'
                }}>
                  {selectedReviewCall.transcript}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 4: PRACTICE A CALL (BONUS) */}
      {subTab === 'practice' && (
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={16} color="#f59e0b" />
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Practice a Call (AI Pitch Coach)</h2>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              Simulate high-stakes objection handling with AvaniBot before speaking to real store walk-out leads.
            </p>
          </div>

          {/* Scenario selection */}
          <div style={{
            backgroundColor: '#0a1714',
            border: '1px solid #142a24',
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
              Scenario 1: Shopper compares pricing with Wakefit
            </div>
            <div style={{ fontSize: '13px', color: '#f1f5f9', fontStyle: 'italic', marginBottom: '14px' }}>
              "Customer says: 'I saw Wakefit memory foam for ₹6,999. Why should I pay ₹9,490 for your Ortho GRID mattress?'"
            </div>

            {/* Response options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => handlePracticePitch('empathy')}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  backgroundColor: '#0f1c18',
                  border: '1px solid #19332c',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#cbd5e1',
                  transition: 'border-color 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#19332c'; }}
              >
                <strong>Option A:</strong> "I completely understand! Memory foam traps heat and sinks over time. Our patented SmartGRID gives adaptive orthopedic support and stays 4° cooler, plus you get a 100-night trial."
              </button>

              <button
                onClick={() => handlePracticePitch('direct')}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  backgroundColor: '#0f1c18',
                  border: '1px solid #19332c',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#cbd5e1',
                  transition: 'border-color 0.15s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#19332c'; }}
              >
                <strong>Option B:</strong> "Our mattress comes with a 10-year warranty instead of 5, and we can offer you a 5% discount code if you order right now."
              </button>
            </div>
          </div>

          {/* AI Coaching Feedback Result */}
          {practiceFeedback && (
            <div style={{
              backgroundColor: '#07120f',
              border: `1px solid ${practiceFeedback.type === 'success' ? '#059669' : '#38bdf8'}`,
              borderRadius: '8px',
              padding: '14px 16px',
              display: 'flex',
              gap: '12px'
            }}>
              <CheckCircle2 size={20} color="#34d399" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                  AI Coach Score: <span style={{ color: '#34d399' }}>{practiceFeedback.score}</span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', lineHeight: '1.4' }}>
                  {practiceFeedback.comment}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
