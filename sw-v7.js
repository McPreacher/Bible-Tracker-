
// sw-v7.js
const CACHE = 'bta-cache-v7';
const ASSETS = ['./','./index.html?v=7','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE) && caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request, { ignoreSearch: false }).then(r => r || fetch(event.request)));
});
