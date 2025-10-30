import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Proxy OpenAI requests during dev; inject server-side auth header
        '/api/openai': {
          target: 'https://api.openai.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/openai/, '/v1'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.VITE_OPENAI_API_KEY) {
                proxyReq.setHeader('authorization', `Bearer ${env.VITE_OPENAI_API_KEY}`);
              }
              proxyReq.setHeader('content-type', 'application/json');
            });
          },
        },
        // Proxy Anthropic requests during dev; inject server-side auth header
        '/api/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/anthropic/, '/v1'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.VITE_ANTHROPIC_API_KEY) {
                proxyReq.setHeader('x-api-key', env.VITE_ANTHROPIC_API_KEY);
              }
              proxyReq.setHeader('anthropic-version', '2023-06-01');
              proxyReq.setHeader('content-type', 'application/json');
            });
          },
        },
      },
    },
    define: {
      'process.env': {},
    },
  };
});
