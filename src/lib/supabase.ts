
import { createClient } from '@supabase/supabase-js';

// Using direct values instead of environment variables
const supabaseUrl = "https://qsbfhiujjlhipmdylqva.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYmZoaXVqamxoaXBtZHlscXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODM1NjUsImV4cCI6MjA2MjI1OTU2NX0.SAXchw3KuIA16ZKWOIsynUu-JuHSwMzY6OoWu_enwhw";

// Verify that the values are not empty
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and key must be defined');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
