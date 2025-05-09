import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const items = [
  {
    title: "Étape 1: Créer une Clé API dans Beds24",
    description: "Connectez-vous à votre compte Beds24 et créez une clé API. Cette clé permettra à Botnb de communiquer en toute sécurité avec votre compte.",
    image: "/lovable-uploads/499f1e3d-986d-4c33-b44d-099449c40c1f.png",
    alt: "Création d'une clé API dans Beds24"
  },
  {
    title: "Étape 2: Ajouter l'URL de Callback dans Beds24",
    description: "Dans les paramètres de l'API Beds24, ajoutez l'URL de callback fournie par Botnb. Cela permettra à Beds24 d'envoyer des mises à jour à Botnb.",
    image: "/lovable-uploads/499f1e3d-986d-4c33-b44d-099449c40c1f.png",
    alt: "Ajout de l'URL de Callback dans Beds24"
  },
  {
    title: "Étape 3: Entrer vos identifiants Beds24 dans BotnB",
    description: "Dans la page Beds24 de BotnB, entrez votre 'Property ID' et votre clé API Beds24.",
    image: "/lovable-uploads/499f1e3d-986d-4c33-b44d-099449c40c1f.png",
    alt: "Ajout de l'URL de Callback dans Beds24"
  }
];

const Beds24Carousel = () => {
  return (
    <section id="carousel-section" className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Comment connecter BotnB à votre Beds24</h2>
        <Carousel className="w-full max-w-2xl mx-auto">
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index} className="md:basis-1/3">
                <Card>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="aspect-square flex items-center justify-center p-4">
                    <img 
                      src={item.image} 
                      alt={item.alt} 
                      className="max-h-48 max-w-full rounded-md object-contain" 
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </CarouselPrevious>
          <CarouselNext className="right-2">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </CarouselNext>
        </Carousel>
      </div>
    </section>
  );
};

export default Beds24Carousel;
