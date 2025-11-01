# 🚀 GUIDE D'EXÉCUTION - FIX ERREUR 42703 CALENDAR_APPOINTMENTS

**Date**: 25 Octobre 2025  
**Statut**: ✅ Frontend fixé | ⏳ Backend (SQL) à appliquer  
**Impact**: Page de suivi des dossiers d'achat (particulier)

---

## 📋 Vue d'ensemble

**Problème**: Page de suivi d'un dossier d'achat retourne l'erreur:
```
Fetch error: {"code":"42703","message":"column calendar_appointments.appointment_date does not exist"}
```

**Cause racine**:
- Code frontend demande `.order('appointment_date')`
- Table BD a la colonne `start_time` (pas `appointment_date`)
- Code frontend utilisait aussi `purchaseCase.current_status` au lieu de `purchaseCase.status`

**Solution**:
1. ✅ **Frontend** - Changé les noms de colonnes (FAIT - Commit b55557ff)
2. ⏳ **Backend** - Exécuter migration SQL (À FAIRE)

---

## ✅ ÉTAPE 1: Vérifier que le frontend est à jour

### 1.1 Vérifier le dernier commit
```bash
git log --oneline -5
```

Doit afficher:
```
e76a5e6a docs: add SQL migrations and diagnostics...
b55557ff fix: replace appointment_date with start_time and current_status with status...
```

### 1.2 S'assurer que le dev server compile
```bash
npm run dev
```

Vérifier qu'il n'y a **pas d'erreurs TypeScript** dans la sortie.

---

## 🔧 ÉTAPE 2: Exécuter la migration SQL dans Supabase

### 2.1 Ouvrir Supabase SQL Editor

1. Aller à: https://app.supabase.com
2. Sélectionner le projet **terangafoncier**
3. Menu gauche → **SQL Editor**
4. Cliquer sur **New Query**

### 2.2 Sélectionner le rôle correct

En haut à droite du SQL Editor, voir la dropdown **Rôle**:
- **Avant**: Changer de `anon` ou `authenticated` → `service_role`
- **Sinon**: Le script n'aura pas les permissions

### 2.3 Copier et exécuter le script

**Option A: Script rapide (recommandé)**

1. Ouvrir le fichier: `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`
2. Copier TOUT le contenu
3. Dans Supabase SQL Editor, **coller le code**
4. Appuyer sur **Ctrl+Entrée** (ou cliquer le bouton Run)

**Option B: Script complet**

1. Ouvrir le fichier: `FIX_CALENDAR_APPOINTMENTS_SCHEMA.sql`
2. Copier/coller dans Supabase
3. Exécuter

### 2.4 Vérifier l'exécution

Le script doit afficher à la fin:

```
Column Name             | Data Type          | is_nullable
-----------------------+--------------------+-----------
id                      | uuid               | NO
purchase_request_id     | uuid               | YES
start_time              | timestamp with...  | NO       ← KEY!
end_time                | timestamp with...  | YES
title                   | character varying  | YES
description             | text               | YES
appointment_type        | character varying  | YES
location                | character varying  | YES
status                  | character varying  | YES
created_at              | timestamp with...  | NO
updated_at              | timestamp with...  | NO
...
```

**Important**: Vérifier que:
- ✅ `start_time` existe (pas `appointment_date`)
- ✅ `purchase_request_id` existe
- ✅ Pas d'erreurs en bas (section rouge)

### 2.5 Si erreur "Role cannot execute this command"

Cela signifie que vous n'êtes pas en rôle `service_role`:

1. Chercher la dropdown en haut à droite
2. Sélectionner **service_role**
3. Relancer la query

---

## 🧪 ÉTAPE 3: Tester le frontend

### 3.1 Rafraîchir le navigateur

```
Appuyer sur: Ctrl+Shift+R  (hard refresh)
ou
Aller à: Settings → Clear Cache
```

### 3.2 Aller sur la page de suivi du dossier

1. Ouvrir le dashboard: http://localhost:5173/acheteur/mes-achats
2. Cliquer sur un dossier d'achat (ex: TF-20251021-0002)
3. **Vérifier que la page charge sans erreur**

### 3.3 Vérifier la console du navigateur (F12)

Rechercher ces erreurs:
```
❌ Fetch error: {...code: "42703"...}
❌ Cannot read properties of undefined (reading 'appointment_date')
❌ column purchase_cases.current_status does not exist
```

Si vous les voyez, **la migration SQL n'a pas été exécutée correctement**.

### 3.4 Vérifier que l'état du dossier s'affiche

Sur la page de suivi, le header doit afficher:
- ✅ État du dossier (ex: "Négociation" en violet)
- ✅ Barre de progression (%)
- ✅ Numéro du dossier (TF-20251021-0002)

---

