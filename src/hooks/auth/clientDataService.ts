
import { supabase } from '../../lib/supabase';
import { UserData } from './types';
import { User } from '../../types/auth';
import { isValidCache, updateCache } from './clientCache';

/**
 * Récupère les données client depuis la base de données avec mise en cache
 */
export const fetchClientData = async (userId: string): Promise<UserData | null> => {
  try {
    // Vérifier si nous avons des données en cache encore valides
    const { isValid, cachedData } = isValidCache(userId);
    
    if (isValid) {
      console.log("Utilisation des données client en cache pour l'utilisateur:", userId);
      return cachedData || null;
    }
    
    console.log("Récupération des données client pour l'utilisateur:", userId);
    const { data, error } = await supabase
      .from('clients')
      .select('first_name, last_name, phone')
      .eq('id', userId)
      .maybeSingle(); // Changé de .single() à .maybeSingle() pour ne pas générer d'erreur si aucune donnée

    if (error && error.code !== 'PGRST116') { // PGRST116 est le code pour "no rows returned"
      console.error("Erreur lors de la récupération des données client:", error);
      return null;
    }

    console.log("Données client récupérées:", data);
    
    // Mettre à jour le cache avec les données (même si null)
    updateCache(userId, data || null);
    
    return data;
  } catch (error) {
    console.error("Erreur dans fetchClientData:", error);
    return null;
  }
};

/**
 * Mappe les données utilisateur Supabase à notre type User
 */
export const mapUserData = (supabaseUser: any, clientData: UserData | null): User => {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    first_name: clientData?.first_name || '',
    last_name: clientData?.last_name || '',
    phone: clientData?.phone || '',
  };
};
