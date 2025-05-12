/**
 * Interface for authentication user
 */
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  chatbot_link?: string; // Ajout du champ chatbot_link
}
