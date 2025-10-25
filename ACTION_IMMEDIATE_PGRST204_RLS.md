## 🚨 ERREURS DÉCOUVERTES - ACTION IMMÉDIATE REQUISE

**Date**: 25 Octobre 2025  
**Statut**: 🔴 BLOQUANT  
**Problèmes**: 3 erreurs critiques

---

## 📋 Résumé des erreurs

| Erreur | Cause | Bloquant | Solution |
|--------|-------|----------|----------|
| **PGRST204** - `message_type` colonne manquante | Table `purchase_case_messages` incomplète | ✅ OUI | Exécuter migration SQL |
| **RLS Error** - `new row violates row-level security policy` | Permissions de Storage incorrectes | ✅ OUI | Configurer RLS policies |
| **WebSocket Error** - Connection refused | Supabase Realtime service | ❌ NON | Non-bloquant pour MVP |

---

## 🔧 CORRECTIONS À APPLIQUER

### Correction 1: Exécuter migration SQL (calendar_appointments + purchase_case_messages)

**Fichier**: `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`  
**Lieu**: Supabase SQL Editor  
**Rôle**: `service_role`

**Étapes**:
1. Ouvrir https://app.supabase.com → Project → SQL Editor → New Query
2. Copier TOUT le contenu de `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`
3. S'assurer que le rôle est `service_role` (dropdown en haut à droite)
4. Exécuter (Ctrl+Entrée)
5. Vérifier le résultat final (voir les colonnes de `calendar_appointments` et `purchase_case_messages`)

**Résultat attendu**:
- ✅ `calendar_appointments` a colonne `start_time` (pas `appointment_date`)
- ✅ `purchase_case_messages` a colonne `message_type`
- ✅ Pas d'erreurs en bas

---

### Correction 2: Configurer les RLS Policies

**Fichier**: `FIX_RLS_POLICIES.sql`  
**Lieu**: Supabase SQL Editor  
**Rôle**: `service_role`

**Étapes**:
1. Ouvrir une nouvelle Query dans SQL Editor
2. Copier TOUT le contenu de `FIX_RLS_POLICIES.sql`
3. Exécuter (Ctrl+Entrée)
4. Vérifier qu'il n'y a pas d'erreurs

**Résultat attendu**:
- ✅ RLS policies créées pour `storage.objects`
- ✅ RLS policies créées pour `purchase_case_messages`
- ✅ RLS policies créées pour `purchase_case_documents`
- ✅ Tableau de vérification affiche toutes les policies

---

## ✨ Étapes d'exécution complète

### ÉTAPE 1: Vérifier le frontend (✅ Déjà fait)
```
Code changes committed:
- b55557ff: appointment_date → start_time
- b55557ff: current_status → status
- ca39ce9c: SQL migration pour purchase_case_messages
```

### ÉTAPE 2: Exécuter migration SQL (⏳ À FAIRE)
```sql
-- Exécuter: QUICK_FIX_CALENDAR_APPOINTMENTS.sql
-- Durée: ~30 secondes
-- Vérifier: Voir les colonnes créées/ajoutées
```

### ÉTAPE 3: Configurer RLS policies (⏳ À FAIRE)
```sql
-- Exécuter: FIX_RLS_POLICIES.sql
-- Durée: ~30 secondes
-- Vérifier: Les 3 tables ont leurs policies
```

### ÉTAPE 4: Tester dans le frontend
```
1. Hard refresh: Ctrl+Shift+R
2. Aller à la page de suivi du dossier
3. Tester l'envoi d'un message (doit fonctionner)
4. Tester l'upload d'un document (doit fonctionner)
```

---

## 🧪 Vérification après exécution

### Après CORRECTION 1: Vérifier les colonnes

Dans Supabase SQL Editor, exécuter:

```sql
-- Vérifier calendar_appointments
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'calendar_appointments'
ORDER BY ordinal_position;

-- Résultat: doit avoir start_time (PAS appointment_date)

-- Vérifier purchase_case_messages
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_case_messages'
ORDER BY ordinal_position;

-- Résultat: doit avoir message_type, case_id, sender_id, message
```

