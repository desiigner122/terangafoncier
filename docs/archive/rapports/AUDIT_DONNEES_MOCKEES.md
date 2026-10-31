# 🔍 Audit des données mockées — Teranga Foncier

> Audit réalisé par 4 agents IA en parallèle sur l'ensemble de `src/` (1033 fichiers).
> Objectif : identifier toutes les données fictives / codées en dur / simulées à remplacer par de vraies données Supabase.

## Synthèse générale

| Périmètre | Occurrences | Fichiers |
|-----------|------------:|---------:|
| `src/data/` + `src/pages/` | ~180 | ~110 |
| `src/services/` `lib/` `api/` `hooks/` `context(s)/` | ~90 | ~35 |
| `src/components/` | ~48 | ~33 |
| **Total (dédupliqué, estimé)** | **~300** | **~150** |

**Ampleur : ÉLEVÉE.** Les mocks ne sont **pas centralisés** derrière un flag global — ils sont **inlinés partout**, ce qui impose un nettoyage fichier par fichier.

### Constats transverses
- ✅ **Aucune dépendance `@faker-js/faker`** et aucun `lorem ipsum` — toutes les fausses données sont générées via `Math.random()` (324 occurrences / 79 fichiers, dont une bonne part sert à fabriquer de fausses métriques).
- ⚠️ **Aucun flag global** (`USE_MOCK`, `DEMO_MODE`…) → impossible de tout désactiver d'un coup.
- 🔄 **Migration inachevée** : nombreux doublons `*RealData.jsx` coexistant avec les versions mockées (le suffixe « RealData » est parfois trompeur — certains génèrent quand même des scores via `Math.random()`).

---

## 🔴 TIER 1 — CRITIQUE (sécurité & intégrité des données)

À traiter en priorité absolue : ces éléments touchent la sécurité ou polluent la vraie base de données.

| Fichier | Problème |
|---------|----------|
| `src/services/LocalAuthService.js` | 9 comptes codés en dur avec **mots de passe en clair** (`admin@local`/`admin123`…) qui **contournent Supabase Auth**. `quickSignIn(role)` = connexion sans mot de passe. Utilisé via `contexts/TempSupabaseAuthContext.jsx:52`. |
| `src/lib/senegalDataManager.js:152` | `createRealisticDemoData()` **insère activement 50 fausses propriétés dans la table Supabase `properties`** — pollution de données réelles. |
| `src/lib/userActionsManager.js` | **100% mock** : `searchUsers()` renvoie 5 users en dur, `getUserStats()` renvoie `total_users: 1247`. Auto-`seedMockData()` au chargement. |
| `src/lib/userStatusManager.js` | **100% mock (stubs)** : ban/unban/verify/changeRole ne font que `console.log`. Aucune action réelle sur la table `users`. |
| `src/lib/auth.js:47-106` | Hook `useAuth()` : `signIn`/`signUp` renvoient un `mockUser` après un `setTimeout`, sans jamais appeler Supabase. |
| `src/contexts/TempSupabaseAuthContext.jsx` | Session fictive persistée via `localStorage['temp_auth']`, prioritaire sur Supabase. |

---

## 🟠 TIER 2 — Cœur métier (le « faux back-end »)

Le dossier `src/data/` et plusieurs services fournissent des données métier fictives à toute l'application.

### `src/data/` — quasi intégralement fictif
| Fichier | Contenu mocké |
|---------|---------------|
| `parcelsData.js` | Générateur de **60 parcelles** via `Math.random()` : prix, surfaces, coordonnées, n° de titre foncier (`TF <random>`), images `unsplash`, documents `example.com`. `sampleParcels` = catalogue entier. |
| `userData.js` | **Tous** les utilisateurs, demandes (`REQ-2025-00x`), transactions (`TRN-00x`), messages, notifications, favoris, conversations. |
| `adminData.js` | Toutes les stats dashboard (`totalUsers: 532`, garanties « 2 Milliards XOF », rendements…) + activités récentes. |
| `actorsData.js` | Notaires (« Maître Diop/Fall/Sow ») et banques (« BDS », « CBA ») inventés. |
| `systemRequestsData.js` | Demandes système `SYSREQ-00x`. |
| `blogData.js` | 5 articles de blog en dur (auteurs « Expert Foncier »…). |
| `sampleData.js` / `index.js` | Hub d'agrégation des données d'exemple. |

