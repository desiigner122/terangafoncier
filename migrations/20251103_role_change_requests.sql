-- =====================================================
-- SEMAINE 1 - JOUR 4-5: VALIDATION COMPTES PROFESSIONNELS
-- =====================================================
-- Créé le: 2025-11-03
-- Objectif: Table pour demandes de passage compte professionnel
-- =====================================================

-- Table pour stocker demandes de changement de rôle/validation pro
CREATE TABLE IF NOT EXISTS public.role_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_role VARCHAR(100) NOT NULL,
  requested_role VARCHAR(100) NOT NULL, -- vendeur_pro, notaire, agent_foncier, etc.
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  
  -- Documents justificatifs (URLs Supabase Storage)
  business_registration_doc TEXT, -- NINEA, RCCM
  professional_license_doc TEXT, -- Licence notaire, agent foncier
  identity_card_doc TEXT, -- CNI, Passeport
  tax_certificate_doc TEXT, -- Attestation fiscale
  
  -- Informations supplémentaires
  company_name VARCHAR(255),
  company_address TEXT,
  phone_number VARCHAR(50),
  professional_experience TEXT,
  
  -- Motivation
  reason TEXT, -- Pourquoi demander compte pro ?
  
  -- Admin review
  reviewed_by UUID REFERENCES auth.users(id), -- Admin qui a traité
  review_note TEXT, -- Notes admin (raison refus, etc.)
  reviewed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT valid_status CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  CONSTRAINT valid_roles CHECK (
    requested_role IN (
      'vendeur_pro', 'notaire', 'agent_foncier', 'geometre', 
      'banque', 'promoteur', 'mairie', 'investisseur'
    )
  )
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_role_change_user ON public.role_change_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_role_change_status ON public.role_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_role_change_created ON public.role_change_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_role_change_requested_role ON public.role_change_requests(requested_role);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_role_change_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS role_change_updated_at ON public.role_change_requests;
CREATE TRIGGER role_change_updated_at
  BEFORE UPDATE ON public.role_change_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_role_change_timestamp();

-- RLS Policies
ALTER TABLE public.role_change_requests ENABLE ROW LEVEL SECURITY;

-- Users peuvent créer/voir leurs propres demandes
CREATE POLICY "Users can create own role change requests"
ON public.role_change_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own role change requests"
ON public.role_change_requests FOR SELECT
USING (auth.uid() = user_id);

-- Users peuvent annuler leurs demandes pending
CREATE POLICY "Users can cancel own pending requests"
ON public.role_change_requests FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (status IN ('pending', 'cancelled'));

-- Admins peuvent tout voir/modifier
CREATE POLICY "Admins can view all role change requests"
ON public.role_change_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update role change requests"
ON public.role_change_requests FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
);

-- Fonction RPC pour approuver/rejeter demande (admin only)
CREATE OR REPLACE FUNCTION public.process_role_change_request(
  request_id UUID,
  new_status VARCHAR(50),
  review_note_text TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_request RECORD;
  v_admin_id UUID;
  v_result JSON;
BEGIN
  -- Vérifier que l'utilisateur est admin
  SELECT id INTO v_admin_id
  FROM public.profiles
  WHERE id = auth.uid()
  AND role IN ('admin', 'super_admin');
  
  IF v_admin_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Unauthorized: Admin access required'
    );
  END IF;
  
  -- Vérifier que la demande existe
  SELECT * INTO v_request
  FROM public.role_change_requests
  WHERE id = request_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Request not found'
    );
  END IF;
  
  -- Vérifier que le statut est valid
  IF new_status NOT IN ('approved', 'rejected') THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid status. Must be approved or rejected'
    );
  END IF;
  
  -- Mettre à jour la demande
  UPDATE public.role_change_requests
  SET 
    status = new_status,
    reviewed_by = v_admin_id,
    review_note = review_note_text,
    reviewed_at = NOW()
  WHERE id = request_id;
  
  -- Si approuvé, mettre à jour le rôle du profil
  IF new_status = 'approved' THEN
    UPDATE public.profiles
    SET 
      role = v_request.requested_role,
      account_verified = true,
      updated_at = NOW()
    WHERE id = v_request.user_id;
    
    RAISE LOG 'Role approved: user % changed to %', v_request.user_id, v_request.requested_role;
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'request_id', request_id,
    'status', new_status,
    'user_id', v_request.user_id,
    'new_role', CASE WHEN new_status = 'approved' THEN v_request.requested_role ELSE NULL END
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commenter la fonction
COMMENT ON FUNCTION public.process_role_change_request IS 
'Admin function: Approve or reject role change request. Automatically updates user role if approved.';

-- Commenter la table
COMMENT ON TABLE public.role_change_requests IS
'Stores professional account validation requests (vendeur_pro, notaire, etc.) with uploaded documents';

-- =====================================================
-- STORAGE BUCKET POUR DOCUMENTS
-- =====================================================

-- Créer bucket pour documents professionnels (via Supabase Dashboard ou code ci-dessous)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('professional-docs', 'professional-docs', false)
-- ON CONFLICT (id) DO NOTHING;

-- RLS Policies pour storage (users upload leurs docs, admins lisent tous)
-- CREATE POLICY "Users can upload own professional docs"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'professional-docs' 
--   AND auth.uid()::text = (storage.foldername(name))[1]
-- );

-- CREATE POLICY "Users can read own professional docs"
-- ON storage.objects FOR SELECT
-- USING (
--   bucket_id = 'professional-docs' 
--   AND auth.uid()::text = (storage.foldername(name))[1]
-- );

-- CREATE POLICY "Admins can read all professional docs"
-- ON storage.objects FOR SELECT
-- USING (
--   bucket_id = 'professional-docs'
--   AND EXISTS (
--     SELECT 1 FROM public.profiles
--     WHERE id = auth.uid()
--     AND role IN ('admin', 'super_admin')
--   )
-- );

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
WHERE table_name = 'role_change_requests'
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test 2: Vérifier fonction RPC existe
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines
WHERE routine_name = 'process_role_change_request'
AND routine_schema = 'public';

-- =====================================================
-- ROLLBACK (si nécessaire)
-- =====================================================
-- DROP FUNCTION IF EXISTS public.process_role_change_request;
-- DROP TRIGGER IF EXISTS role_change_updated_at ON public.role_change_requests;
-- DROP FUNCTION IF EXISTS public.update_role_change_timestamp;
-- DROP TABLE IF EXISTS public.role_change_requests CASCADE;
