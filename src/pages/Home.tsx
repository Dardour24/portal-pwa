
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Home as HomeIcon, Mail, MessageSquare, Phone } from "lucide-react";

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
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">
          Bienvenue sur votre Espace Botnb
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Botnb ne demande qu'à vous connaître et vous aider !
        </p>
        <p className="text-lg text-muted-foreground mb-2">
          Rendez-vous sur votre "Zone d'Apprentissage"
        </p>
        <p className="text-lg text-muted-foreground">
          pour transmettre à votre Botnb toutes les informations de votre Logement !
        </p>
      </div>
      
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Card className="bg-white hover:shadow-md transition-all duration-200 text-center">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <HomeIcon className="h-8 w-8 mb-4 text-primary" />
            <h3 className="font-medium mb-1">Transmettez les</h3>
            <h3 className="font-medium mb-1">Informations</h3>
            <h3 className="font-medium mb-1">de votre</h3>
            <h3 className="font-medium">Logement</h3>
            <div className="border-b w-full mt-4"></div>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-all duration-200 text-center">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <MessageSquare className="h-8 w-8 mb-4 text-primary" />
            <h3 className="font-medium mb-1">Configurer vos</h3>
            <h3 className="font-medium mb-1">accès à Beds24</h3>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-all duration-200 text-center">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <Mail className="h-8 w-8 mb-4 text-primary" />
            <h3 className="font-medium mb-1">Recevez les</h3>
            <h3 className="font-medium mb-1">réponses de</h3>
            <h3 className="font-medium mb-1">Botnb par</h3>
            <h3 className="font-medium">Email</h3>
          </CardContent>
        </Card>
        
        <Card className="bg-white hover:shadow-md transition-all duration-200 text-center">
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <Phone className="h-8 w-8 mb-4 text-primary" />
            <h3 className="font-medium mb-1">Contactez</h3>
            <h3 className="font-medium">Nous</h3>
          </CardContent>
        </Card>
      </div>
      
      {/* Reminder Text */}
      <div className="text-center mb-10">
        <p className="text-lg text-muted-foreground">
          Rendez-vous sur votre "Zone d'Apprentissage" pour transmettre à votre Botnb toutes les informations sur votre Logement !
        </p>
      </div>
      
      {/* Image Section */}
      <div className="flex justify-center mb-6">
        <img 
          src="/lovable-uploads/e0275547-126a-4f3d-87cd-e9496acd16c0.png"
          alt="Utilisateurs de Botnb" 
          className="rounded-lg max-w-full h-auto"
          style={{ maxHeight: '400px' }}
        />
      </div>
      
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
