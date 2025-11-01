-- Migration: Créer table payment_transactions pour Phase 4
-- Date: 2024
-- Description: Table pour suivre toutes les transactions de paiement (Wave, Orange Money, CB, Virement)

-- =====================================================
-- TABLE: payment_transactions
-- =====================================================

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  notary_request_id UUID REFERENCES notary_payment_requests(id) ON DELETE CASCADE,
  case_id UUID REFERENCES purchase_cases(id) ON DELETE CASCADE,
  payer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Montant et devise
  amount DECIMAL(15, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'XOF',
  
  -- Méthode de paiement
  payment_method VARCHAR(50) NOT NULL, -- 'wave', 'orange_money', 'bank_transfer', 'card'
  
  -- Statut
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled', 'pending_verification'
  
  -- Identifiants externes (des passerelles)
  external_transaction_id TEXT, -- ID de Wave/Orange/PayTech
  payment_url TEXT, -- URL de paiement (pour redirection)
  
  -- Métadonnées (JSON flexible)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Informations de paiement
  paid_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  
  -- Raison d'échec
  failure_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEX
-- =====================================================

CREATE INDEX idx_payment_transactions_notary_request ON payment_transactions(notary_request_id);
CREATE INDEX idx_payment_transactions_case ON payment_transactions(case_id);
CREATE INDEX idx_payment_transactions_payer ON payment_transactions(payer_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_method ON payment_transactions(payment_method);
CREATE INDEX idx_payment_transactions_external_id ON payment_transactions(external_transaction_id);

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Policy 1: SELECT - Utilisateurs peuvent voir leurs propres transactions
CREATE POLICY "Users can view their own transactions"
  ON payment_transactions
  FOR SELECT
  USING (
    payer_id = auth.uid()
    OR
    -- Notaires peuvent voir les transactions de leurs dossiers
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = payment_transactions.case_id
      AND pc.notaire_id = auth.uid()
    )
    OR
    -- Admins peuvent tout voir
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy 2: INSERT - Uniquement les payeurs peuvent créer des transactions
CREATE POLICY "Payers can create transactions"
  ON payment_transactions
  FOR INSERT
  WITH CHECK (
    payer_id = auth.uid()
    OR
    -- Admins peuvent créer des transactions
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy 3: UPDATE - Payeurs et notaires peuvent mettre à jour (webhooks via service_role)
CREATE POLICY "Update transactions"
  ON payment_transactions
  FOR UPDATE
  USING (
    payer_id = auth.uid()
    OR
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = payment_transactions.case_id
      AND pc.notaire_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Policy 4: DELETE - Uniquement admins
CREATE POLICY "Only admins can delete transactions"
  ON payment_transactions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- TRIGGER: Auto-update updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_payment_transaction_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_payment_transaction_updated_at
  BEFORE UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_transaction_updated_at();

-- =====================================================
-- FONCTION: Marquer transaction comme payée
-- =====================================================

CREATE OR REPLACE FUNCTION mark_transaction_as_paid(
  p_transaction_id UUID,
  p_external_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_notary_request_id UUID;
BEGIN
  -- Mettre à jour la transaction
  UPDATE payment_transactions
  SET 
    status = 'completed',
    paid_at = NOW(),
    external_transaction_id = COALESCE(p_external_id, external_transaction_id)
  WHERE id = p_transaction_id
  RETURNING notary_request_id INTO v_notary_request_id;
  
  -- Si c'est lié à une demande de paiement notaire, la marquer comme payée aussi
  IF v_notary_request_id IS NOT NULL THEN
    UPDATE notary_payment_requests
    SET 
      status = 'paid',
      paid_at = NOW()
    WHERE id = v_notary_request_id;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- FONCTION: Marquer transaction comme échouée
-- =====================================================

CREATE OR REPLACE FUNCTION mark_transaction_as_failed(
  p_transaction_id UUID,
  p_failure_reason TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE payment_transactions
  SET 
    status = 'failed',
    failed_at = NOW(),
    failure_reason = p_failure_reason
  WHERE id = p_transaction_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VUE: Statistiques des paiements
-- =====================================================

CREATE OR REPLACE VIEW payment_statistics AS
SELECT
  payment_method,
  status,
  COUNT(*) as transaction_count,
  SUM(amount) as total_amount,
  AVG(amount) as average_amount,
  MIN(created_at) as first_transaction,
  MAX(created_at) as last_transaction
FROM payment_transactions
GROUP BY payment_method, status;

-- =====================================================
-- COMMENTAIRES
-- =====================================================

COMMENT ON TABLE payment_transactions IS 'Transactions de paiement via Wave, Orange Money, CB, Virement';
COMMENT ON COLUMN payment_transactions.metadata IS 'Données flexibles (IDs externes, tokens, etc.)';
COMMENT ON COLUMN payment_transactions.status IS 'pending, processing, completed, failed, cancelled, pending_verification';
COMMENT ON FUNCTION mark_transaction_as_paid IS 'Marque une transaction comme payée et met à jour la demande notaire';
COMMENT ON FUNCTION mark_transaction_as_failed IS 'Marque une transaction comme échouée avec raison';

-- =====================================================
-- FIN DE MIGRATION
-- =====================================================

-- Pour vérifier:
-- SELECT * FROM payment_transactions;
-- SELECT * FROM payment_statistics;
