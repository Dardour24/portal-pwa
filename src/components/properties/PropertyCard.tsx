import { PenBox, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Property } from "@/types/property";
import { motion } from "framer-motion";
import { useState } from "react";
import propertyImg from "../../asset/propertyImage.png";

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
  onManageKnowledgeBase,
}: PropertyCardProps) => {
  // Use propertyImg as default image if no image provided or on error
  const [imgSrc, setImgSrc] = useState<string>(
    property.imageUrl || propertyImg
  );

  // Handle image loading errors
  const handleImageError = () => {
    console.log("Image error, using default for:", property.name);
    setImgSrc(propertyImg);
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
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
          <p className="text-sm text-gray-500 mb-4">
            {property.address || "Aucune adresse"}
          </p>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 hover:bg-gray-50"
                onClick={() => property.id && onEdit(property.id)}
              >
                <PenBox className="h-5 w-5 mr-1" aria-hidden="true" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="hover:bg-red-600 transition-colors"
                onClick={() => property.id && onDelete(property.id)}
              >
                <Trash2 className="h-5 w-5 mr-1" aria-hidden="true" />
                Supprimer
              </Button>
            </div>
            <Button
              variant="default"
              size="sm"
              className="w-full btn-primary-hover"
              onClick={() => property.id && onManageKnowledgeBase(property.id)}
            >
              <PenBox className="h-5 w-5 mr-1" aria-hidden="true" />
              Base de connaissances
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
