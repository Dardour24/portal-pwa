import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CardItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({
  id,
  title,
  icon,
  isSelected,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      className="h-[200px]"
    >
      <Card
        className={`relative overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 text-center cursor-pointer group h-full ${
          isSelected ? "ring-2 ring-primary ring-offset-2" : ""
        }`}
        onClick={() => onClick(id)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-6 flex flex-col items-center justify-center h-full relative z-10">
          <div className="transform group-hover:scale-110 transition-transform duration-300 mb-4">
            {icon}
          </div>
          <h3 className="font-medium text-lg group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CardItem;
