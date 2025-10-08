# 🚨 GUIDE DE FIX URGENTE - TABLES MANQUANTES

## Problèmes Identifiés dans la Console

Les erreurs suivantes ont été détectées :

1. ❌ **`property_inquiries`** → Table manquante (demandes d'information)
2. ❌ **`purchase_requests`** → Table manquante (demandes d'achat)
3. ❌ **`crm_contacts`** → Structure incorrecte (colonne 'name' manquante)
4. ❌ **`profiles`** → Récursion infinie dans les RLS policies

## Solution : 1 Script SQL

### 📁 Fichier : `sql/FIX_MISSING_TABLES.sql`

Ce script corrige TOUT en une seule exécution :
- ✅ Corrige la récursion RLS sur `profiles`
- ✅ Crée la table `property_inquiries` (demandes info)
- ✅ Crée la table `purchase_requests` (demandes achat)
- ✅ Recrée `crm_contacts` avec la bonne structure
- ✅ Configure tous les indexes et RLS policies

## 🚀 EXÉCUTION (2 minutes)

### Étape 1 : Aller sur Supabase
```
https://supabase.com/dashboard/project/ndenqikcogzrkrjnlvns/editor
```

### Étape 2 : SQL Editor
1. Cliquer sur **"SQL Editor"** (menu gauche)
2. Cliquer sur **"New Query"**

### Étape 3 : Copier/Coller le Script
1. Ouvrir le fichier **`sql/FIX_MISSING_TABLES.sql`**
2. **Tout sélectionner** (CTRL+A)
3. **Copier** (CTRL+C)
4. **Coller** dans Supabase SQL Editor (CTRL+V)

### Étape 4 : Exécuter
1. Cliquer sur **"Run"** (ou F5)
2. Attendre ~5 secondes
3. Vérifier le message de succès

### Étape 5 : Vérification
Vous devriez voir :
```
status: "Fix completed!"
property_inquiries_exists: 1
purchase_requests_exists: 1
crm_contacts_exists: 1
profiles_policies_count: 3
```

## 🧪 TESTS POST-FIX

### Test 1 : Rafraîchir l'Application
```
Dans votre navigateur : CTRL + F5 (hard refresh)
```

### Test 2 : Console DevTools (F12)
Les erreurs suivantes doivent avoir **DISPARU** :
- ❌ `Could not find the table 'public.property_inquiries'`
- ❌ `Could not find the table 'public.purchase_requests'`
- ❌ `Could not find the 'name' column of 'crm_contacts'`
- ❌ `infinite recursion detected in policy for relation "profiles"`

### Test 3 : Tester le CRM
1. Aller sur **Dashboard Vendeur** → **CRM**
2. Cliquer sur **"Ajouter Prospect"**
3. Remplir : Nom, Email, Téléphone, Notes
4. Cliquer **"Ajouter"**
5. ✅ Le prospect doit apparaître dans la liste (plus d'erreur `name` column)

### Test 4 : Tester les Demandes
1. Aller sur **Dashboard Vendeur** → **Propriétés**
2. Les badges de demandes doivent fonctionner
3. Plus d'erreurs `property_inquiries` ou `purchase_requests`

## 📊 TABLES CRÉÉES

### 1. `property_inquiries` - Demandes d'Information
```sql
Colonnes principales :
- property_id (UUID) - Propriété concernée
- vendor_id (UUID) - Vendeur propriétaire
- buyer_id (UUID) - Acheteur demandeur
- buyer_name (VARCHAR) - Nom acheteur
- buyer_email (VARCHAR) - Email
- message (TEXT) - Message
- status (VARCHAR) - pending, replied, closed
```

### 2. `purchase_requests` - Demandes d'Achat
```sql
Colonnes principales :
- property_id (UUID) - Propriété
- vendor_id (UUID) - Vendeur
- buyer_id (UUID) - Acheteur
- request_type (VARCHAR) - purchase, rent, visit, info
- status (VARCHAR) - pending, accepted, rejected, etc.
- offer_price (DECIMAL) - Prix proposé
- financing_type (VARCHAR) - cash, mortgage, etc.
```

### 3. `crm_contacts` - Contacts CRM
```sql
Colonnes principales :
- vendor_id (UUID) - Vendeur propriétaire
- name (VARCHAR) ✅ CORRIGÉ - Nom du contact
- email (VARCHAR) - Email
- phone (VARCHAR) - Téléphone
- status (VARCHAR) - new, contacted, qualified, etc.
- score (INTEGER) - Score de 0 à 100
- notes (TEXT) - Notes
```

### 4. `profiles` - Policies RLS
```sql
✅ CORRIGÉ :
- profiles_select_own (SELECT own profile)
- profiles_update_own (UPDATE own profile)
- profiles_insert_own (INSERT own profile)
Plus de récursion infinie!
```

## 🎯 RÉSULTAT ATTENDU

Après l'exécution du script et le refresh :

| Fonctionnalité | Avant | Après |
|---|---|---|
| CRM - Ajouter Prospect | ❌ Erreur `name` column | ✅ Fonctionne |
| Demandes d'Info | ❌ Table manquante | ✅ Fonctionne |
| Demandes d'Achat | ❌ Table manquante | ✅ Fonctionne |
| Profils Utilisateurs | ❌ Récursion infinie | ✅ Fonctionne |
| Console Erreurs | 🔴 10+ erreurs | 🟢 0 erreurs |

## 🔄 SI PROBLÈME PERSISTE

### Option 1 : Vérifier l'Exécution
```sql
-- Exécuter cette requête dans SQL Editor
SELECT 
  table_name, 
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('property_inquiries', 'purchase_requests', 'crm_contacts')
ORDER BY table_name;
```

Résultat attendu :
- `property_inquiries` → 18 colonnes
- `purchase_requests` → 20 colonnes
- `crm_contacts` → 17 colonnes

### Option 2 : Vérifier les Policies
```sql
-- Exécuter cette requête
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('profiles', 'property_inquiries', 'purchase_requests', 'crm_contacts')
ORDER BY tablename, policyname;
```

Vous devriez voir 12-15 policies au total.

### Option 3 : Clear Cache Navigateur
1. **Chrome/Edge** : CTRL+SHIFT+DEL → Cocher "Cached images and files" → Clear
2. **Firefox** : CTRL+SHIFT+DEL → Cocher "Cache" → Clear Now
3. Rafraîchir : CTRL+F5

## 📞 SUPPORT

Si les erreurs persistent après :
1. ✅ Exécution du script SQL
2. ✅ Refresh navigateur (CTRL+F5)
3. ✅ Clear cache
4. ✅ Vérification tables créées

Alors fournir :
- Screenshot de la console (F12)
- Screenshot du résultat de la requête de vérification
- Message d'erreur exact

## 🎉 PROCHAINE ÉTAPE

Une fois ces erreurs corrigées, nous pourrons :
1. ✅ Tester toutes les fonctionnalités du dashboard vendeur
2. ✅ Passer au dashboard admin
3. ✅ Vérifier le workflow d'approbation des propriétés

**Temps estimé : 5 minutes pour tout corriger** 🚀
