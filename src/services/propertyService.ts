
import { supabase } from "@/lib/supabase";
import { Property } from "@/types/property";

export const propertyService = {
  /**
   * Récupère toutes les propriétés de l'utilisateur connecté
   */
  async getProperties(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*');
    
    if (error) {
      console.error('Erreur lors de la récupération des propriétés:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Crée une nouvelle propriété pour l'utilisateur connecté
   */
  async createProperty(property: Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>): Promise<Property> {
    // Log pour déboguer les données reçues
    console.log("createProperty - données reçues:", property);
    
    // Récupérer l'ID de l'utilisateur connecté
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("Utilisateur non authentifié");
    }
    
    // Vérifier que name est présent (obligatoire)
    if (!property.name) {
      throw new Error("Le nom du logement est obligatoire");
    }
    
    // Ajouter client_id à la propriété (lié à l'UUID de l'utilisateur)
    const propertyWithClientId = {
      ...property,
      client_id: user.id
    };
    
    console.log("Données à insérer dans Supabase:", propertyWithClientId);
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert(propertyWithClientId)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la création de la propriété:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error("Aucune donnée retournée après création");
      }
      
      return data;
    } catch (error) {
      console.error('Exception lors de la création de la propriété:', error);
      throw error instanceof Error ? error : new Error("Une erreur inconnue s'est produite");
    }
  },
  
  /**
   * Met à jour une propriété existante
   */
  async updateProperty(id: string, property: Partial<Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>>): Promise<Property> {
    // Log pour déboguer les données reçues
    console.log("updateProperty - données reçues:", property);
    
    try {
      const { data, error } = await supabase
        .from('properties')
        .update(property)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la mise à jour de la propriété:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error("Aucune donnée retournée après mise à jour");
      }
      
      return data;
    } catch (error) {
      console.error('Exception lors de la mise à jour de la propriété:', error);
      throw error instanceof Error ? error : new Error("Une erreur inconnue s'est produite");
    }
  },
  
  /**
   * Supprime une propriété et toutes les réponses associées
   */
  async deleteProperty(id: string): Promise<void> {
    try {
      // Démarrer une transaction pour supprimer les réponses associées puis la propriété
      console.log("Suppression des réponses associées au logement:", id);
      const { error: answersError } = await supabase
        .from('form_answers')
        .delete()
        .eq('property_id', id);
      
      if (answersError) {
        console.error('Erreur lors de la suppression des réponses:', answersError);
        throw answersError;
      }
      
      console.log("Suppression des questions personnalisées associées au logement:", id);
      const { error: questionsError } = await supabase
        .from('form_questions')
        .delete()
        .eq('property_id', id)
        .eq('is_custom', true);
      
      if (questionsError) {
        console.error('Erreur lors de la suppression des questions personnalisées:', questionsError);
        throw questionsError;
      }
      
      console.log("Suppression du logement:", id);
      const { error: propertyError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (propertyError) {
        console.error('Erreur lors de la suppression du logement:', propertyError);
        throw propertyError;
      }
      
      console.log("Logement et données associées supprimés avec succès");
    } catch (error) {
      console.error('Exception lors de la suppression du logement et des données associées:', error);
      throw error instanceof Error ? error : new Error("Une erreur inconnue s'est produite");
    }
  }
};
