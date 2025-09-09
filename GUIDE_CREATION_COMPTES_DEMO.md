# 🎭 GUIDE CRÉATION COMPTES DÉMO - TERANGA FONCIER
================================================

## 📋 PROCESSUS EN 3 ÉTAPES

### ÉTAPE 1: Créer les données démo (SQL)
```sql
-- Exécuter dans Supabase SQL Editor
-- Fichier: create-demo-data-only.sql
```

### ÉTAPE 2: Inscription des comptes utilisateurs (Interface Web)

Aller sur: **https://terangafoncier.vercel.app/inscription**

#### 🔑 COMPTES À CRÉER:

| Role | Email | Mot de passe | Nom complet |
|------|-------|--------------|-------------|
| 👑 admin | admin@terangafoncier.com | Admin123! | Amadou DIALLO - Administrateur |
| 🏠 particular | particulier@terangafoncier.com | Demo123! | Fatou NDIAYE - Particulier |
| 💼 vendeur | vendeur@terangafoncier.com | Demo123! | Moussa FALL - Agent Immobilier |
| 💰 investisseur | investisseur@terangafoncier.com | Demo123! | Ousmane SARR - Investisseur |
| 🏗️ promoteur | promoteur@terangafoncier.com | Demo123! | Aminata KANE - Promoteur |
| 🏛️ municipalite | municipalite@terangafoncier.com | Demo123! | Commune de Dakar - Services Fonciers |
| ⚖️ notaire | notaire@terangafoncier.com | Demo123! | Me Ibrahima SECK - Notaire |
| 📐 geometre | geometre@terangafoncier.com | Demo123! | Cheikh DIOP - Géomètre Expert |
| 🏦 banque | banque@terangafoncier.com | Demo123! | Banque de Habitat du Sénégal |

### ÉTAPE 3: Assignation des propriétés et projets

Après création des comptes, exécuter le script d'assignation pour lier les propriétés aux bons utilisateurs.

## 🚀 PROCÉDURE D'INSCRIPTION

Pour chaque compte:

1. **Aller sur**: https://terangafoncier.vercel.app/inscription
2. **Remplir le formulaire**:
   - Email: (voir tableau ci-dessus)
   - Nom complet: (voir tableau ci-dessus)
   - Téléphone: +221 77 XXX XXXX
   - Ville: Dakar
   - Rôle: (sélectionner le bon rôle)
   - Mot de passe: (voir tableau ci-dessus)
3. **Confirmer l'inscription**
4. **Vérifier l'email** (si nécessaire)
5. **Passer au compte suivant**

## 📊 DONNÉES CRÉÉES

### 🏠 Propriétés (5):
- Villa moderne Almadies (450M FCFA)
- Appartement Plateau (85M FCFA)  
- Terrain Rufisque (32M FCFA)
- Local commercial Sandaga (95M FCFA)
- Bureau Mamelles (150M FCFA)

### 🏗️ Projets (3):
- Résidence Les Palmiers (45 unités)
- Centre Commercial Teranga (80 boutiques)
- Cité des Affaires Dakar (120 bureaux)

## ⚠️ IMPORTANT

- **Respecter exactement** les emails et mots de passe
- **Sélectionner le bon rôle** lors de l'inscription
- **Noter les IDs utilisateurs** créés pour l'assignation
- **Tester chaque dashboard** après création

## 🔄 PROCHAINE ÉTAPE

Après création de tous les comptes, exécuter le script d'assignation pour lier:
- Propriétés → Compte vendeur
- Projets → Compte promoteur
- Messages et demandes → Comptes respectifs

---
*Guide généré automatiquement - Teranga Foncier Demo Setup*
