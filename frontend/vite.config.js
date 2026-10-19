// Import defineConfig from Vite configuration module
import { defineConfig } from 'vite';
// Import official React plugin for Vite
import react from '@vitejs/plugin-react';

// Export Vite configuration settings
export default defineConfig({
  // Register the React plugin
  plugins: [react()],
  // Configure development server options
  server: {
    // Port to run frontend development server
    port: 3000,
    // Enable proxy to route API calls directly to calling-backend
    proxy: {
      // Forward /api requests to local backend server on port 5000
      '/api': {
        // Target backend address
        target: 'http://localhost:5000',
        // Change origin of host header to target URL
        changeOrigin: true,
      },
    },
  },
});
