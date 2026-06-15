import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'ncdpir-virtual-tour-360';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${repoName}/` : '/',
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
}));
