/**
 * GUIDE D'EXÉCUTION: Migrations Supabase pour Synchronisation Acheteur/Vendeur
 * 
 * ⚠️ CRITIQUE: Deux scripts doivent être exécutés dans Supabase SQL Editor
 * Rôle requis: service_role (pas authenticated)
 */

# ÉTAPE 1: Ajouter la colonne seller_status

**URL**: https://app.supabase.com → Projet → SQL Editor → New Query

**Rôle**: service_role (dropdown en haut à droite)

**Script**: Copie/colle tout ceci:

```sql
-- =============================================================
-- Add seller_status column to purchase_cases table
-- This column tracks the seller's decision on purchase requests
-- =============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'purchase_cases' AND column_name = 'seller_status'
    ) THEN
        ALTER TABLE public.purchase_cases
        ADD COLUMN seller_status TEXT DEFAULT 'pending';
        
        ALTER TABLE public.purchase_cases
        ADD CONSTRAINT purchase_cases_seller_status_check
        CHECK (seller_status IN ('pending', 'accepted', 'declined'));
        
        CREATE INDEX purchase_cases_seller_status_idx
        ON public.purchase_cases (seller_status);
        
        RAISE NOTICE 'seller_status column added successfully';
    ELSE
        RAISE NOTICE 'seller_status column already exists';
    END IF;
END$$;
```

**Résultat attendu**: "Query executed successfully" ✓

---

# ÉTAPE 2: Créer tables manquantes et FK

**URL**: https://app.supabase.com → Projet → SQL Editor → New Query

**Rôle**: service_role

**Script**: Copie/colle du fichier CREATE_MISSING_ADMIN_TABLES.sql

(~200 lignes, voir fichier complet)

**Résultat attendu**: "Query executed successfully" ✓

---

# ÉTAPE 3: Vérifier la synchronisation

Après exécution, teste dans le navigateur:

## Test 1: Page Vendeur chargée
```
URL: http://localhost:5173/vendeur/cases/CASE_NUMBER
Résultat attendu:
- ✓ Page charge sans erreur
- ✓ seller_status affichée (En attente / Accepté / Refusé)
- ✓ Boutons Accept/Decline fonctionnent
```

## Test 2: Real-time sync
```
1. Ouvre acheteur + vendeur en split screen
2. Vendeur clique "Accepter"
3. Acheteur doit voir "Vendeur : accepté" dans les 2 sec
```

## Test 3: Messages/Documents
```
1. Vendeur envoie un message
2. Acheteur reçoit en temps réel
3. Aucune erreur 404/400
```

---

# ROLLBACK (au cas où)

Si quelque chose ne marche pas:

```sql
-- Rollback seller_status
ALTER TABLE public.purchase_cases 
DROP CONSTRAINT IF EXISTS purchase_cases_seller_status_check;
DROP INDEX IF EXISTS purchase_cases_seller_status_idx;
ALTER TABLE public.purchase_cases 
DROP COLUMN IF EXISTS seller_status;

-- Rollback tables
DROP TABLE IF EXISTS public.messages_administratifs CASCADE;
DROP TABLE IF EXISTS public.purchase_case_participants CASCADE;
DROP VIEW IF EXISTS public.case_participants CASCADE;
```

---

# MONITORING

Après les migrations, check dans Supabase:

1. **Database** → Tables
   - ✓ purchase_cases (voir colonne seller_status)
   - ✓ messages_administratifs (nouvelle)
   - ✓ purchase_case_participants (vérifier FK)

2. **Database** → Indexes
   - ✓ purchase_cases_seller_status_idx
   - ✓ messages_administratifs_destinataire_idx
   - ✓ purchase_case_participants_case_idx

3. **Auth** → Policies
   - ✓ RLS activé sur messages_administratifs
   - ✓ RLS activé sur purchase_case_participants

---

# TIMELINE

- 2 min: Exécuter script 1 (seller_status)
- 3 min: Exécuter script 2 (tables + FK)
- 1 min: Vérifier console Supabase pour erreurs
- 5 min: Tester dans navigateur
- 1 min: Check real-time sync
= **~12 min total**

---

# FICHIERS DE RÉFÉRENCE

- Script 1: `ADD_SELLER_STATUS_COLUMN.sql`
- Script 2: `CREATE_MISSING_ADMIN_TABLES.sql`
- Audit: `AUDIT_SYNC_ACHETEUR_VENDEUR.md`

Besoin d'aide? Check la todo list et AUDIT_SYNC document.
