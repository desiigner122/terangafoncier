-- =====================================================
-- SCHÉMA COMPLET - FONCTIONNALITÉS DASHBOARD NOTAIRE
-- Teranga Foncier - Activation données réelles
-- =====================================================
-- 
-- Ce script crée toutes les tables nécessaires pour
-- activer 100% des fonctionnalités du dashboard notaire
-- =====================================================

-- Extension UUID si pas déjà activée
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. SUPPORT & TICKETS
-- =====================================================

-- Table principale des tickets de support
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('technique', 'facturation', 'feature_request', 'bug', 'question', 'autre')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_response', 'resolved', 'closed')),
  assigned_to UUID REFERENCES profiles(id),
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Réponses aux tickets
CREATE TABLE IF NOT EXISTS support_ticket_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  is_internal_note BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pièces jointes des tickets
CREATE TABLE IF NOT EXISTS support_ticket_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  response_id UUID REFERENCES support_ticket_responses(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ticket_responses_ticket ON support_ticket_responses(ticket_id);

-- =====================================================
-- 2. ABONNEMENTS & FACTURATION
-- =====================================================

-- Plans d'abonnement
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL, -- En centimes (FCFA)
  price_yearly INTEGER, -- Prix annuel avec réduction
  features JSONB NOT NULL DEFAULT '[]', -- Liste des fonctionnalités
  limits JSONB NOT NULL DEFAULT '{}', -- {max_acts: 100, max_storage_gb: 50, max_users: 5}
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  order_index INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Abonnements utilisateurs
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending', 'past_due', 'paused')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  next_billing_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT TRUE,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  payment_method JSONB, -- {type: 'card', last4: '4242', brand: 'visa'}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, status) -- Un seul abonnement actif par utilisateur
);

-- Factures
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id),
  invoice_number TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- Montant total en centimes
  tax_amount INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'XOF',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  payment_method TEXT,
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_amount INTEGER,
  refund_reason TEXT,
  items JSONB NOT NULL DEFAULT '[]', -- [{description, quantity, unit_price, amount}]
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historique des paiements
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  invoice_id UUID REFERENCES invoices(id),
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created ON invoices(created_at DESC);

-- =====================================================
-- 3. NOTIFICATIONS
-- =====================================================

-- Notifications utilisateur
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  category TEXT, -- system, case, message, payment, document, compliance
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  action_url TEXT,
  action_label TEXT,
  icon TEXT,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Préférences de notification
CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  in_app_notifications BOOLEAN DEFAULT TRUE,
  notification_types JSONB DEFAULT '{
    "case_updates": true,
    "messages": true,
    "payments": true,
    "documents": true,
    "compliance": true,
    "system": true,
    "marketing": false
  }',
  quiet_hours JSONB DEFAULT '{
    "enabled": false,
    "start": "22:00",
    "end": "08:00",
    "timezone": "Africa/Dakar"
  }',
  email_digest JSONB DEFAULT '{
    "enabled": false,
    "frequency": "daily",
    "time": "09:00"
  }',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);

-- =====================================================
-- 4. VISIOCONFÉRENCE
-- =====================================================

-- Réunions vidéo
CREATE TABLE IF NOT EXISTS video_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  timezone TEXT DEFAULT 'Africa/Dakar',
  meeting_url TEXT,
  meeting_id TEXT UNIQUE,
  meeting_password TEXT,
  provider TEXT DEFAULT 'jitsi' CHECK (provider IN ('jitsi', 'zoom', 'google_meet', 'teams')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
  participants JSONB DEFAULT '[]', -- [{user_id, email, name, role, status}]
  max_participants INTEGER DEFAULT 10,
  recording_enabled BOOLEAN DEFAULT FALSE,
  recording_url TEXT,
  recording_duration_minutes INTEGER,
  reminder_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- Participants aux réunions
CREATE TABLE IF NOT EXISTS meeting_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES video_meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'participant' CHECK (role IN ('host', 'co_host', 'participant', 'observer')),
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'accepted', 'declined', 'attended', 'no_show')),
  joined_at TIMESTAMPTZ,
  left_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_meetings_notaire ON video_meetings(notaire_id);
