# 🔍 ANALYSE COMPLÈTE - BASE DE DONNÉES + FRONTEND

**Date:** 11 octobre 2025  
**Objectif:** Identifier toutes les données mockées et les remplacer par les vraies données Supabase

---

## 📊 PHASE 1: STRUCTURE DE LA BASE DE DONNÉES SUPABASE

### Tables Existantes (Identifiées)

#### 1. **`auth.users`** (Supabase Auth)
- `id` (UUID)
- `email` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `raw_user_meta_data` (JSONB)

#### 2. **`public.profiles`** ✅ 
- `id` (UUID) - FK → auth.users(id)
- `role` (TEXT) - 'admin', 'vendeur', 'acheteur', 'notaire', 'banque', 'agent_foncier', 'investisseur', 'promoteur'
- `email` (TEXT)
- `full_name` (TEXT)
- `phone` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### 3. **`public.marketing_leads`** ✅ (Nouvelle - créée aujourd'hui)
- `id` (UUID)
- `full_name` (TEXT)
- `email` (TEXT)
- `phone` (TEXT)
- `company` (TEXT)
- `source` (TEXT)
- `page_url` (TEXT)
- `referrer` (TEXT)
- `subject` (TEXT)
- `message` (TEXT)
- `property_interest` (TEXT)
- `budget_range` (TEXT)
- `status` (TEXT) - 'new', 'contacted', 'qualified', 'converted', 'lost'
- `priority` (TEXT) - 'low', 'medium', 'high', 'urgent'
- `assigned_to` (UUID) - FK → auth.users(id)
- `assigned_at` (TIMESTAMPTZ)
- `notes` (TEXT)
- `tags` (TEXT[])
- `user_agent` (TEXT)
- `ip_address` (INET)
- `geo_location` (JSONB)
- `consent_marketing` (BOOLEAN)
- `consent_data_processing` (BOOLEAN)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `last_contacted_at` (TIMESTAMPTZ)
- `deleted_at` (TIMESTAMPTZ)

#### 4. **`public.properties`** (À vérifier/créer)
Tables probables basées sur l'usage frontend:
- `id` (UUID)
- `owner_id` (UUID) - FK → profiles(id)
- `title` (TEXT)
- `description` (TEXT)
- `property_type` (TEXT) - 'terrain', 'villa', 'appartement', 'immeuble', 'bureau'
- `status` (TEXT) - 'disponible', 'en_negociation', 'vendu', 'loue'
- `price` (NUMERIC)
- `surface` (NUMERIC)
- `location` (TEXT)
- `latitude` (NUMERIC)
- `longitude` (NUMERIC)
- `address` (TEXT)
- `city` (TEXT)
- `region` (TEXT)
- `bedrooms` (INTEGER)
- `bathrooms` (INTEGER)
- `features` (TEXT[])
- `images` (TEXT[])
- `blockchain_verified` (BOOLEAN)
- `blockchain_hash` (TEXT)
- `ai_score` (NUMERIC)
- `views_count` (INTEGER)
- `favorites_count` (INTEGER)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### 5. **`public.offers`** (À vérifier/créer)
- `id` (UUID)
- `property_id` (UUID) - FK → properties(id)
- `buyer_id` (UUID) - FK → profiles(id)
- `seller_id` (UUID) - FK → profiles(id)
- `amount` (NUMERIC)
- `status` (TEXT) - 'pending', 'accepted', 'rejected', 'counter_offer', 'completed'
- `message` (TEXT)
- `conditions` (TEXT)
- `expires_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### 6. **`public.documents`** (À vérifier/créer)
- `id` (UUID)
- `property_id` (UUID) - FK → properties(id)
- `owner_id` (UUID) - FK → profiles(id)
- `document_type` (TEXT) - 'titre_foncier', 'permis_construire', 'cadastre', 'contrat'
- `title` (TEXT)
- `file_url` (TEXT)
- `file_size` (BIGINT)
- `mime_type` (TEXT)
- `status` (TEXT) - 'pending', 'verified', 'rejected'
- `verified_by` (UUID) - FK → profiles(id)
- `verified_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)

#### 7. **`public.transactions`** (À vérifier/créer)
- `id` (UUID)
- `property_id` (UUID) - FK → properties(id)
- `buyer_id` (UUID) - FK → profiles(id)
- `seller_id` (UUID) - FK → profiles(id)
- `notaire_id` (UUID) - FK → profiles(id)
- `amount` (NUMERIC)
- `transaction_type` (TEXT) - 'vente', 'location', 'tokenisation'
- `status` (TEXT) - 'initiated', 'in_progress', 'completed', 'cancelled'
- `blockchain_hash` (TEXT)
- `blockchain_verified` (BOOLEAN)
- `signature_buyer` (TEXT)
- `signature_seller` (TEXT)
- `signature_notaire` (TEXT)
- `contract_url` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `completed_at` (TIMESTAMPTZ)

