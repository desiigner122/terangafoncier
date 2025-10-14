-- ============================================
-- FIX RAPIDE - ERREURS CRITIQUES UNIQUEMENT
-- ============================================
-- Ce script corrige seulement les 2 erreurs actuelles
-- Exécutez celui-ci en PREMIER si le script complet échoue

-- ============================================
-- 1. CRÉER LE PROFIL MANQUANT (CRITIQUE)
-- ============================================
DO $$
DECLARE
  v_email TEXT;
  v_full_name TEXT;
BEGIN
  -- Récupérer les infos du user depuis auth.users
  SELECT 
    email,
    COALESCE(raw_user_meta_data->>'full_name', email)
  INTO v_email, v_full_name
  FROM auth.users
  WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';

  -- Si le user existe dans auth mais pas dans profiles, le créer
  IF v_email IS NOT NULL THEN
    INSERT INTO public.profiles (
      id,
      email,
      role,
      full_name,
      created_at,
      updated_at
    ) VALUES (
      '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2',
      v_email,
      'Particulier',
      v_full_name,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      updated_at = NOW();
    
    RAISE NOTICE '✅ Profil créé/mis à jour pour user: %', v_email;
  ELSE
    RAISE NOTICE '❌ User introuvable dans auth.users';
  END IF;
END $$;


-- ============================================
-- 2. AJOUTER COLONNE METADATA À REQUESTS (CRITIQUE)
-- ============================================
DO $$
BEGIN
  -- Vérifier si la colonne existe
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'requests' 
      AND column_name = 'metadata'
  ) THEN
    -- Ajouter la colonne
    ALTER TABLE public.requests 
    ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    
    -- Créer un index GIN pour performance
    CREATE INDEX idx_requests_metadata 
    ON public.requests USING GIN (metadata);
    
    RAISE NOTICE '✅ Colonne metadata ajoutée à requests';
  ELSE
    RAISE NOTICE '✓ Colonne metadata existe déjà';
  END IF;
  
  -- Mettre à jour les lignes existantes qui ont NULL
  UPDATE public.requests 
  SET metadata = '{}'::jsonb 
  WHERE metadata IS NULL;
  
  RAISE NOTICE '✅ Lignes existantes mises à jour';
END $$;


-- ============================================
-- 3. VÉRIFICATIONS
-- ============================================
-- Vérifier le profil
SELECT 
  id, 
  email, 
  role, 
  full_name,
  '✅ Profil OK' as status
FROM profiles 
WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';

-- Vérifier la colonne metadata
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default,
  '✅ Colonne OK' as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests' 
  AND column_name = 'metadata';

-- Tester une requête sur requests
SELECT 
  COUNT(*) as total_requests,
  '✅ Table requests OK' as status
FROM requests;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Vous devriez voir 3 tables de résultats:
-- 1. Profil avec email et role = 'Particulier'
-- 2. Colonne metadata de type 'jsonb'
-- 3. Nombre de requests (peut être 0)
