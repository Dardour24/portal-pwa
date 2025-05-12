
import { CACHE_NAME_STATIC, CACHE_NAME_DYNAMIC, STATIC_ASSETS, logSW } from './config.js';

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
    else {
      // Simple network-first for all other resources
      event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
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
  return STATIC_ASSETS.includes(url.pathname);
};
