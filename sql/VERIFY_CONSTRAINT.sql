-- Script pour vérifier la contrainte de statut actuelle
-- Exécuter dans Supabase SQL Editor pour voir exactement quels statuts sont autorisés

-- 1. Voir la définition complète de la contrainte
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conname = 'purchase_cases_status_check';

-- 2. Voir tous les statuts actuellement en base
SELECT DISTINCT status 
FROM purchase_cases 
ORDER BY status;

-- 3. Compter les statuts
SELECT status, COUNT(*) as count
FROM purchase_cases
GROUP BY status
ORDER BY count DESC;
