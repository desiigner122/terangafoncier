-- ======================================================================
-- DONNÉES DE TEST POUR LES NOUVEAUX RÔLES
-- Extension pour Mairies, Investisseurs et Géomètres
-- ======================================================================

-- Ajouter les nouvelles tables nécessaires d'abord
CREATE TABLE IF NOT EXISTS municipal_permits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    municipality_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    permit_type VARCHAR(50) NOT NULL, -- Permis de construire, Occupation du domaine public, etc.
    permit_number VARCHAR(50) UNIQUE,
    status VARCHAR(20) DEFAULT 'En cours', -- En cours, Approuvé, Refusé
    application_date DATE DEFAULT CURRENT_DATE,
    approval_date DATE,
    expiry_date DATE,
    fee_amount BIGINT, -- Frais en FCFA
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS investment_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    investment_type VARCHAR(50) NOT NULL, -- Acquisition, Développement, Rénovation
    investment_amount BIGINT NOT NULL, -- Montant en FCFA
    expected_roi DECIMAL(5,2), -- ROI attendu en %
    duration_months INTEGER, -- Durée en mois
    status VARCHAR(20) DEFAULT 'Évaluation', -- Évaluation, Approuvé, Investi, Terminé
    risk_level VARCHAR(20) DEFAULT 'Moyen', -- Faible, Moyen, Élevé
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS surveying_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surveyor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    survey_type VARCHAR(50) NOT NULL, -- Topographie, Cadastre, Bornage, Expertise
    report_number VARCHAR(50) UNIQUE,
    survey_date DATE DEFAULT CURRENT_DATE,
    completion_date DATE,
    status VARCHAR(20) DEFAULT 'En cours', -- En cours, Terminé, Validé
    surface_measured DECIMAL(10,2), -- Surface mesurée en m²
    coordinates JSONB, -- Coordonnées GPS
    fee_amount BIGINT, -- Honoraires en FCFA
    report_file_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

DO $$
DECLARE
    user_id UUID;
    property_id UUID;
    client_id UUID;
