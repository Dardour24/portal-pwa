
import { House, PenBox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
  onViewDetails: (propertyId: string) => void;
  onEdit: (propertyId: string) => void;
  onManageKnowledgeBase: (propertyId: string) => void;
}

export const PropertyCard = ({ 
  property, 
  onViewDetails, 
  onEdit,
  onManageKnowledgeBase 
}: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gray-100 h-40 flex items-center justify-center">
        <House className="h-16 w-16 text-gray-400" />
      </div>
      <CardHeader>
        <CardTitle>{property.name}</CardTitle>
        <CardDescription>{property.is_active ? "Actif" : "Inactif"}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{property.address || "Aucune adresse"}</p>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => property.id && onViewDetails(property.id)}
            >
              Voir détails
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => property.id && onEdit(property.id)}
            >
              Modifier
            </Button>
          </div>
          <Button 
            variant="default" 
            size="sm"
            className="w-full"
            onClick={() => property.id && onManageKnowledgeBase(property.id)}
          >
            <PenBox className="h-4 w-4 mr-1" />
            Base de connaissances
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
