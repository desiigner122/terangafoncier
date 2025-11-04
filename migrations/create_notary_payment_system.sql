-- ============================================
-- SYSTÈME DE PAIEMENT DES FRAIS DE NOTAIRE
-- ============================================
-- Migration pour créer le système de demandes de paiement
-- et gestion des transactions de paiement

-- ============================================
-- 1. TABLE: notary_payment_requests
-- ============================================
CREATE TABLE IF NOT EXISTS notary_payment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  
  -- Type de paiement
  request_type TEXT NOT NULL CHECK (request_type IN ('deposit', 'notary_fees', 'final_payment', 'other')),
  
  -- Montant et devise
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'XOF',
  
  -- Détails des frais (JSON)
  breakdown JSONB DEFAULT '{}',
  /* Exemple breakdown:
  {
    "registration_fees": 5000000,
    "notary_fees": 2500000,
    "taxes_stamps": 1250000,
    "total": 8750000
  }
  */
  
  -- Payer (qui doit payer)
  payer_id UUID NOT NULL REFERENCES profiles(id),
  payer_role TEXT NOT NULL CHECK (payer_role IN ('buyer', 'seller', 'both')),
  
  -- Notaire demandeur
  notary_id UUID REFERENCES profiles(id),
  notary_notes TEXT,
  
  -- Description
  description TEXT,
  instructions TEXT, -- Instructions spécifiques pour le paiement
  
  -- Statut
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'expired', 'refunded')),
  
  -- Dates
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ, -- Date limite de paiement
  paid_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  
  -- Paiement
  payment_method TEXT, -- 'wave', 'orange_money', 'bank_transfer', 'card'
  transaction_reference TEXT,
  payment_proof_url TEXT,
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_notary_payment_requests_case_id ON notary_payment_requests(case_id);
CREATE INDEX IF NOT EXISTS idx_notary_payment_requests_payer_id ON notary_payment_requests(payer_id);
CREATE INDEX IF NOT EXISTS idx_notary_payment_requests_notary_id ON notary_payment_requests(notary_id);
CREATE INDEX IF NOT EXISTS idx_notary_payment_requests_status ON notary_payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_notary_payment_requests_request_type ON notary_payment_requests(request_type);

-- ============================================
-- 2. MISE À JOUR: payment_transactions
-- ============================================
-- Ajouter colonnes pour lier aux demandes de paiement notaire

ALTER TABLE payment_transactions 
ADD COLUMN IF NOT EXISTS notary_request_id UUID REFERENCES notary_payment_requests(id) ON DELETE SET NULL;

ALTER TABLE payment_transactions 
ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES purchase_cases(id) ON DELETE SET NULL;

-- Index
CREATE INDEX IF NOT EXISTS idx_payment_transactions_notary_request_id ON payment_transactions(notary_request_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_case_id ON payment_transactions(case_id);

-- ============================================
-- 3. FONCTION: Trigger de mise à jour timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_notary_payment_request_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  -- Si le statut passe à 'paid', enregistrer paid_at
  IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
    NEW.paid_at = NOW();
  END IF;
  
  -- Si le statut passe à 'cancelled', enregistrer cancelled_at
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    NEW.cancelled_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer trigger
DROP TRIGGER IF EXISTS trigger_update_notary_payment_request_timestamp ON notary_payment_requests;
CREATE TRIGGER trigger_update_notary_payment_request_timestamp
  BEFORE UPDATE ON notary_payment_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_notary_payment_request_timestamp();

-- ============================================
-- 4. RLS POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE notary_payment_requests ENABLE ROW LEVEL SECURITY;

-- Policy: SELECT - Acteurs du dossier + notaire
DROP POLICY IF EXISTS "notary_payment_requests_select_policy" ON notary_payment_requests;
CREATE POLICY "notary_payment_requests_select_policy"
ON notary_payment_requests FOR SELECT
USING (
  -- Notaire créateur
  notary_id = auth.uid()
  OR
  -- Payer (acheteur ou vendeur)
  payer_id = auth.uid()
  OR
  -- Acheteur/Vendeur/Notaire du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = notary_payment_requests.case_id
      AND (
        pc.buyer_id = auth.uid() OR
        pc.seller_id = auth.uid() OR
        pc.notaire_id = auth.uid()
      )
  )
  OR
  -- Admin
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- Policy: INSERT - Seulement notaires
DROP POLICY IF EXISTS "notary_payment_requests_insert_policy" ON notary_payment_requests;
CREATE POLICY "notary_payment_requests_insert_policy"
ON notary_payment_requests FOR INSERT
WITH CHECK (
  -- Doit être notaire
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role IN ('notaire', 'Notaire', 'admin')
  )
  AND
  -- Doit être le notaire du dossier
  EXISTS (
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = case_id
      AND pc.notaire_id = auth.uid()
  )
);