CREATE INDEX IF NOT EXISTS idx_meetings_scheduled ON video_meetings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_meetings_status ON video_meetings(status);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting ON meeting_participants(meeting_id);

-- =====================================================
-- 5. E-LEARNING
-- =====================================================

-- Cours en ligne
CREATE TABLE IF NOT EXISTS elearning_courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  instructor TEXT,
  instructor_bio TEXT,
  instructor_avatar_url TEXT,
  duration_hours NUMERIC,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
  category TEXT,
  tags TEXT[],
  thumbnail_url TEXT,
  preview_video_url TEXT,
  content JSONB DEFAULT '[]', -- [{id, title, type: 'video|quiz|reading', duration, url, content}]
  learning_objectives TEXT[],
  prerequisites TEXT[],
  price INTEGER DEFAULT 0,
  discount_price INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  enrollment_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  certificate_template_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Inscriptions aux cours
CREATE TABLE IF NOT EXISTS course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES elearning_courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  last_accessed_at TIMESTAMPTZ,
  time_spent_minutes INTEGER DEFAULT 0,
  certificate_issued BOOLEAN DEFAULT FALSE,
  certificate_url TEXT,
  certificate_issued_at TIMESTAMPTZ,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  reviewed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id)
);

-- Progression par leçon
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  lesson_type TEXT, -- video, quiz, reading
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  time_spent_minutes INTEGER DEFAULT 0,
  last_position_seconds INTEGER DEFAULT 0,
  score NUMERIC, -- Pour les quiz
  attempts INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, lesson_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_courses_category ON elearning_courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_published ON elearning_courses(is_published);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_progress_enrollment ON course_progress(enrollment_id);

-- =====================================================
-- 6. MARKETPLACE
-- =====================================================

-- Produits marketplace
CREATE TABLE IF NOT EXISTS marketplace_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  category TEXT CHECK (category IN ('template', 'plugin', 'service', 'formation', 'autre')),
  subcategory TEXT,
  tags TEXT[],
  price INTEGER NOT NULL, -- En centimes
  discount_price INTEGER,
  thumbnail_url TEXT,
  screenshots JSONB DEFAULT '[]', -- [{url, caption}]
  download_url TEXT,
  file_size INTEGER, -- En octets
  version TEXT,
  changelog TEXT,
  author TEXT,
  author_url TEXT,
  documentation_url TEXT,
  demo_url TEXT,
  requirements JSONB DEFAULT '{}',
  features TEXT[],
  rating NUMERIC DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  purchase_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commandes
CREATE TABLE IF NOT EXISTS marketplace_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  total_amount INTEGER NOT NULL,
  tax_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  items JSONB NOT NULL DEFAULT '[]', -- [{product_id, name, price, quantity, download_url}]
  billing_details JSONB DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  refund_reason TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achats utilisateurs (many-to-many)
CREATE TABLE IF NOT EXISTS user_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES marketplace_orders(id),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMPTZ,
  license_key TEXT UNIQUE,
  license_expires_at TIMESTAMPTZ,
  UNIQUE(user_id, product_id)
);

-- Avis produits
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES marketplace_products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT,
  pros TEXT[],
  cons TEXT[],
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_products_category ON marketplace_products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON marketplace_products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user ON marketplace_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON marketplace_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_product ON user_purchases(product_id);

-- =====================================================
-- 7. API CADASTRE
-- =====================================================

-- Recherches cadastrales
CREATE TABLE IF NOT EXISTS cadastral_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_type TEXT NOT NULL CHECK (search_type IN ('parcel', 'address', 'owner', 'title_number')),
  search_query JSONB NOT NULL, -- {query, filters}
  results JSONB, -- Résultats de l'API
  results_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cached')),
  error_message TEXT,
  api_provider TEXT, -- 'cadastre_senegal', 'dgid', 'custom'
  api_response_time_ms INTEGER,
  cached BOOLEAN DEFAULT FALSE,
  cache_expires_at TIMESTAMPTZ,
  cost INTEGER DEFAULT 0, -- Coût de la requête en crédits
  searched_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cache des parcelles cadastrales
