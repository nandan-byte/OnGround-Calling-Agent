// Import standard React hooks
import React from 'react';
// Import Recharts components for data visualization
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
// Import icons from lucide-react library
import { PhoneCall, Users, Clock, TrendingUp, CheckCircle, Flame, ArrowUpRight, ShieldCheck, DollarSign } from 'lucide-react';
// Import mock data constants
import { agentProfile, whoIsWaiting, initialTasks, weeklyCallData } from '../mockData';

// Dashboard component displaying KPIs, tasks, earnings, waiting queue, and 7-day charts
export default function Dashboard({ onOpenLeadModal, onTriggerCall }) {
  return (
    // Dashboard main container
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Greeting and Shift Banner */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Welcome Text */}
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
            Good morning, {agentProfile.name}
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {agentProfile.team} · Indiranagar & Koramangala Store Clusters
          </p>
        </div>

        {/* Quick Shift Target Summary Pill */}
        <div style={{
          backgroundColor: '#0a1714',
          border: '1px solid #142a24',
          borderRadius: '8px',
          padding: '8px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Shift Progress</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#34d399' }}>6 closed / 10 target</div>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#142a24' }}></div>
          <div>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>Calls Placed</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>18 / 25 calls</div>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {/* KPI 1: QA Score */}
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginBottom: '4px' }}>QA Evaluation Score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#34d399' }}>{agentProfile.qaScore}</div>
            <div style={{ fontSize: '11px', color: '#6ee7b7', marginTop: '2px' }}>+3.2% vs last week</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#14382e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#34d399" />
          </div>
        </div>

        {/* KPI 2: Average Handle Time */}
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginBottom: '4px' }}>Avg Handle Time</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>{agentProfile.avgHandleTime}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Target: &lt; 5m 00s</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#14382e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} color="#38bdf8" />
          </div>
        </div>

        {/* KPI 3: Conversion Rate */}
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginBottom: '4px' }}>Conversion %</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{agentProfile.conversionRate}</div>
            <div style={{ fontSize: '11px', color: '#fcd34d', marginTop: '2px' }}>High Intent leads</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#2d220b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} color="#f59e0b" />
          </div>
        </div>

        {/* KPI 4: In Queue */}
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, marginBottom: '4px' }}>Shoppers Waiting</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f87171' }}>{agentProfile.inQueue}</div>
            <div style={{ fontSize: '11px', color: '#fca5a5', marginTop: '2px' }}>Requires immediate callback</div>
          </div>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#3b1212', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} color="#f87171" />
          </div>
        </div>
      </div>

      {/* Middle Section: Progress, Earnings & Who is Waiting */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {/* Earnings Card */}
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '18px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>My earnings this month</span>
            <span style={{
              fontSize: '11px',
              color: '#34d399',
              backgroundColor: '#0d2821',
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid #14382e'
            }}>
              On Track
            </span>
          </div>
          {/* Earnings Amount */}
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981', marginBottom: '8px' }}>
            ₹{agentProfile.monthlyEarnings.toLocaleString()}
          </div>
          {/* Progress bar towards target */}
          <div style={{ width: '100%', height: '8px', backgroundColor: '#142a24', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
            <div style={{
              width: `${(agentProfile.monthlyEarnings / agentProfile.earningsTarget) * 100}%`,
              height: '100%',
              backgroundColor: '#10b981',
              borderRadius: '4px'
            }}></div>
          </div>
          {/* Earnings target details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
            <span>Target: ₹{agentProfile.earningsTarget.toLocaleString()}</span>
            <span>65% achieved</span>
          </div>
        </div>

        {/* Who is Waiting Queue */}
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '18px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>Who is waiting (Floor Walk-outs)</span>
            <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 600 }}>2 Shoppers</span>
          </div>
          {/* List of waiting shoppers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {whoIsWaiting.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  backgroundColor: '#0a1714',
                  borderRadius: '6px',
                  border: '1px solid #142a24'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '12px', color: '#f8fafc' }}>{item.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{item.product} · <span style={{ color: '#f59e0b' }}>{item.waitTime}</span></div>
                </div>
                {/* Instant Call Button passing shopper product and store context */}
                <button
                  onClick={() => onTriggerCall(item.phone, item.name, {
                    product: item.product,
                    store: 'Store floor walk-out'
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
                  <span>Call</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* My Tasks Section */}
      <div style={{
        backgroundColor: '#0f1c18',
        border: '1px solid #19332c',
        borderRadius: '10px',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>My tasks today</h2>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>2 callbacks · 2 hot leads · 1 outcome logging</p>
          </div>
          <span style={{ fontSize: '11px', color: '#34d399', backgroundColor: '#0d2821', padding: '3px 8px', borderRadius: '4px' }}>
            5 Pending
          </span>
        </div>

        {/* Task Cards Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {initialTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => {
                // If it is a hot lead or callback, open the Leads modal
                if (task.leadId) onOpenLeadModal(task.leadId);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                backgroundColor: '#0a1714',
                borderRadius: '8px',
                border: '1px solid #142a24',
                cursor: task.leadId ? 'pointer' : 'default',
                transition: 'border-color 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#10b981'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#142a24'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Priority Badge */}
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  backgroundColor: task.category === 'hot_lead' ? '#2d220b' : task.category === 'callback' ? '#3b1212' : '#14382e',
                  color: task.category === 'hot_lead' ? '#f59e0b' : task.category === 'callback' ? '#f87171' : '#34d399',
                  border: `1px solid ${task.category === 'hot_lead' ? '#78350f' : task.category === 'callback' ? '#7f1d1d' : '#065f46'}`
                }}>
                  {task.priority}
                </span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{task.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{task.due} · Value: {task.value}</div>
                </div>
              </div>

              {/* Action Prompt */}
              {task.leadId && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#34d399', fontWeight: 600 }}>
                  <span>Open Lead</span>
                  <ArrowUpRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two 7-Day Analytics Charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {/* Chart 1: Calls Handled - Last 7 Days (Bar Chart) */}
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>Calls handled - last 7 days</h3>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>Total calls vs connected calls</p>
          </div>
          {/* Recharts Bar Container */}
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#142a24" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#07120f', border: '1px solid #142a24', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="calls" fill="#10b981" radius={[4, 4, 0, 0]} name="Total Calls" />
                <Bar dataKey="connected" fill="#0284c7" radius={[4, 4, 0, 0]} name="Connected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: CSAT Trend - Last 7 Days (Line Chart) */}
        <div style={{
          backgroundColor: '#0f1c18',
          border: '1px solid #19332c',
          borderRadius: '10px',
          padding: '20px'
        }}>
          <div style={{ marginBottom: '14px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>CSAT trend - last 7 days</h3>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>Customer satisfaction score percentage</p>
          </div>
          {/* Recharts Line Container */}
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyCallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#142a24" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[80, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#07120f', border: '1px solid #142a24', borderRadius: '6px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="csat" stroke="#38bdf8" strokeWidth={2.5} dot={{ fill: '#38bdf8', r: 4 }} name="CSAT %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
