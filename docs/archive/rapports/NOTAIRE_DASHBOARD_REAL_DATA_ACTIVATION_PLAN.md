# 🚀 PLAN D'ACTIVATION - DASHBOARD NOTAIRE DONNÉES RÉELLES

## 📋 OBJECTIFS
1. ✅ Éliminer toutes les données mockées
2. ✅ Activer tous les boutons et fonctionnalités
3. ✅ Connecter toutes les pages à Supabase
4. ✅ Implémenter toutes les actions CRUD complètes
5. ✅ Ajouter la gestion des erreurs et loading states

---

## 📊 ÉTAT ACTUEL DES PAGES

### ✅ PAGES DÉJÀ AVEC DONNÉES RÉELLES (Partielles)

1. **NotaireOverview.jsx** - 70% connecté
   - ✅ Stats dashboard (getDashboardStats)
   - ✅ Actes récents (getRecentActs)
   - ✅ Données revenus (getRevenueData)
   - ✅ Distribution types d'actes (getActTypesDistribution)
   - ⚠️ Actions rapides partielles (handleNewTransaction existe)
   - ❌ Export rapports non fonctionnel

2. **NotaireTransactions.jsx** - 60% connecté
   - ✅ Liste transactions (getNotarialActs via getTransactions)
   - ❌ Création de transaction (formulaire non connecté)
   - ❌ Modification de transaction
   - ❌ Upload documents
   - ❌ Génération de PDF

3. **NotaireCases.jsx** - 60% connecté
   - ✅ Liste dossiers (getNotarialCases via getCases)
   - ❌ Création de dossier (formulaire non connecté)
   - ❌ Modification de dossier
   - ❌ Gestion tâches
   - ❌ Upload documents

4. **NotaireCRM.jsx** - 60% connecté
   - ✅ Liste clients (getClients)
   - ✅ Partenaires bancaires (getBankingPartners)
   - ✅ Stats CRM (getCRMStats)
   - ❌ Ajout client non fonctionnel
   - ❌ Modification client
   - ❌ Envoi messages tripartites

5. **NotaireAuthentication.jsx** - 60% connecté
   - ✅ Liste documents (getDocumentAuthentications)
   - ❌ Upload document non connecté
   - ❌ Authentification blockchain non connectée
   - ❌ Génération de certificat

6. **NotaireArchives.jsx** - 60% connecté
   - ✅ Liste archives (getArchives)
   - ⚠️ Filtres partiellement connectés
   - ❌ Export non fonctionnel
   - ❌ Marquage favoris

7. **NotaireCompliance.jsx** - 50% connecté
   - ✅ Checks de conformité (getComplianceChecks)
   - ⚠️ Utilise mockData en fallback
   - ❌ Création de check
   - ❌ Actions de correction

8. **NotaireAnalytics.jsx** - 50% connecté
   - ✅ Chargement analytics (getAnalytics)
   - ⚠️ Utilise mockData en fallback
   - ❌ Export rapports

9. **NotaireBlockchain.jsx** - 50% connecté
   - ✅ Stats blockchain (getBlockchainStats)
   - ✅ Transactions blockchain (getDocumentAuthentications)
   - ⚠️ Utilise mockData en fallback
   - ❌ Ancrage blockchain non connecté

10. **NotaireCommunication.jsx** - 40% connecté
    - ✅ Chargement communications (getCommunications)
    - ❌ Envoi message (sendTripartiteMessage non utilisé)
    - ❌ Upload fichiers
    - ❌ Programmation rendez-vous

11. **NotaireAI.jsx** - 30% connecté
    - ✅ Début de connexion
    - ❌ Chat IA non fonctionnel
    - ❌ Analyse de documents
    - ❌ Génération de clauses

12. **NotaireSettings.jsx** - 30% connecté
    - ✅ Chargement settings (getNotaireSettings)
    - ❌ Sauvegarde settings (updateNotaireSettings non utilisé)
    - ❌ Gestion abonnements
    - ❌ Gestion tickets

### ❌ NOUVELLES PAGES (10) - 100% MOCKÉES

13. **NotaireSupportPage.jsx** - 0% connecté
    - ❌ Liste tickets mockée
    - ❌ Création ticket non connectée
    - ❌ Réponse ticket non connectée

