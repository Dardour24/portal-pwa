
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { Property } from "@/types/property";
import { propertyService } from "@/services/propertyService";
import { useAuth } from "@/context/AuthContext";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyForm, PropertyFormValues } from "@/components/properties/PropertyForm";

const Properties = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  
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
  
  // Gérer la soumission du formulaire
  const onSubmit = async (values: PropertyFormValues) => {
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
      
      // Fermer la boîte de dialogue
      setIsAddDialogOpen(false);
      
      toast({
        title: "Succès",
        description: "Propriété ajoutée avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la propriété:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la propriété",
        variant: "destructive",
      });
    } finally {
      setIsAddingProperty(false);
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
    // Pour l'instant, juste afficher un message
    toast({
      title: "Information",
      description: `Édition de la propriété ${propertyId} à implémenter`,
    });
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mes Logements</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Ajouter un logement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un logement</DialogTitle>
              <DialogDescription>
                Complétez les informations pour ajouter un nouveau logement à votre compte.
              </DialogDescription>
            </DialogHeader>
            
            <PropertyForm 
              onSubmit={onSubmit} 
              isSubmitting={isAddingProperty}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
            />
          ))}
          
          {/* Add Property Card */}
          <Card 
            className="flex flex-col items-center justify-center h-[300px] border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-600">Ajouter un logement</h3>
            <p className="text-sm text-gray-500 mt-2">Cliquez pour ajouter un nouveau logement</p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Properties;
