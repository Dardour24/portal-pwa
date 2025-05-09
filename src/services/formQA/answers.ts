
import { supabase } from "@/lib/supabase";
import { FormAnswer } from "@/types/formQA";

/**
 * Service pour gérer les réponses aux questions
 */
export const answersService = {
  /**
   * Récupère toutes les réponses pour un logement spécifique
   */
  async getAnswersForProperty(propertyId: string): Promise<FormAnswer[]> {
    const { data, error } = await supabase
      .from('form_answers')
      .select('*')
      .eq('property_id', propertyId);
    
    if (error) {
      console.error('Erreur lors de la récupération des réponses:', error);
      throw error;
    }
    
    return data || [];
  },
  
  /**
   * Enregistre une réponse pour une question
   */
  async saveAnswer(answer: Omit<FormAnswer, 'id' | 'created_at' | 'updated_at'>): Promise<FormAnswer> {
    // Vérifier si une réponse existe déjà pour cette question et ce logement
    const { data: existingAnswers, error: fetchError } = await supabase
      .from('form_answers')
      .select('*')
      .eq('property_id', answer.property_id)
      .eq('question_id', answer.question_id);
    
    if (fetchError) {
      console.error('Erreur lors de la vérification de réponse existante:', fetchError);
      throw fetchError;
    }
    
    if (existingAnswers && existingAnswers.length > 0) {
      // Mettre à jour la réponse existante
      const { data, error } = await supabase
        .from('form_answers')
        .update({ answer_text: answer.answer_text, updated_at: new Date().toISOString() })
        .eq('id', existingAnswers[0].id)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la mise à jour de la réponse:', error);
        throw error;
      }
      
      return data;
    } else {
      // Créer une nouvelle réponse
      const { data, error } = await supabase
        .from('form_answers')
        .insert(answer)
        .select()
        .single();
      
      if (error) {
        console.error('Erreur lors de la création de la réponse:', error);
        throw error;
      }
      
      return data;
    }
  },
  
  /**
   * Enregistre plusieurs réponses en une seule opération
   */
  async saveAnswers(answers: Omit<FormAnswer, 'id' | 'created_at' | 'updated_at'>[]): Promise<void> {
    for (const answer of answers) {
      try {
        await this.saveAnswer(answer);
      } catch (error) {
        console.error('Erreur lors de l\'enregistrement des réponses:', error);
        throw error;
      }
    }
  }
};
