// Import standard React hooks
import React from 'react';
// Import icons from lucide-react library
import { Bell, Award, User, Menu, PhoneCall, ShieldCheck } from 'lucide-react';
// Import agent profile data
import { agentProfile } from '../mockData';

// TopBar component rendering the header navigation and agent status
export default function TopBar({ onOpenMobileMenu, onTriggerCall }) {
  return (
    // Top bar header wrapper with dark green border
    <header style={{
      height: '56px',
      backgroundColor: '#0a1714',
      borderBottom: '1px solid #142a24',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 30
    }}>
      {/* Left side brand and active store indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Mobile menu trigger button */}
        <button
          onClick={onOpenMobileMenu}
          style={{
            display: 'none',
            color: '#94a3b8',
            padding: '6px',
            borderRadius: '6px',
            border: '1px solid #142a24'
          }}
          className="mobile-menu-btn"
        >
          {/* Hamburger Menu Icon */}
          <Menu size={18} />
        </button>

        {/* Brand identity pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            color: '#34d399',
            backgroundColor: '#0d2821',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid #14382e'
          }}>
            Store AI
          </span>
          {/* Organization and department breadcrumb */}
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>
            {agentProfile.team}
          </span>
        </div>
      </div>

      {/* Right side agent status, QA score, notifications, and profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Agent live shift availability badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          backgroundColor: '#0d2821',
          border: '1px solid #14382e',
          borderRadius: '16px',
          fontSize: '11px',
          color: '#34d399',
          fontWeight: 600
        }}>
          {/* Active status pulse dot */}
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#10b981'
          }}></span>
          <span>{agentProfile.status}</span>
        </div>

        {/* QA Score badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          backgroundColor: '#1b2a26',
          border: '1px solid #233b35',
          borderRadius: '16px',
          fontSize: '11px',
          color: '#a7f3d0',
          fontWeight: 600
        }}>
          {/* Award QA Icon */}
          <ShieldCheck size={13} color="#34d399" />
          <span>QA {agentProfile.qaScore}</span>
        </div>

        {/* Notification Bell Icon */}
        <div style={{ position: 'relative', cursor: 'pointer', padding: '6px' }}>
          <Bell size={17} color="#94a3b8" />
          {/* Unread notification count indicator */}
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#ef4444'
          }}></span>
        </div>

        {/* Vertical divider */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#142a24' }}></div>

        {/* Agent Profile avatar and name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          {/* Agent avatar circle */}
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#1e3a33',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '12px',
            border: '1px solid #34d399'
          }}>
            AR
          </div>
          {/* Agent full name */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9' }}>{agentProfile.name}</span>
            <span style={{ fontSize: '10px', color: '#64748b' }}>Agent ID #1042</span>
          </div>
        </div>
      </div>
    </header>
  );
}
