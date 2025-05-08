
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Accueil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue, {user?.email}</CardTitle>
            <CardDescription>Portail Client Botnb</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Gérez vos logements et accédez à vos services facilement depuis ce tableau de bord.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mes Logements</CardTitle>
            <CardDescription>Gestion de vos propriétés</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Consultez et gérez tous vos logements.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mon Beds24</CardTitle>
            <CardDescription>Connectivité avec Beds24</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Synchronisez et gérez vos calendriers Beds24.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
