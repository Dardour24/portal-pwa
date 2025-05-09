
import { useState, useEffect } from "react";
import { FormQuestion, FormAnswer } from "@/types/formQA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useFormQA } from "@/hooks/use-form-qa";
import { useAuth } from "@/context/AuthContext";

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
  const [newCustomQuestion, setNewCustomQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      if (propertyId && !isNewProperty) {
        await fetchCustomQuestions(propertyId);
        const propertyAnswers = await fetchAnswers(propertyId);
        
        const answerMap = new Map<string, string>();
        propertyAnswers.forEach(answer => {
          answerMap.set(answer.question_id, answer.answer_text);
        });
        
        setAnswers(answerMap);
      }
    };
    
    loadData();
  }, [propertyId, isNewProperty]);
  
  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionId, value);
    setAnswers(newAnswers);
  };
  
  const handleAddCustomQuestion = async () => {
    if (!newCustomQuestion.trim()) return;
    
    if (customQuestions.length >= 10) {
      return setValidationErrors(["Vous avez atteint la limite de 10 questions personnalisées."]);
    }
    
    await addCustomQuestion({
      question_text: newCustomQuestion,
      is_required: false,
      property_id: propertyId
    });
    
    setNewCustomQuestion("");
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
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Chargement des questions...</p>
      </div>
    );
  }
  
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
      
      {validationErrors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md">
          <p className="font-semibold">Veuillez corriger les erreurs suivantes :</p>
          <ul className="list-disc list-inside">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="space-y-8">
        {/* Questions imposées */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Questions générales</h3>
          {requiredQuestions.map((question, index) => (
            <div key={question.id} className="space-y-2 p-4 bg-muted/20 rounded-lg">
              <label className="block font-medium">
                {index + 1}. {question.question_text} {question.is_required && <span className="text-destructive">*</span>}
              </label>
              <Textarea
                placeholder={`Votre réponse spécifique pour ${propertyName}...`}
                value={answers.get(question.id) || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
        </div>
        
        {/* Questions personnalisées */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Questions personnalisées ({customQuestions.length}/10)</h3>
            <Button 
              type="button" 
              onClick={handleAddCustomQuestion} 
              disabled={customQuestions.length >= 10 || !newCustomQuestion.trim()}
              variant="outline" 
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Ajouter une question
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Saisissez une nouvelle question personnalisée..."
              value={newCustomQuestion}
              onChange={(e) => setNewCustomQuestion(e.target.value)}
              className="flex-grow"
              disabled={customQuestions.length >= 10}
            />
          </div>
          
          {customQuestions.map((question, index) => (
            <div key={question.id} className="space-y-2 p-4 bg-muted/20 rounded-lg">
              <div className="flex justify-between items-start">
                <label className="block font-medium">
                  {requiredQuestions.length + index + 1}. {question.question_text}
                </label>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-8 w-8 text-destructive" 
                  onClick={() => handleDeleteCustomQuestion(question.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                placeholder={`Votre réponse spécifique pour ${propertyName}...`}
                value={answers.get(question.id) || ""}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="w-full"
              />
            </div>
          ))}
          
          {customQuestions.length === 0 && (
            <div className="text-center p-4 border border-dashed border-muted rounded-lg">
              <p className="text-muted-foreground">
                Aucune question personnalisée ajoutée. Vous pouvez ajouter jusqu'à 10 questions personnalisées.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          type="button" 
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              {isNewProperty ? 'Création en cours...' : 'Sauvegarde en cours...'}
            </>
          ) : (
            isNewProperty ? 'Créer la base de connaissances' : 'Enregistrer les modifications'
          )}
        </Button>
      </div>
    </div>
  );
};
