import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false,
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    },
    proxy: {
      '/image': {
        target: 'https://cloudinary.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/image/, ''),
      },
      '/cdn': {
        target: 'https://unpkg.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, '')
      }
    }
  
  },
});
