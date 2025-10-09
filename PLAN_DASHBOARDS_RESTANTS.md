# 📋 PLAN : FINALISATION DASHBOARDS RESTANTS

## Date: 2025-10-08
## Stratégie: Finir tous les dashboards AVANT l'Admin

---

## 📊 ÉTAT DES LIEUX

### ✅ DASHBOARDS TERMINÉS
1. **Vendeur** - ✅ 100% Fonctionnel
   - CompleteSidebarVendeurDashboard avec `<Outlet />`
   - Routes imbriquées actives
   - Données réelles Supabase
   - Edit Property complet (8 étapes)

---

## 🚧 DASHBOARDS À FINALISER (7)

### Ordre de priorité (Business Impact) :

---

## 1. 🏡 PARTICULIER / ACHETEUR ⭐⭐⭐
**Fichier** : `src/pages/dashboards/particulier/CompleteSidebarParticulierDashboard.jsx`  
**Route actuelle** : `/acheteur` (ligne 480)  
**Rôles** : `['Acheteur', 'Particulier']`

### Fonctionnalités Requises :
- [ ] **Overview** : Dashboard résumé (favoris, recherches sauvegardées, recommandations IA)
- [ ] **Recherche Terrain** : Filtres avancés (ville, prix, surface, zoning)
- [ ] **Mes Favoris** : Liste propriétés likées
- [ ] **Mes Offres** : Offres soumises (pending, accepted, rejected)
- [ ] **Visites Planifiées** : Calendrier des visites
- [ ] **Financement** : Simulateur prêt, connexion banques
- [ ] **Messages** : Conversations avec vendeurs
- [ ] **Notifications** : Nouvelles propriétés, réponses offres
- [ ] **Historique** : Propriétés vues récemment

**Temps estimé** : 2-3h  
**Priorité** : HAUTE (utilisateurs principaux de la plateforme)

---

## 2. 🏛️ MAIRIE ⭐⭐⭐
**Fichier** : `src/pages/dashboards/mairie/CompleteSidebarMairieDashboard.jsx`  
**Routes** : `/mairie`, `/solutions/mairies/dashboard` (lignes 648, 656)  
**Rôles** : `['Mairie']`

### Fonctionnalités Requises :
- [ ] **Overview** : Stats demandes, revenue, terrains à vendre
- [ ] **Demandes Citoyens** : Liste demandes (certification, information, achat)
- [ ] **Gestion Terrains Municipaux** : Terrains communaux à vendre
- [ ] **Urbanisme** : Plans de zonage, autorisations
- [ ] **Certifications** : Émettre certificats (domicile, propriété, conformité)
- [ ] **Revenue** : Suivi taxes foncières, frais administratifs
- [ ] **Statistiques** : Transactions par quartier, évolution prix
- [ ] **Notifications** : Nouvelles demandes citoyens

**Particularité** : BUSINESS MODEL (voir `BUSINESS_MODEL_DEMANDES_COMMUNALES.md`)
- Demandes citoyens = 5,000 FCFA / demande
- Vente terrains communaux = Commission 3-5%

**Temps estimé** : 2-3h  
**Priorité** : HAUTE (revenue stream important)

---

## 3. 🏦 BANQUE ⭐⭐
**Fichier** : `src/pages/dashboards/banque/CompleteSidebarBanqueDashboard.jsx`  
**Route** : `/banque` (ligne 649)  
**Rôles** : `['Banque']`

### Fonctionnalités Requises :
- [ ] **Overview** : Dossiers actifs, taux d'approbation, volume prêts
- [ ] **Demandes Financement** : Liste acheteurs demandant prêt
- [ ] **Analyse Dossier** : Scoring crédit, documents requis, capacité remboursement
- [ ] **Approbation/Rejet** : Workflow validation prêt
- [ ] **Prêts Actifs** : Suivi remboursements
- [ ] **Partenariats** : Propriétés éligibles financement bancaire
- [ ] **Statistiques** : Taux défaut, performance portefeuille
- [ ] **Notifications** : Nouvelles demandes, documents manquants

**Temps estimé** : 2h  
**Priorité** : MOYENNE (fonctionnalité optionnelle mais valorisante)

---

## 4. ⚖️ NOTAIRE ⭐⭐
**Fichier** : `src/pages/dashboards/notaire/CompleteSidebarNotaireDashboard.jsx`  
**Route** : `/notaire` (ligne 650)  
**Rôles** : `['Notaire']`

### Fonctionnalités Requises :
- [ ] **Overview** : Actes en cours, revenue mensuel, délai moyen
- [ ] **Transactions en Cours** : Ventes nécessitant acte notarié
- [ ] **Rédaction Actes** : Interface génération contrats
- [ ] **Vérification Légale** : Check titres de propriété
- [ ] **Rendez-vous** : Planification signatures
- [ ] **Documents** : Upload/validation pièces justificatives
- [ ] **Facturation** : Frais notariés (3-5% du prix)
- [ ] **Historique** : Actes notariés complétés

