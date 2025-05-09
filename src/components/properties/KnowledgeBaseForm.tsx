
import { useState, useEffect, useRef } from "react";
import { FormQuestion, FormAnswer } from "@/types/formQA";
import { useFormQA } from "@/hooks/use-form-qa";
import { useAuth } from "@/context/AuthContext";
import { RequiredQuestions } from "./form-qa/RequiredQuestions";
import { CustomQuestions } from "./form-qa/CustomQuestions";
import { ValidationErrors } from "./form-qa/ValidationErrors";
import { FormActions } from "./form-qa/FormActions";

interface KnowledgeBaseFormProps {
  propertyId: string;
  propertyName: string;
  onSave: () => void;
  onCancel: () => void;
  isNewProperty?: boolean;
}

export const KnowledgeBaseForm = ({ 
  propertyId, 
  propertyName, 
  onSave, 
  onCancel,
  isNewProperty = false
}: KnowledgeBaseFormProps) => {
  const { isAuthenticated } = useAuth();
  const { 
    requiredQuestions, 
    customQuestions, 
    isLoading, 
    isSavingAnswers,
    fetchCustomQuestions, 
    fetchAnswers, 
    addCustomQuestion, 
    deleteCustomQuestion, 
    saveAnswers 
  } = useFormQA(isAuthenticated);
  
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const dataLoadedRef = useRef(false);
  
  useEffect(() => {
    const loadData = async () => {
      if (!propertyId || isNewProperty || dataLoadedRef.current) return;
      
      dataLoadedRef.current = true;
      await fetchCustomQuestions(propertyId);
      const propertyAnswers = await fetchAnswers(propertyId);
      
      const answerMap = new Map<string, string>();
      propertyAnswers.forEach(answer => {
        answerMap.set(answer.question_id, answer.answer_text);
      });
      
      setAnswers(answerMap);
    };
    
    loadData();
  }, [propertyId, isNewProperty]);
  
  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, value);
    setAnswers(newAnswers);
  };
  
  const handleAddCustomQuestion = async (questionText: string) => {
    if (!questionText.trim()) return;
    
    if (customQuestions.length >= 10) {
      return setValidationErrors(["Vous avez atteint la limite de 10 questions personnalisées."]);
    }
    
    await addCustomQuestion({
      question_text: questionText,
      is_required: false,
      property_id: propertyId
    });
  };
  
  const handleDeleteCustomQuestion = async (questionId: string) => {
    await deleteCustomQuestion(questionId);
  };
  
  const handleSave = async () => {
    setValidationErrors([]);
    setIsSubmitting(true);
    
    // Validation des réponses requises
    const errors: string[] = [];
    requiredQuestions.forEach(question => {
      if (question.is_required && (!answers.has(question.id) || !answers.get(question.id))) {
        errors.push(`La réponse à "${question.question_text}" est obligatoire.`);
      }
    });
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }
    
    // Préparer les réponses à enregistrer
    const answersToSave: Omit<FormAnswer, 'id' | 'created_at' | 'updated_at'>[] = [];
    
    // Réponses pour les questions requises
    requiredQuestions.forEach(question => {
      if (answers.has(question.id)) {
        answersToSave.push({
          property_id: propertyId,
          question_id: question.id,
          answer_text: answers.get(question.id) || ""
        });
      }
    });
    
    // Réponses pour les questions personnalisées
    customQuestions.forEach(question => {
      if (answers.has(question.id)) {
        answersToSave.push({
          property_id: propertyId,
          question_id: question.id,
          answer_text: answers.get(question.id) || ""
        });
      }
    });
    
    try {
      await saveAnswers(answersToSave);
      onSave();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des réponses:", error);
      setValidationErrors(["Une erreur est survenue lors de l'enregistrement des réponses. Veuillez réessayer."]);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          {isNewProperty ? "Nouvelle Base de Connaissances pour : " : "Modifier la Base de Connaissances pour : "}
          {propertyName}
        </h2>
        <p className="text-muted-foreground">
          Renseignez les questions suivantes pour créer la base de connaissances de votre logement.
          Les champs marqués d'un * sont obligatoires.
        </p>
      </div>
      
      <ValidationErrors errors={validationErrors} />
      
      <div className="space-y-8">
        {/* Questions imposées */}
        <RequiredQuestions 
          questions={requiredQuestions}
          answers={answers}
          propertyName={propertyName}
          onAnswerChange={handleAnswerChange}
          isLoading={isLoading}
        />
        
        {/* Questions personnalisées */}
        <CustomQuestions
          questions={customQuestions}
          answers={answers}
          propertyName={propertyName}
          requiredQuestionsLength={requiredQuestions.length}
          onAnswerChange={handleAnswerChange}
          onAddCustomQuestion={handleAddCustomQuestion}
          onDeleteCustomQuestion={handleDeleteCustomQuestion}
        />
      </div>
      
      <FormActions 
        onCancel={onCancel}
        onSave={handleSave}
        isSubmitting={isSubmitting || isSavingAnswers}
        isNewProperty={isNewProperty}
      />
    </div>
  );
};
