
import { createClient } from '@supabase/supabase-js';

// Get environment variables or use fallback values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qsbfhiujjlhipmdy1qva.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzYmZoaXVqamxoaXBtZHlscXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2ODM1NjUsImV4cCI6MjA2MjI1OTU2NX0.SAXchw3KuIA16ZKWOIsynUu-JuHSwMzY6OoWu_enwhw";

// Check for preview mode
const configPreviewMode = import.meta.env.VITE_PREVIEW_MODE === 'true';
const urlHasPreview = 
  window.location.hostname === 'localhost' || 
  window.location.search.includes('preview=true') ||
  window.location.search.includes('demo=true') ||
  process.env.NODE_ENV !== 'production';

// Combined preview mode check
const isPreviewMode = configPreviewMode || urlHasPreview;

// Verify that the values are not empty
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or key is missing. Using fallback values for development.');
}

console.log("Initializing Supabase client with:", { 
  url: supabaseUrl.substring(0, 15) + "...", 
  hasKey: !!supabaseAnonKey,
  previewMode: isPreviewMode ? "ENABLED" : "DISABLED",
  urlPreview: urlHasPreview,
  configPreview: configPreviewMode
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if supabase is properly configured
export const checkSupabaseConfig = () => {
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isPreviewMode,
    urlHasPreview,
    configPreviewMode
  };
};
