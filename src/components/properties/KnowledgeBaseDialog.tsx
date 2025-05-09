
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KnowledgeBaseForm } from "./KnowledgeBaseForm";
import { Property } from "@/types/property";
import { useEffect } from "react";
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
  
  // Reset property data when dialog closes or property changes
  useEffect(() => {
    if (!isOpen) {
      console.log("Dialog closed, resetting property data");
      resetPropertyData();
    }
  }, [isOpen, resetPropertyData]);
  
  // Also reset when component unmounts
  useEffect(() => {
    return () => {
      console.log("Dialog unmounting, resetting property data");
      resetPropertyData();
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
