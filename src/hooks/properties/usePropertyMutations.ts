
import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Property } from '@/types/property';
import { propertyService } from '@/services/propertyService';
import { OPERATION_TIMEOUT } from './constants';

interface PropertyMutationsResult {
  isAddingProperty: boolean;
  isEditingProperty: boolean;
  isDeletingProperty: boolean;
  addProperty: (data: Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  updateProperty: (id: string, data: Partial<Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>>) => Promise<boolean>;
  deleteProperty: (id: string) => Promise<boolean>;
  clearCache: () => void;
}

/**
 * Hook for property mutations (add, update, delete)
 */
export function usePropertyMutations(page: number, pageSize: number): PropertyMutationsResult {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);
  
  // References for the timeouts
  const addTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (addTimeoutRef.current) clearTimeout(addTimeoutRef.current);
      if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    };
  }, []);

  const clearCache = useCallback(() => {
    propertyService.clearCache();
  }, []);

  // Add a new property
  const addProperty = async (propertyData: Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => {
    setIsAddingProperty(true);
    
    // Set timeout to prevent infinite loading
    addTimeoutRef.current = setTimeout(() => {
      console.warn("Timeout atteint lors de l'ajout du logement");
      setIsAddingProperty(false);
      toast({
        title: "Erreur",
        description: "L'opération a pris trop de temps. Veuillez réessayer.",
        variant: "destructive",
      });
    }, OPERATION_TIMEOUT);
    
    try {
      console.log("Données à envoyer:", propertyData);
      const result = await propertyService.createProperty(propertyData);
      
      // Clear timeout if operation succeeded
      if (addTimeoutRef.current) {
        clearTimeout(addTimeoutRef.current);
        addTimeoutRef.current = null;
      }
      
      // Invalidate cache and queries
      propertyService.clearCache();
      await queryClient.invalidateQueries({ queryKey: ['properties'] });

      toast({
        title: "Succès",
        description: "Le logement a été ajouté avec succès",
      });
      return true;
    } catch (error) {
      // Clear timeout in case of error
      if (addTimeoutRef.current) {
        clearTimeout(addTimeoutRef.current);
        addTimeoutRef.current = null;
      }
      
      console.error("Erreur lors de l'ajout du logement:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Impossible d'ajouter le logement";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAddingProperty(false);
    }
  };

  // Update an existing property
  const updateProperty = async (
    id: string, 
    propertyData: Partial<Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>>
  ) => {
    setIsEditingProperty(true);
    
    // Set timeout
    editTimeoutRef.current = setTimeout(() => {
      console.warn("Timeout atteint lors de la mise à jour du logement");
      setIsEditingProperty(false);
      toast({
        title: "Erreur",
        description: "L'opération a pris trop de temps. Veuillez réessayer.",
        variant: "destructive",
      });
    }, OPERATION_TIMEOUT);
    
    try {
      console.log("Données à mettre à jour (ID:", id, "):", propertyData);
      
      // Optimistic update
      const previousProperties = queryClient.getQueryData<{ data: Property[]; totalCount: number }>(['properties', page, pageSize]);
      
      if (previousProperties) {
        queryClient.setQueryData(['properties', page, pageSize], {
          ...previousProperties,
          data: previousProperties.data.map(property => 
            property.id === id ? { ...property, ...propertyData } : property
          )
        });
      }
      
      const result = await propertyService.updateProperty(id, propertyData);
      
      // Clear timeout
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
        editTimeoutRef.current = null;
      }
      
      // Clear cache and refresh data
      propertyService.clearCache();
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      
      toast({
        title: "Succès",
        description: "Le logement a été mis à jour avec succès",
      });
      return true;
    } catch (error) {
      // Clear timeout
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
        editTimeoutRef.current = null;
      }
      
      console.error("Erreur lors de la mise à jour du logement:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Impossible de mettre à jour le logement";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsEditingProperty(false);
    }
  };

  // Delete a property
  const deleteProperty = async (id: string) => {
    setIsDeletingProperty(true);
    
    // Set timeout
    deleteTimeoutRef.current = setTimeout(() => {
      console.warn("Timeout atteint lors de la suppression du logement");
      setIsDeletingProperty(false);
      toast({
        title: "Erreur",
        description: "L'opération a pris trop de temps. Veuillez réessayer.",
        variant: "destructive",
      });
    }, OPERATION_TIMEOUT);
    
    try {
      console.log("Suppression du logement (ID:", id, ")");
      
      // Optimistic update
      const previousProperties = queryClient.getQueryData<{ data: Property[]; totalCount: number }>(['properties', page, pageSize]);
      
      if (previousProperties) {
        queryClient.setQueryData(['properties', page, pageSize], {
          ...previousProperties,
          data: previousProperties.data.filter(property => property.id !== id),
          totalCount: previousProperties.totalCount - 1
        });
      }
      
      await propertyService.deleteProperty(id);
      
      // Clear timeout
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
        deleteTimeoutRef.current = null;
      }
      
      // Clear cache and refresh data
      propertyService.clearCache();
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      
      return true;
    } catch (error) {
      // Clear timeout
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
        deleteTimeoutRef.current = null;
      }
      
      console.error("Erreur lors de la suppression du logement:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Impossible de supprimer le logement";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsDeletingProperty(false);
    }
  };

  return {
    isAddingProperty,
    isEditingProperty,
    isDeletingProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    clearCache
  };
}
