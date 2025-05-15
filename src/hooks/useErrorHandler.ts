import { useState } from 'react';

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<{
    hasError: boolean;
    error: Error | null;
    retryCount: number;
  }>({
    hasError: false,
    error: null,
    retryCount: 0
  });
  
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  
  const handleError = async (error: Error, retryAction: () => Promise<void>) => {
    setErrorState(prev => ({
      hasError: true,
      error,
      retryCount: prev.retryCount + 1
    }));
    
    if (errorState.retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      try {
        await retryAction();
        setErrorState({ hasError: false, error: null, retryCount: 0 });
      } catch (retryError) {
        handleError(retryError, retryAction);
      }
    }
  };
  
  return {
    errorState,
    handleError,
    resetError: () => setErrorState({ hasError: false, error: null, retryCount: 0 })
  };
}; 