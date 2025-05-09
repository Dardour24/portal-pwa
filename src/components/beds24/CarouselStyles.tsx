
import React from 'react';

const CarouselStyles: React.FC = () => {
  return (
    <style jsx="true">{`
      .swiper-pagination-bullet-active {
        background-color: hsl(var(--primary));
      }
      
      .swiper-button-next,
      .swiper-button-prev {
        color: hsl(var(--primary));
      }
      
      .swiper-button-disabled {
        opacity: 0.5;
        pointer-events: none;
      }
    `}</style>
  );
};

export default CarouselStyles;
