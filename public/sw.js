// Service worker for PWA functionality
const CACHE_NAME = 'botnb-client-portal-v3'; // Incrémenté pour forcer un refresh du cache

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
              // Ajout d'une gestion spécifique des erreurs pour cette opération problématique
              return caches.delete(cacheName)
                .catch(error => {
                  console.error(`[Service Worker] Failed to delete cache ${cacheName}:`, error);
                  // Ne pas propager l'erreur pour éviter l'échec de l'activation
                  return Promise.resolve();
                });
            }
            return Promise.resolve();
          }).filter(Boolean) // Filtrer les promesses nulles
        );
      })
      .catch(error => {
        console.error('[Service Worker] Cache cleanup error:', error);
        // Ne pas bloquer l'activation même en cas d'erreur
        return Promise.resolve();
      })
  );
  
  // Réclamez le contrôle de tous les clients dès l'activation
  // Cela évite d'avoir à recharger la page manuellement
  event.waitUntil(self.clients.claim());
});

// Network-first strategy for Vite's dynamic assets (JS, CSS)
// Cache-first strategy for static assets
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;
  
  try {
    const url = new URL(event.request.url);
    
    // Skip cross-origin requests
    if (url.origin !== self.location.origin) {
      return;
    }
    
    // Gérer spécifiquement les requêtes pour les assets hachés de Vite
    if (url.pathname.startsWith('/assets/') || 
        url.pathname.match(/\.(js|css)$/) ||
        url.pathname.includes('index-')) {
      
      // Pour les fichiers hachés, utiliser une stratégie réseau d'abord
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            // Ne mettre en cache que les réponses réussies
            if (response && response.status === 200) {
              const clonedResponse = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, clonedResponse)
                    .catch(err => console.error('[SW] Cache put error:', err));
                })
                .catch(err => console.error('[SW] Cache open error:', err));
            }
            return response;
          })
          .catch(() => {
            // Si le réseau échoue, essayer le cache
            return caches.match(event.request)
              .catch(err => {
                console.error('[SW] Cache match error:', err);
                // En cas d'échec total, renvoyer une réponse d'erreur
                return new Response('Network and cache both failed', { status: 503 });
              });
          })
      );
    } else {
      // Pour les autres actifs, essayer d'abord le cache
      event.respondWith(
        caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Si ce n'est pas dans le cache, obtenir du réseau
            return fetch(event.request)
              .then((response) => {
                // Ne pas mettre en cache les réponses non réussies
                if (!response || response.status !== 200) {
                  return response;
                }
                
                // Mettre en cache la nouvelle réponse réussie
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, clonedResponse)
                      .catch(err => console.error('[SW] Cache put error:', err));
                  })
                  .catch(err => console.error('[SW] Cache open error:', err));
                
                return response;
              })
              .catch(err => {
                console.error('[SW] Fetch error:', err);
                // En cas d'échec, renvoyer une réponse d'erreur
                return new Response('Network failed', { status: 503 });
              });
          })
          .catch(err => {
            console.error('[SW] Cache match error:', err);
            // En cas d'échec du cache, essayer le réseau
            return fetch(event.request)
              .catch(() => new Response('Both cache and network failed', { status: 503 }));
          })
      );
    }
  } catch (err) {
    console.error('[SW] General fetch handler error:', err);
    // Ne pas planter le service worker en cas d'erreur dans le gestionnaire
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
          cacheNames.map(cacheName => {
            console.log('[Service Worker] Deleting cache:', cacheName);
            return caches.delete(cacheName).catch(error => {
              console.error(`[Service Worker] Failed to delete cache ${cacheName}:`, error);
              return Promise.resolve();
            });
          })
        );
      })
    );
  }
});
