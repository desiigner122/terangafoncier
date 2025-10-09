# 🎯 STRATÉGIE DASHBOARD PARTICULIER - ARCHITECTURE FLUX

## Date: 2025-10-08
## Principe: Dashboard = Centre de Suivi des Actions Publiques

---

## 📍 FLUX UTILISATEUR COMPLET

### 1️⃣ PAGES PUBLIQUES (Sans Connexion)
**Découverte & Exploration**

#### A. Terrains Privés (`/terrain-marketplace`)
- Galerie tous les terrains disponibles
- Filtres (ville, prix, surface, type)
- Carte interactive
- Détails terrain (photos, prix, localisation, vendeur)
- **Actions** :
  - ❤️ Ajouter aux favoris → Nécessite connexion
  - 💬 Contacter vendeur → Nécessite connexion
  - 📅 Planifier visite → Nécessite connexion
  - 💰 Faire une offre → Nécessite connexion

#### B. Zones Communales (`/zones-communales-publiques`)
- Liste zones communales disponibles par mairie
- Filtres (commune, prix, superficie, type zone)
- Critères éligibilité
- Plan parcellaire
- **Actions** :
  - 📝 Demander attribution → Nécessite connexion
  - ❤️ Ajouter aux favoris → Nécessite connexion
  - 📞 Contacter mairie → Nécessite connexion

#### C. Projets Promoteurs (`/projets-promoteurs`)
- Catalogue projets immobiliers (villas, appartements)
- Filtres (localisation, prix, type, promoteur)
- Plans 3D, photos, descriptifs
- **Actions** :
  - 📋 Candidater au projet → Nécessite connexion
  - ❤️ Ajouter aux favoris → Nécessite connexion
  - 💬 Contacter promoteur → Nécessite connexion

---

### 2️⃣ AUTHENTIFICATION
**Popup/Modal Connexion** si utilisateur clique sur une action

```
Action cliquée → État non connecté → Modal Login/Register
→ Connexion réussie → Action exécutée
→ Redirection dashboard suivi
```

---

### 3️⃣ DASHBOARD PARTICULIER (Après Connexion)
**Centre de Suivi & Gestion**

#### Architecture Pages :

##### A. Vue d'ensemble (`/acheteur`)
- **Stats** :
  - Terrains favoris : X
  - Demandes en cours : Y
  - Candidatures projets : Z
  - Messages non lus : N
- **Activités récentes** :
  - Demande zone approuvée
  - Nouveau favori ajouté
  - Message vendeur reçu
  - Candidature pré-sélectionnée
- **Actions rapides** :
  - Voir tous mes favoris
  - Nouvelle demande
  - Contacter support

##### B. Mes Favoris (`/acheteur/favoris`) ✅ EXISTE (mockée)
**Ce qui est déjà fait** :
- Liste favoris par catégorie (terrains privés, zones communales, projets)
- Filtres par type
- Actions : Retirer favori, Voir détails, Contacter

**À connecter aux vraies données** :
```sql
-- Table favorites
SELECT f.*, 
  CASE 
    WHEN f.property_id IS NOT NULL THEN 'terrain_prive'
    WHEN f.communal_zone_id IS NOT NULL THEN 'zone_communale'
    WHEN f.developer_project_id IS NOT NULL THEN 'projet_promoteur'
  END as type,
  p.title, p.price, p.surface_area, -- Pour terrains
  cz.name, cz.commune, -- Pour zones communales
  dp.title, dp.developer_name -- Pour projets
FROM favorites f
LEFT JOIN properties p ON f.property_id = p.id
LEFT JOIN communal_zones cz ON f.communal_zone_id = cz.id
LEFT JOIN developer_projects dp ON f.developer_project_id = dp.id
WHERE f.user_id = :user_id
ORDER BY f.created_at DESC
```

##### C. Demandes Zones Communales (`/acheteur/zones-communales`) 
**Alias** : `/acheteur/communal` ✅ EXISTE (ParticulierCommunal.jsx mockée)

**Ce qui est déjà fait** :
- Liste demandes (en cours, terminées, rejetées)
- Détails demande (progression, documents, historique)
- Actions : Upload documents, Contacter mairie

**À connecter** :
```sql
-- Table communal_zone_requests
SELECT czr.*, cz.name, cz.commune, cz.price
FROM communal_zone_requests czr
JOIN communal_zones cz ON czr.zone_id = cz.id
WHERE czr.user_id = :user_id
ORDER BY czr.created_at DESC
```

