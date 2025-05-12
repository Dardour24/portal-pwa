
// Simplified helper functions for cleaner code - with reduced caching
const serveFromNetworkFirst = async (request) => {
  try {
    // Try network first
    const response = await fetch(request, { cache: 'no-cache' });
    self.logSW(`Network response for ${request.url}:`, response.status);
    
    // Only cache successful responses
    if (response && response.status === 200) {
      try {
        const clonedResponse = response.clone();
        const cache = await caches.open(self.CACHE_NAME_DYNAMIC);
        cache.put(request, clonedResponse);
      } catch (err) {
        console.warn('[SW] Failed to cache successful response:', err);
      }
    }
    return response;
  } catch (error) {
    self.logSW(`Network request failed for ${request.url}, trying cache`, error);
    try {
      const cachedResponse = await caches.match(request);
      
      if (cachedResponse) {
        self.logSW(`Serving from cache: ${request.url}`);
        return cachedResponse;
      }
    } catch (cacheError) {
      self.logSW(`Cache retrieval failed for ${request.url}`, cacheError);
    }
    
    // Return offline page for HTML requests or error response
    if (isPageRequest(request)) {
      return createOfflineResponse();
    }
    
    // Return error response
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
        <button onclick="window.location.href='/?bypass-sw=true'">Désactiver le service worker</button>
      </body>
    </html>`,
    { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    }
  );
};

// Main fetch handler - with safety mechanisms
const handleFetch = (event) => {
  // Allow bypassing the service worker completely
  const url = new URL(event.request.url);
  if (url.searchParams.has('bypass-sw')) {
    return; // Let the browser handle this request normally
  }
  
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;
  
  try {
    // Skip cross-origin requests
    if (url.origin !== self.location.origin) {
      return;
    }
    
    // Bypass service worker for certain critical paths
    if (url.pathname.includes('/health') || 
        url.pathname.includes('/status.txt') ||
        url.pathname === '/fallback.html') {
      return; // Let these go straight to the server
    }
    
    // Always bypass cache for uploaded images
    if (url.pathname.includes('/lovable-uploads/')) {
      // Let the browser handle this with its normal cache logic
      return;
    }
    
    // Network-first strategy for most requests to ensure latest content
    event.respondWith(serveFromNetworkFirst(event.request));
  } catch (err) {
    console.error('[SW] General fetch handler error:', err);
    // Let the browser handle this request normally if our handler fails
    return;
  }
};

// Expose to global scope
self.handleFetch = handleFetch;
