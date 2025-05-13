
import { createClient } from '@supabase/supabase-js';

// URL and key for Supabase
const supabaseUrl = "https://qsbfhiujjlhipmdylqva.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYmZoaXVqamxoaXBtZHlscXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODM1NjUsImV4cCI6MjA2MjI1OTU2NX0.SAXchw3KuIA16ZKWOIsynUu-JuHSwMzY6OoWu_enwhw";

// Check for preview mode
const configPreviewMode = import.meta.env.VITE_PREVIEW_MODE === 'true';
const urlHasPreview = 
  window.location.hostname === 'localhost' || 
  window.location.search.includes('preview=true') ||
  window.location.search.includes('demo=true') ||
  process.env.NODE_ENV !== 'production';

// Combined preview mode
const isPreviewMode = configPreviewMode || urlHasPreview;

console.log("Initializing Supabase client with:", { 
  url: supabaseUrl, 
  hasKey: !!supabaseAnonKey,
  previewMode: isPreviewMode ? "ENABLED" : "DISABLED",
  urlPreview: urlHasPreview,
  configPreview: configPreviewMode
});

// Configuration for the Supabase client with explicit auth options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: localStorage
  }
});

// Utility function to check Supabase configuration
export const checkSupabaseConfig = () => {
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isPreviewMode,
    urlHasPreview,
    configPreviewMode
  };
};
