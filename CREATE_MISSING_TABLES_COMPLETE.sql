-- ============================================
-- CRÉATION DES TABLES MANQUANTES POUR DASHBOARD ACHETEUR
-- Date: 23 Octobre 2025
-- ============================================

-- ============================================
-- 1. TABLE: blockchain_certificates
-- Stocke les certificats blockchain des propriétés
-- ============================================
CREATE TABLE IF NOT EXISTS blockchain_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  certificate_type VARCHAR(50) NOT NULL CHECK (certificate_type IN ('ownership', 'contract', 'evaluation', 'authentication', 'transfer')),
  blockchain_hash VARCHAR(255) NOT NULL UNIQUE,
  transaction_hash VARCHAR(255),
  blockchain_network VARCHAR(50) DEFAULT 'polygon' CHECK (blockchain_network IN ('ethereum', 'polygon', 'binance', 'solana')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'expired')),
  smart_contract_address VARCHAR(255),
  token_id VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  verification_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  issuer_name VARCHAR(255),
  issuer_address VARCHAR(255),
  document_url TEXT,
  ipfs_hash VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour blockchain_certificates
CREATE INDEX idx_blockchain_certificates_user_id ON blockchain_certificates(user_id);
CREATE INDEX idx_blockchain_certificates_property_id ON blockchain_certificates(property_id);
CREATE INDEX idx_blockchain_certificates_status ON blockchain_certificates(status);
CREATE INDEX idx_blockchain_certificates_hash ON blockchain_certificates(blockchain_hash);

-- RLS pour blockchain_certificates
ALTER TABLE blockchain_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certificates"
  ON blockchain_certificates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates"
  ON blockchain_certificates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own certificates"
  ON blockchain_certificates FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- 2. TABLE: blockchain_transactions
-- Stocke l'historique des transactions blockchain
-- ============================================
CREATE TABLE IF NOT EXISTS blockchain_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  certificate_id UUID REFERENCES blockchain_certificates(id) ON DELETE SET NULL,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'certification', 'transfer', 'verification', 'authentication')),
  transaction_hash VARCHAR(255) NOT NULL UNIQUE,
  blockchain_network VARCHAR(50) DEFAULT 'polygon',
  from_address VARCHAR(255),
  to_address VARCHAR(255),
  amount NUMERIC(20, 2) DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'FCFA',
  gas_fee NUMERIC(20, 8),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
  confirmations INTEGER DEFAULT 0,
  block_number BIGINT,
  block_timestamp TIMESTAMPTZ,
  smart_contract_address VARCHAR(255),
  function_called VARCHAR(100),
  input_data TEXT,
  output_data TEXT,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour blockchain_transactions
CREATE INDEX idx_blockchain_transactions_user_id ON blockchain_transactions(user_id);
CREATE INDEX idx_blockchain_transactions_property_id ON blockchain_transactions(property_id);
CREATE INDEX idx_blockchain_transactions_status ON blockchain_transactions(status);
CREATE INDEX idx_blockchain_transactions_hash ON blockchain_transactions(transaction_hash);
CREATE INDEX idx_blockchain_transactions_created_at ON blockchain_transactions(created_at DESC);

-- RLS pour blockchain_transactions
ALTER TABLE blockchain_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON blockchain_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON blockchain_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 3. TABLE: ai_conversations
-- Stocke les conversations avec l'assistant IA
-- ============================================
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  conversation_type VARCHAR(50) DEFAULT 'general' CHECK (conversation_type IN ('general', 'property_search', 'price_estimation', 'document_analysis', 'market_analysis', 'legal_advice')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  summary TEXT,
  context JSONB DEFAULT '{}',
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour ai_conversations
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_status ON ai_conversations(status);
CREATE INDEX idx_ai_conversations_last_message_at ON ai_conversations(last_message_at DESC);

-- RLS pour ai_conversations
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI conversations"
  ON ai_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI conversations"
  ON ai_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI conversations"
  ON ai_conversations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI conversations"
  ON ai_conversations FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. TABLE: ai_messages
-- Stocke les messages des conversations IA
-- ============================================
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'ai')),
  content TEXT NOT NULL,
  content_type VARCHAR(50) DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'document', 'voice', 'structured_data')),
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  ai_model VARCHAR(50),
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  confidence_score NUMERIC(3, 2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour ai_messages
CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created_at ON ai_messages(created_at);

-- RLS pour ai_messages
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI messages"
  ON ai_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own AI messages"
  ON ai_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. TABLE: calendar_appointments
-- Stocke les rendez-vous du calendrier
-- ============================================
CREATE TABLE IF NOT EXISTS calendar_appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  purchase_request_id UUID REFERENCES purchase_requests(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  appointment_type VARCHAR(50) NOT NULL CHECK (appointment_type IN ('viewing', 'meeting', 'signing', 'inspection', 'consultation', 'other')),
  location VARCHAR(500),
  location_type VARCHAR(50) DEFAULT 'physical' CHECK (location_type IN ('physical', 'virtual', 'phone')),
  meeting_url TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
  reminder_minutes INTEGER DEFAULT 30,
  reminder_sent BOOLEAN DEFAULT FALSE,
  attendees JSONB DEFAULT '[]',
  notes TEXT,
  color VARCHAR(20) DEFAULT 'blue',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Index pour calendar_appointments
CREATE INDEX idx_calendar_appointments_user_id ON calendar_appointments(user_id);
CREATE INDEX idx_calendar_appointments_property_id ON calendar_appointments(property_id);
CREATE INDEX idx_calendar_appointments_start_time ON calendar_appointments(start_time);
CREATE INDEX idx_calendar_appointments_status ON calendar_appointments(status);
CREATE INDEX idx_calendar_appointments_type ON calendar_appointments(appointment_type);

-- RLS pour calendar_appointments
ALTER TABLE calendar_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own appointments"
  ON calendar_appointments FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = created_by);

CREATE POLICY "Users can insert own appointments"
  ON calendar_appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
  ON calendar_appointments FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = created_by);

