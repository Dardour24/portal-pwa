
import { supabase } from '../../lib/supabase';
import { LoginResult, User, Session } from '../../types/auth';
import { fetchClientData } from './clientDataService';

/**
 * S'authentifie avec email et mot de passe
 */
export const signInWithEmail = async (email: string, password: string): Promise<LoginResult> => {
  try {
    // Vérifier la connectivité réseau avant de tenter l'authentification
    if (!navigator.onLine) {
      throw new Error("Aucune connexion réseau disponible. Vérifiez votre connexion internet.");
    }
    
    console.log("Tentative de connexion avec email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
    
    if (data.user) {
      console.log("Connexion réussie pour l'utilisateur:", data.user.id);
      const clientData = await fetchClientData(data.user.id);
      
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        first_name: clientData?.first_name || '',
        last_name: clientData?.last_name || '',
        phone: clientData?.phone || '',
      };
      
      // Convertir la session Supabase en notre type Session
      const session: Session = {
        access_token: data.session?.access_token || '',
        refresh_token: data.session?.refresh_token || '',
        expires_at: data.session?.expires_at,
        expires_in: data.session?.expires_in,
        user: user
      };
      
      // Stocker les données d'authentification dans localStorage comme fallback
      try {
        localStorage.setItem('botnb-auth-user', JSON.stringify(user));
        localStorage.setItem('botnb-auth-last-login', Date.now().toString());
      } catch (storageError) {
        console.warn("Impossible de stocker les données d'authentification dans localStorage:", storageError);
      }
      
      return {
        user,
        session
      };
    }
    
    return { user: null, session: null };
  } catch (error) {
    console.error("Erreur dans signInWithEmail:", error);
    throw error;
  }
};

/**
 * Inscrit un utilisateur avec email et mot de passe
 */
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string, 
  phoneNumber: string
): Promise<LoginResult> => {
  try {
    // Inscrire l'utilisateur avec Supabase
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
      console.error("Erreur d'inscription:", error);
      throw error;
    }
    
    if (data.user) {
      // Créer un enregistrement dans la table clients
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
        console.error("Erreur lors de la création du profil client:", clientError);
        throw clientError;
      }
      
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
      };
      
      // Convertir la session Supabase en notre type Session
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
    console.error("Erreur dans signUpWithEmail:", error);
    throw error;
  }
};

/**
 * Déconnecte l'utilisateur courant
 */
export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Erreur de déconnexion:", error);
    throw error;
  }
};

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
