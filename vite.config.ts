import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const withAuthHeader = (proxyReq: any, header: string, value: string | undefined) => {
  if (value) {
    proxyReq.setHeader(header, value);
  } else {
    proxyReq.removeHeader?.(header);
  }
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/llm/anthropic': {
          target: 'https://api.anthropic.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/llm\/anthropic/, '/v1/messages'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              withAuthHeader(proxyReq, 'x-api-key', env.VITE_ANTHROPIC_API_KEY);
              proxyReq.setHeader('anthropic-version', '2023-06-01');
            });
          }
        },
        '/api/llm/openai': {
          target: 'https://api.openai.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/llm\/openai/, '/v1/chat/completions'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const token = env.VITE_OPENAI_API_KEY ? `Bearer ${env.VITE_OPENAI_API_KEY}` : undefined;
              withAuthHeader(proxyReq, 'Authorization', token);
            });
          }
        }
      }
    },
    define: {
      'process.env': {}
    }
  };
});
