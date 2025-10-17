-- ========================================
-- 🚀 CRÉATION DES TABLES WORKFLOW D'ACHAT
-- Système complet de gestion des dossiers d'achat
-- ========================================

-- 1. Table principale des dossiers d'achat (purchase_cases)
CREATE TABLE IF NOT EXISTS purchase_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'TF-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
  
  -- Relations
  request_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parcelle_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
  
  -- Détails financiers
  purchase_price DECIMAL(15, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'cash',
  
  -- Workflow
  status VARCHAR(50) NOT NULL DEFAULT 'initiated',
  phase INTEGER DEFAULT 1 CHECK (phase >= 0 AND phase <= 4),
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Suivi
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Indexation
  CONSTRAINT valid_status CHECK (status IN (
    'initiated', 'buyer_verification', 'seller_notification',
    'negotiation', 'preliminary_agreement', 'contract_preparation',
    'legal_verification', 'document_audit', 'property_evaluation',
    'notary_appointment', 'signing_process', 'payment_processing',
    'property_transfer', 'completed',
    'cancelled', 'rejected', 'seller_declined', 'negotiation_failed', 'legal_issues_found'
  ))
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_purchase_cases_buyer ON purchase_cases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_seller ON purchase_cases(seller_id);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_parcelle ON purchase_cases(parcelle_id);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_status ON purchase_cases(status);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_phase ON purchase_cases(phase);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_created_at ON purchase_cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_cases_request ON purchase_cases(request_id);

-- 2. Table d'historique du workflow
CREATE TABLE IF NOT EXISTS purchase_case_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  
  -- Changement de statut
  status VARCHAR(50) NOT NULL,
  previous_status VARCHAR(50),
  
  -- Qui a fait le changement
  updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  updated_by_role VARCHAR(50),
  
  -- Détails
  notes TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexation
  CONSTRAINT valid_history_status CHECK (status IN (
    'initiated', 'buyer_verification', 'seller_notification',
    'negotiation', 'preliminary_agreement', 'contract_preparation',
    'legal_verification', 'document_audit', 'property_evaluation',
    'notary_appointment', 'signing_process', 'payment_processing',
    'property_transfer', 'completed',
    'cancelled', 'rejected', 'seller_declined', 'negotiation_failed', 'legal_issues_found'
  ))
);

CREATE INDEX IF NOT EXISTS idx_case_history_case ON purchase_case_history(case_id);
CREATE INDEX IF NOT EXISTS idx_case_history_status ON purchase_case_history(status);
CREATE INDEX IF NOT EXISTS idx_case_history_created ON purchase_case_history(created_at DESC);

-- 3. Table des documents du dossier
CREATE TABLE IF NOT EXISTS purchase_case_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  
  -- Détails du document
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  size BIGINT,
  url TEXT NOT NULL,
  
  -- Validation
  status VARCHAR(50) DEFAULT 'pending',
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Upload
  uploaded_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT valid_doc_status CHECK (status IN ('pending', 'verified', 'rejected', 'expired'))
);

CREATE INDEX IF NOT EXISTS idx_case_docs_case ON purchase_case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_docs_type ON purchase_case_documents(type);
CREATE INDEX IF NOT EXISTS idx_case_docs_status ON purchase_case_documents(status);

-- 4. Table des négociations
CREATE TABLE IF NOT EXISTS purchase_case_negotiations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  
  -- Proposition
  proposed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  proposed_price DECIMAL(15, 2) NOT NULL,
  proposed_terms JSONB DEFAULT '{}'::jsonb,
  message TEXT,
  
  -- Réponse
  status VARCHAR(50) DEFAULT 'pending',
  responded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  response_message TEXT,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_negotiation_status CHECK (status IN ('pending', 'accepted', 'rejected', 'counter_offer'))
);

