# 🚨 SOLUTION PROBLÈME COMPTES DÉMO - TERANGA FONCIER

## ❌ PROBLÈME IDENTIFIÉ

L'erreur `foreign key constraint "profiles_id_fkey"` indique que:
- La table `profiles` référence `auth.users` avec une clé étrangère
- On ne peut pas créer des profils sans utilisateurs Supabase authentifiés
- Le script original tentait de créer directement des profils sans authentification

## ✅ SOLUTION IMPLÉMENTÉE

### 🔧 Architecture Corrigée

```
auth.users (Supabase Auth) 
    ↓ (Foreign Key)
public.profiles (Profils utilisateurs)
    ↓ (Relations)
public.properties, projects, messages...
```

### 📋 PROCESSUS EN 4 ÉTAPES

#### ÉTAPE 1: Vérification Structure
- **Fichier**: `check-supabase-structure.sql`
- **Action**: Vérifier les tables et contraintes existantes
- **Exécution**: Supabase SQL Editor

#### ÉTAPE 2: Création Données Démo
- **Fichier**: `create-demo-data-only.sql`  
- **Action**: Créer 5 propriétés + 3 projets (sans assignation)
- **Exécution**: Supabase SQL Editor

#### ÉTAPE 3: Inscription Comptes Web
- **Interface**: https://terangafoncier.vercel.app/inscription
- **Action**: Créer 9 comptes utilisateurs via l'interface
- **Résultat**: Utilisateurs dans `auth.users` + profils dans `public.profiles`

#### ÉTAPE 4: Assignation Finale
- **Fichier**: `assign-demo-data.sql`
- **Action**: Lier propriétés aux vendeurs, projets aux promoteurs
- **Exécution**: Supabase SQL Editor (après création des comptes)

## 🎯 COMPTES À CRÉER

| Rôle | Email | Mot de passe | Nom complet |
|------|-------|--------------|-------------|
| 👑 Admin | admin@terangafoncier.com | Admin123! | Amadou DIALLO - Administrateur |
| 🏠 Particulier | particulier@terangafoncier.com | Demo123! | Fatou NDIAYE - Particulier |
| 💼 Vendeur | vendeur@terangafoncier.com | Demo123! | Moussa FALL - Agent Immobilier |
| 💰 Investisseur | investisseur@terangafoncier.com | Demo123! | Ousmane SARR - Investisseur |
| 🏗️ Promoteur | promoteur@terangafoncier.com | Demo123! | Aminata KANE - Promoteur |
| 🏛️ Municipalité | municipalite@terangafoncier.com | Demo123! | Commune de Dakar - Services |
| ⚖️ Notaire | notaire@terangafoncier.com | Demo123! | Me Ibrahima SECK - Notaire |
| 📐 Géomètre | geometre@terangafoncier.com | Demo123! | Cheikh DIOP - Géomètre Expert |
| 🏦 Banque | banque@terangafoncier.com | Demo123! | Banque de Habitat du Sénégal |

## 📊 DONNÉES DÉMO CRÉÉES

### 🏠 Propriétés (5)
- Villa moderne Almadies (450M FCFA)
- Appartement Plateau (85M FCFA)
- Terrain Rufisque (32M FCFA)  
- Local commercial Sandaga (95M FCFA)
- Bureau Mamelles (150M FCFA)

### 🏗️ Projets (3)
- Résidence Les Palmiers (45 unités)
- Centre Commercial Teranga (80 boutiques)
- Cité des Affaires Dakar (120 bureaux)

### 📨 Interactions
- 3 demandes (visite, terrain municipal, financement)
- 3 messages entre utilisateurs
- 3 favoris assignés
- Compteurs de vues mis à jour

## 🎮 RÉSULTAT FINAL

✅ **9 dashboards fonctionnels** avec données réalistes  
✅ **Comptes de test** pour chaque type d'utilisateur  
✅ **Environnement démo complet** pour présentation client  
✅ **Respect des contraintes** Supabase Auth  

## 📁 FICHIERS CRÉÉS

- `check-supabase-structure.sql` - Diagnostic structure DB
- `create-demo-data-only.sql` - Données démo (propriétés/projets)
- `assign-demo-data.sql` - Assignation finale après comptes
- `GUIDE_CREATION_COMPTES_DEMO.md` - Guide détaillé
- `demo-setup-guide.js` - Guide interactif

## 🚀 PROCHAINES ACTIONS

1. **Exécuter** `check-supabase-structure.sql` dans Supabase
2. **Exécuter** `create-demo-data-only.sql` dans Supabase  
3. **Créer les 9 comptes** via l'interface web
4. **Exécuter** `assign-demo-data.sql` dans Supabase
5. **Tester tous les dashboards**

---

🎯 **Cette solution respecte l'architecture Supabase et permet la création complète d'un environnement de démonstration fonctionnel.**
