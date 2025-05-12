
import { propertyCache } from "./properties/propertyCache";
import { propertyRetrieval } from "./properties/propertyRetrieval";
import { propertyMutations } from "./properties/propertyMutations";
import { Property } from "@/types/property";

/**
 * Main property service that combines all property-related functionality
 */
export const propertyService = {
  /**
   * Récupère les propriétés de l'utilisateur connecté avec pagination
   */
  async getProperties(page = 1, pageSize = 10, forceRefresh = false): Promise<{ data: Property[]; totalCount: number }> {
    return propertyRetrieval.getProperties(page, pageSize, forceRefresh);
  },
  
  /**
   * Efface le cache des propriétés
   */
  clearCache(): void {
    propertyCache.clear();
  },
  
  /**
   * Crée une nouvelle propriété pour l'utilisateur connecté
   */
  async createProperty(property: Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>): Promise<Property> {
    const result = await propertyMutations.createProperty(property);
    propertyCache.clear(); // Clear cache after mutation
    return result;
  },
  
  /**
   * Met à jour une propriété existante
   */
  async updateProperty(id: string, property: Partial<Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>>): Promise<Property> {
    const result = await propertyMutations.updateProperty(id, property);
    propertyCache.clear(); // Clear cache after mutation
    return result;
  },
  
  /**
   * Supprime une propriété et toutes les réponses associées
   */
  async deleteProperty(id: string): Promise<void> {
    await propertyMutations.deleteProperty(id);
    propertyCache.clear(); // Clear cache after mutation
  }
};
