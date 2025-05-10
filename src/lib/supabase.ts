
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qsbfhiujjlhipmdylqva.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYmZoaXVqamxoaXBtZHlscXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODM1NjUsImV4cCI6MjA2MjI1OTU2NX0.SAXchw3KuIA16ZKWOIsynUu-JuHSwMzY6OoWu_enwhw";
const isPreviewMode = import.meta.env.VITE_PREVIEW_MODE === 'true';

// Verify that the values are not empty
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or key is missing. Using fallback values for development.');
}

console.log("Initializing Supabase client with URL:", supabaseUrl.substring(0, 15) + "...");
console.log("Preview mode:", isPreviewMode ? "ENABLED" : "DISABLED");
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if supabase is properly configured
export const checkSupabaseConfig = () => {
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isPreviewMode,
  };
};
