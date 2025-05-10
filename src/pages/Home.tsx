
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Home as HomeIcon, Mail, MessageSquare, Phone } from "lucide-react";

const INTERVAL_TIME = 7000; // 7 seconds

// Card data configuration
const cardData = [
  {
    id: "beds24",
    title: "Configurer vos accès à Beds24",
    text: "Rendez-vous sur la page Beds24 pour configurer un accès à votre compte afin de le connecter à votre Botnb.",
    image: "/lovable-uploads/f4040222-fd67-46ef-bba0-b7a1fbdfe543.png",
    icon: <MessageSquare className="h-8 w-8 mb-4 text-primary" />,
    buttonText: "Mon Beds24",
    buttonLink: "/beds24"
  },
  {
    id: "logement",
    title: "Transmettez les Informations de votre Logement",
    text: "Rendez-vous sur 'Mes Logements' pour transmettre à votre Botnb toutes les informations sur votre Logement !",
    image: "/lovable-uploads/6ab33741-bb6b-436a-aee7-ad8b5b81cdff.png",
    icon: <HomeIcon className="h-8 w-8 mb-4 text-primary" />,
    buttonText: "Ajouter un Logement",
    buttonLink: "/properties/add"
  },
  {
    id: "whatsapp",
    title: "Recevez les réponses de Botnb sur votre Whatsapp",
    text: "Botnb vous propose une réponse, vous validez ou modifiez via WhatsApp et votre réponse est envoyée vers Beds24.",
    image: "/lovable-uploads/9d79d896-59e6-4ecd-b9df-318e2e5de422.png",
    icon: <Mail className="h-8 w-8 mb-4 text-primary" />,
    buttonText: null,
    buttonLink: null
  },
  {
    id: "info",
    title: "Modifier vos informations logements à tous moments",
    text: "Rendez Vous sur l'ongle 'Mes Logements' pour ajuster les informations de votre logement",
    image: "/lovable-uploads/99174476-f39b-4cfb-b37a-a91ea6ff8142.png", 
    icon: <Phone className="h-8 w-8 mb-4 text-primary" />,
    buttonText: "Mes Logements",
    buttonLink: "/properties"
  }
];

const Home = () => {
  console.log("Home component rendering");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [selectedCard, setSelectedCard] = useState<string>("beds24"); // Default to beds24
  const intervalRef = useRef<number | null>(null);
  const [isErrorState, setIsErrorState] = useState(false);
  
  // Extract first name from email
  useEffect(() => {
    try {
      if (user?.email) {
        const emailName = user.email.split("@")[0];
        const nameParts = emailName.split(".");
        if (nameParts.length > 0) {
          setFirstName(nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1));
        }
      }
    } catch (error) {
      console.error("Error processing user email:", error);
    }
  }, [user]);

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
              return cardData[nextIndex].id;
            } catch (error) {
              console.error("Error updating carousel:", error);
              return current; // Keep current on error
            }
          });
        }, INTERVAL_TIME);
      } catch (error) {
        console.error("Error starting carousel:", error);
        setIsErrorState(true);
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
      }
    };
  }, []);

  // Handle card click - reset interval when user interacts
  const handleCardClick = (cardId: string) => {
    try {
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
          return cardData[nextIndex].id;
        });
      }, INTERVAL_TIME);
    } catch (error) {
      console.error("Error handling card click:", error);
      setIsErrorState(true);
    }
  };

  // Get the currently selected card data
  const currentCard = cardData.find(card => card.id === selectedCard) || cardData[0];

  // Fallback UI if we're in an error state
  if (isErrorState) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">
            Bienvenue sur votre Espace Botnb
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            Un problème est survenu lors du chargement de cette page. Veuillez rafraîchir.
          </p>
          <Button onClick={() => window.location.reload()}>
            Rafraîchir la page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenue sur votre Espace Botnb
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Botnb ne demande qu'à vous connaître et vous aider !
        </p>
      </div>
      
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cardData.map((card) => (
          <Card 
            key={card.id}
            className={`bg-white hover:shadow-md transition-all duration-200 text-center cursor-pointer ${selectedCard === card.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              {card.icon}
              <h3 className="font-medium mb-1">{card.title}</h3>
              <div className="border-b w-full mt-4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Selected Card Content */}
      {currentCard && (
        <div className="flex flex-col items-center mb-10">
          {/* Text before image */}
          <p className="text-center text-lg mb-6 max-w-3xl">
            {currentCard.text}
          </p>
          
          {/* Image */}
          <img 
            src={currentCard.image} 
            alt={currentCard.title} 
            className="rounded-lg max-w-full h-auto mb-6"
            style={{ maxHeight: '400px' }}
          />
          
          {/* Button if available */}
          {currentCard.buttonText && currentCard.buttonLink && (
            <Button 
              onClick={() => navigate(currentCard.buttonLink!)}
              className="mt-4"
            >
              {currentCard.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {/* Quick Links for Mobile */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:hidden">
        <Button onClick={() => navigate('/properties')} className="w-full">
          Mes Logements <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button onClick={() => navigate('/beds24')} className="w-full">
          Mon Beds24 <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Home;
