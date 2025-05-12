
import { CACHE_NAME_STATIC, STATIC_ASSETS, logSW } from './config.js';

// Install service worker
export const handleInstall = (event) => {
  logSW('Installing...');
  
  // Create a single promise chain for cleaner error handling
  const cacheStaticAssets = caches.open(CACHE_NAME_STATIC)
    .then(cache => {
      logSW('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
    .then(() => logSW('Static assets cached successfully'))
    .catch(error => {
      console.error('[Service Worker] Cache error:', error);
      // Continue installing even if cache fails
      return Promise.resolve();
    });
    
  event.waitUntil(cacheStaticAssets);
  
  // Force activation without waiting for existing clients to close
  self.skipWaiting();
  logSW('skipWaiting called to force activation');
};