#### 8. **`public.notifications`** (À vérifier/créer)
- `id` (UUID)
- `user_id` (UUID) - FK → profiles(id)
- `type` (TEXT) - 'offer', 'document', 'message', 'system'
- `title` (TEXT)
- `message` (TEXT)
- `data` (JSONB)
- `read` (BOOLEAN)
- `read_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)

#### 9. **`public.messages`** (À vérifier/créer)
- `id` (UUID)
- `conversation_id` (UUID)
- `sender_id` (UUID) - FK → profiles(id)
- `receiver_id` (UUID) - FK → profiles(id)
- `property_id` (UUID) - FK → properties(id)
- `content` (TEXT)
- `read` (BOOLEAN)
- `read_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)

#### 10. **`public.projects`** (À vérifier/créer) - Pour promoteurs
- `id` (UUID)
- `promoteur_id` (UUID) - FK → profiles(id)
- `title` (TEXT)
- `description` (TEXT)
- `location` (TEXT)
- `budget` (NUMERIC)
- `status` (TEXT) - 'planning', 'in_progress', 'completed', 'on_hold'
- `progress_percentage` (INTEGER)
- `start_date` (DATE)
- `end_date` (DATE)
- `images` (TEXT[])
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### 11. **`public.investments`** (À vérifier/créer) - Pour investisseurs
- `id` (UUID)
- `investor_id` (UUID) - FK → profiles(id)
- `property_id` (UUID) - FK → properties(id)
- `project_id` (UUID) - FK → projects(id)
- `amount` (NUMERIC)
- `shares` (INTEGER)
- `roi_percentage` (NUMERIC)
- `status` (TEXT) - 'active', 'completed', 'pending'
- `invested_at` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)

#### 12. **`public.blockchain_certificates`** (À vérifier/créer)
- `id` (UUID)
- `property_id` (UUID) - FK → properties(id)
- `certificate_hash` (TEXT)
- `certificate_url` (TEXT)
- `issued_at` (TIMESTAMPTZ)
- `issuer_id` (UUID) - FK → profiles(id)
- `blockchain_network` (TEXT) - 'ethereum', 'polygon', etc.
- `transaction_hash` (TEXT)
- `verified` (BOOLEAN)

---

## 🎨 PHASE 2: DONNÉES MOCKÉES DANS LE FRONTEND

### Fichiers avec Données Hardcodées (Mock Data)

#### **PAGES PRINCIPALES**

1. **`src/pages/MunicipalRequestsPage.jsx`** ❌
   - `mockRequests` (40 lignes)
   - Type: Demandes municipales
   - Table nécessaire: `municipal_requests`

2. **`src/pages/ParcelleDetailPage.jsx`** ❌
   - `mockParcelleData` (163 lignes)
   - Type: Détails parcelle
   - Table nécessaire: `properties` + `parcels`

3. **`src/pages/ProjectDetailPage.jsx`** ❌
   - `mockProjectData` (249 lignes)
   - Type: Détails projet immobilier
   - Table nécessaire: `projects`

4. **`src/pages/PromoterConstructionRequestsPageNew.jsx`** ❌
   - `mockRequests` (244 lignes)
   - Type: Demandes de construction
   - Table nécessaire: `construction_requests`

5. **`src/pages/profiles/UserProfilePage.jsx`** ❌
   - `generateMockProfile()` function
   - Type: Profils utilisateurs
   - Table existante: `profiles` ✅ (à compléter)

#### **DASHBOARDS VENDEUR**

6. **`src/pages/dashboards/vendeur/ModernVendeurDashboard.jsx`** ❌
   - Données hardcodées partout
   - Tables: `properties`, `offers`, `analytics`

7. **`src/pages/dashboards/vendeur/ListingsPage.jsx`** ⚠️
   - `useState([])` - vide au chargement
   - Table: `properties`

8. **`src/pages/dashboards/vendeur/OffersPage.jsx`** ⚠️
   - `useState([])` - vide
   - Table: `offers`

9. **`src/pages/dashboards/vendeur/ContractsPage.jsx`** ⚠️
   - `useState([])` - vide
   - Table: `contracts` ou `transactions`

