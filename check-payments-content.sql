-- 🔍 CHERCHER VOS VRAIES DEMANDES DANS PAYMENTS

-- 1. Tous les paiements pour votre terrain
SELECT 
  '🎯 PAIEMENTS POUR VOTRE TERRAIN' as info,
  p.*,
  prof.email as acheteur_email,
  prof.first_name as prenom_acheteur,
  prof.last_name as nom_acheteur
FROM payments p
LEFT JOIN profiles prof ON prof.id = p.user_id
WHERE p.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
ORDER BY p.created_at DESC;

-- 2. Tous les paiements de votre acheteur (family.diallo@teranga-foncier.sn)
SELECT 
  '👤 PAIEMENTS DE FAMILY.DIALLO' as info,
  p.*,
  parc.title as nom_terrain
FROM payments p
LEFT JOIN parcels parc ON parc.id = p.parcel_id
WHERE p.user_id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'
ORDER BY p.created_at DESC;

-- 3. Tous les paiements récents (depuis le 14 octobre)
SELECT 
  '📅 TOUS PAIEMENTS RÉCENTS' as info,
  p.*,
  prof.email as acheteur_email,
  parc.title as nom_terrain
FROM payments p
LEFT JOIN profiles prof ON prof.id = p.user_id
LEFT JOIN parcels parc ON parc.id = p.parcel_id
WHERE p.created_at >= '2025-10-14'::date
ORDER BY p.created_at DESC;

-- 4. Comptage par méthode de paiement
SELECT 
  '📊 COMPTAGE PAR MÉTHODE' as info,
  p.method as methode_paiement,
  COUNT(*) as nombre,
  SUM(p.amount) as montant_total
FROM payments p
WHERE p.created_at >= '2025-10-14'::date
GROUP BY p.method
ORDER BY nombre DESC;
