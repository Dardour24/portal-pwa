
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { House, Plus, Loader2 } from "lucide-react";
import { Property } from "@/types/property";
import { propertyService } from "@/services/propertyService";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema de validation pour le formulaire de propriété
const propertySchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire"),
  address: z.string().optional(),
  beds24_property_id: z.string().optional().transform(val => val ? parseInt(val) : null),
  is_active: z.boolean().default(true),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

const Properties = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  
  // Configuration du formulaire avec React Hook Form
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address: "",
      beds24_property_id: "",
      is_active: true
    }
  });

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
        beds24_property_id: values.beds24_property_id || null,
        is_active: values.is_active
      });
      
      // Recharger les propriétés après création
      await loadProperties();
      
      // Fermer la boîte de dialogue et réinitialiser le formulaire
      setIsAddDialogOpen(false);
      form.reset();
      
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du logement</FormLabel>
                      <FormControl>
                        <Input placeholder="Appartement Paris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="123 Rue de Paris, 75001 Paris" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="beds24_property_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID de propriété Beds24 (optionnel)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="12345" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Actif</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isAddingProperty}>
                    {isAddingProperty ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ajout en cours...
                      </>
                    ) : (
                      'Ajouter'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
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
            <Card key={property.id} className="overflow-hidden">
              <div className="bg-gray-100 h-40 flex items-center justify-center">
                <House className="h-16 w-16 text-gray-400" />
              </div>
              <CardHeader>
                <CardTitle>{property.name}</CardTitle>
                <CardDescription>{property.is_active ? "Actif" : "Inactif"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{property.address || "Aucune adresse"}</p>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>
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
