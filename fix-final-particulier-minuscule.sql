-- ============================================
-- FIX FINAL - RÔLE CORRECT EN MINUSCULE
-- ============================================

-- ============================================
-- 1. CRÉER LE PROFIL AVEC 'particulier'
-- ============================================
DO $$
DECLARE
  v_email TEXT;
  v_full_name TEXT;
BEGIN
  -- Récupérer les infos du user
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

  -- Créer le profil avec le rôle 'particulier' (en minuscules!)
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
    'particulier',  -- ← EN MINUSCULES!
    v_full_name,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = 'particulier',
    full_name = EXCLUDED.full_name,
    updated_at = NOW();
  
  RAISE NOTICE '✅✅✅ SUCCÈS! Profil créé avec rôle: particulier ✅✅✅';
  RAISE NOTICE 'Email: %', v_email;
  RAISE NOTICE 'Full name: %', v_full_name;
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
  
  RAISE NOTICE '✅ Requests mises à jour';
END $$;


-- ============================================
-- 3. CRÉER LA VIEW TICKETS → SUPPORT_TICKETS
-- ============================================
DO $$
BEGIN
  CREATE OR REPLACE VIEW public.tickets AS
  SELECT * FROM public.support_tickets;

  GRANT SELECT, INSERT, UPDATE ON public.tickets TO authenticated;
  GRANT SELECT, INSERT, UPDATE ON public.tickets TO service_role;

  RAISE NOTICE '✅ View tickets créée';
END $$;


-- ============================================
-- 4. VÉRIFICATIONS FINALES
-- ============================================
-- Vérifier le profil créé
SELECT 
  '✅ PROFIL CRÉÉ:' as info,
  id, 
  email, 
  role, 
  full_name,
  created_at
FROM profiles 
WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';

-- Vérifier la colonne metadata
SELECT 
  '✅ METADATA:' as info,
  column_name, 
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests' 
  AND column_name = 'metadata';

-- Vérifier la view tickets
SELECT 
  '✅ VIEW TICKETS:' as info,
  COUNT(*) as nombre_tickets
FROM tickets;

-- Afficher les rôles valides pour référence
SELECT 
  '📋 RÔLES VALIDES:' as info,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
  AND conname LIKE '%role%';


-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- ✅✅✅ SUCCÈS! Profil créé avec rôle: particulier
-- ✅ Colonne metadata ajoutée à requests
-- ✅ View tickets créée
-- 
-- Puis 4 tables affichant:
-- 1. Le profil avec email, role='particulier', full_name
-- 2. La colonne metadata de type jsonb
-- 3. Le nombre de tickets (peut être 0)
-- 4. La contrainte CHECK avec tous les rôles valides
