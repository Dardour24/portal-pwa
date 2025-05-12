
import { User } from '../../types/auth';

/**
 * Interface for authentication state
 */
export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

/**
 * Interface for user data from the database
 */
export interface UserData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  [key: string]: any; // Allow for additional properties
}
