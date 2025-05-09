
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Beds24Carousel = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
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
  
  // Fonction pour soumettre le code d'invitation
  const submitInviteCode = async () => {
    if (!inviteCode.trim()) {
      toast.error("Veuillez entrer un code d'invitation");
      return;
    }
    
    if (!user) {
      toast.error("Vous devez être connecté pour soumettre un code");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('clients')
        .update({ invite_code: inviteCode })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Les informations ont bien été reçues");
      setInviteCode("");
    } catch (error) {
      console.error("Erreur lors de la soumission du code:", error);
      toast.error("Une erreur est survenue lors de la soumission du code");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Données des slides
  const slides = [
    {
      text: "Dans votre Beds24 aller sur la Page : 'Properties / Access'\n\nSélectionner votre Logement",
      image: "/lovable-uploads/3e44db25-efb0-4404-a391-fe875dc4c4bf.png",
      alt: "Sélection du logement dans Beds24"
    },
    {
      text: "Dans la même page aller sur : 'Make property available in another account'\n\nConnecter Botnb à votre logement en renseignant :\n\nAccount Username : ThomasBotnB\nAssociation Code : ZY130204\n\nCliquez sur 'SAVE'",
      image: "/lovable-uploads/7ea62510-43dc-4f41-87ba-291f6eb498bd.png",
      alt: "Connexion à Botnb"
    },
    {
      text: "Sur la même page après avoir 'SAVE' :\n\nUne nouvelle section apparaît :\n\n'Property is Available in Linked Accounts'\n\nCette section confirme que le lien avec Botnb est confirmé.",
      image: "/lovable-uploads/e8d773f1-9d6f-4c83-a244-1cfc20884af2.png",
      alt: "Confirmation de la connexion"
    },
    {
      text: "Dans votre Beds24 transmettez nous un 'invite code' :\n\nInstructions pour générer un code d'invitation :\nCliquez sur ce lien pour accéder à la page 'Generate invite code'",
      image: "/lovable-uploads/cf54db6b-df2a-4c4c-8203-1252bcfbf780.png",
      alt: "Accès à la génération du code d'invitation"
    },
    {
      text: "Sur la page 'Generate invite code' :\n\nDans 'Select which properties this token can access', sélectionnez\n\n'All owned or linked to account'.",
      image: "/lovable-uploads/fd4b6db2-4b35-460b-87fd-7002a3dbb31d.png",
      alt: "Sélection des propriétés"
    },
    {
      text: "Sur la page 'Generate invite code' :\n\nCliquez sur 'Generate invite code' pour créer le code d'invitation.\n\nVous allez être redirigé vers une nouvelle page nommée :\n'Invite Codes'",
      image: "/lovable-uploads/bff86d4f-9a39-4e7e-a207-e94ebe079a90.png",
      alt: "Génération du code d'invitation"
    },
    {
      text: "Sur la page 'Invite Codes' :\n\nCopier le code en cliquant sur la petite image devant le code",
      image: "/lovable-uploads/5c89754f-31cd-499f-9a11-a8ad617b470a.png",
      alt: "Copie du code d'invitation"
    }
  ];

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
                <Card className="border rounded-lg overflow-hidden">
                  <div className="p-6 flex flex-col items-center">
                    <div className="mb-6 h-[300px] flex items-center justify-center">
                      <img 
                        src={slide.image} 
                        alt={slide.alt} 
                        className="max-h-[300px] rounded-lg object-contain" 
                      />
                    </div>
                    <div className="text-center mb-6">
                      <p className="whitespace-pre-line">{slide.text}</p>
                    </div>
                    <div className="flex gap-4">
                      {index > 0 && (
                        <Button variant="outline" onClick={goToPrevSlide}>
                          Étape précédente
                        </Button>
                      )}
                      {index < slides.length && (
                        <Button variant="outline" onClick={goToNextSlide}>
                          Étape suivante
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </SwiperSlide>
            ))}
            
            {/* Dernière slide avec le formulaire */}
            <SwiperSlide>
              <Card className="border rounded-lg overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="mb-6 h-[300px] flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/491cf472-5a9d-43f2-87cb-a122e4d3d45b.png" 
                      alt="BotnB Logo" 
                      className="max-h-[300px] rounded-lg object-contain" 
                    />
                  </div>
                  <div className="text-center mb-6">
                    <p className="whitespace-pre-line">Copiez le code\n\nDans le champ ci-dessous.</p>
                  </div>
                  <div className="w-full max-w-md space-y-4">
                    <div>
                      <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Votre Invite Code
                      </label>
                      <Input 
                        id="inviteCode"
                        type="text"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        placeholder="Collez votre code d'invitation ici"
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" onClick={goToPrevSlide}>
                        Étape précédente
                      </Button>
                      <Button 
                        onClick={submitInviteCode}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Soumission..." : "Soumettre"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          </Swiper>
          
          {/* Navigation personnalisée */}
          <div className="flex justify-between mt-4">
            <div className="swiper-button-prev text-primary hover:text-primary-dark"></div>
            <div className="swiper-button-next text-primary hover:text-primary-dark"></div>
          </div>
        </div>
      </div>
      
      <style>
        {`
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
        `}
      </style>
    </section>
  );
};

export default Beds24Carousel;
