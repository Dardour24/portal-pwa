
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { PropertyFormValues } from "@/components/properties/PropertyForm";
import { Property } from "@/types/property";
import { useProperties } from "@/hooks/use-properties";
import { AddPropertyDialog } from "@/components/properties/AddPropertyDialog";
import { EditPropertyDialog } from "@/components/properties/EditPropertyDialog";
import { PropertyList } from "@/components/properties/PropertyList";
import { KnowledgeBaseDialog } from "@/components/properties/KnowledgeBaseDialog";

const Properties = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isKnowledgeBaseDialogOpen, setIsKnowledgeBaseDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const { 
    properties,
    isLoading,
    isAddingProperty,
    isEditingProperty,
    addProperty,
    updateProperty,
    refetchProperties
  } = useProperties(isAuthenticated);

  // Gérer la soumission du formulaire d'ajout
  const onSubmitAdd = async (values: PropertyFormValues) => {
    const success = await addProperty(values);
    if (success) {
      setIsAddDialogOpen(false);
    }
  };

  // Gérer la soumission du formulaire d'édition
  const onSubmitEdit = async (values: PropertyFormValues) => {
    if (!selectedProperty?.id) return;
    
    const success = await updateProperty(selectedProperty.id, values);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedProperty(null);
    }
  };

  // Gérer la visualisation des détails d'une propriété
  const handleViewDetails = (propertyId: string) => {
    // Pour l'instant, juste afficher un message
    toast({
      title: "Information",
      description: `Détails de la propriété ${propertyId} à implémenter`,
    });
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
      description: "La base de connaissances a été mise à jour avec succès",
    });
    refetchProperties();
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mes Logements</h1>
        <AddPropertyDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={onSubmitAdd}
          isSubmitting={isAddingProperty}
        />
      </div>
      
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
      
      <PropertyList
        properties={properties}
        isLoading={isLoading}
        onAddProperty={() => setIsAddDialogOpen(true)}
        onViewDetails={handleViewDetails}
        onEdit={handleEdit}
        onManageKnowledgeBase={handleManageKnowledgeBase}
      />
    </div>
  );
};

export default Properties;