**Temps estimé** : 1.5-2h  
**Priorité** : MOYENNE (étape finale transaction)

---

## 5. 🏗️ PROMOTEUR ⭐
**Fichier** : `src/pages/dashboards/promoteur/PromoteurDashboard.jsx`  
**Route** : `/promoteur` (ligne 651)  
**Rôles** : `['Promoteur']`

### Fonctionnalités Requises :
- [ ] **Overview** : Projets actifs, terrains disponibles, revenue
- [ ] **Recherche Terrains** : Filtres pour grands terrains (lotissement)
- [ ] **Mes Projets** : Liste projets développement
- [ ] **Acquisitions** : Offres groupées, négociations
- [ ] **Planning** : Timeline projets, permis, constructions
- [ ] **Partenaires** : Géomètres, architectes, entrepreneurs
- [ ] **Financement Projet** : Levée fonds, investisseurs
- [ ] **Marketplace** : Vente lots finaux

**Temps estimé** : 2h  
**Priorité** : BASSE (niche spécifique)

---

## 6. 💼 INVESTISSEUR ⭐⭐
**Fichier** : `src/pages/dashboards/investisseur/CompleteSidebarInvestisseurDashboard.jsx`  
**Route** : `/investisseur/*` (ligne 652)  
**Rôles** : `['Investisseur']`

### Fonctionnalités Requises :
- [ ] **Overview** : Portfolio, ROI, opportunités
- [ ] **Opportunités** : Terrains haut potentiel (filtres ROI, localisation, croissance)
- [ ] **Mon Portfolio** : Propriétés détenues, performance
- [ ] **Calculateurs** : ROI, Cash Flow, Rentabilité locative
- [ ] **Analyse Marché** : Tendances prix, quartiers émergents
- [ ] **Blockchain/NFT** : Tokenisation propriétés, fractional ownership
- [ ] **IA Prédictive** : Recommandations investissement
- [ ] **Comparaisons** : Benchmarking performances

**Temps estimé** : 2-3h  
**Priorité** : MOYENNE (utilisateurs premium potentiels)

---

## 7. 📐 GÉOMÈTRE ⭐
**Fichier** : `src/pages/dashboards/geometre/CompleteSidebarGeometreDashboard.jsx`  
**Route** : `/geometre/*` (ligne 653)  
**Rôles** : `['Géomètre', 'geometre', 'Geometre']`

### Fonctionnalités Requises :
- [ ] **Overview** : Missions actives, revenue, délai moyen
- [ ] **Demandes Bornage** : Liste demandes géométriques
- [ ] **Missions en Cours** : Bornage, relevés topographiques
- [ ] **Carte Interactive** : Visualisation parcelles
- [ ] **Documents Techniques** : Plans, certificats de bornage
- [ ] **Facturation** : Frais géomètre (50,000-200,000 FCFA)
- [ ] **Partenaires** : Notaires, mairies, promoteurs
- [ ] **Historique** : Missions complétées

**Temps estimé** : 1.5-2h  
**Priorité** : BASSE (service technique spécifique)

---

## 8. 🏢 AGENT FONCIER ⭐
**Fichier** : `src/pages/dashboards/agent-foncier/CompleteSidebarAgentFoncierDashboard.jsx`  
**Route** : `/agent-foncier/*` (ligne 654)  
**Rôles** : `['Agent Foncier', 'agent_foncier']`

### Fonctionnalités Requises :
- [ ] **Overview** : Propriétés actives, commissions, clients
- [ ] **Mes Mandats** : Propriétés en mandat exclusif
- [ ] **Prospection** : Leads acheteurs/vendeurs
- [ ] **Visites** : Planification, feedback
- [ ] **Négociations** : Offres, contre-offres
- [ ] **Commissions** : Calcul 3-5% sur ventes conclues
- [ ] **CRM** : Gestion contacts, relances
- [ ] **Statistiques** : Taux conversion, délai vente moyen

**Temps estimé** : 2h  
**Priorité** : MOYENNE (intermédiaire transactions)

---

## 📅 PLANNING SUGGÉRÉ

### Semaine 1 (15h) :
**Jour 1-2** : Particulier/Acheteur (3h) ⭐⭐⭐  
**Jour 3** : Mairie (3h) ⭐⭐⭐  
**Jour 4** : Banque (2h) + Notaire (2h) ⭐⭐  
**Jour 5** : Investisseur (3h) ⭐⭐  

### Semaine 2 (6h) :
**Jour 1** : Promoteur (2h) ⭐  
**Jour 2** : Géomètre (2h) ⭐  
**Jour 3** : Agent Foncier (2h) ⭐  

### Semaine 3 :
**Dashboard Admin complet** avec toutes les données réelles

---

## 🎯 APPROCHE POUR CHAQUE DASHBOARD