### Après CORRECTION 2: Vérifier les policies

```sql
SELECT
  tablename,
  policyname,
  permissive,
  roles
FROM pg_policies
WHERE tablename IN ('objects', 'purchase_case_messages', 'purchase_case_documents')
ORDER BY tablename, policyname;
```

**Résultat attendu**:
- `objects` - policies pour upload/read/delete
- `purchase_case_messages` - policies pour SELECT/INSERT/UPDATE
- `purchase_case_documents` - policies pour SELECT/INSERT

---

## 🎯 Après tout cela

### Tester dans le navigateur:

1. **Aller à la page du dossier**: `http://localhost:5173/acheteur/dossier/TF-20251021-0002`

2. **Vérifier aucune erreur PGRST204**:
   - Ouvrir F12 → Console
   - Chercher: `Could not find the 'message_type' column`
   - Résultat: ✅ Ne doit PAS apparaître

3. **Tester l'envoi d'un message**:
   - Aller à l'onglet "Messages"
   - Écrire un message test
   - Cliquer "Envoyer"
   - Vérifier: ✅ Message s'affiche

4. **Tester l'upload de document**:
   - Aller à l'onglet "Documents"
   - Sélectionner un fichier
   - Vérifier: ✅ Fichier s'upload (pas d'erreur RLS)

---

## 📊 Fichiers de correction

| Fichier | Description | Exécuter | Priorité |
|---------|-------------|----------|----------|
| `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` | Fixes calendar_appointments + purchase_case_messages | 🔴 OUI | 🔴 HAUTE |
| `FIX_RLS_POLICIES.sql` | Configure RLS policies pour Storage et messaging | 🔴 OUI | 🔴 HAUTE |
| `EXECUTION_GUIDE_FIX_CALENDAR_APPOINTMENTS.md` | Guide étape par étape (ancien) | 📖 Lecture | 🟢 BASSE |

---

## ⚠️ Notes importantes

1. **WebSocket Error** (non-bloquant):
   - Le temps réel ne fonctionne pas
   - REST API fonctionne correctement
   - On peut vivre sans pour MVP
   - À configurer en production

2. **RLS Policies**:
   - Essentielles pour la sécurité
   - Empêchent les utilisateurs de voir les données des autres
   - À exécuter ABSOLUMENT avant production

3. **Migration SQL**:
   - Idempotente (peut être exécutée plusieurs fois)
   - Les colonnes existantes ne seront pas modifiées
   - Les constraints manquantes seront ajoutées

---

## ✅ Checklist de déploiement

- [ ] Migration SQL exécutée (`QUICK_FIX_CALENDAR_APPOINTMENTS.sql`)
- [ ] Colonnes vérifées dans Supabase
- [ ] RLS policies exécutées (`FIX_RLS_POLICIES.sql`)
- [ ] Policies vérifiées dans Supabase
- [ ] Frontend hard-refreshé (Ctrl+Shift+R)
- [ ] Page de suivi charge sans erreur PGRST204
- [ ] Message s'envoie correctement
- [ ] Document s'upload correctement
- [ ] Aucune erreur RLS dans les logs

---

## 🆘 Si problèmes persistent

1. **Erreur: "Column does not exist"**
   - Vérifier que la migration SQL a bien été exécutée
   - Vérifier qu'il n'y a pas d'erreurs en bas de la query
   - Attendre 1-2 minutes (cache Postgrest)

2. **Erreur RLS toujours là**
   - Vérifier que `FIX_RLS_POLICIES.sql` a été exécuté
   - Vérifier que les policies apparaissent dans `pg_policies`
   - Vérifier que le rôle sélectionné est correct dans la policy

3. **Message ne s'envoie pas**
   - Vérifier `message_type` colonne existe
   - Vérifier que l'utilisateur est authentifié
   - Vérifier les logs du navigateur (F12)

---

**Prêt à exécuter?** → Commencez par `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`
