
// Handle service worker errors
const handleError = (event) => {
  console.error('[Service Worker] Error:', event.message, event.filename, event.lineno);
};

// Handle unhandled promises
const handleUnhandledRejection = (event) => {
  console.error('[Service Worker] Unhandled Promise Rejection:', event.reason);
};

// Expose to global scope
self.handleError = handleError;
self.handleUnhandledRejection = handleUnhandledRejection;
