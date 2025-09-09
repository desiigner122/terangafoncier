-- 🔗 ASSIGNATION DONNÉES DÉMO - TERANGA FONCIER
-- ===============================================
-- À exécuter APRÈS la création des comptes utilisateurs via l'interface web

-- 🎯 ASSIGNATION DES PROPRIÉTÉS AU VENDEUR
UPDATE public.properties 
SET owner_id = (
  SELECT id FROM public.profiles 
  WHERE email = 'vendeur@terangafoncier.com' 
  LIMIT 1
)
WHERE owner_id IS NULL;

-- 🏗️ ASSIGNATION DES PROJETS AU PROMOTEUR  
UPDATE public.projects
SET promoter_id = (
  SELECT id FROM public.profiles 
  WHERE email = 'promoteur@terangafoncier.com'
  LIMIT 1  
)
WHERE promoter_id IS NULL;

-- 📋 CRÉATION DES DEMANDES DÉMO
INSERT INTO public.requests (
  type, status, title, description, user_id, property_id
) VALUES
(
  'visit',
  'pending',
  'Demande de visite - Villa Almadies',
  'Bonjour, je souhaiterais visiter cette magnifique villa ce weekend. Pouvez-vous me proposer un créneau ? Merci.',
  (SELECT id FROM public.profiles WHERE email = 'particulier@terangafoncier.com' LIMIT 1),
  (SELECT id FROM public.properties WHERE title LIKE '%Villa moderne%' LIMIT 1)
),
(
  'municipal_land',
  'pending', 
  'Demande terrain municipal - Zone industrielle',
  'Demande d''attribution de terrain municipal pour projet industriel textile. Surface souhaitée: 2000m².',
  (SELECT id FROM public.profiles WHERE email = 'investisseur@terangafoncier.com' LIMIT 1),
  NULL
),
(
  'info',
  'pending',
  'Demande de financement - Appartement Plateau',
  'Dossier de financement pour acquisition appartement 85M FCFA. Apport personnel: 25M FCFA.',
  (SELECT id FROM public.profiles WHERE email = 'particulier@terangafoncier.com' LIMIT 1),
  (SELECT id FROM public.properties WHERE title LIKE '%Appartement%Plateau%' LIMIT 1)
);

-- 📨 CRÉATION DES MESSAGES DÉMO
INSERT INTO public.messages (
  sender_id, recipient_id, subject, content
) VALUES
(
  (SELECT id FROM public.profiles WHERE email = 'particulier@terangafoncier.com' LIMIT 1),
  (SELECT id FROM public.profiles WHERE email = 'vendeur@terangafoncier.com' LIMIT 1),
  'Question sur la villa Almadies',
  'Bonjour Monsieur Fall, j''aimerais avoir plus d''informations sur les charges de copropriété de la villa et la disponibilité pour une visite cette semaine. Cordialement, Fatou NDIAYE'
),
(
  (SELECT id FROM public.profiles WHERE email = 'municipalite@terangafoncier.com' LIMIT 1),
  (SELECT id FROM public.profiles WHERE email = 'investisseur@terangafoncier.com' LIMIT 1),
  'Réponse à votre demande de terrain',
  'Monsieur SARR, votre demande de terrain industriel a été reçue et est en cours d''instruction. Merci de fournir les documents complémentaires demandés. Services Fonciers - Commune de Dakar'
),
(
  (SELECT id FROM public.profiles WHERE email = 'banque@terangafoncier.com' LIMIT 1),
  (SELECT id FROM public.profiles WHERE email = 'particulier@terangafoncier.com' LIMIT 1),
  'Offre de financement immobilier',
  'Madame NDIAYE, suite à votre demande, nous vous proposons un financement à 6.5% sur 20 ans pour votre projet d''acquisition. Banque de l''Habitat du Sénégal'
);

-- 🏠 AJOUT DE FAVORIS DÉMO
INSERT INTO public.favorites (user_id, property_id) VALUES
(
  (SELECT id FROM public.profiles WHERE email = 'particulier@terangafoncier.com' LIMIT 1),
  (SELECT id FROM public.properties WHERE title LIKE '%Villa moderne%' LIMIT 1)
),
(
  (SELECT id FROM public.profiles WHERE email = 'investisseur@terangafoncier.com' LIMIT 1),
  (SELECT id FROM public.properties WHERE title LIKE '%Local commercial%' LIMIT 1)
),
(
  (SELECT id FROM public.profiles WHERE email = 'particulier@terangafoncier.com' LIMIT 1),
  (SELECT id FROM public.properties WHERE title LIKE '%Appartement%Plateau%' LIMIT 1)
);

-- 📊 MISE À JOUR DES COMPTEURS
UPDATE public.properties 
SET 
  views_count = floor(random() * 50 + 10),
  favorites_count = (SELECT COUNT(*) FROM public.favorites WHERE property_id = properties.id)
WHERE id IN (
  SELECT id FROM public.properties LIMIT 5
);

-- ✅ VALIDATION ASSIGNATION
DO $$
DECLARE
    assigned_properties integer;
    assigned_projects integer;
    demo_requests integer;
    demo_messages integer;
    demo_favorites integer;
BEGIN
    SELECT COUNT(*) INTO assigned_properties FROM public.properties WHERE owner_id IS NOT NULL;
    SELECT COUNT(*) INTO assigned_projects FROM public.projects WHERE promoter_id IS NOT NULL;
    SELECT COUNT(*) INTO demo_requests FROM public.requests;
    SELECT COUNT(*) INTO demo_messages FROM public.messages;
    SELECT COUNT(*) INTO demo_favorites FROM public.favorites;
    
    RAISE NOTICE '🎉 Assignation terminée avec succès !';
    RAISE NOTICE '🏠 Propriétés assignées: %', assigned_properties;
    RAISE NOTICE '🏗️ Projets assignés: %', assigned_projects;
    RAISE NOTICE '📋 Demandes créées: %', demo_requests;
    RAISE NOTICE '📨 Messages créés: %', demo_messages;
    RAISE NOTICE '❤️ Favoris créés: %', demo_favorites;
    RAISE NOTICE '';
    RAISE NOTICE '✅ ENVIRONNEMENT DÉMO PRÊT !';
    RAISE NOTICE '🔗 Testez sur: https://terangafoncier.vercel.app';
END $$;
