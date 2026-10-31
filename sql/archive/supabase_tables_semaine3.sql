-- ============================================
-- TABLES POUR WORKFLOWS SEMAINE 3
-- TerangaFoncier - CRM, Messages, Appointments
-- ============================================

-- Table: campaigns (Workflow 2)
-- Campagnes marketing (Email/SMS/WhatsApp)
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  target_filter JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'completed', 'failed')),
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  completed_at TIMESTAMP,
  total_targets INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_campaigns_seller ON campaigns(seller_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled ON campaigns(scheduled_at);

-- Table: campaign_sends (Workflow 2)
-- Envois individuels par campagne
CREATE TABLE IF NOT EXISTS campaign_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  prospect_email VARCHAR(255),
  prospect_phone VARCHAR(50),
  prospect_name VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  sent_at TIMESTAMP,
  delivered_at TIMESTAMP,
  opened_at TIMESTAMP,
  clicked_at TIMESTAMP,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaign_sends_campaign ON campaign_sends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_prospect ON campaign_sends(prospect_id);
CREATE INDEX IF NOT EXISTS idx_campaign_sends_status ON campaign_sends(status);

-- Table: messages (Workflow 4)
-- Centre de messagerie
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  property_id UUID REFERENCES parcels(id) ON DELETE SET NULL,
  subject VARCHAR(255),
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]',
  thread_id UUID,
  reply_to UUID REFERENCES messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_property ON messages(property_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON messages(recipient_id, is_read);

-- Table: appointments (Workflow 6)
-- Rendez-vous et visites
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES prospects(id) ON DELETE CASCADE,
  property_id UUID REFERENCES parcels(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 60, -- minutes
  location TEXT,
  meeting_type VARCHAR(50) DEFAULT 'in-person' CHECK (meeting_type IN ('in-person', 'video', 'phone')),
  meeting_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'rescheduled', 'completed', 'cancelled', 'no-show')),
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_seller ON appointments(seller_id);
CREATE INDEX IF NOT EXISTS idx_appointments_prospect ON appointments(prospect_id);
CREATE INDEX IF NOT EXISTS idx_appointments_property ON appointments(property_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Table: message_templates (Workflow 4)
-- Templates de messages rapides
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  body TEXT NOT NULL,
  category VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_message_templates_seller ON message_templates(seller_id);

-- Triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON message_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour marquer message comme lu
CREATE OR REPLACE FUNCTION mark_message_read(message_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE messages 
  SET is_read = TRUE, read_at = NOW()
  WHERE id = message_id AND recipient_id = user_id AND is_read = FALSE;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour compter messages non lus
CREATE OR REPLACE FUNCTION count_unread_messages(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO unread_count
  FROM messages
  WHERE recipient_id = user_id AND is_read = FALSE;
  
  RETURN unread_count;
END;
$$ LANGUAGE plpgsql;

-- Données de test pour message_templates
INSERT INTO message_templates (id, seller_id, name, subject, body, category, is_default)
VALUES 
  (uuid_generate_v4(), NULL, 'Première réponse', 'Merci pour votre intérêt', 'Bonjour {{nom}},\n\nMerci pour votre intérêt concernant {{propriété}}.\n\nJe suis disponible pour organiser une visite cette semaine.\n\nCordialement,\n{{vendeur}}', 'initial', TRUE),
  (uuid_generate_v4(), NULL, 'Confirmation RDV', 'Confirmation de rendez-vous', 'Bonjour {{nom}},\n\nJe confirme notre rendez-vous le {{date}} à {{heure}} pour visiter {{propriété}}.\n\nÀ bientôt,\n{{vendeur}}', 'appointment', TRUE),
  (uuid_generate_v4(), NULL, 'Suivi', 'Suite à notre échange', 'Bonjour {{nom}},\n\nJe me permets de revenir vers vous concernant {{propriété}}.\n\nAvez-vous eu le temps d''y réfléchir ?\n\nCordialement,\n{{vendeur}}', 'followup', TRUE)
ON CONFLICT DO NOTHING;

-- Commentaires
COMMENT ON TABLE campaigns IS 'Campagnes marketing email/SMS/WhatsApp';
COMMENT ON TABLE campaign_sends IS 'Envois individuels par campagne avec tracking';
COMMENT ON TABLE messages IS 'Centre de messagerie interne';
COMMENT ON TABLE appointments IS 'Rendez-vous et visites de propriétés';
COMMENT ON TABLE message_templates IS 'Templates de messages rapides réutilisables';

-- Grants (ajuster selon vos besoins)
GRANT ALL ON campaigns TO authenticated;
GRANT ALL ON campaign_sends TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON appointments TO authenticated;
GRANT ALL ON message_templates TO authenticated;
