
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
  
  // Correction: use useRef to track if we've already reset to avoid infinite loop
  useEffect(() => {
    // Reset property data only when dialog closes AND hasResetRef is false
    if (!isOpen && !hasResetRef.current) {
      console.log("Dialog closed, resetting property data (once)");
      resetPropertyData();
      hasResetRef.current = true;
    }
    
    // Reset our tracking flag when dialog opens again
    if (isOpen) {
      hasResetRef.current = false;
    }
  }, [isOpen, resetPropertyData]);
  
  // Also reset when component unmounts, but only if not already reset
  useEffect(() => {
    return () => {
      if (!hasResetRef.current) {
        console.log("Dialog unmounting, resetting property data (once)");
        resetPropertyData();
        hasResetRef.current = true;
      }
    };
  }, [resetPropertyData]);
  
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
