
// Main service worker file - imports functionality from modular files
importScripts(
  './sw/config.js',
  './sw/install-handler.js',
  './sw/activate-handler.js',
  './sw/fetch-handler.js',
  './sw/message-handler.js',
  './sw/error-handlers.js',
  './sw/offline-handler.js'
);

// Register event handlers
self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
self.addEventListener('fetch', handleFetch);
self.addEventListener('message', handleMessage);
self.addEventListener('error', handleError);
self.addEventListener('unhandledrejection', handleUnhandledRejection);

// Set this global flag to true to enable more aggressive caching
self.ENABLE_OFFLINE_MODE = false;

// Force update on each page load - with safety mechanism
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting().then(() => {
      console.log('[Service Worker] Skip waiting successful');
    }).catch(err => {
      console.error('[Service Worker] Skip waiting failed:', err);
    });
  }
});
