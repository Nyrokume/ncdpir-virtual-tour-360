import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { markerEditorApiPlugin } from './vite.markerEditorPlugin.js';

const repoName = 'ncdpir-virtual-tour-360';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? `/${repoName}/` : '/',
  plugins: [react(), mode === 'development' ? markerEditorApiPlugin() : null].filter(
    Boolean
  ),
  server: {
    port: 3000,
    open: true,
  },
}));
