
// Service worker for PWA functionality
const CACHE_NAME = 'botnb-client-portal-v2';

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
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Clean up old caches when a new service worker activates
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Network-first strategy for Vite's dynamic assets (JS, CSS)
// Cache-first strategy for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // For JS and CSS files (which may have hashed names), use network-first approach
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.includes('/assets/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the new response
          if (response && response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request);
        })
    );
  } else {
    // For other assets, try the cache first
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If not in cache, get from network
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses or non-GET requests
          if (!response || response.status !== 200 || event.request.method !== 'GET') {
            return response;
          }
          
          // Cache the new successful response
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          
          return response;
        });
      })
    );
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
