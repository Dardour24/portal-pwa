
export interface User {
  email: string;
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  user?: User;
}

export interface WeakPassword {
  isWeak: boolean;
  message?: string;
}

export interface LoginResult {
  user: User | null;
  session: Session | null;
  weakPassword?: WeakPassword | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  networkAvailable: boolean; // Added the missing property here
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
}
