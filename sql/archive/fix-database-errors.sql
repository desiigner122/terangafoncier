-- ============================================
-- FIX ERREURS DATABASE SUPABASE
-- Date: 14 octobre 2025
-- ============================================

-- ============================================
-- 1. CRÉER LE PROFIL MANQUANT
-- ============================================
-- Vérifier si le profil existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'
  ) THEN
    -- Insérer le profil manquant
    INSERT INTO profiles (
      id,
      email,
      role,
      full_name,
      created_at,
      updated_at
    )
    SELECT 
      id,
      email,
      'Particulier' as role,
      COALESCE(raw_user_meta_data->>'full_name', email) as full_name,
      created_at,
      NOW() as updated_at
    FROM auth.users
    WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';
    
    RAISE NOTICE 'Profil créé pour user 3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';
  ELSE
    RAISE NOTICE 'Le profil existe déjà';
  END IF;
END $$;


-- ============================================
-- 2. CRÉER UN ALIAS/VIEW POUR LA TABLE TICKETS
-- ============================================
-- Créer une vue pour rediriger 'tickets' vers 'support_tickets'
CREATE OR REPLACE VIEW public.tickets AS
SELECT * FROM public.support_tickets;

-- Ajouter un commentaire pour documentation
COMMENT ON VIEW public.tickets IS 'Alias pour support_tickets - pour compatibilité avec ancien code';

-- Accorder les permissions
GRANT SELECT, INSERT, UPDATE ON public.tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.tickets TO service_role;


-- ============================================
-- 3. AJOUTER LA COLONNE METADATA À REQUESTS
-- ============================================
-- Vérifier si la colonne existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'requests' 
    AND column_name = 'metadata'
  ) THEN
    -- Ajouter la colonne metadata
    ALTER TABLE public.requests 
    ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    
    -- Créer un index pour optimiser les requêtes sur metadata
    CREATE INDEX IF NOT EXISTS idx_requests_metadata 
    ON public.requests USING GIN (metadata);
    
    RAISE NOTICE 'Colonne metadata ajoutée à requests';
  ELSE
    RAISE NOTICE 'La colonne metadata existe déjà';
  END IF;
END $$;

-- Ajouter un commentaire
COMMENT ON COLUMN public.requests.metadata IS 'Données additionnelles JSON pour la demande';


-- ============================================
-- 4. CRÉER LA TABLE REQUESTS SI ELLE N'EXISTE PAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'purchase', 'information', 'visit', etc.
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'processing'
  title TEXT NOT NULL,
  description TEXT,
  property_id UUID, -- Lien optionnel vers une propriété
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON public.requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_type ON public.requests(type);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_requests_metadata ON public.requests USING GIN (metadata);

-- RLS (Row Level Security)
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs peuvent voir leurs propres demandes
CREATE POLICY "Users can view own requests" ON public.requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent créer leurs propres demandes
CREATE POLICY "Users can create own requests" ON public.requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politique: Les utilisateurs peuvent mettre à jour leurs propres demandes
CREATE POLICY "Users can update own requests" ON public.requests
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Politique: Les admins peuvent tout voir
CREATE POLICY "Admins can view all requests" ON public.requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Admin'
    )
  );

-- Politique: Les admins peuvent tout mettre à jour
CREATE POLICY "Admins can update all requests" ON public.requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'Admin'
    )
  );

-- Permissions
GRANT SELECT, INSERT, UPDATE ON public.requests TO authenticated;
GRANT ALL ON public.requests TO service_role;


-- ============================================
-- 5. CRÉER LA TABLE SUPPORT_TICKETS SI ELLE N'EXISTE PAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'nouveau', -- 'nouveau', 'en_cours', 'resolu', 'ferme'
  priority VARCHAR(20) DEFAULT 'normal', -- 'bas', 'normal', 'haut', 'urgent'
  category VARCHAR(50), -- 'technique', 'compte', 'paiement', 'autre'
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Index
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON public.support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at DESC);

-- RLS
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Politiques
CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tickets" ON public.support_tickets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tickets" ON public.support_tickets
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets" ON public.support_tickets
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('Admin', 'Support')
    )
  );

CREATE POLICY "Admins can update all tickets" ON public.support_tickets
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('Admin', 'Support')
    )
  );

-- Permissions
GRANT SELECT, INSERT, UPDATE ON public.support_tickets TO authenticated;
GRANT ALL ON public.support_tickets TO service_role;


-- ============================================
-- 6. FONCTION POUR SYNC AUTO DES PROFILS
-- ============================================
-- Créer une fonction pour synchroniser automatiquement les profils
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'Particulier', -- Role par défaut
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger sur auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- 7. VÉRIFICATIONS FINALES
-- ============================================
-- Compter les profils
SELECT COUNT(*) as total_profiles FROM profiles;

-- Vérifier le profil spécifique
SELECT id, email, role, full_name 
FROM profiles 
WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';

-- Vérifier les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('requests', 'support_tickets', 'tickets');

-- Vérifier la colonne metadata
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'requests' 
AND column_name = 'metadata';

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- ✅ Profil créé pour user 3f3083ba-4f40-4045-b6e6-7f009a6c2cb2
-- ✅ View 'tickets' créée (alias vers support_tickets)
-- ✅ Colonne 'metadata' ajoutée à 'requests'
-- ✅ Tables créées avec RLS et indexes
-- ✅ Trigger de synchronisation activé