CREATE POLICY "Users can delete own appointments"
  ON calendar_appointments FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = created_by);

-- ============================================
-- 6. TABLE: documents_administratifs (vérification/amélioration)
-- Si la table existe déjà, cette commande sera ignorée
-- ============================================
CREATE TABLE IF NOT EXISTS documents_administratifs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  purchase_request_id UUID REFERENCES purchase_requests(id) ON DELETE SET NULL,
  case_reference VARCHAR(50),
  file_name VARCHAR(500) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  document_type VARCHAR(100) NOT NULL CHECK (document_type IN (
    'identity_card', 'passport', 'residence_permit', 'birth_certificate',
    'marriage_certificate', 'tax_certificate', 'income_proof', 'bank_statement',
    'property_title', 'land_certificate', 'building_permit', 'occupancy_certificate',
    'survey_plan', 'valuation_report', 'purchase_agreement', 'sale_contract',
    'power_of_attorney', 'court_judgment', 'inheritance_deed', 'lease_agreement',
    'other'
  )),
  file_format VARCHAR(20) DEFAULT 'pdf',
  file_size VARCHAR(50),
  storage_path TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'expired')),
  uploaded_by UUID REFERENCES auth.users(id),
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  version VARCHAR(20) DEFAULT '1.0',
  access_level VARCHAR(50) DEFAULT 'private' CHECK (access_level IN ('private', 'shared', 'public')),
  workflow_stage VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  expiry_date DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour documents_administratifs
CREATE INDEX IF NOT EXISTS idx_documents_administratifs_user_id ON documents_administratifs(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_administratifs_property_id ON documents_administratifs(property_id);
CREATE INDEX IF NOT EXISTS idx_documents_administratifs_status ON documents_administratifs(status);
CREATE INDEX IF NOT EXISTS idx_documents_administratifs_type ON documents_administratifs(document_type);

-- RLS pour documents_administratifs
ALTER TABLE documents_administratifs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own documents" ON documents_administratifs;
CREATE POLICY "Users can view own documents"
  ON documents_administratifs FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Users can insert own documents" ON documents_administratifs;
CREATE POLICY "Users can insert own documents"
  ON documents_administratifs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own documents" ON documents_administratifs;
CREATE POLICY "Users can update own documents"
  ON documents_administratifs FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = uploaded_by);

DROP POLICY IF EXISTS "Users can delete own documents" ON documents_administratifs;
CREATE POLICY "Users can delete own documents"
  ON documents_administratifs FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = uploaded_by);

-- ============================================
-- TRIGGERS pour updated_at automatique
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blockchain_certificates_updated_at ON blockchain_certificates;
CREATE TRIGGER update_blockchain_certificates_updated_at
  BEFORE UPDATE ON blockchain_certificates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blockchain_transactions_updated_at ON blockchain_transactions;
CREATE TRIGGER update_blockchain_transactions_updated_at
  BEFORE UPDATE ON blockchain_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_conversations_updated_at ON ai_conversations;
CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calendar_appointments_updated_at ON calendar_appointments;
CREATE TRIGGER update_calendar_appointments_updated_at
  BEFORE UPDATE ON calendar_appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_administratifs_updated_at ON documents_administratifs;
CREATE TRIGGER update_documents_administratifs_updated_at
  BEFORE UPDATE ON documents_administratifs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONNÉES DE TEST (optionnel)
-- ============================================
-- Ajouter quelques certificats blockchain de test
-- INSERT INTO blockchain_certificates (user_id, title, certificate_type, blockchain_hash, status)
-- SELECT 
--   id,
--   'Certificat de propriété - Dakar Plateau',
--   'ownership',
--   '0x' || md5(random()::text),
--   'verified'
-- FROM auth.users
-- LIMIT 1;

-- ============================================
-- FIN DU SCRIPT
-- ============================================
COMMENT ON TABLE blockchain_certificates IS 'Certificats blockchain des propriétés';
COMMENT ON TABLE blockchain_transactions IS 'Historique des transactions blockchain';
COMMENT ON TABLE ai_conversations IS 'Conversations avec l''assistant IA';
COMMENT ON TABLE ai_messages IS 'Messages des conversations IA';
COMMENT ON TABLE calendar_appointments IS 'Rendez-vous du calendrier utilisateur';
COMMENT ON TABLE documents_administratifs IS 'Documents administratifs des utilisateurs';
