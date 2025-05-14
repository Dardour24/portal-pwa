import { supabase } from '../../lib/supabase';
import { LoginResult, User } from '../../types/auth';
import { fetchClientData } from './clientDataService';

/**
 * S'authentifie avec email et mot de passe
 */
export const signInWithEmail = async (email: string, password: string, hcaptchaToken: string): Promise<LoginResult> => {
  try {
    // Vérifier la connectivité réseau avant de tenter l'authentification
    if (!navigator.onLine) {
      throw new Error("Aucune connexion réseau disponible. Vérifiez votre connexion internet.");
    }

    // Vérifier le token HCaptcha
    if (!hcaptchaToken) {
      throw new Error("Veuillez compléter la vérification HCaptcha.");
    }
    
    console.log("Tentative de connexion avec email:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        captchaToken: hcaptchaToken
      }
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
      const session = {
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
  phoneNumber: string,
  hcaptchaToken: string
): Promise<LoginResult> => {
  try {
    // Vérifier le token HCaptcha
    if (!hcaptchaToken) {
      throw new Error("Veuillez compléter la vérification HCaptcha.");
    }

    // Inscrire l'utilisateur avec Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
        },
        captchaToken: hcaptchaToken
      }
    });
    
    if (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    }
    else
      {
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
      };
      
      // Convertir la session Supabase en notre type Session
      const session = {
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
