
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Link, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Beds24 = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const carouselRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteCodeSubmitted, setInviteCodeSubmitted] = useState(false);
  
  // Scroll to carousel section
  const scrollToCarousel = () => {
    const element = document.getElementById('carousel-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Setup form for invite code
  const form = useForm({
    defaultValues: {
      inviteCode: "",
    },
  });
  
  // Handle invite code submission
  const onSubmit = async (values) => {
    if (!user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour soumettre un code d'invitation.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the client's invite_code in the database
      const { error } = await supabase
        .from('clients')
        .update({ invite_code: values.inviteCode })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setInviteCodeSubmitted(true);
      toast({
        title: "Succès",
        description: "Les informations ont bien été reçues.",
        variant: "default",
        className: "bg-green-500 text-white",
      });
      
      form.reset();
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'enregistrement du code.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Carousel slides configuration
  const slides = [
    {
      id: 1,
      text: "Dans votre Beds24 aller sur la Page : 'Properties / Access'\n\nSélectionner votre Logement",
      image: "/lovable-uploads/baa3c4fc-3ff7-4148-963f-5bc537c31b30.png",
    },
    {
      id: 2,
      text: "Dans la même page aller sur : 'Make property available in another account'\n\nConnecter Botnb à votre logement en renseignant :\n\nAccount Username : ThomasBotnB\nAssociation Code : ZY130204\n\nCliquez sur 'SAVE'",
      image: "/lovable-uploads/b2a6b5d6-c111-44a7-b62e-bd7cefdfdd22.png",
    },
    {
      id: 3,
      text: "Sur la même page après avoir 'SAVE' :\n\nUne nouvelle section apparaît :\n\n'Property is Available in Linked Accounts'\n\nCette section confirme que le lien avec Botnb est confirmé.",
      image: "/lovable-uploads/558fced9-1b9c-4f82-9ec5-ee48d68749ec.png",
    },
    {
      id: 4,
      text: "Dans votre Beds24 transmettez nous un 'invite code' :\n\nInstructions pour générer un code d'invitation :\nCliquez sur ce lien pour accéder à la page 'Generate invite code'",
      image: "/lovable-uploads/341e6955-a1da-478b-ac1e-8eb258d95757.png",
    },
    {
      id: 5,
      text: "Sur la page 'Generate invite code' :\n\nDans 'Select which properties this token can access', sélectionnez\n\n'All owned or linked to account'.",
      image: "/lovable-uploads/c33cab03-8a94-4545-955a-0fa807a3ab47.png",
    },
    {
      id: 6,
      text: "Sur la page 'Generate invite code' :\n\nCliquez sur 'Generate invite code' pour créer le code d'invitation.\n\nVous allez être redirigé vers une nouvelle page nommée :\n'Invite Codes'",
      image: "/lovable-uploads/837559f4-24c8-47b6-b01e-5563454fdd5a.png",
    },
    {
      id: 7,
      text: "Sur la page 'Invite Codes' :\n\nCopier le code en cliquant sur la petite image devant le code",
      image: "/lovable-uploads/ffc38b20-7226-4b84-8ff7-f9d7656ef0f1.png",
    },
    {
      id: 8,
      text: "Copiez le code\n\nDans le champ ci-dessous.",
      image: "/lovable-uploads/e45b0547-e392-40bb-baaf-dc35ef8affc9.png",
      showForm: true
    },
  ];

  return (
    <div>
      {/* Section d'introduction */}
      <section id="intro-section" className="bg-gray-100 py-10 rounded-lg mb-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 flex justify-center">
              <img 
                src="/lovable-uploads/e45b0547-e392-40bb-baaf-dc35ef8affc9.png"
                alt="BotnB Logo" 
                className="max-h-[400px] rounded-lg object-contain"
              />
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-4">BotnB a besoin de se connecter à votre Beds24</h1>
              <h2 className="text-xl text-muted-foreground mb-6">Configurez votre Beds24 pour que Botnb se connecte à votre logement.</h2>
              <Button onClick={scrollToCarousel} className="mt-4">
                Configurer Mon Beds24 <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Carousel */}
      <section id="carousel-section" className="py-12">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Guide de configuration Beds24</h2>
          
          <div className="carousel-container max-w-4xl mx-auto">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              navigation={{
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next',
              }}
              pagination={{ 
                clickable: true, 
                el: '.swiper-pagination'
              }}
              ref={carouselRef}
              className="bg-white rounded-xl shadow-md"
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="p-6 flex flex-col items-center">
                    <div className="image-container mb-6 w-full flex justify-center">
                      <img 
                        src={slide.image} 
                        alt={`Étape ${slide.id}`} 
                        className="max-h-[300px] rounded-lg object-contain"
                      />
                    </div>
                    <div className="text-content mb-6">
                      <p className="text-center whitespace-pre-line">{slide.text}</p>
                    </div>
                    {slide.showForm ? (
                      <div className="w-full max-w-md">
                        {!inviteCodeSubmitted ? (
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="inviteCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Votre Invite Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Collez votre code d'invitation ici" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Envoi en cours..." : "Soumettre"}
                              </Button>
                            </form>
                          </Form>
                        ) : (
                          <div className="bg-green-100 p-4 rounded-md text-center">
                            <p className="text-green-700 font-medium">Les informations ont bien été reçues</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="custom-next-button"
                        onClick={() => {
                          const swiper = carouselRef.current?.swiper;
                          if (swiper) {
                            swiper.slideNext();
                          }
                        }}
                      >
                        Étape suivante
                      </Button>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" className="swiper-button-prev">
                <ChevronLeft className="h-5 w-5" />
                Précédent
              </Button>
              <div className="swiper-pagination"></div>
              <Button variant="outline" className="swiper-button-next">
                Suivant
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section supplémentaire d'informations */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>À propos de l'intégration Beds24</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <h3 className="text-lg font-medium mb-2">Avantages de l'intégration Beds24</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Synchronisation automatique des calendriers</li>
              <li>Gestion centralisée des réservations</li>
              <li>Mise à jour des tarifs en temps réel</li>
              <li>Suivi des disponibilités</li>
            </ul>
          </div>
          <p>
            L'intégration avec Beds24 vous permet de gérer efficacement vos propriétés
            à partir d'une seule plateforme. Pour plus d'informations, consultez notre documentation.
          </p>
        </CardContent>
      </Card>
      
      {/* CSS personnalisé pour Swiper - Corrigé la balise style */}
      <style>
        {`
        .swiper {
          width: 100%;
          border-radius: 0.75rem;
        }
        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .swiper-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #ccc;
          opacity: 1;
          margin: 0 5px;
        }
        .swiper-pagination-bullet-active {
          background: hsl(var(--primary));
        }
        `}
      </style>
    </div>
  );
};

export default Beds24;
