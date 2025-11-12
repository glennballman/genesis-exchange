import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.', // Explicitly set the project root
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      // Point '@' to the project root for consistent imports
      '@': path.resolve(__dirname, './'),
    },
  },
});