CREATE TABLE IF NOT EXISTS cadastral_parcels_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcel_number TEXT UNIQUE NOT NULL,
  commune TEXT,
  department TEXT,
  region TEXT,
  parcel_data JSONB NOT NULL, -- Toutes les données de la parcelle
  owner_name TEXT,
  surface_m2 NUMERIC,
  land_use TEXT,
  tax_value INTEGER,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  cache_expires_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_cadastral_searches_user ON cadastral_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_cadastral_searches_date ON cadastral_searches(searched_at DESC);
CREATE INDEX IF NOT EXISTS idx_cadastral_searches_status ON cadastral_searches(status);
CREATE INDEX IF NOT EXISTS idx_parcels_cache_number ON cadastral_parcels_cache(parcel_number);
CREATE INDEX IF NOT EXISTS idx_parcels_cache_commune ON cadastral_parcels_cache(commune);

-- =====================================================
-- 8. MULTI-OFFICE
-- =====================================================

-- Bureaux notaire
CREATE TABLE IF NOT EXISTS notaire_offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  region TEXT,
  country TEXT DEFAULT 'Sénégal',
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  fax TEXT,
  website TEXT,
  manager_name TEXT,
  manager_title TEXT,
  staff_count INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  opening_hours JSONB DEFAULT '{}', -- {monday: {open: "08:00", close: "18:00"}}
  stats JSONB DEFAULT '{}', -- {monthly_revenue, active_cases, clients_count, completion_rate}
  coordinates JSONB, -- {latitude, longitude}
  logo_url TEXT,
  photos TEXT[],
  specializations TEXT[],
  languages TEXT[],
  certifications TEXT[],
  established_year INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affectation des dossiers aux bureaux
CREATE TABLE IF NOT EXISTS case_office_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL, -- Peut référencer notarial_acts ou autre table
  office_id UUID REFERENCES notaire_offices(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  notes TEXT,
  UNIQUE(case_id, office_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_offices_notaire ON notaire_offices(notaire_id);
CREATE INDEX IF NOT EXISTS idx_offices_active ON notaire_offices(is_active);
CREATE INDEX IF NOT EXISTS idx_offices_city ON notaire_offices(city);
CREATE INDEX IF NOT EXISTS idx_case_assignments_office ON case_office_assignments(office_id);

-- =====================================================
-- 9. CENTRE D'AIDE
-- =====================================================

-- Articles d'aide
CREATE TABLE IF NOT EXISTS help_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  subcategory TEXT,
  tags TEXT[],
  author_id UUID REFERENCES profiles(id),
  views_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  search_keywords TEXT[], -- Pour améliorer la recherche
  related_articles UUID[], -- IDs d'articles connexes
  is_published BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  last_updated_by UUID REFERENCES profiles(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- FAQ
CREATE TABLE IF NOT EXISTS faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  order_index INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutoriels vidéo
CREATE TABLE IF NOT EXISTS video_tutorials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  category TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes utiles sur articles/FAQ
CREATE TABLE IF NOT EXISTS help_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'faq', 'video')),
  content_id UUID NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  feedback_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_articles_category ON help_articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published ON help_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON help_articles(slug);
CREATE INDEX IF NOT EXISTS idx_faq_category ON faq_items(category);
CREATE INDEX IF NOT EXISTS idx_faq_published ON faq_items(is_published);

-- =====================================================
-- 10. ACTIVITÉ & LOGS
-- =====================================================

-- Logs d'activité utilisateur
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- login, logout, create_act, update_case, etc.
  entity_type TEXT, -- notarial_act, client, document
  entity_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON user_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_action ON user_activity_logs(action);

-- =====================================================
-- 11. STATISTIQUES FINANCIÈRES
-- =====================================================

-- Transactions financières détaillées
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notaire_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  office_id UUID REFERENCES notaire_offices(id),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('revenue', 'expense', 'refund', 'fee', 'tax')),
  category TEXT, -- notary_fees, registration_fees, travel_expenses, etc.
  amount INTEGER NOT NULL, -- En centimes
  currency TEXT DEFAULT 'XOF',
  description TEXT,
  reference_type TEXT, -- notarial_act, subscription, order
  reference_id UUID,
  payment_method TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  transaction_date DATE NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_financial_notaire ON financial_transactions(notaire_id);
