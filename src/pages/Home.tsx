
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, HousePlus, Settings } from "lucide-react";

const HomeCarouselSlides = [
  {
    id: 1,
    title: "Botnb : Votre assistant intelligent pour les réponses aux voyageurs !",
    text: "Gagnez du temps grâce à des réponses rapides et personnalisées pour tous vos voyageurs.",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Le Flux Simplifié",
    text: "Voyageur → Beds24 → Botnb → Suggestion WhatsApp → Validation → Réponse via Beds24",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Donnez vie à votre assistant !",
    text: "Rendez-vous dans 'Mes Logements' pour remplir le questionnaire unique de chaque propriété. C'est la clé pour des réponses pertinentes !",
    buttonText: "Aller à Mes Logements",
    buttonLink: "/properties"
  },
  {
    id: 4,
    title: "Liez Botnb à vos réservations",
    text: "Connectez votre compte Beds24 pour que Botnb reçoive les messages des voyageurs et puisse y répondre.",
    buttonText: "Aller à Mon Beds24",
    buttonLink: "/beds24"
  },
  {
    id: 5,
    title: "Vous avez toujours le dernier mot !",
    text: "Botnb suggère, vous validez ou modifiez via WhatsApp avant tout envoi.",
    image: "/placeholder.svg",
  }
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    // Extract first name from email if available
    if (user?.email) {
      const emailName = user.email.split("@")[0];
      const nameParts = emailName.split(".");
      if (nameParts.length > 0) {
        setFirstName(nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1));
      }
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">
        Bienvenue
        {firstName && <span className="text-primary ml-1">{firstName} !</span>}
      </h1>
      <p className="text-muted-foreground mb-8">Découvrez comment Botnb peut vous aider à gérer vos communications avec vos voyageurs</p>
      
      {/* Carousel Tutorial */}
      <div className="relative mb-12">
        <Carousel className="w-full">
          <CarouselContent>
            {HomeCarouselSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="p-1">
                  <Card className="border-none shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-full h-48 bg-muted rounded-lg mb-6 flex items-center justify-center">
                          {slide.image ? (
                            <img 
                              src={slide.image} 
                              alt={slide.title} 
                              className="max-h-full object-contain"
                            />
                          ) : (
                            <div className="text-3xl font-bold text-primary">Slide {slide.id}</div>
                          )}
                        </div>
                        <h2 className="text-2xl font-semibold mb-3">{slide.title}</h2>
                        <p className="text-muted-foreground mb-6">{slide.text}</p>
                        {slide.buttonText && slide.buttonLink && (
                          <Button 
                            onClick={() => navigate(slide.buttonLink)}
                            className="mt-4"
                          >
                            {slide.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2" />
          <CarouselNext className="absolute right-0 top-1/2" />
        </Carousel>
      </div>

      {/* Raccourcis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <HousePlus className="mr-2 h-5 w-5" /> Ajouter un Logement
            </CardTitle>
            <CardDescription>Créez et configurez un nouveau logement</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/properties')} variant="default">
              Ajouter maintenant
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all duration-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" /> Configurer Beds24
            </CardTitle>
            <CardDescription>Liez votre compte Beds24 pour synchroniser vos réservations</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/beds24')} variant="default">
              Configurer
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
