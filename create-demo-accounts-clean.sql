-- 🎭 CRÉATION COMPTES DÉMO - TERANGA FONCIER
-- ==========================================
-- Script pour créer des utilisateurs de démonstration pour chaque dashboard

-- 🔧 FONCTION POUR CRÉER UN UTILISATEUR AVEC PROFIL
CREATE OR REPLACE FUNCTION create_demo_user(
  user_email TEXT,
  user_password TEXT,
  user_full_name TEXT,
  user_role TEXT,
  user_phone TEXT DEFAULT NULL,
  user_city TEXT DEFAULT 'Dakar'
) RETURNS UUID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Note: En production, les utilisateurs seront créés via l'interface d'inscription
  -- Ce script sert à préparer les profils dans la base
  
  -- Générer un UUID pour la démo
  user_id := gen_random_uuid();
  
  -- Insérer le profil utilisateur
  INSERT INTO public.profiles (
    id, email, full_name, role, phone, city, is_verified, is_active
  ) VALUES (
    user_id, user_email, user_full_name, user_role, user_phone, user_city, true, true
  );
  
  RETURN user_id;
END;
$$ LANGUAGE plpgsql;

-- 🎯 CRÉATION DES COMPTES DÉMO

-- 1. 👑 ADMINISTRATEUR
SELECT create_demo_user(
  'admin@terangafoncier.com',
  'Admin123!',
  'Amadou DIALLO - Administrateur',
  'admin',
  '+221 77 123 4567',
  'Dakar'
);

-- 2. 🏠 PARTICULIER
SELECT create_demo_user(
  'particulier@terangafoncier.com', 
  'Demo123!',
  'Fatou NDIAYE - Particulier',
  'particular',
  '+221 76 234 5678',
  'Dakar'
);

-- 3. 💼 VENDEUR IMMOBILIER
SELECT create_demo_user(
  'vendeur@terangafoncier.com',
  'Demo123!', 
  'Moussa FALL - Agent Immobilier',
  'vendeur',
  '+221 75 345 6789',
  'Dakar'
);

-- 4. 💰 INVESTISSEUR
SELECT create_demo_user(
  'investisseur@terangafoncier.com',
  'Demo123!',
  'Ousmane SARR - Investisseur',
  'investisseur', 
  '+221 77 456 7890',
  'Dakar'
);

-- 5. 🏗️ PROMOTEUR IMMOBILIER
SELECT create_demo_user(
  'promoteur@terangafoncier.com',
  'Demo123!',
  'Aminata KANE - Promoteur',
  'promoteur',
  '+221 76 567 8901',
  'Rufisque'
);

-- 6. 🏛️ MUNICIPALITÉ
SELECT create_demo_user(
  'municipalite@terangafoncier.com',
  'Demo123!',
  'Commune de Dakar - Services Fonciers',
  'municipalite',
  '+221 33 889 2050',
  'Dakar'
);

-- 7. ⚖️ NOTAIRE
SELECT create_demo_user(
  'notaire@terangafoncier.com',
  'Demo123!',
  'Me Ibrahima SECK - Notaire',
  'notaire',
  '+221 77 678 9012',
  'Dakar'
);

-- 8. 📐 GÉOMÈTRE
SELECT create_demo_user(
  'geometre@terangafoncier.com',
  'Demo123!',
  'Cheikh DIOP - Géomètre Expert',
  'geometre',
  '+221 76 789 0123',
  'Thiès'
);

-- 9. 🏦 BANQUE
SELECT create_demo_user(
  'banque@terangafoncier.com',
  'Demo123!',
  'Banque de Habitat du Sénégal',
  'banque',
  '+221 33 839 9200',
  'Dakar'
);

-- 📊 AJOUT DE DONNÉES DÉMO POUR LES PROPRIÉTÉS

-- Propriétés de démonstration
INSERT INTO public.properties (
  title, description, type, status, price, surface, bedrooms, bathrooms,
  address, city, region, images, features, owner_id
) VALUES 
-- Villa de luxe
(
  'Villa moderne avec piscine - Almadies',
  'Magnifique villa de 4 chambres avec piscine, jardin tropical et vue mer. Finitions haut de gamme.',
  'villa',
  'available', 
  450000000.00,
  350.00,
  4,
  3,
  'Route des Almadies, Ngor',
  'Dakar',
  'Dakar',
  ARRAY['villa1.jpg', 'villa1_piscine.jpg', 'villa1_salon.jpg'],
  ARRAY['Piscine', 'Jardin', 'Garage 2 voitures', 'Climatisation', 'Sécurité 24h'],
  (SELECT id FROM public.profiles WHERE role = 'vendeur' LIMIT 1)
),

-- Appartement moderne
(
  'Appartement 3 pièces - Plateau',
  'Bel appartement au 5ème étage avec ascenseur, balcon et vue panoramique sur la ville.',
  'appartement',
  'available',
  85000000.00,
  95.00,
  2,
  2,
  'Avenue Léopold Sédar Senghor, Plateau',
  'Dakar',
  'Dakar', 
  ARRAY['appart1.jpg', 'appart1_salon.jpg', 'appart1_cuisine.jpg'],
  ARRAY['Ascenseur', 'Balcon', 'Parking', 'Fibre optique'],
  (SELECT id FROM public.profiles WHERE role = 'vendeur' LIMIT 1)
),

