## 🚨 ERREUR PGRST204 - COLONNE message_type MANQUANTE

**Date**: 25 Octobre 2025  
**Erreur**: `Could not find the 'message_type' column of 'purchase_case_messages' in the schema cache`  
**État**: 🔴 BLOQUANT - Messages et uploads ne fonctionnent pas

---

## 📋 Problèmes identifiés

### 1️⃣ Erreur PGRST204 - message_type manquante
```
POST https://ndenqikcogzrkrjnlvns.supabase.co/rest/v1/purchase_case_messages [HTTP/3 400]
Code: PGRST204
Message: Could not find the 'message_type' column of 'purchase_case_messages' in the schema cache
```

**Cause**: 
- Table `purchase_case_messages` n'a pas la colonne `message_type`
- Code frontend essaie d'insérer `{ message_type: 'text', ... }`
- Supabase rejette car colonne n'existe pas

**Solution**: Exécuter la migration SQL

### 2️⃣ Erreur RLS - Upload de documents bloqué
```
Storage Error: new row violates row-level security policy
```

**Cause**:
- Policies de la table `storage.objects` ne permettent pas l'upload
- Ou l'utilisateur n'a pas les permissions

**Solution**: Configurer les storage policies dans le dashboard (pas via SQL)

### 3️⃣ WebSocket connection error (non-bloquant)
```
Firefox ne peut établir de connexion avec le serveur à l'adresse wss://...
```

**Cause**: Connexion WebSocket fail pour les subscriptions temps réel  
**Impact**: Non-bloquant - REST API fonctionne  
**Priorité**: 🟡 BAS - À corriger après MVP

---

## ✅ SOLUTION ÉTAPE PAR ÉTAPE

### ÉTAPE 1: Exécuter la migration SQL

**Fichier**: `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` (mis à jour)

**Contient**:
1. Corrections `calendar_appointments` (appointment_date → start_time)
2. **NOUVEAU** - Corrections `purchase_case_messages`:
   - Ajouter colonne `message_type`
   - Ajouter `case_id`, `sender_id`, `message`
   - Ajouter FK constraints
   - Créer indexes

**À exécuter**:

1. Ouvrir Supabase → SQL Editor → New Query
2. **Important**: Sélectionner rôle `service_role` (dropdown en haut)
3. Copier/coller TOUT le contenu de `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`
4. Appuyer sur **Ctrl+Entrée**
5. Vérifier: pas d'erreurs en rouge

**Résultat attendu**:
```
Column Name             | Data Type
-----------------------+--------------------
message_type            | character varying
case_id                 | uuid
sender_id               | uuid
message                 | text
... (autres colonnes)   | ...
```

---

### ÉTAPE 2: Corriger les storage policies

**Problème**: `new row violates row-level security policy` lors de l'upload

**Solution**: Configurer les storage policies via le Dashboard (pas SQL)

#### Option A: Via Supabase Dashboard (RECOMMANDÉ)

1. Aller à: https://app.supabase.com
2. Sélectionner projet **terangafoncier**
3. Menu gauche → **Storage**
4. Cliquer sur bucket **"documents"**
5. Onglet **"Policies"**
6. Chercher une policy pour INSERT
7. Si elle n'existe pas, créer:
   - **Type**: INSERT
   - **Allowed roles**: authenticated
   - **Policy**: `true` (ou `bucket_id = 'documents'`)

#### Option B: Via SQL (si possible)

Exécuter le fichier `FIX_RLS_POLICIES.sql`:
- Il corrige les policies pour `purchase_case_messages` ✅
- Il essaie de corriger storage (mais ça peut échouer si pas de permissions)
- Il corrige les policies pour `purchase_case_documents` ✅

---

### ÉTAPE 3: Tester les corrections

#### Test 1: Vérifier les colonnes
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'purchase_case_messages' 
ORDER BY ordinal_position;
```

Doit inclure: `message_type`, `case_id`, `sender_id`, `message`

#### Test 2: Envoyer un message
1. Ouvrir page suivi dossier
2. Aller à l'onglet "Messages"
3. Écrire un message
4. Cliquer "Envoyer"
5. **Vérifier**: Pas d'erreur PGRST204
6. Message doit s'afficher

#### Test 3: Uploader un document
1. Aller à l'onglet "Documents"
2. Cliquer "Ajouter un document"
3. Sélectionner un fichier
4. **Vérifier**: Pas d'erreur RLS
5. Document doit s'uploader

---

## 📊 Fichiers de correction

| Fichier | Contenu | Statut |
|---------|---------|--------|
| `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` | Migrations calendar_appointments + purchase_case_messages | ✅ Prêt |
| `FIX_RLS_POLICIES.sql` | RLS policies pour messages et documents | ✅ Prêt |
| `ParticulierCaseTrackingModernRefonte.jsx` | Frontend fixes (appointment_date, current_status) | ✅ Déjà appliqué |

---

## 🔍 Dépannage

### Erreur: "must be owner of table objects"
**Cause**: Permissions insuffisantes pour modifier storage policies via SQL  
**Solution**: Utiliser le Dashboard au lieu de SQL

### Erreur: "Column message_type does not exist" persiste
**Cause**: Migration SQL n'a pas été exécutée correctement  
**Solution**:
1. Vérifier que rôle `service_role` était sélectionné
2. Vérifier qu'il n'y a pas eu d'erreurs pendant l'exécution
3. Exécuter la query SQL manuellement pour vérifier

### Upload document toujours échoue après migration
**Cause**: Storage policies toujours bloquent l'accès  
**Solution**:
1. Aller au Dashboard → Storage → documents
2. Vérifier les policies
3. Ajouter une policy permissive pour tester:
   - Rôle: authenticated
   - Policy: `true`

---

## ✨ Checklist de validation

- [ ] Migration SQL exécutée pour `purchase_case_messages`
- [ ] Colonne `message_type` existe dans la BD
- [ ] Colonne `case_id` existe dans la BD
- [ ] RLS policies créées pour `purchase_case_messages`
- [ ] RLS policies créées pour `purchase_case_documents`
- [ ] Envoi de message fonctionne sans erreur PGRST204
- [ ] Upload de document fonctionne sans erreur RLS
- [ ] WebSocket: optionnel (non-critique pour MVP)

---

## 📞 Prochaines étapes

1. ✅ Exécuter `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` dans Supabase
2. ✅ Exécuter `FIX_RLS_POLICIES.sql` (essayer, erreurs OK)
3. ⏳ Configurer storage policies via Dashboard si besoin
4. ⏳ Tester messages et uploads
5. ⏳ Corriger WebSocket (optionnel)

**Priorité**: 🔴 **CRITIQUE** - Messages et uploads doivent fonctionner
