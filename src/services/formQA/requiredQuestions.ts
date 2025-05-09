
import { supabase } from "@/lib/supabase";
import { FormQuestion } from "@/types/formQA";

/**
 * Service pour gérer les questions imposées
 */
export const requiredQuestionsService = {
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
  }
};
