import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function getBasePath(): string {
  let base = process.env.VITE_BASE_PATH || process.env.BASE_PATH || '';
  if (!base && process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
    if (repo && !repo.endsWith('.github.io')) {
      base = `/${repo}`;
    }
  }
  if (base) {
    if (!base.startsWith('/')) base = `/${base}`;
    if (!base.endsWith('/')) base = `${base}/`;
    return base;
  }
  return '/';
}

export default defineConfig(() => {
  return {
    base: getBasePath(),
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
              const indexContent = fs.readFileSync(srcIndex, 'utf-8');

              // Ensure admin/index.html works both with absolute and relative paths
              const adminContent = indexContent
                .replace(/(src|href)="(\.\/assets\/)/g, '$1="../assets/')
                .replace(/(src|href)='(\.\/assets\/)/g, "$1='../assets/");
              fs.writeFileSync(path.join(adminDir, 'index.html'), adminContent, 'utf-8');

              // GitHub Pages SPA fallback: 404.html redirects deep paths like /admin to /?/admin
              const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>AMAAS</title>
    <script type="text/javascript">
      // SPA redirect for GitHub Pages (https://github.com/rafgraph/spa-github-pages)
      var pathSegmentsToKeep = (window.location.hostname.endsWith('github.io') && window.location.pathname.split('/').filter(Boolean).length > 0) ? 1 : 0;
      var l = window.location;
      var repoBase = l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/');
      var routePath = l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~');
      var search = l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '';
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        repoBase + '/?/' + routePath + search + l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>`;
              fs.writeFileSync(path.join(distPath, '404.html'), notFoundHtml, 'utf-8');
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
