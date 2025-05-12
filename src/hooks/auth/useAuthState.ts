import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { fetchClientData, mapUserData, refreshAuthToken } from './authService';
import { AuthState } from './types';
import { User } from '../../types/auth';

// Cache expiration time constants
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
const FALLBACK_SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Hook to manage authentication state with optimized caching
 */
export const useAuthState = (): AuthState => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true
  });
  
  // Use ref to track the last fetch time to prevent excessive API calls
  const lastFetchTimeRef = useRef<number>(0);
  // Use ref to store client data in memory between renders
  const clientDataCacheRef = useRef<Map<string, {data: any, timestamp: number}>>(new Map());
  
  // Try to get user from localStorage for immediate UI rendering
  useEffect(() => {
    try {
      const cachedUser = localStorage.getItem('botnb-auth-user');
      const lastLogin = localStorage.getItem('botnb-auth-last-login');
      
      if (cachedUser && lastLogin) {
        const loginTime = parseInt(lastLogin, 10);
        const now = Date.now();
        
        // Only use fallback if it's not too old
        if (now - loginTime < FALLBACK_SESSION_MAX_AGE) {
          console.log("Using cached user data for initial render");
          const parsedUser = JSON.parse(cachedUser);
          
          // Ensure values are never undefined but empty strings instead
          const sanitizedUser: User = {
            ...parsedUser,
            email: parsedUser.email || '',
            first_name: parsedUser.first_name || '',
            last_name: parsedUser.last_name || '',
            phone: parsedUser.phone || ''
          };
          
          setState({ 
            user: sanitizedUser,
            isLoading: true // Keep loading true until we verify with Supabase
          });
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }
  }, []);

  /**
   * Optimistically fetch client data with in-memory caching to reduce API calls
   */
  const fetchClientDataOptimized = async (userId: string): Promise<any> => {
    try {
      const now = Date.now();
      
      // Check in-memory cache first
      const cachedData = clientDataCacheRef.current.get(userId);
      if (cachedData && (now - cachedData.timestamp < CACHE_EXPIRY_TIME)) {
        console.log("Using in-memory cached client data for user:", userId);
        return cachedData.data;
      }
      
      // If not in cache or expired, fetch from API
      console.log("Fetching client data from API for user:", userId);
      const data = await fetchClientData(userId);
      
      // Update in-memory cache
      clientDataCacheRef.current.set(userId, {
        data,
        timestamp: now
      });
      
      return data;
    } catch (error) {
      console.error("Error in fetchClientDataOptimized:", error);
      return null;
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const now = Date.now();
        setState(prev => ({ ...prev, isLoading: true }));
        
        // Rate limit API calls - don't check more than once every 30 seconds
        // unless forced by auth state change
        if (now - lastFetchTimeRef.current < 30000 && state.user) {
          console.log("Skipping session check - too soon since last check");
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        lastFetchTimeRef.current = now;
        
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
          
          // Optimistically update UI with existing data if available
          if (state.user?.id === session.user.id) {
            console.log("Optimistically updating UI with existing data while fetching fresh data");
            setState(prev => ({ ...prev, isLoading: false }));
          }
          
          // Get client data from with optimized caching
          const clientData = await fetchClientDataOptimized(session.user.id);

          const user: User = mapUserData(session.user, clientData);
          setState({ user, isLoading: false });
          
          // Update localStorage cache with a timeout to prevent blocking the UI
          try {
            setTimeout(() => {
              localStorage.setItem('botnb-auth-user', JSON.stringify(user));
              localStorage.setItem('botnb-auth-last-login', Date.now().toString());
            }, 0);
          } catch (storageError) {
            console.warn("Could not update auth data in localStorage:", storageError);
          }
        } else {
          setState({ user: null, isLoading: false });
          // Clear localStorage cache if no session
          setTimeout(() => {
            localStorage.removeItem('botnb-auth-user');
            localStorage.removeItem('botnb-auth-last-login');
          }, 0);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setState({ user: null, isLoading: false });
      }
    };

    // Run session check after a short delay to allow the browser to process other tasks
    const sessionTimeout = setTimeout(checkUserSession, 10);
    
    // Set up auth state change listener with optimized debounce
    let debounceTimeout: number | undefined;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        // Clear any pending debounce
        if (debounceTimeout) clearTimeout(debounceTimeout);
        
        // Reduced debounce to 10ms to avoid authentication delays
        debounceTimeout = window.setTimeout(async () => {
          try {
            if (session?.user) {
              // Check if we already have the complete user data
              // Optimistic update: If we have existing data, show it immediately
              if (state.user?.id === session.user.id && 
                  state.user?.email === session.user.email &&
                  typeof state.user?.first_name === 'string') {
                
                console.log("User completely loaded, using existing data for immediate UI update");
                setState(prev => ({ 
                  ...prev, 
                  // Keep existing user data for optimistic update
                  user: prev.user,
                  isLoading: false 
                }));
                
                // Then fetch fresh data in the background
                fetchClientDataOptimized(session.user.id).then(clientData => {
                  // Only update if data actually changed
                  const freshUser = mapUserData(session.user, clientData);
                  
                  // Compare data to avoid unnecessary re-renders
                  const currentUser = state.user;
                  if (currentUser && (
                    currentUser.first_name !== freshUser.first_name ||
                    currentUser.last_name !== freshUser.last_name ||
                    currentUser.phone !== freshUser.phone
                  )) {
                    console.log("Background data fetch found updated user data, updating state");
                    setState({ user: freshUser, isLoading: false });
                    
                    // Update localStorage with fresh data
                    try {
                      localStorage.setItem('botnb-auth-user', JSON.stringify(freshUser));
                      localStorage.setItem('botnb-auth-last-login', Date.now().toString());
                    } catch (storageError) {
                      console.warn("Could not update auth data in localStorage:", storageError);
                    }
                  }
                });
                
                return; // Exit early with optimistic update
              }
              
              // If we don't have existing data, fetch it
              const clientData = await fetchClientDataOptimized(session.user.id);
              const user: User = mapUserData(session.user, clientData);
              
              console.log("Updating user state with complete data:", user);
              setState({ user, isLoading: false });
              
              // Update localStorage cache with timeout to prevent UI blocking
              try {
                setTimeout(() => {
                  localStorage.setItem('botnb-auth-user', JSON.stringify(user));
                  localStorage.setItem('botnb-auth-last-login', Date.now().toString());
                }, 0);
              } catch (storageError) {
                console.warn("Could not update auth data in localStorage:", storageError);
              }
            } else {
              setState({ user: null, isLoading: false });
              // Clear localStorage cache with timeout to prevent UI blocking
              setTimeout(() => {
                localStorage.removeItem('botnb-auth-user');
                localStorage.removeItem('botnb-auth-last-login');
              }, 0);
            }
          } catch (error) {
            console.error("Error during auth state change:", error);
            setState({ user: null, isLoading: false });
          }
        }, 10); // Maintained at 10ms for responsiveness
      }
    );

    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      clearTimeout(sessionTimeout);
      subscription.unsubscribe();
    };
  }, [state.user?.id]);

  return state;
};
