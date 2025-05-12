
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CardDetailProps {
  text: string;
  image: string;
  title: string;
  buttonText: string | null;
  buttonLink: string | null;
}

const CardDetail: React.FC<CardDetailProps> = ({
  text,
  image,
  title,
  buttonText,
  buttonLink,
}) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(image);
  const [imgError, setImgError] = useState(false);

  // Image de secours générique pour les images qui ne chargent pas
  const fallbackImage = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";

  const handleImageError = () => {
    console.log("Image error in CardDetail for:", title);
    
    // Essayer une alternative pour les images uploadées
    if (imgSrc.includes("/lovable-uploads/") && !imgSrc.includes(fallbackImage)) {
      // Tentative avec un chemin alternatif
      const newPath = imgSrc.replace("/lovable-uploads/", "/");
      console.log("Trying alternative path:", newPath);
      setImgSrc(newPath);
    } else if (!imgSrc.includes(fallbackImage)) {
      // Utiliser l'image de secours générique
      console.log("Using fallback image");
      setImgSrc(fallbackImage);
    } else {
      // Si même l'image de secours ne fonctionne pas
      setImgError(true);
    }
  };

  return (
    <div className="flex flex-col items-center mb-10">
      {/* Text before image */}
      <p className="text-center text-lg mb-6 max-w-3xl">
        {text}
      </p>
      
      {/* Image with error handling */}
      {!imgError ? (
        <img 
          src={imgSrc} 
          alt={title} 
          className="rounded-lg max-w-full h-auto mb-6"
          style={{ maxHeight: '400px' }}
          onError={handleImageError}
          loading="lazy"
        />
      ) : (
        <div className="bg-gray-100 rounded-lg w-full h-64 flex items-center justify-center mb-6">
          <p className="text-gray-500">{title}</p>
        </div>
      )}
      
      {/* Button if available */}
      {buttonText && buttonLink && (
        <Button 
          onClick={() => navigate(buttonLink)}
          className="mt-4"
        >
          {buttonText} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
};

export default CardDetail;
