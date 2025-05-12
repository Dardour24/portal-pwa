
// Configuration values for the service worker
export const CACHE_NAME_STATIC = 'botnb-client-portal-static-v3'; // Version incrémentée
export const CACHE_NAME_DYNAMIC = 'botnb-client-portal-dynamic-v3'; // Version incrémentée

// Minimal static assets that don't change with builds
export const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/fallback.html',
  '/manifest.json'
];

// Log function with prefix for easier debugging
export const logSW = (message, data) => {
  const prefix = '[Service Worker]';
  if (data) {
    console.log(prefix, message, data);
  } else {
    console.log(prefix, message);
  }
};
