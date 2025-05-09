
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { fetchClientData, mapUserData } from './authService';
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
          // Get client data from Supabase
          const clientData = await fetchClientData(session.user.id);

          const user: User = mapUserData(session.user, clientData);
          setState({ user, isLoading: false });
        } else {
          setState({ user: null, isLoading: false });
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setState({ user: null, isLoading: false });
      }
    };

    checkUserSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            const clientData = await fetchClientData(session.user.id);
            const user: User = mapUserData(session.user, clientData);
            setState({ user, isLoading: false });
          } else {
            setState({ user: null, isLoading: false });
          }
        } catch (error) {
          console.error("Error during auth state change:", error);
          setState({ user: null, isLoading: false });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
};
