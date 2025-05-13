
import { CirclePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un logement..."
            className="pl-10 h-10 rounded-md border-separator focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          onClick={onAddProperty}
          className="btn-primary-hover"
        >
          <CirclePlus className="h-5 w-5 mr-1" />
          Ajouter un logement
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-card"></div>
          ))}
        </div>
      ) : filteredProperties.length ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProperties.map(property => (
            <motion.div key={property.id} variants={itemVariants}>
              <PropertyCard 
                property={property} 
                onDelete={onDelete}
                onEdit={onEdit}
                onManageKnowledgeBase={onManageKnowledgeBase}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-12 border-2 border-dashed border-separator rounded-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center mb-4">
            <CirclePlus className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Aucun logement trouvé</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchTerm 
              ? "Essayez de modifier votre recherche ou d'ajouter un nouveau logement." 
              : "Vous n'avez pas encore ajouté de logement. Cliquez sur 'Ajouter un Logement' pour commencer."}
          </p>
          <Button 
            onClick={onAddProperty} 
            className="btn-primary-hover"
          >
            <CirclePlus className="h-5 w-5 mr-1" />
            Ajouter un logement
          </Button>
        </motion.div>
      )}
    </div>
  );
};