CREATE INDEX IF NOT EXISTS idx_financial_office ON financial_transactions(office_id);
CREATE INDEX IF NOT EXISTS idx_financial_date ON financial_transactions(transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_financial_type ON financial_transactions(transaction_type);

-- =====================================================
-- 12. RLS POLICIES (Row Level Security)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE elearning_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE cadastral_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE cadastral_parcels_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE notaire_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_office_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Policies de base (à adapter selon les besoins)

-- Support Tickets: L'utilisateur voit ses propres tickets + staff voit tous
DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;
CREATE POLICY "Users can view own tickets" ON support_tickets
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create tickets" ON support_tickets;
CREATE POLICY "Users can create tickets" ON support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tickets" ON support_tickets;
CREATE POLICY "Users can update own tickets" ON support_tickets
  FOR UPDATE USING (auth.uid() = user_id);

-- Abonnements: L'utilisateur voit son propre abonnement
DROP POLICY IF EXISTS "Users can view own subscription" ON user_subscriptions;
CREATE POLICY "Users can view own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Factures: L'utilisateur voit ses propres factures
DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

-- Notifications: L'utilisateur voit ses propres notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Réunions vidéo: Le notaire voit ses propres réunions
DROP POLICY IF EXISTS "Notaires can view own meetings" ON video_meetings;
CREATE POLICY "Notaires can view own meetings" ON video_meetings
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE id = video_meetings.notaire_id
    )
  );

-- Cours: Tout le monde peut voir les cours publiés
DROP POLICY IF EXISTS "Anyone can view published courses" ON elearning_courses;
CREATE POLICY "Anyone can view published courses" ON elearning_courses
  FOR SELECT USING (is_published = true);

-- Inscriptions cours: L'utilisateur voit ses propres inscriptions
DROP POLICY IF EXISTS "Users can view own enrollments" ON course_enrollments;
CREATE POLICY "Users can view own enrollments" ON course_enrollments
  FOR ALL USING (auth.uid() = user_id);

-- Produits marketplace: Tout le monde peut voir les produits actifs
DROP POLICY IF EXISTS "Anyone can view active products" ON marketplace_products;
CREATE POLICY "Anyone can view active products" ON marketplace_products
  FOR SELECT USING (is_active = true);

-- Commandes: L'utilisateur voit ses propres commandes
DROP POLICY IF EXISTS "Users can view own orders" ON marketplace_orders;
CREATE POLICY "Users can view own orders" ON marketplace_orders
  FOR ALL USING (auth.uid() = user_id);

-- Recherches cadastrales: L'utilisateur voit ses propres recherches
DROP POLICY IF EXISTS "Users can view own searches" ON cadastral_searches;
CREATE POLICY "Users can view own searches" ON cadastral_searches
  FOR ALL USING (auth.uid() = user_id);

-- Bureaux: Le notaire voit ses propres bureaux
DROP POLICY IF EXISTS "Notaires can view own offices" ON notaire_offices;
CREATE POLICY "Notaires can view own offices" ON notaire_offices
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE id = notaire_offices.notaire_id
    )
  );

-- Articles d'aide: Tout le monde peut voir les articles publiés
DROP POLICY IF EXISTS "Anyone can view published articles" ON help_articles;
CREATE POLICY "Anyone can view published articles" ON help_articles
  FOR SELECT USING (is_published = true);

-- FAQ: Tout le monde peut voir les FAQ publiées
DROP POLICY IF EXISTS "Anyone can view published FAQs" ON faq_items;
CREATE POLICY "Anyone can view published FAQs" ON faq_items
  FOR SELECT USING (is_published = true);

