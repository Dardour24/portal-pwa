
import React from "react";
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

  return (
    <div className="flex flex-col items-center mb-10">
      {/* Text before image */}
      <p className="text-center text-lg mb-6 max-w-3xl">
        {text}
      </p>
      
      {/* Image */}
      <img 
        src={image} 
        alt={title} 
        className="rounded-lg max-w-full h-auto mb-6"
        style={{ maxHeight: '400px' }}
      />
      
      {/* Button if available */}
      {buttonText && buttonLink && (
        <Button 
          onClick={() => navigate(buttonLink)}
          className="mt-4"
        >
          {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CardDetail;
