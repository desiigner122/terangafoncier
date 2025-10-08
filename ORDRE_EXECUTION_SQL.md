# ⚡ ORDRE D'EXÉCUTION SQL - IMPORTANT !

## 🚨 LISEZ CECI EN PREMIER

**Pour éviter l'erreur "column does not exist", suivez CET ORDRE :**

---

## 📋 ORDRE CORRECT (3 étapes)

### 1️⃣ ÉTAPE 1 : Vérifier les extensions (1 min)

```sql
-- Copier/coller dans Supabase SQL Editor :

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Cliquer RUN
```

✅ **Résultat attendu :** `Query completed successfully`

---

### 2️⃣ ÉTAPE 2 : Créer les tables principales (5 min)

```bash
# Ouvrir : supabase-migrations/SCRIPT_COMPLET_UNIQUE.sql
# Copier TOUT le contenu (Ctrl+A, Ctrl+C)
# Coller dans Supabase SQL Editor
# Cliquer RUN
# Attendre 10-15 secondes
```

✅ **Résultat attendu :**
```
TABLES CRÉÉES: 2
- properties
- property_photos

COLONNES PROPERTIES: ~60
INDEX CRÉÉS: 16
TRIGGERS CRÉÉS: 4
POLITIQUES RLS: 10

✅ CONFIGURATION TERMINÉE !
```

---

### 3️⃣ ÉTAPE 3 : Créer les tables complémentaires (3 min)

```bash
# Ouvrir : supabase-migrations/TABLES_COMPLEMENTAIRES.sql
# Copier TOUT le contenu (Ctrl+A, Ctrl+C)
# Coller dans Supabase SQL Editor
# Cliquer RUN
# Attendre 5-10 secondes
```

✅ **Résultat attendu :**
```
TABLES COMPLÉMENTAIRES CRÉÉES: 3
- subscriptions
- notifications
- messages

POLITIQUES RLS CRÉÉES: 12

✅ Contrainte notifications.related_property_id ajoutée
✅ Contrainte messages.property_id ajoutée

✅ TABLES COMPLÉMENTAIRES CRÉÉES !
```

---

## ❌ ORDRE INCORRECT (À NE PAS FAIRE)

```
❌ TABLES_COMPLEMENTAIRES.sql EN PREMIER
   ↓
   Erreur : column "related_property_id" does not exist
   ↓
   ÉCHEC
```

---

## ✅ ORDRE CORRECT (À FAIRE)

```
1. Extensions (uuid-ossp, postgis, pg_trgm)
   ↓
2. SCRIPT_COMPLET_UNIQUE.sql (properties + property_photos)
   ↓
3. TABLES_COMPLEMENTAIRES.sql (subscriptions + notifications + messages)
   ↓
   SUCCÈS ✅
```

---

## 🔍 VÉRIFICATION RAPIDE

Après chaque étape, vérifier dans **Table Editor** :

**Après ÉTAPE 2 :**
```
□ properties (visible dans la liste)
□ property_photos (visible dans la liste)
```

**Après ÉTAPE 3 :**
```
□ subscriptions (visible dans la liste)
□ notifications (visible dans la liste)
□ messages (visible dans la liste)
```

---

## 🆘 EN CAS D'ERREUR

### Erreur : "extension does not exist"
➡️ **Solution :** Exécuter l'ÉTAPE 1 d'abord

### Erreur : "table already exists"
➡️ **Solution :** Déjà exécuté, pas grave, continuer

### Erreur : "column does not exist"
➡️ **Solution :** Vous avez sauté l'ÉTAPE 2, recommencez dans l'ordre

### Erreur : "bucket does not exist"
➡️ **Solution :** Normal, les buckets se créent manuellement après (voir DEMARRAGE_RAPIDE.md)

---

## 📊 RÉCAPITULATIF

| Étape | Fichier | Temps | Tables créées |
|-------|---------|-------|---------------|
| 1 | Extensions | 1 min | 0 |
| 2 | SCRIPT_COMPLET_UNIQUE.sql | 5 min | 2 (properties, property_photos) |
| 3 | TABLES_COMPLEMENTAIRES.sql | 3 min | 3 (subscriptions, notifications, messages) |
| **TOTAL** | | **9 min** | **5 tables** |

---

## 🎯 APRÈS L'EXÉCUTION

Une fois les 3 étapes terminées :

1. ✅ 5 tables créées
2. ✅ 16 indexes optimisés
3. ✅ 4 triggers automatiques
4. ✅ 22 politiques RLS
5. ✅ Prêt pour création des buckets Storage
6. ✅ Prêt pour tester l'application

**➡️ Prochaine étape : Créer les buckets Storage (voir DEMARRAGE_RAPIDE.md ÉTAPE 2)**

---

**🔥 Suivez cet ordre et tout fonctionnera ! 💪**

*Si vous avez déjà l'erreur, consultez : CORRECTION_ERREUR_RELATED_PROPERTY_ID.md*
