-- =============================================================================
-- TABLES SUPPORT & AIDE - SYSTÈME DE TICKETS
-- =============================================================================
-- Date: 2025-10-07
-- Description: Tables pour le système de support client avec tickets et réponses
-- =============================================================================

-- 1. TABLE: support_tickets
-- Stocke les tickets de support créés par les vendeurs
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticket_number VARCHAR(20) UNIQUE NOT NULL, -- Format: TK-XXXXXX
  subject VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature', 'question', 'help')),
  priority VARCHAR(50) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb, -- [{name: string, url: string, type: string}]
  category VARCHAR(100), -- Optionnel: catégorie du ticket
  tags TEXT[], -- Tags pour classification
  
  -- Métadonnées de réponse
  first_response_at TIMESTAMP WITH TIME ZONE,
  first_response_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  closed_at TIMESTAMP WITH TIME ZONE,
  closed_by UUID REFERENCES auth.users(id),
  
  -- Évaluation
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
  feedback TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLE: support_responses
-- Stocke les réponses/messages dans un ticket
CREATE TABLE IF NOT EXISTS support_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT FALSE, -- true si réponse du support, false si du client
  is_internal BOOLEAN DEFAULT FALSE, -- true pour notes internes (invisibles au client)
  attachments JSONB DEFAULT '[]'::jsonb,
  
  -- Statut de lecture
  read_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLE: support_categories (Optionnel - pour organiser les tickets)
CREATE TABLE IF NOT EXISTS support_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50), -- Nom de l'icône Lucide
  color VARCHAR(50), -- Couleur hex
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES POUR PERFORMANCE
-- =============================================================================

-- Index pour requêtes fréquentes
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_type ON support_tickets(type);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status ON support_tickets(user_id, status);

CREATE INDEX IF NOT EXISTS idx_support_responses_ticket_id ON support_responses(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_responses_created_at ON support_responses(ticket_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_support_responses_is_staff ON support_responses(is_staff);

-- Index pour recherche full-text
CREATE INDEX IF NOT EXISTS idx_support_tickets_search ON support_tickets 
  USING gin(to_tsvector('french', subject || ' ' || description));

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_categories ENABLE ROW LEVEL SECURITY;

-- Politique: Les utilisateurs voient uniquement leurs propres tickets
CREATE POLICY "Users view own tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid());

-- Politique: Les utilisateurs peuvent créer leurs propres tickets
CREATE POLICY "Users create tickets" ON support_tickets
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Politique: Les utilisateurs peuvent modifier leurs propres tickets (avant résolution)
CREATE POLICY "Users update own tickets" ON support_tickets
  FOR UPDATE USING (user_id = auth.uid() AND status NOT IN ('resolved', 'closed'));

-- Politique: Les utilisateurs voient les réponses de leurs tickets
CREATE POLICY "Users view ticket responses" ON support_responses
  FOR SELECT USING (
    ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid())
    AND is_internal = FALSE -- Masquer notes internes
  );

-- Politique: Les utilisateurs peuvent répondre à leurs tickets
CREATE POLICY "Users create responses" ON support_responses
  FOR INSERT WITH CHECK (
    user_id = auth.uid() 
    AND ticket_id IN (SELECT id FROM support_tickets WHERE user_id = auth.uid())
    AND is_staff = FALSE -- Les utilisateurs ne peuvent pas se faire passer pour le staff
  );

-- Politique: Tout le monde peut voir les catégories actives
CREATE POLICY "Everyone views active categories" ON support_categories
  FOR SELECT USING (is_active = TRUE);

-- =============================================================================
-- POLICIES STAFF (pour administrateurs/support)
-- =============================================================================
-- Note: À ajouter si vous avez une table profiles avec role 'staff' ou 'admin'

-- CREATE POLICY "Staff views all tickets" ON support_tickets
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.role IN ('staff', 'admin')
--     )
--   );

-- CREATE POLICY "Staff updates all tickets" ON support_tickets
--   FOR UPDATE USING (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.role IN ('staff', 'admin')
--     )
--   );

-- CREATE POLICY "Staff creates responses" ON support_responses
--   FOR INSERT WITH CHECK (
--     EXISTS (
--       SELECT 1 FROM profiles 
--       WHERE profiles.id = auth.uid() 
--       AND profiles.role IN ('staff', 'admin')
--     )
--   );

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_support_tickets_updated_at 
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_responses_updated_at 
  BEFORE UPDATE ON support_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour mettre à jour first_response_at
CREATE OR REPLACE FUNCTION set_first_response_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_staff = TRUE THEN
    UPDATE support_tickets 
    SET 
      first_response_at = NOW(),
      first_response_by = NEW.user_id,
      status = CASE 
        WHEN status = 'open' THEN 'in_progress'
        ELSE status
      END
    WHERE id = NEW.ticket_id 
      AND first_response_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_first_response 
  AFTER INSERT ON support_responses
  FOR EACH ROW EXECUTE FUNCTION set_first_response_at();

-- =============================================================================
-- FONCTION: Générer numéro de ticket unique
-- =============================================================================

CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Générer TK-XXXXXX (6 chiffres aléatoires)
    new_number := 'TK-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
    
    -- Vérifier si le numéro existe déjà
    SELECT EXISTS(SELECT 1 FROM support_tickets WHERE ticket_number = new_number) INTO exists_check;
    
    -- Si le numéro n'existe pas, le retourner
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- DONNÉES INITIALES: Catégories de support
-- =============================================================================

INSERT INTO support_categories (name, slug, description, icon, color, display_order) VALUES
  ('Compte & Authentification', 'compte', 'Problèmes de connexion, inscription, mot de passe', 'User', '#3B82F6', 1),
  ('Propriétés & Annonces', 'proprietes', 'Gestion des propriétés, publication, modification', 'Building', '#10B981', 2),
  ('Paiements & Facturation', 'paiements', 'Questions sur les paiements, abonnements, factures', 'CreditCard', '#F59E0B', 3),
  ('Technique & Bugs', 'technique', 'Bugs, erreurs techniques, problèmes de performance', 'AlertTriangle', '#EF4444', 4),
  ('Fonctionnalités', 'fonctionnalites', 'Suggestions de nouvelles fonctionnalités', 'Sparkles', '#8B5CF6', 5),
  ('Autre', 'autre', 'Autres questions et demandes', 'HelpCircle', '#6B7280', 6)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- VUES UTILES
-- =============================================================================

-- Vue: Tickets avec statistiques
CREATE OR REPLACE VIEW support_tickets_with_stats AS
SELECT 
  t.*,
  COUNT(r.id) AS response_count,
  MAX(r.created_at) AS last_response_at,
  CASE 
    WHEN t.first_response_at IS NOT NULL THEN
      EXTRACT(EPOCH FROM (t.first_response_at - t.created_at)) / 3600 -- en heures
    ELSE NULL
  END AS response_time_hours,
  CASE 
    WHEN t.resolved_at IS NOT NULL THEN
      EXTRACT(EPOCH FROM (t.resolved_at - t.created_at)) / 3600 -- en heures
    ELSE NULL
  END AS resolution_time_hours
FROM support_tickets t
LEFT JOIN support_responses r ON r.ticket_id = t.id
GROUP BY t.id;

-- Vue: Statistiques globales du support
CREATE OR REPLACE VIEW support_stats AS
SELECT 
  COUNT(*) AS total_tickets,
  COUNT(*) FILTER (WHERE status = 'open') AS open_tickets,
  COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress_tickets,
  COUNT(*) FILTER (WHERE status = 'resolved') AS resolved_tickets,
  COUNT(*) FILTER (WHERE status = 'closed') AS closed_tickets,
  AVG(CASE 
    WHEN first_response_at IS NOT NULL THEN
      EXTRACT(EPOCH FROM (first_response_at - created_at)) / 3600
    ELSE NULL
  END) AS avg_first_response_hours,
  AVG(CASE 
    WHEN resolved_at IS NOT NULL THEN
      EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600
    ELSE NULL
  END) AS avg_resolution_hours,
  AVG(satisfaction_rating) FILTER (WHERE satisfaction_rating IS NOT NULL) AS avg_satisfaction_rating
FROM support_tickets;

-- =============================================================================
-- EXEMPLE D'UTILISATION
-- =============================================================================

-- Créer un ticket
-- INSERT INTO support_tickets (user_id, ticket_number, subject, type, priority, description)
-- VALUES (
--   auth.uid(),
--   generate_ticket_number(),
--   'Problème de connexion',
--   'bug',
--   'high',
--   'Je ne peux pas me connecter à mon compte depuis ce matin'
-- );

-- Ajouter une réponse
-- INSERT INTO support_responses (ticket_id, user_id, message, is_staff)
-- VALUES (
--   'TICKET_UUID_HERE',
--   auth.uid(),
--   'Merci pour votre message. Nous avons identifié le problème.',
--   true -- Si réponse du staff
-- );

-- =============================================================================
-- NOTES IMPORTANTES
-- =============================================================================
-- 1. Pour activer les policies staff, décommenter les CREATE POLICY "Staff..."
--    et assurez-vous d'avoir une table profiles avec un champ role
-- 
-- 2. Les attachments sont stockés en JSONB. Pour les fichiers réels,
--    utilisez Supabase Storage et stockez les URLs ici
--
-- 3. Le système de recherche full-text utilise la config 'french'.
--    Ajustez selon votre langue principale
--
-- 4. Les timestamps utilisent TIMEZONE pour gérer les fuseaux horaires
--
-- 5. Pour les notifications en temps réel, utilisez Supabase Realtime
--    sur la table support_responses
-- =============================================================================

COMMENT ON TABLE support_tickets IS 'Tickets de support créés par les utilisateurs';
COMMENT ON TABLE support_responses IS 'Réponses et messages dans les tickets';
COMMENT ON TABLE support_categories IS 'Catégories pour organiser les tickets';
COMMENT ON COLUMN support_tickets.ticket_number IS 'Numéro unique du ticket (TK-XXXXXX)';
COMMENT ON COLUMN support_tickets.first_response_at IS 'Date/heure de la première réponse du staff';
COMMENT ON COLUMN support_responses.is_staff IS 'true si réponse du support, false si du client';
COMMENT ON COLUMN support_responses.is_internal IS 'true pour notes internes invisibles au client';
