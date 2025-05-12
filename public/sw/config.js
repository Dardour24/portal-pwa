
// Configuration values for the service worker
const CACHE_NAME_STATIC = 'botnb-client-portal-static-v3';
const CACHE_NAME_DYNAMIC = 'botnb-client-portal-dynamic-v3';

// Minimal static assets that don't change with builds
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/fallback.html',
  '/manifest.json'
];

// Log function with prefix for easier debugging
const logSW = (message, data) => {
  const prefix = '[Service Worker]';
  if (data) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
};

// Export the functions and constants to the global scope
self.CACHE_NAME_STATIC = CACHE_NAME_STATIC;
self.CACHE_NAME_DYNAMIC = CACHE_NAME_DYNAMIC;
self.STATIC_ASSETS = STATIC_ASSETS;
self.logSW = logSW;
