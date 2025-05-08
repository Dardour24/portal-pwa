
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Property } from "@/types/property";
import { propertyService } from "@/services/propertyService";
import { PropertyFormValues } from "@/components/properties/PropertyForm";

export const useProperties = (isAuthenticated: boolean) => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  
  // Charger les propriétés au chargement du composant
  useEffect(() => {
    if (isAuthenticated) {
      loadProperties();
    }
  }, [isAuthenticated]);
  
  // Fonction pour charger les propriétés
  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const data = await propertyService.getProperties();
      setProperties(data);
    } catch (error) {
      console.error("Erreur lors du chargement des propriétés:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les propriétés",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Gérer la soumission du formulaire d'ajout
  const addProperty = async (values: PropertyFormValues) => {
    try {
      setIsAddingProperty(true);
      
      await propertyService.createProperty({
        name: values.name,
        address: values.address || null,
        beds24_property_id: values.beds24_property_id,
        is_active: values.is_active
      });
      
      // Recharger les propriétés après création
      await loadProperties();
      
      toast({
        title: "Succès",
        description: "Propriété ajoutée avec succès",
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la propriété:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la propriété",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsAddingProperty(false);
    }
  };

  // Gérer la soumission du formulaire d'édition
  const updateProperty = async (propertyId: string, values: PropertyFormValues) => {
    try {
      setIsEditingProperty(true);
      
      await propertyService.updateProperty(propertyId, {
        name: values.name,
        address: values.address || null,
        beds24_property_id: values.beds24_property_id,
        is_active: values.is_active
      });
      
      // Recharger les propriétés après mise à jour
      await loadProperties();
      
      toast({
        title: "Succès",
        description: "Propriété modifiée avec succès",
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la modification de la propriété:", error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la propriété",
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
    loadProperties,
    addProperty,
    updateProperty
  };
};
