
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

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
  onClick 
}) => {
  return (
    <Card 
      className={`bg-white hover:shadow-md transition-all duration-200 text-center cursor-pointer ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => onClick(id)}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center h-full">
        {icon}
        <h3 className="font-medium mb-1">{title}</h3>
      </CardContent>
    </Card>
  );
};

export default CardItem;
