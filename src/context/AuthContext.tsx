
import React, { createContext, useContext } from "react";
import useAuthProvider from "../hooks/auth/useAuthProvider";
import { AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();
  
  // Check for development or preview mode
  const isPreviewMode = 
    window.location.hostname === 'localhost' || 
    window.location.search.includes('preview=true') ||
    process.env.NODE_ENV !== 'production';
  
  console.log("AuthProvider rendering with auth state:", { 
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    isPreviewMode: isPreviewMode
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Re-export supabase for other files that import it from AuthContext
export { supabase } from "../lib/supabase";
