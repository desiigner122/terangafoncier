-- 📋 TABLES CRM ET ANALYTICS POUR DASHBOARD VENDEUR

-- 1. Table CRM Contacts (Prospects et clients)
CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  
  -- Informations de contact
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  position TEXT,
  avatar_url TEXT,
  
  -- Statut et score
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'hot', 'warm', 'cold', 'negotiating', 'converted', 'lost')),
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Budget et intérêts
  budget_min BIGINT,
  budget_max BIGINT,
  interested_property_types TEXT[], -- ['villa', 'appartement', 'terrain']
  preferred_locations TEXT[],
  
  -- Source et tracking
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'phone', 'email', 'whatsapp', 'facebook', 'linkedin', 'referral', 'other')),
  referral_source TEXT,
  
  -- Suivi
  last_contact_date TIMESTAMP,
  next_action TEXT,
  next_action_date TIMESTAMP,
  notes TEXT,
  tags TEXT[],
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_crm_contacts_vendor ON crm_contacts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_property ON crm_contacts(property_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_status ON crm_contacts(status);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_score ON crm_contacts(score DESC);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_crm_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_crm_contacts_updated_at
BEFORE UPDATE ON crm_contacts
FOR EACH ROW
EXECUTE FUNCTION update_crm_contacts_updated_at();


-- 2. Table Interactions CRM (Historique des interactions)
CREATE TABLE IF NOT EXISTS crm_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES crm_contacts(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Type d'interaction
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('call', 'email', 'meeting', 'whatsapp', 'note', 'sms', 'video_call')),
  
  -- Contenu
  subject TEXT,
  content TEXT NOT NULL,
  duration INTEGER, -- En minutes pour appels/meetings
  
  -- Métadonnées
  scheduled_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_interactions_contact ON crm_interactions(contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_interactions_vendor ON crm_interactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_crm_interactions_type ON crm_interactions(interaction_type);


-- 3. Table Activity Logs (Journal d'activité pour analytics)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Type d'activité
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'property_created', 'property_updated', 'property_deleted',
    'property_viewed', 'property_favorited', 'property_shared',
    'inquiry_received', 'inquiry_responded',
    'ai_analysis_completed', 'blockchain_verified',
    'verification_approved', 'verification_rejected',
    'contact_added', 'contact_converted',
    'document_uploaded', 'photo_uploaded',
    'message_sent', 'message_received'
  )),
  
  -- Référence à l'entité concernée
  related_entity_type TEXT, -- 'property', 'contact', 'message', etc.
  related_entity_id UUID,
  
  -- Détails
  metadata JSONB,
  description TEXT,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON activity_logs(related_entity_type, related_entity_id);


-- 4. Table Property Views (Analytics détaillés des vues)
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  
  -- Informations visiteur
  visitor_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL si non connecté
  ip_address INET,
  user_agent TEXT,
  
  -- Source et tracking
  source TEXT, -- 'direct', 'search', 'social', 'email', 'referral'
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Engagement
  time_spent INTEGER, -- Secondes passées sur la page
  scroll_depth INTEGER, -- Pourcentage scrollé (0-100)
  clicked_phone BOOLEAN DEFAULT FALSE,
  clicked_email BOOLEAN DEFAULT FALSE,
  clicked_whatsapp BOOLEAN DEFAULT FALSE,
  viewed_photos INTEGER DEFAULT 0,
  
  -- Géolocalisation
  city TEXT,
  country TEXT,
  
  -- Timestamp
  viewed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_views_property ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_visitor ON property_views(visitor_id);
CREATE INDEX IF NOT EXISTS idx_property_views_date ON property_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_views_source ON property_views(source);


-- 5. Table Messages (pour dashboard vendeur)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  
  -- Contenu
  content TEXT NOT NULL,
  attachments JSONB, -- [{url, type, name, size}]
  
  -- Statut
  read_at TIMESTAMP,
  deleted_by_sender BOOLEAN DEFAULT FALSE,
  deleted_by_recipient BOOLEAN DEFAULT FALSE,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_property ON messages(property_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);


-- 6. Table Conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  participant1_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant2_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Métadonnées
  last_message_at TIMESTAMP DEFAULT NOW(),
  last_message_preview TEXT,
  unread_count_participant1 INTEGER DEFAULT 0,
  unread_count_participant2 INTEGER DEFAULT 0,
  
  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Contrainte d'unicité pour éviter doublons
  UNIQUE(participant1_id, participant2_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_conversations_participant1 ON conversations(participant1_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participant2 ON conversations(participant2_id);
CREATE INDEX IF NOT EXISTS idx_conversations_property ON conversations(property_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);


-- 7. Policies RLS (Row Level Security)

-- CRM Contacts: Vendeurs voient seulement leurs contacts
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own contacts"
  ON crm_contacts FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own contacts"
  ON crm_contacts FOR INSERT
  WITH CHECK (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their own contacts"
  ON crm_contacts FOR UPDATE
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can delete their own contacts"
  ON crm_contacts FOR DELETE
  USING (vendor_id = auth.uid());


-- CRM Interactions
ALTER TABLE crm_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own interactions"
  ON crm_interactions FOR SELECT
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can insert their own interactions"
  ON crm_interactions FOR INSERT
  WITH CHECK (vendor_id = auth.uid());


-- Activity Logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity logs"
  ON activity_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (user_id = auth.uid());


-- Property Views: Publique en lecture, vendeurs voient leurs stats
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert property views"
  ON property_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Property owners can view their property views"
  ON property_views FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE owner_id = auth.uid()
    )
  );


-- Messages et Conversations
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can insert their messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their messages"
  ON messages FOR UPDATE
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  USING (participant1_id = auth.uid() OR participant2_id = auth.uid());

CREATE POLICY "Users can insert conversations"
  ON conversations FOR INSERT
  WITH CHECK (participant1_id = auth.uid() OR participant2_id = auth.uid());

CREATE POLICY "Users can update their conversations"
  ON conversations FOR UPDATE
  USING (participant1_id = auth.uid() OR participant2_id = auth.uid());


-- 8. Fonctions helper pour analytics

-- Fonction pour calculer stats mensuelles d'un vendeur
CREATE OR REPLACE FUNCTION get_vendor_monthly_stats(vendor_uuid UUID, months_ago INTEGER DEFAULT 0)
RETURNS TABLE (
  total_properties BIGINT,
  active_properties BIGINT,
  total_views BIGINT,
  unique_visitors BIGINT,
  total_inquiries BIGINT,
  total_revenue BIGINT,
  conversion_rate NUMERIC
) AS $$
DECLARE
  start_date TIMESTAMP;
  end_date TIMESTAMP;
BEGIN
  start_date := DATE_TRUNC('month', NOW() - (months_ago || ' months')::INTERVAL);
  end_date := start_date + INTERVAL '1 month';
  
  RETURN QUERY
  SELECT
    COUNT(DISTINCT p.id)::BIGINT AS total_properties,
    COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END)::BIGINT AS active_properties,
    COALESCE(SUM(p.views_count), 0)::BIGINT AS total_views,
    COUNT(DISTINCT pv.visitor_id)::BIGINT AS unique_visitors,
    COALESCE(SUM(p.contact_requests_count), 0)::BIGINT AS total_inquiries,
    COALESCE(SUM(CASE WHEN p.status = 'sold' THEN p.price ELSE 0 END), 0)::BIGINT AS total_revenue,
    CASE 
      WHEN SUM(p.views_count) > 0 THEN 
        (SUM(p.contact_requests_count)::NUMERIC / SUM(p.views_count) * 100)
      ELSE 0
    END AS conversion_rate
  FROM properties p
  LEFT JOIN property_views pv ON pv.property_id = p.id
  WHERE p.owner_id = vendor_uuid
    AND p.created_at >= start_date
    AND p.created_at < end_date;
END;
$$ LANGUAGE plpgsql;


-- Fonction pour obtenir top propriétés d'un vendeur
CREATE OR REPLACE FUNCTION get_vendor_top_properties(vendor_uuid UUID, limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  property_id UUID,
  title TEXT,
  views_count INTEGER,
  favorites_count INTEGER,
  contact_requests_count INTEGER,
  conversion_rate NUMERIC,
  ai_optimized BOOLEAN,
  blockchain_verified BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS property_id,
    p.title,
    COALESCE(p.views_count, 0) AS views_count,
    COALESCE(p.favorites_count, 0) AS favorites_count,
    COALESCE(p.contact_requests_count, 0) AS contact_requests_count,
    CASE 
      WHEN p.views_count > 0 THEN 
        (p.contact_requests_count::NUMERIC / p.views_count * 100)
      ELSE 0
    END AS conversion_rate,
    (p.ai_analysis IS NOT NULL AND jsonb_typeof(p.ai_analysis) = 'object' AND p.ai_analysis != '{}'::jsonb) AS ai_optimized,
    COALESCE(p.blockchain_verified, FALSE) AS blockchain_verified
  FROM properties p
  WHERE p.owner_id = vendor_uuid
  ORDER BY p.views_count DESC NULLS LAST
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;


-- 9. Données de test pour CRM
INSERT INTO crm_contacts (vendor_id, first_name, last_name, email, phone, company, position, status, score, priority, budget_min, budget_max, source, next_action, notes, tags)
VALUES
  -- Remplacer '00000000-0000-0000-0000-000000000000' par l'ID d'un vendeur réel
  (
    (SELECT id FROM profiles WHERE role = 'vendeur' LIMIT 1),
    'Fatou',
    'Sall',
    'fatou.sall@gmail.com',
    '+221 77 234 56 78',
    'Entreprise Sall & Fils',
    'Directrice Générale',
    'hot',
    92,
    'high',
    100000000,
    150000000,
    'website',
    'Visite programmée demain',
    'Très intéressée, budget confirmé, décision prévue fin de semaine',
    ARRAY['Budget confirmé', 'Decision maker', 'Urgent']
  ),
  (
    (SELECT id FROM profiles WHERE role = 'vendeur' LIMIT 1),
    'Moussa',
    'Diop',
    'moussa.diop@outlook.com',
    '+221 76 345 67 89',
    'Cabinet Diop Associés',
    'Avocat Principal',
    'warm',
    74,
    'medium',
    80000000,
    120000000,
    'referral',
    'Rappel négociation prix',
    'Intéressé mais souhaite négocier le prix',
    ARRAY['Négociation', 'Prix sensible']
  ),
  (
    (SELECT id FROM profiles WHERE role = 'vendeur' LIMIT 1),
    'Aïssa',
    'Ndiaye',
    'aissa.ndiaye@gmail.com',
    '+221 78 456 78 90',
    'Boutique Mode Aïssa',
    'Propriétaire',
    'new',
    58,
    'medium',
    60000000,
    90000000,
    'facebook',
    'Première prise de contact',
    'Nouveau prospect, à qualifier rapidement',
    ARRAY['Nouveau', 'À qualifier']
  )
ON CONFLICT DO NOTHING;

-- Message de confirmation
DO $$
BEGIN
  RAISE NOTICE '✅ Tables CRM et Analytics créées avec succès!';
  RAISE NOTICE '📊 Tables créées:';
  RAISE NOTICE '  - crm_contacts';
  RAISE NOTICE '  - crm_interactions';
  RAISE NOTICE '  - activity_logs';
  RAISE NOTICE '  - property_views';
  RAISE NOTICE '  - messages';
  RAISE NOTICE '  - conversations';
  RAISE NOTICE '🔒 RLS Policies activées';
  RAISE NOTICE '⚡ Fonctions helper créées';
END $$;
