-- 🎫 TABLES POUR TICKETS ET ABONNEMENTS
-- Exécutez ce script dans Supabase SQL Editor

-- ============================================
-- 1. TABLE support_tickets
-- ============================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('technical', 'billing', 'feature', 'bug', 'other')),
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  messages JSONB DEFAULT '[]'::jsonb,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets"
  ON support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets"
  ON support_tickets FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 2. TABLE subscriptions
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. TABLE invoices
-- ============================================
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XOF',
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR(50),
  payment_provider VARCHAR(50),
  transaction_id VARCHAR(255),
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);

-- RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 4. TRIGGERS pour updated_at
-- ============================================

-- Fonction trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. DONNÉES DE TEST
-- ============================================

-- Créer un abonnement gratuit pour les notaires existants
INSERT INTO subscriptions (user_id, plan, status, start_date)
SELECT id, 'free', 'active', NOW()
FROM profiles
WHERE role = 'Notaire'
ON CONFLICT (user_id) DO NOTHING;

-- Créer des tickets de test pour Me. Jean Dupont
INSERT INTO support_tickets (user_id, ticket_number, subject, description, category, priority, status, messages, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'TKT-00001', 'Problème d''authentification blockchain', 'Je ne peux pas authentifier mes documents via la blockchain depuis ce matin', 'technical', 'high', 'open', 
  '[{"from": "user", "message": "Je ne peux pas authentifier mes documents via la blockchain depuis ce matin", "timestamp": "2025-10-06T08:30:00Z"}]'::jsonb,
  NOW() - INTERVAL '2 days'),
  
('11111111-1111-1111-1111-111111111111', 'TKT-00002', 'Question sur la facturation', 'Comment puis-je obtenir une facture détaillée de mon abonnement ?', 'billing', 'medium', 'in_progress',
  '[{"from": "user", "message": "Comment puis-je obtenir une facture détaillée ?", "timestamp": "2025-10-05T14:20:00Z"}, {"from": "support", "message": "Bonjour, les factures sont disponibles dans l''onglet Abonnement", "timestamp": "2025-10-05T15:00:00Z"}]'::jsonb,
  NOW() - INTERVAL '3 days'),
  
('11111111-1111-1111-1111-111111111111', 'TKT-00003', 'Demande nouvelle fonctionnalité', 'Serait-il possible d''ajouter un export Excel des actes ?', 'feature', 'low', 'resolved',
  '[{"from": "user", "message": "Export Excel serait très utile", "timestamp": "2025-09-28T10:00:00Z"}, {"from": "support", "message": "Excellente idée ! Nous l''ajoutons à notre roadmap", "timestamp": "2025-09-29T09:00:00Z"}]'::jsonb,
  NOW() - INTERVAL '10 days');

-- Créer des factures de test
INSERT INTO invoices (user_id, invoice_number, amount, status, description, paid_at, created_at) VALUES
('11111111-1111-1111-1111-111111111111', 'INV-2025-001', 25000, 'paid', 'Abonnement Professionnel - Septembre 2025', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 month'),
('11111111-1111-1111-1111-111111111111', 'INV-2025-002', 25000, 'paid', 'Abonnement Professionnel - Août 2025', NOW() - INTERVAL '35 days', NOW() - INTERVAL '2 months'),
('11111111-1111-1111-1111-111111111111', 'INV-2025-003', 25000, 'pending', 'Abonnement Professionnel - Octobre 2025', NULL, NOW() - INTERVAL '1 day');

-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT 'support_tickets' as table_name, COUNT(*) as records FROM support_tickets
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices;
