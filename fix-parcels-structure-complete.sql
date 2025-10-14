-- ========================================
-- FIX PARCELS STRUCTURE & CREATE TEST PARCEL
-- ========================================
-- Ce script crée/met à jour la structure de la table parcels
-- et insère la parcelle de test nécessaire

-- ========================================
-- 1. VÉRIFIER ET AJOUTER LES COLONNES MANQUANTES
-- ========================================

-- Ajouter surface si manquante
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'parcels' 
    AND column_name = 'surface'
  ) THEN
    ALTER TABLE public.parcels ADD COLUMN surface NUMERIC(10,2);
    RAISE NOTICE '✅ Colonne surface ajoutée';
  ELSE
    RAISE NOTICE '✓ Colonne surface existe déjà';
  END IF;
END $$;

-- Ajouter area si c'est le nom utilisé à la place de surface
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'parcels' 
    AND column_name = 'area'
  ) THEN
    ALTER TABLE public.parcels ADD COLUMN area NUMERIC(10,2);
    RAISE NOTICE '✅ Colonne area ajoutée';
  ELSE
    RAISE NOTICE '✓ Colonne area existe déjà';
  END IF;
END $$;

-- Ajouter location si manquante
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'parcels' 
    AND column_name = 'location'
  ) THEN
    ALTER TABLE public.parcels ADD COLUMN location TEXT;
    RAISE NOTICE '✅ Colonne location ajoutée';
  ELSE
    RAISE NOTICE '✓ Colonne location existe déjà';
  END IF;
END $$;

-- Ajouter address si c'est le nom utilisé à la place de location
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'parcels' 
    AND column_name = 'address'
  ) THEN
    ALTER TABLE public.parcels ADD COLUMN address TEXT;
    RAISE NOTICE '✅ Colonne address ajoutée';
  ELSE
    RAISE NOTICE '✓ Colonne address existe déjà';
  END IF;
END $$;

-- ========================================
-- 2. TROUVER UN USER_ID EXISTANT
-- ========================================

DO $$ 
DECLARE
  test_user_id UUID;
  parcel_exists BOOLEAN;
BEGIN
  -- Trouver le premier utilisateur avec le rôle 'particulier'
  SELECT id INTO test_user_id
  FROM public.profiles
  WHERE role = 'particulier'
  LIMIT 1;

  -- Si aucun utilisateur 'particulier', prendre n'importe quel utilisateur
  IF test_user_id IS NULL THEN
    SELECT id INTO test_user_id
    FROM public.profiles
    LIMIT 1;
  END IF;

  -- Si toujours NULL, créer un utilisateur test
  IF test_user_id IS NULL THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      'test.parcelle@teranga-foncier.sn',
      crypt('TestPassword123!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW()
    ) RETURNING id INTO test_user_id;

    INSERT INTO public.profiles (
      id,
      email,
      role,
      first_name,
      last_name
    ) VALUES (
      test_user_id,
      'test.parcelle@teranga-foncier.sn',
      'particulier',
      'Test',
      'Parcelle'
    );
    
    RAISE NOTICE '✅ Utilisateur test créé: %', test_user_id;
  ELSE
    RAISE NOTICE '✓ Utilisateur trouvé: %', test_user_id;
  END IF;

  -- ========================================
  -- 3. VÉRIFIER SI LA PARCELLE EXISTE
  -- ========================================

  SELECT EXISTS(
    SELECT 1 FROM public.parcels 
    WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
  ) INTO parcel_exists;

  IF parcel_exists THEN
    RAISE NOTICE '✓ Parcelle existe déjà: 9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
  ELSE
    RAISE NOTICE '⚠ Parcelle n''existe pas, création en cours...';
  END IF;

  -- ========================================
  -- 4. INSÉRER/METTRE À JOUR LA PARCELLE DE TEST
  -- ========================================

  -- Version avec SURFACE (si la colonne existe)
  BEGIN
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
      'Parcelle de test pour paiement comptant - Système Teranga Foncier',
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
      price = 8500000,
      surface = 500,
      location = 'Dakar, Sénégal',
      updated_at = NOW();

    RAISE NOTICE '✅ Parcelle créée/mise à jour avec SURFACE';
  EXCEPTION
    WHEN undefined_column THEN
      -- Si surface n'existe pas, essayer avec area
      BEGIN
        INSERT INTO public.parcels (
          id,
          title,
          description,
          status,
          price,
          area,
          address,
          owner_id,
          created_at
        )
        VALUES (
          '9a2dce41-8e2c-4888-b3d8-0dce41339b5a',
          'Terrain Résidentiel Test',
          'Parcelle de test pour paiement comptant - Système Teranga Foncier',
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
          price = 8500000,
          area = 500,
          address = 'Dakar, Sénégal',
          updated_at = NOW();

        RAISE NOTICE '✅ Parcelle créée/mise à jour avec AREA';
      EXCEPTION
        WHEN OTHERS THEN
          -- Insérer avec seulement les colonnes de base
          INSERT INTO public.parcels (
            id,
            title,
            description,
            status,
            price,
            owner_id,
            created_at
          )
          VALUES (
            '9a2dce41-8e2c-4888-b3d8-0dce41339b5a',
            'Terrain Résidentiel Test',
            'Parcelle de test - 500m² à Dakar - 8,500,000 FCFA',
            'available',
            8500000,
            test_user_id,
            NOW()
          )
          ON CONFLICT (id) DO UPDATE
          SET 
            status = 'available',
            price = 8500000,
            updated_at = NOW();

          RAISE NOTICE '✅ Parcelle créée/mise à jour (colonnes de base seulement)';
      END;
  END;

END $$;

-- ========================================
-- 5. VÉRIFICATION FINALE
-- ========================================

-- Afficher la parcelle créée
SELECT 
  id,
  title,
  status,
  price,
  owner_id,
  created_at
FROM public.parcels
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';

-- Compter toutes les parcelles
SELECT COUNT(*) as total_parcels FROM public.parcels;

-- Afficher la structure finale de la table
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'parcels'
ORDER BY ordinal_position;

-- ========================================
-- MESSAGE FINAL
-- ========================================

DO $$ 
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SCRIPT TERMINÉ AVEC SUCCÈS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Parcelle ID: 9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
  RAISE NOTICE 'Statut: available';
  RAISE NOTICE 'Prix: 8,500,000 FCFA';
  RAISE NOTICE '========================================';
END $$;
