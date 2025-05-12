
import { useState } from "react";
import { Property } from "@/types/property";
import { useProperties } from "@/hooks/use-properties";
import { PropertyFormValues } from "@/components/properties/PropertyForm";

export const usePropertyPage = (isAuthenticated: boolean) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isKnowledgeBaseDialogOpen, setIsKnowledgeBaseDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Use the properties hook for data fetching and mutations
  const { 
    properties,
    isLoading,
    isAddingProperty,
    isEditingProperty,
    isDeletingProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    refetchProperties,
    page,
    pageSize,
    totalPages,
    totalCount,
    goToPage,
    changePageSize
  } = useProperties(isAuthenticated);

  // Handle property actions
  const handleEdit = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleManageKnowledgeBase = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsKnowledgeBaseDialogOpen(true);
    }
  };

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    goToPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    changePageSize(newPageSize);
  };

  return {
    // Data
    properties,
    totalCount,
    isLoading,
    
    // Dialog state
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
    pageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange
  };
};
