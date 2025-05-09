
import { supabase } from "@/lib/supabase";
import { FormQuestion } from "@/types/formQA";

/**
 * Service pour gérer les questions personnalisées
 */
export const customQuestionsService = {
  /**
   * Récupère les questions personnalisées pour un logement spécifique
   */
  async getCustomQuestionsForProperty(propertyId: string): Promise<FormQuestion[]> {
    const { data, error } = await supabase
      .from('form_questions')
      .select('*')
      .eq('is_custom', true)
      .eq('property_id', propertyId)
      .order('created_at');
    
    if (error) {
      console.error('Erreur lors de la récupération des questions personnalisées:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Ajoute une nouvelle question personnalisée
   */
  async addCustomQuestion(question: Omit<FormQuestion, 'id' | 'is_custom' | 'created_at' | 'updated_at'>): Promise<FormQuestion> {
    const newQuestion = {
      ...question,
      is_custom: true
    };
    
    const { data, error } = await supabase
      .from('form_questions')
      .insert(newQuestion)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout de la question personnalisée:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Supprime une question personnalisée
   */
  async deleteCustomQuestion(questionId: string): Promise<void> {
    // D'abord supprimer toutes les réponses associées à cette question
    const { error: answerError } = await supabase
      .from('form_answers')
      .delete()
      .eq('question_id', questionId);
    
    if (answerError) {
      console.error('Erreur lors de la suppression des réponses:', answerError);
      throw answerError;
    }
    
    // Ensuite supprimer la question
    const { error } = await supabase
      .from('form_questions')
      .delete()
      .eq('id', questionId);
    
    if (error) {
      console.error('Erreur lors de la suppression de la question:', error);
      throw error;
    }
  },
};
