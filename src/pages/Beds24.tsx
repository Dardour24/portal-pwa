
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

const Beds24 = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Mon Beds24</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Connecter Beds24</CardTitle>
            <CardDescription>Configurez l'intégration avec Beds24</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Connectez votre compte Beds24 pour synchroniser automatiquement vos réservations et disponibilités.
            </p>
            <div className="flex items-center space-x-4">
              <Button>
                <Link className="mr-2 h-4 w-4" /> Connecter Beds24
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Statut de la connexion</CardTitle>
            <CardDescription>État actuel de la synchronisation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <p>Non connecté</p>
            </div>
            <p className="text-sm text-gray-500">
              Veuillez connecter votre compte Beds24 pour accéder aux fonctionnalités de synchronisation.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
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
