import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useNavigationState } from "@/hooks/useNavigationState";
import { useErrorHandler } from "@/hooks/useErrorHandler";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { saveIntendedDestination } = useNavigationState();
  const { errorState, handleError } = useErrorHandler();
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      // Save the current path before redirecting
      saveIntendedDestination(location.pathname);
    }
  }, [isAuthenticated, isLoading, location.pathname, saveIntendedDestination]);

  // Set a timeout for authentication check
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.log(
          "Authentification: délai d'attente dépassé après 30 secondes"
        );
        setLoadingTimeout(true);
        toast({
          title: "Erreur d'authentification",
          description:
            "L'authentification prend trop de temps. Veuillez réessayer.",
          variant: "destructive",
        });
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

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

  if (errorState.hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full">
          <h3 className="text-red-800 font-medium mb-2">
            Erreur d'authentification
          </h3>
          <p className="text-red-600">{errorState.error?.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  console.log("Authentifié, affichage du contenu");
  return <>{children}</>;
};

export default ProtectedRoute;
