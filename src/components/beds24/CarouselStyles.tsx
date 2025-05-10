
import React from 'react';

const CarouselStyles: React.FC = () => {
  return (
    <style>
      {`
      .swiper-pagination-bullet-active {
        background-color: hsl(var(--primary));
      }
      
      .swiper-button-next,
      .swiper-button-prev {
        color: hsl(var(--primary));
        /* Ajustement de la position verticale (plus bas) */
        top: 55%;
        /* Réduction de la distance horizontale par rapport aux bords */
        width: 44px;
        height: 44px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      /* Ajustement des positions horizontales spécifiques */
      .swiper-button-prev {
        left: 10px;
      }
      
      .swiper-button-next {
        right: 10px;
      }
      
      /* Ajustement de la taille des icônes de flèche */
      .swiper-button-next:after,
      .swiper-button-prev:after {
        font-size: 18px;
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
