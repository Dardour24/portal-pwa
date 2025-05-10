
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { PropertyFormValues } from "@/components/properties/PropertyForm";
import { Property } from "@/types/property";
import { useProperties } from "@/hooks/use-properties";
import { AddPropertyDialog } from "@/components/properties/AddPropertyDialog";
import { EditPropertyDialog } from "@/components/properties/EditPropertyDialog";
import { PropertyList } from "@/components/properties/PropertyList";
import { KnowledgeBaseDialog } from "@/components/properties/KnowledgeBaseDialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";

const Properties = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isKnowledgeBaseDialogOpen, setIsKnowledgeBaseDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const { isAuthenticated } = useAuth();
  
  const { 
    properties,
    isLoading,
    isAddingProperty,
    isEditingProperty,
    isDeletingProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    refetchProperties
  } = useProperties(isAuthenticated);

  // Gérer la soumission du formulaire d'ajout
  const onSubmitAdd = async (values: PropertyFormValues) => {
    // Correction de la structure de données pour correspondre au type attendu
    const propertyData = {
      name: values.name, // Obligatoire
      address: values.address || null,
      is_active: values.is_active !== undefined ? values.is_active : true
    };
    
    const success = await addProperty(propertyData);
    if (success) {
      setIsAddDialogOpen(false);
    }
  };

  // Gérer la soumission du formulaire d'édition
  const onSubmitEdit = async (values: PropertyFormValues) => {
    if (!selectedProperty?.id) return;
    
    // Correction de la structure de données pour correspondre au type attendu
    const propertyData = {
      name: values.name,
      address: values.address || null,
      is_active: values.is_active !== undefined ? values.is_active : true
    };
    
    const success = await updateProperty(selectedProperty.id, propertyData);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedProperty(null);
    }
  };

  // Gérer la suppression d'une propriété
  const handleDelete = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsDeleteDialogOpen(true);
    }
  };

  // Confirmer la suppression
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

  // Gérer l'édition d'une propriété
  const handleEdit = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsEditDialogOpen(true);
    }
  };
  
  // Gérer la gestion de la base de connaissances
  const handleManageKnowledgeBase = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsKnowledgeBaseDialogOpen(true);
    }
  };
  
  // Gérer la sauvegarde de la base de connaissances
  const handleSaveKnowledgeBase = () => {
    toast({
      title: "Succès",
      description: "La base de connaissances a été mise à jour avec succès"
    });
    refetchProperties();
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mes Logements</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un logement
        </Button>
      </div>
      
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
      
      <PropertyList
        properties={properties}
        isLoading={isLoading}
        onAddProperty={() => setIsAddDialogOpen(true)}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onManageKnowledgeBase={handleManageKnowledgeBase}
      />
    </div>
  );
};

export default Properties;
