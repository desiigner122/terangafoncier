-- 🔍 IDENTIFIER LA VRAIE DEMANDE DE L'ACHETEUR
-- Exécuter dans Supabase SQL Editor

-- ========================================
-- 1. TOUTES LES 6 DEMANDES AVEC DÉTAILS COMPLETS
-- ========================================
SELECT 
  '📋 LES 6 DEMANDES EXISTANTES' as info,
  r.id,
  r.created_at,
  r.offered_price,
  r.status,
  r.request_type,
  r.message,
  buyer.email as acheteur_email,
  buyer.first_name as acheteur_prenom,
  buyer.last_name as acheteur_nom,
  -- Vérifier si créée depuis le front-end (a un message?) ou depuis SQL (pas de message?)
  CASE 
    WHEN r.message IS NOT NULL AND r.message != '' THEN '✅ VRAIE (avec message)'
    WHEN r.message IS NULL OR r.message = '' THEN '⚠️ TEST SQL (sans message)'
    ELSE '❓ INCONNU'
  END as origine,
  -- Vérifier l'heure de création (les vraies demandes sont faites pendant les heures de bureau)
  EXTRACT(HOUR FROM r.created_at) as heure_creation,
  CASE 
    WHEN EXTRACT(HOUR FROM r.created_at) BETWEEN 8 AND 18 THEN '✅ Heures bureau'
    ELSE '⚠️ Hors heures bureau'
  END as periode
FROM requests r
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE r.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
ORDER BY r.created_at DESC;

-- ========================================
-- 2. VÉRIFIER S'IL Y A DES CONVERSATIONS LIÉES
-- ========================================
SELECT 
  '💬 CONVERSATIONS POUR CES DEMANDES' as info,
  c.id as conversation_id,
  c.property_id,
  c.created_at,
  buyer.email as acheteur,
  c.status,
  (SELECT COUNT(*) FROM messages WHERE thread_id = c.id) as nombre_messages
FROM conversations c
LEFT JOIN profiles buyer ON buyer.id = c.buyer_id
WHERE c.vendor_id = '06125976-5ea1-403a-b09e-aebbe1311111'
ORDER BY c.created_at DESC;

-- ========================================
-- 3. VÉRIFIER LES TRANSACTIONS LIÉES
-- ========================================
SELECT 
  '💰 TRANSACTIONS POUR CES DEMANDES' as info,
  t.id,
  t.request_id,
  t.amount,
  t.status,
  t.created_at,
  r.offered_price as demande_montant
FROM transactions t
LEFT JOIN requests r ON r.id = t.request_id
WHERE t.request_id IN (
  SELECT id FROM requests WHERE parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
)
ORDER BY t.created_at DESC;

-- ========================================
-- 4. STRUCTURE DE LA TABLE REQUESTS (vérifier colonnes)
-- ========================================
SELECT 
  '🔧 COLONNES TABLE REQUESTS' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'requests'
ORDER BY ordinal_position;

-- ========================================
-- 5. VÉRIFIER SI L'ACHETEUR A UN PROFIL COMPLET
-- ========================================
SELECT 
  '👤 PROFIL ACHETEUR' as info,
  id,
  email,
  first_name,
  last_name,
  role,
  created_at,
  updated_at
FROM profiles
WHERE email = 'family.diallo@teranga-foncier.sn';
