-- Vérifier la structure exacte de la table purchase_cases
-- Pour voir quels champs de prix existent

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'purchase_cases'
  AND column_name LIKE '%price%'
     OR column_name LIKE '%amount%'
     OR column_name LIKE '%fee%'
     OR column_name LIKE '%cost%'
     OR column_name LIKE '%value%'
ORDER BY column_name;

-- Voir aussi toutes les colonnes de purchase_cases
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_cases'
ORDER BY ordinal_position;

-- Voir un exemple de données réelles
SELECT 
  id,
  case_number,
  status,
  buyer_id,
  seller_id,
  parcelle_id,
  created_at
FROM purchase_cases
WHERE id IN (
  'ded322f2-ca48-4acd-9af2-35297732ca0f',
  '2988b1e6-f421-4d27-a60b-4eca0d7a7fbf'
);
