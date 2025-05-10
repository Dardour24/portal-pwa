
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extraire le paramètre redirect de l'URL
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || "/";
  
  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    console.log("Tentative de connexion avec:", email);

    try {
      const result = await login(email, password);
      console.log("Résultat de connexion:", result);
      
      if (result.user) {
        toast({
          title: "Connecté avec succès",
          description: "Bienvenue sur votre portail client Botnb.",
        });
        navigate(redirectPath);
      } else {
        setError("Erreur de connexion : identifiants invalides.");
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe invalide.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Erreur pendant la connexion:", error);
      
      // Gestion spécifique des erreurs
      if (error.message) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email ou mot de passe incorrect. Veuillez réessayer.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Veuillez vérifier votre email pour confirmer votre compte.");
        } else {
          setError(error.message || "Une erreur est survenue lors de la connexion.");
        }
      } else {
        setError("Une erreur est survenue lors de la connexion.");
      }
      
      toast({
        title: "Erreur de connexion",
        description: error.message || "Email ou mot de passe invalide.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/b97f6b22-40f5-4de9-9245-072e4eeb6895.png" 
            alt="Botnb Logo" 
            className="h-16 mx-auto mb-4" 
          />
          <h2 className="text-3xl font-bold">Portail Client Botnb</h2>
          {redirectPath && redirectPath !== "/" && (
            <p className="text-sm text-muted-foreground mt-2">
              Vous serez redirigé vers: {redirectPath}
            </p>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour accéder à votre portail client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link 
                    to="#" 
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte ?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                S'inscrire
              </Link>
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set('preview', 'true');
                window.location.href = redirectPath + (redirectPath.includes('?') ? '&' : '?') + 'preview=true';
              }}
              className="text-xs"
            >
              Mode démonstration
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
