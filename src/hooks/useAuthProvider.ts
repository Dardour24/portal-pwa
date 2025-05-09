
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, LoginResult } from '../types/auth';

const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        setIsLoading(true);
        
        // Get session from Supabase
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur lors de la récupération de la session:", sessionError);
          throw sessionError;
        }
        
        if (session?.user) {
          // Get client data from Supabase
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('first_name, last_name, phone')
            .eq('id', session.user.id)
            .single();

          if (clientError) {
            console.error("Erreur lors de la récupération des données client:", clientError);
          }

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            first_name: clientData?.first_name,
            last_name: clientData?.last_name,
            phone: clientData?.phone,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de la session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session?.user) {
            const { data: clientData, error: clientError } = await supabase
              .from('clients')
              .select('first_name, last_name, phone')
              .eq('id', session.user.id)
              .single();

            if (clientError) {
              console.error("Erreur lors de la récupération des données client:", clientError);
            }

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              first_name: clientData?.first_name,
              last_name: clientData?.last_name,
              phone: clientData?.phone,
            });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Erreur lors du changement d'état d'authentification:", error);
        } finally {
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Erreur de connexion:", error);
        throw error;
      }
      
      if (data.user) {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', data.user.id)
          .single();

        if (clientError) {
          console.error("Erreur lors de la récupération des données client:", clientError);
        }

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          first_name: clientData?.first_name,
          last_name: clientData?.last_name,
          phone: clientData?.phone,
        });
        
        return data;
      }
      
      return { user: null, session: null };
    } catch (error) {
      console.error("Erreur détaillée lors de la connexion:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, phoneNumber: string): Promise<LoginResult> => {
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
        console.error("Erreur d'inscription:", error);
        throw error;
      }
      
      if (data.user) {
        // Create a record in the clients table
        const { error: clientError } = await supabase
          .from('clients')
          .insert([{
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            email: email
          }]);
          
        if (clientError) {
          console.error("Erreur lors de la création du profil client:", clientError);
          throw clientError;
        }
        
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
        });
        
        return data;
      }
      
      return { user: null, session: null };
    } catch (error) {
      console.error("Erreur détaillée lors de l'inscription:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erreur de déconnexion:", error);
        throw error;
      }
      setUser(null);
    } catch (error) {
      console.error("Erreur détaillée lors de la déconnexion:", error);
      throw error;
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  };
};

export default useAuthProvider;
