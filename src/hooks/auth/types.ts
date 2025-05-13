
import { User, LoginResult } from '../../types/auth';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export interface UserData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
}
