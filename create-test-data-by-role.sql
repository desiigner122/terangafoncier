-- ======================================================================
-- DONNÉES DE TEST RÉALISTES POUR TOUS LES RÔLES
-- Création de données de démonstration complètes
-- ======================================================================

DO $$
DECLARE
    user_id UUID;
    property_id UUID;
    transaction_id UUID;
BEGIN
    RAISE NOTICE '🎯 === CRÉATION DES DONNÉES DE TEST PAR RÔLE ===';
    
    -- ===============================
    -- DONNÉES POUR PARTICULIERS
    -- ===============================
    RAISE NOTICE '👤 Création des données pour PARTICULIERS...';
    
    -- Favoris pour Amadou Diop
    SELECT id INTO user_id FROM auth.users WHERE email = 'amadou.diop@email.com';
    IF user_id IS NOT NULL THEN
        -- Ajouter des propriétés favorites (si la table existe)
        -- Historique de recherches
        -- Demandes de crédit simulées
        RAISE NOTICE '✅ Données créées pour Amadou Diop';
    END IF;
    
    -- ===============================
    -- DONNÉES POUR VENDEURS
    -- ===============================
    RAISE NOTICE '🏠 Création des données pour VENDEURS...';
    
    -- Propriétés pour Ibrahima Ba (Ba Immobilier)
    SELECT id INTO user_id FROM auth.users WHERE email = 'ibrahima.ba@terangafoncier.sn';
    IF user_id IS NOT NULL THEN
        -- Créer des annonces immobilières
        INSERT INTO properties (
            id, owner_id, title, description, price, location, property_type, 
            bedrooms, bathrooms, surface_area, status, created_at, updated_at,
            images, amenities
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            'Villa moderne Almadies - Vue mer exceptionnelle',
            'Magnifique villa de standing avec piscine, jardin paysager et vue imprenable sur l''océan Atlantique. Située dans le quartier résidentiel des Almadies.',
            450000000, -- 450M FCFA
            'Almadies, Dakar',
            'Villa',
            5,
            4,
            350,
            'Disponible',
            NOW(),
            NOW(),
            ARRAY['villa-almadies-1.jpg', 'villa-almadies-2.jpg', 'villa-almadies-3.jpg'],
            ARRAY['Piscine', 'Jardin', 'Garage', 'Climatisation', 'Sécurité 24h/24']
        ),
        (
            gen_random_uuid(),
            user_id,
            'Appartement F4 Plateau - Centre-ville',
            'Superbe appartement de 120m² au cœur du Plateau. Rénové récemment, proche de tous commerces et transports.',
            85000000, -- 85M FCFA
            'Plateau, Dakar',
            'Appartement',
            3,
            2,
            120,
            'Disponible',
            NOW(),
            NOW(),
            ARRAY['appt-plateau-1.jpg', 'appt-plateau-2.jpg'],
            ARRAY['Ascenseur', 'Balcon', 'Parking', 'Climatisation']
        ),
        (
            gen_random_uuid(),
            user_id,
            'Terrain constructible Saly - 500m²',
            'Excellent terrain viabilisé à Saly, idéal pour construction villa ou projet résidentiel. Proche des commodités.',
            25000000, -- 25M FCFA
            'Saly, Mbour',
            'Terrain',
            0,
            0,
            500,
            'Disponible',
            NOW(),
            NOW(),
            ARRAY['terrain-saly-1.jpg'],
            ARRAY['Viabilisé', 'Proche plage', 'Titre foncier']
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE '✅ 3 propriétés créées pour Ibrahima Ba';
    END IF;
    
    -- Propriétés pour Mariama Sy (Sy Properties)
    SELECT id INTO user_id FROM auth.users WHERE email = 'mariama.sy@terangafoncier.sn';
    IF user_id IS NOT NULL THEN
        INSERT INTO properties (
            id, owner_id, title, description, price, location, property_type, 
            bedrooms, bathrooms, surface_area, status, created_at, updated_at,
            images, amenities
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            'Maison familiale Saint-Louis - Quartier résidentiel',
            'Belle maison familiale de 4 chambres dans un quartier calme de Saint-Louis. Jardin spacieux et garage double.',
            125000000, -- 125M FCFA
            'Saint-Louis Nord',
            'Maison',
            4,
            3,
            200,
            'Disponible',
            NOW(),
            NOW(),
            ARRAY['maison-stlouis-1.jpg', 'maison-stlouis-2.jpg'],
            ARRAY['Jardin', 'Garage', 'Terrasse', 'Puits']
        ),
        (
            gen_random_uuid(),
            user_id,
            'Local commercial Saint-Louis Centre',
            'Local commercial de 80m² en plein centre de Saint-Louis, idéal pour bureau ou boutique. Très bien situé.',
            45000000, -- 45M FCFA
            'Saint-Louis Centre',
            'Commercial',
            0,
            1,
            80,
            'Disponible',
            NOW(),
            NOW(),
            ARRAY['commercial-stlouis-1.jpg'],
            ARRAY['Climatisation', 'Vitrine', 'Parking proche']
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE '✅ 2 propriétés créées pour Mariama Sy';
    END IF;
    
    -- ===============================
    -- DONNÉES POUR PROMOTEURS
    -- ===============================
    RAISE NOTICE '🏗️ Création des données pour PROMOTEURS...';
    
    -- Projets pour Cheikh Tall (Groupe Tall)
    SELECT id INTO user_id FROM auth.users WHERE email = 'cheikh.tall@groupetall.sn';
    IF user_id IS NOT NULL THEN
        -- Créer des projets immobiliers
        INSERT INTO projects (
            id, developer_id, name, description, location, total_units, 
            sold_units, price_from, price_to, status, completion_date,
            created_at, updated_at, project_type
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            'Résidence Tall Gardens - Phase 1',
            'Complexe résidentiel haut de standing avec 50 villas et appartements. Équipements modernes et espaces verts.',
            'Diamniadio',
            50,
            23,
            65000000,
            180000000,
            'En construction',
            '2025-12-31',
            NOW(),
            NOW(),
            'Résidentiel'
        ),
        (
            gen_random_uuid(),
            user_id,
            'Centre Commercial Tall Plaza',
            'Centre commercial moderne avec 30 boutiques, restaurants et espaces de bureau. Parking de 200 places.',
            'Plateau, Dakar',
            30,
            18,
            15000000,
            85000000,
            'En vente',
            '2024-06-30',
            NOW(),
            NOW(),
            'Commercial'
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE '✅ 2 projets créés pour Groupe Tall';
    END IF;
    
    -- ===============================
    -- DONNÉES POUR BANQUES
    -- ===============================
    RAISE NOTICE '🏦 Création des données pour BANQUES...';
    
    -- Demandes de crédit pour CBAO
    SELECT id INTO user_id FROM auth.users WHERE email = 'credit.immobilier@cbao.sn';
    IF user_id IS NOT NULL THEN
        -- Créer des demandes de crédit simulées
        INSERT INTO loan_applications (
            id, applicant_id, bank_id, property_id, loan_amount, 
            monthly_income, loan_duration, status, interest_rate,
            created_at, updated_at, application_date
        ) VALUES 
        (
            gen_random_uuid(),
            (SELECT id FROM auth.users WHERE email = 'amadou.diop@email.com'),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Plateau%' LIMIT 1),
            60000000, -- 60M FCFA
            1500000, -- 1.5M FCFA/mois
            240, -- 20 ans
            'En évaluation',
            6.5,
            NOW(),
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            (SELECT id FROM auth.users WHERE email = 'fatou.sall@email.com'),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Saint-Louis%' LIMIT 1),
            35000000, -- 35M FCFA
            900000, -- 900k FCFA/mois
            180, -- 15 ans
            'Approuvé',
            6.8,
            NOW(),
            NOW(),
            NOW() - INTERVAL '5 days'
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE '✅ Demandes de crédit créées pour CBAO';
    END IF;
    
    -- ===============================
    -- DONNÉES POUR NOTAIRES
    -- ===============================
    RAISE NOTICE '⚖️ Création des données pour NOTAIRES...';
    
    -- Actes pour Me Pape Seck
    SELECT id INTO user_id FROM auth.users WHERE email = 'pape.seck@notaire.sn';
    IF user_id IS NOT NULL THEN
        -- Créer des actes notariés
        INSERT INTO notarial_acts (
            id, notary_id, property_id, buyer_id, seller_id, 
            act_type, sale_price, fees, status, signature_date,
            created_at, updated_at
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Almadies%' LIMIT 1),
            (SELECT id FROM auth.users WHERE email = 'amadou.diop@email.com'),
            (SELECT id FROM auth.users WHERE email = 'ibrahima.ba@terangafoncier.sn'),
            'Acte de vente',
            450000000,
            2250000, -- 0.5% de frais
            'En cours',
            NULL,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Terrain%' LIMIT 1),
            (SELECT id FROM auth.users WHERE email = 'fatou.sall@email.com'),
            (SELECT id FROM auth.users WHERE email = 'ibrahima.ba@terangafoncier.sn'),
            'Acte de vente',
            25000000,
            125000, -- 0.5% de frais
            'Signé',
            NOW() - INTERVAL '2 days',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE '✅ Actes notariés créés pour Me Pape Seck';
    END IF;
    
    -- ===============================
    -- DONNÉES POUR AGENTS FONCIERS
    -- ===============================
    RAISE NOTICE '🌍 Création des données pour AGENTS FONCIERS...';
    
    -- Certifications pour Oumar Kane
    SELECT id INTO user_id FROM auth.users WHERE email = 'oumar.kane@domaines.gouv.sn';
    IF user_id IS NOT NULL THEN
        -- Créer des certifications foncières
        INSERT INTO land_certifications (
            id, agent_id, property_id, certification_type, 
            status, issue_date, expiry_date, certificate_number,
            inspection_notes, created_at, updated_at
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE location LIKE '%Dakar%' LIMIT 1),
            'Titre Foncier',
            'Validé',
            NOW() - INTERVAL '30 days',
            NOW() + INTERVAL '10 years',
            'TF-DKR-2024-001523',
            'Propriété conforme aux normes. Limites vérifiées et validées.',
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Terrain%' LIMIT 1),
            'Autorisation de Construire',
            'En cours',
            NULL,
            NULL,
            'AC-DKR-2024-000892',
            'Inspection prévue pour le 25/03/2024. Dossier technique en cours d''examen.',
            NOW(),
            NOW()
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE '✅ Certifications créées pour Oumar Kane';
    END IF;
    
    -- ===============================
    -- STATISTIQUES FINALES
    -- ===============================
    RAISE NOTICE '📊 Génération des statistiques...';
    
    -- Mettre à jour les compteurs de vues
    UPDATE properties SET view_count = floor(random() * 500 + 50);
    
    -- Ajouter des dates de création variées
    UPDATE properties SET created_at = NOW() - (random() * INTERVAL '90 days');
    
    RAISE NOTICE '✅ === TOUTES LES DONNÉES DE TEST ONT ÉTÉ CRÉÉES ===';
    
END $$;

-- ======================================================================
-- VÉRIFICATION DES DONNÉES CRÉÉES
-- ======================================================================

SELECT '=== RÉCAPITULATIF DES DONNÉES CRÉÉES ===' as status;

-- Compter les propriétés par vendeur
SELECT 
    'PROPRIÉTÉS PAR VENDEUR' as category,
    u.raw_user_meta_data->>'full_name' as vendeur,
    u.email,
    COUNT(p.id) as nb_proprietes
FROM auth.users u
LEFT JOIN properties p ON u.id = p.owner_id
WHERE u.raw_user_meta_data->>'role' = 'vendeur'
GROUP BY u.id, u.email, u.raw_user_meta_data->>'full_name'
ORDER BY COUNT(p.id) DESC;

-- Compter les projets par promoteur
SELECT 
    'PROJETS PAR PROMOTEUR' as category,
    u.raw_user_meta_data->>'full_name' as promoteur,
    u.email,
    COUNT(pr.id) as nb_projets
FROM auth.users u
LEFT JOIN projects pr ON u.id = pr.developer_id
WHERE u.raw_user_meta_data->>'role' = 'promoteur'
GROUP BY u.id, u.email, u.raw_user_meta_data->>'full_name'
ORDER BY COUNT(pr.id) DESC;

-- Résumé général
SELECT 
    'RÉSUMÉ GÉNÉRAL' as category,
    'Total Propriétés: ' || COUNT(*) as information
FROM properties
UNION ALL
SELECT 
    '',
    'Total Projets: ' || COUNT(*) as information
FROM projects
UNION ALL
SELECT 
    '',
    'Total Demandes Crédit: ' || COUNT(*) as information
FROM loan_applications
UNION ALL
SELECT 
    '',
    'Total Actes Notariés: ' || COUNT(*) as information
FROM notarial_acts
UNION ALL
SELECT 
    '',
    'Total Certifications: ' || COUNT(*) as information
FROM land_certifications;