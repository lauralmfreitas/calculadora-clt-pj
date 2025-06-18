import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/calculadora-clt-pj/', // 👈 ESSA LINHA É FUNDAMENTAL PARA O GITHUB PAGES

  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

