
import { CirclePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
  onAddProperty: () => void;
  onDelete: (propertyId: string) => void;
  onEdit: (propertyId: string) => void;
  onManageKnowledgeBase: (propertyId: string) => void;
}

export const PropertyList = ({ 
  properties, 
  isLoading, 
  onAddProperty, 
  onDelete, 
  onEdit,
  onManageKnowledgeBase 
}: PropertyListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProperties = searchTerm 
    ? properties.filter(property => 
        property.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : properties;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un logement..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-lg"></div>
          ))}
        </div>
      ) : filteredProperties.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onDelete={onDelete}
              onEdit={onEdit}
              onManageKnowledgeBase={onManageKnowledgeBase}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
          <div className="flex justify-center mb-4">
            <CirclePlus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Aucun logement trouvé</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchTerm 
              ? "Essayez de modifier votre recherche ou d'ajouter un nouveau logement." 
              : "Vous n'avez pas encore ajouté de logement. Cliquez sur 'Ajouter un Logement' pour commencer."}
          </p>
          <Button onClick={onAddProperty}>
            <CirclePlus className="h-5 w-5 mr-1" />
            Ajouter un logement
          </Button>
        </div>
      )}
    </div>
  );
};
