
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useCarouselData } from './useCarouselData';
import { SlideData } from './carouselData';
import CarouselSlide from './CarouselSlide';
import CarouselInviteForm from './CarouselInviteForm';
import CarouselNavigation from './CarouselNavigation';
import CarouselStyles from './CarouselStyles';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Beds24Carousel = () => {
  const { slides, swiperInstance, setSwiperInstance, goToNextSlide, goToPrevSlide } = useCarouselData();

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
            {slides.map((slide: SlideData, index: number) => (
              <SwiperSlide key={index}>
                <CarouselSlide 
                  image={slide.image} 
                  alt={slide.alt} 
                  text={slide.text}
                  onNext={goToNextSlide}
                  onPrev={goToPrevSlide}
                  isFirst={index === 0}
                  isLast={index === slides.length - 1}
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
      
      <CarouselStyles />
    </section>
  );
};

export default Beds24Carousel;
