
import { defineConfig, loadEnv, Plugin, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
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
      // Ajout de la configuration de préchargement
      {
        name: 'vite:preload-modules',
        enforce: 'post' as const, // Spécifier 'post' comme valeur littérale constante
        apply: 'build',
        transformIndexHtml(html: string) { // Ajout du type explicite pour html
          // Précharge les chunks JS critiques
          return html.replace(
            /<head>/,
            `<head>
              <link rel="modulepreload" href="/assets/index.js" />
              <link rel="preload" href="/assets/main.css" as="style" />
            `
          );
        }
      }
    ].filter(Boolean) as Plugin[],  // Type cast du tableau filtré en Plugin[]
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
      // Configuration de la limite d'avertissement pour la taille des chunks
      chunkSizeWarningLimit: 1000, // en kB
      rollupOptions: {
        output: {
          // Stratégie de fractionnement (code splitting)
          manualChunks: {
            react: ['react', 'react-dom'],
            shadcn: [
              '@radix-ui/react-accordion',
              '@radix-ui/react-alert-dialog',
              '@radix-ui/react-avatar',
              // ... autres packages shadcn/ui
            ],
            tanstack: ['@tanstack/react-query'],
            charts: ['recharts'],
            utilities: ['date-fns', 'clsx', 'tailwind-merge'],
          },
          // Assurer que les chunks ont des noms cohérents
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
        onwarn(warning, warn) {
          // Ignore certain warnings
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
          warn(warning);
        }
      }
    }
  };
});
