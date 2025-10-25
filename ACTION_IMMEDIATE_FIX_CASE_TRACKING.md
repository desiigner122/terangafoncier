# 🔧 ACTION IMMÉDIATE: Correction Suivi de Dossier (Case Tracking)

**Date**: 25 October 2025  
**Problème**: Erreur 42703 "column does not exist" et état du dossier qui ne s'affiche pas correctement  
**Statut**: ✅ FRONTEND CORRIGÉ - ⏳ SQL À EXÉCUTER

---

## 📋 Problèmes Identifiés

### 1. **Frontend (CORRIGÉ ✅)**
La page de suivi du dossier (`ParticulierCaseTrackingModernRefonte.jsx`) avait plusieurs erreurs:

- ❌ Utilisait `appointment_date` (colonne inexistante)
- ❌ Utilisait `purchaseCase.current_status` (la colonne s'appelle `status`)
- ✅ **Corrections appliquées**:
  - `appointment_date` → `start_time` (ligne 284, 808)
  - `purchaseCase.current_status` → `purchaseCase.status` (ligne 448, 487)
  - Commit: `15c3f9bb`

### 2. **Base de Données (À CORRIGER ⏳)**
La table `calendar_appointments` a besoin de corrections:

- ❌ Colonne `appointment_date` n'existe pas
- ✅ Doit utiliser `start_time` et `end_time`
- ✅ Doit avoir `purchase_request_id` (FK vers `requests`)

---

## 🛠️ ÉTAPES À EXÉCUTER

### ÉTAPE 1: Exécuter la Migration SQL (MAINTENANT)

**URL**: https://app.supabase.com → Projet → SQL Editor → New Query

**Rôle**: `service_role` (dropdown en haut à droite)

**Script**: Copie/colle tout ce code:

```sql
-- ============================================================
-- FIX: calendar_appointments table schema corrections
-- Execute this in Supabase SQL Editor with service_role
-- ============================================================

-- 1. Ensure purchase_request_id column exists (FK to requests)
ALTER TABLE public.calendar_appointments
ADD COLUMN IF NOT EXISTS purchase_request_id UUID;

-- 2. Add FK constraint if not exists
DO $$
BEGIN
  BEGIN
    ALTER TABLE public.calendar_appointments
    ADD CONSTRAINT fk_calendar_appointments_purchase_request
    FOREIGN KEY (purchase_request_id) REFERENCES public.requests(id) ON DELETE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END;
$$;

-- 3. Ensure all required columns exist
ALTER TABLE public.calendar_appointments
ADD COLUMN IF NOT EXISTS start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS end_time TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS appointment_type VARCHAR(50) DEFAULT 'meeting',
ADD COLUMN IF NOT EXISTS location VARCHAR(500),
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'scheduled',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_calendar_appointments_purchase_request_id 
  ON public.calendar_appointments(purchase_request_id);

CREATE INDEX IF NOT EXISTS idx_calendar_appointments_start_time 
  ON public.calendar_appointments(start_time);

CREATE INDEX IF NOT EXISTS idx_calendar_appointments_status 
  ON public.calendar_appointments(status);

-- 5. Verify the structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'calendar_appointments'
ORDER BY ordinal_position;
```

**Résultat attendu**: Le script affiche les colonnes de `calendar_appointments`. Vous devriez voir:
- `start_time` (TIMESTAMPTZ)
- `end_time` (TIMESTAMPTZ)
- `title` (VARCHAR)
- `purchase_request_id` (UUID)
- `status` (VARCHAR)

---

### ÉTAPE 2: Vérifier que Supabase ne rejette plus les requêtes

Ouvrez la **Console du navigateur** (F12) et regardez les erreurs:

✅ **BON**: Aucune erreur 42703 pour `appointment_date`

❌ **MAUVAIS**: Encore des erreurs comme:
```
Fetch error: {"code":"42703","message":"column appointment_date does not exist"}
```

---

### ÉTAPE 3: Tester la page de suivi du dossier

1. Allez à: `/acheteur/mes-achats`
2. Cliquez sur **"Suivre un dossier"** (d'une demande d'achat)
3. Attendez le chargement
4. **Vérifiez**:
   - ✅ État du dossier s'affiche correctement (avec couleur et icône)
   - ✅ Progression du dossier s'affiche (barre bleue)
   - ✅ Rendez-vous s'affichent avec les bonnes dates
   - ✅ Aucune erreur 42703 dans la console

---

## 📊 Données de Référence

### Table `purchase_cases` (Structure Confirmée)

```sql
Colonnes principales:
- id (UUID) - Clé primaire
- request_id (UUID) - FK vers requests
- buyer_id (UUID) - FK vers auth.users
- seller_id (UUID) - FK vers auth.users
- parcelle_id (UUID) - FK vers parcels
- purchase_price (DECIMAL)
- status (VARCHAR) - ⭐ UTILISER status, PAS current_status
- phase (VARCHAR)
- progress_percentage (INTEGER)
- created_at (TIMESTAMPTZ)
- metadata (JSONB)
```

### Table `calendar_appointments` (Corrigée)

```sql
Colonnes principales:
- id (UUID) - Clé primaire
- purchase_request_id (UUID) - FK vers requests ⭐
- start_time (TIMESTAMPTZ) - ⭐ UTILISER start_time, PAS appointment_date
- end_time (TIMESTAMPTZ)
- title (VARCHAR)
- appointment_type (VARCHAR)
- status (VARCHAR)
- location (VARCHAR)
- created_at (TIMESTAMPTZ)
```

---

## 🐛 Debug: Si ça ne marche toujours pas

### Erreur: "column purchase_request_id does not exist"

**Cause**: La table n'a pas la colonne `purchase_request_id`

**Solution**:
```sql
-- Vérifie les colonnes actuelles
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'calendar_appointments' 
ORDER BY ordinal_position;
```

### Erreur: "invalid input syntax for type uuid"

**Cause**: Vous passez une string au lieu d'un UUID

**Vérifier**: Dans le code, `enhancedCaseData.request_id` doit être un UUID valide, pas une string vide

### Les rendez-vous ne s'affichent pas

**Vérifications**:
1. Ouvrez **Supabase Console** → SQL Editor
2. Exécutez:
```sql
-- Voir si des rendez-vous existent
SELECT id, purchase_request_id, start_time, title 
FROM calendar_appointments 
LIMIT 10;

-- Voir les demandes d'achat (requests)
SELECT id, status, created_at 
FROM requests 
LIMIT 10;
```

---

## ✅ Checklist de Vérification

- [ ] Migration SQL exécutée dans Supabase (ÉTAPE 1)
- [ ] Aucune erreur 42703 dans la console (ÉTAPE 2)
- [ ] Page de suivi du dossier charge correctement (ÉTAPE 3)
- [ ] État du dossier s'affiche (pas vide)
- [ ] Progression s'affiche correctement
- [ ] Rendez-vous s'affichent avec les bonnes dates
- [ ] Tous les logs de debug sont clairs

---

## 📝 Commandes Utiles (Terminal)

```bash
# Voir le dernier commit
git log --oneline -1

# Voir les changements
git show HEAD

# Synchroniser
git pull origin copilot/vscode1760961809107
```

---

## 🚀 Commit Associés

- **Frontend Fix**: `15c3f9bb` - Correction appointment_date et current_status
- **SQL Fix**: `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` - Migration schema

---

**Besoin d'aide?** Vérifiez:
1. Supabase SQL Editor - Les migrations ont-elles s'exécuté sans erreur?
2. Console du navigateur (F12) - Y a-t-il des erreurs 42703?
3. Network tab (F12) - Les requêtes Supabase reviennent-elles avec du 200?

