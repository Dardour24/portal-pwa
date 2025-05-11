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
    try {
      // D'abord, vérifions si des questions imposées existent déjà
      const { data: existingQuestions, error: fetchError } = await supabase
        .from('form_questions')
        .select('*')
        .eq('is_custom', false);
      
      if (fetchError) {
        console.error('Erreur lors de la vérification des questions existantes:', fetchError);
        throw fetchError;
      }
      
      // Si nous avons déjà 21 questions imposées, retournons-les directement
      if (existingQuestions && existingQuestions.length >= 21) {
        console.log('Les questions imposées existent déjà, nombre actuel:', existingQuestions.length);
        return existingQuestions;
      }
      
      console.log('Recréation des questions imposées nécessaire. Nombre actuel:', existingQuestions?.length || 0);
      
      // Si nous n'avons pas assez de questions, essayons d'abord de récupérer celles qui existent
      // sans créer d'erreur de violation RLS
      return existingQuestions || [];
      
      // NOTE: La création des questions par défaut est commentée car elle provoque
      // des erreurs de sécurité RLS. Il faudrait configurer correctement les politiques RLS
      // dans Supabase avant de pouvoir créer automatiquement les questions par défaut.
      
      /* Cette partie est commentée pour éviter les erreurs RLS
      // Sinon, supprimons les questions existantes non personnalisées
      if (existingQuestions && existingQuestions.length > 0) {
        const { error: deleteError } = await supabase
          .from('form_questions')
          .delete()
          .eq('is_custom', false);
          
        if (deleteError) {
          console.error('Erreur lors de la suppression des questions existantes:', deleteError);
          throw deleteError;
        }
        
        console.log('Questions imposées existantes supprimées avec succès');
      }
      
      // Liste exacte des 21 questions par défaut
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
        // Insérer les questions par défaut
        const { data, error } = await supabase
          .from('form_questions')
          .insert(defaultQuestions)
          .select();
          
        if (error) {
          console.error('Erreur lors de l\'insertion des questions par défaut:', error);
          throw error;
        }
        
        console.log('21 questions par défaut insérées avec succès:', data?.length || 0);
        return data || [];
      } catch (error) {
        console.error('Exception lors de l\'insertion des questions:', error);
        
        // En cas d'échec de l'insertion, essayons de récupérer les questions existantes
        const { data: fallbackData } = await supabase
          .from('form_questions')
          .select('*')
          .eq('is_custom', false);
        
        console.log('Récupération de secours des questions imposées:', fallbackData?.length || 0);
        return fallbackData || [];
      }
      */
    } catch (error) {
      console.error('Erreur dans getRequiredQuestions:', error);
      return [];
    }
  }
};
