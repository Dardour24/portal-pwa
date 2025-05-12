
import { CACHE_NAME_STATIC, STATIC_ASSETS, logSW } from './config.js';

// Install service worker with safer approach
export const handleInstall = (event) => {
  logSW('Installing...');
  
  // More conservative approach to cache management during install
  const cacheStaticAssets = async () => {
    try {
      const cache = await caches.open(CACHE_NAME_STATIC);
      logSW('Caching essential static assets');
      // Only cache a minimal set of critical assets
      const criticalAssets = ['/', '/index.html'];
      await cache.addAll(criticalAssets);
      logSW('Critical static assets cached successfully');
      
      // Cache other assets without blocking installation
      STATIC_ASSETS.forEach(async (asset) => {
        if (!criticalAssets.includes(asset)) {
          try {
            await cache.add(asset);
          } catch (err) {
            console.warn(`[Service Worker] Non-critical asset caching skipped for ${asset}:`, err);
          }
        }
      });
      
      return true;
    } catch (error) {
      console.error('[Service Worker] Critical cache error:', error);
      // Continue installing even if cache fails
      return Promise.resolve(true);
    }
  };
    
  event.waitUntil(cacheStaticAssets());
  
  // Force activation without waiting for existing clients to close
  self.skipWaiting();
  logSW('skipWaiting called to force activation');
};
