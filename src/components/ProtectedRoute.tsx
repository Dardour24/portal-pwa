
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { checkSupabaseConfig } from "../lib/supabase";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Check for preview mode from various sources
  const { isPreviewMode } = checkSupabaseConfig();
  const urlHasPreview = 
    window.location.search.includes('preview=true') ||
    window.location.search.includes('demo=true');
  const isDevelopment = 
    window.location.hostname === 'localhost' || 
    process.env.NODE_ENV !== 'production';
  
  // Combined preview mode check
  const isInPreviewMode = isPreviewMode || urlHasPreview || isDevelopment;

  console.log("ProtectedRoute - Environment check:", { 
    isPreviewMode, 
    urlHasPreview, 
    isDevelopment, 
    combined: isInPreviewMode 
  });

  // Add loading timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.log("Authentication loading timed out after 5 seconds");
        setLoadingTimeout(true);
      }, 5000); // 5 seconds timeout
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  console.log("ProtectedRoute - Auth state:", { 
    isAuthenticated, 
    isLoading, 
    isInPreviewMode, 
    loadingTimeout 
  });

  // If loading timed out, allow access in preview mode
  if ((isLoading && loadingTimeout && isInPreviewMode) || isInPreviewMode) {
    console.log("Preview mode is active or loading timed out, bypassing authentication");
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
    console.log("Not authenticated, redirecting to signin");
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  console.log("Authenticated, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
