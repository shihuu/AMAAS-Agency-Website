/* AMAAS Progressive Web App Service Worker */
const CACHE_NAME = 'amaas-pwa-v1';

// Essential assets for offline app shell
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.png'
];

// URLs/APIs to exclude from caching
const EXCLUDED_HOSTS = [
  'supabase.co',
  'generativelanguage.googleapis.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[AMAAS SW] Non-fatal precache error:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Ignore non-http/https protocols (e.g. chrome-extension:)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Never cache dynamic API or external backend endpoints
  if (
    url.pathname.startsWith('/api/') ||
    EXCLUDED_HOSTS.some((host) => url.hostname.includes(host))
  ) {
    return;
  }

  // Handle SPA Navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // If offline, serve cached page or offline shell
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const shell = await caches.match('/index.html') || await caches.match('/');
          if (shell) {
            return shell;
          }
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>AMAAS — Offline</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="background:#050B14;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;"><div><h1 style="color:#38bdf8;">AMAAS</h1><p style="color:#94a3b8;">You are currently offline. Please reconnect to access real-time features.</p><button onclick="window.location.reload()" style="background:#38bdf8;color:#050B14;border:none;padding:10px 20px;border-radius:20px;font-weight:600;cursor:pointer;">Retry</button></div></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Static Assets Strategy (Stale-While-Revalidate with Cache Fallback)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Support manual skip-waiting on update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
