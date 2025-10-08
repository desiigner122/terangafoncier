-- =============================================================================
-- TABLES MESSAGING - SYSTÈME DE MESSAGERIE TEMPS RÉEL
-- =============================================================================
-- Date: 2025-10-07
-- Description: Tables pour la messagerie entre vendeurs et acheteurs potentiels
-- =============================================================================

-- 1. TABLE: conversations
-- Stocke les conversations entre vendeurs et acheteurs
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Participants
  vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Métadonnées
  subject VARCHAR(255), -- Sujet initial (optionnel)
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  
  -- Statut de lecture
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_by UUID REFERENCES auth.users(id),
  last_message_preview TEXT, -- Aperçu du dernier message (150 char)
  
  -- Compteurs de messages non lus (dénormalisé pour performance)
  unread_count_vendor INTEGER DEFAULT 0,
  unread_count_buyer INTEGER DEFAULT 0,
  
  -- Flags
  is_pinned_vendor BOOLEAN DEFAULT FALSE,
  is_pinned_buyer BOOLEAN DEFAULT FALSE,
  is_archived_vendor BOOLEAN DEFAULT FALSE,
  is_archived_buyer BOOLEAN DEFAULT FALSE,
  is_muted_vendor BOOLEAN DEFAULT FALSE,
  is_muted_buyer BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte: une seule conversation par paire vendor/buyer/property
  UNIQUE(vendor_id, buyer_id, property_id)
);

-- 2. TABLE: messages
-- Stocke les messages individuels dans chaque conversation
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  
  -- Expéditeur
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('vendor', 'buyer')),
  
  -- Contenu
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'system')),
  
  -- Pièces jointes (images, fichiers)
  attachments JSONB DEFAULT '[]'::jsonb, -- [{name: string, url: string, type: string, size: number}]
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb, -- Pour données additionnelles (visite planifiée, offre, etc.)
  
  -- Statut de lecture
  read_at TIMESTAMP WITH TIME ZONE,
  read_by UUID REFERENCES auth.users(id),
  
  -- Statut de livraison
  delivered_at TIMESTAMP WITH TIME ZONE,
  
  -- Flags
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Réponse à un message (threading)
  reply_to_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  
  -- Timestamps
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLE: message_reactions (Optionnel - pour les réactions emoji)
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL, -- 👍 ❤️ 😊 etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Un utilisateur ne peut réagir qu'une fois par message avec le même emoji
  UNIQUE(message_id, user_id, emoji)
);

-- 4. TABLE: conversation_participants (Optionnel - pour conversations de groupe)
-- Si vous voulez supporter les conversations multi-participants
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  
  -- Paramètres de notification
  notifications_enabled BOOLEAN DEFAULT TRUE,
  
  -- Statut
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  left_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(conversation_id, user_id)
);

-- =============================================================================
-- INDEXES POUR PERFORMANCE
-- =============================================================================