BEGIN
    RAISE NOTICE '🎯 === CRÉATION DES DONNÉES POUR LES NOUVEAUX RÔLES ===';
    
    -- ===============================
    -- DONNÉES POUR MAIRIES
    -- ===============================
    RAISE NOTICE '🏛️ Création des données pour MAIRIES...';
    
    -- Données pour Mairie de Dakar
    SELECT id INTO user_id FROM auth.users WHERE email = 'urbanisme@mairie-dakar.sn';
    IF user_id IS NOT NULL THEN
        -- Permis de construire pour villa Almadies
        SELECT id INTO property_id FROM properties WHERE title LIKE '%Villa moderne Almadies%' LIMIT 1;
        SELECT id INTO client_id FROM auth.users WHERE email = 'cheikh.tall@groupetall.sn';
        
        INSERT INTO municipal_permits (
            id, municipality_id, applicant_id, property_id, permit_type, 
            permit_number, status, application_date, approval_date, fee_amount, notes
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            client_id,
            property_id,
            'Permis de construire',
            'PC-DKR-2024-0123',
            'Approuvé',
            NOW() - INTERVAL '45 days',
            NOW() - INTERVAL '15 days',
            1500000, -- 1.5M FCFA
            'Projet conforme au Plan Directeur d''Urbanisme. Respect des normes environnementales.'
        ),
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM auth.users WHERE email = 'ibrahima.ba@terangafoncier.sn'),
            (SELECT id FROM properties WHERE title LIKE '%Appartement F4 Plateau%' LIMIT 1),
            'Certificat de conformité',
            'CC-DKR-2024-0087',
            'En cours',
            NOW() - INTERVAL '10 days',
            NULL,
            500000, -- 500k FCFA
            'Vérification de la conformité des travaux de rénovation en cours.'
        ),
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM auth.users WHERE email = 'mamadou.diagne@investor.com'),
            NULL,
            'Occupation domaine public',
            'ODP-DKR-2024-0234',
            'Approuvé',
            NOW() - INTERVAL '30 days',
            NOW() - INTERVAL '5 days',
            750000, -- 750k FCFA
            'Autorisation temporaire pour chantier de construction (6 mois).'
        )
        ON CONFLICT (permit_number) DO NOTHING;
        
        RAISE NOTICE '✅ 3 permis créés pour Mairie de Dakar';
    END IF;
    
    -- Données pour Commune de Thiès
    SELECT id INTO user_id FROM auth.users WHERE email = 'technique@commune-thies.sn';
    IF user_id IS NOT NULL THEN
        INSERT INTO municipal_permits (
            id, municipality_id, applicant_id, property_id, permit_type, 
            permit_number, status, application_date, approval_date, fee_amount, notes
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM auth.users WHERE email = 'mariama.sy@terangafoncier.sn'),
            (SELECT id FROM properties WHERE title LIKE '%Maison familiale Saint-Louis%' LIMIT 1),
            'Permis de lotir',
            'PL-THS-2024-0045',
            'En cours',
            NOW() - INTERVAL '20 days',
            NULL,
            2000000, -- 2M FCFA
            'Projet de lotissement résidentiel - Étude d''impact en cours.'
        ),
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM auth.users WHERE email = 'fatou.sall@email.com'),
            NULL,
            'Certificat d''urbanisme',
            'CU-THS-2024-0156',
            'Approuvé',
            NOW() - INTERVAL '15 days',
            NOW() - INTERVAL '3 days',
            150000, -- 150k FCFA
            'Terrain constructible - Zone résidentielle R2.'
        )
        ON CONFLICT (permit_number) DO NOTHING;
        
        RAISE NOTICE '✅ 2 permis créés pour Commune de Thiès';
    END IF;
    
    -- ===============================
    -- DONNÉES POUR INVESTISSEURS
    -- ===============================
    RAISE NOTICE '💰 Création des données pour INVESTISSEURS...';
    
    -- Données pour Mamadou Diagne (Local)
    SELECT id INTO user_id FROM auth.users WHERE email = 'mamadou.diagne@investor.com';
    IF user_id IS NOT NULL THEN
        INSERT INTO investment_opportunities (
            id, investor_id, property_id, investment_type, investment_amount, 
            expected_roi, duration_months, status, risk_level
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Villa moderne Almadies%' LIMIT 1),
            'Acquisition',
            450000000, -- 450M FCFA
            12.5, -- 12.5% ROI
            36, -- 3 ans
            'Investi',
            'Moyen'
        ),
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Local commercial Saint-Louis%' LIMIT 1),
            'Développement',
            75000000, -- 75M FCFA (45M + 30M rénovation)
            18.0, -- 18% ROI
            24, -- 2 ans
            'Approuvé',
            'Faible'
        ),
        (
            gen_random_uuid(),
            user_id,
            NULL, -- Nouveau projet
            'Développement',
            200000000, -- 200M FCFA
            15.0, -- 15% ROI
            48, -- 4 ans
            'Évaluation',
            'Moyen'
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE '✅ 3 opportunités d''investissement créées pour Mamadou Diagne';
    END IF;
    
    -- Données pour Coumba Diouf (Diaspora)
    SELECT id INTO user_id FROM auth.users WHERE email = 'coumba.diouf@diaspora-invest.com';
    IF user_id IS NOT NULL THEN
        INSERT INTO investment_opportunities (
            id, investor_id, property_id, investment_type, investment_amount, 
            expected_roi, duration_months, status, risk_level
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Terrain constructible Saly%' LIMIT 1),
            'Développement',
            125000000, -- 125M FCFA (25M terrain + 100M construction)
            22.0, -- 22% ROI (projet touristique)
            60, -- 5 ans
            'Investi',
            'Élevé'
        ),
        (
            gen_random_uuid(),
            user_id,
            NULL, -- Projet résidence diaspora
            'Développement',
            350000000, -- 350M FCFA
            20.0, -- 20% ROI
            72, -- 6 ans
            'Approuvé',
            'Moyen'
        )
        ON CONFLICT (id) DO NOTHING;
        
        RAISE NOTICE '✅ 2 opportunités d''investissement créées pour Coumba Diouf';
    END IF;
    
    -- ===============================
    -- DONNÉES POUR GÉOMÈTRES
    -- ===============================
    RAISE NOTICE '📐 Création des données pour GÉOMÈTRES...';
    
    -- Données pour Alioune Cissé (Dakar)
    SELECT id INTO user_id FROM auth.users WHERE email = 'alioune.cisse@geometre.sn';
    IF user_id IS NOT NULL THEN
        INSERT INTO surveying_reports (
            id, surveyor_id, property_id, client_id, survey_type, 
            report_number, survey_date, completion_date, status, 
            surface_measured, coordinates, fee_amount, notes
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Villa moderne Almadies%' LIMIT 1),
            (SELECT id FROM auth.users WHERE email = 'cheikh.tall@groupetall.sn'),
            'Topographie',
            'TOP-DKR-2024-001',
            NOW() - INTERVAL '60 days',
            NOW() - INTERVAL '45 days',
            'Validé',
            348.75, -- 348.75 m² (légèrement différent de l'annonce)
            '{"latitude": 14.7516, "longitude": -17.5062, "altitude": 25}'::jsonb,
            2500000, -- 2.5M FCFA
            'Levé topographique complet avec implantation des constructions existantes.'
        ),
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Terrain constructible Saly%' LIMIT 1),
            (SELECT id FROM auth.users WHERE email = 'coumba.diouf@diaspora-invest.com'),
            'Bornage',
            'BOR-DKR-2024-012',
            NOW() - INTERVAL '30 days',
            NOW() - INTERVAL '15 days',
            'Validé',
            503.20, -- 503.20 m² (légèrement plus que prévu)
            '{"latitude": 14.3572, "longitude": -16.8644, "altitude": 15}'::jsonb,
            1800000, -- 1.8M FCFA
            'Bornage définitif avec implantation des bornes béton. Procès-verbal établi.'
        ),
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Appartement F4 Plateau%' LIMIT 1),
            (SELECT id FROM auth.users WHERE email = 'amadou.diop@email.com'),
            'Expertise',
            'EXP-DKR-2024-008',
            NOW() - INTERVAL '10 days',
            NULL,
            'En cours',
            NULL,
            NULL,
            1200000, -- 1.2M FCFA
            'Expertise technique avant acquisition - Vérification des surfaces et mitoyennetés.'
        )
        ON CONFLICT (report_number) DO NOTHING;
        
        RAISE NOTICE '✅ 3 rapports de géomètre créés pour Alioune Cissé';
    END IF;
    
    -- Données pour Fatou Mbaye (Thiès)
    SELECT id INTO user_id FROM auth.users WHERE email = 'fatou.mbaye@geodesie.sn';
    IF user_id IS NOT NULL THEN
        INSERT INTO surveying_reports (
            id, surveyor_id, property_id, client_id, survey_type, 
            report_number, survey_date, completion_date, status, 
            surface_measured, coordinates, fee_amount, notes
        ) VALUES 
        (
            gen_random_uuid(),
            user_id,
            (SELECT id FROM properties WHERE title LIKE '%Maison familiale Saint-Louis%' LIMIT 1),
            (SELECT id FROM auth.users WHERE email = 'mariama.sy@terangafoncier.sn'),
            'Cadastre',
            'CAD-THS-2024-015',
            NOW() - INTERVAL '40 days',
            NOW() - INTERVAL '25 days',
            'Validé',
            198.50, -- 198.50 m²
            '{"latitude": 16.0361, "longitude": -16.4895, "altitude": 8}'::jsonb,
            1500000, -- 1.5M FCFA
            'Mise à jour du plan cadastral - Nouvelle délimitation après extension.'
        ),
        (
            gen_random_uuid(),
            user_id,
            NULL, -- Nouveau projet
            (SELECT id FROM auth.users WHERE email = 'technique@commune-thies.sn'),
            'Topographie',
            'TOP-THS-2024-023',
            NOW() - INTERVAL '5 days',
            NULL,
            'En cours',
            NULL,
            NULL,
            3500000, -- 3.5M FCFA
            'Levé topographique pour projet de lotissement communal (50 parcelles).'
        )
        ON CONFLICT (report_number) DO NOTHING;
        
        RAISE NOTICE '✅ 2 rapports de géomètre créés pour Fatou Mbaye';
    END IF;
    
    RAISE NOTICE '✅ === DONNÉES CRÉÉES POUR TOUS LES NOUVEAUX RÔLES ===';
    
