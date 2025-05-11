
import { House, PenBox, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/property";
import { motion } from "framer-motion";

interface PropertyCardProps {
  property: Property;
  onDelete: (propertyId: string) => void;
  onEdit: (propertyId: string) => void;
  onManageKnowledgeBase: (propertyId: string) => void;
}

export const PropertyCard = ({ 
  property, 
  onDelete, 
  onEdit,
  onManageKnowledgeBase 
}: PropertyCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden rounded-card shadow-card hover:shadow-card-hover transition-all">
        <div className="bg-gray-100 h-40 flex items-center justify-center">
          <House className="h-16 w-16 text-gray-400" />
        </div>
        <CardHeader>
          <CardTitle>{property.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">{property.address || "Aucune adresse"}</p>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex-1 hover:bg-gray-50"
                onClick={() => property.id && onEdit(property.id)}
              >
                <PenBox className="h-4 w-4 mr-1" />
                Modifier
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                className="hover:bg-red-600 transition-colors"
                onClick={() => property.id && onDelete(property.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Supprimer
              </Button>
            </div>
            <Button 
              variant="default" 
              size="sm"
              className="w-full btn-primary-hover"
              onClick={() => property.id && onManageKnowledgeBase(property.id)}
            >
              <PenBox className="h-4 w-4 mr-1" />
              Base de connaissances
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
