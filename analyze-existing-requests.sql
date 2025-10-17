-- 🔍 ANALYSE DÉTAILLÉE DES 6 DEMANDES EXISTANTES

-- 1. Toutes les informations de vos demandes
SELECT 
  '📋 DÉTAILS COMPLETS DES 6 DEMANDES' as info,
  r.id,
  r.created_at,
  r.request_type,
  r.status,
  r.offered_price,
  r.payment_method,
  r.installment_plan,
  r.down_payment,
  r.loan_amount,
  r.bank_details,
  r.interest_rate,
  r.loan_duration_months,
  r.monthly_payment,
  r.message,
  r.description,
  prof.email as acheteur_email,
  prof.first_name,
  prof.last_name
FROM requests r
LEFT JOIN profiles prof ON prof.id = r.user_id
WHERE r.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
ORDER BY r.created_at DESC;

-- 2. Regrouper par méthode de paiement
SELECT 
  '📊 PAR MÉTHODE DE PAIEMENT' as info,
  r.payment_method,
  COUNT(*) as nombre,
  STRING_AGG(r.id::text, ', ') as ids
FROM requests r
WHERE r.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
GROUP BY r.payment_method;

-- 3. Vérifier si les détails de paiement sont remplis
SELECT 
  '💰 DEMANDES AVEC DÉTAILS DE PAIEMENT' as info,
  r.id,
  r.payment_method,
  CASE 
    WHEN r.offered_price IS NOT NULL THEN '✅ Prix offert: ' || r.offered_price
    ELSE '❌ Pas de prix'
  END as prix_info,
  CASE 
    WHEN r.installment_plan IS NOT NULL THEN '✅ Plan échelonné présent'
    ELSE '❌ Pas de plan échelonné'
  END as echelonne_info,
  CASE 
    WHEN r.bank_details IS NOT NULL THEN '✅ Détails bancaires présents'
    ELSE '❌ Pas de détails bancaires'
  END as banque_info
FROM requests r
WHERE r.parcel_id = '9a2dce41-8e2c-4888-b3d8-0dce41339b5a'
ORDER BY r.created_at DESC;