14. **NotaireSubscriptionsPage.jsx** - 0% connecté
    - ❌ Plans d'abonnement mockés
    - ❌ Abonnement actuel mocké
    - ❌ Changement de plan non connecté
    - ❌ Historique factures mocké

15. **NotaireHelpPage.jsx** - 0% connecté
    - ❌ Articles d'aide mockés
    - ❌ FAQ mockée
    - ❌ Recherche non connectée

16. **NotaireNotificationsPage.jsx** - 0% connecté
    - ❌ Notifications mockées
    - ❌ Préférences non sauvegardées
    - ❌ Marquage lu/non lu non connecté

17. **NotaireVisioPage.jsx** - 0% connecté
    - ❌ Réunions mockées
    - ❌ API vidéo non intégrée
    - ❌ Programmation non connectée

18. **NotaireELearningPage.jsx** - 0% connecté
    - ❌ Cours mockés
    - ❌ Progression mockée
    - ❌ Inscription non connectée

19. **NotaireMarketplacePage.jsx** - 0% connecté
    - ❌ Produits mockés
    - ❌ Panier mocké
    - ❌ Checkout non connecté

20. **NotaireAPICadastrePage.jsx** - 0% connecté
    - ❌ Recherche cadastrale mockée
    - ❌ API cadastre non intégrée
    - ❌ Historique mocké

21. **NotaireFinancialDashboardPage.jsx** - 0% connecté
    - ❌ Données financières mockées
    - ❌ Graphiques mockés
    - ❌ Export non connecté

22. **NotaireMultiOfficePage.jsx** - 0% connecté
    - ❌ Bureaux mockés
    - ❌ Stats mockées
    - ❌ CRUD bureaux non connecté

---

## 🗄️ SCHÉMA SUPABASE REQUIS

### Tables Existantes (Vérifiées)
✅ `notarial_acts` - Actes notariés
✅ `document_authentication` - Authentifications
✅ `compliance_checks` - Vérifications conformité
✅ `clients_notaire` - Clients du notaire
✅ `banking_partners` - Partenaires bancaires
✅ `tripartite_communications` - Communications tripartites
✅ `profiles` - Profils utilisateurs

### Tables à Créer/Vérifier
❓ `support_tickets` - Tickets de support
❓ `subscription_plans` - Plans d'abonnement
❓ `user_subscriptions` - Abonnements utilisateurs
❓ `notifications` - Notifications
❓ `video_meetings` - Réunions vidéo
❓ `elearning_courses` - Cours e-learning
❓ `course_enrollments` - Inscriptions aux cours
❓ `marketplace_products` - Produits marketplace
❓ `marketplace_orders` - Commandes
❓ `cadastral_searches` - Recherches cadastrales
❓ `notaire_offices` - Bureaux notaire
❓ `help_articles` - Articles d'aide
❓ `faq_items` - FAQ

---

## 📝 MÉTHODES SUPABASE SERVICE DISPONIBLES

### ✅ Déjà Implémentées dans NotaireSupabaseService.js

```javascript
// STATISTIQUES & DASHBOARD
getDashboardStats(notaireId)
getRevenueData(notaireId, monthsBack)
getRecentActs(notaireId, limit)
getActTypesDistribution(notaireId)
getAnalytics(notaireId, period)
getCRMStats(notaireId)

// ACTES & TRANSACTIONS
createNotarialAct(notaireId, actData)
getTransactions(notaireId, filters)
getCases(notaireId, filters)
getDocuments(notaireId, actId)

// CRM
getClients(notaireId)
getBankingPartners(notaireId)
sendTripartiteMessage(notaireId, messageData)
getCommunications(notaireId, caseId)

// AUTHENTIFICATION & BLOCKCHAIN
authenticateDocument(notaireId, documentId, method)
getDocumentAuthentications(notaireId)
getBlockchainStats(notaireId)

// CONFORMITÉ
getComplianceChecks(notaireId)

// ARCHIVES
getArchives(notaireId, filters)

// PARAMÈTRES
getNotaireSettings(notaireId)
updateNotaireSettings(notaireId, settings)
```

### ❌ À Implémenter

