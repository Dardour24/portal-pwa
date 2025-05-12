
import { CACHE_NAME_STATIC, CACHE_NAME_DYNAMIC, logSW } from './config.js';

// Clean up old caches when a new service worker activates - with safer approach
export const handleActivate = (event) => {
  logSW('Activating...');
  
  const currentCaches = [CACHE_NAME_STATIC, CACHE_NAME_DYNAMIC];
  
  const cleanupPromise = caches.keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Only delete caches that start with our prefix but aren't the current versions
          if (cacheName.startsWith('botnb-client-') && !currentCaches.includes(cacheName)) {
            logSW('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
    .then(() => {
      logSW('Old caches cleared');
      return self.clients.claim();
    })
    .then(() => {
      logSW('Claimed clients');
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
