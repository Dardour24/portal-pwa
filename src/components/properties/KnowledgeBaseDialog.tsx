
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KnowledgeBaseForm } from "./KnowledgeBaseForm";
import { Property } from "@/types/property";
import { useEffect, useRef } from "react";
import { useFormQA } from "@/hooks/use-form-qa";
import { useAuth } from "@/context/AuthContext";

interface KnowledgeBaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onSave: () => void;
}

export const KnowledgeBaseDialog = ({
  isOpen,
  onOpenChange,
  property,
  onSave
}: KnowledgeBaseDialogProps) => {
  const { isAuthenticated } = useAuth();
  const { resetPropertyData } = useFormQA(isAuthenticated);
  const hasResetRef = useRef(false);
  
  // Correction: utilisation plus sûre de useEffect pour éviter les boucles infinies
  useEffect(() => {
    // Réinitialiser les données de la propriété uniquement lorsque le dialogue se ferme
    if (!isOpen && !hasResetRef.current) {
      console.log("Dialog closed, resetting property data (once)");
      resetPropertyData();
      hasResetRef.current = true;
    }
    
    // Réinitialiser notre drapeau de suivi lorsque le dialogue s'ouvre à nouveau
    if (isOpen) {
      hasResetRef.current = false;
    }
    
    // Nettoyage lors du démontage du composant
    return () => {
      if (!hasResetRef.current && !isOpen) {
        console.log("Dialog unmounting, resetting property data (once)");
        resetPropertyData();
      }
    };
  }, [isOpen, resetPropertyData]);
  
  const handleSubmit = () => {
    onSave();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Base de Connaissances</DialogTitle>
        </DialogHeader>
        
        {property && isOpen && (
          <KnowledgeBaseForm
            property={property}
            onSubmit={handleSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
