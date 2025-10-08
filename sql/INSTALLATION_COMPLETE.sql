-- =============================================================================
-- INSTALLATION COMPLÈTE - TOUT-EN-UN
-- =============================================================================
-- Date: 2025-10-07
-- Description: Installation complète des 3 systèmes en UN SEUL script
-- Ordre: Cleanup → Support → Messagerie → Services Digitaux
-- =============================================================================

-- =============================================================================
-- ÉTAPE 0: NETTOYAGE
-- =============================================================================

SET session_replication_role = 'replica';

DROP TABLE IF EXISTS support_responses CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS support_categories CASCADE;
DROP TABLE IF EXISTS message_reactions CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS service_invoices CASCADE;
DROP TABLE IF EXISTS service_usage CASCADE;
DROP TABLE IF EXISTS service_subscriptions CASCADE;
DROP TABLE IF EXISTS digital_services CASCADE;

DROP VIEW IF EXISTS support_tickets_with_stats CASCADE;
DROP VIEW IF EXISTS support_stats CASCADE;
DROP VIEW IF EXISTS conversations_with_details CASCADE;
DROP VIEW IF EXISTS messages_with_sender CASCADE;
DROP VIEW IF EXISTS messaging_stats CASCADE;
DROP VIEW IF EXISTS subscriptions_with_services CASCADE;
DROP VIEW IF EXISTS usage_stats_by_service CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS generate_ticket_number() CASCADE;
DROP FUNCTION IF EXISTS set_first_response_at() CASCADE;
DROP FUNCTION IF EXISTS update_conversation_on_new_message() CASCADE;
DROP FUNCTION IF EXISTS update_unread_count_on_read() CASCADE;
DROP FUNCTION IF EXISTS mark_conversation_as_read(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS archive_conversation(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS increment_subscription_usage() CASCADE;
DROP FUNCTION IF EXISTS check_usage_limit() CASCADE;
DROP FUNCTION IF EXISTS generate_invoice_number() CASCADE;
DROP FUNCTION IF EXISTS create_subscription_invoice(UUID) CASCADE;
DROP FUNCTION IF EXISTS renew_subscription(UUID) CASCADE;

SET session_replication_role = 'origin';

-- =============================================================================
-- FONCTION COMMUNE: update_updated_at_column
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- ÉTAPE 1: TABLES SUPPORT
-- =============================================================================

-- Table: support_categories
CREATE TABLE support_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(50),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: support_tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature', 'question', 'help')),
  priority VARCHAR(50) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  category VARCHAR(100),
  tags TEXT[],
  first_response_at TIMESTAMP WITH TIME ZONE,
  first_response_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  closed_at TIMESTAMP WITH TIME ZONE,
  closed_by UUID REFERENCES auth.users(id),
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: support_responses
CREATE TABLE support_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE,
  is_internal BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]'::jsonb,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes Support
CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_responses_ticket_id ON support_responses(ticket_id);

-- RLS Support
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users create tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update own tickets" ON support_tickets
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users view ticket responses" ON support_responses
  FOR SELECT USING (ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid()) AND is_internal = FALSE);
CREATE POLICY "Users create responses" ON support_responses
  FOR INSERT WITH CHECK (user_id = auth.uid() AND is_staff = FALSE);
CREATE POLICY "Everyone views active categories" ON support_categories
  FOR SELECT USING (is_active = TRUE);

-- Triggers Support
CREATE TRIGGER update_support_tickets_updated_at 
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_support_responses_updated_at 
  BEFORE UPDATE ON support_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonctions Support
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    new_number := 'TK-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
    SELECT EXISTS(SELECT 1 FROM support_tickets WHERE ticket_number = new_number) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_first_response_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_staff = TRUE THEN
    UPDATE support_tickets 
    SET first_response_at = NOW(), first_response_by = NEW.user_id,
        status = CASE WHEN status = 'open' THEN 'in_progress' ELSE status END
    WHERE id = NEW.ticket_id AND first_response_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_first_response 
  AFTER INSERT ON support_responses
  FOR EACH ROW EXECUTE FUNCTION set_first_response_at();