#### **DASHBOARDS INVESTISSEUR**

10. **`src/pages/dashboards/investisseur/InvestisseurBlockchain.jsx`** ❌
    - `blockchainCertificates` (49 lignes)
    - `transactionHistory` (45 lignes)
    - Tables: `blockchain_certificates`, `blockchain_transactions`

11. **`src/pages/dashboards/investisseur/InvestisseurOpportunites.jsx`** ❌
    - `opportunities` (169 lignes)
    - Table: `investment_opportunities`

12. **`src/pages/dashboards/investisseur/InvestmentsPage.jsx`** ❌
    - `mockInvestments` (205 lignes)
    - Table: `investments`

13. **`src/pages/dashboards/investisseur/OpportunitiesPage.jsx`** ❌
    - `mockOpportunities` (187 lignes)
    - Table: `investment_opportunities`

14. **`src/pages/dashboards/investisseur/InvestisseurPortfolio.jsx`** ❌
    - `allocationData` (8 lignes)
    - `allInvestments` (95 lignes)
    - Table: `investments` + `portfolio_allocation`

15. **`src/pages/dashboards/investisseur/InvestisseurOverview.jsx`** ❌
    - `activeInvestments` (données hardcodées)
    - Table: `investments`

#### **DASHBOARDS AGENT FONCIER**

16. **`src/pages/dashboards/agent-foncier/AgentFoncierNotifications.jsx`** ❌
    - `notifications` (63 lignes)
    - Table: `notifications`

17. **`src/pages/dashboards/agent-foncier/AgentFoncierServicesDigitaux.jsx`** ❌
    - `digitalServices` (93 lignes)
    - `recentActivities` (43 lignes)
    - Tables: `digital_services`, `activities`

18. **`src/pages/dashboards/agent-foncier/AgentFoncierTerrains.jsx`** ❌
    - `terrains` (données hardcodées)
    - Table: `properties` (type='terrain')

19. **`src/pages/dashboards/agent-foncier/AgentFoncierOverview.jsx`** ❌
    - `stats` (35 lignes)
    - `recentActivities` (35 lignes)
    - `upcomingTasks` (22 lignes)
    - Tables: `activities`, `tasks`

20. **`src/pages/dashboards/agent-foncier/AgentFoncierMessages.jsx`** ❌
    - `conversations` (données hardcodées)
    - Table: `messages` + `conversations`

21. **`src/pages/dashboards/agent-foncier/AgentFoncierGPSVerification.jsx`** ❌
    - `properties` (99 lignes)
    - `gpsEquipment` (28 lignes)
    - Tables: `properties`, `gps_verifications`

22. **`src/pages/dashboards/agent-foncier/AgentFoncierDocuments.jsx`** ❌
    - `documents` (123 lignes)
    - `folders` (51 lignes)
    - Table: `documents`

#### **DASHBOARDS PROMOTEUR**

23. **`src/pages/dashboards/promoteur/ProjectsPage.jsx`** ⚠️
    - `useState([])` - vide
    - Table: `projects`

24. **`src/pages/dashboards/promoteur/FinancingPage.jsx`** ⚠️
    - `useState([])` - vide
    - Table: `financing` ou `project_financing`

25. **`src/pages/dashboards/promoteur/ConstructionTrackingPage.jsx`** ⚠️
    - `useState([])` - vide
    - Table: `construction_tracking`

26. **`src/pages/dashboards/promoteur/ConstructionPage.jsx`** ❌
    - `constructionProjects` (données hardcodées)
    - Table: `projects` + `construction_phases`

---

## 🗂️ PHASE 3: MAPPING BASE DE DONNÉES → COMPOSANTS

### Priorités de Migration

#### **PRIORITÉ 1 - HAUTE** (Utilisateurs actifs)

| Composant | Table(s) Nécessaire(s) | État | Action |
|-----------|------------------------|------|--------|
| `profiles` | ✅ `public.profiles` | Existe | Compléter champs |
| `marketing_leads` | ✅ `public.marketing_leads` | Créée | ✅ Prête |
| Admin Leads List | ✅ `public.marketing_leads` | Prête | Connecter |
| User Auth | ✅ `auth.users` + `profiles` | Existe | ✅ OK |

#### **PRIORITÉ 2 - MOYENNE** (Fonctionnalités principales)

