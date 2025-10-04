import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,  // Exposes the server to the network
    allowedHosts: [
      'mediasync-production.up.railway.app', // Add the external host here
    ],
  },
});
