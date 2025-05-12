
import { useState } from "react";
import { Property } from "@/types/property";
import { PropertyFormValues } from "@/components/properties/PropertyForm";
import { AddPropertyDialog } from "@/components/properties/AddPropertyDialog";
import { EditPropertyDialog } from "@/components/properties/EditPropertyDialog";
import { KnowledgeBaseDialog } from "@/components/properties/KnowledgeBaseDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface PropertyDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  isKnowledgeBaseDialogOpen: boolean;
  setIsKnowledgeBaseDialogOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  isAddingProperty: boolean;
  isEditingProperty: boolean;
  isDeletingProperty: boolean;
  addProperty: (data: Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateProperty: (id: string, data: Partial<Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>>) => Promise<boolean>;
  deleteProperty: (id: string) => Promise<boolean>;
  refetchProperties: () => void;
}

export const PropertyDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isKnowledgeBaseDialogOpen,
  setIsKnowledgeBaseDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedProperty,
  setSelectedProperty,
  isAddingProperty,
  isEditingProperty,
  isDeletingProperty,
  addProperty,
  updateProperty,
  deleteProperty,
  refetchProperties
}: PropertyDialogsProps) => {
  
  // Handle add property form submission
  const onSubmitAdd = async (values: PropertyFormValues) => {
    const propertyData = {
      name: values.name,
      address: values.address || null
    };
    
    const success = await addProperty(propertyData);
    if (success) {
      setIsAddDialogOpen(false);
    }
  };

  // Handle edit property form submission
  const onSubmitEdit = async (values: PropertyFormValues) => {
    if (!selectedProperty?.id) return;
    
    const propertyData = {
      name: values.name,
      address: values.address || null
    };
    
    const success = await updateProperty(selectedProperty.id, propertyData);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedProperty(null);
    }
  };

  // Confirm property deletion
  const confirmDelete = async () => {
    if (!selectedProperty?.id) return;

    const success = await deleteProperty(selectedProperty.id);
    if (success) {
      toast({
        title: "Succès",
        description: "Le logement a été supprimé avec succès"
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedProperty(null);
  };
  
  // Handle knowledge base save
  const handleSaveKnowledgeBase = () => {
    toast({
      title: "Succès",
      description: "La base de connaissances a été mise à jour avec succès"
    });
    refetchProperties();
  };

  return (
    <>
      <AddPropertyDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={onSubmitAdd}
        isSubmitting={isAddingProperty}
      />
      
      <EditPropertyDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={onSubmitEdit}
        isSubmitting={isEditingProperty}
        property={selectedProperty}
      />
      
      <KnowledgeBaseDialog
        isOpen={isKnowledgeBaseDialogOpen}
        onOpenChange={setIsKnowledgeBaseDialogOpen}
        property={selectedProperty}
        onSave={handleSaveKnowledgeBase}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce logement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action supprimera définitivement le logement "{selectedProperty?.name}" et toutes les réponses associées. Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingProperty}
            >
              {isDeletingProperty ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
