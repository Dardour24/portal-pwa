
import { CACHE_NAME_STATIC, CACHE_NAME_DYNAMIC, logSW } from './config.js';

// Clean up old caches when a new service worker activates
export const handleActivate = (event) => {
  logSW('Activating...');
  
  const currentCaches = [CACHE_NAME_STATIC, CACHE_NAME_DYNAMIC];
  
  const cleanupPromise = caches.keys()
    .then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!currentCaches.includes(cacheName)) {
            logSW('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
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
    });
  
  event.waitUntil(cleanupPromise);
};
