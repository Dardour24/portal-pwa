
import { CACHE_NAME, logSW } from './config.js';

// Clean up old caches when a new service worker activates
export const handleActivate = (event) => {
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
};
