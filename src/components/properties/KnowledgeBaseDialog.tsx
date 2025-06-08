import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KnowledgeBaseForm } from "./KnowledgeBaseForm";
import { Property } from "@/types/property";
import { useFormQA } from "@/hooks/use-form-qa";
import { useAuth } from "@/context/AuthContext";

interface KnowledgeBaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  property: Property | null;
  onSave: () => void;
  isNewProperty?: boolean;
}

export const KnowledgeBaseDialog = ({
  isOpen,
  onOpenChange,
  property,
  onSave,
  isNewProperty = false
}: KnowledgeBaseDialogProps) => {
  const { isAuthenticated } = useAuth();
  const { resetPropertyData } = useFormQA(isAuthenticated);
  
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      resetPropertyData();
    }
  };
  
  const handleSave = () => {
    onSave();
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Base de Connaissances</DialogTitle>
          {isNewProperty && (
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Compléter plus tard
              </Button>
            </div>
          )}
        </DialogHeader>
        
        {property && isOpen && (
          <KnowledgeBaseForm
            propertyId={property.id || ""}
            propertyName={property.name}
            onSave={handleSave}
            onCancel={handleCancel}
            isNewProperty={isNewProperty}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};