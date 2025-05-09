
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
  const dataLoadedForPropertyId = useRef<string | null>(null);
  const isCurrentlyFetching = useRef(false);
  
  // Fetch required questions only once with improved caching
  const {
    data: requiredQuestions = [],
    isLoading: isLoadingRequiredQuestions,
    isError: isErrorRequiredQuestions,
  } = useQuery({
    queryKey: ['requiredQuestions'],
    queryFn: () => {
      console.log("Fetching required questions");
      return formQAService.getRequiredQuestions();
    },
    enabled: isAuthenticated,
    staleTime: Infinity, // Never consider this data stale
    gcTime: 1000 * 60 * 60, // Cache for 1 hour - updated from cacheTime to gcTime
    refetchOnWindowFocus: false,
    retry: 2,
    onSuccess: (data) => {
      console.log("Successfully loaded required questions:", data.length);
      isInitialLoaded.current = true;
    },
    onError: (error) => {
      console.error("Error loading required questions:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les questions requises",
        variant: "destructive"
      });
    }
  });
  
  // Fetch custom questions for a property with better error handling
  const fetchCustomQuestions = async (propertyId: string) => {
    // Éviter les appels multiples ou si les données sont déjà chargées
    if (isCurrentlyFetching.current || dataLoadedForPropertyId.current === propertyId) {
      console.log("Skipping fetchCustomQuestions - already loaded or in progress");
      return customQuestions;
    }
    
    isCurrentlyFetching.current = true;
    setIsLoadingQA(true);
    
    try {
      console.log("Fetching custom questions for property:", propertyId);
      const questions = await formQAService.getCustomQuestionsForProperty(propertyId);
      console.log("Custom questions loaded:", questions.length);
      setCustomQuestions(questions);
      dataLoadedForPropertyId.current = propertyId;
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
      isCurrentlyFetching.current = false;
    }
  };
  
  // Reset loading state and cached data
  const resetPropertyData = () => {
    console.log("Resetting property data");
    dataLoadedForPropertyId.current = null;
    setCustomQuestions([]);
    isCurrentlyFetching.current = false;
  };
  
  // Fetch answers for a property with better error handling
  const fetchAnswers = async (propertyId: string) => {
    if (isCurrentlyFetching.current) {
      console.log("Skipping fetchAnswers - fetch already in progress");
      return [];
    }
    
    isCurrentlyFetching.current = true;
    setIsLoadingQA(true);
    
    try {
      console.log("Fetching answers for property:", propertyId);
      const answers = await formQAService.getAnswersForProperty(propertyId);
      console.log("Answers loaded:", answers.length);
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
      isCurrentlyFetching.current = false;
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
    resetPropertyData,
    addCustomQuestion,
    deleteCustomQuestion,
    saveAnswers
  };
};
