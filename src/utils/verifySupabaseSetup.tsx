
import { supabase } from '../context/AuthContext';

export const verifySupabaseSetup = async () => {
  console.log("Vérification de la configuration Supabase...");
  
  // 1. Vérifier si le schema botnb existe
  try {
    const { data: schemas, error: schemasError } = await supabase.rpc('get_schemas');
    if (schemasError) {
      console.error("Erreur lors de la vérification des schémas:", schemasError);
      return false;
    }
    
    console.log("Schémas disponibles:", schemas);
    const botnbSchemaExists = schemas?.some((schema: string) => schema === 'botnb');
    console.log("Schéma botnb existe:", botnbSchemaExists);
    
    // 2. Vérifier si la table clients existe dans le schéma botnb
    if (botnbSchemaExists) {
      const { data: tables, error: tablesError } = await supabase.rpc('get_tables', { schema_name: 'botnb' });
      if (tablesError) {
        console.error("Erreur lors de la vérification des tables:", tablesError);
        return false;
      }
      
      console.log("Tables dans le schéma botnb:", tables);
      const clientsTableExists = tables?.some((table: string) => table === 'clients');
      console.log("Table clients existe:", clientsTableExists);
      
      return clientsTableExists;
    }
    
    return false;
  } catch (error) {
    console.error("Erreur lors de la vérification de la configuration Supabase:", error);
    console.log("Si les fonctions RPC ne sont pas disponibles, exécutez le script SQL complet dans l'éditeur SQL de Supabase.");
    return false;
  }
};

// Fonctions RPC nécessaires à créer dans Supabase:
/*
CREATE OR REPLACE FUNCTION public.get_schemas()
RETURNS TABLE(schema_name text) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT nspname::text FROM pg_catalog.pg_namespace 
  WHERE nspname != 'pg_toast' AND nspname != 'pg_temp_1' AND nspname != 'pg_toast_temp_1' 
  AND nspname != 'pg_catalog' AND nspname != 'information_schema';
END;
$$;

CREATE OR REPLACE FUNCTION public.get_tables(schema_name text)
RETURNS TABLE(table_name text) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT tablename::text FROM pg_catalog.pg_tables WHERE schemaname = schema_name;
END;
$$;
*/
