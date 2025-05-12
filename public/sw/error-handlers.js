
import { logSW } from './config.js';

// Handle service worker errors
export const handleError = (event) => {
  console.error('[Service Worker] Error:', event.message, event.filename, event.lineno);
};

// Handle unhandled promises
export const handleUnhandledRejection = (event) => {
  console.error('[Service Worker] Unhandled Promise Rejection:', event.reason);
};
