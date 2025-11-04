# 🚨 HOTFIX URGENT - Récursion Infinie RLS Policies

## ⚠️ Problème Identifié

**Erreur**: `infinite recursion detected in policy for relation "purchase_cases"`

**Cause**: Les policies RLS créées en Phase 4 vérifient `profiles.role = 'notaire'`, ce qui crée une récursion infinie quand Supabase essaie de vérifier les permissions.

**Impact**:
- ❌ Notaires ne peuvent plus voir leurs dossiers
- ❌ Acheteurs ne peuvent plus consulter leurs dossiers  
- ❌ Vendeurs ne peuvent plus consulter leurs dossiers
- ❌ Page 404 partout
- ❌ Aucune opération sur `purchase_cases` ne fonctionne

---

## 🔧 Solution Immédiate

### Option 1: Rollback Complet (RECOMMANDÉ)

**Exécuter dans Supabase SQL Editor**:

```sql
-- Copier-coller TOUT le contenu de: ROLLBACK_phase4_policies.sql
```

Ce script:
1. Supprime TOUTES les policies problématiques
2. Restaure l'état fonctionnel précédent
3. Permet aux utilisateurs de revoir leurs dossiers immédiatement

**Temps d'exécution**: ~5 secondes  
**Risque**: Aucun (rollback sûr)

---

### Option 2: Hotfix Partiel (si rollback impossible)

**Exécuter dans Supabase SQL Editor**:

```sql
-- Supprimer uniquement les policies récursives
DROP POLICY IF EXISTS "Notaires voient leurs dossiers assignés" ON purchase_cases;
DROP POLICY IF EXISTS "Notaires peuvent mettre à jour leurs dossiers" ON purchase_cases;
```

Puis appliquer le contenu de `HOTFIX_remove_recursive_policies.sql`.

---

## 📋 Étapes d'Application

### 1. Ouvrir Supabase Dashboard
- Aller sur: https://supabase.com/dashboard
- Projet: `terangafoncier` (ndenqikcogzrkrjnlvns)

### 2. Ouvrir SQL Editor
- Menu de gauche → **SQL Editor**
- Cliquer **New Query**

### 3. Exécuter le Rollback
- Copier tout le contenu de `sql/ROLLBACK_phase4_policies.sql`
- Coller dans l'éditeur
- Cliquer **Run** (ou Ctrl+Enter)

### 4. Vérifier le Résultat
- Devrait voir: `NOTICE: Dropped policy: ...` pour chaque policy supprimée
- Vérifier la liste finale des policies (sans notaires)

### 5. Tester l'Application
- Rafraîchir le frontend (Ctrl+F5)
- Tester connexion notaire → devrait voir dossiers
- Tester connexion acheteur → devrait voir dossiers
- Tester connexion vendeur → devrait voir dossiers

---

## 🔍 Vérification Post-Hotfix

### Dans Supabase SQL Editor:

```sql
-- Vérifier qu'aucune policy récursive n'existe
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies
WHERE tablename = 'purchase_cases'
AND policyname LIKE '%otaire%';

-- Devrait retourner 0 rows
```

### Dans l'Application:

- [ ] Notaire voit liste de dossiers (pas d'erreur 42P17)
- [ ] Acheteur voit ses dossiers
- [ ] Vendeur voit ses dossiers
- [ ] Pas d'erreur console "infinite recursion"

---

## 📊 Analyse Post-Mortem

### Pourquoi ça a causé une récursion?

```sql
-- Policy problématique:
USING (
  EXISTS (
    SELECT 1 FROM profiles          -- ← Accès à profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'notaire'   -- ← Vérifie role
  )
  AND notaire_id = auth.uid()
)
```

**Le problème**: 
1. Pour vérifier `purchase_cases`, Supabase doit vérifier `profiles`
2. Pour vérifier `profiles`, Supabase doit vérifier les policies de `profiles`
3. Certaines policies de `profiles` peuvent référencer `purchase_cases`
4. → Boucle infinie!

### Solution Correcte:

```sql
-- Policy sans vérification de rôle:
USING (
  notaire_id = auth.uid()           -- ← Direct, pas de recursion
  OR
  EXISTS (
    SELECT 1 FROM notaire_case_assignments
    WHERE case_id = purchase_cases.id
    AND notaire_id = auth.uid()     -- ← Direct, pas de recursion
  )
)
```

**Principe**: Ne JAMAIS référencer une autre table qui pourrait référencer la table actuelle.

---

## 🚀 Prochaine Étape: RLS Policies v2

Une fois le hotfix appliqué et testé, nous pourrons:

1. **Créer des policies SIMPLES** sans vérification de rôle
2. **Utiliser la colonne `notaire_id` directement** (pas de JOIN)
3. **Tester chaque policy individuellement** avant de committer
4. **Ajouter des indexes** pour performance

**Nouveau fichier à créer**: `phase4_v2_simple_policies.sql`

---

## 📞 Support

Si le hotfix ne résout pas le problème:

1. Copier le message d'erreur complet
2. Vérifier les policies restantes avec la requête ci-dessus
3. Contacter pour assistance

---

**Status**: 🚨 URGENT - À appliquer immédiatement  
**Temps estimé**: 5 minutes  
**Downtime**: 0 (rollback sûr)
