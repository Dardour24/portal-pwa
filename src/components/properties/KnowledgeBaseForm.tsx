
import React from "react";
import { Form } from "@/components/ui/form";
import { Text, Ban } from "lucide-react";
import { RequiredQuestions } from "./form-qa/RequiredQuestions";
import { CustomQuestions } from "./form-qa/CustomQuestions";
import { FormActions } from "./form-qa/FormActions";
import { ValidationErrors } from "./form-qa/ValidationErrors";
import { useFormQA } from "@/hooks/use-form-qa";
import { Property } from "@/types/property";

interface KnowledgeBaseFormProps {
  property: Property | null;
  onSubmit: () => void;
}

export const KnowledgeBaseForm = ({ property, onSubmit }: KnowledgeBaseFormProps) => {
  const {
    form,
    validationErrors,
    handleSubmit,
    isSubmitting,
    isFormValid,
    customQuestions,
    setCustomQuestions,
    addCustomQuestion,
    removeCustomQuestion,
    updateCustomQuestion
  } = useFormQA(property, onSubmit);

  if (!property) return null;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
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

          <RequiredQuestions form={form} />
          
          <CustomQuestions 
            customQuestions={customQuestions}
            addCustomQuestion={addCustomQuestion}
            removeCustomQuestion={removeCustomQuestion}
            updateCustomQuestion={updateCustomQuestion}
          />
        </div>
        
        <FormActions 
          isSubmitting={isSubmitting} 
          isFormValid={isFormValid}
        />
      </form>
    </Form>
  );
};
