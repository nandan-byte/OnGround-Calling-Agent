// Import standard React hooks
import React, { useState } from 'react';
// Import icons from lucide-react library
import { Bot, MessageSquare, ChevronLeft, Send, CheckCircle2, Clock, ThumbsUp, ArrowRight, Sparkles, AlertCircle, Heart } from 'lucide-react';
// Import mock data items
import { pulseChannels, pulseAgents, initialChannelMessages } from '../mockData';

// Pulse component for AI agents hub and interactive channel conversations
export default function Pulse() {
  // State for whether a specific channel is actively open
  const [activeChannelId, setActiveChannelId] = useState('callcentre-team');
  // State for list of messages in active channel
  const [messages, setMessages] = useState(initialChannelMessages);
  // State for typing in message input
  const [newMessageText, setNewMessageText] = useState('');
  // State for pinned "Needs your input" status
  const [inputCardStatus, setInputCardStatus] = useState(null);
  // State for reply text inside "Needs your input" card
  const [cardReplyText, setCardReplyText] = useState('');
  // State for kudos count
  const [kudosCount, setKudosCount] = useState(14);
  // State for bot brief modal/message
  const [botBriefMessage, setBotBriefMessage] = useState(null);

  // Handle sending a new message in the chat thread
  const handleSendMessage = (e) => {
    // Prevent default form reload
    e.preventDefault();
    // Validate text is not empty
    if (!newMessageText.trim()) return;

    // Create new message object
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: "Arvind Rajan",
      isAgent: true,
      time: "Just now",
      text: newMessageText.trim(),
    };

    // Append to message stream
    setMessages((prev) => [...prev, newMsg]);
    // Clear text input
    setNewMessageText('');
  };

  // Handle responding to the pinned "Needs your input" card
  const handleInputCardAction = (actionType) => {
    // Update card response state
    setInputCardStatus(actionType);
  };

  return (
    // Pulse outer container
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* If no channel is open, show Pulse Home */}
      {!activeChannelId ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header */}
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
              Pulse - The Sleep Company
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Real-time collaboration across AI agents, store managers, and call centre tele-callers
            </p>
          </div>

          {/* AvaniBot Hero Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #0f1c18 100%)',
            border: '1px solid #312e81',
            borderRadius: '12px',
            padding: '22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#4338ca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Bot size={26} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>AvaniBot 2.0</div>
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Autonomous Store Floor Intelligence & Objection Coaching</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setBotBriefMessage('Daily Brief: Indiranagar store captured 14 walk-outs yesterday. Primary objection was mattress firmness and 0% EMI. Focus on 100-night trial on calls today.')}
                style={{
                  backgroundColor: '#4338ca',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                Daily Brief
              </button>
              <button
                onClick={() => setBotBriefMessage('Ask AvaniBot: "What is our exchange policy on coir mattresses?" Answer: We provide up to ₹3,000 instant store credit for coir and spring mattresses.')}
                style={{
                  backgroundColor: '#0f1c18',
                  color: '#cbd5e1',
                  border: '1px solid #312e81',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                Ask a question
              </button>
            </div>
          </div>

          {/* AvaniBot Pop-up brief notice if triggered */}
          {botBriefMessage && (
            <div style={{
              backgroundColor: '#07120f',
              border: '1px solid #10b981',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '12px',
              color: '#34d399',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{botBriefMessage}</span>
              <button onClick={() => setBotBriefMessage(null)} style={{ color: '#94a3b8', fontSize: '11px', marginLeft: '12px' }}>Dismiss</button>
            </div>
          )}

          {/* Role and Task Agents Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {/* Left: Role Agents */}
            <div style={{
              backgroundColor: '#0f1c18',
              border: '1px solid #19332c',
              borderRadius: '10px',
              padding: '20px'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
                Role Agents
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {pulseAgents.roleAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => setActiveChannelId('callcentre-team')}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: '#0a1714',
                      border: '1px solid #142a24',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '12px', color: '#f8fafc' }}>{agent.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{agent.description}</div>
                    </div>
                    <span style={{
                      fontSize: '10px',
                      backgroundColor: '#14382e',
                      color: '#34d399',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {agent.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Task Agents & Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Task Agents with Progress */}
              <div style={{
                backgroundColor: '#0f1c18',
                border: '1px solid #19332c',
                borderRadius: '10px',
                padding: '20px'
              }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
                  Task Agents Progress
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pulseAgents.taskAgents.map((task) => (
                    <div key={task.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#f1f5f9', fontWeight: 500 }}>{task.name}</span>
                        <span style={{ color: '#34d399', fontWeight: 700 }}>{task.progress}%</span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ width: '100%', height: '6px', backgroundColor: '#142a24', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${task.progress}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channels List */}
              <div style={{
                backgroundColor: '#0f1c18',
                border: '1px solid #19332c',
                borderRadius: '10px',
                padding: '20px'
              }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
                  Channels
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {pulseChannels.map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChannelId(ch.id)}
                      style={{
                        padding: '10px 12px',
                        backgroundColor: '#0a1714',
                        border: '1px solid #142a24',
                        borderRadius: '6px',
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '12px', color: '#f8fafc' }}>#{ch.name}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{ch.description}</div>
                      </div>
                      <ArrowRight size={14} color="#64748b" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* CHANNEL VIEW: #callcentre-team */
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 140px)',
          overflow: 'hidden'
        }}>
          {/* Channel Header with Back Navigation */}
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid #142a24',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0a1714'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setActiveChannelId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#34d399',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                <ChevronLeft size={16} />
                <span>All Agents & Channels</span>
              </button>
              <span style={{ color: '#64748b' }}>|</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>#{activeChannelId}</span>
            </div>

            {/* Kudos Action */}
            <button
              onClick={() => setKudosCount(kudosCount + 1)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: '#0d2821',
                border: '1px solid #14382e',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#34d399',
                fontWeight: 600
              }}
            >
              <Heart size={13} color="#f43f5e" fill="#f43f5e" />
              <span>Give Kudos ({kudosCount})</span>
            </button>
          </div>

          {/* Pinned "Needs your input" Card */}
          <div style={{
            margin: '16px 20px 0 20px',
            backgroundColor: '#241a06',
            border: '1px solid #78350f',
            borderRadius: '8px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} color="#f59e0b" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fde68a' }}>
                  NEEDS YOUR INPUT: Confirm the 4:30pm callback
                </span>
              </div>
              {inputCardStatus && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: inputCardStatus === 'Confirmed' ? '#34d399' : '#f87171',
                  backgroundColor: '#0a1714',
                  padding: '2px 8px',
                  borderRadius: '4px'
                }}>
                  {inputCardStatus}
                </span>
              )}
            </div>

            <p style={{ fontSize: '12px', color: '#fef3c7' }}>
              Mukunda requested a follow-up call at 4:30 PM with the Bajaj Finserv zero-cost EMI terms. Please confirm you are taking this call or request a reschedule.
            </p>

            {/* Interactive Decision Buttons and Reply input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleInputCardAction('Confirmed')}
                style={{
                  backgroundColor: inputCardStatus === 'Confirmed' ? '#059669' : '#10b981',
                  color: '#ffffff',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                ✓ Confirmed
              </button>
              <button
                onClick={() => handleInputCardAction('Reschedule Requested')}
                style={{
                  backgroundColor: '#0a1714',
                  color: '#cbd5e1',
                  border: '1px solid #78350f',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600
                }}
              >
                Reschedule
              </button>
            </div>
          </div>

          {/* Chat Messages Stream */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.isAgent ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  alignSelf: msg.isAgent ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px', padding: '0 4px' }}>
                  {msg.sender} · {msg.time}
                </div>
                <div style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  lineHeight: '1.45',
                  backgroundColor: msg.isAgent ? '#14382e' : '#1e293b',
                  color: msg.isAgent ? '#ffffff' : '#f1f5f9',
                  border: `1px solid ${msg.isAgent ? '#10b981' : '#334155'}`,
                  whiteSpace: 'pre-line'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '14px 20px',
              borderTop: '1px solid #142a24',
              backgroundColor: '#0a1714',
              display: 'flex',
              gap: '10px'
            }}
          >
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Message #callcentre-team..."
              style={{
                flex: 1,
                padding: '10px 14px',
                backgroundColor: '#0f1c18',
                border: '1px solid #19332c',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '12px'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '0 16px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
