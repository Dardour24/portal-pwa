import React, { useState, useEffect } from "react";
import { Text, Ban } from "lucide-react";
import { RequiredQuestions } from "./form-qa/RequiredQuestions";
import { CustomQuestions } from "./form-qa/CustomQuestions";
import { FormActions } from "./form-qa/FormActions";
import { ValidationErrors } from "./form-qa/ValidationErrors";
import { useFormQA } from "@/hooks/use-form-qa";
import { Property } from "@/types/property";
import { useAuth } from "@/context/AuthContext";

interface KnowledgeBaseFormProps {
  property: Property | null;
  onSubmit: () => void;
}

export const KnowledgeBaseForm = ({ property, onSubmit }: KnowledgeBaseFormProps) => {
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
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  useEffect(() => {
    if (property?.id) {
      // Load custom questions for this property
      fetchCustomQuestions(property.id);
      
      // Load answers for this property
      fetchAnswers(property.id).then(loadedAnswers => {
        const answersMap = new Map<string, string>();
        loadedAnswers.forEach(answer => {
          answersMap.set(answer.question_id, answer.answer_text);
        });
        setAnswers(answersMap);
      });
    }
  }, [property?.id, fetchCustomQuestions, fetchAnswers]);
  
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => {
      const newAnswers = new Map(prev);
      newAnswers.set(questionId, value);
      return newAnswers;
    });
  };
  
  const handleAddCustomQuestion = (questionText: string) => {
    if (property?.id) {
      addCustomQuestion({
        question_text: questionText,
        is_required: false,
        property_id: property.id
      });
    }
  };
  
  const handleDeleteCustomQuestion = (questionId: string) => {
    deleteCustomQuestion(questionId);
  };
  
  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    // Check required questions
    requiredQuestions.forEach(question => {
      if (question.is_required && (!answers.has(question.id) || !answers.get(question.id)?.trim())) {
        errors.push(`La question "${question.question_text}" nécessite une réponse.`);
      }
    });
    
    setValidationErrors(errors);
    return errors.length === 0;
  };
  
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!property?.id || !validateForm()) {
      return;
    }
    
    // Convert answers map to array for saving
    const answersArray = Array.from(answers).map(([questionId, answerText]) => ({
      property_id: property.id!,
      question_id: questionId,
      answer_text: answerText
    }));
    
    await saveAnswers(answersArray);
    onSubmit();
  };

  if (!property) return null;

  return (
    <div className="space-y-6">
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground text-base">BotnB est déjà un expert de la location courte durée.</p>
            <p>Cependant, vous pouvez l'aider à connaitre votre logement :<br />Renseignez le Formulaire ci dessous</p>
            
            <div className="flex items-start gap-2 mt-4">
              <Text className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>Apprenez tout ce que Botnb doit savoir sur votre logement pour qu'il réponde correctement aux questions de vos précieux voyageurs. Ne mettez pas d'URL, d'adresse internet</p>
            </div>
            
            <div className="flex items-start gap-2 mt-4">
              <Ban className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>Si vous envisagez que Botnb réponde sur Airbnb, les adresses de site internet seront bloquées par Airbnb</p>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <ValidationErrors errors={validationErrors} />
          )}

          <RequiredQuestions 
            questions={requiredQuestions}
            answers={answers}
            propertyName={property.name}
            onAnswerChange={handleAnswerChange}
            isLoading={isLoading}
          />
          
          <CustomQuestions 
            questions={customQuestions}
            answers={answers}
            propertyName={property.name}
            requiredQuestionsLength={requiredQuestions.length}
            onAnswerChange={handleAnswerChange}
            onAddCustomQuestion={handleAddCustomQuestion}
            onDeleteCustomQuestion={handleDeleteCustomQuestion}
          />
        </div>
        
        <FormActions 
          onCancel={() => onSubmit()}
          onSave={handleSubmit}
          isSubmitting={isSavingAnswers} 
          isNewProperty={!property.id}
        />
      </form>
    </div>
  );
};
