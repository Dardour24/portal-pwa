
import { supabase } from '../../lib/supabase';

/**
 * Récupère la session courante avec fallback vers localStorage
 */
export const getCurrentSession = async () => {
  try {
    // D'abord essayer de récupérer la session depuis Supabase
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Erreur lors de la récupération de la session:", error);
      throw error;
    }
    
    if (session) {
      return session;
    }
    
    // Si pas de session depuis Supabase, essayer le fallback depuis localStorage
    const fallbackUser = localStorage.getItem('botnb-auth-user');
    const lastLogin = localStorage.getItem('botnb-auth-last-login');
    
    if (fallbackUser && lastLogin) {
      const loginTime = parseInt(lastLogin, 10);
      const now = Date.now();
      const FALLBACK_SESSION_MAX_AGE = 24 * 60 * 60 * 1000; // 24 heures
      
      // Utiliser le fallback uniquement s'il n'est pas trop ancien
      if (now - loginTime < FALLBACK_SESSION_MAX_AGE) {
        console.warn("Utilisation de l'authentification de secours depuis localStorage");
        // Nous n'avons pas de vraie session, mais nous pouvons fournir les données utilisateur
        // Cela peut être utilisé pour afficher une UI limitée pendant la tentative de réauthentification
        return { user: JSON.parse(fallbackUser) };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Erreur dans getCurrentSession:", error);
    throw error;
  }
};

/**
 * Rafraîchit le token d'authentification si nécessaire
 */
export const refreshAuthToken = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Erreur lors du rafraîchissement du token:", error);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error("Erreur dans refreshAuthToken:", error);
    return false;
  }
};
