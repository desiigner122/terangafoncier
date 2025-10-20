-- ============================================================
-- TERANGA FONCIER - Purchase Case Messaging System
-- Version SIMPLIFIÉE - Exécutable en Supabase
-- ============================================================

-- ÉTAPE 1: Vérifier et nettoyer (si nécessaire)
-- Décommenter si vous avez besoin de réinitialiser:
-- DROP TRIGGER IF EXISTS case_updated_on_new_message_trigger ON purchase_case_messages;
-- DROP TRIGGER IF EXISTS purchase_case_messages_updated_at_trigger ON purchase_case_messages;
-- DROP FUNCTION IF EXISTS update_case_on_new_message();
-- DROP FUNCTION IF EXISTS update_purchase_case_messages_updated_at();
-- DROP VIEW IF EXISTS purchase_case_messages_detailed;
-- DROP TABLE IF EXISTS purchase_case_documents CASCADE;
-- DROP TABLE IF EXISTS purchase_case_messages CASCADE;

-- ÉTAPE 2: Créer la table des messages
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

-- ÉTAPE 3: Créer la table des documents
CREATE TABLE IF NOT EXISTS purchase_case_documents (
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

-- ÉTAPE 4: Créer les indexes
CREATE INDEX IF NOT EXISTS idx_case_messages_case_id ON purchase_case_messages(case_id);
CREATE INDEX IF NOT EXISTS idx_case_messages_sent_by ON purchase_case_messages(sent_by);
CREATE INDEX IF NOT EXISTS idx_case_messages_created_at ON purchase_case_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_case_messages_read_at ON purchase_case_messages(read_at);
CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON purchase_case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_documents_type ON purchase_case_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_case_documents_status ON purchase_case_documents(status);
CREATE INDEX IF NOT EXISTS idx_purchase_case_messages_case_created ON purchase_case_messages(case_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_case_type ON purchase_case_documents(case_id, document_type);

-- ÉTAPE 5: Activer RLS
ALTER TABLE purchase_case_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;

-- ÉTAPE 6: Créer les RLS policies pour messages
CREATE POLICY "Users can view messages in their cases" ON purchase_case_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can create messages in their cases" ON purchase_case_messages
  FOR INSERT WITH CHECK (
    sent_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_messages.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

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

-- ÉTAPE 7: Créer les RLS policies pour documents
CREATE POLICY "Users can view documents in their cases" ON purchase_case_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

CREATE POLICY "Users can upload documents in their cases" ON purchase_case_documents
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM purchase_cases pc
      WHERE pc.id = purchase_case_documents.case_id
      AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
    )
  );

-- ÉTAPE 8: Créer les triggers
CREATE OR REPLACE FUNCTION update_purchase_case_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS purchase_case_messages_updated_at_trigger ON purchase_case_messages;
CREATE TRIGGER purchase_case_messages_updated_at_trigger
  BEFORE UPDATE ON purchase_case_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_purchase_case_messages_updated_at();

-- Trigger pour mettre à jour purchase_cases.updated_at quand un message est ajouté
CREATE OR REPLACE FUNCTION update_case_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE purchase_cases
  SET updated_at = now()
  WHERE id = NEW.case_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS case_updated_on_new_message_trigger ON purchase_case_messages;
CREATE TRIGGER case_updated_on_new_message_trigger
  AFTER INSERT ON purchase_case_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_case_on_new_message();

-- ÉTAPE 9: Créer la view avec les infos sender
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

-- ÉTAPE 10: Créer la fonction pour compter les messages non lus
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

-- ÉTAPE 11: Ajouter les colonnes manquantes à purchase_cases
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS buyer_unread_count INTEGER DEFAULT 0;
ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS seller_unread_count INTEGER DEFAULT 0;

-- ============================================================
-- VÉRIFICATION FINALE
-- ============================================================

-- Afficher le résumé du déploiement
SELECT 'Messaging system successfully deployed!' as status;

-- Vérifier les tables
SELECT 'Tables created:' as check_type;
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('purchase_case_messages', 'purchase_case_documents')
AND table_schema = 'public';

-- Vérifier les colonnes
SELECT 'Columns in purchase_case_messages:' as check_type;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'purchase_case_messages' 
ORDER BY ordinal_position;

-- Vérifier les indexes
SELECT 'Indexes created:' as check_type;
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('purchase_case_messages', 'purchase_case_documents')
AND schemaname = 'public'
ORDER BY indexname;

-- Vérifier les RLS policies
SELECT 'RLS Policies:' as check_type;
SELECT policyname, tablename FROM pg_policies 
WHERE tablename IN ('purchase_case_messages', 'purchase_case_documents')
ORDER BY tablename, policyname;
