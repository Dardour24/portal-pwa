
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Property } from "@/types/property";
import { propertyService } from "@/services/propertyService";

export function useProperties(isAuthenticated: boolean) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);

  // Fetch all properties
  const { data: properties = [], isLoading, refetch: refetchProperties } = useQuery({
    queryKey: ['properties'],
    queryFn: propertyService.getProperties,
    enabled: isAuthenticated,
  });

  // Add a new property
  const addProperty = async (propertyData: Omit<Property, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => {
    setIsAddingProperty(true);
    try {
      console.log("Données à envoyer:", propertyData);
      await propertyService.createProperty(propertyData);
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: "Succès",
        description: "Le logement a été ajouté avec succès",
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout du logement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le logement",
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
    try {
      console.log("Données à mettre à jour (ID:", id, "):", propertyData);
      await propertyService.updateProperty(id, propertyData);
      await queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: "Succès",
        description: "Le logement a été mis à jour avec succès",
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du logement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le logement",
        variant: "destructive",
      });
      return false;
    } finally {
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
