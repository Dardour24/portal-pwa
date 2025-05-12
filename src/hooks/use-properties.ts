
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Property } from '@/types/property';
import { propertyService } from '@/services/propertyService';
import { usePagination } from './properties/usePagination';
import { usePropertyMutations } from './properties/usePropertyMutations';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from './properties/constants';

/**
 * Main hook for managing properties with pagination and CRUD operations
 */
export function useProperties(isAuthenticated: boolean) {
  const { toast } = useToast();
  
  // Initialize pagination
  const pagination = usePagination({
    initialPage: DEFAULT_PAGE,
    initialPageSize: DEFAULT_PAGE_SIZE
  });
  
  const { page, pageSize, setTotalCount } = pagination;

  // Fetch properties with pagination
  const fetchPropertiesWithPagination = useCallback(async () => {
    if (!isAuthenticated) return { data: [], totalCount: 0 };
    return propertyService.getProperties(page, pageSize);
  }, [isAuthenticated, page, pageSize]);
  
  // Query for properties with pagination
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

  // Update total count whenever data changes
  if (propertiesData.totalCount !== pagination.totalCount) {
    setTotalCount(propertiesData.totalCount);
  }

  // Get mutation methods
  const {
    isAddingProperty,
    isEditingProperty,
    isDeletingProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    clearCache
  } = usePropertyMutations(page, pageSize);

  // Return all necessary data and functions
  return {
    properties: propertiesData.data,
    totalCount: propertiesData.totalCount,
    isLoading,
    isAddingProperty,
    isEditingProperty,
    isDeletingProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    refetchProperties,
    clearCache,
    // Pagination properties and methods
    ...pagination
  };
}
