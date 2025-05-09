
import { FormQuestion } from "@/types/formQA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface CustomQuestionsProps {
  questions: FormQuestion[];
  answers: Map<string, string>;
  propertyName: string;
  requiredQuestionsLength: number;
  onAnswerChange: (questionId: string, value: string) => void;
  onAddCustomQuestion: (questionText: string) => void;
  onDeleteCustomQuestion: (questionId: string) => void;
}

export const CustomQuestions = ({
  questions,
  answers,
  propertyName,
  requiredQuestionsLength,
  onAnswerChange,
  onAddCustomQuestion,
  onDeleteCustomQuestion
}: CustomQuestionsProps) => {
  const [newCustomQuestion, setNewCustomQuestion] = useState("");

  const handleAddClick = () => {
    if (!newCustomQuestion.trim()) return;
    onAddCustomQuestion(newCustomQuestion);
    setNewCustomQuestion("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Questions personnalisées ({questions.length}/10)</h3>
        <Button 
          type="button" 
          onClick={handleAddClick} 
          disabled={questions.length >= 10 || !newCustomQuestion.trim()}
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
          disabled={questions.length >= 10}
        />
      </div>
      
      {questions.map((question, index) => (
        <div key={question.id} className="space-y-2 p-4 bg-muted/20 rounded-lg">
          <div className="flex justify-between items-start">
            <label className="block font-medium">
              {requiredQuestionsLength + index + 1}. {question.question_text}
            </label>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-destructive" 
              onClick={() => onDeleteCustomQuestion(question.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            placeholder={`Votre réponse spécifique pour ${propertyName}...`}
            value={answers.get(question.id) || ""}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
            className="w-full"
          />
        </div>
      ))}
      
      {questions.length === 0 && (
        <div className="text-center p-4 border border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground">
            Aucune question personnalisée ajoutée. Vous pouvez ajouter jusqu'à 10 questions personnalisées.
          </p>
        </div>
      )}
    </div>
  );
};
