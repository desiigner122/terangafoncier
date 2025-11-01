-- ============================================================
-- TERANGA FONCIER - Purchase Case Messaging System
-- Table de messagerie pour les dossiers d'achat
-- ============================================================

-- 1. Table des messages
CREATE TABLE IF NOT EXISTS purchase_case_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  sent_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Table des documents du dossier
CREATE TABLE IF NOT EXISTS purchase_case_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL, -- 'contract', 'proof_of_funds', 'id', 'property_doc', etc.
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, signed
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Index pour performances
CREATE INDEX IF NOT EXISTS idx_case_messages_case_id ON purchase_case_messages(case_id);
CREATE INDEX IF NOT EXISTS idx_case_messages_sent_by ON purchase_case_messages(sent_by);
CREATE INDEX IF NOT EXISTS idx_case_messages_created_at ON purchase_case_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_case_messages_read_at ON purchase_case_messages(read_at);

CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON purchase_case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_documents_type ON purchase_case_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_case_documents_status ON purchase_case_documents(status);

-- 4. RLS Policies pour messages
ALTER TABLE purchase_case_messages ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne peuvent voir que les messages de leurs propres dossiers
CREATE POLICY "Users can view messages in their cases" ON purchase_case_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- Les utilisateurs ne peuvent créer des messages que dans leurs dossiers
CREATE POLICY "Users can create messages in their cases" ON purchase_case_messages
  FOR INSERT WITH CHECK (
    sent_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- Les utilisateurs peuvent marquer leurs messages comme lus
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

-- 5. RLS Policies pour documents
ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs ne peuvent voir que les documents de leurs propres dossiers
CREATE POLICY "Users can view documents in their cases" ON purchase_case_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- Les utilisateurs peuvent upload des documents dans leurs dossiers
CREATE POLICY "Users can upload documents in their cases" ON purchase_case_documents
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- 6. Trigger pour mettre à jour updated_at
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

-- 7. Trigger pour mettre à jour purchase_cases.updated_at quand un message est ajouté
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

-- 8. View pour obtenir les messages avec info sender
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

-- 9. Fonction pour récupérer derniers messages non lus
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

-- 10. Ajouter colonnes si manquantes dans purchase_cases
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS buyer_unread_count INTEGER DEFAULT 0;
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS seller_unread_count INTEGER DEFAULT 0;

-- 11. Créer index de performance pour requêtes communes
CREATE INDEX IF NOT EXISTS idx_purchase_case_messages_case_created ON purchase_case_messages(case_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_case_type ON purchase_case_documents(case_id, document_type);

COMMIT;

-- Afficher confirmation
SELECT 'Messaging system successfully created!' as status;
