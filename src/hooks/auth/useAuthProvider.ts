
import { useState, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { signInWithEmail, signUpWithEmail, signOut, refreshAuthToken } from './authService';
import { AuthContextType, LoginResult } from '../../types/auth';

const useAuthProvider = (): AuthContextType => {
  const { user, isLoading } = useAuthState();
  const [authLoading, setAuthLoading] = useState(false);
  const [networkAvailable, setNetworkAvailable] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setNetworkAvailable(true);
      console.log("Network connection restored");
      
      // Try to refresh token when connection is restored
      if (user) {
        refreshAuthToken().then(success => {
          if (success) console.log("Auth token refreshed after reconnection");
        });
      }
    };
    
    const handleOffline = () => {
      setNetworkAvailable(false);
      console.log("Network connection lost");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    // Check for network connectivity
    if (!networkAvailable) {
      throw new Error("Aucune connexion réseau disponible. Veuillez vérifier votre connexion et réessayer.");
    }
    
    setAuthLoading(true);
    try {
      console.log("useAuthProvider: Attempting login");
      const result = await signInWithEmail(email, password);
      console.log("useAuthProvider: Login result", result);
      return result;
    } catch (error) {
      console.error("useAuthProvider: Error during login:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phoneNumber: string
  ): Promise<LoginResult> => {
    // Check for network connectivity
    if (!networkAvailable) {
      throw new Error("Aucune connexion réseau disponible. Veuillez vérifier votre connexion et réessayer.");
    }
    
    setAuthLoading(true);
    try {
      const result = await signUpWithEmail(email, password, firstName, lastName, phoneNumber);
      return result;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut();
      // Clear local storage fallback on logout
      localStorage.removeItem('botnb-auth-user');
      localStorage.removeItem('botnb-auth-last-login');
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  console.log("useAuthProvider state:", { 
    isAuthenticated: !!user, 
    isLoading: isLoading || authLoading,
    networkAvailable
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || authLoading,
    login,
    signup,
    logout
  };
};

export default useAuthProvider;
