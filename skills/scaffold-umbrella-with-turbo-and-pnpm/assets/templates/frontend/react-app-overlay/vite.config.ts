import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4200,
    fs: { allow: ['../../../../'] },
    proxy: {
      '/api': {
        target: process.env.BFF_PROXY_TARGET || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['@umbrella/example-calculator-ui', '@umbrella/calculator-client'],
  },
});