##### D. Projets Promoteurs (`/acheteur/promoteurs`) ✅ EXISTE (mockée)
**Ce qui est déjà fait** :
- Liste candidatures (en cours, acceptées, rejetées)
- Détails candidature (progression, documents, historique)
- Actions : Upload docs, Contacter promoteur

**À connecter** :
```sql
-- Table developer_project_applications
SELECT dpa.*, dp.title, dp.developer_name, dp.location
FROM developer_project_applications dpa
JOIN developer_projects dp ON dpa.project_id = dp.id
WHERE dpa.user_id = :user_id
ORDER BY dpa.created_at DESC
```

##### E. Terrains Privés (`/acheteur/terrains-prives`) 
**Status** : Page existe mais à vérifier

**Fonction** : Suivi des interactions avec terrains privés
- Offres soumises
- Visites planifiées
- Messages vendeurs

**À connecter** :
```sql
-- Intérêts terrains privés (pas d'offres formelles dans votre modèle actuel)
SELECT pi.*, p.title, p.price, p.city, pr.full_name as owner_name
FROM property_interests pi
JOIN properties p ON pi.property_id = p.id
JOIN profiles pr ON p.owner_id = pr.id
WHERE pi.user_id = :user_id
ORDER BY pi.created_at DESC
```

##### F. Demandes Construction (`/acheteur/construction`) ✅ EXISTE
**Fonction** : Demandes construction clé en main (service)

**À connecter** :
```sql
-- Table construction_requests
SELECT * FROM construction_requests
WHERE user_id = :user_id
ORDER BY created_at DESC
```

---

## 🔧 TABLES SUPABASE REQUISES

### 1. Table `favorites` (Multi-types)
```sql
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- References (NULL si pas ce type)
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE, -- Terrain privé
  communal_zone_id UUID REFERENCES communal_zones(id) ON DELETE CASCADE, -- Zone communale
  developer_project_id UUID REFERENCES developer_projects(id) ON DELETE CASCADE, -- Projet promoteur
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Contraintes : un seul type à la fois
  CONSTRAINT check_single_favorite_type CHECK (
    (property_id IS NOT NULL AND communal_zone_id IS NULL AND developer_project_id IS NULL) OR
    (property_id IS NULL AND communal_zone_id IS NOT NULL AND developer_project_id IS NULL) OR
    (property_id IS NULL AND communal_zone_id IS NULL AND developer_project_id IS NOT NULL)
  ),
  
  -- Unicité par user + type
  UNIQUE(user_id, property_id),
  UNIQUE(user_id, communal_zone_id),
  UNIQUE(user_id, developer_project_id)
);
```

### 2. Table `communal_zones` (Zones communales disponibles)
```sql
CREATE TABLE IF NOT EXISTS communal_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commune VARCHAR(255) NOT NULL, -- Thiès, Rufisque, Pikine, etc.
  name VARCHAR(255) NOT NULL, -- "Zone d'Extension Urbaine"
  description TEXT,
  zone_type VARCHAR(100), -- résidentielle, commerciale, mixte
  total_surface_area NUMERIC(10,2), -- Superficie totale zone
  lot_size NUMERIC(10,2), -- Taille par lot
  lots_total INTEGER, -- Nombre total lots
  lots_available INTEGER, -- Lots disponibles
  price_per_lot NUMERIC(12,2), -- Prix par lot
  
  -- Critères éligibilité
  eligibility_criteria JSONB, -- {"income_min": 500000, "first_time_buyer": true}
  
  -- Localisation
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  
  -- Documents
  master_plan_url TEXT, -- Plan parcellaire
  zoning_certificate_url TEXT,
  
  status VARCHAR(50) DEFAULT 'available', -- available, attribution_in_progress, closed
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Table `communal_zone_requests` (Demandes zones communales)
```sql
CREATE TABLE IF NOT EXISTS communal_zone_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES communal_zones(id),
  
  -- Informations demande
  request_number VARCHAR(50) UNIQUE, -- DT-2024-001
  status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, documents_missing, pre_approved, approved, rejected
  
  -- Progression
  progress_percentage INTEGER DEFAULT 0,
  current_step VARCHAR(255), -- "Validation commission technique"
  next_step VARCHAR(255),
  deadline_date DATE,
  
  -- Documents
  documents JSONB, -- [{name: "Formulaire", status: "Validé", url: "..."}]
  
  -- Historique
  history JSONB, -- [{date: "2024-01-15", action: "Dépôt demande", agent: "..."}]
  
  -- Dates
  submitted_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  
  -- Attribution
  attribution_number VARCHAR(50), -- ATT-2023-045
  attribution_certificate_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Table `developer_projects` (Projets promoteurs)
