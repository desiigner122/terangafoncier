-- 🎯 CHERCHER VOS VRAIES DEMANDES DANS LA TABLE TRANSACTIONS!

-- 1. Toutes les transactions pour votre terrain
SELECT 
  '💰 TRANSACTIONS POUR VOTRE TERRAIN' as info,
  t.*,
  buyer.email as acheteur_email,
  buyer.first_name as prenom_acheteur,
  buyer.last_name as nom_acheteur
FROM transactions t
LEFT JOIN profiles buyer ON buyer.id = t.user_id
WHERE t.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
ORDER BY t.created_at DESC;

-- 2. Toutes les transactions de votre acheteur
SELECT 
  '👤 TRANSACTIONS DE FAMILY.DIALLO' as info,
  t.*,
  parc.title as nom_terrain
FROM transactions t
LEFT JOIN parcels parc ON parc.id = t.parcel_id
WHERE t.user_id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'
ORDER BY t.created_at DESC;

-- 3. Toutes les transactions récentes
SELECT 
  '📅 TOUTES TRANSACTIONS RÉCENTES' as info,
  t.*,
  buyer.email as acheteur,
  seller.email as vendeur,
  parc.title as terrain
FROM transactions t
LEFT JOIN profiles buyer ON buyer.id = t.user_id
LEFT JOIN profiles seller ON seller.id = t.seller_id
LEFT JOIN parcels parc ON parc.id = t.parcel_id
WHERE t.created_at >= '2025-10-14'::date
ORDER BY t.created_at DESC;

-- 4. Compter les transactions par méthode
SELECT 
  '📊 PAR MÉTHODE DE PAIEMENT' as info,
  t.payment_method,
  COUNT(*) as nombre
FROM transactions t
WHERE t.created_at >= '2025-10-14'::date
GROUP BY t.payment_method;
