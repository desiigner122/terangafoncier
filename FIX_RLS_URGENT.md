# 🚨 FIX URGENT: Erreur RLS Purchase Cases

## Problème
```
new row violates row-level security policy for table "purchase_cases"
```

## Cause
Les policies RLS de `purchase_cases` sont trop restrictives et bloquent la création de dossiers par les vendeurs.

## Solution Rapide (2 minutes)

### 1. Ouvrir Supabase SQL Editor
- https://app.supabase.com
- Sélectionner projet "terangafoncier"
- SQL Editor → + New Query

### 2. Copier-Coller ce Fix
```sql
-- Supprimer les policies restrictives
DROP POLICY IF EXISTS "Authenticated users can create cases" ON purchase_cases;
DROP POLICY IF EXISTS "Parties can update their cases" ON purchase_cases;
DROP POLICY IF EXISTS "Users can view their cases" ON purchase_cases;

-- Recréer avec permissions correctes
CREATE POLICY "purchase_cases_select_policy"
  ON purchase_cases FOR SELECT
  USING (
    buyer_id = auth.uid()
    OR seller_id = auth.uid()
    OR notaire_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "purchase_cases_insert_policy"
  ON purchase_cases FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      buyer_id = auth.uid()
      OR seller_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role IN ('notaire', 'Notaire', 'admin')
      )
    )
  );

CREATE POLICY "purchase_cases_update_policy"
  ON purchase_cases FOR UPDATE
  USING (
    buyer_id = auth.uid()
    OR seller_id = auth.uid()
    OR notaire_id = auth.uid()
    OR updated_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
```

### 3. Cliquer "Run" (Ctrl+Enter)

### 4. Vérifier
```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'purchase_cases';
```

Devrait retourner 3 policies (select, insert, update).

## Test
1. Retourner dans l'app (http://localhost:5173)
2. Se connecter comme vendeur
3. Aller dans "Demandes d'Achat"
4. Accepter une demande
5. ✅ Devrait créer le dossier sans erreur

---

**Note** : Le fichier complet est dans `migrations/fix_purchase_cases_rls.sql`
