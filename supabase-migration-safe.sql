-- 🔄 MIGRATION INTELLIGENTE SUPABASE - TERANGA FONCIER
-- ====================================================
-- Ce script s'adapte à votre base existante sans rien supprimer

-- 🔍 ÉTAPE 1: DIAGNOSTIC DE L'EXISTANT
DO $$
DECLARE
    table_exists boolean;
BEGIN
    -- Vérifier si des tables Teranga existent déjà
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE '✅ Table profiles détectée - Migration mode';
    ELSE
        RAISE NOTICE '🆕 Nouvelle installation - Setup mode';
    END IF;
END $$;

-- 🛡️ ÉTAPE 2: CRÉATION SAFE DES TABLES (IF NOT EXISTS)

-- Table profiles (utilisateurs)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'particular' CHECK (role IN ('admin', 'particular', 'vendeur', 'investisseur', 'promoteur', 'municipalite', 'notaire', 'geometre', 'banque')),
  phone TEXT,
  address TEXT,
  city TEXT,
  region TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter colonnes manquantes à profiles si elles n'existent pas
DO $$
BEGIN
    -- Ajouter role si manquant
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'particular' 
        CHECK (role IN ('admin', 'particular', 'vendeur', 'investisseur', 'promoteur', 'municipalite', 'notaire', 'geometre', 'banque'));
        RAISE NOTICE '✅ Colonne role ajoutée à profiles';
    END IF;
    
    -- Ajouter is_verified si manquant
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='is_verified') THEN
        ALTER TABLE public.profiles ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
        RAISE NOTICE '✅ Colonne is_verified ajoutée à profiles';
    END IF;
    
    -- Ajouter is_active si manquant
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='is_active') THEN
        ALTER TABLE public.profiles ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        RAISE NOTICE '✅ Colonne is_active ajoutée à profiles';
    END IF;
END $$;

-- Table properties (biens immobiliers)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('villa', 'appartement', 'terrain', 'bureau', 'commerce')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved', 'draft')),
  price DECIMAL(15,2) NOT NULL,
  surface DECIMAL(10,2),
  bedrooms INTEGER,
  bathrooms INTEGER,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  coordinates POINT,
  images TEXT[],
  features TEXT[],
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.profiles(id),
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table favorites (favoris)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- Table requests (demandes)
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('visit', 'info', 'offer', 'municipal_land')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id),
  municipality_id UUID REFERENCES public.profiles(id),
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table messages (messagerie)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajouter colonnes manquantes à messages si elles n'existent pas
DO $$
BEGIN
    -- Ajouter recipient_id si manquant
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='messages' AND column_name='recipient_id') THEN
        ALTER TABLE public.messages ADD COLUMN recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
        RAISE NOTICE '✅ Colonne recipient_id ajoutée à messages';
    END IF;
    
    -- Ajouter sender_id si manquant
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='messages' AND column_name='sender_id') THEN
        ALTER TABLE public.messages ADD COLUMN sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
        RAISE NOTICE '✅ Colonne sender_id ajoutée à messages';
    END IF;
    
    -- Ajouter subject si manquant
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='messages' AND column_name='subject') THEN
        ALTER TABLE public.messages ADD COLUMN subject TEXT;
        RAISE NOTICE '✅ Colonne subject ajoutée à messages';
    END IF;
    
    -- Ajouter read_at si manquant
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='messages' AND column_name='read_at') THEN
        ALTER TABLE public.messages ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE '✅ Colonne read_at ajoutée à messages';
    END IF;
END $$;

-- Table projects (projets promoteurs)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'construction', 'completed', 'sold_out')),
  location TEXT NOT NULL,
  total_units INTEGER,
  sold_units INTEGER DEFAULT 0,
  price_range TEXT,
  completion_date DATE,
  images TEXT[],
  promoter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 🔐 ÉTAPE 3: ACTIVATION RLS (SAFE)
DO $$
DECLARE
    tables_to_secure text[] := ARRAY['profiles', 'properties', 'favorites', 'requests', 'messages', 'projects'];
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY tables_to_secure
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
        RAISE NOTICE '🛡️ RLS activé pour %', table_name;
    END LOOP;
END $$;

-- 🛡️ ÉTAPE 4: POLITIQUES DE SÉCURITÉ (DROP IF EXISTS pour éviter conflits)

