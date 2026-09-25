/**
 * Progressive Web App (PWA) Service Worker Registration
 * Registers the service-worker.js on HTTPS or localhost environments
 */

export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;

  if ('serviceWorker' in navigator) {
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
      window.location.hostname === '[::1]' ||
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    );

    const isSecure = window.location.protocol === 'https:' || isLocalhost;

    if (!isSecure) {
      console.info('[PWA] Service Worker registration skipped: insecure protocol');
      return;
    }

    window.addEventListener('load', () => {
      // Determine service worker path dynamically to support relative deployments
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js`.replace(/\/{2,}/g, '/');

      navigator.serviceWorker
        .register(swUrl, { scope: import.meta.env.BASE_URL || '/' })
        .then((registration) => {
          // Check for service worker updates
          registration.addEventListener('updatefound', () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;

            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available; inform user or update silently
                  console.info('[PWA] New content available; please refresh.');
                } else {
                  // Content is cached for offline use
                  console.info('[PWA] Content is cached for offline use.');
                }
              }
            });
          });
        })
        .catch((error) => {
          console.warn('[PWA] Service Worker registration failed:', error);
        });
    });
  }
}
