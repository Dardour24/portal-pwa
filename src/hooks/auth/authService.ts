import { supabase } from '../../lib/supabase';
import { UserData } from './types';
import { LoginResult, User, Session } from '../../types/auth';

// Cache for client data with expiration time
const clientDataCache = new Map<string, { data: UserData | null, timestamp: number }>();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetches client data from the database with caching
 */
export const fetchClientData = async (userId: string): Promise<UserData | null> => {
  try {
    // Check if we have cached data that's still valid
    const cachedData = clientDataCache.get(userId);
    const now = Date.now();
    
    if (cachedData && (now - cachedData.timestamp < CACHE_EXPIRY_TIME)) {
      console.log("Using cached client data for user:", userId);
      return cachedData.data;
    }
    
    console.log("Fetching client data for user:", userId);
    const { data, error } = await supabase
      .from('clients')
      .select('first_name, last_name, phone')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching client data:", error);
      return null;
    }

    console.log("Client data fetched:", data);
    
    // Update cache
    clientDataCache.set(userId, { data, timestamp: now });
    
    return data;
  } catch (error) {
    console.error("Error in fetchClientData:", error);
    return null;
  }
};

/**
 * Signs in a user with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<LoginResult> => {
  try {
    // Check network connectivity before attempting authentication
    if (!navigator.onLine) {
      throw new Error("Aucune connexion réseau disponible. Vérifiez votre connexion internet.");
    }
    
    console.log("Attempting login with email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      throw error;
    }
    
    if (data.user) {
      console.log("Login successful for user:", data.user.id);
      const clientData = await fetchClientData(data.user.id);
      
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        first_name: clientData?.first_name,
        last_name: clientData?.last_name,
        phone: clientData?.phone,
      };
      
      // Convert Supabase session to our Session type
      const session: Session = {
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || '',
        expires_at: data.session?.expires_at,
        expires_in: data.session?.expires_in,
        user: user
      };
      
      // Store authentication data in localStorage as fallback
      try {
        localStorage.setItem('botnb-auth-user', JSON.stringify(user));
        localStorage.setItem('botnb-auth-last-login', Date.now().toString());
      } catch (storageError) {
        console.warn("Could not store auth data in localStorage:", storageError);
      }
      
      return {
        user,
        session
      };
    }
    
    return { user: null, session: null };
  } catch (error) {
    console.error("Error in signInWithEmail:", error);
    throw error;
  }
};

/**
 * Signs up a user with email and password
 */
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  phoneNumber: string
): Promise<LoginResult> => {
  try {
    // Register the user with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
        }
      }
    });
    
    if (error) {
      console.error("Signup error:", error);
      throw error;
    }
    
    if (data.user) {
      // Create a record in the clients table
      const { error: clientError } = await supabase
        .from('clients')
        .insert([{
          id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
          email: email
        }]);
        
      if (clientError) {
        console.error("Error creating client profile:", clientError);
        throw clientError;
      }
      
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
      };
      
      // Convert Supabase session to our Session type
      const session: Session = {
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || '',
        expires_at: data.session?.expires_at,
        expires_in: data.session?.expires_in,
        user: user
      };
      
      return {
        user,
        session
      };
    }
    
    return { user: null, session: null };
  } catch (error) {
    console.error("Error in signUpWithEmail:", error);
    throw error;
  }
};

/**
 * Signs out the current user
 */
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

/**
 * Gets the current session with fallback to localStorage
 */
export const getCurrentSession = async () => {
  try {
    // First try to get session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      throw error;
    }
    
    if (session) {
      return session;
    }
    
    // If no session from Supabase, try fallback from localStorage
    const fallbackUser = localStorage.getItem('botnb-auth-user');
    const lastLogin = localStorage.getItem('botnb-auth-last-login');
    
    if (fallbackUser && lastLogin) {
      const loginTime = parseInt(lastLogin, 10);
      const now = Date.now();
      const FALLBACK_SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
      
      // Only use fallback if it's not too old
      if (now - loginTime < FALLBACK_SESSION_MAX_AGE) {
        console.warn("Using fallback authentication from localStorage");
        // We don't have a real session, but we can provide the user data
        // This can be used to show a limited UI while trying to reauthenticate
        return { user: JSON.parse(fallbackUser) };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error in getCurrentSession:", error);
    throw error;
  }
};

/**
 * Maps Supabase user data to our User type
 */
export const mapUserData = (supabaseUser: any, clientData: UserData | null): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    first_name: clientData?.first_name,
    last_name: clientData?.last_name,
    phone: clientData?.phone,
  };
};

/**
 * Sends a password reset email to the specified email address
 */
export const resetPassword = async (email: string): Promise<{ success: boolean, error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error("Password reset error:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in resetPassword:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Updates the user's password
 */
export const updatePassword = async (newPassword: string): Promise<{ success: boolean, error?: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error("Password update error:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error in updatePassword:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Clears the client data cache
 */
export const clearClientDataCache = () => {
  clientDataCache.clear();
};

/**
 * Refreshes the authentication token if needed
 */
export const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Error refreshing token:", error);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error("Error in refreshAuthToken:", error);
    return false;
  }
};
