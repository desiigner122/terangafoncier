# 🚀 GUIDE D'INSTALLATION SQL - VERSION CORRIGÉE

**Date**: 2025-10-07  
**Fichiers**: 5 scripts SQL à exécuter dans l'ordre

---

## ⚠️ ERREURS CORRIGÉES

### Erreur 1 : `column "vendor_id" does not exist`
**Cause**: Une ancienne table `conversations` existe sans la colonne `vendor_id`  
**Solution**: Supprimer les anciennes tables avant réinstallation

### Erreur 2 : `syntax error at "\"` (ligne 523)
**Cause**: Échappement incorrect des apostrophes dans le JSON  
**Solution**: ✅ Corrigé - utilisation de `''` au lieu de `\'`

### Erreur 3 : `relation "prospects" does not exist`
**Cause**: Référence à une table inexistante  
**Solution**: Script de création ajouté (optionnel)

---

## 📋 ORDRE D'EXÉCUTION (IMPORTANT!)

### Étape 0 : Nettoyage (RECOMMANDÉ) ⚠️
**Fichier**: `sql/00-cleanup-old-tables.sql`

**⚠️ ATTENTION**: Supprime TOUTES les données dans ces tables :
- support_tickets, support_responses, support_categories
- conversations, messages, message_reactions
- digital_services, service_subscriptions, service_usage, service_invoices
- prospects (si existe)

```sql
-- Ouvrir Supabase Dashboard → SQL Editor
-- Copier/coller TOUT le contenu de 00-cleanup-old-tables.sql
-- Cliquer "Run"
-- Vérifier résultat : "remaining_tables" doit être 0
```

---

### Étape 1 : Table Prospects (OPTIONNEL)
**Fichier**: `sql/fix-missing-prospects-table.sql`

**Si vous avez l'erreur "prospects does not exist"**, exécuter ce script :

```sql
-- Supabase Dashboard → SQL Editor
-- Copier/coller fix-missing-prospects-table.sql
-- Run
```

**Sinon**, passer directement à l'étape 2.

---

### Étape 2 : Support & Tickets ✅
**Fichier**: `sql/create-support-tables.sql`

```sql
-- Supabase Dashboard → SQL Editor
-- Copier/coller create-support-tables.sql
-- Run
```

**Résultat attendu**:
- 3 tables créées : `support_tickets`, `support_responses`, `support_categories`
- 6 catégories pré-remplies
- 2 vues créées
- 3 fonctions créées

**Vérification**:
```sql
SELECT COUNT(*) FROM support_categories;
-- Doit retourner : 6
```

---

### Étape 3 : Messagerie Temps Réel ✅
**Fichier**: `sql/create-messaging-tables.sql`

```sql
-- Supabase Dashboard → SQL Editor
-- Copier/coller create-messaging-tables.sql
-- Run
```

**Résultat attendu**:
- 4 tables créées : `conversations`, `messages`, `message_reactions`, `conversation_participants`
- 3 vues créées
- 5 fonctions créées
- Triggers automatiques configurés

**Vérification**:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('conversations', 'messages');
-- Doit retourner 2 lignes
```

---

### Étape 4 : Services Digitaux ✅
**Fichier**: `sql/create-digital-services-tables.sql`

```sql
-- Supabase Dashboard → SQL Editor
-- Copier/coller create-digital-services-tables.sql
-- Run
```

**Résultat attendu**:
- 4 tables créées : `digital_services`, `service_subscriptions`, `service_usage`, `service_invoices`
- 6 services pré-remplis (Signature, Visite 360°, OCR, Stockage, Marketing, Juridique)
- 2 vues créées
- 3 fonctions créées

**Vérification**:
```sql
SELECT name, category, is_active FROM digital_services;
-- Doit retourner 6 services
```

---

## ✅ VÉRIFICATION FINALE

### Test Global
```sql
-- Compter TOUTES les tables créées
SELECT COUNT(*) AS total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'support_tickets', 'support_responses', 'support_categories',
    'conversations', 'messages', 'message_reactions', 'conversation_participants',
    'digital_services', 'service_subscriptions', 'service_usage', 'service_invoices'
  );
-- Doit retourner : 11
```

### Test Données Initiales
```sql
-- Vérifier données pré-remplies
SELECT 
  (SELECT COUNT(*) FROM support_categories) AS categories,
  (SELECT COUNT(*) FROM digital_services) AS services;
-- Doit retourner : categories=6, services=6
```

### Test RLS (Row Level Security)
```sql
-- Vérifier que RLS est activé
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename LIKE '%support%' OR tablename LIKE '%conversation%' OR tablename LIKE '%service%';
-- Toutes les tables doivent avoir rowsecurity = true
```

---

## 🧪 TESTER DANS L'APPLICATION

### 1. Support & Tickets
```bash
# Naviguer vers /vendeur/support
# Créer un ticket test
# Vérifier sauvegarde dans Supabase
```

### 2. Messagerie
```bash
# Naviguer vers /vendeur/messages
# Vérifier plus de mock data
# Liste devrait être vide (correct)
```

### 3. Services Digitaux
```bash
# Naviguer vers /vendeur/services
# Vérifier 6 services affichés
# Chaque service doit avoir 2-3 plans tarifaires
```

---

## 🚨 DÉPANNAGE

### Erreur : "relation already exists"
**Solution**: Exécuter d'abord `00-cleanup-old-tables.sql`

### Erreur : "function already exists"
**Solution**: Le script cleanup les supprime. Ré-exécuter cleanup puis recommencer.

### Erreur : "permission denied"
**Solution**: Vérifier que vous êtes connecté comme propriétaire du projet Supabase

### Erreur : "syntax error"
**Solution**: Vérifier que vous avez copié TOUT le contenu du fichier SQL (pas de coupure)

### Tables créées mais vides
**Solution**: Les données initiales sont insérées automatiquement. Vérifier avec :
```sql
SELECT * FROM support_categories;
SELECT * FROM digital_services;
```

---

## 📊 RÉSUMÉ

### Tables Créées : 11
- Support : 3 tables
- Messagerie : 4 tables
- Services : 4 tables

### Données Initiales : 12 lignes
- 6 catégories support
- 6 services digitaux

### Fonctions : 11
- 3 support
- 5 messagerie
- 3 services

### Vues : 7
- 2 support
- 3 messagerie
- 2 services

### Triggers : 8
- Automatic timestamps
- Unread counters
- Usage tracking
- First response tracking

---

## 🎯 PROCHAINES ÉTAPES

Une fois tous les scripts exécutés :

1. ✅ Tester les 3 pages :
   - `/vendeur/support`
   - `/vendeur/messages`
   - `/vendeur/services`

2. ✅ Vérifier console browser (F12) - plus d'erreurs

3. ✅ Tester edit-property debug logs

4. 📧 Me confirmer : "SQL OK" ou envoyer erreurs

---

**Status**: ✅ Scripts corrigés et prêts  
**Temps d'installation**: 15-20 minutes  
**Dernière mise à jour**: 2025-10-07
