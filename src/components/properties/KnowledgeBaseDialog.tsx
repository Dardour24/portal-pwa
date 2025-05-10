
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
  // Utiliser une référence pour suivre si la réinitialisation a été effectuée
  const hasResetRef = useRef(false);
  const dialogStateRef = useRef(isOpen);
  
  // Effectuer une seule réinitialisation lors de la fermeture du dialogue
  useEffect(() => {
    console.log(`Dialog state changed: ${dialogStateRef.current} -> ${isOpen}`);
    
    // Ne réinitialiser que lors de la fermeture du dialogue (isOpen: true -> false)
    if (dialogStateRef.current && !isOpen && !hasResetRef.current) {
      console.log("Dialog closed, resetting property data (once)");
      resetPropertyData();
      hasResetRef.current = true;
    }
    
    // Réinitialiser le drapeau lorsque le dialogue s'ouvre
    if (isOpen) {
      hasResetRef.current = false;
    }
    
    dialogStateRef.current = isOpen;
  }, [isOpen, resetPropertyData]);
  
  const handleSave = () => {
    onSave();
    onOpenChange(false);
  };
  
  const handleCancel = () => {
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
            propertyId={property.id || ""}
            propertyName={property.name}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
