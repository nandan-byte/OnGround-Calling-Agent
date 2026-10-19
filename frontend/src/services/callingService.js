// Export function to initiate a real Twilio phone call sequence
export async function triggerPhoneCall(targetPhoneNumber, leadContext = {}) {
  try {
    // Send POST request to the local backend /api/call endpoint
    const response = await fetch('/api/call', {
      // HTTP POST method
      method: 'POST',
      // Declare JSON content header
      headers: {
        'Content-Type': 'application/json',
      },
      // Pass the target phone number and full lead context in request body
      body: JSON.stringify({
        to: targetPhoneNumber,
        customerName: leadContext.customerName || leadContext.name,
        product: leadContext.product,
        store: leadContext.store
      }),
    });

    // Parse the JSON response from backend
    const data = await response.json();
    // Return the response data
    return data;
  } catch (error) {
    // Return structured failure response if network request fails
    return {
      success: false,
      error: error.message || 'Network error connecting to calling server',
    };
  }
}

// Export function to check backend connectivity
export async function checkBackendHealth() {
  try {
    // Fetch backend health status
    const response = await fetch('/api/health');
    // Parse response
    const data = await response.json();
    // Return backend status
    return data;
  } catch (error) {
    // Return offline state if backend is unreachable
    return { status: 'offline', error: error.message };
  }
}
