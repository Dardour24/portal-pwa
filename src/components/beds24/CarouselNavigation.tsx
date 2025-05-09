
import React from 'react';

const CarouselNavigation: React.FC = () => {
  return (
    <div className="flex justify-between mt-4">
      <div className="swiper-button-prev text-primary hover:text-primary-dark"></div>
      <div className="swiper-button-next text-primary hover:text-primary-dark"></div>
    </div>
  );
};

export default CarouselNavigation;
