import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: process.env.VITE_BASE_PATH || process.env.BASE_PATH || './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'admin-route-fallback',
        closeBundle() {
          try {
            const distPath = path.resolve(__dirname, 'dist');
            const adminDir = path.join(distPath, 'admin');
            const srcIndex = path.join(distPath, 'index.html');
            if (fs.existsSync(srcIndex)) {
              if (!fs.existsSync(adminDir)) {
                fs.mkdirSync(adminDir, { recursive: true });
              }
              fs.copyFileSync(srcIndex, path.join(adminDir, 'index.html'));
              // GitHub Pages SPA fallback: 404.html serves the app on direct navigation/reloads
              fs.copyFileSync(srcIndex, path.join(distPath, '404.html'));
            }
          } catch (e) {
            console.error('Failed to create admin/index.html fallback:', e);
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
