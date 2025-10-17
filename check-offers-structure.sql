-- 🔍 STRUCTURE ET CONTENU DE LA TABLE OFFERS

-- 1. Structure de la table offers
SELECT 
  '🔧 STRUCTURE TABLE OFFERS' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'offers'
ORDER BY ordinal_position;

-- 2. Tout le contenu de la table offers
SELECT 
  '📋 CONTENU TABLE OFFERS' as info,
  *
FROM offers
ORDER BY created_at DESC
LIMIT 50;

-- 3. Compter les offres
SELECT 
  '📊 NOMBRE D''OFFRES' as info,
  COUNT(*) as total_offres
FROM offers;

-- 4. Offres récentes (depuis le 14 octobre)
SELECT 
  '📅 OFFRES RÉCENTES' as info,
  o.*
FROM offers o
WHERE o.created_at >= '2025-10-14'::date
ORDER BY o.created_at DESC;
