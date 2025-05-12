
import { supabase } from '../../lib/supabase';
import { signInWithEmail, signUpWithEmail, signOut, getCurrentSession, refreshAuthToken } from './authFunctions';
import { fetchClientData, mapUserData } from './clientDataService';
import { resetPassword, updatePassword } from './passwordService';
import { clearClientDataCache } from './clientCache';

// Re-export all authentication functions from this file to maintain the API
export { 
  signInWithEmail, 
  signUpWithEmail, 
  signOut, 
  getCurrentSession, 
  refreshAuthToken,
  fetchClientData, 
  mapUserData,
  resetPassword, 
  updatePassword,
  clearClientDataCache
};