-- Conversations
CREATE INDEX IF NOT EXISTS idx_conversations_vendor_id ON conversations(vendor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_property_id ON conversations(property_id);
CREATE INDEX IF NOT EXISTS idx_conversations_vendor_status ON conversations(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_status ON conversations(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(conversation_id, sent_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(conversation_id, read_at) WHERE read_at IS NULL;

-- Reactions
CREATE INDEX IF NOT EXISTS idx_reactions_message_id ON message_reactions(message_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON message_reactions(user_id);

-- Index pour recherche full-text
CREATE INDEX IF NOT EXISTS idx_messages_search ON messages 
  USING gin(to_tsvector('french', content));

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- CONVERSATIONS: Les participants voient leurs conversations
CREATE POLICY "Participants view conversations" ON conversations
  FOR SELECT USING (
    vendor_id = auth.uid() OR buyer_id = auth.uid()
  );

-- CONVERSATIONS: Les participants peuvent créer des conversations
CREATE POLICY "Users create conversations" ON conversations
  FOR INSERT WITH CHECK (
    vendor_id = auth.uid() OR buyer_id = auth.uid()
  );

-- CONVERSATIONS: Les participants peuvent mettre à jour leurs conversations
CREATE POLICY "Participants update conversations" ON conversations
  FOR UPDATE USING (
    vendor_id = auth.uid() OR buyer_id = auth.uid()
  );

-- MESSAGES: Les participants voient les messages de leurs conversations
CREATE POLICY "Participants view messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations 
      WHERE vendor_id = auth.uid() OR buyer_id = auth.uid()
    )
  );

-- MESSAGES: Les participants peuvent envoyer des messages
CREATE POLICY "Participants send messages" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() 
    AND conversation_id IN (
      SELECT id FROM conversations 
      WHERE vendor_id = auth.uid() OR buyer_id = auth.uid()
    )
  );

-- MESSAGES: L'expéditeur peut modifier/supprimer ses messages
CREATE POLICY "Sender updates own messages" ON messages
  FOR UPDATE USING (sender_id = auth.uid());

-- REACTIONS: Les participants peuvent voir les réactions
CREATE POLICY "Participants view reactions" ON message_reactions
  FOR SELECT USING (
    message_id IN (
      SELECT m.id FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE c.vendor_id = auth.uid() OR c.buyer_id = auth.uid()
    )
  );

-- REACTIONS: Les utilisateurs peuvent ajouter des réactions
CREATE POLICY "Users add reactions" ON message_reactions
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND message_id IN (
      SELECT m.id FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE c.vendor_id = auth.uid() OR c.buyer_id = auth.uid()
    )
  );

-- REACTIONS: Les utilisateurs peuvent supprimer leurs réactions
CREATE POLICY "Users remove reactions" ON message_reactions
  FOR DELETE USING (user_id = auth.uid());

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger: Mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversations_updated_at 
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger: Mettre à jour last_message_at et compteurs non lus
CREATE OR REPLACE FUNCTION update_conversation_on_new_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message_at = NEW.sent_at,
    last_message_by = NEW.sender_id,
    last_message_preview = LEFT(NEW.content, 150),
    unread_count_vendor = CASE 
      WHEN NEW.sender_type = 'buyer' THEN unread_count_vendor + 1
      ELSE unread_count_vendor
    END,
    unread_count_buyer = CASE 
      WHEN NEW.sender_type = 'vendor' THEN unread_count_buyer + 1
      ELSE unread_count_buyer
    END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation 
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_on_new_message();

-- Trigger: Réinitialiser compteur non lus quand message lu
CREATE OR REPLACE FUNCTION update_unread_count_on_read()
RETURNS TRIGGER AS $$
DECLARE
  conv_record RECORD;
BEGIN
  IF NEW.read_at IS NOT NULL AND OLD.read_at IS NULL THEN
    SELECT vendor_id, buyer_id INTO conv_record
    FROM conversations
    WHERE id = NEW.conversation_id;
    
    -- Déterminer qui a lu le message et décrémenter le bon compteur
    IF NEW.sender_type = 'vendor' AND NEW.read_by = conv_record.buyer_id THEN
      UPDATE conversations
      SET unread_count_buyer = GREATEST(0, unread_count_buyer - 1)
      WHERE id = NEW.conversation_id;
    ELSIF NEW.sender_type = 'buyer' AND NEW.read_by = conv_record.vendor_id THEN
      UPDATE conversations
      SET unread_count_vendor = GREATEST(0, unread_count_vendor - 1)
      WHERE id = NEW.conversation_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_unread_count 
  AFTER UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_unread_count_on_read();

-- =============================================================================
-- FONCTIONS UTILITAIRES
-- =============================================================================

-- Fonction: Marquer tous les messages d'une conversation comme lus
CREATE OR REPLACE FUNCTION mark_conversation_as_read(
  conv_id UUID,
  reader_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
  conv_record RECORD;
BEGIN
  -- Récupérer les infos de la conversation
  SELECT vendor_id, buyer_id INTO conv_record
  FROM conversations
  WHERE id = conv_id;
  
  -- Marquer les messages comme lus
  UPDATE messages
  SET read_at = NOW(), read_by = reader_id
  WHERE conversation_id = conv_id
    AND read_at IS NULL
    AND sender_id != reader_id;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Réinitialiser le compteur approprié
  IF reader_id = conv_record.vendor_id THEN
    UPDATE conversations
    SET unread_count_vendor = 0
    WHERE id = conv_id;
  ELSIF reader_id = conv_record.buyer_id THEN
    UPDATE conversations
    SET unread_count_buyer = 0
    WHERE id = conv_id;
  END IF;
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Archiver une conversation
CREATE OR REPLACE FUNCTION archive_conversation(
  conv_id UUID,
  user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  conv_record RECORD;
BEGIN
  SELECT vendor_id, buyer_id INTO conv_record
  FROM conversations
  WHERE id = conv_id;
  
  IF user_id = conv_record.vendor_id THEN
    UPDATE conversations
    SET is_archived_vendor = TRUE
    WHERE id = conv_id;
    RETURN TRUE;
  ELSIF user_id = conv_record.buyer_id THEN
    UPDATE conversations
    SET is_archived_buyer = TRUE
    WHERE id = conv_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- VUES UTILES
-- =============================================================================

-- Vue: Conversations avec détails des participants
CREATE OR REPLACE VIEW conversations_with_details AS
SELECT 
  c.*,
  p.title AS property_title,
  p.price AS property_price,
  p.images AS property_images,
  v.email AS vendor_email,
  v.raw_user_meta_data->>'full_name' AS vendor_name,
  b.email AS buyer_email,
  b.raw_user_meta_data->>'full_name' AS buyer_name,
  (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) AS message_count
FROM conversations c
LEFT JOIN properties p ON p.id = c.property_id
LEFT JOIN auth.users v ON v.id = c.vendor_id
LEFT JOIN auth.users b ON b.id = c.buyer_id;

-- Vue: Messages avec détails de l'expéditeur
CREATE OR REPLACE VIEW messages_with_sender AS
SELECT 
  m.*,
  u.email AS sender_email,
  u.raw_user_meta_data->>'full_name' AS sender_name,
  u.raw_user_meta_data->>'avatar_url' AS sender_avatar
FROM messages m
LEFT JOIN auth.users u ON u.id = m.sender_id;

-- Vue: Statistiques de messagerie
CREATE OR REPLACE VIEW messaging_stats AS
SELECT 
  COUNT(DISTINCT c.id) AS total_conversations,
  COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'active') AS active_conversations,
  COUNT(DISTINCT c.id) FILTER (WHERE c.is_archived_vendor OR c.is_archived_buyer) AS archived_conversations,
  COUNT(m.id) AS total_messages,
  COUNT(m.id) FILTER (WHERE m.read_at IS NULL) AS unread_messages,
  AVG(EXTRACT(EPOCH FROM (m.read_at - m.sent_at)) / 60) FILTER (WHERE m.read_at IS NOT NULL) AS avg_response_time_minutes
FROM conversations c
LEFT JOIN messages m ON m.conversation_id = c.id;

-- =============================================================================
-- EXEMPLE D'UTILISATION
-- =============================================================================

-- Créer une conversation
-- INSERT INTO conversations (property_id, vendor_id, buyer_id, subject)
-- VALUES (
--   'PROPERTY_UUID',
--   'VENDOR_UUID',
--   auth.uid(), -- Acheteur
--   'Demande d''information sur Villa Almadies'
-- );

-- Envoyer un message
-- INSERT INTO messages (conversation_id, sender_id, sender_type, content)
-- VALUES (
--   'CONVERSATION_UUID',
--   auth.uid(),
--   'buyer',
--   'Bonjour, est-ce que la propriété est toujours disponible ?'
-- );

-- Marquer conversation comme lue
-- SELECT mark_conversation_as_read('CONVERSATION_UUID', auth.uid());

-- Archiver une conversation
-- SELECT archive_conversation('CONVERSATION_UUID', auth.uid());

-- =============================================================================
-- NOTES IMPORTANTES
-- =============================================================================
-- 1. Pour activer les notifications en temps réel:
--    supabase
--      .channel('messages')
--      .on('postgres_changes', { 
--        event: 'INSERT', 
--        schema: 'public', 
--        table: 'messages' 
--      }, handleNewMessage)
--      .subscribe();
--
-- 2. Les attachments sont stockés en JSONB. Utilisez Supabase Storage
--    pour les fichiers réels et stockez les URLs ici
--
-- 3. Le système supporte le threading (reply_to_message_id) pour
--    répondre à des messages spécifiques
--
-- 4. Les compteurs unread_count_* sont dénormalisés pour la performance.
--    Ils sont maintenus automatiquement par les triggers
--
-- 5. Pour les conversations de groupe, utilisez la table 
--    conversation_participants au lieu de vendor_id/buyer_id
-- =============================================================================

COMMENT ON TABLE conversations IS 'Conversations entre vendeurs et acheteurs';
COMMENT ON TABLE messages IS 'Messages individuels dans les conversations';
COMMENT ON TABLE message_reactions IS 'Réactions emoji sur les messages';
COMMENT ON COLUMN conversations.unread_count_vendor IS 'Nombre de messages non lus par le vendeur';
COMMENT ON COLUMN conversations.unread_count_buyer IS 'Nombre de messages non lus par l''acheteur';
COMMENT ON COLUMN messages.sender_type IS 'vendor ou buyer pour identifier le rôle de l''expéditeur';
COMMENT ON COLUMN messages.reply_to_message_id IS 'Pour le threading - ID du message auquel on répond';
