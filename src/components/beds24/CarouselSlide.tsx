
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CarouselSlideProps {
  text: string;
  image: string;
  alt: string;
  onNext?: () => void;
  onPrev?: () => void;
  showPrevButton?: boolean;
  showNextButton?: boolean;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({
  text,
  image,
  alt,
  onNext,
  onPrev,
  showPrevButton = true,
  showNextButton = true
}) => {
  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center">
        <div className="mb-6 h-[300px] flex items-center justify-center">
          <img 
            src={image} 
            alt={alt} 
            className="max-h-[300px] rounded-lg object-contain" 
          />
        </div>
        <div className="text-center mb-6">
          <p className="whitespace-pre-line">{text}</p>
        </div>
        <div className="flex gap-4">
          {showPrevButton && onPrev && (
            <Button variant="outline" onClick={onPrev}>
              Étape précédente
            </Button>
          )}
          {showNextButton && onNext && (
            <Button variant="outline" onClick={onNext}>
              Étape suivante
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CarouselSlide;
