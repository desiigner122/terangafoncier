-- ============================================
-- VÉRIFIER LES PARCELLES EXISTANTES
-- ============================================

-- 1. Compter toutes les parcelles
SELECT COUNT(*) as total_parcelles FROM parcels;

-- 2. Voir les 10 premières parcelles avec leurs vendeurs
SELECT 
  p.id,
  p.title,
  p.price,
  p.surface,
  p.seller_id,
  p.status,
  prof.email as vendeur_email,
  prof.first_name,
  prof.last_name
FROM parcels p
LEFT JOIN profiles prof ON prof.id = p.seller_id
ORDER BY p.created_at DESC
LIMIT 10;

-- 3. Compter les parcelles par vendeur
SELECT 
  seller_id,
  prof.email as vendeur_email,
  COUNT(*) as nb_parcelles
FROM parcels
LEFT JOIN profiles prof ON prof.id = seller_id
GROUP BY seller_id, prof.email
ORDER BY nb_parcelles DESC;

-- 4. Vérifier les demandes existantes
SELECT 
  r.id,
  r.user_id as acheteur_id,
  r.parcel_id,
  r.status,
  r.offered_price,
  p.title as parcelle_titre,
  p.seller_id as vendeur_id
FROM requests r
JOIN parcels p ON p.id = r.parcel_id
ORDER BY r.created_at DESC
LIMIT 10;
