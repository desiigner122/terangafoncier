# ⚡ MIGRATIONS SQL À EXÉCUTER IMMÉDIATEMENT

## 🎯 Objectif
Corriger le système de messagerie et activer l'affichage des négociations avec les nouvelles modifications du code frontend.

---

## 📋 Instructions d'exécution

### 1. Ouvrir Supabase SQL Editor
1. Aller sur https://supabase.com
2. Sélectionner votre projet
3. Cliquer sur "SQL Editor" dans le menu de gauche

### 2. Exécuter les migrations dans l'ordre

#### ✅ Migration 1: FIX_CONVERSATION_MESSAGES_STRUCTURE.sql ⚠️ IMPORTANT
**Fichier:** `sql/FIX_CONVERSATION_MESSAGES_STRUCTURE.sql`

**Pourquoi:** 
- Corrige la structure existante de `conversation_messages` dans Supabase
- Ajoute les colonnes manquantes: `content`, `is_read`, `read_at`
- Supprime les colonnes obsolètes: `message_count`
- Copie les données de `message` vers `content` si nécessaire
- Force le rechargement du schema cache de PostgREST

**Action:**
```bash
⚠️ EXÉCUTER CECI EN PREMIER - Corrige les erreurs PGRST204
Copier tout le contenu du fichier et l'exécuter dans SQL Editor
```

#### ✅ Migration 2: CREATE_NEGOTIATIONS_TABLE.sql
**Fichier:** `sql/CREATE_NEGOTIATIONS_TABLE.sql`

**Pourquoi:**
- Permet de tracker les négociations avec contre-offres
- Stocke original_price, proposed_price, status
- Lié aux requests et conversations
- RLS configuré pour vendors et buyers

**Action:**
```bash
Copier tout le contenu du fichier et l'exécuter dans SQL Editor
```

#### ✅ Migration 3: storage_documents_policies_fix.sql (optionnel mais recommandé)
**Fichier:** `sql/storage_documents_policies_fix.sql`

**Pourquoi:**
- Corrige les politiques RLS pour l'upload de documents
- Format de path: userId/caseId/filename
- Permet aux vendeurs/acheteurs d'accéder à leurs documents

**Action:**
```bash
Copier tout le contenu du fichier et l'exécuter dans SQL Editor
```

---

## 🔄 Vérification après exécution

### Test 1: Vérifier que les tables existent
```sql
-- Doit retourner 2 lignes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('conversation_messages', 'negotiations');
```

### Test 2: Vérifier les politiques RLS
```sql
-- Doit afficher les politiques pour conversation_messages
SELECT * FROM pg_policies 
WHERE tablename = 'conversation_messages';

-- Doit afficher les politiques pour negotiations
SELECT * FROM pg_policies 
WHERE tablename = 'negotiations';
```

---

## 📊 Changements dans le code frontend (déjà appliqués)

### VendeurMessagesModern.jsx
- ✅ `loadMessages()`: Utilise `conversation_messages` avec transformation content→message
- ✅ `sendMessage()`: Insère dans `conversation_messages` avec persistance en base
- ✅ Suppression du stockage en local state uniquement

### VendeurPurchaseRequests.jsx
- ✅ Badge "💬 Négociation en cours" quand `request.negotiation.status === 'pending'`
- ✅ Affichage du prix original barré + contre-offre en orange
- ✅ Toast success après création de négociation avec le montant
- ✅ Chargement automatique des données de négociation dans `loadRequests()`
- ✅ **NOUVEAU:** Filtre tab "Négociations" corrigé pour afficher les demandes avec `negotiation.status === 'pending'`

---

## ❗ Erreurs qui seront corrigées

### Avant les migrations:
```
❌ {"code":"42703","message":"column \"message_count\" does not exist"}
❌ {"code":"PGRST204","message":"Could not find the 'content' column of 'messages'"}
❌ {"code":"PGRST204","message":"Could not find the 'is_read' column of 'conversation_messages'"}
❌ {"code":"42501","message":"new row violates row-level security policy"}
❌ {"code":"23502","message":"null value in column 'original_price' violates not-null constraint"}
```

### Après les migrations:
```
✅ Messages persistés dans conversation_messages avec colonnes correctes
✅ Schema cache rechargé (plus d'erreurs PGRST204)
✅ Négociations enregistrées avec prix original et contre-offre
✅ Affichage des statuts de négociation dans l'UI
✅ Prix affichés avec comparaison original/contre-offre
✅ Tab "Négociations" filtre correctement les demandes en cours
```

---

## 🧪 Test manuel après migration

1. **Test messagerie:**
   - Ouvrir le dashboard vendeur
   - Aller dans Messages
   - Sélectionner une conversation
   - Envoyer un message
   - ✅ Le message doit apparaître instantanément
   - ✅ Recharger la page → le message doit toujours être là

2. **Test négociation:**
   - Ouvrir Demandes d'achat
   - Cliquer "Négocier" sur une demande pending
   - Entrer un nouveau prix (différent de l'original)
   - Soumettre
   - ✅ Toast success avec le montant
   - ✅ Badge "💬 Négociation en cours" apparaît
   - ✅ Prix affiché: original barré + contre-offre en orange
   - ✅ **Cliquer sur l'onglet "Négociations"**
   - ✅ La demande doit apparaître dans cet onglet avec le badge orange

3. **Test persistance:**
   - Recharger la page dashboard
   - ✅ Les messages doivent toujours être visibles
   - ✅ Le badge de négociation doit toujours être là
   - ✅ Les prix doivent toujours afficher original vs contre-offre

---

## 📞 Support

Si erreur après migration:
1. Vérifier les logs dans Supabase SQL Editor
2. Vérifier que les 3 fichiers SQL ont bien été exécutés
3. Vérifier la console browser (F12) pour les erreurs fetch
4. Vérifier que l'utilisateur connecté a un rôle dans la table profiles

---

## ✅ Checklist finale

- [ ] FIX_CONVERSATION_MESSAGES_STRUCTURE.sql exécuté ⚠️ PRIORITAIRE
- [ ] CREATE_NEGOTIATIONS_TABLE.sql exécuté  
- [ ] storage_documents_policies_fix.sql exécuté (optionnel)
- [ ] Refresh de la page dashboard après migrations
- [ ] Test messagerie OK (messages persistent)
- [ ] Test négociation OK (badge + prix)
- [ ] Test onglet "Négociations" affiche les demandes en cours
- [ ] Aucune erreur PGRST204 dans la console browser

---

**Date:** 2025-01-XX  
**Statut:** ⏳ EN ATTENTE D'EXÉCUTION  
**Impact:** 🔴 CRITIQUE - Bloque messagerie et négociations
