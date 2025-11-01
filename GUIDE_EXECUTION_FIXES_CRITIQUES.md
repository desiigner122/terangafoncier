# 🚨 GUIDE D'EXÉCUTION - CORRECTIONS CRITIQUES SQL

**Date**: 28 Octobre 2025  
**Statut**: 🔴 3 ERREURS BLOQUANTES À CORRIGER  
**Temps estimé**: 10 minutes

---

## 📋 PROBLÈMES IDENTIFIÉS

### 1️⃣ PGRST204 - Colonne `message_type` manquante
- **Table**: `purchase_case_messages`
- **Impact**: Messages ne s'envoient pas
- **Erreur**: `Could not find the 'message_type' column`

### 2️⃣ 42703 - Colonne `appointment_date` manquante
- **Table**: `calendar_appointments`
- **Impact**: Page de suivi dossier ne charge pas
- **Erreur**: `column calendar_appointments.appointment_date does not exist`

### 3️⃣ RLS Policy Violation
- **Impact**: Upload de documents bloqué
- **Erreur**: `new row violates row-level security policy`

---

## ✅ SOLUTION EN 3 ÉTAPES

### ÉTAPE 1: Exécuter la migration SQL principale
**Fichier**: `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`  
**Durée**: 2-3 minutes

1. **Ouvrir Supabase Console**: https://app.supabase.com
2. **Sélectionner projet**: `terangafoncier` (ndenqikcogzrkrjnlvns)
3. **Aller à**: SQL Editor (menu gauche)
4. **Créer**: New Query
5. **Important**: Sélectionner rôle **`service_role`** (dropdown en haut à droite)
6. **Copier/Coller**: TOUT le contenu de `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`
7. **Exécuter**: Ctrl+Entrée (ou bouton Run)
8. **Vérifier**: Pas d'erreurs en rouge en bas

**Ce que ça corrige**:
- ✅ Ajoute colonne `start_time` dans `calendar_appointments`
- ✅ Ajoute colonne `message_type` dans `purchase_case_messages`
- ✅ Crée les FK constraints manquantes
- ✅ Crée les indexes de performance

---

### ÉTAPE 2: Configurer les RLS policies
**Fichier**: `FIX_RLS_POLICIES.sql`  
**Durée**: 2-3 minutes

1. **Dans SQL Editor**: New Query
2. **Rôle**: `service_role`
3. **Copier/Coller**: TOUT le contenu de `FIX_RLS_POLICIES.sql`
4. **Exécuter**: Ctrl+Entrée
5. **Ignorer**: Erreurs sur `storage.objects` (normal, table gérée par Supabase)

**Ce que ça corrige**:
- ✅ RLS policies pour `purchase_case_messages`
- ✅ RLS policies pour `purchase_case_documents`
- ✅ Permissions pour buyer/seller dans leurs dossiers

---

### ÉTAPE 3: Configurer Storage Policies (via Dashboard)
**Durée**: 2 minutes

**Pourquoi via Dashboard**: Les tables `storage.objects` ne peuvent pas être modifiées via SQL

