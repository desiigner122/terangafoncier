# Audit Complet du Site et Dashboards — État Actuel et Plan d'Action

**Date:** 10 Octobre 2025  
**Objectif:** Identifier toutes les pages mockées, fonctionnalités incomplètes, données manquantes et définir le rôle complet de l'admin

---

## 1. PAGES PUBLIQUES — État Actuel

### 1.1 Page d'Accueil (HomePage.jsx)
**État:** ✅ Partiellement fonctionnelle
- **Contenus réels:**
  - Hero avec branding Teranga Foncier
  - LiveMetricsBar, MarketTickerBar, AILiveMetricsBar (métriques en temps réel)
  - Sections: ProblemSolution, MarketBlockchain, CommunalLands, Sellers, Diaspora, Cities
  - Témoignages (hardcodés mais structure OK)
  
- **Contenus mockés:**
  - Témoignages (noms/avatars hardcodés)
  - Stats (15K+ terrains, 8.2K utilisateurs, 12 banques) → pas de source Supabase réelle
  
- **Manquant:**
  - Pas de table `site_stats` pour métriques dynamiques
  - Pas de table `testimonials` pour gérer les avis clients
  - CTA "Explorer Terrains" / "Voir Blockchain" sans tracking d'événements
  - Formulaire newsletter absent ou non persisté

**Rôle Admin:**
- Éditer Hero (titre, sous-titre, CTA)
- Gérer témoignages (CRUD)
- Configurer stats affichées (source Supabase ou calculées)
- Tracking des clics CTA (page_events)

---

### 1.2 Page Pricing (PricingPage.jsx)
**État:** ✅ Fonctionnelle mais statique
- **Contenus réels:**
  - Structure tarifaire (5% service, 3-5% notaire, 5-10% taxes)
  
- **Contenus mockés:**
  - Tous les textes hardcodés (pas de CMS)
  
- **Manquant:**
  - Pas de table `pricing_plans` ou `service_fees`
  - CTA "Contacter conseiller" sans tracking ni backend formulaire

**Rôle Admin:**
- Configurer frais/tarifs dynamiques (table pricing_config)
- Éditer textes descriptifs via CMS
- Analytics: vues page, clics CTA

---

### 1.3 Page Contact (ContactPage.jsx)
**État:** ✅ Partiellement fonctionnelle
- **Contenus réels:**
  - Formulaire de contact avec envoi vers `contact_messages` (Supabase)
  - Méthodes de contact (hardcodées)
  
- **Contenus mockés:**
  - Équipe (Abdoulaye Diémé + Équipe Support) → hardcodés
  
- **Manquant:**
  - Pas de validation backend des champs
  - Pas d'assignation automatique des messages à un conseiller
  - Pas de suivi (status: new/replied/closed)
  - Réseaux sociaux (liens hardcodés, pas de gestion admin)

**Rôle Admin:**
- Gérer messages de contact (inbox, assignation, statut, réponses)
- Configurer équipe/conseillers (table team_members)
- Configurer méthodes de contact (téléphone, email, WhatsApp, adresse)
- Analytics: sources de contact, taux de réponse

---

### 1.4 Page Solutions Notaires (SolutionsNotairesPage.jsx)
**État:** ⚠️ Statique complet (mockup marketing)
- **Contenus réels:**
  - Zéro — tout est hardcodé
  
- **Contenus mockés:**
  - Features (6 blocs) → textes, icônes, couleurs hardcodés
  - Avantages blockchain (3 blocs) → hardcodés
  - CTA "Accéder Dashboard" sans tracking
  
- **Manquant:**
  - Table `solution_pages` (slug, title, hero, features JSONB)
  - Tracking CTA → page_events
  - Formulaire leads ("Contactez-nous pour démo") non persisté

**Rôle Admin:**
- CMS complet pour pages Solutions (Notaires, Banques, Vendeurs, Investisseurs, etc.)
- Éditer hero, features, avantages
- Gérer leads générés ("demande démo")
- Analytics: vues, CTR, conversion vers dashboard

---

### 1.5 Blog (BlogPage.jsx + BlogPostPage.jsx)
**État:** ✅ Structure OK mais articles hardcodés
- **Contenus réels:**
  - Layout et filtres fonctionnels
  - **Table `blog_posts` existe** (à conserver tel quel)
  
- **Contenus mockés:**
  - Articles (liste hardcodée dans le composant)
  - Stats blog (50+ articles, 25k lectures) → hardcodées
  
- **Manquant:**
  - Connexion réelle à `blog_posts` (actuellement mockée)
  - Pas de gestion tags (table `blog_tags`, `blog_post_tags`)
  - Pas de vue compteur (table `page_views` ou colonne `views_count`)
  - Commentaires absents
  - Newsletter signup absent ou non persisté

**Rôle Admin:**
- Gérer articles (CRUD via AdminBlogPage — existe déjà)
- **NE PAS TOUCHER la structure blog_posts**
- Ajouter: gestion tags, catégories
- Analytics: vues par article, sources trafic (UTM)
- Modération commentaires (si ajoutés)

---

