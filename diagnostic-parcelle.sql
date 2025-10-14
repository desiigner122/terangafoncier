-- ========================================
-- DIAGNOSTIC PARCELLE 9a2dce41-8e2c-4888-b3d8-0dce41339b5a
-- ========================================

-- 1. Vérifier si la parcelle existe
SELECT 
  id,
  title,
  status,
  owner_id,
  created_at,
  price
FROM public.parcels
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';

-- 2. Vérifier le type de la colonne id (devrait être UUID)
SELECT 
  column_name, 
  data_type, 
  character_maximum_length,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'parcels'
AND column_name = 'id';

-- 3. Lister toutes les parcelles disponibles
SELECT 
  id,
  title,
  status,
  price,
  owner_id
FROM public.parcels
WHERE status IN ('available', 'verified')
ORDER BY created_at DESC
LIMIT 10;

-- 4. Vérifier les politiques RLS sur parcels
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'parcels';

-- 5. Si aucune parcelle n'existe, en créer une de test
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Récupérer le premier user_id disponible
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;
  
  -- Créer une parcelle de test si elle n'existe pas
  INSERT INTO public.parcels (
    id,
    title,
    description,
    status,
    price,
    surface,
    location,
    owner_id,
    created_at
  )
  VALUES (
    '9a2dce41-8e2c-4888-b3d8-0dce41339b5a',
    'Terrain Résidentiel Test',
    'Parcelle de test pour paiement comptant',
    'available',
    8500000,
    500,
    'Dakar, Sénégal',
    test_user_id,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    status = 'available',
    updated_at = NOW();
  
  RAISE NOTICE '✅ Parcelle de test créée/mise à jour: 9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
END $$;

-- 6. Vérifier à nouveau après insertion
SELECT 
  id,
  title,
  status,
  price,
  owner_id
FROM public.parcels
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
