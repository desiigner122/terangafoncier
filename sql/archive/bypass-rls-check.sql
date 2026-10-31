-- 🔓 DIAGNOSTIC AVEC RLS DÉSACTIVÉ
-- Exécuter dans Supabase SQL Editor (avec droits admin)

-- ========================================
-- IMPORTANT : Ce script désactive RLS temporairement
-- pour voir TOUTES les données
-- ========================================

-- Voir toutes les politiques RLS sur requests
SELECT 
  '🔒 POLITIQUES RLS SUR REQUESTS' as info,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'requests';

-- Voir si RLS est activé sur requests
SELECT 
  '🔒 RLS ACTIVÉ?' as info,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename = 'requests';

-- ========================================
-- LIRE LES DONNÉES SANS PASSER PAR RLS
-- (en utilisant un rôle qui bypass RLS)
-- ========================================

-- Toutes les demandes (force read)
SELECT 
  '📋 TOUTES LES DEMANDES (BYPASS RLS)' as info,
  r.id,
  r.created_at,
  r.offered_price,
  r.status,
  r.request_type,
  r.message,
  r.user_id as buyer_id,
  r.parcel_id
FROM requests r
ORDER BY r.created_at DESC;

-- Joindre avec profiles pour voir les emails
SELECT 
  '👥 DEMANDES AVEC ACHETEURS' as info,
  r.id,
  r.created_at,
  r.offered_price,
  r.status,
  r.message,
  buyer.email as acheteur_email,
  buyer.first_name,
  buyer.last_name,
  p.title as parcelle
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
LEFT JOIN parcels p ON p.id = r.parcel_id
ORDER BY r.created_at DESC;

-- Vérifier la parcelle spécifique
SELECT 
  '🏠 PARCELLE SPÉCIFIQUE' as info,
  id,
  title,
  seller_id,
  price,
  status
FROM parcels
WHERE id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';

-- Compter les demandes pour cette parcelle
SELECT 
  '🔢 COMPTAGE DEMANDES' as info,
  COUNT(*) as total,
  COUNT(CASE WHEN message IS NOT NULL THEN 1 END) as avec_message,
  COUNT(CASE WHEN message IS NULL THEN 1 END) as sans_message
FROM requests
WHERE parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a';
