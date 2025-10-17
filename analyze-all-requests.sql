-- 🔍 CHERCHER TOUTES LES VRAIES DEMANDES (PAS DE TEST)
-- Exécuter dans Supabase SQL Editor

-- ========================================
-- 1. TOUTES LES DEMANDES PAR VENDEUR
-- ========================================
SELECT 
  '📊 DEMANDES PAR VENDEUR' as info,
  seller.email as vendeur,
  COUNT(DISTINCT r.id) as total_demandes,
  COUNT(DISTINCT r.parcel_id) as parcelles_concernees,
  MIN(r.created_at) as premiere_demande,
  MAX(r.created_at) as derniere_demande
FROM requests r
LEFT JOIN parcels p ON p.id = r.parcel_id
LEFT JOIN profiles seller ON seller.id = p.seller_id
GROUP BY seller.email
ORDER BY total_demandes DESC;

-- ========================================
-- 2. TOUTES LES DEMANDES PAR ACHETEUR
-- ========================================
SELECT 
  '👥 DEMANDES PAR ACHETEUR' as info,
  buyer.email as acheteur,
  COUNT(DISTINCT r.id) as total_demandes,
  COUNT(DISTINCT r.parcel_id) as parcelles_visees,
  MIN(r.created_at) as premiere_demande,
  MAX(r.created_at) as derniere_demande
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
GROUP BY buyer.email
ORDER BY total_demandes DESC;

-- ========================================
-- 3. DEMANDES ANCIENNES (> 7 jours)
-- ========================================
SELECT 
  '🕰️ DEMANDES ANCIENNES (> 7 JOURS)' as info,
  r.id,
  r.parcel_id,
  p.title as parcelle,
  seller.email as vendeur,
  buyer.email as acheteur,
  r.offered_price,
  r.status,
  r.created_at,
  EXTRACT(DAY FROM NOW() - r.created_at) as jours_anciennete
FROM requests r
LEFT JOIN parcels p ON p.id = r.parcel_id
LEFT JOIN profiles seller ON seller.id = p.seller_id
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.created_at < NOW() - INTERVAL '7 days'
ORDER BY r.created_at DESC
LIMIT 20;

-- ========================================
-- 4. NOMBRE TOTAL DE DEMANDES PAR DATE
-- ========================================
SELECT 
  '📅 DEMANDES PAR DATE' as info,
  DATE(created_at) as date,
  COUNT(*) as nombre_demandes,
  COUNT(DISTINCT user_id) as acheteurs_uniques,
  COUNT(DISTINCT parcel_id) as parcelles_uniques
FROM requests
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;

-- ========================================
-- 5. Y A-T-IL D'AUTRES TABLES AVEC DES DEMANDES?
-- ========================================
SELECT 
  '📋 TABLES POTENTIELLES' as info,
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as colonnes
FROM information_schema.tables
WHERE table_schema = 'public'
  AND (
    table_name LIKE '%request%'
    OR table_name LIKE '%order%'
    OR table_name LIKE '%offer%'
    OR table_name LIKE '%proposal%'
    OR table_name LIKE '%bid%'
  )
ORDER BY table_name;

-- ========================================
-- 6. NOMBRE TOTAL D'UTILISATEURS ET PARCELLES
-- ========================================
-- D'abord vérifier les colonnes de profiles
SELECT 
  '� PROFILES STRUCTURE' as info,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name LIKE '%type%'
ORDER BY ordinal_position;

-- Statistiques globales (sans filtrer par type d'utilisateur)
SELECT 
  '�📈 STATISTIQUES GLOBALES' as info,
  (SELECT COUNT(*) FROM profiles) as total_utilisateurs,
  (SELECT COUNT(*) FROM profiles WHERE role = 'vendeur') as total_vendeurs_role,
  (SELECT COUNT(*) FROM parcels) as total_parcelles,
  (SELECT COUNT(*) FROM requests) as total_demandes,
  (SELECT COUNT(DISTINCT user_id) FROM requests) as acheteurs_actifs,
  (SELECT COUNT(DISTINCT parcel_id) FROM requests) as parcelles_avec_demandes;