1. **Dans Supabase Dashboard**: Menu gauche → **Storage**
2. **Cliquer**: Sur bucket **`documents`** (ou créer si n'existe pas)
3. **Onglet**: **Policies**
4. **Vérifier**: Une policy pour INSERT existe
5. **Si manquante**, créer:
   - **Name**: `Authenticated users can upload documents`
   - **Policy command**: `INSERT`
   - **Allowed roles**: `authenticated`
   - **Policy definition**: 
     ```sql
     (bucket_id = 'documents'::text)
     ```

---

## 🧪 TESTS DE VALIDATION

### Test 1: Vérifier les colonnes créées
```sql
-- Dans SQL Editor
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'calendar_appointments' 
  AND column_name IN ('start_time', 'purchase_request_id')
ORDER BY column_name;
-- Doit retourner: start_time, purchase_request_id

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'purchase_case_messages' 
  AND column_name = 'message_type';
-- Doit retourner: message_type
```

### Test 2: Envoyer un message (Frontend)
1. Ouvrir l'application: `http://localhost:5173`
2. Aller à un dossier d'achat
3. Onglet **Messages**
4. Écrire un message test
5. Cliquer **Envoyer**
6. **Vérifier**: 
   - ✅ Pas d'erreur PGRST204 dans la console (F12)
   - ✅ Message s'affiche

### Test 3: Uploader un document (Frontend)
1. Onglet **Documents**
2. Cliquer **Ajouter un document**
3. Sélectionner un fichier
4. **Vérifier**:
   - ✅ Pas d'erreur RLS
   - ✅ Document s'upload

### Test 4: Charger les rendez-vous (Frontend)
1. Aller à la page de suivi d'un dossier
2. Vérifier que la page charge sans erreur 42703
3. **Console (F12)**: Pas d'erreur sur `calendar_appointments`

---

## 🔍 DÉPANNAGE

### Erreur: "must be owner of table objects"
- **Cause**: Tentative de modifier `storage.objects` via SQL
- **Solution**: Ignorer cette erreur, utiliser le Dashboard (ÉTAPE 3)

### Erreur: "column already exists"
- **Cause**: Migration déjà exécutée partiellement
- **Solution**: C'est OK, le script utilise `IF NOT EXISTS`

### Erreur: "relation does not exist"
- **Cause**: Table `purchase_case_messages` n'existe pas
- **Solution**: 
  1. Vérifier le nom de la table dans Supabase Table Editor
  2. Peut-être `messages` au lieu de `purchase_case_messages`
  3. Adapter le script si nécessaire

### Messages toujours ne s'envoient pas
1. **Vérifier colonne**:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'purchase_case_messages';
   ```
2. **Console (F12)**: Chercher l'erreur exacte
3. **Network tab**: Vérifier la requête POST à `/rest/v1/purchase_case_messages`

### Upload toujours bloqué
1. **Vérifier bucket existe**: Storage → Buckets → `documents`
2. **Vérifier policies**: Storage → documents → Policies tab
3. **Créer policy permissive** pour tester:
   ```sql
   -- Dans policy editor
   bucket_id = 'documents'::text
   ```

---

## 📊 CHECKLIST FINALE

- [ ] **ÉTAPE 1**: Migration SQL `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` exécutée
- [ ] **ÉTAPE 2**: RLS policies `FIX_RLS_POLICIES.sql` exécutées
- [ ] **ÉTAPE 3**: Storage policies configurées via Dashboard
- [ ] **TEST 1**: Colonnes `start_time` et `message_type` existent
- [ ] **TEST 2**: Message s'envoie sans erreur PGRST204
- [ ] **TEST 3**: Document s'upload sans erreur RLS
- [ ] **TEST 4**: Page de suivi charge sans erreur 42703
- [ ] **Console (F12)**: Aucune erreur rouge dans la console

---

## 📈 RÉSULTATS ATTENDUS

### Avant les corrections:
```
❌ PGRST204: Could not find 'message_type' column
❌ 42703: column calendar_appointments.appointment_date does not exist
❌ RLS: new row violates row-level security policy
❌ Messages: Ne s'envoient pas
❌ Documents: Upload bloqué
❌ Page suivi: Ne charge pas
```

### Après les corrections:
```
✅ Colonne message_type existe
✅ Colonne start_time existe (pas appointment_date)
✅ RLS policies configurées
✅ Messages s'envoient correctement
✅ Documents s'uploadent
✅ Page de suivi charge complètement
✅ Console sans erreurs
```

---

## 🔗 FICHIERS ASSOCIÉS

| Fichier | Description | Statut |
|---------|-------------|--------|
| `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` | Migration principale (colonnes + indexes) | ✅ Prêt |
| `FIX_RLS_POLICIES.sql` | RLS policies pour messages/documents | ✅ Prêt |
| `ACTION_IMMEDIATE_PGRST204_MESSAGE_TYPE.md` | Documentation détaillée | 📖 Référence |
| `ACTION_IMMEDIATE_FIX_CALENDAR_APPOINTMENTS.md` | Documentation détaillée | 📖 Référence |

---

## 🚀 PROCHAINES ÉTAPES APRÈS CORRECTION

1. **Tester en local**: Vérifier que tout fonctionne (tests ci-dessus)
2. **Commit & Push**: 
   ```bash
   git add GUIDE_EXECUTION_FIXES_CRITIQUES.md
   git commit -m "docs: Add execution guide for critical SQL fixes"
   git push origin copilot/vscode1760961809107
   ```
3. **Documenter**: Ajouter note dans PR #1 sur les fixes SQL appliqués
4. **Monitoring**: Surveiller les logs Supabase pour autres erreurs

---

## ⏱️ TEMPS TOTAL: ~10 MINUTES
- ÉTAPE 1: 3 min
- ÉTAPE 2: 3 min  
- ÉTAPE 3: 2 min
- TESTS: 2 min

---

**Priorité**: 🔴 **CRITIQUE - BLOQUANT**  
**Action**: Exécuter MAINTENANT dans Supabase SQL Editor

---

## 💡 NOTES IMPORTANTES

1. **Rôle `service_role` obligatoire**: Sans ce rôle, les migrations échoueront
2. **Ignorer erreurs storage.objects**: Normal, ces tables sont gérées par Supabase
3. **IF NOT EXISTS sûr**: Les scripts peuvent être ré-exécutés sans problème
4. **Backup non nécessaire**: Les scripts ajoutent uniquement des colonnes/policies
5. **Pas de downtime**: Les migrations sont non-destructives

---

**Dernière mise à jour**: 28 Octobre 2025  
**Auteur**: Teranga Foncier Team  
**Version**: 1.0
