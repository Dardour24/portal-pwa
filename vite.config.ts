
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement depuis .env
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Define environment variables
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY),
      'import.meta.env.VITE_PREVIEW_MODE': JSON.stringify(env.VITE_PREVIEW_MODE || process.env.VITE_PREVIEW_MODE),
    },
    build: {
      // Improved source maps for debugging
      sourcemap: mode !== 'production',
      // Better error reporting
      reportCompressedSize: true,
      rollupOptions: {
        onwarn(warning, warn) {
          // Ignore certain warnings
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          warn(warning);
        }
      }
    }
  };
});
