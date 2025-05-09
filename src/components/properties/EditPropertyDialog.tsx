
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PropertyForm, PropertyFormValues } from "@/components/properties/PropertyForm";
import { Property } from "@/types/property";

interface EditPropertyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: PropertyFormValues) => Promise<void>;
  isSubmitting: boolean;
  property: Property | null;
}

export const EditPropertyDialog = ({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  isSubmitting, 
  property 
}: EditPropertyDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier un logement</DialogTitle>
          <DialogDescription>
            Modifiez les informations de votre logement.
          </DialogDescription>
        </DialogHeader>
        
        {property && (
          <PropertyForm 
            onSubmit={onSubmit} 
            isSubmitting={isSubmitting}
            onCancel={() => onOpenChange(false)}
            initialValues={{
              name: property.name,
              address: property.address || '',
              is_active: property.is_active || true
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
