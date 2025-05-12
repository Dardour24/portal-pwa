
// Clean up old caches when a new service worker activates - with safer approach
const handleActivate = (event) => {
  self.logSW('Activating...');
  
  const currentCaches = [self.CACHE_NAME_STATIC, self.CACHE_NAME_DYNAMIC];
  
  const cleanupPromise = caches.keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Only delete caches that start with our prefix but aren't the current versions
          if (cacheName.startsWith('botnb-client-') && !currentCaches.includes(cacheName)) {
            self.logSW('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
    .then(() => {
      self.logSW('Old caches cleared');
      return self.clients.claim();
    })
    .then(() => {
      self.logSW('Claimed clients');
      // Notify clients that the service worker has been updated
      return self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_ACTIVATED',
            payload: { 
              timestamp: new Date().toISOString()
            }
          });
        });
      });
    })
    .catch(error => {
      console.error('[Service Worker] Cache cleanup error:', error);
      // Continue activation even if cache cleanup fails
      return self.clients.claim();
    });
  
  event.waitUntil(cleanupPromise);
};

// Expose to global scope
self.handleActivate = handleActivate;
