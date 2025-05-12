
import { supabase } from "@/lib/supabase";
import { Property } from "@/types/property";
import { propertyCache } from "./propertyCache";

/**
 * Functions related to retrieving properties from the database
 */
export const propertyRetrieval = {
  /**
   * Récupère les propriétés de l'utilisateur connecté avec pagination
   */
  async getProperties(page = 1, pageSize = 10, forceRefresh = false): Promise<{ data: Property[]; totalCount: number }> {
    // Check cache if we're not forcing a refresh
    if (!forceRefresh) {
      const cachedData = propertyCache.get(page, pageSize);
      if (cachedData) {
        return cachedData;
      }
    }
    
    // Calculate start and end for pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    try {
      // First, get the total count for pagination info
      const { count, error: countError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Erreur lors du comptage des propriétés:', countError);
        throw countError;
      }
      
      const totalCount = count || 0;
      
      // Then get the actual data with pagination
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .range(start, end);
      
      if (error) {
        console.error('Erreur lors de la récupération des propriétés:', error);
        throw error;
      }
      
      // Update cache with the new data
      propertyCache.set(page, pageSize, data || [], totalCount);
      
      return { 
        data: data || [],
        totalCount
      };
    } catch (error) {
      console.error('Exception lors de la récupération des propriétés:', error);
      throw error instanceof Error ? error : new Error("Une erreur inconnue s'est produite");
    }
  }
};
