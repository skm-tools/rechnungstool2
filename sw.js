/* Service Worker für die Rechnungsvorlage SKM
   Strategie: Offline-first. Beim Installieren werden alle Dateien
   zwischengespeichert; danach funktioniert die App komplett ohne Internet.
   WICHTIG: Bei jeder Änderung an index.html die CACHE_VERSION erhöhen,
   damit installierte Apps das Update erhalten. */

const CACHE_VERSION = 'rechnung-skm-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Nur GET-Anfragen behandeln
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      if (cached) {
        // Im Hintergrund aktualisieren (stale-while-revalidate)
        event.waitUntil(
          fetch(event.request).then((fresh) => {
            if (fresh && fresh.ok) {
              return caches.open(CACHE_VERSION).then((c) => c.put(event.request, fresh.clone()));
            }
          }).catch(() => {})
        );
        return cached;
      }
      return fetch(event.request).then((fresh) => {
        if (fresh && fresh.ok && new URL(event.request.url).origin === self.location.origin) {
          const clone = fresh.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(event.request, clone));
        }
        return fresh;
      }).catch(() => {
        // Offline & nicht im Cache → zur Startseite (Single-Page-App)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
