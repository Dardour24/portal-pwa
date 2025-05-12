
import { CACHE_NAME, STATIC_ASSETS, logSW } from './config.js';

// CORRECTION: Stratégie "Network First" pour tous les assets importants
export const handleFetch = (event) => {
  // Ignore non-GET requests
  if (event.request.method !== 'GET') return;
  
  try {
    const url = new URL(event.request.url);
    
    // Skip cross-origin requests
    if (url.origin !== self.location.origin) {
      return;
    }
    
    // CORRECTION: Stratégie purement "network first" pour tous les assets JavaScript et CSS
    if (url.pathname.startsWith('/assets/') || 
        url.pathname.match(/\.(js|css)$/) ||
        url.pathname.includes('index-')) {
      
      event.respondWith(
        fetch(event.request)
          .then(response => {
            logSW(`Network response for ${url.pathname}:`, response.status);
            
            // Mettre en cache seulement si la réponse est valide
            if (response && response.status === 200) {
              const clonedResponse = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, clonedResponse))
                .catch(err => console.error('[SW] Cache error:', err));
            }
            return response;
          })
          .catch(error => {
            logSW(`Network request failed for ${url.pathname}, falling back to cache`, error);
            
            // En cas d'échec du réseau, tenter de servir depuis le cache
            return caches.match(event.request)
              .then(cachedResponse => {
                if (cachedResponse) {
                  logSW(`Serving from cache: ${url.pathname}`);
                  return cachedResponse;
                }
                
                // Si rien dans le cache non plus, renvoyer une page d'erreur claire
                logSW(`No cache found for ${url.pathname}, returning error response`);
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
              });
          })
      );
    } else if (STATIC_ASSETS.includes(url.pathname)) {
      // Pour les assets statiques connus, stratégie cache-first
      logSW(`Cache-first request for static asset: ${url.pathname}`);
      event.respondWith(
        caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              logSW(`Serving static asset from cache: ${url.pathname}`);
              return cachedResponse;
            }
            return fetch(event.request)
              .then(response => {
                if (response && response.status === 200) {
                  const clonedResponse = response.clone();
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, clonedResponse));
                }
                return response;
              });
          })
      );
    } else {
      // Pour toutes les autres ressources, stratégie network-first simplifiée
      logSW(`Network-first request for: ${url.pathname}`);
      event.respondWith(
        fetch(event.request)
          .catch(() => {
            logSW(`Fetch failed for ${url.pathname}, trying cache`);
            return caches.match(event.request);
          })
      );
    }
  } catch (err) {
    console.error('[SW] General fetch handler error:', err);
  }
};
