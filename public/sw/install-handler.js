
import { CACHE_NAME, STATIC_ASSETS, logSW } from './config.js';

// Install service worker
export const handleInstall = (event) => {
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
};
