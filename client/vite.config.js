import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5174, // Port used by Vite server
    proxy: {
      '/api': {
        target: process.env.BACKEND_TARGET || 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
})
