import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_TARGET = process.env.GFF_API_URL || 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: Number(process.env.PORT || 5173),
    strictPort: true,
    // Cloud Agent previews are served through generated hostnames.
    allowedHosts: true,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true
      }
    }
  }
});
