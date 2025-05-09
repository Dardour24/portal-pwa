
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import CarouselSlide from './CarouselSlide';
import CarouselInviteForm from './CarouselInviteForm';
import CarouselNavigation from './CarouselNavigation';
import { useCarouselData } from './useCarouselData';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Beds24Carousel = () => {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const { slides } = useCarouselData();
  
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

  return (
    <section id="carousel-section" className="py-12 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Comment connecter BotnB à votre Beds24</h2>
        
        <div className="w-full max-w-4xl mx-auto">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{ clickable: true }}
            spaceBetween={30}
            slidesPerView={1}
            onSwiper={(swiper) => setSwiperInstance(swiper)}
            className="rounded-lg shadow-md"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <CarouselSlide 
                  text={slide.text}
                  image={slide.image}
                  alt={slide.alt}
                  onNext={goToNextSlide}
                  onPrev={goToPrevSlide}
                  showPrevButton={index > 0}
                  showNextButton={index < slides.length - 1}
                />
              </SwiperSlide>
            ))}
            
            {/* Dernière slide avec le formulaire */}
            <SwiperSlide>
              <CarouselInviteForm onPrev={goToPrevSlide} />
            </SwiperSlide>
          </Swiper>
          
          {/* Navigation personnalisée */}
          <CarouselNavigation />
        </div>
      </div>
      
      {/* CSS personnalisé pour la pagination */}
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
    </section>
  );
};

export default Beds24Carousel;
