
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types/auth';

const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      
      // Get session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get client data from Supabase
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email || '',
          first_name: clientData?.first_name,
          last_name: clientData?.last_name,
          phone: clientData?.phone,
        });
      }
      
      setIsLoading(false);
    };

    checkUserSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: clientData, error: clientError } = await supabase
            .from('clients')
            .select('first_name, last_name, phone')
            .eq('id', session.user.id)
            .single();

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
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('first_name, last_name, phone')
          .eq('id', data.user.id)
          .single();

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          first_name: clientData?.first_name,
          last_name: clientData?.last_name,
          phone: clientData?.phone,
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
          first_name: firstName,
          last_name: lastName,
          phone: phoneNumber,
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
