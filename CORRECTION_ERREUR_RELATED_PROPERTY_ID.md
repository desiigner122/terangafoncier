# 🔧 RÉSOLUTION ERREUR : Column "related_property_id" does not exist

## ❌ ERREUR RENCONTRÉE

```
ERROR: 42703: column "related_property_id" does not exist
```

---

## 🔍 CAUSE

Cette erreur signifie que la table `properties` n'existe pas encore dans votre base de données. Le script `TABLES_COMPLEMENTAIRES.sql` essaie de créer des clés étrangères vers une table qui n'a pas encore été créée.

---

## ✅ SOLUTION : ORDRE D'EXÉCUTION

### IMPORTANT : Exécuter les scripts dans CET ORDRE

#### 1️⃣ **SCRIPT_COMPLET_UNIQUE.sql** (EN PREMIER)
```sql
-- Ce script crée :
-- ✅ Table properties
-- ✅ Table property_photos
-- ✅ Indexes
-- ✅ Triggers
-- ✅ RLS Policies

-- Dans Supabase SQL Editor :
-- 1. Copier TOUT le contenu de SCRIPT_COMPLET_UNIQUE.sql
-- 2. RUN
-- 3. Attendre "Query completed successfully"
```

#### 2️⃣ **TABLES_COMPLEMENTAIRES.sql** (EN SECOND)
```sql
-- Ce script crée :
-- ✅ Table subscriptions
-- ✅ Table notifications (avec FK vers properties)
-- ✅ Table messages (avec FK vers properties)

-- Dans Supabase SQL Editor :
-- 1. Copier TOUT le contenu de TABLES_COMPLEMENTAIRES.sql
-- 2. RUN
-- 3. Attendre "Query completed successfully"
```

---

## 🛠️ CORRECTION APPLIQUÉE

Le script `TABLES_COMPLEMENTAIRES.sql` a été corrigé pour :

### Version 1 (Ancienne - avec erreur)
```sql
-- ❌ Créait directement la contrainte (échouait si properties n'existe pas)
related_property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
```

### Version 2 (Nouvelle - corrigée)
```sql
-- ✅ Crée d'abord la colonne sans contrainte
related_property_id UUID,

-- ✅ Puis ajoute la contrainte SI la table properties existe
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_name = 'properties') THEN
        ALTER TABLE notifications 
        ADD CONSTRAINT notifications_related_property_id_fkey 
        FOREIGN KEY (related_property_id) REFERENCES properties(id);
    ELSE
        RAISE NOTICE '⚠️ Table properties non trouvée';
    END IF;
END $$;
```

---

## 🚀 PROCÉDURE COMPLÈTE

### Étape 1 : Vérifier l'état actuel
```sql
-- Exécuter dans Supabase SQL Editor
SELECT 
    table_name,
    CASE 
        WHEN table_name IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public')
        THEN '✅ Existe'
        ELSE '❌ Manquante'
    END as status
FROM (
    VALUES 
        ('properties'),
        ('property_photos'),
        ('subscriptions'),
        ('notifications'),
        ('messages')
) AS required_tables(table_name);
```

### Étape 2 : Nettoyer si nécessaire
```sql
-- SI vous avez déjà exécuté TABLES_COMPLEMENTAIRES.sql avec l'erreur :
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
```

### Étape 3 : Exécuter dans le bon ordre
```bash
# 1. SCRIPT_COMPLET_UNIQUE.sql
# 2. TABLES_COMPLEMENTAIRES.sql (version corrigée)
```

### Étape 4 : Vérification finale
```sql
-- Vérifier que toutes les tables existent
SELECT 
    'TABLES CRÉÉES' as info,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'property_photos', 'subscriptions', 'notifications', 'messages');

-- Résultat attendu : count = 5
```

---

## 📋 CHECKLIST DE VÉRIFICATION

Avant d'exécuter `TABLES_COMPLEMENTAIRES.sql`, vérifier que :

```
□ SCRIPT_COMPLET_UNIQUE.sql a été exécuté
□ Table properties existe (voir dans Table Editor)
□ Table property_photos existe (voir dans Table Editor)
□ Aucune erreur dans les logs Supabase
□ Extensions activées (uuid-ossp, postgis, pg_trgm)
```

---

## 🔄 SI L'ERREUR PERSISTE

### Option A : Ordre d'exécution incorrect
```sql
-- 1. Supprimer les tables partielles
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;

-- 2. Vérifier que properties existe
SELECT COUNT(*) FROM properties; -- Doit renvoyer un nombre, pas une erreur

-- 3. Re-exécuter TABLES_COMPLEMENTAIRES.sql
```

### Option B : Fichier non mis à jour
```bash
# Télécharger la dernière version corrigée
# Le fichier a été mis à jour avec la vérification IF EXISTS
```

---

## 📖 RESSOURCES

- **Documentation PostgreSQL** : [Foreign Key Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)
- **Documentation Supabase** : [Database Migrations](https://supabase.com/docs/guides/database/migrations)

---

## ✅ RÉSUMÉ

**Problème** : Clé étrangère vers une table qui n'existe pas encore  
**Cause** : Scripts exécutés dans le mauvais ordre  
**Solution** : Exécuter SCRIPT_COMPLET_UNIQUE.sql AVANT TABLES_COMPLEMENTAIRES.sql  
**Correction** : Script mis à jour avec vérification dynamique IF EXISTS  

---

**🔥 Script corrigé et prêt à l'emploi ! 💪**

*Si vous avez toujours l'erreur après avoir suivi ce guide, vérifiez les logs Supabase ou consultez CHECKLIST_MISE_EN_PRODUCTION.md*