-- Données Support
INSERT INTO support_categories (name, slug, description, icon, color, display_order) VALUES
  ('Compte & Authentification', 'compte', 'Problèmes de connexion, inscription, mot de passe', 'User', '#3B82F6', 1),
  ('Propriétés & Annonces', 'proprietes', 'Gestion des propriétés, publication, modification', 'Building', '#10B981', 2),
  ('Paiements & Facturation', 'paiements', 'Questions sur les paiements, abonnements, factures', 'CreditCard', '#F59E0B', 3),
  ('Technique & Bugs', 'technique', 'Bugs, erreurs techniques, problèmes de performance', 'AlertTriangle', '#EF4444', 4),
  ('Fonctionnalités', 'fonctionnalites', 'Suggestions de nouvelles fonctionnalités', 'Sparkles', '#8B5CF6', 5),
  ('Autre', 'autre', 'Autres questions et demandes', 'HelpCircle', '#6B7280', 6)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- ÉTAPE 2: TABLES MESSAGERIE
-- =============================================================================

-- Table: conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_by UUID REFERENCES auth.users(id),
  last_message_preview TEXT,
  unread_count_vendor INTEGER DEFAULT 0,
  unread_count_buyer INTEGER DEFAULT 0,
  is_pinned_vendor BOOLEAN DEFAULT FALSE,
  is_pinned_buyer BOOLEAN DEFAULT FALSE,
  is_archived_vendor BOOLEAN DEFAULT FALSE,
  is_archived_buyer BOOLEAN DEFAULT FALSE,
  is_muted_vendor BOOLEAN DEFAULT FALSE,
  is_muted_buyer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(vendor_id, buyer_id, property_id)
);

-- Table: messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('vendor', 'buyer')),
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  read_at TIMESTAMP WITH TIME ZONE,
  read_by UUID REFERENCES auth.users(id),
  delivered_at TIMESTAMP WITH TIME ZONE,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: message_reactions
CREATE TABLE message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- Table: conversation_participants
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  notifications_enabled BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(conversation_id, user_id)
);

-- Indexes Messaging
CREATE INDEX idx_conversations_vendor_id ON conversations(vendor_id);
CREATE INDEX idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- RLS Messaging
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants view conversations" ON conversations
  FOR SELECT USING (vendor_id = auth.uid() OR buyer_id = auth.uid());
CREATE POLICY "Users create conversations" ON conversations
  FOR INSERT WITH CHECK (vendor_id = auth.uid() OR buyer_id = auth.uid());
CREATE POLICY "Participants update conversations" ON conversations
  FOR UPDATE USING (vendor_id = auth.uid() OR buyer_id = auth.uid());
CREATE POLICY "Participants view messages" ON messages
  FOR SELECT USING (conversation_id IN (SELECT id FROM conversations WHERE vendor_id = auth.uid() OR buyer_id = auth.uid()));
CREATE POLICY "Participants send messages" ON messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());
CREATE POLICY "Sender updates own messages" ON messages
  FOR UPDATE USING (sender_id = auth.uid());

-- Triggers Messaging
CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION update_conversation_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.sent_at, last_message_by = NEW.sender_id,
      last_message_preview = LEFT(NEW.content, 150),
      unread_count_vendor = CASE WHEN NEW.sender_type = 'buyer' THEN unread_count_vendor + 1 ELSE unread_count_vendor END,
      unread_count_buyer = CASE WHEN NEW.sender_type = 'vendor' THEN unread_count_buyer + 1 ELSE unread_count_buyer END,
      updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation 
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_new_message();

-- Fonctions Messaging
CREATE OR REPLACE FUNCTION mark_conversation_as_read(conv_id UUID, reader_id UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
  conv_record RECORD;
BEGIN
  SELECT vendor_id, buyer_id INTO conv_record FROM conversations WHERE id = conv_id;
  UPDATE messages SET read_at = NOW(), read_by = reader_id
  WHERE conversation_id = conv_id AND read_at IS NULL AND sender_id != reader_id;
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  IF reader_id = conv_record.vendor_id THEN
    UPDATE conversations SET unread_count_vendor = 0 WHERE id = conv_id;
  ELSIF reader_id = conv_record.buyer_id THEN
    UPDATE conversations SET unread_count_buyer = 0 WHERE id = conv_id;
  END IF;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- ÉTAPE 3: TABLES SERVICES DIGITAUX
-- =============================================================================

-- Table: digital_services
CREATE TABLE digital_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  short_description VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(50),
  plans JSONB NOT NULL DEFAULT '[]'::jsonb,
  api_endpoint VARCHAR(500),
  settings JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: service_subscriptions
CREATE TABLE service_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES digital_services(id) ON DELETE CASCADE,
  plan_name VARCHAR(100) NOT NULL,
  plan_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  billing_period VARCHAR(50) DEFAULT 'monthly',
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'canceled', 'expired', 'trial')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  auto_renew BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: service_usage
CREATE TABLE service_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES digital_services(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES service_subscriptions(id) ON DELETE SET NULL,
  action VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending', 'canceled')),
  units_consumed INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: service_invoices
CREATE TABLE service_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES service_subscriptions(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'canceled')),
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE,
  line_items JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes Services
