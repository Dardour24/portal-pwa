
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
-- Supprimer d'abord les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Users can view their own profile" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.clients;
DROP POLICY IF EXISTS "Users can only view their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can insert their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can update their own properties" ON public.properties;
DROP POLICY IF EXISTS "Users can delete their own properties" ON public.properties;

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

-- Création de la table form_questions si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.form_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  is_custom BOOLEAN DEFAULT FALSE,
  property_id UUID REFERENCES public.properties(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Supprimer les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Users can view all questions" ON public.form_questions;
DROP POLICY IF EXISTS "Users can insert their own custom questions" ON public.form_questions;
DROP POLICY IF EXISTS "Users can update their own custom questions" ON public.form_questions;
DROP POLICY IF EXISTS "Users can delete their own custom questions" ON public.form_questions;

-- Politique RLS pour la table form_questions
ALTER TABLE public.form_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all questions" ON public.form_questions
  FOR SELECT USING (true);
  
CREATE POLICY "Users can insert their own custom questions" ON public.form_questions
  FOR INSERT WITH CHECK (
    is_custom = true AND 
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND client_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own custom questions" ON public.form_questions
  FOR UPDATE USING (
    is_custom = true AND 
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND client_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own custom questions" ON public.form_questions
  FOR DELETE USING (
    is_custom = true AND 
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND client_id = auth.uid()
    )
  );

-- Création de la table form_answers si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.form_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id),
  question_id UUID NOT NULL REFERENCES public.form_questions(id),
  answer_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(property_id, question_id)
);

-- Supprimer les politiques existantes pour éviter les conflits
DROP POLICY IF EXISTS "Users can view answers for their properties" ON public.form_answers;
DROP POLICY IF EXISTS "Users can insert answers for their properties" ON public.form_answers;
DROP POLICY IF EXISTS "Users can update answers for their properties" ON public.form_answers;
DROP POLICY IF EXISTS "Users can delete answers for their properties" ON public.form_answers;

-- Politique RLS pour la table form_answers
ALTER TABLE public.form_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view answers for their properties" ON public.form_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND client_id = auth.uid()
    )
  );
  
CREATE POLICY "Users can insert answers for their properties" ON public.form_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND client_id = auth.uid()
    )
  );

CREATE POLICY "Users can update answers for their properties" ON public.form_answers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND client_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete answers for their properties" ON public.form_answers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.properties 
      WHERE id = property_id AND client_id = auth.uid()
    )
  );

-- Ajout de déclencheurs pour mettre à jour les dates
CREATE TRIGGER update_form_questions_updated_at
BEFORE UPDATE ON public.form_questions
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at();

CREATE TRIGGER update_form_answers_updated_at
BEFORE UPDATE ON public.form_answers
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at();

-- Insérer des questions obligatoires par défaut uniquement si elles n'existent pas déjà
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.form_questions WHERE question_text = 'Comment accéder au logement ?' AND is_custom = false) THEN
    INSERT INTO public.form_questions (question_text, is_required, is_custom)
    VALUES 
    ('Comment accéder au logement ?', true, false),
    ('Où se trouve la clé / boîte à clés ?', true, false),
    ('Quelle est la procédure de check-in ?', true, false),
    ('Quelle est la procédure de check-out ?', true, false),
    ('Y a-t-il un code WiFi ? Si oui, quel est-il ?', true, false),
    ('Comment fonctionne le chauffage ?', true, false),
    ('Comment fonctionne la climatisation ?', true, false),
    ('Y a-t-il des instructions spéciales pour les appareils électroménagers ?', true, false),
    ('Où se trouve le compteur électrique ?', true, false),
    ('Où se trouvent les poubelles et quels sont les jours de collecte ?', true, false),
    ('Y a-t-il des règles spéciales pour le voisinage ?', true, false),
    ('Quels sont les numéros d''urgence à contacter ?', true, false),
    ('Y a-t-il des recommandations locales (restaurants, activités) ?', true, false),
    ('Comment fonctionne le système de télévision ?', true, false),
    ('Y a-t-il des instructions pour le lave-vaisselle ?', true, false),
    ('Y a-t-il des instructions pour la machine à laver ?', true, false),
    ('Y a-t-il des instructions pour le sèche-linge ?', true, false),
    ('Où se trouve le disjoncteur principal ?', true, false),
    ('Où se trouve la vanne d''arrêt d''eau principale ?', true, false),
    ('Y a-t-il un détecteur de fumée ? Où se trouve-t-il ?', true, false),
    ('Y a-t-il un extincteur ? Où se trouve-t-il ?', true, false);
  END IF;
END $$;
*/
