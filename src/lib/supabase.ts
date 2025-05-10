
import { createClient } from '@supabase/supabase-js';

// Vérifier les paramètres d'URL pour le mode démo/prévisualisation
const searchParams = new URLSearchParams(window.location.search);
const isUrlPreviewMode = 
  searchParams.has('preview') || 
  searchParams.has('demo') || 
  searchParams.has('debug');

// Obtenir les variables d'environnement ou utiliser des valeurs de secours pour le développement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qsbfhiujjlhipmdylqva.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYmZoaXVqamxoaXBtZHlscXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODM1NjUsImV4cCI6MjA2MjI1OTU2NX0.SAXchw3KuIA16ZKWOIsynUu-JuHSwMzY6OoWu_enwhw";
const isPreviewMode = import.meta.env.VITE_PREVIEW_MODE === 'true' || isUrlPreviewMode;

// Vérifier que les valeurs ne sont pas vides
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or key is missing. Using fallback values for development.');
}

console.log("Supabase Configuration:");
console.log(`- URL: ${supabaseUrl.substring(0, 15)}...`);
console.log(`- Preview mode: ${isPreviewMode ? "ENABLED" : "DISABLED"}`);
console.log(`- URL Preview Param: ${isUrlPreviewMode ? "DETECTED" : "NOT DETECTED"}`);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction utilitaire pour vérifier si supabase est correctement configuré
export const checkSupabaseConfig = () => {
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isPreviewMode,
    isUrlPreviewMode,
    url: supabaseUrl,
  };
};

// Fonction pour vérifier si la connexion Supabase fonctionne
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('_test_connection').select('*').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Supabase connection test exception:', err.message);
    return { success: false, error: err.message };
  }
};