CREATE INDEX idx_digital_services_slug ON digital_services(slug);
CREATE INDEX idx_subscriptions_user_id ON service_subscriptions(user_id);
CREATE INDEX idx_usage_user_id ON service_usage(user_id);

-- RLS Services
ALTER TABLE digital_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone views active services" ON digital_services
  FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Users view own subscriptions" ON service_subscriptions
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users create subscriptions" ON service_subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users view own usage" ON service_usage
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users create usage records" ON service_usage
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users view own invoices" ON service_invoices
  FOR SELECT USING (user_id = auth.uid());

-- Triggers Services
CREATE TRIGGER update_digital_services_updated_at 
  BEFORE UPDATE ON digital_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_subscriptions_updated_at 
  BEFORE UPDATE ON service_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données Services
INSERT INTO digital_services (name, slug, description, category, icon, color, plans, is_active, is_featured, display_order) VALUES
  ('Signature Électronique', 'signature-electronique', 'Signez vos documents immobiliers en ligne', 'signature', 'PenTool', '#3B82F6',
   '[{"name":"Free","price":0,"period":"monthly","features":["5 signatures/mois"],"usage_limit":5},{"name":"Premium","price":14900,"period":"monthly","features":["Illimité"],"usage_limit":null,"is_popular":true}]'::jsonb, TRUE, TRUE, 1),
  ('Visite Virtuelle 360°', 'visite-virtuelle', 'Visites virtuelles immersives', 'visite_virtuelle', 'Video', '#8B5CF6',
   '[{"name":"Basic","price":9900,"period":"monthly","features":["5 visites/mois"],"usage_limit":5},{"name":"Premium","price":24900,"period":"monthly","features":["Illimité","Points d''intérêt"],"usage_limit":null,"is_popular":true}]'::jsonb, TRUE, TRUE, 2),
  ('OCR Documents', 'ocr-documents', 'Numérisez vos documents', 'ocr', 'ScanText', '#10B981',
   '[{"name":"Basic","price":2900,"period":"monthly","features":["50 pages/mois"],"usage_limit":50},{"name":"Premium","price":9900,"period":"monthly","features":["500 pages/mois","IA"],"usage_limit":500,"is_popular":true}]'::jsonb, TRUE, FALSE, 3),
  ('Stockage Cloud', 'stockage-cloud', 'Stockage sécurisé', 'stockage', 'Cloud', '#F59E0B',
   '[{"name":"Free","price":0,"period":"monthly","features":["5 GB"],"usage_limit":5368709120},{"name":"Premium","price":4900,"period":"monthly","features":["500 GB"],"usage_limit":536870912000,"is_popular":true}]'::jsonb, TRUE, FALSE, 4),
  ('Marketing Digital', 'marketing-digital', 'Campagnes marketing', 'marketing', 'Megaphone', '#EC4899',
   '[{"name":"Basic","price":14900,"period":"monthly","features":["5 campagnes"],"usage_limit":5},{"name":"Premium","price":39900,"period":"monthly","features":["Illimité"],"usage_limit":null,"is_popular":true}]'::jsonb, TRUE, FALSE, 5),
  ('Assistance Juridique', 'assistance-juridique', 'Experts juridiques', 'juridique', 'Scale', '#EF4444',
   '[{"name":"Consultation","price":24900,"period":"one-time","features":["1 consultation"],"usage_limit":1},{"name":"Accompagnement","price":149900,"period":"monthly","features":["Illimité"],"usage_limit":null,"is_popular":true}]'::jsonb, TRUE, TRUE, 6)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- VÉRIFICATION FINALE
-- =============================================================================

SELECT 
  'Installation complète réussie!' AS status,
  (SELECT COUNT(*) FROM support_categories) AS categories,
  (SELECT COUNT(*) FROM digital_services) AS services,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN 
    ('support_tickets','conversations','digital_services')) AS tables_created;

-- =============================================================================
-- TERMINÉ! ✅
-- =============================================================================
