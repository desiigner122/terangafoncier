# 🧪 GUIDE DE TEST PRATIQUE - DASHBOARDS TERANGA FONCIER

## 🎯 Situation Actuelle
✅ **Supabase opérationnel** - Connexion établie et fonctionnelle  
✅ **Application lancée** - http://localhost:5173  
✅ **77 dashboards identifiés** - Prêts à tester  

---

## 🚀 TESTS PRIORITAIRES IMMÉDIATS

### 1️⃣ **Test de la Page d'Accueil** (SANS AUTHENTIFICATION)
🌐 **URL :** http://localhost:5173  
**À vérifier :**
- [ ] Page se charge sans erreur
- [ ] Design propre et cohérent  
- [ ] Navigation fonctionnelle
- [ ] Pas d'erreurs console (F12)
- [ ] Caractères français affichés correctement (é, è, à)
- [ ] Icônes visibles et non cassées

### 2️⃣ **Test de la Page de Connexion** (SANS AUTHENTIFICATION)
🌐 **URL :** http://localhost:5173/login  
**À vérifier :**
- [ ] BlockchainLoginPage s'affiche correctement
- [ ] Formulaire de connexion visible
- [ ] Design moderne et attractif
- [ ] Pas d'erreurs console
- [ ] Responsive sur mobile (F12 → Device Mode)

### 3️⃣ **Test d'Inscription** (CRÉATION COMPTE RÉEL)
🌐 **URL :** http://localhost:5173/register  
**Créer ces comptes de test :**

| Rôle | Email | Mot de passe | Usage |
|------|-------|-------------|--------|
| Admin | admin@test.local | Admin123! | Dashboard admin |
| Particulier | user@test.local | User123! | Dashboard principal |
| Vendeur | vendeur@test.local | Vend123! | Dashboard vendeur |
| Investisseur | invest@test.local | Invest123! | Dashboard investissement |

**Processus :**
1. Aller sur /register
2. Remplir le formulaire avec un des comptes ci-dessus
3. Vérifier que l'inscription fonctionne
4. Noter si redirection automatique ou besoin de confirmer email

---

## 🔐 TESTS DASHBOARDS AUTHENTIFIÉS

### 4️⃣ **Dashboard Principal Particulier** 🔴 CRITIQUE
🌐 **URL :** http://localhost:5173/dashboard  
**Compte :** user@test.local / User123!

**Tests à effectuer :**
- [ ] Connexion avec le compte Particulier
- [ ] Redirection automatique vers /dashboard
- [ ] Dashboard se charge complètement
- [ ] Sections principales visibles :
  - [ ] Vue d'ensemble/statistiques
  - [ ] Mes propriétés/favoris
  - [ ] Actions rapides
  - [ ] Navigation latérale ou menu
- [ ] Données affichées (même si vides au début)
- [ ] Pas d'erreurs console critiques

### 5️⃣ **Dashboard Admin** 🔴 CRITIQUE  
🌐 **URL :** http://localhost:5173/admin  
**Compte :** admin@test.local / Admin123!

**Tests à effectuer :**
- [ ] Connexion avec le compte Admin
- [ ] Accès au dashboard admin
- [ ] Interface administrative visible :
  - [ ] Gestion utilisateurs
  - [ ] Gestion propriétés  
  - [ ] Statistiques globales
  - [ ] Outils d'administration
- [ ] Permissions admin fonctionnelles
- [ ] Navigation entre sections admin

### 6️⃣ **Dashboard Vendeur** 🟠 IMPORTANTE
🌐 **URL :** http://localhost:5173/dashboard/vendeur  
**Compte :** vendeur@test.local / Vend123!

**Tests à effectuer :**
- [ ] Interface vendeur spécialisée
- [ ] Gestion des annonces/propriétés
- [ ] Outils de vente
- [ ] Statistiques de vente

### 7️⃣ **Dashboard Investisseur** 🟠 IMPORTANTE  
🌐 **URL :** http://localhost:5173/dashboard/investisseur  
**Compte :** invest@test.local / Invest123!

**Tests à effectuer :**
- [ ] Interface investisseur
- [ ] Analyse de marché
- [ ] Portefeuille d'investissements
- [ ] Opportunités d'investissement

---

## 🐛 PROBLÈMES COURANTS À SURVEILLER

### Erreurs Critiques
- ❌ **Écran blanc** → Erreur JavaScript fatale
- ❌ **404 Not Found** → Route inexistante
- ❌ **Erreur Supabase** → Problème connexion DB
- ❌ **Boucle de redirection** → Problème authentification

### Erreurs d'Affichage
- ❌ **Caractères corrompus** (�, Ã©, âœ…) → Encodage
- ❌ **Icônes manquantes** → Problème imports Lucide
- ❌ **Design cassé** → Problème CSS/Tailwind
- ❌ **Page non responsive** → Problème mobile

### Erreurs Fonctionnelles  
- ❌ **Connexion échoue** → Problème auth Supabase
- ❌ **Données non affichées** → Problème requêtes
- ❌ **Actions non fonctionnelles** → Problème handlers
- ❌ **Navigation cassée** → Problème routes

---

## 📊 CHECKLIST VALIDATION GLOBALE

### ✅ Critères de Succès Minimum
- [ ] **3 routes publiques** fonctionnent (/, /login, /register)
- [ ] **2 dashboards principaux** fonctionnent (/dashboard, /admin)
- [ ] **Authentification** opérationnelle
- [ ] **Caractères français** corrects partout
- [ ] **0 erreur console critique**
- [ ] **Design cohérent** et professionnel

### 🎯 Objectif Final
**Application prête pour vrais utilisateurs avec dashboards fonctionnels et base de données propre**

---

## 🔧 COMMANDES UTILES

```bash
# Relancer l'app si problème
npm run dev

# Nettoyer la base de données
node clean-database.mjs

# Tester connexion Supabase
node test-supabase-connection.mjs

# Analyser les dashboards
node map-dashboards.mjs
```

## 📱 ÉTAPES SUIVANTES

1. **Maintenant** : Tester les routes publiques (/, /login, /register)
2. **Ensuite** : Créer les 4 comptes de test suggérés  
3. **Puis** : Tester les 4 dashboards prioritaires
4. **Enfin** : Tester les autres dashboards selon besoins

---

**🎉 Une fois ces tests validés, l'application sera prête pour production !**