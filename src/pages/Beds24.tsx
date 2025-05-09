
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Beds24Carousel from "@/components/beds24/Beds24Carousel";

const Beds24 = () => {
  // Scroll to carousel section
  const scrollToCarousel = () => {
    const element = document.getElementById('carousel-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
      <Beds24Carousel />

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
    </div>
  );
};

export default Beds24;
