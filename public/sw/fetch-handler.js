
import { CACHE_NAME_STATIC, CACHE_NAME_DYNAMIC, STATIC_ASSETS, logSW } from './config.js';
import { createOfflineResponse, isPageRequest } from './offline-handler.js';

// Simplified helper functions for cleaner code
const serveFromNetworkAndCache = async (request, cacheName) => {
  try {
    const response = await fetch(request);
    logSW(`Network response for ${request.url}:`, response.status);
    
    if (response && response.status === 200) {
      const clonedResponse = response.clone();
      const cache = await caches.open(cacheName);
      cache.put(request, clonedResponse);
    }
    return response;
  } catch (error) {
    logSW(`Network request failed for ${request.url}, falling back to cache`, error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      logSW(`Serving from cache: ${request.url}`);
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (isPageRequest(request)) {
      logSW(`Serving offline page for: ${request.url}`);
      return createOfflineResponse();
    }
    
    // Return error response if nothing in cache
    return createErrorResponse();
  }
};

const serveFromCacheThenNetwork = async (request) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    logSW(`Serving static asset from cache: ${request.url}`);
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const clonedResponse = response.clone();
      const cache = await caches.open(CACHE_NAME_STATIC);
      cache.put(request, clonedResponse);
    }
    return response;
  } catch (error) {
    logSW(`Network failed for ${request.url}, no cache available`);
    
    // Return offline page for HTML requests
    if (isPageRequest(request)) {
      return createOfflineResponse();
    }
    
    return createErrorResponse();
  }
};

const createErrorResponse = () => {
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
};

// Main fetch handler
export const handleFetch = (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;
  
  try {
    const url = new URL(event.request.url);
    
    // Skip cross-origin requests
    if (url.origin !== self.location.origin) {
      return;
    }
    
    // Choose caching strategy based on resource type
    if (isJsOrCssAsset(url) || isIndexFile(url)) {
      // Network-first for JS/CSS/index files
      event.respondWith(serveFromNetworkAndCache(event.request, CACHE_NAME_DYNAMIC));
    } 
    else if (isStaticAsset(url)) {
      // Cache-first for known static assets
      event.respondWith(serveFromCacheThenNetwork(event.request));
    } 
    else if (isImportantUserData(url)) {
      // Network-only with offline awareness for important data
      event.respondWith(
        fetch(event.request)
          .catch(() => {
            if (isPageRequest(event.request)) {
              return createOfflineResponse();
            }
            return caches.match(event.request);
          })
      );
    }
    else {
      // Network-first with offline fallback for everything else
      event.respondWith(
        fetch(event.request)
          .catch(() => {
            return caches.match(event.request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  return cachedResponse;
                }
                
                if (isPageRequest(event.request)) {
                  return createOfflineResponse();
                }
                
                return createErrorResponse();
              });
          })
      );
    }
  } catch (err) {
    console.error('[SW] General fetch handler error:', err);
  }
};

// Helper functions to identify resource types
const isJsOrCssAsset = (url) => {
  return url.pathname.startsWith('/assets/') || 
         url.pathname.match(/\.(js|css)$/);
};

const isIndexFile = (url) => {
  return url.pathname.includes('index-');
};

const isStaticAsset = (url) => {
  return STATIC_ASSETS.includes(url.pathname) || url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/);
};

const isImportantUserData = (url) => {
  // API calls or user-specific data endpoints
  return url.pathname.includes('/api/') || 
         url.pathname.includes('/auth/') ||
         url.pathname.includes('/supabase/');
};