-- Politiques profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Politiques properties
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON public.properties;
CREATE POLICY "Properties are viewable by everyone" ON public.properties
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own properties" ON public.properties;
CREATE POLICY "Users can insert own properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own properties" ON public.properties;
CREATE POLICY "Users can update own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own properties" ON public.properties;
CREATE POLICY "Users can delete own properties" ON public.properties
  FOR DELETE USING (auth.uid() = owner_id);

-- Politiques favorites
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- Politiques requests
DROP POLICY IF EXISTS "Users can view own requests" ON public.requests;
CREATE POLICY "Users can view own requests" ON public.requests
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  ));

DROP POLICY IF EXISTS "Users can create requests" ON public.requests;
CREATE POLICY "Users can create requests" ON public.requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own requests" ON public.requests;
CREATE POLICY "Users can update own requests" ON public.requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Politiques messages (avec vérification d'existence des colonnes)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='messages' AND column_name='sender_id') 
       AND EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='messages' AND column_name='recipient_id') THEN
        
        DROP POLICY IF EXISTS "Users can view own messages" ON public.messages;
        CREATE POLICY "Users can view own messages" ON public.messages
          FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

        DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
        CREATE POLICY "Users can send messages" ON public.messages
          FOR INSERT WITH CHECK (auth.uid() = sender_id);
          
        RAISE NOTICE '✅ Politiques messages créées';
    ELSE
        RAISE NOTICE '⚠️ Colonnes sender_id/recipient_id manquantes dans messages';
    END IF;
END $$;

-- Politiques projects
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON public.projects;
CREATE POLICY "Projects are viewable by everyone" ON public.projects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Promoters can manage own projects" ON public.projects;
CREATE POLICY "Promoters can manage own projects" ON public.projects
  FOR ALL USING (auth.uid() = promoter_id);

-- 📊 ÉTAPE 5: INDEX (CREATE IF NOT EXISTS automatique)
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON public.properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON public.properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_user ON public.requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);

-- Index pour messages (avec vérification d'existence de colonne)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='messages' AND column_name='recipient_id') THEN
        CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient_id);
        RAISE NOTICE '✅ Index idx_messages_recipient créé';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='messages' AND column_name='sender_id') THEN
        CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
        RAISE NOTICE '✅ Index idx_messages_sender créé';
    END IF;
END $$;

-- 🔔 ÉTAPE 6: TRIGGERS (DROP IF EXISTS pour éviter doublons)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_properties_updated_at ON public.properties;
DROP TRIGGER IF EXISTS update_requests_updated_at ON public.requests;
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;

-- Fonction trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Création des triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 🪣 ÉTAPE 7: STORAGE BUCKETS (IF NOT EXISTS)
DO $$
BEGIN
    -- Buckets
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('avatars', 'avatars', true)
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('properties', 'properties', true)
    ON CONFLICT (id) DO NOTHING;
    
    INSERT INTO storage.buckets (id, name, public) 
    VALUES ('documents', 'documents', false)
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE '🪣 Storage buckets configurés';
END $$;

-- 🛡️ ÉTAPE 8: POLITIQUES STORAGE (DROP IF EXISTS)
DO $$
BEGIN
    -- Supprimer les politiques existantes pour éviter les conflits
    DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
    DROP POLICY IF EXISTS "Property images are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload property images" ON storage.objects;
    DROP POLICY IF EXISTS "Documents are private" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
    
    RAISE NOTICE '🧹 Anciennes politiques storage supprimées';
END $$;

-- Nouvelles politiques storage
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Property images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'properties');

CREATE POLICY "Users can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'properties' AND auth.role() = 'authenticated');

CREATE POLICY "Documents are private" ON storage.objects
  FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

-- ✅ ÉTAPE 9: VALIDATION FINALE
DO $$
DECLARE
    table_count integer;
    bucket_count integer;
BEGIN
    -- Compter les tables créées
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public' 
    AND table_name IN ('profiles', 'properties', 'favorites', 'requests', 'messages', 'projects');
    
    -- Compter les buckets storage
    SELECT COUNT(*) INTO bucket_count
    FROM storage.buckets
    WHERE id IN ('avatars', 'properties', 'documents');
    
    RAISE NOTICE '✅ Migration terminée: % tables, % buckets', table_count, bucket_count;
    RAISE NOTICE '🎉 Teranga Foncier prêt à fonctionner!';
END $$;
