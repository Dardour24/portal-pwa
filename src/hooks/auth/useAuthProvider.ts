import { useState, useEffect } from 'react';
import { useAuthState } from './useAuthState';
import { signInWithEmail, signUpWithEmail, signOut, refreshAuthToken, checkNetworkConnection } from './authService';
import { AuthContextType, LoginResult } from '../../types/auth';
import { toast } from '@/hooks/use-toast';

const useAuthProvider = (): AuthContextType => {
  const { user, isLoading } = useAuthState();
  const [authLoading, setAuthLoading] = useState(false);
  const [networkAvailable, setNetworkAvailable] = useState(navigator.onLine);
  const [reconnecting, setReconnecting] = useState(false);

  // Monitor network status
  useEffect(() => {
    const handleOnline = async () => {
      setNetworkAvailable(true);
      console.log("Network connection restored");
      
      // Afficher un toast pour informer l'utilisateur
      toast({
        title: "Connexion internet rétablie",
        description: "La connexion à internet est de nouveau disponible",
        variant: "default"
      });
      
      // Try to refresh token when connection is restored
      if (user) {
        setReconnecting(true);
        try {
          const success = await refreshAuthToken();
          if (success) {
            console.log("Auth token refreshed after reconnection");
            toast({
              title: "Session restaurée",
              description: "Votre session a été correctement restaurée",
              variant: "default"
            });
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          toast({
            title: "Erreur de reconnexion",
            description: "Impossible de restaurer votre session. Veuillez vous reconnecter",
            variant: "destructive"
          });
        } finally {
          setReconnecting(false);
        }
      }
    };
    
    const handleOffline = () => {
      setNetworkAvailable(false);
      console.log("Network connection lost");
      
      // Afficher un toast pour informer l'utilisateur
      toast({
        title: "Connexion internet perdue",
        description: "Vous êtes maintenant en mode hors-ligne. Certaines fonctionnalités peuvent être limitées",
        variant: "destructive"
      });
    };

    // Écouter les messages du service worker concernant le statut réseau
    const handleSWMessage = (event) => {
      if (event.data && event.data.type === 'NETWORK_STATUS') {
        const { online } = event.data.payload;
        setNetworkAvailable(online);
        
        if (online) {
          toast({
            title: "Connexion internet rétablie",
            description: "La connexion à internet est de nouveau disponible",
            variant: "default"
          });
        } else {
          toast({
            title: "Connexion internet perdue",
            description: "Vous êtes maintenant en mode hors-ligne. Certaines fonctionnalités peuvent être limitées",
            variant: "destructive"
          });
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    navigator.serviceWorker?.addEventListener('message', handleSWMessage);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.serviceWorker?.removeEventListener('message', handleSWMessage);
    };
  }, [user]);

  const login = async (email: string, password: string, hcaptchaToken: string): Promise<LoginResult> => {
    // Check for network connectivity
    if (!networkAvailable) {
      toast({
        title: "Mode hors-ligne",
        description: "Aucune connexion réseau disponible. La connexion est impossible en mode hors-ligne",
        variant: "destructive"
      });
      throw new Error("Aucune connexion réseau disponible. Veuillez vérifier votre connexion et réessayer.");
    }
    
    setAuthLoading(true);
    try {
      console.log("useAuthProvider: Attempting login");
      const result = await signInWithEmail(email, password, hcaptchaToken);
      console.log("useAuthProvider: Login result", result);
      
      // Attendre pour s'assurer que l'état d'authentification est propagé
      if (result.user) {
        // Attendre que l'état soit correctement mis à jour avant de retourner le résultat
        await new Promise<void>((resolve) => {
          // Fonction pour vérifier si l'authentification est complète
          const checkAuthState = () => {
            if (!isLoading && user && user.id === result.user?.id) {
              resolve();
            } else {
              setTimeout(checkAuthState, 100);
            }
          };
          
          // Vérifier l'état initial ou configurer un délai maximum
          const maxTimeout = setTimeout(() => {
            console.log("Auth state propagation timeout reached, continuing anyway");
            resolve();
          }, 1500);
          
          checkAuthState();
          
          // Nettoyer le timeout maximum si la résolution se fait plus tôt
          return () => clearTimeout(maxTimeout);
        });
      }
      
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
    phoneNumber: string,
    hcaptchaToken: string
  ): Promise<LoginResult> => {
    // Check for network connectivity
    if (!networkAvailable) {
      toast({
        title: "Mode hors-ligne",
        description: "Aucune connexion réseau disponible. L'inscription est impossible en mode hors-ligne",
        variant: "destructive"
      });
      throw new Error("Aucune connexion réseau disponible. Veuillez vérifier votre connexion et réessayer.");
    }

    // Check HCaptcha token
    if (!hcaptchaToken) {
      toast({
        title: "Erreur de vérification",
        description: "Veuillez compléter la vérification HCaptcha",
        variant: "destructive"
      });
      throw new Error("Veuillez compléter la vérification HCaptcha.");
    }
    
    setAuthLoading(true);
    try {
      const result = await signUpWithEmail(email, password, firstName, lastName, phoneNumber, hcaptchaToken);
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
    networkAvailable,
    reconnecting
  });

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || authLoading || reconnecting,
    networkAvailable,
    login,
    signup,
    logout
  };
};

export default useAuthProvider;
