
import { supabase } from '../../lib/supabase';

/**
 * Envoie un email de réinitialisation de mot de passe à l'adresse email spécifiée
 */
export const resetPassword = async (email: string): Promise<{ success: boolean, error?: string }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      console.error("Erreur de réinitialisation de mot de passe:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Erreur dans resetPassword:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Met à jour le mot de passe de l'utilisateur
 */
export const updatePassword = async (newPassword: string): Promise<{ success: boolean, error?: string }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error("Erreur de mise à jour de mot de passe:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Erreur dans updatePassword:", error);
    return { success: false, error: error.message };
  }
};