```javascript
// SUPPORT
getSupportTickets(notaireId)
createSupportTicket(notaireId, ticketData)
updateSupportTicket(ticketId, updates)
respondToTicket(ticketId, response)

// ABONNEMENTS
getSubscriptionPlans()
getUserSubscription(notaireId)
changeSubscriptionPlan(notaireId, planId)
getInvoices(notaireId)

// NOTIFICATIONS
getNotifications(notaireId)
markNotificationAsRead(notificationId)
updateNotificationPreferences(notaireId, preferences)

// VISIO
getVideoMeetings(notaireId)
createVideoMeeting(notaireId, meetingData)
joinVideoMeeting(meetingId)

// E-LEARNING
getELearningCourses()
getCourseProgress(notaireId, courseId)
enrollInCourse(notaireId, courseId)
updateCourseProgress(notaireId, courseId, progress)

// MARKETPLACE
getMarketplaceProducts()
createMarketplaceOrder(notaireId, orderData)
getOrders(notaireId)

// CADASTRE
searchCadastralData(searchParams)
getCadastralSearchHistory(notaireId)

// MULTI-OFFICE
getNotaireOffices(notaireId)
createOffice(notaireId, officeData)
updateOffice(officeId, updates)
deleteOffice(officeId)

// HELP CENTER
getHelpArticles(category)
searchHelpArticles(query)
getFAQItems()
```

---

## 🎯 PLAN D'EXÉCUTION PAR PHASE

### PHASE 1: Compléter les pages existantes (12 pages) ⭐ PRIORITÉ HAUTE

#### 1.1 NotaireOverview.jsx
- [x] Stats dashboard connectées
- [ ] Activer bouton "Nouvelle Transaction" (connecter handleNewTransaction)
- [ ] Activer bouton "Nouveau Client" (créer handleNewClient)
- [ ] Activer bouton "Exporter Rapports" (connecter handleExportReport)
- [ ] Activer "Assistant IA" (modal ou navigation)

#### 1.2 NotaireTransactions.jsx
- [x] Liste transactions connectée
- [ ] **Formulaire création transaction** (connecter à createNotarialAct)
- [ ] **Modification transaction** (modal + UPDATE)
- [ ] **Upload documents** (Supabase Storage + INSERT notarial_documents)
- [ ] **Génération PDF** (fonction exportToPDF réelle)
- [ ] **Filtres avancés** (par statut, date, type, montant)
- [ ] **Actions sur transactions** (valider, annuler, archiver)

#### 1.3 NotaireCases.jsx
- [x] Liste dossiers connectée
- [ ] **Formulaire création dossier** (connecter à createNotarialAct)
- [ ] **Modification dossier** (modal + UPDATE)
- [ ] **Ajout tâches** (INSERT notarial_tasks)
- [ ] **Upload documents** (Storage)
- [ ] **Changement statut** (UPDATE status)
- [ ] **Assignation** (UPDATE assigned_to)

#### 1.4 NotaireCRM.jsx
- [x] Liste clients/banques connectée
- [ ] **Formulaire ajout client** (INSERT clients_notaire)
- [ ] **Modification client** (UPDATE)
- [ ] **Suppression client** (DELETE)
- [ ] **Envoi message tripartite** (connecter sendTripartiteMessage)
- [ ] **Upload documents client** (Storage)
- [ ] **Historique interactions** (query communications)

#### 1.5 NotaireAuthentication.jsx
- [x] Liste documents connectée
- [ ] **Upload document** (Storage + INSERT document_authentication)
- [ ] **Authentification blockchain** (connecter authenticateDocument)
- [ ] **Génération certificat** (PDF avec QR code)
- [ ] **Vérification signature** (fonction vérification)
- [ ] **Export certificats** (ZIP multiple documents)

#### 1.6 NotaireArchives.jsx
- [x] Liste archives connectée
- [ ] **Filtres complets** (date, type, client, statut)
- [ ] **Recherche fulltext** (ilike sur title, description)
- [ ] **Export archives** (ZIP avec documents)
- [ ] **Marquage favoris** (UPDATE is_favorite)
- [ ] **Restauration archive** (UPDATE archived_at = null)

#### 1.7 NotaireCompliance.jsx
- [x] Liste checks connectée
- [ ] **Retirer mockData fallback**
- [ ] **Création check manuel** (INSERT compliance_checks)
- [ ] **Actions correctives** (UPDATE check_actions)
- [ ] **Export rapport conformité** (PDF)
- [ ] **Planification checks** (INSERT scheduled_checks)

#### 1.8 NotaireAnalytics.jsx
- [x] Analytics de base connectées
- [ ] **Retirer mockData fallback**
- [ ] **Filtres temporels** (jour, semaine, mois, année)
- [ ] **Graphiques dynamiques** (recharts avec vraies données)
- [ ] **Export rapports** (PDF/Excel)
- [ ] **Comparaisons périodes** (YoY, MoM)

