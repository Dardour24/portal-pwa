import { supabase } from '../../lib/supabase';
import { UserData } from './types';
import { User } from '../../types/auth';
import { isValidCache, updateCache } from './clientCache';

/**
 * Fetches client data from the database with caching and optimistic updates
 */
export const fetchClientData = async (userId: string): Promise<UserData | null> => {
  try {
    // Check if we have valid cached data
    const { isValid, cachedData } = isValidCache(userId);
    
    if (isValid) {
      console.log("Using cached client data for user:", userId);
      return cachedData || null;
    }
    
    console.log("Fetching client data for user:", userId);
    const { data, error } = await supabase
      .from('clients')
      .select('first_name, last_name, phone')
      .eq('id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') { // PGRST116 is the code for "no rows returned"
      console.error("Error fetching client data:", error);
      return null;
    }

    console.log("Client data retrieved:", data);
    
    // Update cache with the new data
    updateCache(userId, data || null);
    
    return data;
  } catch (error) {
    console.error("Error in fetchClientData:", error);
    return null;
  }
};

/**
 * Maps Supabase user data to our User type with optimistic update capability
 */
export const mapUserData = (supabaseUser: any, clientData: UserData | null, existingUser?: User): User => {
  // If we have an existing user and the same ID, use it for optimistic updates
  if (existingUser && existingUser.id === supabaseUser.id) {
    return {
      ...existingUser,
      // Only update email from supabaseUser as it might have changed
      email: supabaseUser.email || existingUser.email || '',
      // Keep other fields from existing user for optimistic update
    };
  }
  
  // Otherwise create a new user object
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    first_name: clientData?.first_name || '',
    last_name: clientData?.last_name || '',
    phone: clientData?.phone || '',
  };
};
