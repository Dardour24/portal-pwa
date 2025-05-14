import { CirclePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
  onAddProperty: () => void;
  onDelete: (propertyId: string) => void;
  onEdit: (propertyId: string) => void;
  onManageKnowledgeBase: (propertyId: string) => void;
  // Pagination props
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const PropertyList = ({
  properties,
  isLoading,
  onAddProperty,
  onDelete,
  onEdit,
  onManageKnowledgeBase,
  page = 1,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
}: PropertyListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const hasExistingProperty = properties.length > 0;

  const filteredProperties = useMemo(() => {
    if (!searchTerm) return properties;

    return properties.filter(
      (property) =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (property.address &&
          property.address.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [properties, searchTerm]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Generate pagination numbers
  const paginationItems = useMemo(() => {
    const items = [];
    const maxPaginationItems = 5;

    if (totalPages <= maxPaginationItems) {
      // If there are few pages, show all of them
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Always show first page
      items.push(1);

      // Calculate range around current page
      const leftBoundary = Math.max(2, page - 1);
      const rightBoundary = Math.min(totalPages - 1, page + 1);

      // Add ellipsis if needed on left side
      if (leftBoundary > 2) {
        items.push("ellipsis-left");
      }

      // Add pages around current page
      for (let i = leftBoundary; i <= rightBoundary; i++) {
        items.push(i);
      }

      // Add ellipsis if needed on right side
      if (rightBoundary < totalPages - 1) {
        items.push("ellipsis-right");
      }

      // Always show last page
      items.push(totalPages);
    }

    return items;
  }, [page, totalPages]);

  return (
    <div className="space-y-6">
      {hasExistingProperty && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <InfoIcon className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            En version bêta, vous ne pouvez créer qu'un seul logement. Pour
            ajouter d'autres logements, veuillez attendre la version finale.
          </AlertDescription>
        </Alert>
      )}

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
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          {onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Afficher:</span>
              <Select
                defaultValue="10"
                onValueChange={(value) => onPageSizeChange(parseInt(value))}
              >
                <SelectTrigger className="w-[80px] h-10">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          {!hasExistingProperty && (
            <Button onClick={onAddProperty} className="btn-primary-hover">
              <CirclePlus className="h-5 w-5 mr-1" />
              Ajouter un logement
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-card"></div>
          ))}
        </div>
      ) : filteredProperties.length ? (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredProperties.map((property) => (
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

          {/* Pagination */}
          {totalPages > 1 && onPageChange && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) onPageChange(page - 1);
                    }}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {paginationItems.map((item, index) =>
                  typeof item === "number" ? (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onPageChange(item);
                        }}
                        isActive={page === item}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) onPageChange(page + 1);
                    }}
                    className={
                      page >= totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
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
          <Button onClick={onAddProperty} className="btn-primary-hover">
            <CirclePlus className="h-5 w-5 mr-1" />
            Ajouter un logement
          </Button>
        </motion.div>
      )}
    </div>
  );
};
