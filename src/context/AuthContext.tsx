
import React, { createContext, useContext } from "react";
import useAuthProvider from "../hooks/auth/useAuthProvider";
import { AuthContextType } from "../types/auth";
import { checkSupabaseConfig } from "../lib/supabase";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();
  
  // Vérifier le mode prévisualisation
  const searchParams = new URLSearchParams(window.location.search);
  const isUrlPreviewMode = 
    searchParams.has('preview') || 
    searchParams.has('demo') || 
    searchParams.has('debug');
  
  const isPreviewMode = 
    window.location.hostname === 'localhost' || 
    isUrlPreviewMode ||
    process.env.NODE_ENV !== 'production' ||
    import.meta.env.VITE_PREVIEW_MODE === 'true';
  
  // Journaliser les informations détaillées sur l'état de l'authentification
  const { hasUrl, hasKey, isPreviewMode: configPreviewMode } = checkSupabaseConfig();
  
  console.log("AuthProvider - État:", { 
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isPreviewMode: isPreviewMode,
    isUrlPreviewMode: isUrlPreviewMode,
    hostname: window.location.hostname,
    supabaseConfig: {
      hasUrl,
      hasKey,
      configPreviewMode
    }
  });

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
};

// Réexporter supabase pour les autres fichiers qui l'importent depuis AuthContext
export { supabase } from "../lib/supabase";