### Méthodologie (même que Vendeur) :

#### 1. Conversion Architecture (30 min / dashboard)
```jsx
// AVANT (activeTab)
const [activeTab, setActiveTab] = useState('overview');
return renderContent(activeTab);

// APRÈS (React Router + Outlet)
return (
  <div className="flex">
    <Sidebar />
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </main>
  </div>
);
```

#### 2. Création Routes Imbriquées (15 min / dashboard)
```jsx
// App.jsx
<Route path="/particulier" element={<RoleProtectedRoute allowedRoles={['Acheteur','Particulier']}>
  <CompleteSidebarParticulierDashboard />
</RoleProtectedRoute>}>
  <Route index element={<ParticulierOverview />} />
  <Route path="recherche" element={<ParticulierRecherche />} />
  <Route path="favoris" element={<ParticulierFavoris />} />
  <Route path="offres" element={<ParticulierOffres />} />
  <Route path="messages" element={<ParticulierMessages />} />
</Route>
```

#### 3. Activation Pages Réelles (1-2h / dashboard)
- Remplacer données mockées par Supabase
- Implémenter CRUD operations
- Ajouter validations
- Tester chaque page

---

## 🔧 TABLES SUPABASE REQUISES

Vérifier existence tables :

```sql
-- Particulier/Acheteur
- properties (search, filters)
- favorites (user_id, property_id)
- offers (user_id, property_id, amount, status)
- visits (user_id, property_id, date, status)
- messages (conversations)

-- Mairie
- citizen_requests (type, status, payment)
- municipal_properties (commune-owned lands)
- certifications (type, issued_date, citizen_id)

-- Banque
- loan_applications (user_id, property_id, amount, status)
- credit_scores (user_id, score, documents)
- loan_repayments (loan_id, amount, date)

-- Notaire
- notary_acts (transaction_id, type, status)
- legal_documents (act_id, type, url)
- appointments (notary_id, clients, date)

-- Promoteur
- development_projects (name, location, status, budget)
- land_acquisitions (project_id, properties)

-- Investisseur
- investor_portfolio (user_id, properties, roi)
- investment_opportunities (property_id, roi_estimate)
- nft_tokens (property_id, token_id, blockchain)

-- Géomètre
- surveying_requests (property_id, type, status)
- boundary_documents (request_id, plan_url)

-- Agent Foncier
- property_mandates (agent_id, property_id, exclusive)
- commission_tracking (agent_id, transaction_id, amount)
- client_leads (agent_id, type, status)
```

---

## 📊 MÉTRIQUES DE SUCCÈS

Pour chaque dashboard :
- ✅ Architecture avec `<Outlet />`
- ✅ Routes imbriquées fonctionnelles
- ✅ Données Supabase (pas mockées)
- ✅ Sidebar navigation active
- ✅ URLs bookmarkables
- ✅ Responsive design
- ✅ Gestion erreurs
- ✅ Loading states

---

## 🚀 PROCHAINE ÉTAPE

**DÉCISION** : Par quel dashboard commencer ?

### Option A : Par Priorité Business ⭐ Recommandé
1. Particulier/Acheteur (utilisateurs principaux)
2. Mairie (revenue stream)
3. Investisseur (premium users)
4. Banque, Notaire, Agent Foncier
5. Promoteur, Géomètre

### Option B : Par Complexité Croissante
1. Notaire (simple)
2. Géomètre (simple)
3. Banque (moyen)
4. Mairie (moyen)
5. Particulier (complexe)
6. Investisseur (complexe)

### Option C : Par Dépendances
1. Particulier (base - recherche, offres)
2. Agent Foncier (dépend de particulier)
3. Banque (dépend de particulier)
4. Notaire (dépend de tout)
5. Mairie, Promoteur, Investisseur, Géomètre

---

## ⏱️ TEMPS TOTAL ESTIMÉ

**Rapide** (fonctionnalités de base) : 12-15h  
**Complet** (toutes fonctionnalités) : 20-25h  
**Premium** (IA, blockchain, analytics) : 30-35h

---

## 💡 RECOMMANDATION FINALE

**APPROCHE HYBRIDE** :
1. **Semaine 1** : Les 3 dashboards critiques (Particulier, Mairie, Investisseur) = 9h
2. **Semaine 2** : Les 4 dashboards complémentaires (Banque, Notaire, Agent Foncier, Promoteur) = 8h
3. **Semaine 2** : Géomètre (bonus si temps) = 2h
4. **Semaine 3** : Dashboard Admin (FINAL BOSS) = 4-6h

**Total** : 23-25h sur 3 semaines

---

**QUESTION** : On commence par quel dashboard ? 🤔

**A** = Particulier/Acheteur (le plus important)  
**B** = Mairie (business model)  
**C** = Le plus simple (Notaire ou Géomètre)  
**D** = Autre suggestion ?

