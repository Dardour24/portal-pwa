
import { supabase } from '../../lib/supabase';
import { signInWithEmail, signUpWithEmail, signOut } from './userAuthentication';
import { getCurrentSession, refreshAuthToken } from './sessionManagement';
import { fetchClientData, mapUserData } from './clientDataService';
import { resetPassword, updatePassword } from './passwordService';
import { clearClientDataCache } from './clientCache';

// Fonction d'utilitaire pour vérifier l'état de la connexion réseau
export const checkNetworkConnection = (): boolean => {
  return navigator.onLine;
};

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
  clearClientDataCache,
  checkNetworkConnection
};
