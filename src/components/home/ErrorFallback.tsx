
import React from "react";
import { Button } from "@/components/ui/button";

const ErrorFallback: React.FC = () => {
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
};

export default ErrorFallback;
