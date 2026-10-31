-- ========================================
-- CRÉER LA PARCELLE DE TEST
-- ========================================
-- Script adapté à la structure réelle de la table parcels

DO $$ 
DECLARE
  test_user_id UUID;
  test_owner_id UUID;
  parcel_exists BOOLEAN;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '🔧 CRÉATION PARCELLE DE TEST';
  RAISE NOTICE '========================================';

  -- ========================================
  -- 1. TROUVER UN UTILISATEUR EXISTANT
  -- ========================================

  -- Essayer de trouver l'utilisateur connecté (family.diallo@teranga-foncier.sn)
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'family.diallo@teranga-foncier.sn'
  LIMIT 1;

  IF test_user_id IS NOT NULL THEN
    RAISE NOTICE '✅ Utilisateur trouvé: family.diallo@teranga-foncier.sn (%)', test_user_id;
  ELSE
    -- Sinon, prendre n'importe quel utilisateur
    SELECT id INTO test_user_id
    FROM auth.users
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
      RAISE NOTICE '✅ Utilisateur trouvé: %', test_user_id;
    ELSE
      RAISE EXCEPTION '❌ Aucun utilisateur trouvé dans la base de données';
    END IF;
  END IF;

  -- Utiliser le même ID pour owner_id et seller_id
  test_owner_id := test_user_id;

  -- ========================================
  -- 2. VÉRIFIER SI LA PARCELLE EXISTE
  -- ========================================

  SELECT EXISTS(
    SELECT 1 FROM public.parcels 
    WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
  ) INTO parcel_exists;

  IF parcel_exists THEN
    RAISE NOTICE '⚠️  Parcelle existe déjà, mise à jour...';
  ELSE
    RAISE NOTICE '📝 Création de la nouvelle parcelle...';
  END IF;

  -- ========================================
  -- 3. INSÉRER/METTRE À JOUR LA PARCELLE
  -- ========================================

  INSERT INTO public.parcels (
    id,
    title,
    name,
    description,
    price,
    surface,
    location,
    zone,
    status,
    owner_id,
    seller_id,
    is_featured,
    created_at,
    updated_at
  )
  VALUES (
    '9a2dce41-8e2c-4888-b3d8-0dce41339b5a',
    'Terrain Résidentiel Test',
    'Terrain Résidentiel Test',
    'Parcelle de test pour système de paiement comptant - 500m² à Dakar',
    8500000,
    500,
    'Dakar, Sénégal',
    'Zone Résidentielle',
    'available',
    test_owner_id,
    test_owner_id,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    title = 'Terrain Résidentiel Test',
    name = 'Terrain Résidentiel Test',
    description = 'Parcelle de test pour système de paiement comptant - 500m² à Dakar',
    price = 8500000,
    surface = 500,
    location = 'Dakar, Sénégal',
    zone = 'Zone Résidentielle',
    status = 'available',
    owner_id = test_owner_id,
    seller_id = test_owner_id,
    is_featured = true,
    updated_at = NOW();

  RAISE NOTICE '✅ Parcelle créée/mise à jour avec succès!';

  -- ========================================
  -- 4. VÉRIFICATION
  -- ========================================

  RAISE NOTICE '========================================';
  RAISE NOTICE '📋 DÉTAILS DE LA PARCELLE:';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'ID: 9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
  RAISE NOTICE 'Titre: Terrain Résidentiel Test';
  RAISE NOTICE 'Prix: 8,500,000 FCFA';
  RAISE NOTICE 'Surface: 500 m²';
  RAISE NOTICE 'Location: Dakar, Sénégal';
  RAISE NOTICE 'Statut: available';
  RAISE NOTICE 'Owner/Seller: %', test_owner_id;
  RAISE NOTICE '========================================';

END $$;

-- ========================================
-- 5. AFFICHER LA PARCELLE CRÉÉE
-- ========================================

SELECT 
  id,
  title,
  name,
  price,
  surface,
  location,
  zone,
  status,
  owner_id,
  seller_id,
  is_featured,
  created_at
FROM public.parcels
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';

-- ========================================
-- 6. STATISTIQUES
-- ========================================

SELECT 
  COUNT(*) as total_parcels,
  COUNT(*) FILTER (WHERE status = 'available') as available_parcels,
  COUNT(*) FILTER (WHERE status = 'sold') as sold_parcels
FROM public.parcels;

-- ========================================
-- MESSAGE FINAL
-- ========================================

DO $$ 
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅✅✅ SCRIPT TERMINÉ AVEC SUCCÈS ✅✅✅';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Prochaines étapes:';
  RAISE NOTICE '1. Retournez à votre navigateur (localhost:5173)';
  RAISE NOTICE '2. Rafraîchissez la page (F5)';
  RAISE NOTICE '3. Testez le bouton "Finaliser la demande"';
  RAISE NOTICE '';
END $$;
