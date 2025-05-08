
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/properties/PropertyCard";

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
  onAddProperty: () => void;
  onViewDetails: (propertyId: string) => void;
  onEdit: (propertyId: string) => void;
}

export const PropertyList = ({ 
  properties, 
  isLoading, 
  onAddProperty,
  onViewDetails,
  onEdit 
}: PropertyListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard 
          key={property.id} 
          property={property}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
        />
      ))}
      
      {/* Add Property Card */}
      <Card 
        className="flex flex-col items-center justify-center h-[300px] border-dashed cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onAddProperty}
      >
        <Plus className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-600">Ajouter un logement</h3>
        <p className="text-sm text-gray-500 mt-2">Cliquez pour ajouter un nouveau logement</p>
      </Card>
    </div>
  );
};
