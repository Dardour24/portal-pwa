
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  
  // Références pour les timeouts
  const addTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Nettoyer les timeouts lors du démontage du composant
  useEffect(() => {
    return () => {
      if (addTimeoutRef.current) clearTimeout(addTimeoutRef.current);
      if (editTimeoutRef.current) clearTimeout(editTimeoutRef.current);
    };
  }, []);

  // Fetch all properties
  const { data: properties = [], isLoading, refetch: refetchProperties } = useQuery({
    queryKey: ['properties'],
    queryFn: propertyService.getProperties,
    enabled: isAuthenticated,
    retry: 1,
    onSettled: (data, error) => {
      if (error) {
        console.error("Erreur lors du chargement des propriétés:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les logements. Veuillez rafraîchir la page.",
          variant: "destructive",
        });
      }
    }
  });

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
      const result = await propertyService.updateProperty(id, propertyData);
      
      // Annuler le timeout si l'opération a réussi
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
        editTimeoutRef.current = null;
      }
      
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

  return {
    properties,
    isLoading,
    isAddingProperty,
    isEditingProperty,
    addProperty,
    updateProperty,
    refetchProperties
  };
}
