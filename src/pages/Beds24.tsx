
import { Card, CardContent } from "@/components/ui/card";
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
      <section id="intro-section" className="bg-gray-100 py-6 md:py-10 rounded-lg mb-6 md:mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="w-full md:w-1/2 flex justify-center">
              <img 
                src="/lovable-uploads/e45b0547-e392-40bb-baaf-dc35ef8affc9.png"
                alt="BotnB Logo" 
                className="max-h-[250px] md:max-h-[400px] rounded-lg object-contain"
              />
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">BotnB a besoin de se connecter à votre Beds24</h1>
              <h2 className="text-lg md:text-xl text-muted-foreground mb-4 md:mb-6">Configurez votre Beds24 pour que Botnb se connecte à votre logement.</h2>
              <Button onClick={scrollToCarousel} className="mt-2 md:mt-4">
                Configurer Mon Beds24 <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Carousel */}
      <Beds24Carousel />
    </div>
  );
};

export default Beds24;