#### 1.9 NotaireBlockchain.jsx
- [x] Stats blockchain connectées
- [ ] **Retirer mockData fallback**
- [ ] **Ancrage blockchain réel** (API blockchain externe ou simulation)
- [ ] **Vérification hash** (fonction validation)
- [ ] **Historique complet** (toutes transactions)
- [ ] **Export preuve blockchain** (PDF avec hash)

#### 1.10 NotaireCommunication.jsx
- [x] Liste communications connectée
- [ ] **Envoi message** (connecter sendTripartiteMessage)
- [ ] **Upload fichiers** (Storage)
- [ ] **Notifications temps réel** (Supabase Realtime)
- [ ] **Programmation rendez-vous** (INSERT calendar_events)
- [ ] **Vidéo-conférence** (intégration Jitsi/Zoom)

#### 1.11 NotaireAI.jsx
- [ ] **Chat IA fonctionnel** (API OpenAI ou Claude)
- [ ] **Analyse de documents** (OCR + IA)
- [ ] **Génération de clauses** (templates + IA)
- [ ] **Suggestions intelligentes** (basées sur historique)
- [ ] **Export analyses** (PDF rapport IA)

#### 1.12 NotaireSettings.jsx
- [x] Chargement settings connecté
- [ ] **Sauvegarde settings** (connecter updateNotaireSettings)
- [ ] **Changement mot de passe** (Supabase Auth)
- [ ] **Gestion 2FA** (Supabase Auth MFA)
- [ ] **Upload photo profil** (Storage)
- [ ] **Préférences notifications** (UPDATE)

---

### PHASE 2: Activer nouvelles pages (10 pages) ⭐ PRIORITÉ MOYENNE

#### 2.1 NotaireSupportPage.jsx
- [ ] **Créer table `support_tickets`**
- [ ] **Implémenter getSupportTickets()**
- [ ] **Implémenter createSupportTicket()**
- [ ] **Implémenter respondToTicket()**
- [ ] **Upload fichiers tickets** (Storage)
- [ ] **Système de priorités**
- [ ] **Assignation automatique**

#### 2.2 NotaireSubscriptionsPage.jsx
- [ ] **Créer tables `subscription_plans`, `user_subscriptions`, `invoices`**
- [ ] **Implémenter getSubscriptionPlans()**
- [ ] **Implémenter getUserSubscription()**
- [ ] **Implémenter changeSubscriptionPlan()**
- [ ] **Intégration paiement** (Stripe/Paydunya)
- [ ] **Génération factures** (PDF)
- [ ] **Historique paiements**

#### 2.3 NotaireHelpPage.jsx
- [ ] **Créer tables `help_articles`, `faq_items`**
- [ ] **Implémenter getHelpArticles()**
- [ ] **Implémenter searchHelpArticles()**
- [ ] **Implémenter getFAQItems()**
- [ ] **Système de votes** (utile/pas utile)
- [ ] **Recherche fulltext**

#### 2.4 NotaireNotificationsPage.jsx
- [ ] **Utiliser table `notifications` existante ou créer**
- [ ] **Implémenter getNotifications()**
- [ ] **Implémenter markNotificationAsRead()**
- [ ] **Implémenter updateNotificationPreferences()**
- [ ] **Notifications temps réel** (Supabase Realtime)
- [ ] **Filtres par type**

#### 2.5 NotaireVisioPage.jsx
- [ ] **Créer table `video_meetings`**
- [ ] **Implémenter getVideoMeetings()**
- [ ] **Implémenter createVideoMeeting()**
- [ ] **Intégration Jitsi Meet** (ou Zoom/Google Meet)
- [ ] **Enregistrement réunions** (Storage)
- [ ] **Calendrier intégré**

#### 2.6 NotaireELearningPage.jsx
- [ ] **Créer tables `elearning_courses`, `course_enrollments`, `course_progress`**
- [ ] **Implémenter getELearningCourses()**
- [ ] **Implémenter enrollInCourse()**
- [ ] **Implémenter updateCourseProgress()**
- [ ] **Upload vidéos** (Storage ou Vimeo)
- [ ] **Quiz/Évaluations** (table quiz_results)
- [ ] **Certificats** (génération PDF)

