## ⚠️ CORRECTIONS IMMÉDIATE - ERREUR 42703 CALENDAR_APPOINTMENTS

**Date**: 25 Octobre 2025  
**Problème**: `column calendar_appointments.appointment_date does not exist`  
**État**: 🔴 BLOQUANT - Page de suivi du dossier ne charge pas

---

## 1️⃣ Problèmes Identifiés

### Problème A: Colonne manquante dans calendar_appointments
- **Erreur**: `GET https://ndenqikcogzrkrjnlvns.supabase.co/rest/v1/calendar_appointments?select=*&purchase_request_id=eq.c3e7efa2-689b-4ef4-844a-249092e26b5d&order=appointment_date.asc [HTTP/3 400]`
- **Code d'erreur**: 42703
- **Cause**: 
  - Code demande `.order('appointment_date', { ascending: true })`
  - Mais la colonne s'appelle `start_time` dans la BD
  - La colonne `appointment_date` n'existe pas

### Problème B: Colonne non visible dans purchase_cases
- **Erreur**: L'état du dossier ne s'affiche pas correctement
- **Cause**: Code utilisait `purchaseCase.current_status` mais la colonne s'appelle `status`

---

## 2️⃣ Corrections Appliquées (Frontend)

### ✅ Commit: b55557ff
```jsx
// AVANT:
.order('appointment_date', { ascending: true })
{format(new Date(apt.appointment_date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
if (!purchaseCase?.current_status) return 0;
return WorkflowStatusService.calculateProgressFromStatus(purchaseCase.current_status);
const statusInfo = getStatusInfo(purchaseCase.current_status);

// APRÈS:
.order('start_time', { ascending: true })
{format(new Date(apt.start_time), 'dd MMMM yyyy à HH:mm', { locale: fr })}
if (!purchaseCase?.status) return 0;
return WorkflowStatusService.calculateProgressFromStatus(purchaseCase.status);
const statusInfo = getStatusInfo(purchaseCase.status);
```

---

## 3️⃣ Migrations SQL Requises

### Migration 1: Corriger calendar_appointments
**Fichier**: `FIX_CALENDAR_APPOINTMENTS_SCHEMA.sql`  
**À exécuter dans**: Supabase SQL Editor  
**Rôle**: service_role

**Actions**:
1. Renommer `appointment_date` → `start_time` (si elle existe)
2. Ajouter colonne `purchase_request_id` (FK vers requests.id)
3. Ajouter colonnes manquantes: `end_time`, `title`, `description`
4. Créer les indexes nécessaires

**Script**:
```sql
-- Voir: FIX_CALENDAR_APPOINTMENTS_SCHEMA.sql
```

### Migration 2: Vérifier purchase_cases
**État**: ✅ Structure correcte
- Colonne `status` existe ✓
- Colonne `parcelle_id` existe ✓
- CHECK constraints correctes ✓

---

## 4️⃣ Étapes de Déploiement

### ÉTAPE 1: Exécuter les migrations SQL
1. Ouvrir Supabase Console
2. Aller à SQL Editor
3. Créer une nouvelle query
4. Copier le contenu de `FIX_CALENDAR_APPOINTMENTS_SCHEMA.sql`
5. Sélectionner rôle `service_role` (dropdown en haut à droite)
6. Exécuter (Ctrl+Entrée)
7. Vérifier: voir le tableau final des colonnes

### ÉTAPE 2: Vérifier que les changements frontend sont compilés
```bash
npm run dev
```
- Ouvrir la console du navigateur (F12)
- Vérifier qu'il n'y a plus d'erreurs 42703 pour `calendar_appointments`

### ÉTAPE 3: Tester la page de suivi du dossier
1. Aller à Mes Achats
2. Cliquer sur un dossier (ex: TF-20251021-0002)
3. Vérifier que:
   - L'état du dossier s'affiche ✓
   - Les rendez-vous se chargent sans erreur ✓
   - Les dates s'affichent correctement ✓

---

## 5️⃣ État Final Attendu

### Colonnes calendar_appointments (après migration)
```
Column Name             | Data Type          | Required
-----------------------+--------------------+-----------
id                      | UUID               | ✓
purchase_request_id     | UUID               | ✓
title                   | VARCHAR(255)       | 
description             | TEXT               | 
appointment_type        | VARCHAR(50)        | 
location                | VARCHAR(500)       | 
start_time              | TIMESTAMPTZ        | ✓ (KEY CHANGE)
end_time                | TIMESTAMPTZ        | 
status                  | VARCHAR(50)        | ✓
created_at              | TIMESTAMPTZ        | ✓
updated_at              | TIMESTAMPTZ        | ✓
```

### Colonnes purchase_cases (aucun changement)
```
Column Name             | Data Type          | Statut
-----------------------+--------------------+--------
id                      | UUID               | ✓
status                  | TEXT               | ✓ (utilisant, pas current_status)
parcelle_id             | UUID               | ✓
purchase_price          | DECIMAL(15,2)      | ✓
... autres colonnes     | ...                | ✓
```

---

## 6️⃣ Fichiers Modifiés

### Frontend
- **src/pages/dashboards/particulier/ParticulierCaseTrackingModernRefonte.jsx**
  - Remplacé `appointment_date` → `start_time` (2 occurrences)
  - Remplacé `purchaseCase.current_status` → `purchaseCase.status` (3 occurrences)

### Backend SQL (À appliquer)
- **FIX_CALENDAR_APPOINTMENTS_SCHEMA.sql** - Migration pour corriger la table

---

## 7️⃣ Dépannage

### Si erreur "column does not exist" persiste après migration
1. Vérifier que la migration a bien été exécutée
2. Actualiser la page (Ctrl+Shift+R ou hard refresh)
3. Vérifier les colonnes:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'calendar_appointments' 
ORDER BY ordinal_position;
```

### Si rendez-vous ne s'affichent toujours pas
1. Vérifier que `purchase_request_id` est bien populated
2. Vérifier que les permissions RLS permettent la lecture
3. Vérifier qu'il y a des données dans la table

---

## 8️⃣ Notes pour le Futur

- ✅ Code frontend est maintenant compatible avec la structure BD réelle
- ⏳ Migration SQL doit être appliquée pour finaliser la correction
- 📊 Pas de modifications supplémentaires nécessaires si migration est appliquée
- 🔍 Ajouter des validations pour `current_status` vs `status` dans les services

---

**Prochaines étapes**: Exécuter la migration SQL dans Supabase
