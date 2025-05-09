
import { supabase } from "@/lib/supabase";
import { FormQuestion, FormAnswer } from "@/types/formQA";

export const formQAService = {
  /**
   * Récupère toutes les questions imposées (non personnalisées)
   */
  async getRequiredQuestions(): Promise<FormQuestion[]> {
    const { data, error } = await supabase
      .from('form_questions')
      .select('*')
      .eq('is_custom', false)
      .order('id');
    
    if (error) {
      console.error('Erreur lors de la récupération des questions imposées:', error);
      throw error;
    }
    
    return data || [];
  },
  
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
