
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { KnowledgeBaseForm } from "./KnowledgeBaseForm";
import { Property } from "@/types/property";

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
        
        {property && (
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
