-- 🧪 CRÉER DES TRANSACTIONS DE TEST POUR VÉRIFIER L'AFFICHAGE

-- Transaction 1: Paiement comptant
INSERT INTO transactions (
  buyer_id,
  seller_id,
  parcel_id,
  amount,
  payment_method,
  status,
  buyer_info,
  transaction_type,
  created_at
) VALUES (
  '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2', -- family.diallo
  '06125976-5ea1-403a-b09e-aebbe1311111', -- heritage.fall
  '9a2dce41-8e2c-4888-b3d8-0dce41339b5a', -- terrain test
  50000000,
  'one-time',
  'pending',
  '{"full_name": "Diallo Family", "email": "family.diallo@teranga-foncier.sn", "phone": "+221 77 123 45 67"}'::jsonb,
  'purchase',
  NOW()
);

-- Transaction 2: Paiement échelonné
INSERT INTO transactions (
  buyer_id,
  seller_id,
  parcel_id,
  amount,
  payment_method,
  status,
  buyer_info,
  transaction_type,
  created_at
) VALUES (
  '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2',
  '06125976-5ea1-403a-b09e-aebbe1311111',
  '9a2dce41-8e2c-4888-b3d8-0dce41339b5a',
  50000000,
  'installments',
  'pending',
  '{"full_name": "Diallo Family", "email": "family.diallo@teranga-foncier.sn", "phone": "+221 77 123 45 67"}'::jsonb,
  'purchase',
  NOW()
);

-- Transaction 3: Financement bancaire
INSERT INTO transactions (
  buyer_id,
  seller_id,
  parcel_id,
  amount,
  payment_method,
  status,
  buyer_info,
  transaction_type,
  created_at
) VALUES (
  '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2',
  '06125976-5ea1-403a-b09e-aebbe1311111',
  '9a2dce41-8e2c-4888-b3d8-0dce41339b5a',
  50000000,
  'bank-financing',
  'pending',
  '{"full_name": "Diallo Family", "email": "family.diallo@teranga-foncier.sn", "phone": "+221 77 123 45 67"}'::jsonb,
  'purchase',
  NOW()
);

-- Vérifier les insertions
SELECT 
  '✅ TRANSACTIONS DE TEST CRÉÉES' as info,
  t.id,
  t.payment_method as methode_paiement,
  t.amount,
  t.status,
  t.created_at,
  buyer.email as acheteur,
  seller.email as vendeur,
  p.title as terrain
FROM transactions t
LEFT JOIN profiles buyer ON buyer.id = t.buyer_id
LEFT JOIN profiles seller ON seller.id = t.seller_id
LEFT JOIN parcels p ON p.id = t.parcel_id
WHERE t.created_at > NOW() - INTERVAL '1 minute'
ORDER BY t.created_at DESC;
