
import { supabase } from '../../lib/supabase';
import { UserData } from './types';
import { LoginResult, User, Session } from '../../types/auth';

/**
 * Fetches client data from the database
 */
export const fetchClientData = async (userId: string): Promise<UserData | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('first_name, last_name, phone')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching client data:", error);
      return null;
    }

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      throw error;
    }
    
    if (data.user) {
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
 * Gets the current session
 */
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error getting session:", error);
      throw error;
    }
    
    return session;
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
