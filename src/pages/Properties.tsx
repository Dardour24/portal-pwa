import { useAuth } from "@/context/AuthContext";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertyDialogs } from "@/components/properties/PropertyPage/PropertyDialogs";
import { usePropertyPage } from "@/components/properties/PropertyPage/usePropertyPage";
import { useState } from "react";
import { Property } from "@/types/property";

const Properties = () => {
  const { isAuthenticated } = useAuth();
  
  // Nouveaux états pour le flux de création avec base de connaissances
  const [newlyCreatedProperty, setNewlyCreatedProperty] = useState<Property | null>(null);
  const [isNewPropertyKnowledgeBaseDialogOpen, setIsNewPropertyKnowledgeBaseDialogOpen] = useState<boolean>(false);
  
  // Use our custom hook to manage state and actions
  const {
    // Data
    properties,
    totalCount,
    isLoading,
    
    // Dialog state
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
    
    // Property mutations
    isAddingProperty,
    isEditingProperty,
    isDeletingProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    refetchProperties,
    
    // Property actions
    handleEdit,
    handleDelete,
    handleManageKnowledgeBase,
    
    // Pagination
    page,
    totalPages,
    handlePageChange,
    handlePageSizeChange
  } = usePropertyPage(isAuthenticated);
  
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mes Logements</h1>
        {totalCount > 0 && (
          <p className="text-sm text-muted-foreground">
            {totalCount} logement{totalCount > 1 ? 's' : ''} au total
          </p>
        )}
      </div>
      
      {/* Property Dialogs Component */}
      <PropertyDialogs
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isEditKnowledgeBaseDialogOpen={isEditKnowledgeBaseDialogOpen}
        setIsEditKnowledgeBaseDialogOpen={setIsEditKnowledgeBaseDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        isAddingProperty={isAddingProperty}
        isEditingProperty={isEditingProperty}
        isDeletingProperty={isDeletingProperty}
        addProperty={addProperty}
        updateProperty={updateProperty}
        deleteProperty={deleteProperty}
        refetchProperties={refetchProperties}
        // Nouvelles props pour le flux de création avec base de connaissances
        newlyCreatedProperty={newlyCreatedProperty}
        setNewlyCreatedProperty={setNewlyCreatedProperty}
        isNewPropertyKnowledgeBaseDialogOpen={isNewPropertyKnowledgeBaseDialogOpen}
        setIsNewPropertyKnowledgeBaseDialogOpen={setIsNewPropertyKnowledgeBaseDialogOpen}
      />
      
      {/* Property List Component */}
      <PropertyList
        properties={properties}
        isLoading={isLoading}
        onAddProperty={() => setIsAddDialogOpen(true)}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onManageKnowledgeBase={handleManageKnowledgeBase}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
};

export default Properties;