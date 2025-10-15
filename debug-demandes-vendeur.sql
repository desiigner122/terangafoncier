-- ============================================
-- DEBUG : Pourquoi je ne vois pas les demandes d'achat ?
-- ============================================

-- REMPLACEZ 'VOTRE_USER_ID' par votre vrai user ID (celui affiché dans la console)
-- Exemple : '06125976-5ea1-403a-b09e-aebbe1311111'

-- ============================================
-- 1. VÉRIFIER VOS PARCELLES
-- ============================================
SELECT 
  id,
  title,
  name,
  price,
  seller_id,
  status,
  created_at
FROM parcels
WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'  -- ⬅️ REMPLACER PAR VOTRE ID
ORDER BY created_at DESC;

-- RÉSULTAT ATTENDU : 
-- Vous devriez voir vos parcelles
-- Si la liste est vide → Vous n'avez pas de parcelles !

-- ============================================
-- 2. VÉRIFIER LES DEMANDES (requests)
-- ============================================
SELECT 
  r.id,
  r.user_id AS acheteur_id,
  r.parcel_id,
  r.status,
  r.type,
  r.message,
  r.offered_price,
  r.created_at,
  p.title AS parcelle_titre,
  p.seller_id AS vendeur_id
FROM requests r
LEFT JOIN parcels p ON p.id = r.parcel_id
ORDER BY r.created_at DESC
LIMIT 20;

-- RÉSULTAT ATTENDU :
-- Vous devriez voir les demandes existantes
-- Vérifier que seller_id correspond à votre user_id

-- ============================================
-- 3. TROUVER LES DEMANDES POUR VOUS (vendeur)
-- ============================================
SELECT 
  r.id,
  r.user_id AS acheteur_id,
  r.parcel_id,
  r.status,
  r.type,
  r.offered_price,
  r.created_at,
  p.title AS parcelle_titre,
  buyer.email AS acheteur_email
FROM requests r
JOIN parcels p ON p.id = r.parcel_id
LEFT JOIN profiles buyer ON buyer.id = r.user_id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'  -- ⬅️ REMPLACER PAR VOTRE ID
ORDER BY r.created_at DESC;

-- RÉSULTAT ATTENDU :
-- ✅ Si vous voyez des lignes → Vous avez des demandes !
-- ❌ Si vide → Vous n'avez pas de demandes

-- ============================================
-- 4. VÉRIFIER LA TABLE purchase_requests (alternative)
-- ============================================
-- Peut-être que les demandes sont dans purchase_requests ?
SELECT 
  pr.id,
  pr.buyer_id,  -- ✅ Corrigé: user_id → buyer_id
  pr.property_id,
  pr.status,
  pr.offer_price,  -- ✅ Corrigé: offered_price → offer_price
  pr.created_at,
  prop.title AS property_titre,
  prop.owner_id
FROM purchase_requests pr
LEFT JOIN properties prop ON prop.id = pr.property_id
WHERE prop.owner_id = '06125976-5ea1-403a-b09e-aebbe1311111'  -- ⬅️ REMPLACER PAR VOTRE ID
ORDER BY pr.created_at DESC;

-- ============================================
-- 5. CRÉER UNE DEMANDE DE TEST (si aucune demande)
-- ============================================
-- ⚠️ EXÉCUTER SEULEMENT SI VOUS N'AVEZ PAS DE DEMANDES

-- D'abord, trouver un de vos parcel_id
-- Utilisez un ID de la query #1

-- Ensuite, créer une demande test :
/*
INSERT INTO requests (
  id,
  user_id,
  parcel_id,
  type,
  status,
  message,
  offered_price,
  created_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001',  -- ID acheteur fictif
  'VOTRE_PARCEL_ID_ICI',  -- ⬅️ Remplacer par un de vos parcel_id
  'purchase',
  'pending',
  'Je suis intéressé par cette parcelle',
  50000000,  -- 50 millions FCFA
  NOW()
);
*/

-- ============================================
-- 6. VÉRIFIER QUELLE PAGE EST CHARGÉE
-- ============================================
-- Ouvrir la console navigateur (F12) et taper :
-- window.location.pathname
-- Vous devriez voir : /vendeur/dashboard/purchase-requests

-- ============================================
-- DIAGNOSTIC RAPIDE
-- ============================================
SELECT 
  'Mes parcelles' AS test,
  COUNT(*) AS nombre
FROM parcels
WHERE seller_id = '06125976-5ea1-403a-b09e-aebbe1311111'  -- ⬅️ REMPLACER

UNION ALL

SELECT 
  'Demandes sur mes parcelles',
  COUNT(*)
FROM requests r
JOIN parcels p ON p.id = r.parcel_id
WHERE p.seller_id = '06125976-5ea1-403a-b09e-aebbe1311111';  -- ⬅️ REMPLACER

-- RÉSULTAT ATTENDU :
-- Mes parcelles              | 3
-- Demandes sur mes parcelles | 5
-- 
-- Si "Mes parcelles" = 0 → Créer des parcelles d'abord !
-- Si "Demandes..." = 0 → Créer une demande test
