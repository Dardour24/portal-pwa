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
  // Nouvelles props pour le flux de création avec base de connaissances
  newlyCreatedProperty: Property | null;
  setNewlyCreatedProperty: (property: Property | null) => void;
  isKnowledgeBaseDialogOpen: boolean;
  setIsKnowledgeBaseDialogOpen: (isOpen: boolean) => void;
}

export const PropertyDialogs = ({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isKnowledgeBaseDialogOpen: isEditKnowledgeBaseDialogOpen,
  setIsKnowledgeBaseDialogOpen: setIsEditKnowledgeBaseDialogOpen,
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
  refetchProperties,
  // Nouvelles props
  newlyCreatedProperty,
  setNewlyCreatedProperty,
  isKnowledgeBaseDialogOpen,
  setIsKnowledgeBaseDialogOpen
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
      // Récupérer la propriété nouvellement créée depuis la liste mise à jour
      // Note: Nous devons attendre que la liste soit mise à jour pour récupérer la nouvelle propriété
      refetchProperties();
      // Pour simplifier, nous allons créer un objet temporaire avec les données soumises
      // L'ID sera généré côté serveur mais nous n'en avons pas besoin pour le formulaire
      const tempProperty: Property = {
        id: 'temp-id', // ID temporaire
        client_id: 'temp-client-id', // ID temporaire
        name: values.name,
        address: values.address || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setNewlyCreatedProperty(tempProperty);
      setIsKnowledgeBaseDialogOpen(true);
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
      
      {/* Dialogue pour l'édition d'une base de connaissances existante */}
      <KnowledgeBaseDialog
        isOpen={isEditKnowledgeBaseDialogOpen}
        onOpenChange={setIsEditKnowledgeBaseDialogOpen}
        property={selectedProperty}
        onSave={handleSaveKnowledgeBase}
        isNewProperty={false}
      />
      
      {/* Dialogue pour la création d'une nouvelle base de connaissances */}
      <KnowledgeBaseDialog
        isOpen={isKnowledgeBaseDialogOpen}
        onOpenChange={(open) => {
          setIsKnowledgeBaseDialogOpen(open);
          if (!open) {
            setNewlyCreatedProperty(null);
          }
        }}
        property={newlyCreatedProperty}
        onSave={() => {
          handleSaveKnowledgeBase();
          setIsKnowledgeBaseDialogOpen(false);
          setNewlyCreatedProperty(null);
        }}
        isNewProperty={true}
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