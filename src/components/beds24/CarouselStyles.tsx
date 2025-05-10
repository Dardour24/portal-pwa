
import React from 'react';

const CarouselStyles: React.FC = () => {
  return (
    <style>
      {`
      .swiper-pagination-bullet-active {
        background-color: hsl(var(--primary));
      }
      
      /* Masquer complètement les boutons de navigation */
      .swiper-button-next,
      .swiper-button-prev {
        display: none;
      }
      
      .swiper-button-disabled {
        opacity: 0.5;
        pointer-events: none;
      }
      `}
    </style>
  );
};

export default CarouselStyles;
