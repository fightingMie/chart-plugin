import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    open: true
  },
  resolve: {
    alias: {
      'react-metric-chart-plugin': path.resolve(__dirname, '../../dist/index.esm.js')
    }
  },
  optimizeDeps: {
    exclude: ['react-metric-chart-plugin']
  }
});