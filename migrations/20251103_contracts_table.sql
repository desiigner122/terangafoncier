-- =====================================================
-- SEMAINE 2 - JOUR 1-3: DOCUSIGN E-SIGNATURE
-- =====================================================
-- Créé le: 2025-11-03
-- Objectif: Table contracts pour signatures électroniques
-- =====================================================

-- Table contracts
CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Références
  case_id UUID REFERENCES public.purchase_cases(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  notaire_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Type et statut
  contract_type VARCHAR(50) NOT NULL DEFAULT 'PURCHASE_CONTRACT',
  -- contract_type: PURCHASE_CONTRACT, INSTALLMENT_AGREEMENT, FINANCING_CONTRACT, SELLER_MANDATE
  
  status VARCHAR(30) NOT NULL DEFAULT 'pending_signatures',
  -- status: pending_signatures, signing, signed, cancelled, expired
  
  -- DocuSign
  docusign_envelope_id VARCHAR(100) UNIQUE,
  docusign_status VARCHAR(30),
  -- docusign_status: sent, delivered, completed, voided, declined
  
  -- URLs signature (temporaires, expirent après 24h)
  buyer_signing_url TEXT,
  seller_signing_url TEXT,
  notaire_signing_url TEXT,
  
  -- Signatures individuelles
  buyer_signed BOOLEAN DEFAULT FALSE,
  buyer_signed_at TIMESTAMPTZ,
  
  seller_signed BOOLEAN DEFAULT FALSE,
  seller_signed_at TIMESTAMPTZ,
  
  notaire_signed BOOLEAN DEFAULT FALSE,
  notaire_signed_at TIMESTAMPTZ,
  
  -- Montants
  contract_amount DECIMAL(15, 2),
  deposit_amount DECIMAL(15, 2),
  
  -- Document final signé
  signed_document_url TEXT,
  signed_document_hash VARCHAR(64), -- SHA-256 pour intégrité
  
  -- Métadonnées
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_contract_type CHECK (
    contract_type IN ('PURCHASE_CONTRACT', 'INSTALLMENT_AGREEMENT', 'FINANCING_CONTRACT', 'SELLER_MANDATE')
  ),
  CONSTRAINT valid_status CHECK (
    status IN ('pending_signatures', 'signing', 'signed', 'cancelled', 'expired')
  ),
  CONSTRAINT all_signed_when_completed CHECK (
    (status != 'signed') OR (buyer_signed = TRUE AND seller_signed = TRUE AND notaire_signed = TRUE)
  )
);

-- Indexes
CREATE INDEX idx_contracts_case_id ON public.contracts(case_id);
CREATE INDEX idx_contracts_property_id ON public.contracts(property_id);
CREATE INDEX idx_contracts_buyer_id ON public.contracts(buyer_id);
CREATE INDEX idx_contracts_seller_id ON public.contracts(seller_id);
CREATE INDEX idx_contracts_notaire_id ON public.contracts(notaire_id);
CREATE INDEX idx_contracts_envelope_id ON public.contracts(docusign_envelope_id);
CREATE INDEX idx_contracts_status ON public.contracts(status);
CREATE INDEX idx_contracts_created_at ON public.contracts(created_at DESC);

-- Trigger updated_at
CREATE TRIGGER update_contracts_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- Users peuvent voir leurs propres contrats
CREATE POLICY "Users can view own contracts"
ON public.contracts FOR SELECT
USING (
  auth.uid() = buyer_id OR
  auth.uid() = seller_id OR
  auth.uid() = notaire_id OR
  auth.uid() = created_by
);

-- Users peuvent créer contrats (acheteur, notaire)
CREATE POLICY "Users can create contracts"
ON public.contracts FOR INSERT
WITH CHECK (
  auth.uid() = buyer_id OR
  auth.uid() = notaire_id OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin', 'notaire')
  )
);

-- Seuls notaires et admins peuvent mettre à jour
CREATE POLICY "Notaires and admins can update contracts"
ON public.contracts FOR UPDATE
USING (
  auth.uid() = notaire_id OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin', 'notaire')
  )
);

-- Seuls admins peuvent supprimer
CREATE POLICY "Only admins can delete contracts"
ON public.contracts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
);

-- Ajouter colonnes contract_status à purchase_cases si manquantes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'purchase_cases'
    AND column_name = 'contract_status'
  ) THEN
    ALTER TABLE public.purchase_cases 
    ADD COLUMN contract_status VARCHAR(30) DEFAULT 'non_genere';
    
    RAISE NOTICE 'Colonne contract_status ajoutée à purchase_cases';
  END IF;
END $$;

-- Index contract_status
CREATE INDEX IF NOT EXISTS idx_purchase_cases_contract_status 
ON public.purchase_cases(contract_status);

COMMENT ON TABLE public.contracts IS 
'Table contracts: Contrats électroniques avec signatures DocuSign';

COMMENT ON COLUMN public.contracts.docusign_envelope_id IS
'ID enveloppe DocuSign pour tracking signature';

COMMENT ON COLUMN public.contracts.buyer_signing_url IS
'URL signature temporaire acheteur (expire 24h)';

COMMENT ON COLUMN public.contracts.signed_document_hash IS
'SHA-256 hash du PDF signé pour vérification intégrité';

-- =====================================================
-- TESTS
-- =====================================================

-- Test 1: Vérifier structure table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'contracts'
ORDER BY ordinal_position;

-- Test 2: Vérifier indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename = 'contracts';

-- Test 3: Vérifier policies
SELECT 
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'contracts';

-- =====================================================
-- ROLLBACK (si nécessaire)
-- =====================================================
-- DROP TABLE IF EXISTS public.contracts CASCADE;
-- ALTER TABLE public.purchase_cases DROP COLUMN IF EXISTS contract_status;