## 🔍 ÉTAPE 4: Diagnostiquer si problèmes persistent

### 4.1 Vérifier les données dans Supabase

Ouvrir Supabase SQL Editor → New Query → Copier/coller:

```sql
-- Vérifier que le dossier existe
SELECT id, case_number, status, created_at 
FROM public.purchase_cases 
WHERE case_number = 'TF-20251021-0002' 
LIMIT 1;

-- Vérifier que les colonnes existent
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'calendar_appointments' 
ORDER BY ordinal_position;
```

### 4.2 Si toujours pas de données

Utiliser le fichier: `DIAGNOSTIC_CASE_DATA.sql`
- Ce script montre toutes les données associées au dossier
- Exécuter dans Supabase SQL Editor
- Voir si vous avez des données ou si la BD est vide

### 4.3 Ouvrir la console du navigateur

Chercher les logs:
```javascript
console.log('📋 Dossier chargé (acheteur):', caseData);
console.log('📝 Request chargée:', requestData);
console.log('🏠 Propriété chargée depuis parcelle_id:', pData);
```

Si ces logs apparaissent, cela signifie que les données se chargent correctement.

---

## 📊 Fichiers de cette correction

### Frontend (✅ Fixé)
- **src/pages/dashboards/particulier/ParticulierCaseTrackingModernRefonte.jsx**
  - Commit: `b55557ff`
  - Changements:
    - `appointment_date` → `start_time` (2 occurrences)
    - `purchaseCase.current_status` → `purchaseCase.status` (3 occurrences)

### Backend (⏳ À appliquer)
- **QUICK_FIX_CALENDAR_APPOINTMENTS.sql** - Version rapide (recommandée)
- **FIX_CALENDAR_APPOINTMENTS_SCHEMA.sql** - Version complète avec DO blocks

### Diagnostics
- **ACTION_IMMEDIATE_FIX_CALENDAR_APPOINTMENTS.md** - Documentation technique
- **DIAGNOSTIC_CASE_DATA.sql** - Scripts de diagnostic

---

## ✨ Résumé des corrections

| Problème | Avant | Après | Statut |
|----------|-------|-------|--------|
| Colonne `appointment_date` | ❌ N'existe pas | `start_time` utilisé | ✅ Fixé |
| Colonne `current_status` | ❌ N'existe pas | `status` utilisé | ✅ Fixé |
| Affichage état dossier | ❌ Erreur | ✅ Affiche correctement | ✅ Fixé |
| Chargement rendez-vous | ❌ Erreur 42703 | ✅ Se charge | ✅ Fixé |
| FK `purchase_request_id` | ❌ Peut manquer | ✅ Ajoutée | ⏳ À exécuter |
| Indexes performance | ❌ Peut manquer | ✅ Créés | ⏳ À exécuter |

---

## 🆘 Dépannage

### Erreur: "Cannot read properties of undefined"

**Cause**: Les données n'ont pas fini de charger
**Solution**: 
1. Attendre quelques secondes
2. Vérifier la console (F12) pour les erreurs Supabase
3. Vérifier que la migration SQL a été exécutée

### Erreur: "Column does not exist"

**Cause**: La migration SQL n'a pas été exécutée OU l'erreur est sur une autre colonne
**Solution**:
1. Exécuter la migration SQL dans Supabase
2. Utiliser `DIAGNOSTIC_CASE_DATA.sql` pour vérifier les colonnes

### Le frontend ne recompile pas

**Cause**: Cache du navigateur ou du serveur
**Solution**:
```bash
# Terminal 1: Arrêter le serveur (Ctrl+C)
# Puis:
npm run dev

# Terminal 2: Ouvrir le navigateur avec cache désactivé
# Firefox: F12 → Settings → "Disable HTTP Cache (when toolbox is open)"
# Chrome: F12 → Network → "Disable cache"
```

---

## 📞 Questions ou problèmes?

1. Vérifier que tous les fichiers `.sql` ont été exécutés dans Supabase
2. S'assurer que le rôle sélectionné est `service_role`
3. Vérifier les logs de la console (F12)
4. Utiliser les scripts de diagnostic pour analyser les données

---

## ✅ Checklist de validation

- [ ] Frontend compilé sans erreurs (`npm run dev`)
- [ ] Migration SQL exécutée dans Supabase (service_role)
- [ ] Colonne `start_time` existe dans `calendar_appointments`
- [ ] Colonne `purchase_request_id` existe dans `calendar_appointments`
- [ ] Page de suivi charge sans erreur 42703
- [ ] État du dossier s'affiche correctement
- [ ] Rendez-vous s'affichent (si des données existent)

---

**Dernier commit**: e76a5e6a  
**Date**: 25 Octobre 2025  
**Prêt pour production**: ✅ Oui (après exécution de la migration SQL)
