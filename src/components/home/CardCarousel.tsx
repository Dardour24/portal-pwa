import React, { useEffect, useRef, useState } from "react";
import CardItem from "./CardItem";
import CardDetail from "./CardDetail";
import { cardData } from "./CardData";

const INTERVAL_TIME = 7000; // 7 seconds

interface CardCarouselProps {
  onError: (isError: boolean) => void;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ onError }) => {
  const [selectedCard, setSelectedCard] = useState<string>("beds24"); // Default to beds24
  const intervalRef = useRef<number | null>(null);
  
  // Carousel automatic rotation with error handling
  useEffect(() => {
    const startCarousel = () => {
      try {
        // Clear any existing interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        // Set new interval
        intervalRef.current = window.setInterval(() => {
          setSelectedCard(current => {
            try {
              const currentIndex = cardData.findIndex(card => card.id === current);
              const nextIndex = (currentIndex + 1) % cardData.length;
              console.log("Auto-rotating from", current, "to", cardData[nextIndex].id);
              return cardData[nextIndex].id;
            } catch (error) {
              console.error("Error updating carousel:", error);
              return current; // Keep current on error
            }
          });
        }, INTERVAL_TIME);
      } catch (error) {
        console.error("Error starting carousel:", error);
        onError(true);
      }
    };

    // Initial start of carousel
    startCarousel();

    // Cleanup on component unmount
    return () => {
      try {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } catch (error) {
        console.error("Error cleaning up carousel:", error);
        onError(true);
      }
    };
  }, [onError]);

  // Handle card click - reset interval when user interacts
  const handleCardClick = (cardId: string) => {
    try {
      console.log("Card clicked:", cardId);
      setSelectedCard(cardId);
      
      // Reset interval after manual selection
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Restart the interval
      intervalRef.current = window.setInterval(() => {
        setSelectedCard(current => {
          const currentIndex = cardData.findIndex(card => card.id === current);
          const nextIndex = (currentIndex + 1) % cardData.length;
          console.log("Auto-rotating from", current, "to", cardData[nextIndex].id);
          return cardData[nextIndex].id;
        });
      }, INTERVAL_TIME);
    } catch (error) {
      console.error("Error handling card click:", error);
      onError(true);
    }
  };

  // Get the currently selected card data
  const currentCard = cardData.find(card => card.id === selectedCard) || cardData[0];

  console.log("Current selected card:", selectedCard, "Current card data:", currentCard);

  return (
    <>
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cardData.map((card) => (
          <CardItem 
            key={card.id}
            id={card.id}
            title={card.title}
            icon={card.icon}
            isSelected={selectedCard === card.id}
            onClick={handleCardClick}
          />
        ))}
      </div>
      
      {/* Selected Card Content */}
      {currentCard && (
        <CardDetail
          key={currentCard.id} // Force re-render when card changes
          text={currentCard.text}
          image={currentCard.image}
          title={currentCard.title}
          buttonText={currentCard.buttonText}
          buttonLink={currentCard.buttonLink}
        />
      )}
    </>
  );
};

export default CardCarousel;