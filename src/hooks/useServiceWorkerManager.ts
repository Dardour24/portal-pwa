import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useServiceWorkerManager = () => {
  const [swState, setSwState] = useState<{
    isRegistered: boolean;
    isActive: boolean;
    lastError: Error | null;
  }>({
    isRegistered: false,
    isActive: false,
    lastError: null
  });
  
  useEffect(() => {
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SW_STATE') {
        setSwState(prev => ({
          ...prev,
          isActive: event.data.payload.isActive
        }));
      }
    };
    
    const handleSWError = (event: Event) => {
      const error = event instanceof ErrorEvent ? event.error : new Error('Service Worker Error');
      setSwState(prev => ({
        ...prev,
        lastError: error
      }));
      
      // Attempt to re-register the service worker
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          setSwState(prev => ({
            ...prev,
            isRegistered: true,
            lastError: null
          }));
        })
        .catch(error => {
          setSwState(prev => ({
            ...prev,
            lastError: error
          }));
        });
    };
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          setSwState(prev => ({
            ...prev,
            isRegistered: true
          }));
        })
        .catch(error => {
          setSwState(prev => ({
            ...prev,
            lastError: error
          }));
        });
    }
    
    navigator.serviceWorker.addEventListener('message', handleSWMessage);
    navigator.serviceWorker.addEventListener('error', handleSWError);
    
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      navigator.serviceWorker.removeEventListener('error', handleSWError);
    };
  }, []);
  
  useEffect(() => {
    if (swState.lastError) {
      toast({
        title: "Erreur de service worker",
        description: "Tentative de reconnexion au service worker...",
        variant: "destructive"
      });
    }
  }, [swState.lastError]);
  
  return swState;
}; 