
import React, { createContext, useState, useContext, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

// Utiliser directement les valeurs au lieu des variables d'environnement
const supabaseUrl = "https://qsbfhiujjlhipmdylqva.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYmZoaXVqamxoaXBtZHlscXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODM1NjUsImV4cCI6MjA2MjI1OTU2NX0.SAXchw3KuIA16ZKWOIsynUu-JuHSwMzY6OoWu_enwhw";

// Vérifier que les valeurs ne sont pas vides
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les URL et clé Supabase doivent être définies');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      
      // Get session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
        });
      }
      
      setIsLoading(false);
    };

    checkUserSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => {
    setIsLoading(true);
    try {
      // Register the user with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading, 
        login, 
        signup,
        logout 
      }}
    >
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
