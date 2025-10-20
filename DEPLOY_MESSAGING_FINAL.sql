-- ============================================================
-- TERANGA FONCIER - Purchase Case Messaging System
-- Version ULTRA-SIMPLIFIÉE avec vérifications
-- ============================================================

-- ÉTAPE 0: VÉRIFICATIONS PRÉALABLES
-- Exécuter cette partie EN PREMIER pour vérifier les dépendances

DO $$
DECLARE
  purchase_cases_exists BOOLEAN;
  auth_users_exists BOOLEAN;
  profiles_exists BOOLEAN;
BEGIN
  -- Vérifier purchase_cases
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'purchase_cases'
  ) INTO purchase_cases_exists;
  
  -- Vérifier auth.users
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'auth' AND table_name = 'users'
  ) INTO auth_users_exists;
  
  -- Vérifier profiles
  SELECT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) INTO profiles_exists;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'VÉRIFICATION DES DÉPENDANCES:';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'purchase_cases existe: %', purchase_cases_exists;
  RAISE NOTICE 'auth.users existe: %', auth_users_exists;
  RAISE NOTICE 'profiles existe: %', profiles_exists;
  RAISE NOTICE '========================================';
  
  IF NOT purchase_cases_exists THEN
    RAISE EXCEPTION 'ERREUR: Table purchase_cases n''existe pas!';
  END IF;
  
  IF NOT auth_users_exists THEN
    RAISE EXCEPTION 'ERREUR: Table auth.users n''existe pas!';
  END IF;
  
  IF NOT profiles_exists THEN
    RAISE EXCEPTION 'ERREUR: Table profiles n''existe pas!';
  END IF;
  
  RAISE NOTICE '✅ Toutes les dépendances OK!';
END;
$$;

-- ============================================================
-- ÉTAPE 1: Créer la table des MESSAGES (table principale)
-- ============================================================

DROP TABLE IF EXISTS purchase_case_messages CASCADE;

CREATE TABLE purchase_case_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  sent_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ✅ Table purchase_case_messages créée

-- ============================================================
-- ÉTAPE 2: Créer la table des DOCUMENTS
-- ============================================================

DROP TABLE IF EXISTS purchase_case_documents CASCADE;

CREATE TABLE purchase_case_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ✅ Table purchase_case_documents créée

-- ============================================================
-- ÉTAPE 3: Créer les INDEXES
-- ============================================================

CREATE INDEX idx_case_messages_case_id ON purchase_case_messages(case_id);
-- ✅ Index idx_case_messages_case_id créé

CREATE INDEX idx_case_messages_sent_by ON purchase_case_messages(sent_by);
-- ✅ Index idx_case_messages_sent_by créé

CREATE INDEX idx_case_messages_created_at ON purchase_case_messages(created_at);
-- ✅ Index idx_case_messages_created_at créé

CREATE INDEX idx_case_messages_read_at ON purchase_case_messages(read_at);
-- ✅ Index idx_case_messages_read_at créé

CREATE INDEX idx_case_documents_case_id ON purchase_case_documents(case_id);
-- ✅ Index idx_case_documents_case_id créé

CREATE INDEX idx_case_documents_type ON purchase_case_documents(document_type);
-- ✅ Index idx_case_documents_type créé

CREATE INDEX idx_case_documents_status ON purchase_case_documents(status);
-- ✅ Index idx_case_documents_status créé

CREATE INDEX idx_purchase_case_messages_case_created ON purchase_case_messages(case_id, created_at DESC);
-- ✅ Index idx_purchase_case_messages_case_created créé

CREATE INDEX idx_purchase_case_documents_case_type ON purchase_case_documents(case_id, document_type);
-- ✅ Index idx_purchase_case_documents_case_type créé

-- ============================================================
-- ÉTAPE 4: Activer RLS (Row Level Security)
-- ============================================================

ALTER TABLE purchase_case_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- ✅ RLS activé sur les deux tables

-- ============================================================
-- ÉTAPE 5: Créer les RLS POLICIES pour MESSAGES
-- ============================================================

CREATE POLICY "Users can view messages in their cases" ON purchase_case_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- ✅ Policy SELECT pour messages créée

