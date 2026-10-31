-- ============================================
-- FIX RAPIDE - VERSION 2 - RÔLES CORRECTS
-- ============================================
-- Ce script teste différentes valeurs de rôle

-- ============================================
-- 1. CRÉER LE PROFIL AVEC DIFFÉRENTS RÔLES
-- ============================================
DO $$
DECLARE
  v_email TEXT;
  v_full_name TEXT;
  v_role TEXT;
BEGIN
  -- Récupérer les infos du user depuis auth.users
  SELECT 
    email,
    COALESCE(raw_user_meta_data->>'full_name', email)
  INTO v_email, v_full_name
  FROM auth.users
  WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';

  IF v_email IS NULL THEN
    RAISE NOTICE '❌ User introuvable dans auth.users';
    RETURN;
  END IF;

  -- Essayer différents rôles (tester un par un si un échoue)
  -- Décommentez celui qui fonctionne!
  
  -- Option 1: Acheteur (essayez en premier)
  v_role := 'Acheteur';
  
  -- Option 2: Particulier (si Option 1 échoue, commentez ligne 27 et décommentez celle-ci)
  -- v_role := 'Particulier';
  
  -- Option 3: acheteur (minuscule - si Options 1-2 échouent)
  -- v_role := 'acheteur';
  
  -- Option 4: particulier (minuscule - si Options 1-3 échouent)
  -- v_role := 'particulier';
  
  -- Option 5: Buyer (anglais - si Options 1-4 échouent)
  -- v_role := 'Buyer';

  BEGIN
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
      v_role,
      v_full_name,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      role = EXCLUDED.role,
      full_name = EXCLUDED.full_name,
      updated_at = NOW();
    
    RAISE NOTICE '✅ Profil créé avec rôle: % pour user: %', v_role, v_email;
  EXCEPTION
    WHEN check_violation THEN
      RAISE NOTICE '❌ Rôle "%" refusé. Essayez un autre rôle dans le script.', v_role;
      RAISE NOTICE 'Consultez la section diagnostic pour voir les rôles valides.';
      RAISE;
  END;
END $$;


-- ============================================
-- 2. AJOUTER COLONNE METADATA À REQUESTS
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'requests' 
      AND column_name = 'metadata'
  ) THEN
    ALTER TABLE public.requests 
    ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    
    CREATE INDEX IF NOT EXISTS idx_requests_metadata 
    ON public.requests USING GIN (metadata);
    
    RAISE NOTICE '✅ Colonne metadata ajoutée à requests';
  ELSE
    RAISE NOTICE '✓ Colonne metadata existe déjà';
  END IF;
  
  UPDATE public.requests 
  SET metadata = '{}'::jsonb 
  WHERE metadata IS NULL;
  
  RAISE NOTICE '✅ Lignes existantes mises à jour';
END $$;


-- ============================================
-- 3. DIAGNOSTIC - Voir les rôles valides
-- ============================================
-- Voir la contrainte CHECK sur role
SELECT 
  '📋 CONTRAINTE SUR ROLE:' as info,
  pg_get_constraintdef(oid) AS definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
  AND conname LIKE '%role%';

-- Voir les rôles actuellement utilisés
SELECT 
  '📊 RÔLES EXISTANTS:' as info,
  role,
  COUNT(*) as nombre_users
FROM profiles
WHERE role IS NOT NULL
GROUP BY role
ORDER BY nombre_users DESC;


-- ============================================
-- 4. VÉRIFICATIONS
-- ============================================
SELECT 
  '✅ PROFIL CRÉÉ:' as info,
  id, 
  email, 
  role, 
  full_name
FROM profiles 
WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';

SELECT 
  '✅ COLONNE METADATA:' as info,
  column_name, 
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests' 
  AND column_name = 'metadata';
