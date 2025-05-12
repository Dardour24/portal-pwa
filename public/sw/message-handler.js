
// Add message handler with improved acknowledgment system
const handleMessage = (event) => {
  // Immediately acknowledge receipt of the message to prevent timeouts
  if (event.source) {
    event.source.postMessage({
      action: 'message-received',
      originalAction: event.data?.action,
      timestamp: Date.now()
    });
  }
  
  // Handle specific message actions
  if (event.data) {
    // Clear cache action
    if (event.data.action === 'clearCache') {
      self.logSW('Clearing cache by request');
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          ).then(() => {
            self.logSW('All caches cleared successfully');
            // Notify the client that the cache was cleared
            if (event.source) {
              event.source.postMessage({
                action: 'cacheCleared',
                success: true,
                timestamp: Date.now()
              });
            }
          });
        })
      );
    }
    
    // Health check ping
    else if (event.data.action === 'ping') {
      self.logSW('Health check ping received');
      // Already sent immediate acknowledgment, now send specific pong response
      if (event.source) {
        event.source.postMessage({
          action: 'pong',
          timestamp: Date.now()
        });
      }
    }
  }
};

// Expose to global scope
self.handleMessage = handleMessage;
