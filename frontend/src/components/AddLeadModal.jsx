import React, { useState } from 'react';
import { X, UserPlus, Phone, MapPin, Tag, DollarSign, Flame, Sparkles } from 'lucide-react';

export default function AddLeadModal({ isOpen, onClose, onAddLead }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [product, setProduct] = useState('SmartGRID Luxe Mattress');
  const [customProduct, setCustomProduct] = useState('');
  const [price, setPrice] = useState('₹24,999');
  const [store, setStore] = useState('Indiranagar Store, Bangalore');
  const [status, setStatus] = useState('Hot Lead');
  const [notes, setNotes] = useState('Walkout lead: tested mattresses for 15 minutes, asked for discount.');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalProduct = customProduct.trim() || product;
    const cleanPhone = phone.trim().startsWith('+') ? phone.trim() : `+${phone.trim()}`;

    const newLead = {
      id: `lead-${Date.now()}`,
      name: name.trim(),
      phone: cleanPhone,
      product: finalProduct,
      price: price.trim().startsWith('₹') ? price.trim() : `₹${price.trim()}`,
      status: status,
      timeLeft: 'Just added',
      icpScore: Math.floor(Math.random() * 15) + 82, // 82 - 96%
      intentScore: Math.floor(Math.random() * 12) + 86, // 86 - 98%
      store: store.trim(),
      lastVisited: 'Just now (Walkout)',
      icpBreakdown: [
        { label: 'Store Visit Alignment', detail: `Walkout at ${store}`, status: 'pass' },
        { label: 'Product Fit', detail: `Interested in ${finalProduct}`, status: 'pass' }
      ],
      howWeGotHere: notes.trim() || 'Shopper walked into the store and left without purchase. Needs fast callback.',
      buyingSignals: [
        { title: 'Immediate Opportunity', description: 'Fresh store walkout captured via portal.' }
      ],
      cumulativeMissed: '0 calls'
    };

    onAddLead(newLead);
    onClose();

    // Reset form
    setName('');
    setPhone('+91 ');
    setCustomProduct('');
    setNotes('');
  };

  return (
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
      zIndex: 60,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#0f1c18',
        border: '1px solid #19332c',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #142a24',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0a1714'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#14382e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#34d399'
            }}>
              <UserPlus size={18} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Add New Walkout Lead</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Create a callable customer lead instantly</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} style={{
          padding: '20px',
          overflowY: 'auto',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Customer Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mukund Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: '#0a1714',
                border: '1px solid #19332c',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Phone Number (for Twilio dialing) *
            </label>
            <input
              type="text"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: '#0a1714',
                border: '1px solid #19332c',
                borderRadius: '6px',
                color: '#34d399',
                fontWeight: 600,
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Product and Price Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Product / Item
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  backgroundColor: '#0a1714',
                  border: '1px solid #19332c',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="SmartGRID Luxe Mattress">SmartGRID Luxe Mattress</option>
                <option value="Ortho GRID Mattress (King Size)">Ortho GRID King Size</option>
                <option value="Elev8 Smart Recliner Bed">Elev8 Smart Recliner</option>
                <option value="Ergonomic Pro Chair">Ergonomic Pro Chair</option>
                <option value="Custom">Other / Real Estate / Custom...</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Estimated Value
              </label>
              <input
                type="text"
                placeholder="₹24,999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  backgroundColor: '#0a1714',
                  border: '1px solid #19332c',
                  borderRadius: '6px',
                  color: '#10b981',
                  fontWeight: 700,
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Custom Product Input if Custom selected */}
          {product === 'Custom' && (
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Specify Custom Item / Property
              </label>
              <input
                type="text"
                placeholder="e.g. 3BHK Whitefield Apartment or Custom Item"
                value={customProduct}
                onChange={(e) => setCustomProduct(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  backgroundColor: '#0a1714',
                  border: '1px solid #19332c',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Store Location & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Store / Area Location
              </label>
              <input
                type="text"
                placeholder="e.g. Indiranagar Store, Whitefield"
                value={store}
                onChange={(e) => setStore(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  backgroundColor: '#0a1714',
                  border: '1px solid #19332c',
                  borderRadius: '6px',
                  color: '#f8fafc',
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Lead Priority
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  backgroundColor: '#0a1714',
                  border: '1px solid #19332c',
                  borderRadius: '6px',
                  color: status === 'Hot Lead' ? '#f59e0b' : '#34d399',
                  fontWeight: 600,
                  fontSize: '12px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="Hot Lead">🔥 Hot Lead (Immediate)</option>
                <option value="Warm Lead">⚡ Warm Lead (2h left)</option>
                <option value="Urgent Callback">📞 Urgent Callback</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
              Notes / Walkout Context
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Tested mattress for 15 mins, asked for zero cost EMI"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: '#0a1714',
                border: '1px solid #19332c',
                borderRadius: '6px',
                color: '#f8fafc',
                fontSize: '12px',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '10px',
            paddingTop: '12px',
            borderTop: '1px solid #142a24'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                backgroundColor: '#0a1714',
                border: '1px solid #19332c',
                borderRadius: '6px',
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 18px',
                backgroundColor: '#10b981',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)'
              }}
            >
              <UserPlus size={14} />
              <span>Add to Queue</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
