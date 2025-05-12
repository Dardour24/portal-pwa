
// Configuration values for the service worker
export const CACHE_NAME_STATIC = 'botnb-client-portal-static-v2'; // Version incrémentée
export const CACHE_NAME_DYNAMIC = 'botnb-client-portal-dynamic-v2'; // Version incrémentée

// Only cache static assets that don't change with builds
export const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/favicon.ico',
  '/lovable-uploads/favicon-16.png',
  '/lovable-uploads/favicon-32.png',
  '/lovable-uploads/favicon-152.png',
  '/lovable-uploads/favicon-180.png',
  '/lovable-uploads/favicon-192.png',
  '/lovable-uploads/favicon-512.png'
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
