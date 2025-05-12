
// Service worker for PWA functionality
const CACHE_NAME = 'botnb-client-portal-v4'; // Incrémenté pour forcer un refresh du cache

// Only cache static assets that don't change with builds
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/favicon.ico',
  '/lovable-uploads/favicon-16.png',
  '/lovable-uploads/favicon-32.png',
  '/lovable-uploads/favicon-152.png',
  '/lovable-uploads/favicon-180.png',
  '/lovable-uploads/favicon-192.png',
  '/lovable-uploads/favicon-512.png'
];

// Install service worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch(error => {
          console.error('[Service Worker] Cache addAll error:', error);
          // Continue installing even if cache fails
          return Promise.resolve();
        });
      })
  );
  // Force activation without waiting for existing clients to close
  self.skipWaiting();
});

// Clean up old caches when a new service worker activates
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName)
                .catch(error => {
                  console.error(`[Service Worker] Failed to delete cache ${cacheName}:`, error);
                  return Promise.resolve();
                });
            }
            return Promise.resolve();
          })
        );
      })
      .catch(error => {
        console.error('[Service Worker] Cache cleanup error:', error);
        return Promise.resolve();
      })
  );
  
  event.waitUntil(self.clients.claim());
});

// CORRECTION: Stratégie "Network First" pour les assets JavaScript et CSS
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;
  
  try {
    const url = new URL(event.request.url);
    
    // Skip cross-origin requests
    if (url.origin !== self.location.origin) {
      return;
    }
    
    // CORRECTION: Passage à une stratégie "network first" pour tous les assets dynamiques
    if (url.pathname.startsWith('/assets/') || 
        url.pathname.match(/\.(js|css)$/) ||
        url.pathname.includes('index-')) {
      
      event.respondWith(
        fetch(event.request)
          .then(response => {
            // Mettre en cache seulement si la réponse est valide
            if (response && response.status === 200) {
              const clonedResponse = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, clonedResponse))
                .catch(err => console.error('[SW] Cache error:', err));
            }
            return response;
          })
          .catch(() => {
            // En cas d'échec du réseau, tenter de servir depuis le cache
            return caches.match(event.request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                // Si pas de cache, renvoyer une réponse d'erreur
                return new Response('Network error', { status: 503 });
              });
          })
      );
    } else if (STATIC_ASSETS.includes(url.pathname)) {
      // Pour les assets statiques connus, stratégie cache-first
      event.respondWith(
        caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(event.request)
              .then(response => {
                if (response && response.status === 200) {
                  const clonedResponse = response.clone();
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, clonedResponse));
                }
                return response;
              });
          })
      );
    } else {
      // Pour toutes les autres ressources, stratégie network-first
      event.respondWith(
        fetch(event.request)
          .catch(() => caches.match(event.request))
      );
    }
  } catch (err) {
    console.error('[SW] General fetch handler error:', err);
  }
});

// Handle service worker errors
self.addEventListener('error', (event) => {
  console.error('[Service Worker] Error:', event.message);
});

// Handle unhandled promises
self.addEventListener('unhandledrejection', (event) => {
  console.error('[Service Worker] Unhandled Promise Rejection:', event.reason);
});

// Add message handler to allow manual cache clearing
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'clearCache') {
    console.log('[Service Worker] Clearing cache by request');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});