| Composant | Table(s) Nécessaire(s) | État | Action |
|-----------|------------------------|------|--------|
| Vendeur Dashboard | ❌ `properties` | Manquante | **CRÉER** |
| Offers Management | ❌ `offers` | Manquante | **CRÉER** |
| Documents Manager | ❌ `documents` | Manquante | **CRÉER** |
| Notifications | ❌ `notifications` | Manquante | **CRÉER** |
| Messages | ❌ `messages` + `conversations` | Manquantes | **CRÉER** |

#### **PRIORITÉ 3 - BASSE** (Fonctionnalités avancées)

| Composant | Table(s) Nécessaire(s) | État | Action |
|-----------|------------------------|------|--------|
| Investisseur Portfolio | ❌ `investments` | Manquante | **CRÉER** |
| Blockchain Certificates | ❌ `blockchain_certificates` | Manquante | **CRÉER** |
| Agent Foncier GPS | ❌ `gps_verifications` | Manquante | **CRÉER** |
| Promoteur Projects | ❌ `projects` | Manquante | **CRÉER** |
| Construction Tracking | ❌ `construction_tracking` | Manquante | **CRÉER** |

---

## 📋 PHASE 4: PLAN DE MIGRATION

### Étape 1: Créer les Tables Manquantes Essentielles

**Script SQL à créer:** `CREATE-ESSENTIAL-TABLES.sql`

Tables prioritaires:
1. ✅ `properties` (Propriétés immobilières)
2. ✅ `offers` (Offres d'achat/vente)
3. ✅ `documents` (Documents administratifs)
4. ✅ `notifications` (Notifications utilisateurs)
5. ✅ `messages` + `conversations` (Messagerie)
6. ✅ `transactions` (Transactions blockchain)

### Étape 2: Migrer les Services JavaScript

**Fichiers à créer:**
- `src/services/PropertiesService.js`
- `src/services/OffersService.js`
- `src/services/DocumentsService.js`
- `src/services/NotificationsService.js`
- `src/services/MessagesService.js`

### Étape 3: Remplacer Mock Data par Hooks Supabase

**Pattern à suivre:**

```javascript
// AVANT (Mock Data) ❌
const mockProperties = [
  { id: 1, title: 'Villa Almadies', price: 150000000, ... },
  { id: 2, title: 'Appartement Plateau', price: 75000000, ... }
];
const [properties, setProperties] = useState(mockProperties);

// APRÈS (Real Data) ✅
import { useEffect, useState } from 'react';
import PropertiesService from '@/services/PropertiesService';

const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadProperties() {
    setLoading(true);
    const { success, data } = await PropertiesService.getProperties({
      owner_id: userId,
      status: 'disponible'
    });
    if (success) {
      setProperties(data);
    }
    setLoading(false);
  }
  loadProperties();
}, [userId]);
```

### Étape 4: Ajouter RLS Policies

**Pour chaque table:**
```sql
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Vendeurs voient leurs propres propriétés
CREATE POLICY "Vendeurs can view own properties"
  ON public.properties FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

-- Tout le monde voit les propriétés disponibles
CREATE POLICY "Public can view available properties"
  ON public.properties FOR SELECT
  TO authenticated
  USING (status = 'disponible');
```

### Étape 5: Tests & Validation

**Checklist:**
- [ ] Toutes les tables créées
- [ ] RLS policies configurées
- [ ] Services JavaScript créés
- [ ] Mock data remplacé dans tous les composants
- [ ] Tests de chargement des données
- [ ] Tests de création/modification/suppression
- [ ] Performance OK (< 1s par requête)

---

## 🚀 PROCHAINES ÉTAPES IMMÉDIATES

### 1. Vérifier l'état actuel de Supabase

Exécuter ce script SQL pour voir toutes les tables existantes:

```sql
SELECT 
    table_schema,
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 2. Créer les tables manquantes prioritaires

Je vais créer le script `CREATE-ESSENTIAL-TABLES.sql` qui inclura:
- `properties`
- `offers`
- `documents`
- `notifications`
- `messages` + `conversations`

### 3. Créer les services JavaScript

Pattern standardisé pour tous les services.

### 4. Migration progressive des composants

Un dashboard à la fois, en commençant par Vendeur (le plus utilisé).

---

## 📊 STATISTIQUES

- **Total fichiers avec mock data:** 26+
- **Tables existantes:** 3 (profiles, marketing_leads, admin_notifications)
- **Tables à créer:** 12+
- **Services JavaScript à créer:** 10+
- **Composants à migrer:** 26+
- **Temps estimé:** 3-5 jours (en travaillant méthodiquement)

---

**Status:** Analyse complète ✅  
**Prochaine action:** Créer `CREATE-ESSENTIAL-TABLES.sql`
