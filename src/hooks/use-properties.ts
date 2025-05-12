
import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Property } from "@/types/property";
import { propertyService } from "@/services/propertyService";

// Délai maximum en ms pour les opérations avant de considérer qu'il y a un timeout
const OPERATION_TIMEOUT = 10000;

export function useProperties(isAuthenticated: boolean) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);
  
  // État pour la pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // Références pour les timeouts
  const addTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyer les timeouts lors du démontage du composant
  useEffect(() => {
    return () => {
      if (addTimeoutRef.current) clearTimeout(addTimeoutRef.current);
      if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    };
  }, []);

  // Fetch properties with pagination
  const fetchPropertiesWithPagination = useCallback(async () => {
    if (!isAuthenticated) return { data: [], totalCount: 0 };
    return propertyService.getProperties(page, pageSize);
  }, [isAuthenticated, page, pageSize]);
  
  // Fetch all properties with pagination
  const { 
    data: propertiesData = { data: [], totalCount: 0 }, 
    isLoading, 
    refetch: refetchProperties 
  } = useQuery({
    queryKey: ['properties', page, pageSize],
    queryFn: fetchPropertiesWithPagination,
    enabled: isAuthenticated,
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error("Erreur lors du chargement des propriétés:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les logements. Veuillez rafraîchir la page.",
          variant: "destructive",
        });
      }
    }
  });

  // Update total pages whenever total count or page size changes
  useEffect(() => {
    setTotalCount(propertiesData.totalCount);
    setTotalPages(Math.max(1, Math.ceil(propertiesData.totalCount / pageSize)));
  }, [propertiesData.totalCount, pageSize]);

  // Méthodes pour la navigation des pages
  const goToNextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  }, [page, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  }, [page]);

  const goToPage = useCallback((pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(pageNumber);
    }
  }, [totalPages]);

  const changePageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  }, []);

  const clearCache = useCallback(() => {
    propertyService.clearCache();
  }, []);

  // Add a new property
  const addProperty = async (propertyData: Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => {
    setIsAddingProperty(true);
    
    // Configurer un timeout pour éviter le blocage infini
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
      
      // Annuler le timeout si l'opération a réussi
      if (addTimeoutRef.current) {
        clearTimeout(addTimeoutRef.current);
        addTimeoutRef.current = null;
      }
      
      // Invalidate cache and queries to refresh data
      propertyService.clearCache();
      await queryClient.invalidateQueries({ queryKey: ['properties'] });

      toast({
        title: "Succès",
        description: "Le logement a été ajouté avec succès",
      });
      return true;
    } catch (error) {
      // Annuler le timeout en cas d'erreur
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
      // S'assurer que isAddingProperty est remis à false même en cas d'erreur non gérée
      setIsAddingProperty(false);
    }
  };

  // Update an existing property
  const updateProperty = async (
    id: string, 
    propertyData: Partial<Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>>
  ) => {
    setIsEditingProperty(true);
    
    // Configurer un timeout pour éviter le blocage infini
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
      
      // Annuler le timeout si l'opération a réussi
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
      // Annuler le timeout en cas d'erreur
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
      // S'assurer que isEditingProperty est remis à false même en cas d'erreur non gérée
      setIsEditingProperty(false);
    }
  };

  // Delete a property and its associated answers
  const deleteProperty = async (id: string) => {
    setIsDeletingProperty(true);
    
    // Configurer un timeout pour éviter le blocage infini
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
      
      // Annuler le timeout si l'opération a réussi
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
        deleteTimeoutRef.current = null;
      }
      
      // Clear cache and refresh data
      propertyService.clearCache();
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      
      // Adjust current page if we deleted the last item on the page
      if (previousProperties && previousProperties.data.length === 1 && page > 1) {
        setPage(prevPage => prevPage - 1);
      }
      
      return true;
    } catch (error) {
      // Annuler le timeout en cas d'erreur
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
      // S'assurer que isDeletingProperty est remis à false même en cas d'erreur non gérée
      setIsDeletingProperty(false);
    }
  };

  return {
    properties: propertiesData.data,
    totalCount,
    page,
    pageSize,
    totalPages,
    isLoading,
    isAddingProperty,
    isEditingProperty,
    isDeletingProperty,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    changePageSize,
    addProperty,
    updateProperty,
    deleteProperty,
    refetchProperties,
    clearCache
  };
}
