import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev only: proxies /api to the local backend. Production uses VITE_API_URL.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } },
});