-- Policy: UPDATE - Notaire créateur ou payer (pour marquer comme payé)
DROP POLICY IF EXISTS "notary_payment_requests_update_policy" ON notary_payment_requests;
CREATE POLICY "notary_payment_requests_update_policy"
ON notary_payment_requests FOR UPDATE
USING (
  -- Notaire créateur
  notary_id = auth.uid()
  OR
  -- Payer (peut mettre à jour payment_method, transaction_reference, etc.)
  payer_id = auth.uid()
  OR
  -- Admin
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- Policy: DELETE - Seulement notaire créateur ou admin
DROP POLICY IF EXISTS "notary_payment_requests_delete_policy" ON notary_payment_requests;
CREATE POLICY "notary_payment_requests_delete_policy"
ON notary_payment_requests FOR DELETE
USING (
  -- Notaire créateur
  notary_id = auth.uid()
  OR
  -- Admin
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
  )
);

-- ============================================
-- 5. VUES UTILES
-- ============================================

-- Vue: Résumé des paiements par dossier
CREATE OR REPLACE VIEW notary_payments_summary AS
SELECT
  pc.id AS case_id,
  pc.case_number,
  pc.status AS case_status,
  COUNT(npr.id) AS total_requests,
  COUNT(CASE WHEN npr.status = 'pending' THEN 1 END) AS pending_requests,
  COUNT(CASE WHEN npr.status = 'paid' THEN 1 END) AS paid_requests,
  SUM(CASE WHEN npr.status = 'paid' THEN npr.amount ELSE 0 END) AS total_paid_amount,
  SUM(CASE WHEN npr.status = 'pending' THEN npr.amount ELSE 0 END) AS total_pending_amount
FROM purchase_cases pc
LEFT JOIN notary_payment_requests npr ON npr.case_id = pc.id
GROUP BY pc.id, pc.case_number, pc.status;

-- ============================================
-- 6. FONCTIONS UTILES
-- ============================================

-- Fonction: Créer une demande de paiement automatique
CREATE OR REPLACE FUNCTION create_notary_payment_request(
  p_case_id UUID,
  p_request_type TEXT,
  p_payer_role TEXT DEFAULT 'buyer'
)
RETURNS UUID AS $$
DECLARE
  v_case RECORD;
  v_amount DECIMAL;
  v_breakdown JSONB;
  v_payer_id UUID;
  v_notary_id UUID;
  v_request_id UUID;
BEGIN
  -- Récupérer le dossier
  SELECT * INTO v_case FROM purchase_cases WHERE id = p_case_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Dossier non trouvé: %', p_case_id;
  END IF;
  
  -- Déterminer le payer
  IF p_payer_role = 'buyer' THEN
    v_payer_id := v_case.buyer_id;
  ELSIF p_payer_role = 'seller' THEN
    v_payer_id := v_case.seller_id;
  ELSE
    RAISE EXCEPTION 'payer_role invalide: %', p_payer_role;
  END IF;
  
  v_notary_id := v_case.notaire_id;
  
  -- Calculer montant selon type
  IF p_request_type = 'deposit' THEN
    v_amount := v_case.purchase_price * 0.10; -- 10% d'arrhes
    v_breakdown := jsonb_build_object(
      'deposit_percentage', 10,
      'total', v_amount
    );
  ELSIF p_request_type = 'notary_fees' THEN
    -- Frais notaire: 10% droits + 5% honoraires + 2.5% taxes
    v_breakdown := jsonb_build_object(
      'registration_fees', v_case.purchase_price * 0.10,
      'notary_fees', v_case.purchase_price * 0.05,
      'taxes_stamps', v_case.purchase_price * 0.025,
      'total', v_case.purchase_price * 0.175
    );
    v_amount := v_case.purchase_price * 0.175;
  ELSIF p_request_type = 'final_payment' THEN
    -- Solde du prix (90% si arrhes de 10% déjà versées)
    v_amount := v_case.purchase_price * 0.90;
    v_breakdown := jsonb_build_object(
      'balance_percentage', 90,
      'total', v_amount
    );
  ELSE
    RAISE EXCEPTION 'request_type invalide: %', p_request_type;
  END IF;
  
  -- Créer la demande
  INSERT INTO notary_payment_requests (
    case_id,
    request_type,
    amount,
    breakdown,
    payer_id,
    payer_role,
    notary_id,
    description,
    status
  ) VALUES (
    p_case_id,
    p_request_type,
    v_amount,
    v_breakdown,
    v_payer_id,
    p_payer_role,
    v_notary_id,
    format('Paiement %s pour dossier %s', p_request_type, v_case.case_number),
    'pending'
  ) RETURNING id INTO v_request_id;
  
  RETURN v_request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. VÉRIFICATIONS
-- ============================================

-- Afficher structure table
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'notary_payment_requests'
ORDER BY ordinal_position;

-- Afficher les policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'notary_payment_requests'
ORDER BY policyname;

COMMIT;
