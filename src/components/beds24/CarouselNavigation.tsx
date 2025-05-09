
import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselNavigationProps {
  className?: string;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({ className }) => {
  return (
    <div className={`flex justify-between mt-4 ${className || ''}`}>
      <div className="swiper-button-prev text-primary hover:text-primary-dark cursor-pointer">
        <ChevronLeft className="w-6 h-6" />
      </div>
      <div className="swiper-button-next text-primary hover:text-primary-dark cursor-pointer">
        <ChevronRight className="w-6 h-6" />
      </div>
    </div>
  );
};

export default CarouselNavigation;