### Services de données
| Fichier | Problème |
|---------|----------|
| `src/services/TerangaAIService.js:45` | Table complète de prix marché par zone (Dakar-Plateau 150 000 FCFA/m²…) **codée en dur** — cœur de toutes les estimations. |
| `src/services/AIService.js:13` | `marketData` (prix/m², hotZones Almadies/Ngor/VDN) en dur. |
| `src/services/HybridDataService.js` | Fallbacks `getDefaultUsersData()`/`getDefaultPlansData()` (users & plans codés en dur) + croissance/visites via `Math.random()`. |
| `src/lib/globalAnalytics.js` | Chaque méthode retombe sur un `getMock*()` : géo (Sénégal 15420…), temporel (30j de random), temps réel (`active_users_now: 347`). |
| `src/lib/localTerritorialManager.js` | Régions/départements/communes du Sénégal codés en dur (~24 communes) au lieu des tables Supabase. |
| `src/services/GlobalAdminService.js` | Anomalies, tendances marché, prédictions IA via `Math.random()`. |

---

## 🟡 TIER 3 — Dashboards métier (stats & listes en dur)

Presque tous les dashboards par rôle affichent des tableaux/KPI codés en dur. Extrait :

- **Vendeur** : `ModernVendeurDashboard.jsx` (~20 valeurs blockchain/IA via `Math.random()`), `VendeurAIRealData.jsx`, `VendeurAntiFraudeRealData.jsx`, `VendeurPhotosRealData.jsx`, `VendeurBlockchainRealData.jsx` (scores/prix/hash aléatoires malgré le nom « RealData »).
- **Banque** : `BanquePerformances`, `BanqueTransactions`, `BanqueRiskManagement`, `BanqueClients`, `BanqueProduits`, `BanqueReports`, `BanqueFormation` (`mock*`), + `BanqueOverview/AntiFraude/GPS/AI` (`Math.random()`).
- **Géomètre** : dossier `geometre/` massivement en dur (`GeometreCRM`, `Clients`, `Cadastral`, `Messages`, `Rapports`, `Blockchain`, `Overview`…).
- **Notaire** : `NotaireCompliance.backup`, `NotaireArchives.backup`, `NotaireAIModernized`, dashboards stats.
- **Investisseur** : `OpportunitiesPage`, `MarketAnalysisPage`, `InvestmentsPage`, `DueDiligencePage` (`mock*`).
- **Particulier / Promoteur** : propriétés, constructions, transactions blockchain, calendrier (tél. `+221 77 000 00 00`).
- **Agent foncier** : `AgentFoncierClients/Terrains/GPS/Messages/Documents/Overview` (tableaux en dur, emails `@example.com`).

### Pages (`src/pages/`)
- Profils publics : `NotaryProfilePage`, `GeometerProfilePage`, `InvestorProfilePage`, `PromoterProfilePage`, `BankProfilePage`, `AgentProfilePage`, `SellerProfilePage`, `MunicipalityProfilePage` (objets `mock*`). `UserProfilePage.jsx:151` génère rating/followers via `Math.random()`.
- Admin : `UserManagementPage`, `SubscriptionManagementPage`, `BulkExportPage` (`Jean Dupont`/`Marie Martin @example.com`), + actions « Simulation » dans la plupart des pages admin.
- Cartes & zones : `CommunalZonesPage`, `ZoneCommunaleDetailPage`, `InteractiveMapPage`, `CarteInteractive`, `CartePage` (`mockZones`/`properties`).
- Divers : `MessagesPage`, `PaymentPage`, `UploadsPage`, `DigitalVaultPage`, `TerrainProgressPage`, `ProjectDetailPage`, `ParcelleDetailPageBlockchain`.