#### 2.7 NotaireMarketplacePage.jsx
- [ ] **Créer tables `marketplace_products`, `marketplace_orders`, `cart_items`**
- [ ] **Implémenter getMarketplaceProducts()**
- [ ] **Implémenter createMarketplaceOrder()**
- [ ] **Panier fonctionnel** (localStorage + sync DB)
- [ ] **Intégration paiement**
- [ ] **Téléchargement produits** (Storage)

#### 2.8 NotaireAPICadastrePage.jsx
- [ ] **Créer table `cadastral_searches`**
- [ ] **Intégration API Cadastre Sénégal** (ou API tierce)
- [ ] **Implémenter searchCadastralData()**
- [ ] **Implémenter getCadastralSearchHistory()**
- [ ] **Cache résultats** (éviter requêtes répétées)
- [ ] **Export résultats** (PDF)

#### 2.9 NotaireFinancialDashboardPage.jsx
- [ ] **Utiliser données existantes** (notarial_acts.notary_fees)
- [ ] **Créer table `financial_transactions`** (optionnel)
- [ ] **Graphiques revenus** (recharts avec vraies données)
- [ ] **Analyse clients rentables** (query agrégée)
- [ ] **Prévisions revenus** (algorithme basique)
- [ ] **Export rapports Excel**

#### 2.10 NotaireMultiOfficePage.jsx
- [ ] **Créer table `notaire_offices`**
- [ ] **Implémenter getNotaireOffices()**
- [ ] **Implémenter createOffice()**
- [ ] **Implémenter updateOffice()**
- [ ] **Implémenter deleteOffice()**
- [ ] **Statistiques par bureau** (query agrégée)
- [ ] **Transfert dossiers** (UPDATE office_id)

---

## 🏗️ SCRIPTS SQL À CRÉER

### 1. `create-support-tables.sql`
```sql
-- Support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT, -- technique, facturation, feature_request
  priority TEXT DEFAULT 'medium', -- low, medium, high, urgent
  status TEXT DEFAULT 'open', -- open, in_progress, resolved, closed
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Ticket responses
CREATE TABLE IF NOT EXISTS support_ticket_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ticket attachments
CREATE TABLE IF NOT EXISTS support_ticket_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. `create-subscription-tables.sql`
```sql
-- Subscription plans
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL,
  price_yearly INTEGER,
  features JSONB,
  max_acts_per_month INTEGER,
  max_storage_gb INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active', -- active, cancelled, expired, pending
  billing_cycle TEXT DEFAULT 'monthly', -- monthly, yearly
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  subscription_id UUID REFERENCES user_subscriptions(id),
  invoice_number TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. `create-elearning-tables.sql`
```sql
-- E-learning courses
CREATE TABLE IF NOT EXISTS elearning_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  duration_hours NUMERIC,
  difficulty TEXT, -- beginner, intermediate, advanced
  category TEXT,
  thumbnail_url TEXT,
  video_url TEXT,
  content JSONB, -- chapitres, sections
  price INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course enrollments
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  course_id UUID REFERENCES elearning_courses(id),
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ,
  certificate_issued BOOLEAN DEFAULT FALSE
);

-- Course progress
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  time_spent_minutes INTEGER DEFAULT 0,
  last_position_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. `create-marketplace-tables.sql`
```sql
-- Marketplace products
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT, -- template, plugin, service
  price INTEGER NOT NULL,
  thumbnail_url TEXT,
  download_url TEXT,
  version TEXT,
  author TEXT,
  rating NUMERIC,
  downloads_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketplace orders
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  order_number TEXT UNIQUE NOT NULL,
  total_amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method TEXT,
  items JSONB, -- [{product_id, name, price, quantity}]
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User purchases (many-to-many)
CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES marketplace_products(id),
  order_id UUID REFERENCES marketplace_orders(id),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  download_count INTEGER DEFAULT 0
);
```

### 5. `create-additional-tables.sql`
```sql
-- Video meetings
CREATE TABLE IF NOT EXISTS video_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notaire_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  meeting_url TEXT,
  meeting_id TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  participants JSONB, -- [{user_id, email, role}]
  recording_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cadastral searches
CREATE TABLE IF NOT EXISTS cadastral_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  search_type TEXT, -- parcel, address, owner
  search_query JSONB,
  results JSONB,
  status TEXT DEFAULT 'completed',
  searched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notaire offices
