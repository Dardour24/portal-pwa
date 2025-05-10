
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Add more detailed logging to help diagnose issues
  console.log("ProtectedRoute - Current state:", { 
    isAuthenticated, 
    isLoading, 
    pathname: location.pathname,
    search: location.search
  });

  // Show skeleton loader when loading authentication state
  if (isLoading) {
    console.log("ProtectedRoute - Loading authentication state");
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <Skeleton className="h-[250px] w-full max-w-md mb-4 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-md mb-2" />
        <Skeleton className="h-4 w-3/4 max-w-[300px] mb-2" />
        <Skeleton className="h-4 w-1/2 max-w-[200px]" />
      </div>
    );
  }

  // Handle unauthenticated state
  if (!isAuthenticated) {
    // Preview mode detection - allow viewing protected content in preview environments
    // Check for specific URL params or environment flags
    const isPreviewMode = 
      window.location.hostname.includes('lovable.app') || // Check if on Lovable preview domain
      window.location.search.includes('preview=true'); // Or if preview param exists
    
    if (isPreviewMode) {
      console.log("ProtectedRoute - Preview mode detected, rendering content anyway");
      return <>{children}</>;
    }
    
    console.log("ProtectedRoute - Not authenticated, redirecting to signin");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute - Authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