CREATE INDEX IF NOT EXISTS idx_negotiations_case ON purchase_case_negotiations(case_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_status ON purchase_case_negotiations(status);

-- 5. Fonction pour auto-incrémenter le case_number
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
DECLARE
  daily_count INTEGER;
BEGIN
  -- Compter les dossiers créés aujourd'hui
  SELECT COUNT(*) + 1 INTO daily_count
  FROM purchase_cases
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Générer le numéro unique
  NEW.case_number := 'TF-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(daily_count::TEXT, 4, '0');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement le case_number
DROP TRIGGER IF EXISTS set_case_number ON purchase_cases;
CREATE TRIGGER set_case_number
  BEFORE INSERT ON purchase_cases
  FOR EACH ROW
  EXECUTE FUNCTION generate_case_number();

-- 6. Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at sur purchase_cases
DROP TRIGGER IF EXISTS update_purchase_cases_updated_at ON purchase_cases;
CREATE TRIGGER update_purchase_cases_updated_at
  BEFORE UPDATE ON purchase_cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Row Level Security (RLS)

-- Activer RLS sur purchase_cases
ALTER TABLE purchase_cases ENABLE ROW LEVEL SECURITY;

-- Policy: Les acheteurs voient leurs dossiers
CREATE POLICY "Buyers can view their cases"
  ON purchase_cases FOR SELECT
  USING (buyer_id = auth.uid());

-- Policy: Les vendeurs voient leurs dossiers
CREATE POLICY "Sellers can view their cases"
  ON purchase_cases FOR SELECT
  USING (seller_id = auth.uid());

-- Policy: Les admins voient tout
CREATE POLICY "Admins can view all cases"
  ON purchase_cases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Policy: Création de dossiers
CREATE POLICY "Authenticated users can create cases"
  ON purchase_cases FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Mise à jour par les parties concernées
CREATE POLICY "Parties can update their cases"
  ON purchase_cases FOR UPDATE
  USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR updated_by = auth.uid());

-- RLS sur purchase_case_history
ALTER TABLE purchase_case_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view history of their cases"
  ON purchase_case_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM purchase_cases
      WHERE id = purchase_case_history.case_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can add history to their cases"
  ON purchase_case_history FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM purchase_cases
      WHERE id = purchase_case_history.case_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );

-- RLS sur purchase_case_documents
ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents of their cases"
  ON purchase_case_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM purchase_cases
      WHERE id = purchase_case_documents.case_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can upload documents to their cases"
  ON purchase_case_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM purchase_cases
      WHERE id = purchase_case_documents.case_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );

-- RLS sur purchase_case_negotiations
ALTER TABLE purchase_case_negotiations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view negotiations of their cases"
  ON purchase_case_negotiations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM purchase_cases
      WHERE id = purchase_case_negotiations.case_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can create negotiations for their cases"
  ON purchase_case_negotiations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM purchase_cases
      WHERE id = purchase_case_negotiations.case_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );

-- 8. Vues utiles

-- Vue: Statistiques par statut
CREATE OR REPLACE VIEW purchase_case_stats AS
SELECT 
  status,
  phase,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (COALESCE(completed_at, NOW()) - created_at)) / 86400) as avg_duration_days
FROM purchase_cases
GROUP BY status, phase;

-- Vue: Dossiers actifs
CREATE OR REPLACE VIEW active_purchase_cases AS
SELECT 
  pc.*,
  buyer.email as buyer_email,
  seller.email as seller_email,
  p.title as parcel_title
FROM purchase_cases pc
LEFT JOIN profiles buyer ON pc.buyer_id = buyer.id
LEFT JOIN profiles seller ON pc.seller_id = seller.id
LEFT JOIN parcels p ON pc.parcelle_id = p.id
WHERE pc.status NOT IN ('completed', 'cancelled', 'rejected', 'seller_declined', 'negotiation_failed', 'legal_issues_found');

-- ========================================
-- ✅ VÉRIFICATION DE LA CRÉATION
-- ========================================

DO $$
BEGIN
  RAISE NOTICE '✅ Tables workflow créées avec succès !';
  RAISE NOTICE '📋 Tables: purchase_cases, purchase_case_history, purchase_case_documents, purchase_case_negotiations';
  RAISE NOTICE '🔒 Row Level Security activé';
  RAISE NOTICE '🎯 Triggers et fonctions créés';
  RAISE NOTICE '📊 Vues analytiques disponibles';
END $$;

-- Afficher le nombre de tables créées
SELECT 
  'purchase_cases' as table_name, 
  COUNT(*) as row_count 
FROM purchase_cases
UNION ALL
SELECT 
  'purchase_case_history' as table_name, 
  COUNT(*) as row_count 
FROM purchase_case_history
UNION ALL
SELECT 
  'purchase_case_documents' as table_name, 
  COUNT(*) as row_count 
FROM purchase_case_documents
UNION ALL
SELECT 
  'purchase_case_negotiations' as table_name, 
  COUNT(*) as row_count 
FROM purchase_case_negotiations;
