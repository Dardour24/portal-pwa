
import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/components/ui/use-toast";
import { FormQuestion, FormAnswer } from "@/types/formQA";
import { formQAService } from "@/services/formQA";

export const useFormQA = (isAuthenticated: boolean) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoadingQA, setIsLoadingQA] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<FormQuestion[]>([]);
  const isInitialLoaded = useRef(false);
  
  // Fetch required questions
  const {
    data: requiredQuestions = [],
    isLoading: isLoadingRequiredQuestions,
  } = useQuery({
    queryKey: ['requiredQuestions'],
    queryFn: () => formQAService.getRequiredQuestions(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false, // Éviter de refetch inutilement
  });
  
  // Mettre à jour le flag isInitialLoaded quand les questions sont chargées
  useEffect(() => {
    if (requiredQuestions.length > 0 && !isInitialLoaded.current) {
      isInitialLoaded.current = true;
    }
  }, [requiredQuestions]);
  
  // Fetch custom questions for a property
  const fetchCustomQuestions = async (propertyId: string) => {
    if (isLoadingQA) return customQuestions; // Évite les chargements multiples
    
    setIsLoadingQA(true);
    try {
      const questions = await formQAService.getCustomQuestionsForProperty(propertyId);
      setCustomQuestions(questions);
      return questions;
    } catch (error) {
      console.error("Erreur lors du chargement des questions personnalisées:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les questions personnalisées",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoadingQA(false);
    }
  };
  
  // Fetch answers for a property
  const fetchAnswers = async (propertyId: string) => {
    if (isLoadingQA) return []; // Évite les chargements multiples
    
    setIsLoadingQA(true);
    try {
      const answers = await formQAService.getAnswersForProperty(propertyId);
      return answers;
    } catch (error) {
      console.error("Erreur lors du chargement des réponses:", error);
      toast({
        title: "Erreur", 
        description: "Impossible de charger les réponses",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoadingQA(false);
    }
  };
  
  // Add custom question mutation
  const { mutateAsync: addCustomQuestion } = useMutation({
    mutationFn: (question: Omit<FormQuestion, 'id' | 'is_custom' | 'created_at' | 'updated_at'>) => {
      return formQAService.addCustomQuestion(question);
    },
    onSuccess: (newQuestion) => {
      setCustomQuestions(prev => [...prev, newQuestion]);
      queryClient.invalidateQueries({ queryKey: ['requiredQuestions'] });
      toast({
        title: "Succès",
        description: "Question personnalisée ajoutée"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la question personnalisée",
        variant: "destructive"
      });
    }
  });
  
  // Delete custom question mutation
  const { mutateAsync: deleteCustomQuestion } = useMutation({
    mutationFn: (questionId: string) => {
      return formQAService.deleteCustomQuestion(questionId);
    },
    onSuccess: (_, questionId) => {
      setCustomQuestions(prev => prev.filter(q => q.id !== questionId));
      queryClient.invalidateQueries({ queryKey: ['requiredQuestions'] });
      toast({
        title: "Succès",
        description: "Question personnalisée supprimée"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la question personnalisée",
        variant: "destructive"
      });
    }
  });
  
  // Save answers mutation
  const { mutateAsync: saveAnswers, isPending: isSavingAnswers } = useMutation({
    mutationFn: (answers: Omit<FormAnswer, 'id' | 'created_at' | 'updated_at'>[]) => {
      return formQAService.saveAnswers(answers);
    },
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Réponses enregistrées avec succès"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les réponses",
        variant: "destructive"
      });
    }
  });
  
  return {
    requiredQuestions,
    customQuestions,
    isLoading: isLoadingRequiredQuestions || isLoadingQA,
    isSavingAnswers,
    fetchCustomQuestions,
    fetchAnswers,
    addCustomQuestion,
    deleteCustomQuestion,
    saveAnswers
  };
};
