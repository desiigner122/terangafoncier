# 🎯 Guide de Test - Teranga Foncier Platform

## 📋 Comptes de Démonstration

Tous les comptes utilisent le mot de passe: `demo123`

| Email | Rôle | Dashboard | URL |
|-------|------|-----------|-----|
| admin@terangafoncier.com | Admin | Administration | /admin-dashboard |
| particulier@terangafoncier.com | Particulier | Acheteur | /particular-dashboard |
| vendeur@terangafoncier.com | Vendeur | Vendeur | /seller-dashboard |
| investisseur@terangafoncier.com | Investisseur | Investisseur | /investor-dashboard |
| municipalite@terangafoncier.com | Municipalité | Municipalité | /municipality-dashboard |
| notaire@terangafoncier.com | Notaire | Notaire | /notary-dashboard |
| geometre@terangafoncier.com | Géomètre | Géomètre | /surveyor-dashboard |
| banque@terangafoncier.com | Banque | Banque | /bank-dashboard |
| promoteur@terangafoncier.com | Promoteur | Promoteur | /developer-dashboard |

## 🌐 URL de la Plateforme

**Production**: https://terangafoncier.vercel.app/

## 🧪 Scénarios de Test

### 1. Dashboard Admin
**Compte**: admin@terangafoncier.com
**Fonctionnalités à tester**:
- Vue d'ensemble des statistiques
- Gestion des utilisateurs
- Modération des annonces
- Analytics et rapports
- Configuration système

### 2. Dashboard Particulier
**Compte**: particulier@terangafoncier.com
**Fonctionnalités à tester**:
- Recherche de terrains
- Favoris et sauvegardes
- Alertes de prix
- Comparaison de biens
- Demandes d'information

### 3. Dashboard Vendeur
**Compte**: vendeur@terangafoncier.com
**Fonctionnalités à tester**:
- Publication d'annonces
- Gestion du portefeuille
- Suivi des contacts
- Statistiques de vente
- Outils de promotion

### 4. Dashboard Investisseur
**Compte**: investisseur@terangafoncier.com
**Fonctionnalités à tester**:
- Analyses de marché
- Opportunités d'investissement
- ROI Calculator
- Portfolio tracking
- Veille concurrentielle

### 5. Dashboard Municipalité
**Compte**: municipalite@terangafoncier.com
**Fonctionnalités à tester**:
- Zonage et urbanisme
- Permis et autorisations
- Taxes foncières
- Projets municipaux
- Cartographie administrative

### 6. Dashboard Notaire
**Compte**: notaire@terangafoncier.com
**Fonctionnalités à tester**:
- Actes et transactions
- Vérifications juridiques
- Dossiers clients
- Calendrier des rendez-vous
- Documents légaux

### 7. Dashboard Géomètre
**Compte**: geometre@terangafoncier.com
**Fonctionnalités à tester**:
- Relevés topographiques
- Plans et mesures
- Bornage des terrains
- Cartographie technique
- Certificats d'arpentage

### 8. Dashboard Banque
**Compte**: banque@terangafoncier.com
**Fonctionnalités à tester**:
- Évaluation immobilière
- Prêts et financements
- Garanties hypothécaires
- Analyse de risque
- Portefeuille de crédits

### 9. Dashboard Promoteur
**Compte**: promoteur@terangafoncier.com
**Fonctionnalités à tester**:
- Projets immobiliers
- Gestion des chantiers
- Commercialisation
- Planification urbaine
- Partenariats

## 🔧 Configuration Technique

### Base de Données
- **Supabase**: Base de données PostgreSQL avec RLS
- **Tables**: Créées avec les corrections de structure
- **Auth**: Système d'authentification Supabase

### Déploiement
- **Frontend**: Vercel (React + Vite)
- **Backend**: Supabase (API + DB)
- **Storage**: Supabase Storage pour les fichiers

### Technologies
- **React 18** + **Vite**
- **Tailwind CSS** + **Headless UI**
- **Supabase** (Auth + DB + Storage)
- **React Router** pour la navigation
- **Lucide React** pour les icônes

## 🐛 Debug et Logging

### Console Browser
Vérifier les erreurs dans la console du navigateur :
- Erreurs d'authentification
- Erreurs de API calls
- Problèmes de routing

### Supabase Dashboard
- Vérifier les logs de la base de données
- Contrôler les politiques RLS
- Analyser les requêtes SQL

### Vercel Analytics
- Performances de la plateforme
- Erreurs de déploiement
- Usage analytics

## 📊 Métriques à Surveiller

1. **Performance**
   - Temps de chargement < 3s
   - First Contentful Paint < 1.5s
   - Largest Contentful Paint < 2.5s

2. **Fonctionnalité**
   - Taux de succès des connexions > 95%
   - API response time < 500ms
   - Zero erreurs critiques

3. **UX/UI**
   - Navigation intuitive
   - Responsive design
   - Accessibilité WCAG 2.1

## 🚀 Prochaines Étapes

1. **Tests Complets**: Tester chaque dashboard avec son compte dédié
2. **Données Réelles**: Ajouter du contenu de démonstration
3. **Optimisation**: Améliorer les performances
4. **Sécurité**: Audit de sécurité complet
5. **Production**: Mise en production finale

---

**Status**: ✅ Plateforme déployée et prête pour les tests
**Dernière mise à jour**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
