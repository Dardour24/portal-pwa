
import { useState } from 'react';
import { SlideData, carouselSlides } from './carouselData';

export interface CarouselData {
  slides: SlideData[];
  swiperInstance: any;
  setSwiperInstance: (instance: any) => void;
  goToNextSlide: () => void;
  goToPrevSlide: () => void;
}

export const useCarouselData = (): CarouselData => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  
  // Fonction pour naviguer à la slide suivante
  const goToNextSlide = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };
  
  // Fonction pour naviguer à la slide précédente
  const goToPrevSlide = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  return {
    slides: carouselSlides,
    swiperInstance,
    setSwiperInstance,
    goToNextSlide,
    goToPrevSlide
  };
};
