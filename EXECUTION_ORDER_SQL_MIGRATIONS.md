## 🎯 ORDRE D'EXÉCUTION DES MIGRATIONS SQL

**Important**: Les migrations doivent être exécutées dans cet ordre exact!

---

## ⏱️ ORDRE CORRECT

### ÉTAPE 1️⃣: Exécuter QUICK_FIX_CALENDAR_APPOINTMENTS.sql (PREMIÈRE)

**Fichier**: `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`

**Contient**:
- ✅ Corrections pour `calendar_appointments`
- ✅ **AJOUTE les colonnes manquantes** à `purchase_case_messages`:
  - `message_type`
  - `case_id`
  - `sender_id` ← Important!
  - `message`
  - `is_read`
  - Timestamps

**À exécuter dans Supabase**:
1. SQL Editor → New Query
2. Rôle: **service_role** (IMPORTANT)
3. Copier/coller tout le contenu
4. Exécuter (Ctrl+Entrée)
5. **Attendre la fin** - Voir les vérifications finale

**Résultat**: Les colonnes manquantes sont créées

---

### ÉTAPE 2️⃣: Exécuter FIX_RLS_POLICIES.sql (DEUXIÈME)

**Fichier**: `FIX_RLS_POLICIES.sql`

**Contient**:
- ✅ RLS policies pour `purchase_case_messages` (maintenant que les colonnes existent!)
- ✅ RLS policies pour `purchase_case_documents`
- ℹ️ Notes sur les storage policies (via Dashboard)

**À exécuter dans Supabase**:
1. SQL Editor → New Query
2. Rôle: **service_role**
3. Copier/coller tout le contenu
4. Exécuter (Ctrl+Entrée)

**Résultat**: Les RLS policies sont créées, les messages peuvent être insérés

---

## ❌ Erreur commune

```
ERROR:  42703: column "sender_id" does not exist
```

**Cause**: Vous avez exécuté `FIX_RLS_POLICIES.sql` AVANT `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`

**Solution**: 
1. Exécuter d'abord `QUICK_FIX_CALENDAR_APPOINTMENTS.sql`
2. **Attendre que ça se termine**
3. Puis exécuter `FIX_RLS_POLICIES.sql`

---

## ✅ CHECKLIST D'EXÉCUTION

- [ ] **ÉTAPE 1**: `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` exécutée ✅
- [ ] Pas d'erreurs dans ÉTAPE 1
- [ ] Colonnes vérifiées dans la console finale d'ÉTAPE 1
- [ ] **ÉTAPE 2**: `FIX_RLS_POLICIES.sql` exécutée ✅
- [ ] Pas d'erreurs dans ÉTAPE 2

---

## 🔍 Vérifier que tout est correct

Après avoir exécuté les deux migrations, lancer ces queries:

```sql
-- Vérifier les colonnes de purchase_case_messages
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'purchase_case_messages'
ORDER BY ordinal_position;

-- Vérifier les RLS policies
SELECT policyname, permissive, roles
FROM pg_policies
WHERE tablename = 'purchase_case_messages'
ORDER BY policyname;

-- Vérifier les RLS policies pour documents
SELECT policyname, permissive, roles
FROM pg_policies
WHERE tablename = 'purchase_case_documents'
ORDER BY policyname;
```

**Résultat attendu**:
```
Colonnes de purchase_case_messages:
- id, case_id, sender_id, message, message_type, is_read, created_at, updated_at, ...

RLS policies de purchase_case_messages:
- "Users can view messages in their cases"
- "Users can insert messages in their cases"
- "Users can update their own messages"

RLS policies de purchase_case_documents:
- "Users can view documents in their cases"
- "Users can insert documents in their cases"
```

---

## 📝 Résumé

| N° | Fichier | Action | Ordre |
|----|---------|--------|-------|
| 1️⃣ | `QUICK_FIX_CALENDAR_APPOINTMENTS.sql` | EXÉCUTER | **PREMIER** |
| 2️⃣ | `FIX_RLS_POLICIES.sql` | EXÉCUTER | **DEUXIÈME** |
| 3️⃣ | Storage policies | Configurer via Dashboard | Si upload échoue |

---

## ⚠️ Important

- ✅ Toujours utiliser rôle **service_role**
- ✅ Exécuter dans cet ordre EXACT
- ✅ Vérifier qu'il n'y a pas d'erreurs à chaque étape
- ✅ Ne pas sauter d'étapes
