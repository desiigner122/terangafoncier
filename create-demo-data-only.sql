-- 🎭 DONNÉES DÉMO SUPABASE - TERANGA FONCIER
-- ============================================
-- Script pour créer uniquement les données de démonstration
-- Les utilisateurs seront créés via l'interface d'inscription Supabase

-- 🏠 PROPRIÉTÉS DE DÉMONSTRATION
-- ===============================

-- Créer des propriétés sans propriétaire (seront assignées après création des comptes)
INSERT INTO public.properties (
  id, title, description, type, status, price, surface, bedrooms, bathrooms,
  address, city, region, images, features, owner_id
) VALUES 
-- Villa de luxe
(
  '11111111-1111-1111-1111-111111111111',
  'Villa moderne avec piscine - Almadies',
  'Magnifique villa de 4 chambres avec piscine, jardin tropical et vue mer. Finitions haut de gamme dans le quartier résidentiel des Almadies.',
  'villa',
  'available', 
  450000000.00,
  350.00,
  4,
  3,
  'Route des Almadies, Ngor',
  'Dakar',
  'Dakar',
  ARRAY['villa_almadies_1.jpg', 'villa_almadies_piscine.jpg', 'villa_almadies_salon.jpg'],
  ARRAY['Piscine', 'Jardin tropical', 'Garage 2 voitures', 'Climatisation', 'Sécurité 24h', 'Vue mer'],
  NULL  -- Sera assigné après création du compte vendeur
),

-- Appartement moderne
(
  '22222222-2222-2222-2222-222222222222',
  'Appartement 3 pièces - Plateau',
  'Bel appartement au 5ème étage avec ascenseur, balcon et vue panoramique sur la ville. Idéal pour jeune couple ou investissement locatif.',
  'appartement',
  'available',
  85000000.00,
  95.00,
  2,
  2,
  'Avenue Léopold Sédar Senghor, Plateau',
  'Dakar',
  'Dakar', 
  ARRAY['appart_plateau_1.jpg', 'appart_plateau_salon.jpg', 'appart_plateau_cuisine.jpg'],
  ARRAY['Ascenseur', 'Balcon', 'Parking sécurisé', 'Fibre optique', 'Vue panoramique'],
  NULL  -- Sera assigné après création du compte vendeur
),

-- Terrain constructible
(
  '33333333-3333-3333-3333-333333333333',
  'Terrain 800m² - Zone résidentielle Rufisque',
  'Terrain viabilisé prêt à construire dans une zone en plein développement, proche des commodités et des transports.',
  'terrain',
  'available',
  32000000.00,
  800.00,
  NULL,
  NULL,
  'Quartier Gouye Mbind, Rufisque',
  'Rufisque',
  'Dakar',
  ARRAY['terrain_rufisque_1.jpg', 'terrain_rufisque_vue.jpg'],
  ARRAY['Viabilisé', 'Titre foncier', 'Accès goudronné', 'Électricité proche', 'Zone résidentielle'],
  NULL  -- Sera assigné après création du compte vendeur
),

-- Commerce - Local commercial
(
  '44444444-4444-4444-4444-444444444444',
  'Local commercial 120m² - Sandaga',
  'Local commercial bien situé dans le marché Sandaga, avec vitrine et réserve. Idéal pour commerce de détail.',
  'commerce',
  'available',
  95000000.00,
  120.00,
  NULL,
  1,
  'Marché Sandaga, Centre-ville',
  'Dakar',
  'Dakar',
  ARRAY['commerce_sandaga_1.jpg', 'commerce_sandaga_vitrine.jpg'],
  ARRAY['Vitrine', 'Réserve', 'Compteur électrique', 'Point d''eau', 'Zone commerciale'],
  NULL
),

-- Bureau moderne
(
  '55555555-5555-5555-5555-555555555555',
  'Bureau 200m² - Mamelles',
  'Espace de bureau moderne avec open space, salles de réunion et parking. Parfait pour startup ou PME.',
  'bureau',
  'available',
  150000000.00,
  200.00,
  NULL,
  2,
  'Cité Keur Gorgui, Mamelles',
  'Dakar',
  'Dakar',
  ARRAY['bureau_mamelles_1.jpg', 'bureau_mamelles_openspace.jpg'],
  ARRAY['Open space', 'Salles de réunion', 'Parking', 'Climatisation', 'Fibre optique'],
  NULL
)

ON CONFLICT (id) DO NOTHING;

-- 🏗️ PROJETS DE DÉMONSTRATION
-- ============================

INSERT INTO public.projects (
  id, name, description, status, location, total_units, sold_units, price_range, completion_date, promoter_id
) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Résidence Les Palmiers',
  'Complexe résidentiel de standing avec 45 appartements, espaces verts, piscine commune et équipements sportifs modernes.',
  'construction',
  'Guédiawaye, Dakar',
  45,
  12,
  '35M - 85M FCFA',
  '2026-06-30',
  NULL  -- Sera assigné après création du compte promoteur
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Centre Commercial Teranga',
  'Centre commercial moderne avec 80 boutiques, hypermarché, restaurants et parking de 200 places.',
  'planning', 
  'Pikine, Dakar',
  80,
  0,
  '15M - 150M FCFA',
  '2027-12-31',
  NULL  -- Sera assigné après création du compte promoteur
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Cité des Affaires Dakar',
  'Complexe de bureaux haut standing avec tours de 15 étages, centre de conférences et services intégrés.',
  'planning',
  'Plateau, Dakar',
  120,
  5,
  '50M - 300M FCFA',
  '2028-12-31',
  NULL
)

ON CONFLICT (id) DO NOTHING;

-- ✅ VALIDATION CRÉATION DONNÉES
DO $$
DECLARE
    property_count integer;
    project_count integer;
BEGIN
    SELECT COUNT(*) INTO property_count FROM public.properties;
    SELECT COUNT(*) INTO project_count FROM public.projects;
    
    RAISE NOTICE '🎉 Données démo créées avec succès !';
    RAISE NOTICE '🏠 Propriétés créées: %', property_count;
    RAISE NOTICE '🏗️ Projets créés: %', project_count;
    RAISE NOTICE '';
    RAISE NOTICE '📋 PROCHAINES ÉTAPES:';
    RAISE NOTICE '1. Créer les comptes utilisateurs via l''interface web';
    RAISE NOTICE '2. Exécuter le script d''assignation des propriétés';
    RAISE NOTICE '3. Tester tous les dashboards';
END $$;
