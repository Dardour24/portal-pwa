
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PropertyForm, PropertyFormValues } from "@/components/properties/PropertyForm";

interface AddPropertyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PropertyFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export const AddPropertyDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  isSubmitting 
}: AddPropertyDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un logement</DialogTitle>
          <DialogDescription>
            Complétez les informations pour ajouter un nouveau logement à votre compte.
          </DialogDescription>
        </DialogHeader>
        
        <PropertyForm 
          onSubmit={onSubmit} 
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