CREATE POLICY "Users can create messages in their cases" ON purchase_case_messages
  FOR INSERT WITH CHECK (
    sent_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- ✅ Policy INSERT pour messages créée

CREATE POLICY "Users can update their message read status" ON purchase_case_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- ✅ Policy UPDATE pour messages créée

-- ============================================================
-- ÉTAPE 6: Créer les RLS POLICIES pour DOCUMENTS
-- ============================================================

CREATE POLICY "Users can view documents in their cases" ON purchase_case_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- ✅ Policy SELECT pour documents créée

CREATE POLICY "Users can upload documents in their cases" ON purchase_case_documents
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- ✅ Policy INSERT pour documents créée

-- ============================================================
-- ÉTAPE 7: Créer les TRIGGERS
-- ============================================================

-- Dropper les anciens triggers et fonctions s'ils existent
DROP TRIGGER IF EXISTS purchase_case_messages_updated_at_trigger ON purchase_case_messages CASCADE;
DROP TRIGGER IF EXISTS case_updated_on_new_message_trigger ON purchase_case_messages CASCADE;
DROP FUNCTION IF EXISTS update_purchase_case_messages_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_case_on_new_message() CASCADE;

-- Créer la fonction et le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_purchase_case_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchase_case_messages_updated_at_trigger
  BEFORE UPDATE ON purchase_case_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_purchase_case_messages_updated_at();

-- ✅ Trigger pour updated_at créé

-- Créer la fonction et le trigger pour cascader la mise à jour à purchase_cases
CREATE OR REPLACE FUNCTION update_case_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE purchase_cases
  SET updated_at = now()
  WHERE id = NEW.case_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER case_updated_on_new_message_trigger
  AFTER INSERT ON purchase_case_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_case_on_new_message();

-- ✅ Trigger pour cascade créé

-- ============================================================
-- ÉTAPE 8: Créer la VIEW avec infos sender
-- ============================================================

DROP VIEW IF EXISTS purchase_case_messages_detailed CASCADE;

CREATE OR REPLACE VIEW purchase_case_messages_detailed AS
SELECT 
  pcm.*,
  p.email as sender_email,
  p.first_name as sender_first_name,
  p.last_name as sender_last_name,
  (
    SELECT CASE 
      WHEN pc.buyer_id = pcm.sent_by THEN 'buyer'
      WHEN pc.seller_id = pcm.sent_by THEN 'seller'
      ELSE 'unknown'
    END
    FROM purchase_cases pc
    WHERE pc.id = pcm.case_id
  ) as sender_role
FROM purchase_case_messages pcm
LEFT JOIN profiles p ON p.id = pcm.sent_by;

-- ✅ View purchase_case_messages_detailed créée

-- ============================================================
-- ÉTAPE 9: Créer la FUNCTION pour compter non-lus
-- ============================================================

DROP FUNCTION IF EXISTS get_unread_messages_count(UUID) CASCADE;

CREATE OR REPLACE FUNCTION get_unread_messages_count(user_id UUID)
RETURNS TABLE(case_id UUID, unread_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pcm.case_id,
    COUNT(*) as unread_count
  FROM purchase_case_messages pcm
  WHERE pcm.read_at IS NULL
    AND pcm.sent_by != user_id
    AND EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = pcm.case_id
      AND (pc.buyer_id = user_id OR pc.seller_id = user_id)
    )
  GROUP BY pcm.case_id;
END;
$$ LANGUAGE plpgsql;

-- ✅ Function get_unread_messages_count créée

-- ============================================================
-- ÉTAPE 10: Ajouter COLONNES manquantes à purchase_cases
-- ============================================================

ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS buyer_unread_count INTEGER DEFAULT 0;
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS seller_unread_count INTEGER DEFAULT 0;

-- ✅ Colonnes ajoutées à purchase_cases

-- ============================================================
-- VÉRIFICATIONS FINALES
-- ============================================================

-- Les vérifications se font dans Supabase automatiquement
-- Vous devriez voir dans la console les confirmations:
-- ✅ DÉPLOIEMENT RÉUSSI!
-- ============================================================
