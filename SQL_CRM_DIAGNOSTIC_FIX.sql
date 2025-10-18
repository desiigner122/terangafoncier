-- ================================================
-- DIAGNOSTIC & FIX - CRM CONTACTS TABLE
-- Exécuter dans Supabase SQL Editor
-- ================================================

-- ✅ ÉTAPE 1: DIAGNOSTIQUER LA STRUCTURE RÉELLE
-- Exécutez ceci d'abord pour voir ce qui existe vraiment

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'crm_contacts'
ORDER BY ordinal_position;

-- ✅ ÉTAPE 2: COMPTER LES LIGNES
SELECT COUNT(*) as total_contacts FROM crm_contacts;

-- ✅ ÉTAPE 3: VOIR UN EXEMPLE DE LIGNE (si données existent)
SELECT * FROM crm_contacts LIMIT 1;

-- ✅ ÉTAPE 4: LISTER TOUS LES COLONNES UUID (FK potentiels)
SELECT 
  column_name, 
  data_type,
  constraint_name,
  constraint_type
FROM information_schema.columns col
LEFT JOIN information_schema.table_constraints tc 
  ON col.table_name = tc.table_name 
  AND col.table_schema = tc.table_schema
WHERE col.table_schema = 'public' 
AND col.table_name = 'crm_contacts'
AND col.data_type = 'uuid';

-- ================================================
-- FIX (si nécessaire)
-- ================================================

-- 🔧 Si colonne user_id n'existe pas, l'ajouter:
-- ATTENTION: Décommentez seulement si vous êtes sûr!
/*
ALTER TABLE crm_contacts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_crm_contacts_user_id ON crm_contacts(user_id);
*/

-- 🔧 Si la colonne s'appelle owner_id au lieu de user_id:
-- ATTENTION: Décommentez seulement si nécessaire!
/*
-- Renommer la colonne (Si elle existe avec mauvais nom):
-- ALTER TABLE crm_contacts RENAME COLUMN owner_id TO user_id;
*/

-- ================================================
-- VALIDATION FINALE
-- ================================================

-- ✅ Vérifier que tout est OK maintenant:
SELECT 
  'crm_contacts' as table_name,
  COUNT(*) as total_rows,
  EXISTS(
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'crm_contacts' 
    AND column_name = 'user_id'
  ) as has_user_id,
  EXISTS(
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'crm_contacts' 
    AND column_name = 'owner_id'
  ) as has_owner_id,
  EXISTS(
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'crm_contacts' 
    AND column_name = 'vendor_id'
  ) as has_vendor_id
FROM crm_contacts;

-- ================================================
-- RESULTATS ATTENDUS
-- ================================================
/*
Résultats possibles:

1. ✅ IDÉAL - La table a user_id:
   - has_user_id = true
   - has_owner_id = false  
   - has_vendor_id = false
   → Code React actuel fonctionnera!

2. ❌ PROBLÈME - La table n'a rien:
   - has_user_id = false
   - has_owner_id = false
   - has_vendor_id = false
   → Exécutez les ALTER TABLE commentés ci-dessus

3. ❌ PROBLÈME - La table a owner_id au lieu de user_id:
   - has_user_id = false
   - has_owner_id = true
   - has_vendor_id = false
   → Renommez la colonne (ALTER RENAME)
   → Ou modifiez le code React

4. ❌ PROBLÈME - La table a vendor_id:
   - has_user_id = false
   - has_owner_id = false
   - has_vendor_id = true
   → Renommez la colonne ou modifiez le code React
*/

-- ================================================
-- SCRIPTS CORRECTIVES (DÉCOMMENTEZ SI NÉCESSAIRE)
-- ================================================

-- ✅ OPTION A: Ajouter colonne user_id si manquante
-- ALTER TABLE crm_contacts 
-- ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
-- CREATE INDEX idx_crm_contacts_user_id ON crm_contacts(user_id);

-- ✅ OPTION B: Renommer owner_id → user_id
-- ALTER TABLE crm_contacts RENAME COLUMN owner_id TO user_id;

-- ✅ OPTION C: Renommer vendor_id → user_id
-- ALTER TABLE crm_contacts RENAME COLUMN vendor_id TO user_id;

-- ✅ OPTION D: Ajouter policy RLS si manquante
-- ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY crm_contacts_user_policy ON crm_contacts
--   USING (user_id = auth.uid());

-- ================================================
-- DOCUMENTATION
-- ================================================
/*
Instructions:
1. Copier ce fichier
2. Aller à: https://app.supabase.com → SQL Editor
3. Les 4 premières requêtes SELECT: EXÉCUTEZ POUR DIAGNOSTIQUER
4. Notez les résultats
5. Basé sur les résultats, décommentez la correction appropriée
6. Exécutez la correction
7. Re-exécutez les diagnostics pour vérifier

Les scripts ARE SAFE:
- Les CREATE INDEX utilisent IF NOT EXISTS
- Les ALTER TABLE utilisent IF NOT EXISTS
- Les RENAME sont non-destructifs
*/
