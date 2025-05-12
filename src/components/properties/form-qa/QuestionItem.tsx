
import { FormQuestion } from "@/types/formQA";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface QuestionItemProps {
  question: FormQuestion;
  index: number;
  propertyName: string;
  value: string;
  onChange: (value: string) => void;
  onDelete?: () => void;
  isCustom?: boolean;
}

export const QuestionItem = ({
  question,
  index,
  propertyName,
  value,
  onChange,
  onDelete,
  isCustom = false
}: QuestionItemProps) => {
  const questionId = `question-${index}-${question.id}`;
  
  return (
    <div className="space-y-2 p-4 bg-muted/20 rounded-lg" role="group" aria-labelledby={questionId}>
      <div className="flex justify-between items-start">
        <label id={questionId} htmlFor={`textarea-${questionId}`} className="block font-medium">
          {index + 1}. {question.question_text} {question.is_required && <span className="text-destructive" aria-hidden="true">*</span>}
          {question.is_required && <span className="sr-only">(Requis)</span>}
        </label>
        {isCustom && onDelete && (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-destructive" 
            onClick={onDelete}
            aria-label={`Supprimer la question ${index + 1}`}
            title="Supprimer la question"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <Textarea
        id={`textarea-${questionId}`}
        placeholder={`Votre réponse spécifique pour ${propertyName}...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
        aria-required={question.is_required}
        aria-invalid={question.is_required && value.trim() === ''}
      />
    </div>
  );
};