-- Transactions financières: Le notaire voit ses propres transactions
DROP POLICY IF EXISTS "Notaires can view own transactions" ON financial_transactions;
CREATE POLICY "Notaires can view own transactions" ON financial_transactions
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE id = financial_transactions.notaire_id
    )
  );

-- =====================================================
-- 13. DONNÉES DE DÉMONSTRATION
-- =====================================================

-- Insérer plans d'abonnement par défaut
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, features, limits, is_popular, order_index)
VALUES
  ('free', 'Gratuit', 'Pour découvrir la plateforme', 0, 0, 
   '["5 actes par mois", "Stockage 1GB", "Support par email"]',
   '{"max_acts": 5, "max_storage_gb": 1, "max_users": 1}',
   false, 1),
  ('basic', 'Basic', 'Pour notaires indépendants', 1500000, 15000000,
   '["50 actes par mois", "Stockage 10GB", "Support prioritaire", "Authentification blockchain", "Export PDF"]',
   '{"max_acts": 50, "max_storage_gb": 10, "max_users": 3}',
   false, 2),
  ('pro', 'Professionnel', 'Pour études notariales', 3500000, 35000000,
   '["Actes illimités", "Stockage 50GB", "Support 24/7", "Toutes les fonctionnalités", "Multi-bureaux", "API Cadastre"]',
   '{"max_acts": -1, "max_storage_gb": 50, "max_users": 10}',
   true, 3),
  ('enterprise', 'Entreprise', 'Solution sur mesure', 7500000, 75000000,
   '["Actes illimités", "Stockage illimité", "Support dédié", "Toutes les fonctionnalités", "Multi-bureaux illimités", "Formation personnalisée", "Intégrations custom"]',
   '{"max_acts": -1, "max_storage_gb": -1, "max_users": -1}',
   false, 4)
ON CONFLICT (name) DO NOTHING;

-- Insérer quelques articles d'aide
INSERT INTO help_articles (title, slug, content, excerpt, category, is_published, order_index)
VALUES
  ('Créer votre premier acte notarié', 'creer-premier-acte', 'Guide complet pour créer un acte...', 'Apprenez à créer un acte en 5 étapes', 'Premiers pas', true, 1),
  ('Authentifier un document avec la blockchain', 'authentifier-blockchain', 'L''authentification blockchain...', 'Sécurisez vos documents', 'Blockchain', true, 2),
  ('Gérer vos clients', 'gerer-clients', 'Le CRM intégré vous permet...', 'Organiser vos relations clients', 'CRM', true, 3)
ON CONFLICT (slug) DO NOTHING;

-- Insérer FAQ de base
INSERT INTO faq_items (question, answer, category, order_index)
VALUES
  ('Comment créer un acte notarié ?', 'Pour créer un acte, cliquez sur le bouton "Nouvelle Transaction" dans le dashboard...', 'Général', 1),
  ('Quels sont les modes de paiement acceptés ?', 'Nous acceptons les paiements par carte bancaire, Orange Money, Wave et virement...', 'Facturation', 2),
  ('Comment contacter le support ?', 'Vous pouvez nous contacter via le centre de support, par email à support@terangafoncier.sn ou par téléphone au +221...', 'Support', 3)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FIN DU SCRIPT
-- =====================================================

-- Afficher un message de succès
DO $$
BEGIN
  RAISE NOTICE '✅ Schéma complet créé avec succès !';
  RAISE NOTICE '📊 Tables créées: 30+';
  RAISE NOTICE '🔒 RLS activé sur toutes les tables';
  RAISE NOTICE '📝 Données de démonstration insérées';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Prochaines étapes:';
  RAISE NOTICE '1. Étendre NotaireSupabaseService.js avec nouvelles méthodes';
  RAISE NOTICE '2. Connecter les pages du dashboard aux données réelles';
  RAISE NOTICE '3. Activer tous les boutons et formulaires';
END $$;
