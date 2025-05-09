
import { requiredQuestionsService } from './requiredQuestions';
import { customQuestionsService } from './customQuestions';
import { answersService } from './answers';
import { FormQuestion, FormAnswer } from "@/types/formQA";

/**
 * Service principal qui rassemble toutes les fonctionnalités liées aux formulaires de questions-réponses
 */
export const formQAService = {
  /**
   * Récupère toutes les questions imposées (non personnalisées)
   */
  async getRequiredQuestions(): Promise<FormQuestion[]> {
    return requiredQuestionsService.getRequiredQuestions();
  },
  
  /**
   * Récupère les questions personnalisées pour un logement spécifique
   */
  async getCustomQuestionsForProperty(propertyId: string): Promise<FormQuestion[]> {
    return customQuestionsService.getCustomQuestionsForProperty(propertyId);
  },
  
  /**
   * Récupère toutes les réponses pour un logement spécifique
   */
  async getAnswersForProperty(propertyId: string): Promise<FormAnswer[]> {
    return answersService.getAnswersForProperty(propertyId);
  },
  
  /**
   * Ajoute une nouvelle question personnalisée
   */
  async addCustomQuestion(question: Omit<FormQuestion, 'id' | 'is_custom' | 'created_at' | 'updated_at'>): Promise<FormQuestion> {
    return customQuestionsService.addCustomQuestion(question);
  },
  
  /**
   * Supprime une question personnalisée
   */
  async deleteCustomQuestion(questionId: string): Promise<void> {
    return customQuestionsService.deleteCustomQuestion(questionId);
  },
  
  /**
   * Enregistre une réponse pour une question
   */
  async saveAnswer(answer: Omit<FormAnswer, 'id' | 'created_at' | 'updated_at'>): Promise<FormAnswer> {
    return answersService.saveAnswer(answer);
  },
  
  /**
   * Enregistre plusieurs réponses en une seule opération
   */
  async saveAnswers(answers: Omit<FormAnswer, 'id' | 'created_at' | 'updated_at'>[]): Promise<void> {
    return answersService.saveAnswers(answers);
  }
};
