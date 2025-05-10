
import React, { createContext, useContext, useEffect } from "react";
import useAuthProvider from "../hooks/auth/useAuthProvider";
import { AuthContextType } from "../types/auth";
import { checkSupabaseConfig } from "../lib/supabase";
import { toast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();
  
  // Vérification du mode preview
  const { isPreviewMode: configPreviewMode } = checkSupabaseConfig();
  const urlHasPreview = 
    window.location.hostname === 'localhost' || 
    window.location.search.includes('preview=true') ||
    window.location.search.includes('demo=true') ||
    process.env.NODE_ENV !== 'production';
  
  // Mode preview combiné
  const isPreviewMode = configPreviewMode || urlHasPreview;
  
  // Afficher des informations détaillées sur l'état de l'authentification et la configuration
  useEffect(() => {
    console.log("AuthProvider initialized with auth state:", { 
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      isPreviewMode: isPreviewMode,
      hostname: window.location.hostname,
      search: window.location.search,
      supabaseConfig: checkSupabaseConfig()
    });
    
    if (isPreviewMode && !auth.isAuthenticated && !auth.isLoading) {
      toast({
        title: "Mode prévisualisation actif",
        description: "Vous pouvez naviguer dans l'application sans vous connecter.",
        duration: 5000
      });
    }
  }, [auth.isAuthenticated, auth.isLoading, isPreviewMode]);

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Re-export supabase for other files that import it from AuthContext
export { supabase } from "../lib/supabase";
