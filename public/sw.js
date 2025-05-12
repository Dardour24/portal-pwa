
// Service worker for PWA functionality
const CACHE_NAME = 'botnb-client-portal-v5'; // Version incrémentée pour forcer un refresh du cache

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

// Log function with prefix for easier debugging
const logSW = (message, data) => {
  const prefix = '[Service Worker]';
  if (data) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
};

// Install service worker
self.addEventListener('install', (event) => {
  logSW('Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        logSW('Caching static assets');
        return cache.addAll(STATIC_ASSETS)
          .then(() => logSW('Static assets cached successfully'))
          .catch(error => {
            console.error('[Service Worker] Cache addAll error:', error);
            // Continue installing even if cache fails
            return Promise.resolve();
          });
      })
      .catch(error => {
        console.error('[Service Worker] Installation error:', error);
        return Promise.resolve();
      })
  );
  // Force activation without waiting for existing clients to close
  self.skipWaiting();
  logSW('skipWaiting called to force activation');
});

// Clean up old caches when a new service worker activates
self.addEventListener('activate', (event) => {
  logSW('Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              logSW('Deleting old cache:', cacheName);
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
      .then(() => {
        logSW('All old caches cleared');
        return self.clients.claim();
      })
      .then(() => {
        logSW('Claimed clients');
      })
      .catch(error => {
        console.error('[Service Worker] Cache cleanup error:', error);
        return Promise.resolve();
      })
  );
});

// CORRECTION: Stratégie "Network First" pour tous les assets importants
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;
  
  try {
    const url = new URL(event.request.url);
    
    // Skip cross-origin requests
    if (url.origin !== self.location.origin) {
      return;
    }
    
    // CORRECTION: Stratégie purement "network first" pour tous les assets JavaScript et CSS
    if (url.pathname.startsWith('/assets/') || 
        url.pathname.match(/\.(js|css)$/) ||
        url.pathname.includes('index-')) {
      
      event.respondWith(
        fetch(event.request)
          .then(response => {
            logSW(`Network response for ${url.pathname}:`, response.status);
            
            // Mettre en cache seulement si la réponse est valide
            if (response && response.status === 200) {
              const clonedResponse = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, clonedResponse))
                .catch(err => console.error('[SW] Cache error:', err));
            }
            return response;
          })
          .catch(error => {
            logSW(`Network request failed for ${url.pathname}, falling back to cache`, error);
            
            // En cas d'échec du réseau, tenter de servir depuis le cache
            return caches.match(event.request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  logSW(`Serving from cache: ${url.pathname}`);
                  return cachedResponse;
                }
                
                // Si rien dans le cache non plus, renvoyer une page d'erreur claire
                logSW(`No cache found for ${url.pathname}, returning error response`);
                return new Response(
                  `<html>
                    <head><title>Network Error</title></head>
                    <body>
                      <h1>Network Error</h1>
                      <p>L'application ne peut pas se charger. Vérifiez votre connexion internet.</p>
                      <button onclick="window.location.reload()">Réessayer</button>
                      <button onclick="window.location.href='/?disable_sw=true'">Désactiver le service worker</button>
                    </body>
                  </html>`,
                  { 
                    status: 503,
                    headers: { 'Content-Type': 'text/html' }
                  }
                );
              });
          })
      );
    } else if (STATIC_ASSETS.includes(url.pathname)) {
      // Pour les assets statiques connus, stratégie cache-first
      logSW(`Cache-first request for static asset: ${url.pathname}`);
      event.respondWith(
        caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              logSW(`Serving static asset from cache: ${url.pathname}`);
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
      // Pour toutes les autres ressources, stratégie network-first simplifiée
      logSW(`Network-first request for: ${url.pathname}`);
      event.respondWith(
        fetch(event.request)
          .catch(() => {
            logSW(`Fetch failed for ${url.pathname}, trying cache`);
            return caches.match(event.request);
          })
      );
    }
  } catch (err) {
    console.error('[SW] General fetch handler error:', err);
  }
});

// Handle service worker errors
self.addEventListener('error', (event) => {
  console.error('[Service Worker] Error:', event.message, event.filename, event.lineno);
});

// Handle unhandled promises
self.addEventListener('unhandledrejection', (event) => {
  console.error('[Service Worker] Unhandled Promise Rejection:', event.reason);
});

// Add message handler to allow manual cache clearing
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'clearCache') {
    logSW('Clearing cache by request');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        ).then(() => {
          logSW('All caches cleared successfully');
          // Optionally inform the client that the cache was cleared
          if (event.source) {
            event.source.postMessage({
              action: 'cacheCleared',
              success: true
            });
          }
        });
      })
    );
  }
});

// Add a specific health check for the service worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'ping') {
    logSW('Health check ping received');
    if (event.source) {
      event.source.postMessage({
        action: 'pong',
        timestamp: Date.now()
      });
    }
  }
});
