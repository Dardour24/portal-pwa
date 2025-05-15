/**
 * Interface for authentication user
 */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  whatsapp_phone: string;
  chatbot_link?: string;
}

/**
 * Interface for authentication context
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  networkAvailable: boolean;
  login: (email: string, password: string, hcaptchaToken: string) => Promise<LoginResult>;
  signup: (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    whatsappPhone: string,
    normalPhone: string,
    hcaptchaToken: string
  ) => Promise<LoginResult>;
  logout: () => Promise<void>;
}

/**
 * Interface for session
 */
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  user: User;
}

/**
 * Interface for login result
 */
export interface LoginResult {
  user: User | null;
  session: Session | null;
}
