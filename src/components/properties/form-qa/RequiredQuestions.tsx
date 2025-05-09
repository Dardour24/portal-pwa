
import { FormQuestion } from "@/types/formQA";
import { Loader2 } from "lucide-react";
import { QuestionItem } from "./QuestionItem";

interface RequiredQuestionsProps {
  questions: FormQuestion[];
  answers: Map<string, string>;
  propertyName: string;
  onAnswerChange: (questionId: string, value: string) => void;
  isLoading: boolean;
}

export const RequiredQuestions = ({
  questions,
  answers,
  propertyName,
  onAnswerChange,
  isLoading
}: RequiredQuestionsProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="ml-2">Chargement des questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-4 bg-muted/20 rounded-lg text-center">
        <p className="text-muted-foreground">Aucune question générale disponible.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Questions générales</h3>
      {questions.map((question, index) => (
        <QuestionItem
          key={question.id}
          question={question}
          index={index}
          propertyName={propertyName}
          value={answers.get(question.id) || ""}
          onChange={(value) => onAnswerChange(question.id, value)}
        />
      ))}
    </div>
  );
};
