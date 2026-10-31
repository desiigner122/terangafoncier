# 🔧 GUIDE DE DÉPANNAGE - DÉPLOIEMENT SQL

## ❌ Erreur Rencontrée

```
ERROR: 42703: column "user_id" does not exist
```

## ✅ Solution Appliquée

Un **nouveau fichier SQL corrigé** a été créé : `schema-production-fixed.sql`

### Corrections apportées :

1. **DROP avant CREATE** : Tous les indexes, triggers et policies sont supprimés avant d'être recréés
2. **Gestion des conflits** : Les données initiales utilisent `ON CONFLICT DO UPDATE`
3. **Ordre d'exécution** : Les étapes sont clairement numérotées
4. **Messages de confirmation** : Le script affiche un résumé à la fin

---

## 🚀 COMMENT UTILISER LE FICHIER CORRIGÉ

### Étape 1 : Ouvrir Supabase Dashboard

```
https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns
```

### Étape 2 : SQL Editor

- Cliquez sur **"SQL Editor"** dans le menu de gauche
- Cliquez sur **"New Query"**

### Étape 3 : Copier le Nouveau Schema

- Ouvrez le fichier : **`supabase/schema-production-fixed.sql`**
- Sélectionnez TOUT (Ctrl+A)
- Copiez (Ctrl+C)

### Étape 4 : Exécuter

- Collez dans l'éditeur SQL de Supabase
- Cliquez sur **"Run"** (ou Ctrl+Enter)
- Attendez le message de succès (~30-60 secondes)

---

## ✅ CE QUE LE SCRIPT VA FAIRE

### Phase 1 : Nettoyage (sécurisé)
```sql
DROP INDEX IF EXISTS ...
DROP TRIGGER IF EXISTS ...
DROP POLICY IF EXISTS ...
```
→ Supprime les éléments existants sans erreur

### Phase 2 : Création des Tables
```sql
CREATE TABLE IF NOT EXISTS ...
```
→ 15 tables créées ou mises à jour

### Phase 3 : Création des Indexes
```sql
CREATE INDEX idx_...
```
→ 28 indexes pour optimiser les performances

### Phase 4 : Row Level Security
```sql
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
CREATE POLICY ...
```
→ Sécurisation de toutes les tables

### Phase 5 : Triggers Automatiques
```sql
CREATE TRIGGER update_..._updated_at
```
→ Mise à jour automatique des timestamps

### Phase 6 : Données Initiales
```sql
INSERT INTO subscription_plans ... ON CONFLICT DO UPDATE
```
→ 4 plans d'abonnement (Free, Basic, Pro, Enterprise)

---

## 📊 RÉSULTAT ATTENDU

À la fin de l'exécution, vous devriez voir :

```
✓ Schema TerangaFoncier déployé avec succès !
✓ 15 tables créées
✓ 28 indexes créés
✓ RLS activé sur toutes les tables
✓ Triggers updated_at configurés
✓ 4 plans d'abonnement initialisés

🎯 Prochaines étapes:
   1. Créer le bucket Storage: terrain-photos (public)
   2. Configurer les variables d'environnement
   3. Tester avec: node scripts/verify-deployment.js
```

---

## 🔍 VÉRIFICATION POST-DÉPLOIEMENT

Une fois le script exécuté, vérifiez :

### Dans Supabase Dashboard

1. **Table Editor** (menu gauche)
   - Vous devriez voir 15 tables
   - Cliquez sur chaque table pour voir la structure

2. **Database** > **Tables**
   - Vérifiez que toutes les tables sont listées

### Via Script de Vérification

```powershell
node scripts/verify-deployment.js
```

**Résultat attendu :**
```
✓ profiles                          OK
✓ terrains                          OK
✓ terrain_photos                    OK
✓ offres                            OK
✓ blockchain_transactions           OK
✓ notaire_actes                     OK
✓ notaire_support_tickets           OK
✓ notifications                     OK
✓ subscription_plans                OK
✓ user_subscriptions                OK
✓ elearning_courses                 OK
✓ course_enrollments                OK
✓ video_meetings                    OK
✓ marketplace_products              OK
✓ user_purchases                    OK

══════════════════════════════════════════════
✓ Tables créées: 15/15
✗ Tables manquantes: 0/15
══════════════════════════════════════════════

✓ DÉPLOIEMENT RÉUSSI - BASE DE DONNÉES COMPLÈTE
```

---

## ⚠️ ERREURS POSSIBLES ET SOLUTIONS

### Erreur : "permission denied for schema public"

**Cause :** Problème de permissions  
**Solution :** 
1. Vérifiez que vous êtes connecté avec le bon compte Supabase
2. Assurez-vous d'avoir les droits d'administration du projet

---

### Erreur : "relation already exists"

**Cause :** Tables déjà créées  
**Solution :** C'est normal ! Le script utilise `CREATE TABLE IF NOT EXISTS`, donc il ne recrée pas les tables existantes. Pas d'action nécessaire.

---

### Erreur : "function auth.uid() does not exist"

**Cause :** Le schema auth n'est pas initialisé  
**Solution :**
1. Allez dans Authentication > Settings
2. Activez "Email Auth" si ce n'est pas déjà fait
3. Relancez le script

---

### Erreur : "could not serialize access"

**Cause :** Conflit de transactions simultanées  
**Solution :** Attendez 30 secondes et réexécutez le script

---

## 📦 ÉTAPE SUIVANTE : CRÉER LE BUCKET STORAGE

Une fois le schema déployé avec succès :

### Dans Supabase Dashboard :

1. Cliquez sur **"Storage"** (menu gauche)
2. Cliquez sur **"Create a new bucket"**
3. Configurez :
   - **Name:** `terrain-photos`
   - **Public bucket:** ✅ **Coché (OUI)**
   - **File size limit:** 5 MB (ou plus selon besoin)
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp`
4. Cliquez sur **"Create bucket"**

---

## ✅ VALIDATION COMPLÈTE

Une fois le schema ET le bucket créés :

```powershell
# Vérification complète
node scripts/verify-deployment.js

# Si tout est OK (15/15 tables + bucket), continuez avec :
.\scripts\build-production.ps1
```

---

## 🆘 BESOIN D'AIDE ?

### Logs Détaillés

Si vous avez une erreur, copiez le message complet et relancez avec :

```sql
-- Activer les logs détaillés
SET client_min_messages TO DEBUG;
-- Puis exécutez le script
```

### Vérifier les Tables Existantes

```sql
-- Lister toutes les tables dans public
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Vérifier les Indexes

```sql
-- Lister tous les indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## 📝 NOTES IMPORTANTES

1. **Le script est idempotent** : Il peut être exécuté plusieurs fois sans problème
2. **Les données existantes sont préservées** : Seuls les plans d'abonnement sont mis à jour
3. **RLS est activé** : Sécurité maximale dès le déploiement
4. **Performances optimisées** : 28 indexes créés automatiquement

---

**🎯 Objectif : Base de données production-ready en 5 minutes !**

Une fois le schema déployé, vous êtes prêt pour le build et le déploiement frontend ! 🚀