```sql
CREATE TABLE IF NOT EXISTS developer_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  developer_id UUID REFERENCES profiles(id), -- Promoteur
  
  -- Informations projet
  title VARCHAR(255) NOT NULL, -- "Résidence Les Palmiers"
  developer_name VARCHAR(255), -- "TERANGA CONSTRUCTION"
  project_type VARCHAR(100), -- villa, appartement, bureau, mixte
  
  -- Localisation
  location VARCHAR(255), -- "Cité Keur Gorgui, Dakar"
  city VARCHAR(100),
  district VARCHAR(100),
  location_lat NUMERIC(10,7),
  location_lng NUMERIC(10,7),
  
  -- Description
  description TEXT,
  features JSONB, -- ["Piscine", "Gardiennage", "Parking"]
  
  -- Unités disponibles
  total_units INTEGER, -- Nombre total logements
  available_units INTEGER,
  unit_types JSONB, -- [{"type": "F4", "surface": "200m²", "price": 45000000, "count": 10}]
  
  -- Prix
  price_min NUMERIC(12,2),
  price_max NUMERIC(12,2),
  
  -- Dates
  launch_date DATE,
  estimated_completion DATE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'pre_commercialisation', -- pre_commercialisation, en_construction, livre
  
  -- Médias
  images JSONB, -- URLs photos
  plans_3d JSONB, -- URLs plans 3D
  brochure_url TEXT,
  
  -- Critères candidature
  eligibility_criteria JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 5. Table `developer_project_applications` (Candidatures projets)
```sql
CREATE TABLE IF NOT EXISTS developer_project_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES developer_projects(id),
  developer_id UUID REFERENCES profiles(id), -- Promoteur
  
  -- Informations candidature
  application_number VARCHAR(50) UNIQUE, -- CP-2024-003
  unit_type VARCHAR(100), -- "Villa F4", "Appartement F3"
  unit_surface VARCHAR(50), -- "200m²"
  total_price NUMERIC(12,2),
  
  -- Status
  status VARCHAR(50) DEFAULT 'submitted', -- submitted, under_review, pre_selected, interview_scheduled, accepted, rejected
  progress_percentage INTEGER DEFAULT 0,
  
  -- Étapes
  current_step VARCHAR(255),
  next_step VARCHAR(255),
  deadline_date DATE,
  
  -- Documents
  documents JSONB,
  
  -- Historique
  history JSONB,
  
  -- Dates
  submitted_at TIMESTAMP DEFAULT NOW(),
  interview_date TIMESTAMP,
  decision_date TIMESTAMP,
  decision_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Table `property_interests` (Intérêts terrains privés)
```sql
CREATE TABLE IF NOT EXISTS property_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  interest_type VARCHAR(50), -- view, contact_request, visit_request, offer_intent
  message TEXT, -- Message à l'owner
  phone VARCHAR(50), -- Contact du particulier
  
  -- Suivi
  status VARCHAR(50) DEFAULT 'pending', -- pending, contacted, visit_scheduled, offer_made, closed
  owner_response TEXT,
  owner_responded_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, property_id, interest_type)
);
```

