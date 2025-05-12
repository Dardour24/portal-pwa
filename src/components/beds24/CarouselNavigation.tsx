
import React from 'react';

const CarouselNavigation: React.FC = () => {
  return (
    <div className="flex justify-between mt-4" role="group" aria-label="Contrôles du carousel">
      <div 
        className="swiper-button-prev text-primary hover:text-primary-dark"
        tabIndex={0}
        role="button"
        aria-label="Slide précédent"
      ></div>
      <div 
        className="swiper-button-next text-primary hover:text-primary-dark"
        tabIndex={0}
        role="button"
        aria-label="Slide suivant"
      ></div>
    </div>
  );
};

export default CarouselNavigation;
