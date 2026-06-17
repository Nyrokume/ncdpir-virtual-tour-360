import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { markerEditorApiPlugin } from './vite.markerEditorPlugin.js';

const repoName = 'ncdpir-virtual-tour-360';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${repoName}/` : '/',
  plugins: [react(), mode === 'development' ? markerEditorApiPlugin() : null].filter(
    Boolean
  ),
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('photo-sphere-viewer') || id.includes('@photo-sphere-viewer')) {
            return 'photo-sphere';
          }
          if (id.includes('lucide-react')) {
            return 'icons';
          }
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('react-router')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
}));
