
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un logement
        </Button>
      </DialogTrigger>
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
