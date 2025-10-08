# 🧪 TEST DASHBOARD ADMIN - 2 MINUTES

## 🎯 Objectif

Vérifier ce qui fonctionne et ce qui manque dans le dashboard admin.

---

## 🔐 ÉTAPE 1 : Connexion Admin

### Option A : Si compte admin existe déjà
1. Se déconnecter (si connecté)
2. Aller sur `/login`
3. Se connecter avec email admin

### Option B : Si pas de compte admin
**Créer un admin via SQL Supabase** :

```sql
-- Trouver votre user_id
SELECT id, email, role FROM auth.users;

-- Mettre à jour vers admin (remplacer USER_ID)
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'VOTRE_USER_ID';
```

---

## 🏠 ÉTAPE 2 : Accéder Dashboard Admin

### Aller sur l'URL :
```
http://localhost:5173/admin/dashboard
```

### ✅ Ce que vous devriez voir :
- Sidebar gauche avec menu
- Header avec nom + avatar
- Contenu central (stats, graphiques, etc.)

### ❌ Si erreur :
- Screenshot de l'erreur
- Console (F12) → Copier messages d'erreur

---

## 📋 ÉTAPE 3 : Tester Chaque Onglet

### 1. **Overview** (Vue d'ensemble)
- [ ] Stats globales visibles (users, properties, transactions)
- [ ] Graphiques affichés
- [ ] Pas d'erreur console
- [ ] **Compteur "Propriétés en attente"** visible ?

### 2. **Utilisateurs** (`/admin/users`)
- [ ] Liste des utilisateurs s'affiche
- [ ] Filtres par rôle (vendeur, acheteur, admin)
- [ ] Actions disponibles (ban, suspendre)
- [ ] Données réelles Supabase (pas mockées)

### 3. **Propriétés** (`/admin/properties`)
- [ ] Liste des propriétés s'affiche
- [ ] Filtres par statut disponibles
- [ ] **Filtre "En attente d'approbation"** existe ?
- [ ] **Boutons "Approuver" / "Rejeter"** visibles ?

### 4. **Support / Tickets** (`/admin/support` ?)
- [ ] Page existe ?
- [ ] Liste des tickets s'affiche
- [ ] Peut voir conversation complète
- [ ] Peut répondre au ticket
- [ ] Bouton "Marquer résolu"

### 5. **Transactions** (`/admin/transactions`)
- [ ] Liste des transactions
- [ ] Total revenue calculé
- [ ] Graphiques évolution

### 6. **Analytics** (`/admin/analytics`)
- [ ] Graphiques avancés
- [ ] Prédictions IA (si disponible)
- [ ] Métriques temps réel

---

## 🎯 FONCTIONNALITÉS CRITIQUES À VÉRIFIER

### A. Approbation des Biens ⭐⭐⭐

**Comment tester** :
1. Créer une propriété en tant que vendeur (si pas déjà fait)
2. Vérifier qu'elle est en statut `pending_verification`
3. Se connecter en admin
4. Aller sur `/admin/properties`
5. Chercher propriété en attente
6. **Tester** :
   - [ ] Bouton "Approuver" visible ?
   - [ ] Bouton "Rejeter" visible ?
   - [ ] Champ commentaire disponible ?
   - [ ] Après clic "Approuver", statut change vers `active` ?
   - [ ] Vendeur reçoit notification ?

**Si ça ne marche pas** :
- Prendre screenshot
- Noter l'erreur console

---

### B. Support Tickets ⭐⭐

**Comment tester** :
1. Créer un ticket en tant que vendeur (Dashboard Vendeur → Support → Créer Ticket)
2. Se connecter en admin
3. Chercher page support tickets
4. **Tester** :
   - [ ] Liste des tickets visible ?
   - [ ] Peut voir détails ticket
   - [ ] Peut répondre au ticket
   - [ ] Bouton "Marquer résolu"
   - [ ] Temps de première réponse calculé

**Si page n'existe pas** :
- Chercher dans menu sidebar si "Support" ou "Tickets" visible
- Noter que la page manque

---

### C. Liste Complète Terrains ⭐

**Comment tester** :
1. En admin, aller sur `/admin/properties`
2. **Vérifier** :
   - [ ] Tous les terrains de tous les vendeurs visibles
   - [ ] Filtres disponibles (statut, ville, prix, date)
   - [ ] Colonne "Vendeur" affichée
   - [ ] Colonne "Statut" visible
   - [ ] Actions : Voir détails, Éditer, Supprimer, Marquer featured

---

## 📊 CHECKLIST FINALE

### Menu Sidebar Visible
- [ ] Overview
- [ ] Utilisateurs
- [ ] Propriétés
- [ ] Transactions
- [ ] Analytics
- [ ] Support (si existe)
- [ ] Settings

### Données Réelles vs Mockées
- [ ] Stats dashboard = vraies données Supabase
- [ ] Liste users = vrais users
- [ ] Liste properties = vraies properties
- [ ] Liste transactions = vraies transactions

### Workflow Approbation
- [ ] Peut voir propriétés en attente
- [ ] Peut approuver une propriété
- [ ] Peut rejeter une propriété
- [ ] Statut change dans la base de données
- [ ] Vendeur est notifié

### Support Tickets
- [ ] Page existe et fonctionne
- [ ] Liste tickets chargée depuis `support_tickets`
- [ ] Peut répondre aux tickets
- [ ] Compteur tickets ouverts visible

---

## 🚨 ERREURS FRÉQUENTES

### Erreur 1 : "Page en développement"
**Solution** : Route admin n'utilise pas `<Outlet />` → Même problème que vendeur

### Erreur 2 : "403 Forbidden"
**Solution** : RLS Supabase bloque admin → Créer policies admin

### Erreur 3 : "Table not found"
**Solution** : Tables manquantes → Exécuter SQL fix

### Erreur 4 : Données mockées affichées
**Solution** : Remplacer par vraies requêtes Supabase

---

## 📝 RAPPORT À ME DONNER

Après vos tests, dites-moi :

### 1. Menu Sidebar
Liste des onglets que vous voyez

### 2. Fonctionnalités Manquantes
Ce qui n'existe pas ou ne marche pas :
- [ ] Approbation biens
- [ ] Support tickets
- [ ] Liste complète terrains
- [ ] Autre : __________

### 3. Erreurs Rencontrées
Screenshots + messages console (F12)

### 4. Priorités
Qu'est-ce que vous voulez corriger en premier ?

---

## 🚀 APRÈS LES TESTS

Selon vos réponses, je vais :

**Option A** : Corriger les bugs des pages existantes  
**Option B** : Créer les pages/fonctionnalités manquantes  
**Option C** : Améliorer le workflow d'approbation  
**Option D** : Tout refaire en version moderne et complète

---

**FAITES LES TESTS MAINTENANT ET DITES-MOI CE QUE VOUS TROUVEZ !** 🎯
