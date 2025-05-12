
import { PenBox, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/property";
import { motion } from "framer-motion";
import { useState } from "react";

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
  // Utilisation d'une image par défaut si aucune image n'est fournie ou en cas d'erreur
  const defaultImage = "https://images.unsplash.com/photo-1487958449943-2429e8be8625"; 
  const [imgSrc, setImgSrc] = useState<string>(property.imageUrl || defaultImage);

  // Gestionnaire d'erreur pour l'image
  const handleImageError = () => {
    console.log("Image error, using default for:", property.name);
    setImgSrc(defaultImage);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden rounded-card shadow-card hover:shadow-card-hover transition-all">
        <div className="bg-gray-100 h-40 overflow-hidden">
          <img 
            src={imgSrc} 
            alt={property.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
            loading="lazy"
          />
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
                <PenBox className="h-4 w-4 mr-1" aria-hidden="true" />
                Modifier
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                className="hover:bg-red-600 transition-colors"
                onClick={() => property.id && onDelete(property.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
                Supprimer
              </Button>
            </div>
            <Button 
              variant="default" 
              size="sm"
              className="w-full btn-primary-hover"
              onClick={() => property.id && onManageKnowledgeBase(property.id)}
            >
              <PenBox className="h-4 w-4 mr-1" aria-hidden="true" />
              Base de connaissances
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