CREATE TABLE IF NOT EXISTS notaire_offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notaire_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  manager_name TEXT,
  staff_count INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  stats JSONB, -- {monthly_revenue, active_cases, clients_count}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Help articles
CREATE TABLE IF NOT EXISTS help_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  slug TEXT UNIQUE,
  views_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAQ items
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications (si n'existe pas déjà)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message TEXT,
  type TEXT, -- info, success, warning, error
  category TEXT, -- system, case, message, payment
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  notification_types JSONB, -- {case_updates: true, messages: true, payments: true}
  quiet_hours JSONB, -- {enabled: false, start: '22:00', end: '08:00'}
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔄 ORDRE D'EXÉCUTION RECOMMANDÉ

### Étape 1: Schéma Base de Données (2-3 heures)
1. Exécuter tous les scripts SQL dans Supabase
2. Configurer RLS policies pour chaque table
3. Créer les indexes nécessaires
4. Tester les requêtes de base

### Étape 2: Étendre NotaireSupabaseService.js (4-5 heures)
1. Ajouter toutes les nouvelles méthodes listées
2. Tester chaque méthode individuellement
3. Gérer les erreurs et cas limites
4. Documenter chaque fonction

### Étape 3: Compléter Pages Existantes (8-10 heures)
1. NotaireTransactions (formulaires + actions)
2. NotaireCases (CRUD complet)
3. NotaireCRM (ajout/modification clients)
4. NotaireAuthentication (upload + blockchain)
5. Autres pages (retirer mocks, activer fonctionnalités)

### Étape 4: Activer Nouvelles Pages (12-15 heures)
1. Pages prioritaires (Support, Subscriptions, Notifications)
2. Pages intermédiaires (Help, Visio, E-Learning)
3. Pages avancées (Marketplace, Cadastre, Financial, Multi-Office)

### Étape 5: Tests & Optimisations (3-4 heures)
1. Tests fonctionnels complets
2. Tests de charge
3. Optimisation requêtes
4. Correction bugs

---

## 📊 TEMPS ESTIMÉ TOTAL

- **Phase 1 (Pages existantes)**: 15-18 heures
- **Phase 2 (Nouvelles pages)**: 18-22 heures
- **Total**: **33-40 heures** de développement

---

## 🎯 PRIORITÉS IMMÉDIATES

### 🔥 ULTRA PRIORITAIRE (À faire en premier)
1. ✅ Créer toutes les tables manquantes
2. ✅ Étendre NotaireSupabaseService.js
3. ✅ Activer formulaires de création (Transactions, Cases, Clients)
4. ✅ Activer upload de documents (Storage)
5. ✅ Retirer tous les mockData fallbacks

### ⭐ HAUTE PRIORITÉ (Semaine 1)
1. NotaireTransactions - CRUD complet
2. NotaireCases - CRUD complet
3. NotaireCRM - CRUD complet
4. NotaireAuthentication - Upload + Blockchain
5. NotaireSupportPage - Système tickets complet

### 🎯 PRIORITÉ MOYENNE (Semaine 2)
1. NotaireSubscriptionsPage - Gestion abonnements
2. NotaireNotificationsPage - Système notifications
3. NotaireSettings - Sauvegarde complète
4. Autres pages existantes (Archives, Compliance, Analytics)

### 📌 PRIORITÉ BASSE (Semaine 3)
1. NotaireVisioPage
2. NotaireELearningPage
3. NotaireMarketplacePage
4. NotaireAPICadastrePage
5. NotaireFinancialDashboardPage
6. NotaireMultiOfficePage

---

## ✅ CHECKLIST PAR PAGE

### Template de vérification
Pour chaque page, vérifier:
- [ ] Aucune donnée mockée
- [ ] Tous les boutons fonctionnels
- [ ] Formulaires connectés à Supabase
- [ ] Upload de fichiers fonctionnel
- [ ] Filtres/Recherche fonctionnels
- [ ] Loading states appropriés
- [ ] Gestion d'erreurs complète
- [ ] Toast notifications
- [ ] Rafraîchissement après actions
- [ ] Export/PDF fonctionnel (si applicable)
- [ ] Responsive design
- [ ] Accessibilité (a11y)

---

## 🚀 COMMENCER MAINTENANT

**Prochaine action**: Créer le script SQL complet et commencer par Phase 1, Page 1.1 (NotaireTransactions).