-- Terrain constructible
(
  'Terrain 800m² - Zone résidentielle Rufisque',
  'Terrain viabilisé prêt à construire dans une zone en plein développement.',
  'terrain',
  'available',
  32000000.00,
  800.00,
  NULL,
  NULL,
  'Quartier Gouye Mbind, Rufisque',
  'Rufisque',
  'Dakar',
  ARRAY['terrain1.jpg', 'terrain1_vue.jpg'],
  ARRAY['Viabilisé', 'Titre foncier', 'Accès goudronné', 'Électricité proche'],
  (SELECT id FROM public.profiles WHERE role = 'vendeur' LIMIT 1)
);

-- 📋 AJOUT DE DEMANDES DE DÉMONSTRATION
INSERT INTO public.requests (
  type, status, title, description, user_id, property_id
) VALUES
(
  'visit',
  'pending',
  'Demande de visite - Villa Almadies',
  'Je souhaiterais visiter cette villa ce weekend. Merci.',
  (SELECT id FROM public.profiles WHERE role = 'particular' LIMIT 1),
  (SELECT id FROM public.properties WHERE title LIKE '%Villa moderne%' LIMIT 1)
),
(
  'municipal_land',
  'pending', 
  'Demande terrain municipal - Zone industrielle',
  'Demande attribution de terrain pour projet industriel textile.',
  (SELECT id FROM public.profiles WHERE role = 'investisseur' LIMIT 1),
  NULL
);

-- 📨 MESSAGES DE DÉMONSTRATION
INSERT INTO public.messages (
  sender_id, recipient_id, subject, content
) VALUES
(
  (SELECT id FROM public.profiles WHERE role = 'particular' LIMIT 1),
  (SELECT id FROM public.profiles WHERE role = 'vendeur' LIMIT 1),
  'Question sur la villa Almadies',
  'Bonjour, aimerais avoir plus informations sur les charges de copropriété et la disponibilité pour une visite.'
),
(
  (SELECT id FROM public.profiles WHERE role = 'municipalite' LIMIT 1),
  (SELECT id FROM public.profiles WHERE role = 'investisseur' LIMIT 1),
  'Réponse à votre demande de terrain',
  'Votre demande a été reçue. Merci de fournir les documents complémentaires pour instruction.'
);

-- 🏗️ PROJETS DE DÉMONSTRATION POUR PROMOTEURS
INSERT INTO public.projects (
  name, description, status, location, total_units, sold_units, price_range, completion_date, promoter_id
) VALUES
(
  'Résidence Les Palmiers',
  'Complexe résidentiel de standing avec 45 appartements, espaces verts et équipements sportifs.',
  'construction',
  'Guédiawaye, Dakar',
  45,
  12,
  '35M - 85M FCFA',
  '2026-06-30',
  (SELECT id FROM public.profiles WHERE role = 'promoteur' LIMIT 1)
),
(
  'Centre Commercial Teranga',
  'Centre commercial moderne avec 80 boutiques et parking de 200 places.',
  'planning', 
  'Pikine, Dakar',
  80,
  0,
  '15M - 150M FCFA',
  '2027-12-31',
  (SELECT id FROM public.profiles WHERE role = 'promoteur' LIMIT 1)
);

-- ✅ VALIDATION CRÉATION COMPTES
DO $$
DECLARE
    profile_count integer;
    property_count integer;
    request_count integer;
BEGIN
    SELECT COUNT(*) INTO profile_count FROM public.profiles;
    SELECT COUNT(*) INTO property_count FROM public.properties;
    SELECT COUNT(*) INTO request_count FROM public.requests;
    
    RAISE NOTICE '🎉 Comptes démo créés avec succès !';
    RAISE NOTICE '👥 Profils créés: %', profile_count;
    RAISE NOTICE '🏠 Propriétés créées: %', property_count;
    RAISE NOTICE '📋 Demandes créées: %', request_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔑 COMPTES DE DÉMONSTRATION:';
    RAISE NOTICE '👑 Admin: admin@terangafoncier.com';
    RAISE NOTICE '🏠 Particulier: particulier@terangafoncier.com';
    RAISE NOTICE '💼 Vendeur: vendeur@terangafoncier.com';
    RAISE NOTICE '💰 Investisseur: investisseur@terangafoncier.com';
    RAISE NOTICE '🏗️ Promoteur: promoteur@terangafoncier.com';
    RAISE NOTICE '🏛️ Municipalité: municipalite@terangafoncier.com';
    RAISE NOTICE '⚖️ Notaire: notaire@terangafoncier.com';
    RAISE NOTICE '📐 Géomètre: geometre@terangafoncier.com';
    RAISE NOTICE '🏦 Banque: banque@terangafoncier.com';
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Mot de passe pour tous: Demo123!';
END $$;

-- 🧹 NETTOYAGE FONCTION TEMPORAIRE
DROP FUNCTION create_demo_user;
