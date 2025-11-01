-- Vérifier les valeurs de purchase_price pour les 2 dossiers du notaire
SELECT 
  id,
  case_number,
  status,
  purchase_price,
  notaire_fees,
  payment_method,
  created_at
FROM purchase_cases
WHERE id IN (
  'ded322f2-ca48-4acd-9af2-35297732ca0f',
  '2988b1e6-f421-4d27-a60b-4eca0d7a7fbf'
);
