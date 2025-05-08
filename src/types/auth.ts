
export interface User {
  email: string;
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string, phoneNumber: string) => Promise<void>;
  logout: () => Promise<void>;
}
