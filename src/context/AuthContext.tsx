
import React, { createContext, useContext, useEffect } from "react";
import useAuthProvider from "../hooks/auth/useAuthProvider";
import { AuthContextType } from "../types/auth";
import { checkSupabaseConfig } from "../lib/supabase";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();
  
  // Get preview mode status from multiple sources
  const { isPreviewMode: configPreviewMode } = checkSupabaseConfig();
  const urlHasPreview = 
    window.location.hostname === 'localhost' || 
    window.location.search.includes('preview=true') ||
    window.location.search.includes('demo=true') ||
    process.env.NODE_ENV !== 'production';
  
  // Combined preview mode check
  const isPreviewMode = configPreviewMode || urlHasPreview;
  
  // Log detailed info about auth state and configuration
  useEffect(() => {
    console.log("AuthProvider initialized with auth state:", { 
      isAuthenticated: auth.isAuthenticated,
      isLoading: auth.isLoading,
      isPreviewMode: isPreviewMode,
      supabaseConfig: checkSupabaseConfig()
    });
  }, [auth.isAuthenticated, auth.isLoading]);

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
