
import { useState } from 'react';
import { useAuthState } from './useAuthState';
import { signInWithEmail, signUpWithEmail, signOut } from './authService';
import { AuthContextType, LoginResult } from '../../types/auth';

const useAuthProvider = (): AuthContextType => {
  const { user, isLoading } = useAuthState();
  const [authLoading, setAuthLoading] = useState(false);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    setAuthLoading(true);
    try {
      console.log("useAuthProvider: Attempting login");
      const result = await signInWithEmail(email, password);
      console.log("useAuthProvider: Login result", result);
      return result;
    } catch (error) {
      console.error("useAuthProvider: Error during login:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    phoneNumber: string
  ): Promise<LoginResult> => {
    setAuthLoading(true);
    try {
      const result = await signUpWithEmail(email, password, firstName, lastName, phoneNumber);
      return result;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  console.log("useAuthProvider state:", { isAuthenticated: !!user, isLoading: isLoading || authLoading });

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || authLoading,
    login,
    signup,
    logout
  };
};

export default useAuthProvider;
