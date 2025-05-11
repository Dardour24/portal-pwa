
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  onCancel: () => void;
  onSave: (e?: React.FormEvent) => void;  // Updated to accept an optional event parameter
  isSubmitting: boolean;
  isNewProperty: boolean;
}

export const FormActions = ({ onCancel, onSave, isSubmitting, isNewProperty }: FormActionsProps) => {
  return (
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
        type="submit"
        onClick={(e) => onSave(e)}  // Pass the event to onSave function
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
  );
};
