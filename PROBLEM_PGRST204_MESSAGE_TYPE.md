## 🚨 NOUVEAU PROBLÈME IDENTIFIÉ - ERREUR PGRST204

**Date**: 25 Octobre 2025  
**Erreur**: `Could not find the 'message_type' column of 'purchase_case_messages' in the schema cache`  
**Impact**: 🔴 BLOQUANT - Impossible d'envoyer des messages

---

## 🔍 Erreurs détectées

### Erreur 1: message_type colonne manquante
```
POST https://ndenqikcogzrkrjnlvns.supabase.co/rest/v1/purchase_case_messages [HTTP/3 400]
Code: PGRST204
Message: Could not find the 'message_type' column of 'purchase_case_messages' in the schema cache
```

**Cause**: Code frontend envoie `message_type` mais la colonne n'existe pas ou n'a pas été créée.

### Erreur 2: Problème de RLS (Row Level Security) pour upload
```
Storage Error: new row violates row-level security policy
```

**Cause**: Les politiques RLS empêchent l'upload de documents.

### Erreur 3: WebSocket connection issue
```
Firefox ne peut établir de connexion avec le serveur à l'adresse wss://...
```

**Cause**: Non-bloquant, les mises à jour en temps réel ne fonctionnent pas mais REST fonctionne.

---

## ✅ Solution immédiate

### ÉTAPE 1: Exécuter la migration SQL complète

Le fichier `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` a été mis à jour pour inclure:

1. **Corrections calendar_appointments** (comme avant)
2. **NOUVEAU - Corrections purchase_case_messages**:
   - Ajouter colonne `message_type`
   - Ajouter colonnes manquantes: `case_id`, `sender_id`, `message`
   - Ajouter FK constraints
   - Créer indexes

**À exécuter dans Supabase SQL Editor:**

1. Copier TOUT le contenu de `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`
2. Sélectionner rôle `service_role`
3. Exécuter (Ctrl+Entrée)
4. Vérifier qu'il n'y a pas d'erreurs

---

## 📝 Vérification après exécution

Exécuter ces queries pour confirmer que les colonnes existent:

```sql
-- Vérifier purchase_case_messages
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'purchase_case_messages'
ORDER BY ordinal_position;

-- Résultat attendu (key columns):
-- id, case_id, sender_id, message, message_type, is_read, created_at, updated_at
```

---

## 🔒 Problème RLS (Storage upload)

**Erreur**: `new row violates row-level security policy`

**Raison**: Les politiques RLS du bucket `documents` empêchent l'accès.

**Solution à court terme**: Vérifier les RLS policies dans Supabase:

1. Aller à Supabase → Storage → Buckets → `documents`
2. Aller à l'onglet **Policies**
3. Vérifier que l'utilisateur peut insérer/updater

**Ou désactiver temporairement** pour tester:
```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

**Puis réactiver avec la bonne policy**:
```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy pour permettre l'upload
CREATE POLICY "Users can upload to documents" ON storage.objects
FOR INSERT USING (bucket_id = 'documents' AND auth.uid() = owner);
```

---

## 🎯 Prochaines étapes

1. ✅ Exécuter la migration SQL complète
2. ⏳ Tester l'envoi de message (doit fonctionner sans erreur PGRST204)
3. ⏳ Tester l'upload de document (résoudre RLS si besoin)
4. ⏳ Configurer les WebSocket pour temps réel (optionnel pour MVP)

---

## 📋 Checklist

- [ ] Migration SQL exécutée pour `purchase_case_messages`
- [ ] Colonne `message_type` vérifie dans la BD
- [ ] Envoi de message fonctionne sans erreur PGRST204
- [ ] Upload de document fonctionne (ou RLS policy configurée)
- [ ] WebSocket: optionnel pour MVP

**Priorité**: 🔴 **HAUTE** - Messages et uploads bloquent le workflow
