
import { FormQuestion } from "@/types/formQA";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { QuestionItem } from "./QuestionItem";

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
        <QuestionItem
          key={question.id}
          question={question}
          index={requiredQuestionsLength + index}
          propertyName={propertyName}
          value={answers.get(question.id) || ""}
          onChange={(value) => onAnswerChange(question.id, value)}
          onDelete={() => onDeleteCustomQuestion(question.id)}
          isCustom={true}
        />
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
