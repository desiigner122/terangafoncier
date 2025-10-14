-- ============================================
-- FIX AUTOMATIQUE - ESSAIE TOUS LES RÔLES
-- ============================================
-- Ce script essaie automatiquement tous les rôles possibles
-- jusqu'à ce qu'un fonctionne!

DO $$
DECLARE
  v_email TEXT;
  v_full_name TEXT;
  v_roles TEXT[] := ARRAY[
    'Acheteur',
    'Particulier', 
    'Admin',
    'Vendeur',
    'Vendeur Particulier',
    'Vendeur Pro',
    'Notaire',
    'Géomètre',
    'Banque',
    'Agent Foncier',
    'Promoteur',
    'Municipalité',
    'acheteur',
    'particulier',
    'buyer',
    'user',
    'User',
    'Customer',
    'Client'
  ];
  v_role TEXT;
  v_success BOOLEAN := FALSE;
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

  -- Essayer chaque rôle
  FOREACH v_role IN ARRAY v_roles LOOP
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
      
      v_success := TRUE;
      RAISE NOTICE '✅✅✅ SUCCÈS! Profil créé avec rôle: "%" ✅✅✅', v_role;
      RAISE NOTICE 'Email: %', v_email;
      EXIT; -- Sortir de la boucle
      
    EXCEPTION
      WHEN check_violation THEN
        RAISE NOTICE '❌ Rôle "%" refusé', v_role;
        CONTINUE; -- Essayer le suivant
    END;
  END LOOP;

  IF NOT v_success THEN
    RAISE NOTICE '❌❌❌ AUCUN RÔLE N''A FONCTIONNÉ!';
    RAISE NOTICE 'Exécutez le script "voir-roles-autorises.sql" pour voir la contrainte';
  END IF;
END $$;


-- ============================================
-- AJOUTER COLONNE METADATA
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
END $$;


-- ============================================
-- VÉRIFICATIONS
-- ============================================
SELECT 
  '✅ PROFIL:' as info,
  id, 
  email, 
  role, 
  full_name
FROM profiles 
WHERE id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2';

SELECT 
  '✅ METADATA:' as info,
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'requests' 
  AND column_name = 'metadata';

-- Voir la contrainte pour info
SELECT 
  '📋 CONTRAINTE:' as info,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
  AND conname LIKE '%role%';
