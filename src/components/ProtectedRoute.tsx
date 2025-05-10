
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { checkSupabaseConfig, testSupabaseConnection } from "../lib/supabase";
import { Button } from "./ui/button";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionTested, setConnectionTested] = useState(false);
  
  // Vérifier les paramètres d'URL pour le mode démonstration
  const searchParams = new URLSearchParams(window.location.search);
  const isUrlPreviewMode = 
    searchParams.has('preview') || 
    searchParams.has('demo') || 
    searchParams.has('debug');
    
  // Vérifier le mode prévisualisation depuis différentes sources
  const isPreviewMode = 
    window.location.hostname === 'localhost' || 
    isUrlPreviewMode ||
    process.env.NODE_ENV !== 'production' ||
    import.meta.env.VITE_PREVIEW_MODE === 'true';

  // Ajouter un délai de chargement pour éviter le chargement infini
  useEffect(() => {
    if (isLoading && !connectionTested) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
        // Tester la connexion Supabase si le chargement prend trop de temps
        testSupabaseConnection().then(result => {
          setConnectionTested(true);
          if (!result.success) {
            setConnectionError(result.error || "Échec de la connexion à la base de données");
          }
        });
      }, 3000); // 3 secondes de délai
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, connectionTested]);

  console.log("ProtectedRoute - Auth State:", { 
    isAuthenticated, 
    isLoading, 
    isPreviewMode, 
    isUrlPreviewMode, 
    loadingTimeout,
    connectionTested,
    connectionError,
    hostname: window.location.hostname,
    path: location.pathname
  });
  
  const config = checkSupabaseConfig();
  console.log("Supabase Config:", config);

  // Si le chargement a expiré et nous sommes en mode prévisualisation,
  // ou si une erreur de connexion est survenue, autoriser l'accès
  if ((isLoading && loadingTimeout && (isPreviewMode || connectionError)) || 
      (connectionError && isPreviewMode)) {
    console.log("Accès accordé en mode prévisualisation ou à cause d'une erreur");
    
    // Si une erreur de connexion s'est produite, afficher un avertissement
    if (connectionError) {
      return (
        <>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Problème de connexion à Supabase</AlertTitle>
            <AlertDescription>
              {connectionError}. Accès en mode démonstration activé.
            </AlertDescription>
          </Alert>
          {children}
        </>
      );
    }
    
    return <>{children}</>;
  }

  if (isLoading && !loadingTimeout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <Skeleton className="h-[250px] w-full max-w-md mb-4 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-md mb-2" />
        <Skeleton className="h-4 w-3/4 max-w-[300px] mb-2" />
        <Skeleton className="h-4 w-1/2 max-w-[200px]" />
      </div>
    );
  }

  // Si le chargement a expiré mais que nous ne sommes pas en mode prévisualisation,
  // afficher un message d'erreur avec un lien vers la page de connexion
  if (isLoading && loadingTimeout && !isPreviewMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <Alert variant="destructive" className="max-w-md mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Problème d'authentification</AlertTitle>
          <AlertDescription>
            La vérification de l'authentification a pris trop de temps. Veuillez vous reconnecter.
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.href = "/signin?redirect=" + encodeURIComponent(location.pathname)}>
          Aller à la page de connexion
        </Button>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={() => window.location.href = location.pathname + (location.search ? location.search + "&preview=true" : "?preview=true")}
        >
          Activer le mode prévisualisation
        </Button>
      </div>
    );
  }

  // Autoriser l'accès en mode prévisualisation quelle que soit l'authentification
  if (isPreviewMode) {
    console.log("Mode prévisualisation actif, authentification ignorée");
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    console.log("Non authentifié, redirection vers signin");
    // Conserver l'URL actuelle pour la redirection après connexion
    return <Navigate to={`/signin?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  console.log("Authentifié, affichage du contenu protégé");
  return <>{children}</>;
};

export default ProtectedRoute;
