import { supabase } from "@/lib/supabase";
import { FormQuestion, FormAnswer } from "@/types/formQA";

export const formQAService = {
  /**
   * Récupère toutes les questions imposées (non personnalisées)
   */
  async getRequiredQuestions(): Promise<FormQuestion[]> {
    // D'abord, vérifions s'il y a des questions existantes
    const { data: existingQuestions, error: checkError } = await supabase
      .from('form_questions')
      .select('*')
      .eq('is_custom', false)
      .limit(1);
      
    if (checkError) {
      console.error('Erreur lors de la vérification des questions:', checkError);
      throw checkError;
    }
    
    // Si aucune question n'existe, insérons les 21 questions par défaut
    if (!existingQuestions || existingQuestions.length === 0) {
      const defaultQuestions = [
        { question_text: 'Quel est le nom du logement ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur veut connaître l\'ADRESSE ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur veut connaître la PROCÉDURE D\'ENTRÉE dans les lieux ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur veut connaître où est le PARKING, OU SE GARER ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur veut connaître le code WIFI ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur demande les clefs du logement ou l\'emplacement des clefs du logement ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur souhaite savoir où il peut faire des courses ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur souhaite savoir quel restaurant nous recommandons ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur souhaite savoir ce qu\'il peut visiter aux alentours ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur demande où se trouve le local poubelle ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur fait une demande du type : « Je n\'ai plus d\'eau chaude » ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur demande un ménage supplémentaire ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur demande des draps supplémentaires ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur souhaite prolonger son séjour ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur demande une arrivée avant l\'heure prévue ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur veut connaître la procédure de départ du logement (Check-out) ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur demande où sont les draps ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur demande de lui envoyer une facture ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur veut connaître le RÈGLEMENT INTÉRIEUR ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur pose une question sur la TV : ex : « Je n\'arrive pas à faire fonctionner la TV » ?', is_required: true, is_custom: false },
        { question_text: 'Si le voyageur pose une question sur la plaque de cuisson : ex : « La plaque de cuisson ne marche pas » ou « Comment on allume la plaque de cuisson » ?', is_required: true, is_custom: false }
      ];
      
      try {
        // D'abord, supprimons toutes les questions non personnalisées existantes
        const { error: deleteError } = await supabase
          .from('form_questions')
          .delete()
          .eq('is_custom', false);
          
        if (deleteError) {
          console.error('Erreur lors de la suppression des questions existantes:', deleteError);
          throw deleteError;
        }
        
        // Ensuite, insérons les nouvelles questions
        const { data, error } = await supabase
          .from('form_questions')
          .insert(defaultQuestions)
          .select();
          
        if (error) {
          console.error('Erreur lors de l\'insertion des questions par défaut:', error);
          throw error;
        }
        
        console.log('21 questions par défaut insérées avec succès');
        return data || [];
      } catch (error) {
        console.error('Erreur lors de l\'initialisation des questions par défaut:', error);
        throw error;
      }
    }
    
    // Récupérer toutes les questions non personnalisées
    const { data, error } = await supabase
      .from('form_questions')
      .select('*')
      .eq('is_custom', false)
      .order('created_at');
    
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
