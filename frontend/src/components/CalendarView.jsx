// Import standard React hooks
import React, { useState } from 'react';
// Import icons from lucide-react library
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Info, CheckCircle2, PhoneCall } from 'lucide-react';
// Import mock calendar events
import { calendarEvents } from '../mockData';

// CalendarView component displaying the October 2026 shift schedule
export default function CalendarView({ onTriggerCall }) {
  // State for currently selected day in October
  const [selectedDay, setSelectedDay] = useState(19);
  // State for active month index (October is 9 in 0-indexed JS Date)
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  // Days of the week header labels
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in October 2026 (starts on Thursday = offset 4, total 31 days)
  const startDayOffset = 4;
  // Total days in October
  const totalDays = 31;

  // Generate calendar grid array
  const calendarCells = [];
  // Fill leading empty cells for offset
  for (let i = 0; i < startDayOffset; i++) {
    calendarCells.push(null);
  }
  // Fill actual October days
  for (let day = 1; day <= totalDays; day++) {
    calendarCells.push(day);
  }

  // Get events for currently selected day
  const activeDayEvents = calendarEvents[selectedDay] || [];

  return (
    // Calendar outer container
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Information Banner */}
      <div style={{
        backgroundColor: '#0a1714',
        border: '1px solid #142a24',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Info size={16} color="#34d399" />
        <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
          Your calendar automatically syncs scheduled callbacks, manager coaching sessions, and store sync meetings.
        </span>
      </div>

      {/* Main Grid and Schedule Split */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* Left: Month Calendar Grid */}
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '20px'
        }}>
          {/* Calendar Header with Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>{currentMonth}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Today Button */}
              <button
                onClick={() => setSelectedDay(19)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#0a1714',
                  color: '#34d399',
                  border: '1px solid #142a24',
                  padding: '4px 10px',
                  borderRadius: '4px'
                }}
              >
                Today
              </button>
              {/* Previous Month Arrow */}
              <button style={{ padding: '4px', color: '#94a3b8' }}>
                <ChevronLeft size={16} />
              </button>
              {/* Next Month Arrow */}
              <button style={{ padding: '4px', color: '#94a3b8' }}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            fontSize: '11px',
            color: '#64748b',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            {weekDays.map((wd) => (
              <div key={wd} style={{ padding: '6px 0' }}>{wd}</div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {calendarCells.map((dayNum, idx) => {
              // Empty filler cell
              if (!dayNum) {
                return <div key={`empty-${idx}`} style={{ height: '44px' }}></div>;
              }

              // Check if day has scheduled events
              const hasEvents = Boolean(calendarEvents[dayNum]);
              // Check if day is currently selected
              const isSelected = selectedDay === dayNum;
              // Check if day is today (Oct 19)
              const isToday = dayNum === 19;

              return (
                <div
                  key={`day-${dayNum}`}
                  onClick={() => setSelectedDay(dayNum)}
                  style={{
                    height: '44px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: isToday || isSelected ? 700 : 400,
                    backgroundColor: isSelected ? '#10b981' : isToday ? '#14382e' : 'transparent',
                    color: isSelected ? '#ffffff' : isToday ? '#34d399' : '#f1f5f9',
                    border: isToday && !isSelected ? '1px solid #10b981' : '1px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{dayNum}</span>
                  {/* Event indicator dot */}
                  {hasEvents && (
                    <span style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#ffffff' : '#f59e0b',
                      marginTop: '2px'
                    }}></span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Day Schedule Panel */}
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
              Schedule for October {selectedDay}, 2026
            </h3>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>
              {activeDayEvents.length} scheduled item{activeDayEvents.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Events list for the active day */}
          {activeDayEvents.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {activeDayEvents.map((evt, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#0a1714',
                    border: '1px solid #142a24',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '12px', color: '#f8fafc' }}>{evt.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Clock size={11} />
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  {/* Action tag or quick call button */}
                  {evt.type === 'call' && (
                    <button
                      onClick={() => onTriggerCall('+919113027924', evt.title)}
                      style={{
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <PhoneCall size={11} />
                      <span>Call</span>
                    </button>
                  )}
                  {evt.type !== 'call' && (
                    <span style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: evt.type === 'urgent' ? '#3b1212' : '#14382e',
                      color: evt.type === 'urgent' ? '#f87171' : '#34d399',
                      fontWeight: 600
                    }}>
                      {evt.type}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b', fontSize: '12px' }}>
              No scheduled events for this date.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