### 7. Table `construction_requests` (Demandes construction)
```sql
CREATE TABLE IF NOT EXISTS construction_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Projet construction
  request_number VARCHAR(50) UNIQUE,
  project_title VARCHAR(255),
  construction_type VARCHAR(100), -- villa, immeuble, commerce
  location VARCHAR(255),
  desired_surface NUMERIC(10,2),
  budget_estimate NUMERIC(12,2),
  
  -- Description
  description TEXT,
  plans_url TEXT, -- Si le client a des plans
  
  -- Status
  status VARCHAR(50) DEFAULT 'submitted',
  progress_percentage INTEGER DEFAULT 0,
  
  -- Documents
  documents JSONB,
  
  -- Dates
  submitted_at TIMESTAMP DEFAULT NOW(),
  estimated_start_date DATE,
  estimated_completion_date DATE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 PLAN D'ACTION RÉVISÉ

### PHASE 1 : ARCHITECTURE ✅ EN COURS
- [x] Convertir CompleteSidebarParticulierDashboard avec `<Outlet />`
- [x] Routes imbriquées dans App.jsx
- [x] Navigation active

### PHASE 2 : TABLES SUPABASE (30min)
```sql
-- Créer toutes les tables ci-dessus
-- Script SQL complet à exécuter
```

### PHASE 3 : CONNECTER PAGES EXISTANTES (3-4h)

#### 3.1 ParticulierFavoris.jsx (30min)
- Remplacer données mockées par SELECT favorites
- Actions : Retirer favori (DELETE), Voir détails (navigation)
- Filtres par type fonctionnels

#### 3.2 ParticulierCommunal.jsx (1h)
- Remplacer données mockées par SELECT communal_zone_requests
- Onglets (en cours, terminées, rejetées) avec filtres
- Upload documents fonctionnel
- Timeline/historique dynamique

#### 3.3 ParticulierPromoteurs.jsx (1h)
- Remplacer données mockées par SELECT developer_project_applications
- Onglets (en cours, acceptées, rejetées)
- Upload documents
- Timeline dynamique

#### 3.4 ParticulierOverview.jsx (30min)
- Stats réelles depuis toutes les tables
- Activités récentes (dernières actions)
- Actions rapides (liens pages)

#### 3.5 ParticulierTerrainsPrive.jsx (45min)
- SELECT property_interests
- Actions : Contacter vendeur, Planifier visite
- Suivi réponses vendeurs

#### 3.6 ParticulierConstructions.jsx (30min)
- SELECT construction_requests
- Liste demandes construction
- Upload plans, suivi progression

### PHASE 4 : CRÉER PAGES MANQUANTES (3h)

#### 4.1 ParticulierRechercheTerrain.jsx (1h)
**IMPORTANT** : Redirection vers page publique `/terrain-marketplace`
```jsx
// Simple redirect component
const ParticulierRechercheTerrain = () => {
  useEffect(() => {
    window.location.href = '/terrain-marketplace';
  }, []);
  
  return <div>Redirection vers marketplace...</div>;
};
```

#### 4.2 ParticulierMesOffres.jsx (30min)
- SELECT offers (si table existe)
- Ou SELECT property_interests WHERE interest_type = 'offer_intent'

#### 4.3 ParticulierVisites.jsx (30min)
- SELECT visits (si table existe)
- Ou SELECT property_interests WHERE interest_type = 'visit_request'

#### 4.4 ParticulierFinancement.jsx (1h)
- Simulateur prêt (frontend uniquement)
- SELECT loan_applications (si table existe)

#### 4.5 ParticulierTickets.jsx (30min)
- SELECT support_tickets WHERE user_id = :user_id

### PHASE 5 : COMPTEURS DYNAMIQUES ✅ FAIT
- [x] Messages non lus
- [x] Notifications non lues
- [x] Badges sidebar

### PHASE 6 : TESTS (30min)
- Navigation complète
- Actions CRUD
- Responsive

---

## 📝 RÉSUMÉ STRATÉGIQUE

### Ce qu'on GARDE (Pages mockées à connecter) :
✅ ParticulierOverview
✅ ParticulierFavoris  
✅ ParticulierCommunal (zones communales)
✅ ParticulierPromoteurs
✅ ParticulierTerrainsPrive
✅ ParticulierConstructions
✅ ParticulierMessages
✅ ParticulierDocuments
✅ ParticulierCalendar
✅ ParticulierSettings

### Ce qu'on CRÉE (Pages manquantes simples) :
🆕 ParticulierRechercheTerrain (redirect marketplace)
🆕 ParticulierMesOffres (liste offres)
🆕 ParticulierVisites (calendrier visites)
🆕 ParticulierFinancement (simulateur)
🆕 ParticulierNotifications (liste notifications)
🆕 ParticulierTickets (support)

### Ce qu'on IGNORE pour l'instant :
⏭️ ParticulierAI (feature avancée)
⏭️ ParticulierBlockchain (feature avancée)

---

## ⏱️ TEMPS TOTAL RÉVISÉ

**Phase 1** : Architecture ✅ 1h (EN COURS)  
**Phase 2** : Tables SQL - 30min  
**Phase 3** : Connecter existantes - 4h  
**Phase 4** : Créer manquantes - 3h  
**Phase 5** : Tests - 30min  

**TOTAL** : ~9h (au lieu de 15h car beaucoup existe déjà!)

---

## 🎯 PROCHAINE ÉTAPE

**ON CONTINUE ?**

**Étape actuelle** : Phase 1 Architecture (presque finie)  
**Prochaine** : Phase 2 (créer tables SQL en 1 seul script)

**Confirme et je continue !** 🚀
