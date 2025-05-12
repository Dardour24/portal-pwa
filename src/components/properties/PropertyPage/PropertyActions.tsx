
import { useState } from "react";
import { Property } from "@/types/property";
import { toast } from "@/hooks/use-toast";

export interface PropertyActionsProps {
  onAddProperty: () => void;
  onEdit: (propertyId: string) => void;
  onDelete: (propertyId: string) => void;
  onManageKnowledgeBase: (propertyId: string) => void;
}

export function usePropertyActions(): PropertyActionsProps {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isKnowledgeBaseDialogOpen, setIsKnowledgeBaseDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Handle adding a new property
  const onAddProperty = () => setIsAddDialogOpen(true);
  
  // Handle editing a property
  const onEdit = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsEditDialogOpen(true);
    }
  };
  
  // Handle deleting a property
  const onDelete = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsDeleteDialogOpen(true);
    }
  };
  
  // Handle managing knowledge base
  const onManageKnowledgeBase = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setSelectedProperty(property);
      setIsKnowledgeBaseDialogOpen(true);
    }
  };
  
  return {
    onAddProperty,
    onEdit,
    onDelete,
    onManageKnowledgeBase
  };
}
