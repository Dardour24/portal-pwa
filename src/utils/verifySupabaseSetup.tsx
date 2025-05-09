
import { supabase } from '../lib/supabase';

export const verifySupabaseSetup = async () => {
  console.log("Vérification de la configuration Supabase...");
  
  try {
    // Vérifier la connexion de base à Supabase
    const { data, error } = await supabase
      .from('properties')
      .select('count()')
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST109' || error.code === '42P01') {
        console.warn("La table 'properties' n'existe pas encore. Veuillez la créer dans votre projet Supabase.");
        console.log("Configuration Supabase vérifiée: NON configurée");
        console.log("IMPORTANT: La configuration Supabase n'est pas complète. Veuillez exécuter le script SQL nécessaire dans l'éditeur SQL de Supabase.");
        return false;
      }
      
      console.error("Erreur lors de la vérification de la connexion Supabase:", error);
      return false;
    }
    
    console.log("Connexion Supabase vérifiée avec succès.");
    return true;
  } catch (error) {
    console.error("Erreur lors de la vérification de la configuration Supabase:", error);
    return false;
  }
};

// Script SQL à exécuter dans l'éditeur SQL de Supabase pour configurer la base de données:
/*
-- Création de la table clients si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Politique RLS pour la table clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.clients
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Users can update their own profile" ON public.clients
  FOR UPDATE USING (auth.uid() = id);

-- Création de la table properties si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  beds24_property_id INTEGER,
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Politique RLS pour la table properties
CREATE POLICY "Users can only view their own properties" ON public.properties
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can insert their own properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "Users can delete their own properties" ON public.properties
  FOR DELETE USING (auth.uid() = client_id);

-- Activer RLS sur la table properties
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Fonction pour mettre à jour la date de modification
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour la date de modification
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at();
*/
