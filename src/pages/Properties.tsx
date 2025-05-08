
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { House, Plus } from "lucide-react";

const Properties = () => {
  const [properties] = useState([
    { id: 1, name: "Appartement Paris", address: "123 Rue de Paris, 75001 Paris", type: "Appartement" },
    { id: 2, name: "Villa Côte d'Azur", address: "45 Av. de la Mer, 06400 Cannes", type: "Villa" },
  ]);

  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mes Logements</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Ajouter un logement
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="bg-gray-100 h-40 flex items-center justify-center">
              <House className="h-16 w-16 text-gray-400" />
            </div>
            <CardHeader>
              <CardTitle>{property.name}</CardTitle>
              <CardDescription>{property.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{property.address}</p>
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
        <Card className="flex flex-col items-center justify-center h-[300px] border-dashed">
          <Plus className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">Ajouter un logement</h3>
          <p className="text-sm text-gray-500 mt-2">Cliquez pour ajouter un nouveau logement</p>
        </Card>
      </div>
    </div>
  );
};

export default Properties;
