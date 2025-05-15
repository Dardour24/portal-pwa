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
    const currentRetryCount = errorState.retryCount;
    
    if (currentRetryCount >= MAX_RETRIES) {
      setErrorState({
        hasError: true,
        error,
        retryCount: currentRetryCount
      });
      return;
    }

    setErrorState({
      hasError: true,
      error,
      retryCount: currentRetryCount + 1
    });
    
    try {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      await retryAction();
      setErrorState({ hasError: false, error: null, retryCount: 0 });
    } catch (retryError) {
      // Don't recursively call handleError
      setErrorState({
        hasError: true,
        error: retryError as Error,
        retryCount: currentRetryCount + 1
      });
    }
  };
  
  return {
    errorState,
    handleError,
    resetError: () => setErrorState({ hasError: false, error: null, retryCount: 0 })
  };
}; 