END $$;

-- ======================================================================
-- VÉRIFICATION DES DONNÉES CRÉÉES
-- ======================================================================

SELECT '=== RÉCAPITULATIF DES NOUVELLES DONNÉES ===' as status;

-- Permis municipaux par mairie
SELECT 
    'PERMIS MUNICIPAUX' as category,
    u.raw_user_meta_data->>'full_name' as responsable,
    u.email,
    COUNT(mp.id) as nb_permis,
    SUM(mp.fee_amount) as total_fees
FROM auth.users u
LEFT JOIN municipal_permits mp ON u.id = mp.municipality_id
WHERE u.raw_user_meta_data->>'role' = 'mairie'
GROUP BY u.id, u.email, u.raw_user_meta_data->>'full_name';

-- Investissements par investisseur
SELECT 
    'OPPORTUNITÉS D''INVESTISSEMENT' as category,
    u.raw_user_meta_data->>'full_name' as investisseur,
    u.email,
    COUNT(io.id) as nb_opportunites,
    SUM(io.investment_amount) as total_investissement,
    AVG(io.expected_roi) as roi_moyen
FROM auth.users u
LEFT JOIN investment_opportunities io ON u.id = io.investor_id
WHERE u.raw_user_meta_data->>'role' = 'investisseur'
GROUP BY u.id, u.email, u.raw_user_meta_data->>'full_name';

-- Rapports de géomètre par expert
SELECT 
    'RAPPORTS DE GÉOMÈTRE' as category,
    u.raw_user_meta_data->>'full_name' as geometre,
    u.email,
    COUNT(sr.id) as nb_rapports,
    SUM(sr.fee_amount) as total_honoraires,
    SUM(sr.surface_measured) as total_surface_mesuree
FROM auth.users u
LEFT JOIN surveying_reports sr ON u.id = sr.surveyor_id
WHERE u.raw_user_meta_data->>'role' = 'geometre'
GROUP BY u.id, u.email, u.raw_user_meta_data->>'full_name';

-- Résumé général
SELECT 
    'RÉSUMÉ NOUVELLES TABLES' as category,
    'Total Permis Municipaux: ' || COUNT(*) as information
FROM municipal_permits
UNION ALL
SELECT 
    '',
    'Total Opportunités Investissement: ' || COUNT(*) as information
FROM investment_opportunities
UNION ALL
SELECT 
    '',
    'Total Rapports Géomètre: ' || COUNT(*) as information
FROM surveying_reports;

SELECT '✨ === DONNÉES DE TEST COMPLÈTES POUR TOUS LES RÔLES ===' as final_status;