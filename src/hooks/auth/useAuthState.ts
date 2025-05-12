
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { fetchClientData, mapUserData, refreshAuthToken } from './authService';
import { AuthState } from './types';
import { User } from '../../types/auth';

/**
 * Hook to manage authentication state
 */
export const useAuthState = (): AuthState => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true
  });

  // Try to get user from localStorage for immediate UI rendering
  useEffect(() => {
    try {
      const cachedUser = localStorage.getItem('botnb-auth-user');
      const lastLogin = localStorage.getItem('botnb-auth-last-login');
      
      if (cachedUser && lastLogin) {
        const loginTime = parseInt(lastLogin, 10);
        const now = Date.now();
        const FALLBACK_SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
        
        // Only use fallback if it's not too old
        if (now - loginTime < FALLBACK_SESSION_MAX_AGE) {
          console.log("Using cached user data for initial render");
          setState({ 
            user: JSON.parse(cachedUser),
            isLoading: true // Keep loading true until we verify with Supabase
          });
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        // Get session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error retrieving session:", sessionError);
          throw sessionError;
        }
        
        if (session?.user) {
          // Try to refresh token if needed
          if (session.expires_at && Date.now() > session.expires_at * 1000) {
            console.log("Session expired, attempting refresh");
            await refreshAuthToken();
          }
          
          // Get client data from Supabase with caching implemented in fetchClientData
          const clientData = await fetchClientData(session.user.id);

          const user: User = mapUserData(session.user, clientData);
          setState({ user, isLoading: false });
          
          // Update localStorage cache
          try {
            localStorage.setItem('botnb-auth-user', JSON.stringify(user));
            localStorage.setItem('botnb-auth-last-login', Date.now().toString());
          } catch (storageError) {
            console.warn("Could not update auth data in localStorage:", storageError);
          }
        } else {
          setState({ user: null, isLoading: false });
          // Clear localStorage cache if no session
          localStorage.removeItem('botnb-auth-user');
          localStorage.removeItem('botnb-auth-last-login');
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setState({ user: null, isLoading: false });
      }
    };

    checkUserSession();
    
    // Set up auth state change listener with reduced debounce to avoid blocking authentication
    let debounceTimeout: number | undefined;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        // Clear any pending debounce
        if (debounceTimeout) clearTimeout(debounceTimeout);
        
        // CORRECTION: Réduit le debounce à 10ms pour éviter les délais d'authentification
        debounceTimeout = window.setTimeout(async () => {
          try {
            if (session?.user) {
              // CORRECTION: Modification de la condition pour s'assurer que les données sont complètes
              if (state.user?.id === session.user.id && state.user?.first_name) {
                console.log("User complètement chargé, pas besoin de recharger");
                setState(prev => ({ ...prev, isLoading: false }));
                return;
              }
              
              const clientData = await fetchClientData(session.user.id);
              const user: User = mapUserData(session.user, clientData);
              
              console.log("Updating user state with complete data:", user);
              setState({ user, isLoading: false });
              
              // Update localStorage cache
              try {
                localStorage.setItem('botnb-auth-user', JSON.stringify(user));
                localStorage.setItem('botnb-auth-last-login', Date.now().toString());
              } catch (storageError) {
                console.warn("Could not update auth data in localStorage:", storageError);
              }
            } else {
              setState({ user: null, isLoading: false });
              // Clear localStorage cache
              localStorage.removeItem('botnb-auth-user');
              localStorage.removeItem('botnb-auth-last-login');
            }
          } catch (error) {
            console.error("Error during auth state change:", error);
            setState({ user: null, isLoading: false });
          }
        }, 10); // CORRECTION: Réduit de 100ms à 10ms pour plus de réactivité
      }
    );

    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      subscription.unsubscribe();
    };
  }, [state.user?.id]);

  return state;
};
