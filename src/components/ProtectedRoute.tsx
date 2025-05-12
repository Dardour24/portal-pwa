
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { checkSupabaseConfig } from "../lib/supabase";
import { toast } from "@/hooks/use-toast";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Vérification du mode preview
  const { isPreviewMode } = checkSupabaseConfig();
  const urlHasPreview = 
    window.location.search.includes('preview=true') ||
    window.location.search.includes('demo=true');
  const isDevelopment = 
    window.location.hostname === 'localhost' || 
    process.env.NODE_ENV !== 'production';
  
  // Mode preview combiné
  const isInPreviewMode = isPreviewMode || urlHasPreview || isDevelopment;

  console.log("ProtectedRoute - Environment check:", { 
    isPreviewMode, 
    urlHasPreview, 
    isDevelopment, 
    combined: isInPreviewMode,
    hostname: window.location.hostname,
    search: window.location.search
  });

  // CORRECTION: Augmentation du délai d'attente pour l'authentification
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.log("Authentification: délai d'attente dépassé après 30 secondes");
        setLoadingTimeout(true);
        toast({
          title: "Mode prévisualisation activé",
          description: "L'authentification prend trop de temps, la prévisualisation est automatiquement activée."
        });
      }, 30000); // CORRECTION: Augmenté à 30 secondes pour donner plus de temps à l'authentification
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  console.log("ProtectedRoute - Auth state:", { 
    isAuthenticated, 
    isLoading, 
    isInPreviewMode, 
    loadingTimeout 
  });

  // Si le timeout est dépassé ou en mode preview, permettre l'accès
  if ((isLoading && loadingTimeout) || isInPreviewMode) {
    console.log("Mode prévisualisation actif ou délai d'authentification dépassé, authentification contournée");
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

  if (!isAuthenticated) {
    console.log("Non authentifié, redirection vers signin");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  console.log("Authentifié, affichage du contenu");
  return <>{children}</>;
};

export default ProtectedRoute;
