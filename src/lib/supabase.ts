import { createClient } from '@supabase/supabase-js';

// URL et clé Supabase correctes
const supabaseUrl = "https://qsbfhiujjlhipmdylqva.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYmZoaXVqamxoaXBtZHlscXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODM1NjUsImV4cCI6MjA2MjI1OTU2NX0.SAXchw3KuIA16ZKWOIsynUu-JuHSwMzY6OoWu_enwhw";

console.log("Initializing Supabase client with:", { 
  url: supabaseUrl, 
  hasKey: !!supabaseAnonKey
});

// Configuration du client Supabase avec options explicites pour l'authentification
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage,
    storageKey: 'botnb-auth-token',
    detectSessionInUrl: true,
    flowType: 'implicit'
  },
  global: {
    headers: {
      'X-Client-Info': 'BotnB Client'
    }
  },
  // Optimize network requests
  realtime: {
    // Disable realtime subscriptions if not needed
    params: {
      eventsPerSecond: 2
    }
  }
});

// Fonction utilitaire pour vérifier la configuration de Supabase
export const checkSupabaseConfig = () => {
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  };
};