### 1.6 Pages Solutions (Audit complet)
**Trouvées (12 pages):**
- SolutionsBanquesPage.jsx ✅ (6 features hardcodées dont 2 blockchain: Smart Contracts Bancaires, Tokenisation d'Actifs)
- SolutionsVendeursPage.jsx ✅ (6 features + section tarification 2 plans: Particulier 20K, Professionnel 45K XOF/mois hardcodés)
- SolutionsNotairesPage.jsx ✅ (déjà audité — 6 features hardcodées)
- SolutionsParticuliersPage.jsx ✅
- SolutionsPromoteursPage.jsx ✅
- SolutionsInvestisseursPage.jsx ✅
- SolutionsAgriculteursPage.jsx ✅
- DiasporaInvestmentPage.jsx ✅
- ConstructionDistancePage.jsx ✅
- ProjectMonitoringPage.jsx ✅
- AgentsFonciersPage.jsx ✅
- GeometresPage.jsx ✅

**État:** ⚠️ Toutes statiques avec contenu marketing hardcodé
- Chaque page a structure similaire: Hero section, features array (4-6 items), CTA vers dashboard/contact
- Aucune connexion CMS ou Supabase
- Pricing parfois intégré (hardcodé) dans Vendeurs
- CTA tracking absent

**Manquant:**
- Table `solution_pages` pour gérer contenu dynamiquement
- Formulaires leads spécifiques ("Demander démo", "Contacter") non persistés ou tracking manquant
- A/B testing sur CTA impossible (pas d'infra)

**Rôle Admin:**
- CMS pour éditer toutes les pages Solutions (hero, features, pricing, testimonials)
- Gérer leads par source ("SolutionsBanques", "SolutionsVendeurs", etc.)
- Analytics: vues par page, taux conversion vers dashboard, CTA clics

---

### 1.7 Pages Guides & Outils
**Guides:**
- GuideDiasporaPage.jsx ❌ (fichier non trouvé — probablement inexistant)
- Autres guides (Tutoriels, Lois Foncières, Documents, Projects, Requests, Glossaire, Tax Guide) ❌ non trouvés

**État Guides:** ❌ Majoritairement absents ou statiques/hardcodés
- Manquant: Guides complets avec contenu éditorial, FAQ, vidéos, téléchargements PDF
- Rôle Admin: CMS pages guides avec sections (texte, images, vidéos, fichiers téléchargeables)

**Outils:**
- PriceCalculator, MarketAnalysis, InteractiveMap, PropertyVerification, NFTProperties, SmartContracts, Escrow
- État présumé: ⚠️ Interfaces fonctionnelles mais données souvent mockées ou sans backend complet
- Manquant: Connexion aux propriétés réelles, historique prix (table `price_history`), logs d'usage
- Rôle Admin: Configurer paramètres outils (taux, seuils, formules), analytics usage (par outil, par user)

**Legal/Privacy/Terms:**
- État: Statiques (hardcodés dans composants)
- Rôle Admin: CMS simple pour éditer textes légaux (RGPD, CGU, Confidentialité)

---

## 2. DASHBOARDS PAR RÔLE — État Actuel

### 2.1 Dashboard Admin
**État:** ✅ Partiellement modernisé, mais beaucoup de mockups
- **Pages réelles (données Supabase):**
  - ModernUsersPage ✅
  - ModernPropertiesManagementPage ✅
  - ModernTransactionsPage ✅
  - AdminPropertyValidation ✅
  - SupportTicketsPage ✅
  - useAdminUsers, useAdminProperties, useAdminTickets ✅
  
- **Pages mockées ou incomplètes:**
  - AdminDashboard (plusieurs variantes, confusion)
  - ModernSettingsPage ⚠️ (IA/Blockchain préparés mais sans données réelles)
  - AdminAnalyticsPage ⚠️ (graphiques mockés)
  - RevenueManagementPage ⚠️ (revenus simulés)
  - AdminBlogPage ✅ (existe mais pas connecté à blog_posts)
  - AdminAuditLogPage ⚠️ (logs mockés)
  - Aucune page pour: CMS, Leads, Funnels, A/B Tests, Feature Flags, Navigation, Traductions
  
- **Manquant:**
  - Gestion contenu site (CMS)
  - Marketing & Croissance (leads, funnels, campagnes, A/B tests)
  - Analytics réelles (Google Analytics, Plausible, ou custom)
  - Modération contenu (signalements, reports)
  - Système de notifications admin
  
**Besoins:**
- Refonte complète avec architecture claire (6 rubriques proposées)
- Tables: cms_pages, marketing_leads, page_events, experiments, feature_flags, nav_menu, translations

---

### 2.2 Dashboard Vendeur
**État:** ✅ Modernisé avec données réelles (CompleteSidebarVendeurDashboard)
- **Pages réelles:**
  - VendeurOverviewRealData ✅
  - VendeurCRMRealData ✅
  - VendeurPropertiesRealData ✅
  - VendeurAddTerrainRealData ✅
  - VendeurAnalyticsRealData ✅
  - VendeurMessagesRealData ✅
  - VendeurSupport ✅ (tickets support connectés)
  
- **Pages incomplètes:**
  - VendeurSettingsRealData ⚠️ (profil + notifications OK, mais abonnements simulés)
    - Pas de vraie gestion subscriptions/plans (table `subscriptions` utilisée mais logique métier simplifiée)
    - Pas de paiements Stripe/Wave intégrés
    - Réseaux sociaux (édition OK mais pas utilisés ailleurs)
  
- **Manquant:**
  - Factures/historique paiements
  - Statistiques détaillées par propriété (vues, leads, conversions)
  - Exports PDF (listings, rapports)

**Rôle Admin:**
- Valider propriétés vendeurs (AdminPropertyValidation — existe)
- Gérer abonnements/plans (upgrade, downgrade, suspension)
- Analytics vendeurs (top performers, taux conversion)
- Modération: signalements sur annonces

---

### 2.3 Dashboard Acheteur/Particulier
**État:** ✅ Modernisé avec Supabase (DashboardParticulierRefonte)
- **Pages réelles:**
  - ParticulierOverview ✅
  - ParticulierRechercheTerrain ✅
  - ParticulierZonesCommunales ✅
  - ParticulierDemandesTerrains ✅
  - ParticulierDocuments ✅
  - ParticulierNotifications ✅
  - ParticulierTicketsSupport ✅
  
- **Pages incomplètes:**
  - ParticulierSettings ⚠️ (profil + notifications OK, mais manque gestion compte complet)
    - Pas de gestion méthodes paiement (cartes enregistrées)
    - Pas de préférences de recherche sauvegardées
    - Pas d'export données personnelles (RGPD)
  
- **Manquant:**
  - Historique recherches/favoris (analytics personnel)
  - Tableau de bord financier (budget, dépenses, projections)

**Rôle Admin:**
- Valider demandes terrains communaux
  - Gérer candidatures (statut: pending/approved/rejected)
- Analytics: comportement recherche, conversions
- Modération: signalements utilisateurs

---

### 2.4 Dashboard Notaire
**État:** ✅ Modernisé avec Supabase (CompleteSidebarNotaireDashboard)
- **Pages réelles:**
  - NotaireOverviewModernized ✅
  - NotaireCRMModernized ✅
  - NotaireTransactionsModernized ✅
  - NotaireCasesModernized ✅
  - NotaireArchivesModernized ✅
  - NotaireSupportPage ✅ (support tickets réels)
  
- **Pages incomplètes:**
  - NotaireSettingsModernized ⚠️ (structure OK mais données mockées)
    - Pas de vraie gestion tarifs notaire (honoraires)
    - Pas de gestion cabinet/collaborateurs
  
- **Manquant:**
  - Facturation/comptabilité
  - Intégration blockchain réelle (préparée mais pas implémentée)

**Rôle Admin:**
- Gérer réseau notaires (annuaire, vérification, suspension)
- Analytics: volume actes, délais moyens, satisfaction client
- Modération: qualité service, plaintes

---

### 2.5 Dashboard Banque
**État:** ⚠️ Settings complet mais dashboard principal absent/mocké
- **Pages trouvées:**
  - BanqueSettings.jsx ✅ (8 onglets ultra-complet avec données mockées)
    - Infos Banque (nom, adresse, capital, licence, logo)
    - Abonnement (plan Enterprise 2.5M XOF/mois, utilisateurs 32/50, factures, upgrade/downgrade)
    - Services Banking (KYC auto, scoring IA, diaspora, NFT garanties, API, analytics, compliance)
    - Préférences (langue, devise, timezone, thème)
    - API & Intégrations (endpoint, webhook, clés, partenaires)
    - Équipe & Rôles (6 membres: directeur crédit, analyste, commercial, KYC, blockchain, auditrice)
    - Logs & Audit (actions, crédits, KYC, blockchain, sécurité)
    - Portfolio (encours 245.8M, NPL 2.1%, répartition crédit terrain/construction/diaspora, top clients)
  - BanqueDashboard.jsx ❌ (fichier manquant — pas de page principale)

- **Données mockées:**
  - Toutes les données hardcodées dans BanqueSettings (infos banque, abonnement, équipe, portfolio)
  - Pas de connexion aux tables: funding_requests, bank_guarantees, credit_scoring
  
- **Manquant:**
  - Dashboard principal Banque (demandes financement, dossiers crédits, évaluation garanties)
  - Connexion Supabase pour portefeuille crédits, scoring IA, KYC automatisé
  - Module intégration TerangaChain pour garanties NFT
  - Analytics temps réel (actuellement mockées)

**Rôle Admin:**
- Gérer réseau banques (annuaire, vérification, suspension)
- Valider demandes financement depuis ParticulierDashboard
- Analytics: volume crédits octroyés, délais traitement, satisfaction
- Modération: plaintes sur services bancaires

---

### 2.6 Dashboard Mairie
**État:** ⚠️ Settings complet mais dashboard principal absent
- **Pages trouvées:**
  - MairieSettings.jsx ✅ (6 onglets complets avec données mockées)
    - Général (nom commune, maire, adresse, téléphone, email, site, timezone, langue, devise, logo)
    - Utilisateurs (3 membres: Aminata Diop chef urbanisme, Moussa Fall agent foncier, Fatou Ndiaye secrétaire général avec rôles/permissions)
    - Notifications (nouvelles demandes, statuts, échéances, alertes système, email/SMS/push)
    - Système (dark mode, auto-save, session timeout, backup frequency, maintenance mode, debug, analytics, caching)
    - Blockchain (network TerangaChain, node URL, gas limit/price, confirmations, auto-sync, wallet backup)
    - Sécurité (changement mot de passe, 2FA QR code, sessions actives laptop/mobile)
  - MairieDashboard.jsx ❌ (fichier manquant)

- **Données mockées:**
  - Tous les utilisateurs, paramètres blockchain, logs hardcodés
  - Pas de connexion: municipal_land_requests, urban_planning, permits
  
- **Manquant:**
  - Dashboard principal (gestion demandes zones communales, validation demandes citoyens, cadastre)
  - Module zones communales (attribution, suivi, reporting)
  - Intégration TerangaChain pour certificats NFT propriété communale
  - Analytics: demandes par zone, taux approbation, revenus

**Rôle Admin:**
- Gérer réseau mairies (annuaire, validation, suspension)
- Valider demandes zones communales depuis ParticulierZonesCommunales
- Analytics: demandes traitées, zones attribuées, revenus municipaux
- Modération: signalements processus attribution

---

### 2.7 Dashboard Investisseur
**État:** ⚠️ Dashboard complet mais données entièrement mockées
- **Pages trouvées:**
  - InvestisseurDashboard.jsx ✅ (5 onglets avec structure complète mais data hardcodée)
    - Overview (portfolio 850M XOF, 15 investissements, 8 projets actifs, rendement 12.8%, ROI 34.5%, score diversification 85%)
    - Portfolio (3 investissements: Résidence Almadies 50M→65M +30%, Centre Commercial 120M→158M +31.7%, Lotissement Diamniadio 75M→95M +26.7%)
    - Opportunités (2 projets: Villa Saly 28.5% ROI 18 mois, Bureaux Diamniadio 35.2% ROI 24 mois avec funding progress, investisseurs)
    - Analytics (rendement moyen 12.1%, volatilité 8.2%, ratio Sharpe 1.45, alpha +3.2%, graphiques 6 mois)
    - Outils (calculateur ROI, analyse risque, optimiseur portfolio, simulateur scénarios, comparateur projets, générateur rapports)
  - InvestisseurSettings.jsx ❌ (fichier manquant — pas de settings)

- **Données mockées:**
  - Portfolio, opportunités, analytics, outils → tout hardcodé dans arrays JavaScript
  - Pas de connexion: investment_opportunities, investor_portfolios, roi_tracking
  
- **Manquant:**
  - Settings investisseur (profil, préférences, abonnement, notifications)
  - Connexion Supabase pour opportunités réelles (depuis properties table avec flag investment_opportunity)
  - Module fractional ownership via blockchain (tokenisation)
  - Paiements réels (actuellement simulés)

**Rôle Admin:**
- Gérer annuaire investisseurs (validation, KYC, suspension)
- Créer/valider opportunités investissement (crowdfunding immobilier)
- Analytics: volume investissements, projets financés, ROI moyen plateforme
- Modération: signalements promoteurs

---

### 2.8 Dashboards Géomètre & Agent Foncier
**État:** ❌ Fichiers inexistants (GeometreDashboard.jsx et AgentFoncierDashboard.jsx non trouvés)
- **Géomètre:** Aucun fichier dashboard ou settings trouvé
- **Agent Foncier:** Aucun fichier dashboard ou settings trouvé

**Besoins complets:**
- Créer GeometreDashboard avec:
  - Missions (bornage, mesure, relevé topographique)
  - Outils (intégration GPS, génération plans, export CAD)
  - Clients (propriétaires, notaires, vendeurs)
  - Rapports géométriques avec signature électronique
  - Settings (profil, équipement, tarifs, certifications)

- Créer AgentFoncierDashboard avec:
  - Parcelles gérées (cadastre, titres fonciers, conflits)
  - Tâches (vérifications, enquêtes terrain, rapports)
  - Clients (propriétaires, administrations, notaires)
  - Documents officiels (certificats, attestations)
  - Settings (profil, administration, tarifs, habilitations)

**Rôle Admin:**
- Gérer annuaire géomètres/agents (validation diplômes, certifications, suspension)
- Valider rapports techniques (géométrie, foncier)
- Analytics: missions complétées, délais moyens, satisfaction
- Modération: plaintes qualité prestations

---

## 3. FONCTIONNALITÉS MANQUANTES CRITIQUES

### 3.1 CMS (Content Management System)
**État:** ❌ Absent
- Aucune table pour gérer pages, sections, blocs
- Tout est hardcodé dans les composants React

**Besoin:**
- Tables: `cms_pages`, `cms_sections`, `seo_meta`, `media_assets`
- Écrans admin: AdminPagesList, AdminPageEditor (builder blocs: Hero, Features, CTA, FAQ, Testimonials)
- API: CRUD pages, publish/draft, preview

---

### 3.2 Marketing & Leads
**État:** ❌ Absent
- Formulaires de contact → `contact_messages` mais pas de gestion leads
- Pas de capture UTM/source
- Pas de funnel tracking

**Besoin:**
- Tables: `marketing_leads`, `form_submissions`, `page_events`, `campaigns`, `funnels`
- Écrans admin: AdminLeadsList, AdminFunnels, AdminCampaigns
- Tracking: onClick CTA → page_events avec user_id ou anon_id

---

### 3.3 A/B Testing & Feature Flags
**État:** ❌ Absent
- Pas de système d'expérimentation
- Pas de rollout progressif features

**Besoin:**
- Tables: `experiments`, `experiment_variants`, `experiment_assignments`, `feature_flags`
- Écrans admin: AdminExperiments, AdminFeatureFlags
- SDK front: hook `useExperiment(key)` pour assigner variant, `useFeatureFlag(key)`

---

### 3.4 Navigation & Traductions
**État:** ⚠️ Partiellement (hardcodées)
- Menus header/footer hardcodés dans ModernHeader, BlockchainFooter
- Pas de traductions FR/EN/WO (tout en français)

**Besoin:**
- Tables: `nav_menu`, `translations`
- Écrans admin: AdminNavigation (drag & drop ordre), AdminTranslations (clés i18n)
- Hook `useTranslation(key, locale)`

---

### 3.5 Analytics Réelles
**État:** ⚠️ Mockées partout
- AdminAnalyticsPage affiche graphiques mockés
- Pas de connexion Google Analytics, Plausible, ou custom

**Besoin:**
- Intégrer analytics provider (Plausible recommandé: privacy-friendly)
- Table `page_views` pour analytics custom (page, user_id, created_at, referrer, utm_*)
- Dashboard admin: vues par page, sources trafic, conversions, funnels

---

### 3.6 Modération & Signalements
**État:** ⚠️ Table `property_reports` existe mais pas d'écran admin
- Pas de gestion signalements utilisateurs/annonces
- Pas de workflow modération

**Besoin:**
- Tables: `reports` (type: property/user/content, reason, status)
- Écran admin: AdminReports (liste, statut, actions: approve/reject/ban)

---

### 3.7 Notifications Système
**État:** ⚠️ Table `admin_notifications` existe mais pas d'interface
- Pas de centre de notifications admin
- Pas de webhook/email automatique sur événements critiques

**Besoin:**
- Écran admin: AdminNotifications (centre de notifications avec actions)
- Système: créer notification sur: nouveau user, propriété en attente, ticket urgent, paiement échoué

---

### 3.8 Système de Facturation & Paiements
**État:** ⚠️ Tables transactions existe, mais pas de vraie intégration
- Pas de Stripe/Wave connecté
- Pas de factures générées
- VendeurSettings simule abonnements

**Besoin:**
- Intégrer Stripe/Wave (webhooks)
- Tables: `invoices`, `payment_methods`, `subscription_plans`
- Écrans admin: AdminRevenue (real-time), AdminInvoices

---

### 3.9 Audit Log & Conformité
**État:** ⚠️ Table `admin_actions` existe, AdminAuditLogPage existe mais mockée
- Logs admin non exploités

**Besoin:**
- Connecter AdminAuditLogPage à `admin_actions` (toutes actions admin loggées)
- Ajouter: filtres par admin, action, date
- Export logs (CSV/PDF)

---

### 3.10 Santé Système & Monitoring
**État:** ❌ Absent
- Pas de page admin pour voir santé système

**Besoin:**
- Écran AdminSystemHealth: 
  - Ping API Supabase (latence)
  - Nombre assets, utilisateurs, propriétés
  - Erreurs récentes (table `error_logs`)
  - Uptime, version app

---

## 4. TABLES SUPABASE À CRÉER

### 4.1 CMS & Contenu
```sql
-- Pages du site (Solutions, Guides, etc.)
CREATE TABLE cms_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT, -- 'solution', 'guide', 'static'
  status TEXT DEFAULT 'draft', -- 'draft', 'published'
  seo_meta JSONB, -- {title, description, og_image, noindex}
  content JSONB, -- Blocs: [{type: 'hero', data: {...}}, {type: 'features', data: [...]}]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sections réutilisables
CREATE TABLE cms_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID REFERENCES cms_pages(id) ON DELETE CASCADE,
  key TEXT NOT NULL, -- 'hero', 'features', 'cta', 'faq'
  content JSONB NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Métadonnées SEO (peut être intégré dans cms_pages ou séparé)
CREATE TABLE seo_meta (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_slug TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  og_image TEXT,
  noindex BOOLEAN DEFAULT FALSE,
  locale TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assets média
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt TEXT,
  tags TEXT[],
  used_in JSONB, -- Où est utilisé l'asset
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Marketing & Leads
```sql
-- Leads marketing
CREATE TABLE marketing_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT, -- 'contact_form', 'pricing_cta', 'solution_demo'
  utm JSONB, -- {source, medium, campaign, term, content}
  form_name TEXT,
  payload JSONB NOT NULL, -- Données formulaire
  status TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Événements pages (tracking custom)
CREATE TABLE page_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL, -- '/solutions/notaires', '/pricing'
  event_type TEXT NOT NULL, -- 'page_view', 'cta_click', 'form_submit'
  user_id UUID REFERENCES auth.users(id), -- NULL si anonyme
  metadata JSONB, -- {cta_label, form_id, utm_*}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campagnes marketing
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  utm_campaign TEXT UNIQUE,
  budget NUMERIC,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Funnels (définitions)
CREATE TABLE funnels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  steps JSONB NOT NULL, -- [{page: '/solutions/vendeurs', event: 'page_view'}, {page: '/register', event: 'form_submit'}]
  goal TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 A/B Testing & Feature Flags
```sql
-- Expériences A/B
CREATE TABLE experiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  goal TEXT, -- 'increase_signup', 'improve_ctr'
  status TEXT DEFAULT 'draft', -- 'draft', 'running', 'completed'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Variantes d'expériences
CREATE TABLE experiment_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- 'control', 'variant_a', 'variant_b'
  traffic NUMERIC DEFAULT 50, -- % trafic
  page_targeting JSONB, -- {pages: ['/solutions/notaires']}
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignations utilisateurs
CREATE TABLE experiment_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experiment_id UUID REFERENCES experiments(id) ON DELETE CASCADE,
  user_or_anon_id TEXT NOT NULL,
  variant_id UUID REFERENCES experiment_variants(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(experiment_id, user_or_anon_id)
);

-- Feature flags
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  rollout NUMERIC DEFAULT 0, -- 0-100 (% utilisateurs)
  audience JSONB, -- {roles: ['admin'], users: ['user_id_1']}
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.4 Navigation & Traductions
```sql
-- Menus (header, footer)
CREATE TABLE nav_menu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL, -- 'header', 'footer'
  items JSONB NOT NULL, -- [{label: 'Accueil', href: '/', order: 1}, ...]
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Traductions i18n
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL, -- 'hero.title', 'cta.explore_properties'
  locale TEXT NOT NULL DEFAULT 'fr', -- 'fr', 'en', 'wo'
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(key, locale)
);
```

### 4.5 Autres Tables Manquantes
```sql
-- Témoignages
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INT DEFAULT 5,
  avatar_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stats site (pour HomePage)
CREATE TABLE site_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL, -- 'total_properties', 'total_users', 'bank_partners'
  value TEXT NOT NULL,
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Formulaires dynamiques
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  schema JSONB NOT NULL, -- {fields: [{name, type, required}]}
  destination TEXT, -- 'contact_messages', 'marketing_leads', webhook URL
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Soumissions formulaires
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES forms(id),
  user_id UUID REFERENCES auth.users(id), -- NULL si anonyme
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tarifs/plans
CREATE TABLE pricing_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL, -- 'service_fee_percent', 'notary_fee_min'
  value NUMERIC NOT NULL,
  label TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Équipe (Contact)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  description TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Erreurs système (monitoring)
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  error_type TEXT,
  message TEXT,
  stack_trace TEXT,
  user_id UUID REFERENCES auth.users(id),
  context JSONB, -- {page, action}
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. PLAN D'ACTION PRIORISÉ

### Phase 1 (Priorité Critique — 3-5 jours) ⭐⭐⭐
**Objectif:** Données réelles partout, admin peut tout gérer

1. **CMS Minimal**
   - Créer tables: `cms_pages`, `cms_sections`, `seo_meta`, `media_assets`
   - Écrans admin: AdminPagesList, AdminPageEditor (builder blocs simple)
   - Connecter 1 page Solutions (Notaires) au CMS en mode lecture
   - Service: `GlobalAdminService.getPage(slug)`, `savePage()`, `publishPage()`

2. **Leads & Contact**
   - Créer tables: `marketing_leads`, `team_members`, `page_events`
   - Connecter ContactPage → `marketing_leads` avec UTM capture
   - Écran admin: AdminLeadsList (inbox, assignation, statut, réponse)
   - Tracking CTA: onClick → `page_events`

3. **Settings Complets (Tous Dashboards)**
   - Vendeur: compléter abonnements (vraie logique métier)
   - Particulier: ajouter préférences recherche, méthodes paiement
   - Notaire: tarifs notaire configurables
   - Admin: compléter ModernSettingsPage avec toutes les configs

4. **Analytics Basiques**
   - Intégrer Plausible Analytics (script)
   - Table `page_views` pour analytics custom
   - Écran admin: AdminAnalytics (vues pages, sources trafic, conversions)

5. **Modération**
   - Écran admin: AdminReports (liste signalements, actions)
   - Connecter à `property_reports` existant

---

### Phase 2 (Priorité Haute — 5-7 jours) ⭐⭐
**Objectif:** Marketing automation, expérimentation

1. **Funnels & Événements**
   - Tables: `funnels`, `campaigns`
   - Écran admin: AdminFunnels (visualisation parcours, conversions par étape)
   - Écran admin: AdminCampaigns (CRUD campagnes, tracking UTM)

2. **A/B Testing**
   - Tables: `experiments`, `experiment_variants`, `experiment_assignments`
   - Hook front: `useExperiment(key)` → assign variant, render conditionnel
   - Écran admin: AdminExperiments (CRUD tests, résultats)

3. **Feature Flags**
   - Table: `feature_flags`
   - Hook front: `useFeatureFlag(key)`
   - Écran admin: AdminFeatureFlags (toggle, rollout %)

4. **Navigation & Traductions**
   - Tables: `nav_menu`, `translations`
   - Écran admin: AdminNavigation (drag & drop menu)
   - Écran admin: AdminTranslations (clés i18n FR/EN/WO)
   - Hook: `useTranslation(key)`

5. **Notifications Admin**
   - Connecter AdminNotifications à `admin_notifications`
   - Créer notifications sur événements critiques (webhook)

---

### Phase 3 (Priorité Moyenne — 7-10 jours) ⭐
**Objectif:** Professionnalisme, conformité

1. **Facturation & Paiements Réels**
   - Intégrer Stripe (webhooks)
   - Tables: `invoices`, `payment_methods`, `subscription_plans` (vraie structure métier)
   - Écran admin: AdminRevenue (revenus temps réel), AdminInvoices

2. **Audit Log Complet**
   - Connecter AdminAuditLogPage à `admin_actions`
   - Ajouter filtres, exports

3. **Système Monitoring**
   - Écran: AdminSystemHealth (santé API, erreurs, uptime)
   - Table: `error_logs` (capture erreurs front/back)

4. **Témoignages & Stats Dynamiques**
   - Tables: `testimonials`, `site_stats`
   - Écran admin: AdminTestimonials (CRUD, modération)
   - HomePage connectée à Supabase pour stats/testimonials réels

5. **Autres Dashboards (Banque, Mairie, etc.)**
   - Connecter chaque dashboard aux tables Supabase
   - Compléter Settings pour chaque rôle

---

### Phase 4 (Améliorations — 10+ jours) ⚡
**Objectif:** Optimisation, scale

1. **SEO Avancé**
   - Génération sitemaps automatique
   - Structured data (JSON-LD)
   - Audit SEO interne (écran admin)

2. **Blog Complet**
   - Connecter BlogPage à `blog_posts` (réel)
   - Gestion tags, catégories, commentaires
   - Analytics par article

3. **Exports & Rapports**
   - Exports CSV/PDF (properties, leads, analytics)
   - Rapports automatisés (hebdo/mensuel email)

4. **Chatbot & Support Automatisé**
   - Intégrer assistant IA pour support niveau 1
   - Réponses automatiques tickets (catégorisation)

5. **Blockchain Réelle**
   - Implémenter smart contracts (déploiement testnet)
   - Intégration wallet (MetaMask)
   - NFT properties (minting)

---

## 6. ARCHITECTURE NOUVEAU DASHBOARD ADMIN

### 6.1 Navigation Principale (Sidebar)
```
📊 Aperçu (Dashboard)
  - KPI temps réel (users, properties, leads, revenue, tickets)
  - Flux d'activité récent
  - Graphiques tendances

📝 Contenu & Site
  - Pages & Sections (CMS)
  - SEO & Blog
  - Media Library
  - Navigation (header/footer)
  - Traductions (FR/EN/WO)

📈 Marketing & Croissance
  - Leads (inbox, assignation, suivi)
  - Funnels & Événements (analytics parcours)
  - Campagnes (UTM tracking)
  - A/B Tests (expériences)
  - Feature Flags

⚙️ Opérations
  - Utilisateurs (CRUD, suspension)
  - Propriétés (validation, modération)
  - Transactions (statuts, refunds)
  - Support/Tickets (inbox, réponses)
  - Rapports & Modération (signalements)

🛡️ Conformité & Qualité
  - Audit Log (actions admin)
  - Vérifications (KYC/KYB en attente)
  - Système (santé, erreurs, uptime)

⚙️ Paramètres
  - Plateforme (général, notifications, sécurité, paiements)
  - Intégrations (IA, Blockchain, Analytics)
  - Accès & Rôles (gestion permissions)
```

### 6.2 Écrans Prioritaires à Créer (Phase 1)
1. **AdminDashboardNew.jsx** (Overview avec KPI réels)
2. **AdminPagesList.jsx** (CMS liste pages)
3. **AdminPageEditor.jsx** (CMS éditeur blocs)
4. **AdminLeadsList.jsx** (Leads inbox)
5. **AdminAnalyticsReal.jsx** (Analytics connecté)
6. **AdminReportsList.jsx** (Modération signalements)

### 6.3 Services à Créer/Compléter
1. **GlobalAdminService.js** (compléter avec CMS, leads, analytics)
2. **CMSService.js** (CRUD pages, blocs, media)
3. **MarketingService.js** (leads, campaigns, events)
4. **AnalyticsService.js** (fetch/agrégation analytics)
5. **ModerationService.js** (reports, actions)

### 6.4 Hooks Prioritaires
1. **useAdminCMS()** (pages, savePage, publishPage)
2. **useAdminLeads()** (leads, assignLead, updateStatus)
3. **useAdminAnalytics()** (pageViews, conversions, funnels)
4. **useAdminReports()** (reports, moderateReport)
5. **useExperiment(key)** (frontend A/B testing)
6. **useFeatureFlag(key)** (frontend feature flags)
7. **useTranslation(key)** (i18n)

---

## 7. LIVRABLES IMMÉDIATS (pour commencer Phase 1)

### 7.1 DDL Supabase (à exécuter)
- Créer toutes les tables Phase 1 (cms_pages, cms_sections, seo_meta, media_assets, marketing_leads, team_members, page_events, pricing_config, testimonials, site_stats)

### 7.2 Services
- `CMSService.js` (getPages, getPage, savePage, publishPage, uploadAsset)
- `MarketingService.js` (createLead, getLeads, updateLeadStatus, trackEvent)
- Compléter `GlobalAdminService.js` avec méthodes CMS/leads/analytics

### 7.3 Hooks
- `useAdminCMS()` (listPages, loadPage, savePage, publish)
- `useAdminLeads()` (listLeads, assignLead, updateStatus, reply)

### 7.4 Composants Admin
- `AdminPagesList.jsx` (table pages avec statut, actions)
- `AdminPageEditor.jsx` (builder blocs: Hero, Features, CTA, FAQ avec preview)
- `AdminLeadsList.jsx` (inbox leads avec filtres source/status/assigned)

### 7.5 Composants Front
- `CMSPage.jsx` (render page dynamique depuis cms_pages content JSONB)
- Connecter `SolutionsNotairesPage` au CMS (mode progressive enhancement)
- Hook `usePageTracking()` pour tracking événements (onClick CTA)

---

## 8. RÉSUMÉ EXÉCUTIF — CONSTAT COMPLET

### 8.1 État Actuel Détaillé

**Pages Publiques (9 types, ~20 pages):**
- ✅ **Fonctionnelles mais statiques:** HomePage, PricingPage, ContactPage, 12 Solutions, BlogPage
- ⚠️ **Contenu 95% hardcodé:** Arrays JavaScript (testimonials, stats, features, blog posts, pricing)
- ⚠️ **Contact forme écrit en DB** mais pas d'admin pour lire/répondre
- ❌ **Blog ne lit PAS** la table blog_posts (posts hardcodés alors que table existe)
- ❌ **Guides absents** (0 pages trouvées sur ~10 prévues)
- ⚠️ **Outils existence incertaine** (à scanner)

**Dashboards par Rôle (10 rôles):**
| Rôle | Dashboard | Settings | État Données | Complétude |
|------|-----------|----------|--------------|------------|
| **Admin** | ✅ Plusieurs (confusion) | ⚠️ Incomplet (IA/Blockchain prep) | 60% Réel, 40% Mock | 60% |
| **Vendeur** | ✅ CompleteSidebarVendeur | ✅ VendeurSettingsRealData | 80% Réel | 85% |
| **Acheteur/Particulier** | ✅ DashboardParticulierRefonte | ✅ ParticulierSettings_FUNCTIONAL | 85% Réel | 90% |
| **Notaire** | ✅ CompleteSidebarNotaire | ⚠️ NotaireSettingsModernized (mock) | 75% Réel | 70% |
| **Banque** | ❌ Manquant | ✅ BanqueSettings (ultra-complet mock) | 10% Réel | 40% |
| **Mairie** | ❌ Manquant | ✅ MairieSettings (complet mock) | 5% Réel | 35% |
| **Investisseur** | ✅ InvestisseurDashboard (complet mock) | ❌ Manquant | 0% Réel | 50% |
| **Géomètre** | ❌ Inexistant | ❌ Inexistant | 0% | 0% |
| **Agent Foncier** | ❌ Inexistant | ❌ Inexistant | 0% | 0% |
| **Promoteur** | ⚠️ Incertain | ⚠️ Incertain | ? | ? |

**Dashboard Admin:**
- ✅ **Opérations de base OK:** Users (CRUD), Properties (validation), Transactions (suivi), Tickets (support)
- ⚠️ **Analytics mockées partout:** AdminAnalyticsPage affiche graphiques fictifs
- ❌ **0 CMS:** Impossible de modifier contenu site (pages publiques, blog, pricing)
- ❌ **0 Leads Management:** contact_messages écrits mais aucun écran pour lire/assigner/répondre
- ❌ **0 Marketing Tools:** Pas de funnels, A/B tests, feature flags, campagnes UTM
- ❌ **0 Modération complète:** property_reports existe mais workflow incomplet
- ❌ **Notifications pas exploitées:** admin_notifications existe, pas d'interface

### 8.2 Problèmes Critiques Identifiés

#### 🚨 **Critique P0 (Bloquant Métier):**
1. **Pas de CMS** → Équipe marketing ne peut pas modifier contenu site (itérations impossibles)
2. **Leads perdus** → Tous les contacts formulaires non traités, pas de suivi conversion
3. **Blog déconnecté** → Table blog_posts inutilisée, contenu hardcodé impossible à maintenir
4. **Settings incomplets** → Abonnements/paiements simulés dans Vendeur/Banque/Mairie (pas de vraie logique métier)
5. **Dashboards manquants** → Banque, Mairie, Géomètre, Agent Foncier sans dashboard principal (Settings seuls inutiles)

#### ⚠️ **Haute Priorité P1 (Scalabilité):**
6. **0 Analytics réelles** → Aucune donnée comportement utilisateur (funnels, abandons, sources)
7. **0 A/B Testing** → Impossible d'optimiser conversions sans expérimentation
8. **Pas de tracking événements** → CTA clics, page views, form submits non loggés
9. **Modération incomplète** → Signalements non gérés, pas de workflow admin
10. **Notifications admin absentes** → Admin pas alerté sur événements critiques (nouveau user, propriété en attente, ticket urgent)

#### 📊 **Moyenne Priorité P2 (Professionnalisme):**
11. **Paiements simulés** → Pas de vraie intégration Stripe/Wave, factures/invoices mockées
12. **Audit Log non exploité** → admin_actions existe mais AdminAuditLogPage ne le lit pas
13. **Traductions absentes** → Tout en français, diaspora anglophone/arabophone non servie
14. **Feature Flags manquants** → Impossible de déployer progressivement nouvelles features
15. **Guides absents** → 0 contenu éducatif alors que 10+ guides planifiés

### 8.3 Données Quantitatives

**Tables Supabase Existantes vs Utilisées:**
- ✅ **Utilisées (12):** users, profiles, properties, transactions, support_tickets, ticket_responses, contact_messages, admin_actions, admin_notifications, property_reports, report_actions, platform_settings
- ⚠️ **Existantes mais inutilisées (3):** blog_posts, subscriptions (partiellement), user_notification_settings (partiellement)
- ❌ **Manquantes (17+):** cms_pages, cms_sections, seo_meta, media_assets, marketing_leads, page_events, campaigns, funnels, experiments, feature_flags, nav_menu, translations, testimonials, site_stats, forms, pricing_config, team_members, error_logs

**Code Stats (estimé):**
- **Pages publiques:** ~20 fichiers JSX, ~15 000 lignes, 90% contenu statique
- **Dashboards:** ~50 fichiers JSX, ~35 000 lignes, 50% données réelles
- **Services/Hooks:** ~15 fichiers, ~8 000 lignes, 60% connectés Supabase
- **Admin pages:** ~25 fichiers, ~20 000 lignes, 40% moderne (60% à refaire)

### 8.4 Impact Métier Actuel

**Ce que l'admin NE PEUT PAS faire:**
- ❌ Modifier textes HomePage/Solutions/Pricing sans coder
- ❌ Gérer les 50+ contacts reçus via formulaire Contact
- ❌ Publier/éditer articles de blog (hardcodés dans code)
- ❌ Voir d'où viennent les utilisateurs (sources, UTM, funnels)
- ❌ Tester variantes de CTA/pages (A/B tests)
- ❌ Activer/désactiver features progressivement (flags)
- ❌ Voir analytics réelles (vues pages, conversions, abandons)
- ❌ Gérer signalements sur propriétés/utilisateurs (workflow incomplet)
- ❌ Gérer vraiment les abonnements (Stripe non intégré)
- ❌ Voir les logs d'actions admin (écran déconnecté)

**Ce que l'admin PEUT faire:**
- ✅ CRUD utilisateurs (créer, modifier, suspendre)
- ✅ Valider propriétés en attente (approval flow)
- ✅ Suivre transactions (statuts, montants)
- ✅ Répondre aux tickets support (workflow complet)
- ✅ Voir stats de base (nombre users, propriétés, transactions)

### 8.5 Solution Proposée

**Phase 1 (Critique — 3-5 jours) ⭐⭐⭐**
1. ✅ **CMS Minimal**
   - Tables: cms_pages, cms_sections, seo_meta, media_assets
   - Écrans: AdminPagesList, AdminPageEditor (builder blocs)
   - Connecter 1 page Solutions au CMS (POC)
   - Service: CMSService (getPage, savePage, publishPage)

2. ✅ **Leads & Contact**
   - Tables: marketing_leads, team_members, page_events
   - Écran: AdminLeadsList (inbox, assignation, statut, réponse)
   - Connecter ContactPage → marketing_leads avec UTM
   - Tracking: onClick CTA → page_events

3. ✅ **Blog Réel**
   - Connecter BlogPage à table blog_posts (requête Supabase)
   - Écran: AdminBlogEditor (CRUD articles, tags, catégories)
   - Remplacer array hardcodé par useEffect fetch

4. ✅ **Settings Complets (Tous Rôles)**
   - Vendeur: compléter abonnements (vraie logique Stripe)
   - Particulier: ajouter préférences recherche, méthodes paiement
   - Notaire: tarifs configurables (table pricing_config)
   - Banque/Mairie/Investisseur: créer dashboards principaux

5. ✅ **Analytics Basiques**
   - Intégrer Plausible Analytics (script tag)
   - Table: page_views (page, user_id, referrer, utm_*)
   - Écran: AdminAnalytics (vues, sources, conversions)

**Phase 2 (Haute — 5-7 jours) ⭐⭐**
6. Funnels & Événements (campaigns, funnels tables + AdminFunnels)
7. A/B Testing (experiments tables + useExperiment hook + AdminExperiments)
8. Feature Flags (feature_flags table + useFeatureFlag hook + AdminFeatureFlags)
9. Navigation & Traductions (nav_menu, translations + AdminNav, AdminTranslations)
10. Notifications Admin (connecter AdminNotifications à admin_notifications + webhooks)

**Phase 3 (Moyenne — 7-10 jours) ⭐**
11. Facturation Réelle (Stripe webhooks, invoices, payment_methods)
12. Audit Log Complet (connecter AdminAuditLogPage à admin_actions)
13. Monitoring Système (AdminSystemHealth: santé API, erreurs, uptime)
14. Témoignages & Stats (testimonials, site_stats + modération + HomePage dynamique)
15. Dashboards Manquants (Banque, Mairie, Géomètre, Agent Foncier principaux)

### 8.6 Métriques de Succès (Post-Phase 1)

**Admin pourra:**
- ✅ Éditer 12+ pages Solutions en 5 min (via CMS vs 2h dev)
- ✅ Gérer 100+ leads/mois avec assignation/statut (vs 0 actuellement)
- ✅ Publier 4+ articles blog/mois sans dev (vs impossible)
- ✅ Voir analytics: 10K vues/mois, sources trafic, conversions (vs aveugles)
- ✅ Tracking: 50+ événements/jour (CTA clics, form submits)

**Impact Business:**
- 📈 **Temps itération contenu:** 2h → 5 min (-95%)
- 📈 **Leads traités:** 0% → 100%
- 📈 **Visibilité comportement:** 0% → 80%
- 📈 **Capacité expérimentation (A/B):** 0 → ∞
- 📈 **Autonomie équipe marketing:** 0% → 90%

### 8.7 Livrables Immédiats (Post-Validation)

**DDL SQL (Phase 1 — 8 tables):**
```sql
-- À exécuter dans Supabase
CREATE TABLE cms_pages (...);
CREATE TABLE cms_sections (...);
CREATE TABLE seo_meta (...);
CREATE TABLE media_assets (...);
CREATE TABLE marketing_leads (...);
CREATE TABLE team_members (...);
CREATE TABLE page_events (...);
CREATE TABLE pricing_config (...);
```

**Services (3 nouveaux + 1 complété):**
- CMSService.js (getPages, getPage, savePage, publishPage, uploadAsset)
- MarketingService.js (createLead, getLeads, updateLeadStatus, trackEvent)
- BlogService.js (getPosts, getPost, createPost, updatePost, deletePost)
- GlobalAdminService.js (compléter avec méthodes CMS/leads/analytics)

**Hooks (3 nouveaux):**
- useAdminCMS() (listPages, loadPage, savePage, publish)
- useAdminLeads() (listLeads, assignLead, updateStatus, reply)
- usePageTracking() (trackView, trackClick, trackSubmit)

**Composants Admin (3 écrans critiques):**
- AdminPagesList.jsx (table pages avec statut, actions CRUD)
- AdminPageEditor.jsx (builder blocs: Hero, Features, CTA, FAQ avec preview)
- AdminLeadsList.jsx (inbox leads avec filtres source/status/assigned)

**Composants Front (2 modifications + 1 nouveau):**
- BlogPage.jsx (remplacer array par fetch Supabase blog_posts)
- SolutionsNotairesPage.jsx (connecter au CMS en mode progressive)
- CMSPage.jsx (nouveau composant render page dynamique depuis JSONB)

**Durée estimée Phase 1:** 3-5 jours
**Ressources:** 1 dev fullstack + 1 designer (pour AdminPageEditor UI)

---

## 9. PROCHAINES ÉTAPES IMMÉDIATES

1. ✅ **Validation Plan** (toi + équipe)
2. 🔧 **Créer migration Supabase** (8 tables Phase 1)
3. 🎨 **Designer AdminPageEditor UI** (builder blocs)
4. 💻 **Développer 3 services** (CMS, Marketing, Blog)
5. 💻 **Développer 3 hooks** (useAdminCMS, useAdminLeads, usePageTracking)
6. 💻 **Développer 3 écrans admin** (PagesList, PageEditor, LeadsList)
7. 💻 **Connecter BlogPage** à blog_posts (supprimer array hardcodé)
8. 💻 **Intégrer Plausible Analytics** (script + dashboard)
9. ✅ **Tester Phase 1** (validation fonctionnelle complète)
10. 🚀 **Déployer Phase 1** → passer Phase 2

---

**Fin de l'audit complet. Document prêt pour validation et exécution.** 🎯
