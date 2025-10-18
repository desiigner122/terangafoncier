# ⚠️ DIAGNOSTIC URGENT - CRM DATABASE MISMATCH

## 🔍 Analyse du Problème

### Erreur Observée:
```
❌ column crm_contacts.vendor_id does not exist
❌ column crm_contacts.owner_id does not exist
```

### Cause Possible:
1. Table `crm_contacts` n'a pas ces colonnes
2. Les colonnes réelles ne correspondent pas aux requêtes
3. Les requêtes utilisent des noms incorrects

---

## 📊 Schéma Réel de crm_contacts

Vous devez vérifier dans Supabase quel est le schéma RÉEL:

### Option A: Dans Supabase Console

```
1. Aller à: https://app.supabase.com/
2. Sélectionner votre projet
3. Aller à: SQL Editor
4. Copier-coller le script ci-dessous
5. Exécuter et voir le résultat
```

### SQL pour Diagnostiquer:

```sql
-- ✅ DIAGNOSTIC 1: Structure réelle de la table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'crm_contacts'
ORDER BY ordinal_position;

-- ✅ DIAGNOSTIC 2: Tous les noms de colonnes
\d crm_contacts

-- ✅ DIAGNOSTIC 3: Données existantes
SELECT * FROM crm_contacts LIMIT 1;

-- ✅ DIAGNOSTIC 4: Compter les lignes
SELECT COUNT(*) FROM crm_contacts;
```

---

## 🔧 Solutions Possibles

### Scénario 1: Table a `user_id` ✅
```javascript
// ✅ CORRECT - Le code a été fixé
.eq('user_id', user.id)
```

### Scénario 2: Table a `owner_id`
```javascript
// Changer en:
.eq('owner_id', user.id)
```

### Scénario 3: Table a `vendor_id`
```javascript
// Changer en:
.eq('vendor_id', user.id)
```

### Scénario 4: Table a une colonne différente
```javascript
// Cherchez quelle colonne FK vers auth.users
// Et utilisez-la
```

---

## 📋 Checklist de Diagnostic

- [ ] Allez à votre projet Supabase
- [ ] Ouvrez SQL Editor
- [ ] Exécutez les requêtes de diagnostic ci-dessus
- [ ] Notez EXACTEMENT quelles colonnes existent
- [ ] Comparez avec le code React
- [ ] Modifiez les requêtes si nécessaire
- [ ] Redémarrez npm run dev
- [ ] Testez à nouveau

---

## 🆘 Besoin d'Aide?

### Cas 1: "user_id n'existe pas"
```sql
-- Chercher quelle colonne existe réellement:
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'crm_contacts'
AND (column_name LIKE '%user%' 
  OR column_name LIKE '%vendor%' 
  OR column_name LIKE '%owner%');
```

### Cas 2: "Pas de FK vers auth.users"
```sql
-- Chercher toutes les colonnes UUID:
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'crm_contacts'
AND data_type = 'uuid';
```

### Cas 3: "Table vide ou inexistante"
```sql
-- Vérifier si table existe:
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'crm_contacts'
) as table_exists;
```

---

## 🛠️ Fix Rapide (Si Nécessaire)

Si la table n'a pas la bonne structure, exécutez ceci dans Supabase SQL Editor:

```sql
-- 1. Vérifier la structure actuelle
\d crm_contacts;

-- 2. Si la colonne est manquante, l'ajouter:
ALTER TABLE crm_contacts 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Créer index pour performance:
CREATE INDEX IF NOT EXISTS idx_crm_contacts_user_id ON crm_contacts(user_id);

-- 4. Vérifier le résultat:
\d crm_contacts;
```

---

## 📞 Prochaines Étapes

1. **Diagnostic:** Exécutez les requêtes SQL ci-dessus
2. **Identification:** Notez la colonne réelle (user_id, owner_id, etc.)
3. **Correction:** Modifiez le code React si nécessaire
4. **Test:** Redémarrez et vérifiez
5. **Commit:** Poussez la correction

---

## 📊 Comparaison Attendue vs Réel

| Nom | Attendu | Réel | Action |
|-----|---------|------|--------|
| FK vers auth | `user_id` | ??? | À diagnostiquer |
| Colonne de recherche | `user_id` | ??? | À diagnostiquer |
| Index de perf | `idx_crm_contacts_user_id` | ??? | À créer si absent |

---

**Date:** 18 octobre 2025  
**Status:** 🔴 À diagnostiquer  
**Priorité:** HAUTE

Exécutez les diagnostics et revenus avec les résultats!

