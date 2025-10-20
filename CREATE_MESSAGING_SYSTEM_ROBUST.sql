-- ============================================================
-- TERANGA FONCIER - Purchase Case Messaging System
-- Version ROBUSTE - Exécuter par étapes
-- ============================================================

-- ÉTAPE 1: Vérifier les dépendances
BEGIN
  SELECT 'Vérification des tables dépendantes...' as step;
  SELECT COUNT(*) as purchase_cases_exists FROM purchase_cases LIMIT 1;
  SELECT COUNT(*) as users_exists FROM auth.users LIMIT 1;
END;
$$;

-- ÉTAPE 2: Créer la table des messages
BEGIN
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
  SELECT 'Table purchase_case_messages créée' as status;
EXCEPTION WHEN duplicate_table THEN
  SELECT 'Table purchase_case_messages existe déjà' as status;
END;
$$;

-- ÉTAPE 3: Créer la table des documents
BEGIN
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
  SELECT 'Table purchase_case_documents créée' as status;
EXCEPTION WHEN duplicate_table THEN
  SELECT 'Table purchase_case_documents existe déjà' as status;
END;
$$;

-- ÉTAPE 4: Créer les indexes
BEGIN
  CREATE INDEX IF NOT EXISTS idx_case_messages_case_id ON purchase_case_messages(case_id);
  CREATE INDEX IF NOT EXISTS idx_case_messages_sent_by ON purchase_case_messages(sent_by);
  CREATE INDEX IF NOT EXISTS idx_case_messages_created_at ON purchase_case_messages(created_at);
  CREATE INDEX IF NOT EXISTS idx_case_messages_read_at ON purchase_case_messages(read_at);
  CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON purchase_case_documents(case_id);
  CREATE INDEX IF NOT EXISTS idx_case_documents_type ON purchase_case_documents(document_type);
  CREATE INDEX IF NOT EXISTS idx_case_documents_status ON purchase_case_documents(status);
  CREATE INDEX IF NOT EXISTS idx_purchase_case_messages_case_created ON purchase_case_messages(case_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_case_type ON purchase_case_documents(case_id, document_type);
  SELECT 'Indexes créés' as status;
END;
$$;

-- ÉTAPE 5: Activer RLS
BEGIN
  ALTER TABLE purchase_case_messages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;
  SELECT 'RLS activé' as status;
END;
$$;

-- ÉTAPE 6: Créer les RLS policies pour messages
BEGIN
  CREATE POLICY "Users can view messages in their cases" ON purchase_case_messages
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM purchase_cases pc
        WHERE pc.id = purchase_case_messages.case_id
        AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
      )
    );
  SELECT 'Policy SELECT pour messages créée' as status;
EXCEPTION WHEN duplicate_object THEN
  SELECT 'Policy SELECT pour messages existe déjà' as status;
END;
$$;

BEGIN
  CREATE POLICY "Users can create messages in their cases" ON purchase_case_messages
    FOR INSERT WITH CHECK (
      sent_by = auth.uid()
      AND EXISTS (
        SELECT 1 FROM purchase_cases pc
        WHERE pc.id = purchase_case_messages.case_id
        AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
      )
    );
  SELECT 'Policy INSERT pour messages créée' as status;
EXCEPTION WHEN duplicate_object THEN
  SELECT 'Policy INSERT pour messages existe déjà' as status;
END;
$$;

BEGIN
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
  SELECT 'Policy UPDATE pour messages créée' as status;
EXCEPTION WHEN duplicate_object THEN
  SELECT 'Policy UPDATE pour messages existe déjà' as status;
END;
$$;

-- ÉTAPE 7: Créer les RLS policies pour documents
BEGIN
  CREATE POLICY "Users can view documents in their cases" ON purchase_case_documents
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM purchase_cases pc
        WHERE pc.id = purchase_case_documents.case_id
        AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
      )
    );
  SELECT 'Policy SELECT pour documents créée' as status;
EXCEPTION WHEN duplicate_object THEN
  SELECT 'Policy SELECT pour documents existe déjà' as status;
END;
$$;

BEGIN
  CREATE POLICY "Users can upload documents in their cases" ON purchase_case_documents
    FOR INSERT WITH CHECK (
      uploaded_by = auth.uid()
      AND EXISTS (
        SELECT 1 FROM purchase_cases pc
        WHERE pc.id = purchase_case_documents.case_id
        AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
      )
    );
  SELECT 'Policy INSERT pour documents créée' as status;
EXCEPTION WHEN duplicate_object THEN
  SELECT 'Policy INSERT pour documents existe déjà' as status;
END;
$$;

-- ÉTAPE 8: Créer les triggers
BEGIN
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
  
  SELECT 'Trigger updated_at créé' as status;
EXCEPTION WHEN duplicate_object THEN
  SELECT 'Trigger updated_at existe déjà' as status;
END;
$$;

BEGIN
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
  
  SELECT 'Trigger case cascade créé' as status;
EXCEPTION WHEN duplicate_object THEN
  SELECT 'Trigger case cascade existe déjà' as status;
END;
$$;

-- ÉTAPE 9: Créer la view
BEGIN
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
  
  SELECT 'View purchase_case_messages_detailed créée' as status;
END;
$$;

-- ÉTAPE 10: Créer la fonction d'unread count
BEGIN
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
  
  SELECT 'Function get_unread_messages_count créée' as status;
END;
$$;

-- ÉTAPE 11: Ajouter les colonnes manquantes
BEGIN
  ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP WITH TIME ZONE;
  ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS buyer_unread_count INTEGER DEFAULT 0;
  ALTER TABLE purchase_cases ADD COLUMN IF NOT EXISTS seller_unread_count INTEGER DEFAULT 0;
  SELECT 'Colonnes ajoutées à purchase_cases' as status;
END;
$$;

-- FINAL: Vérification
SELECT 'Messaging system deployment complete!' as status,
       NOW() as completed_at,
       (SELECT COUNT(*) FROM purchase_case_messages) as messages_count,
       (SELECT COUNT(*) FROM purchase_case_documents) as documents_count;