---

## 🟢 TIER 4 — Page d'accueil & marketing (`src/components/home/`)

La page d'accueil affiche presque exclusivement des KPI, parcelles, vendeurs et témoignages **inventés** (~22 fichiers).

- **Bandeaux de KPI fictifs** : `BlockchainStyleMetricsBar` (20 KPI), `ModernMetricsBar`, `PropertyMetricsBar`, `AILiveMetricsBar`, `LiveMetricsBar`, `RealTimeStatsSection` (+ `Math.random()` « temps réel »).
- **Listes fictives** : `FeaturedParcels`, `SellersSection`, `MarketTickerBar`, `FeaturesPreviewSection`, `ModernHeroSlider`, `BinanceStyleHeroSlider`.
- **Témoignages inventés** : `Testimonials`, `sections/TestimonialsSection`, `sections/TrustedSellersSection`.
- **Fallbacks fictifs** : `sections/ArticlesSection` (`defaultArticles`), `sections/ReviewsSection` (`defaultReviews`) — servis si Supabase vide.
- **Autres composants** : `defi/DeFiNFTMarketplace` (pools/NFT/TVL 100% en dur), `project/ProjectTrackingPage` + `ProjectBlockchainTracking` (VEFA + chaîne blockchain fictives), `admin/FraudMonitoringPanel` (stats anti-fraude via `Math.random()` — trompeur pour un panneau de sécurité).

---

## ⚙️ TIER 5 — Flags de simulation (activés par défaut)

Ces modules basculent silencieusement en mode simulé si une clé/connexion manque :

| Flag | Fichier | État |
|------|---------|------|
| `simulationMode = true` | `src/services/ai/OpenAIService.js:13` | **Activé par défaut** |
| `simulationMode` | `src/services/blockchain/BlockchainService.js:57` | Activé au moindre échec de connexion |
| mode simulation | `src/lib/aiManager.js:19` | Si clé OpenAI manquante |
| mode simulation | `src/api/stripe.js:66` | Si clé Stripe manquante → **paiements simulés** |
| « Mode comptes de test » | `context/SupabaseAuthContext.jsx`, `contexts/TerangaAuthContext.jsx` | Contextes désactivés |

Blockchain simulée aussi dans : `BlockchainAIService.js` (métriques `Math.random()` + fallback `totalTransactions: 15247`), `TerrainBlockchainService.js`, `NotaireSupabaseService.js`, `lib/blockchain/smartContracts.js`, `tokenManager.js`.

---

## 📌 Recommandations de remédiation (ordre suggéré)

1. **Sécurité d'abord (Tier 1)** — supprimer `LocalAuthService.js` et les bypass d'auth ; désactiver `senegalDataManager.createRealisticDemoData()` pour stopper la pollution de la base ; brancher `userActionsManager`/`userStatusManager` sur Supabase.
2. **Cœur métier (Tier 2)** — migrer `src/data/*` vers des requêtes Supabase ; externaliser les tables de prix marché (`TerangaAIService`/`AIService`) dans une table `market_data`.
3. **Dashboards (Tier 3)** — remplacer les tableaux en dur par des requêtes réelles ; consolider les doublons `*RealData` et supprimer les versions mockées.
4. **Page d'accueil (Tier 4)** — brancher les KPI/parcelles/témoignages sur Supabase ou les retirer.
5. **Flags (Tier 5)** — décider explicitement du comportement quand une clé manque (échec visible plutôt que simulation silencieuse).

> 💡 Piste d'architecture : introduire un unique flag `VITE_USE_MOCK` + une couche `dataProvider` pour centraliser mock/réel, afin d'éviter que les mocks ne se re-dispersent.
