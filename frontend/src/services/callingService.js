const API_BASE = import.meta.env.VITE_API_URL || '';

// Export function to initiate a real Twilio phone call sequence
export async function triggerPhoneCall(targetPhoneNumber, leadContext = {}) {
  try {
    // Send POST request to backend /api/call endpoint
    const response = await fetch(`${API_BASE}/api/call`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: targetPhoneNumber,
        customerName: leadContext.customerName || leadContext.name,
        product: leadContext.product,
        store: leadContext.store
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error connecting to calling server',
    };
  }
}

// Export function to check backend connectivity
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    const data = await response.json();
    return data;
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
}
