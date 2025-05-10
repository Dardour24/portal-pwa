
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Check for development or preview mode
  const isPreviewMode = 
    window.location.hostname === 'localhost' || 
    window.location.search.includes('preview=true') ||
    window.location.search.includes('demo=true') ||
    process.env.NODE_ENV !== 'production';

  // Add loading timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 seconds timeout
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "isPreviewMode:", isPreviewMode, "loadingTimeout:", loadingTimeout);

  // If loading timed out, allow access in preview mode
  if (isLoading && loadingTimeout && isPreviewMode) {
    console.log("Loading timed out, allowing access in preview mode");
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

  // Allow access in preview mode regardless of authentication
  if (isPreviewMode) {
    console.log("Preview mode is active, bypassing authentication");
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to signin");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  console.log("Authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
