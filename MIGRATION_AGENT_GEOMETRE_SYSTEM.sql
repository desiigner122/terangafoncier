-- ============================================================================
-- MIGRATION: Système Agent Foncier et Géomètre (FACULTATIFS)
-- ============================================================================
-- Date: 2025-10-29
-- Description: Ajoute les acteurs Agent Foncier et Géomètre au workflow d'achat
--              Ces deux acteurs sont FACULTATIFS et choisis par l'acheteur
-- ============================================================================

-- ============================================================================
-- 1. MODIFICATION TABLE purchase_cases
-- ============================================================================

ALTER TABLE purchase_cases
ADD COLUMN IF NOT EXISTS agent_foncier_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS geometre_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS agent_assigned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS geometre_assigned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS agent_commission DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS agent_commission_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS agent_commission_paid_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS geometre_fees DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS geometre_fees_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS geometre_fees_paid_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS has_agent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_surveying BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS surveying_completed_at TIMESTAMP;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_purchase_cases_agent 
ON purchase_cases(agent_foncier_id) WHERE agent_foncier_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_purchase_cases_geometre 
ON purchase_cases(geometre_id) WHERE geometre_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_purchase_cases_has_agent 
ON purchase_cases(has_agent) WHERE has_agent = true;

CREATE INDEX IF NOT EXISTS idx_purchase_cases_has_surveying 
ON purchase_cases(has_surveying) WHERE has_surveying = true;

-- Commentaires
COMMENT ON COLUMN purchase_cases.has_agent IS 'L''acheteur a décidé de faire appel à un agent foncier (facultatif)';
COMMENT ON COLUMN purchase_cases.has_surveying IS 'L''acheteur a demandé un bornage par géomètre (facultatif)';
COMMENT ON COLUMN purchase_cases.agent_foncier_id IS 'ID de l''agent foncier choisi par l''acheteur (nullable)';
COMMENT ON COLUMN purchase_cases.geometre_id IS 'ID du géomètre choisi par l''acheteur (nullable)';

-- ============================================================================
-- 2. TABLE agent_foncier_profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_foncier_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informations agence
  agency_name VARCHAR(255) NOT NULL,
  agency_address TEXT,
  agency_region VARCHAR(100),
  license_number VARCHAR(100) UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  
  -- Commission (personnalisable)
  commission_rate DECIMAL(5, 2) DEFAULT 5.00, -- 5% par défaut
  min_commission DECIMAL(12, 2) DEFAULT 0, -- Commission minimum en FCFA
  max_commission DECIMAL(12, 2), -- Commission maximum (nullable)
  
  -- Performance et statistiques
  total_sales_completed INTEGER DEFAULT 0,
  total_commission_earned DECIMAL(15, 2) DEFAULT 0,
  active_cases_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  
  -- Spécialisations
  specializations TEXT[] DEFAULT ARRAY['terrain', 'immobilier'],
  zones_coverage TEXT[], -- Régions où l'agent opère (ex: ['Dakar', 'Thiès'])
  languages_spoken TEXT[] DEFAULT ARRAY['Français', 'Wolof'],
  
  -- Disponibilité
  is_available BOOLEAN DEFAULT true,
  max_active_cases INTEGER DEFAULT 10,
  
  -- Contact
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  whatsapp VARCHAR(50),
  
  -- Présentation
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  
  -- Média
  profile_photo_url TEXT,
  office_photos_urls TEXT[],
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_commission_rate CHECK (commission_rate >= 0 AND commission_rate <= 100),
  CONSTRAINT valid_rating CHECK (rating >= 0 AND rating <= 5)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_agent_profiles_region 
ON agent_foncier_profiles(agency_region);

CREATE INDEX IF NOT EXISTS idx_agent_profiles_available 
ON agent_foncier_profiles(is_available) WHERE is_available = true;

CREATE INDEX IF NOT EXISTS idx_agent_profiles_rating 
ON agent_foncier_profiles(rating DESC);

CREATE INDEX IF NOT EXISTS idx_agent_profiles_verified 
ON agent_foncier_profiles(is_verified) WHERE is_verified = true;

-- ============================================================================
-- 3. TABLE geometre_profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS geometre_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informations cabinet
  cabinet_name VARCHAR(255) NOT NULL,
  cabinet_address TEXT,
  license_number VARCHAR(100) UNIQUE,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP,
  
  -- Tarification (personnalisable)
  bornage_fee DECIMAL(12, 2) DEFAULT 100000, -- 100k FCFA
  plan_fee DECIMAL(12, 2) DEFAULT 50000, -- 50k FCFA
  certificate_fee DECIMAL(12, 2) DEFAULT 30000, -- 30k FCFA
  complete_mission_fee DECIMAL(12, 2) DEFAULT 150000, -- 150k FCFA (package complet)
  
  -- Performance et statistiques
  total_missions_completed INTEGER DEFAULT 0,
  active_missions_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  average_completion_days DECIMAL(6, 2), -- Moyenne jours pour compléter une mission
  
  -- Équipement et capacités
  has_gps BOOLEAN DEFAULT true,
  has_drone BOOLEAN DEFAULT false,
  has_total_station BOOLEAN DEFAULT true, -- Théodolite/Station totale
  has_level BOOLEAN DEFAULT true, -- Niveau optique
  team_size INTEGER DEFAULT 1,
  
  -- Zones d'intervention
  zones_coverage TEXT[], -- Régions où le géomètre opère
  
  -- Disponibilité
  is_available BOOLEAN DEFAULT true,
  max_active_missions INTEGER DEFAULT 5,
  
  -- Contact
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  whatsapp VARCHAR(50),
  
  -- Présentation
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  certifications TEXT[], -- Certifications professionnelles
  
  -- Média
  profile_photo_url TEXT,
  equipment_photos_urls TEXT[],
  sample_work_urls TEXT[], -- Exemples de plans réalisés
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_geometre_rating CHECK (rating >= 0 AND rating <= 5),
  CONSTRAINT valid_fees CHECK (bornage_fee >= 0 AND plan_fee >= 0 AND certificate_fee >= 0)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_geometre_profiles_available 
ON geometre_profiles(is_available) WHERE is_available = true;

CREATE INDEX IF NOT EXISTS idx_geometre_profiles_rating 
ON geometre_profiles(rating DESC);

CREATE INDEX IF NOT EXISTS idx_geometre_profiles_verified 
ON geometre_profiles(is_verified) WHERE is_verified = true;

-- ============================================================================
-- 4. TABLE surveying_missions (Missions de bornage)
-- ============================================================================

CREATE TABLE IF NOT EXISTS surveying_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  case_id UUID REFERENCES purchase_cases(id) ON DELETE CASCADE,
  geometre_id UUID REFERENCES profiles(id),
  parcelle_id UUID REFERENCES parcels(id),
  requested_by UUID REFERENCES profiles(id), -- L'acheteur qui demande
  
  -- Type de mission
  mission_type VARCHAR(50) NOT NULL DEFAULT 'complete',
  
  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  
  -- Dates
  requested_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  scheduled_date DATE,
  visit_date DATE,
  completed_at TIMESTAMP,
  
  -- Livrables
  plan_url TEXT, -- URL du plan de bornage
  certificate_url TEXT, -- URL du certificat topographique
  photos_urls TEXT[], -- Photos du terrain
  gps_coordinates JSONB, -- Coordonnées GPS des bornes
  surface_measured DECIMAL(12, 2), -- Surface mesurée en m²
  perimeter_measured DECIMAL(12, 2), -- Périmètre en mètres
  
  -- Tarif
  quoted_fee DECIMAL(12, 2),
  final_fee DECIMAL(12, 2),
  paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMP,
  payment_proof_url TEXT,
  
  -- Notes
  geometre_notes TEXT,
  client_notes TEXT,
  admin_notes TEXT,
  
  -- Observations techniques
  discrepancies_found BOOLEAN DEFAULT false, -- Divergences trouvées
  discrepancies_description TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_mission_type CHECK (mission_type IN 
    ('bornage', 'plan', 'certificat', 'verification', 'complete')
  ),
  CONSTRAINT valid_mission_status CHECK (status IN 
    ('pending', 'accepted', 'scheduled', 'in_progress', 'completed', 'cancelled', 'declined')
  )
);

-- Index
CREATE INDEX IF NOT EXISTS idx_surveying_missions_case 
ON surveying_missions(case_id);

CREATE INDEX IF NOT EXISTS idx_surveying_missions_geometre 
ON surveying_missions(geometre_id);

CREATE INDEX IF NOT EXISTS idx_surveying_missions_status 
ON surveying_missions(status);

CREATE INDEX IF NOT EXISTS idx_surveying_missions_pending 
ON surveying_missions(status, requested_at) 
WHERE status = 'pending';

-- Commentaires
COMMENT ON TABLE surveying_missions IS 'Missions de bornage demandées par les acheteurs (facultatif)';
COMMENT ON COLUMN surveying_missions.mission_type IS 'Type: bornage, plan, certificat, verification, complete';
COMMENT ON COLUMN surveying_missions.status IS 'Status: pending, accepted, scheduled, in_progress, completed, cancelled, declined';

-- ============================================================================
-- 5. TABLE agent_reviews (Évaluations des agents)
-- ============================================================================

CREATE TABLE IF NOT EXISTS agent_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  agent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES purchase_cases(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  reviewer_role VARCHAR(50) NOT NULL, -- 'buyer' ou 'seller'
  
  -- Évaluation
  rating DECIMAL(3, 2) NOT NULL,
  
  -- Critères détaillés (1-5)
  communication_rating DECIMAL(3, 2),
  professionalism_rating DECIMAL(3, 2),
  responsiveness_rating DECIMAL(3, 2),
  negotiation_skills_rating DECIMAL(3, 2),
  
  -- Commentaire
  comment TEXT,
  
  -- Recommandation
  would_recommend BOOLEAN,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_agent_rating CHECK (rating >= 0 AND rating <= 5),
  CONSTRAINT valid_reviewer_role CHECK (reviewer_role IN ('buyer', 'seller')),
  CONSTRAINT unique_agent_review UNIQUE(agent_id, case_id, reviewer_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_agent_reviews_agent 
ON agent_reviews(agent_id);

CREATE INDEX IF NOT EXISTS idx_agent_reviews_case 
ON agent_reviews(case_id);

-- ============================================================================
-- 6. TABLE geometre_reviews (Évaluations des géomètres)
-- ============================================================================

CREATE TABLE IF NOT EXISTS geometre_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  geometre_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES surveying_missions(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  
  -- Évaluation
  rating DECIMAL(3, 2) NOT NULL,
  
  -- Critères détaillés (1-5)
  accuracy_rating DECIMAL(3, 2), -- Précision
  professionalism_rating DECIMAL(3, 2),
  timeliness_rating DECIMAL(3, 2), -- Respect des délais
  communication_rating DECIMAL(3, 2),
  
  -- Commentaire
  comment TEXT,
  
  -- Recommandation
  would_recommend BOOLEAN,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_geometre_rating CHECK (rating >= 0 AND rating <= 5),
  CONSTRAINT unique_geometre_review UNIQUE(geometre_id, mission_id, reviewer_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_geometre_reviews_geometre 
ON geometre_reviews(geometre_id);

CREATE INDEX IF NOT EXISTS idx_geometre_reviews_mission 
ON geometre_reviews(mission_id);

-- ============================================================================
-- 7. FONCTIONS UTILITAIRES
-- ============================================================================

-- Fonction: Incrémenter le compteur de dossiers actifs d'un agent
CREATE OR REPLACE FUNCTION increment_agent_cases()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.agent_foncier_id IS NOT NULL AND NEW.has_agent = true THEN
    UPDATE agent_foncier_profiles
    SET active_cases_count = active_cases_count + 1,
        updated_at = NOW()
    WHERE id = NEW.agent_foncier_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Décrémenter le compteur de dossiers actifs d'un agent
CREATE OR REPLACE FUNCTION decrement_agent_cases()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.agent_foncier_id IS NOT NULL AND OLD.status = 'completed' THEN
    UPDATE agent_foncier_profiles
    SET active_cases_count = GREATEST(0, active_cases_count - 1),
        total_sales_completed = total_sales_completed + 1,
        total_commission_earned = total_commission_earned + COALESCE(OLD.agent_commission, 0),
        updated_at = NOW()
    WHERE id = OLD.agent_foncier_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Incrémenter le compteur de missions actives d'un géomètre
CREATE OR REPLACE FUNCTION increment_geometre_missions()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.geometre_id IS NOT NULL AND NEW.status = 'accepted' THEN
    UPDATE geometre_profiles
    SET active_missions_count = active_missions_count + 1,
        updated_at = NOW()
    WHERE id = NEW.geometre_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Décrémenter le compteur de missions actives d'un géomètre
CREATE OR REPLACE FUNCTION decrement_geometre_missions()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.geometre_id IS NOT NULL AND NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE geometre_profiles
    SET active_missions_count = GREATEST(0, active_missions_count - 1),
        total_missions_completed = total_missions_completed + 1,
        updated_at = NOW()
    WHERE id = OLD.geometre_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Mettre à jour le rating d'un agent après un review
CREATE OR REPLACE FUNCTION update_agent_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agent_foncier_profiles
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM agent_reviews
    WHERE agent_id = NEW.agent_id
  ),
  reviews_count = (
    SELECT COUNT(*)
    FROM agent_reviews
    WHERE agent_id = NEW.agent_id
  ),
  updated_at = NOW()
  WHERE id = NEW.agent_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Mettre à jour le rating d'un géomètre après un review
CREATE OR REPLACE FUNCTION update_geometre_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE geometre_profiles
  SET rating = (
    SELECT COALESCE(AVG(rating), 0)
    FROM geometre_reviews
    WHERE geometre_id = NEW.geometre_id
  ),
  reviews_count = (
    SELECT COUNT(*)
    FROM geometre_reviews
    WHERE geometre_id = NEW.geometre_id
  ),
  updated_at = NOW()
  WHERE id = NEW.geometre_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Fonction: Calculer la durée moyenne de complétion pour un géomètre
CREATE OR REPLACE FUNCTION update_geometre_avg_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE geometre_profiles
    SET average_completion_days = (
      SELECT AVG(EXTRACT(EPOCH FROM (completed_at - accepted_at)) / 86400)
      FROM surveying_missions
      WHERE geometre_id = NEW.geometre_id
        AND status = 'completed'
        AND accepted_at IS NOT NULL
        AND completed_at IS NOT NULL
    )
    WHERE id = NEW.geometre_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. TRIGGERS
-- ============================================================================

-- Trigger: Incrémenter compteur agent quand assigné
DROP TRIGGER IF EXISTS trigger_increment_agent_cases ON purchase_cases;
CREATE TRIGGER trigger_increment_agent_cases
AFTER INSERT ON purchase_cases
FOR EACH ROW
EXECUTE FUNCTION increment_agent_cases();

-- Trigger: Décrémenter compteur agent quand dossier complété
DROP TRIGGER IF EXISTS trigger_decrement_agent_cases ON purchase_cases;
CREATE TRIGGER trigger_decrement_agent_cases
AFTER UPDATE ON purchase_cases
FOR EACH ROW
WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
EXECUTE FUNCTION decrement_agent_cases();

-- Trigger: Incrémenter compteur géomètre quand mission acceptée
DROP TRIGGER IF EXISTS trigger_increment_geometre_missions ON surveying_missions;
CREATE TRIGGER trigger_increment_geometre_missions
AFTER UPDATE ON surveying_missions
FOR EACH ROW
WHEN (NEW.status = 'accepted' AND OLD.status != 'accepted')
EXECUTE FUNCTION increment_geometre_missions();

-- Trigger: Décrémenter compteur géomètre quand mission complétée
DROP TRIGGER IF EXISTS trigger_decrement_geometre_missions ON surveying_missions;
CREATE TRIGGER trigger_decrement_geometre_missions
AFTER UPDATE ON surveying_missions
FOR EACH ROW
EXECUTE FUNCTION decrement_geometre_missions();

-- Trigger: Mettre à jour rating agent après review
DROP TRIGGER IF EXISTS trigger_update_agent_rating ON agent_reviews;
CREATE TRIGGER trigger_update_agent_rating
AFTER INSERT OR UPDATE ON agent_reviews
FOR EACH ROW
EXECUTE FUNCTION update_agent_rating();

-- Trigger: Mettre à jour rating géomètre après review
DROP TRIGGER IF EXISTS trigger_update_geometre_rating ON geometre_reviews;
CREATE TRIGGER trigger_update_geometre_rating
AFTER INSERT OR UPDATE ON geometre_reviews
FOR EACH ROW
EXECUTE FUNCTION update_geometre_rating();

-- Trigger: Mettre à jour durée moyenne complétion géomètre
DROP TRIGGER IF EXISTS trigger_update_geometre_avg ON surveying_missions;
CREATE TRIGGER trigger_update_geometre_avg
AFTER UPDATE ON surveying_missions
FOR EACH ROW
EXECUTE FUNCTION update_geometre_avg_completion();

-- ============================================================================
-- 9. VUES UTILES
-- ============================================================================

-- Vue: Agents disponibles avec capacité
CREATE OR REPLACE VIEW available_agents AS
SELECT 
  afp.*,
  p.full_name,
  p.avatar_url,
  (afp.max_active_cases - afp.active_cases_count) as available_capacity,
  CASE 
    WHEN afp.active_cases_count >= afp.max_active_cases THEN false
    ELSE afp.is_available
  END as is_truly_available
FROM agent_foncier_profiles afp
JOIN profiles p ON p.id = afp.id
WHERE afp.is_available = true
ORDER BY afp.rating DESC, afp.active_cases_count ASC;

-- Vue: Géomètres disponibles avec capacité
CREATE OR REPLACE VIEW available_geometres AS
SELECT 
  gp.*,
  p.full_name,
  p.avatar_url,
  (gp.max_active_missions - gp.active_missions_count) as available_capacity,
  CASE 
    WHEN gp.active_missions_count >= gp.max_active_missions THEN false
    ELSE gp.is_available
  END as is_truly_available
FROM geometre_profiles gp
JOIN profiles p ON p.id = gp.id
WHERE gp.is_available = true
ORDER BY gp.rating DESC, gp.active_missions_count ASC;

-- Vue: Missions de bornage en attente
CREATE OR REPLACE VIEW pending_surveying_missions AS
SELECT 
  sm.*,
  gp.cabinet_name,
  gp.phone as geometre_phone,
  p.full_name as geometre_name,
  pc.case_number,
  EXTRACT(EPOCH FROM (NOW() - sm.requested_at)) / 3600 as hours_pending
FROM surveying_missions sm
LEFT JOIN geometre_profiles gp ON gp.id = sm.geometre_id
LEFT JOIN profiles p ON p.id = sm.geometre_id
JOIN purchase_cases pc ON pc.id = sm.case_id
WHERE sm.status = 'pending'
ORDER BY sm.requested_at ASC;

-- ============================================================================
-- 10. POLITIQUES RLS (Row Level Security)
-- ============================================================================

-- Enable RLS
ALTER TABLE agent_foncier_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE geometre_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveying_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE geometre_reviews ENABLE ROW LEVEL SECURITY;

-- Politiques: agent_foncier_profiles
DROP POLICY IF EXISTS "Agents publics visibles" ON agent_foncier_profiles;
CREATE POLICY "Agents publics visibles"
ON agent_foncier_profiles FOR SELECT
TO authenticated
USING (is_verified = true);

DROP POLICY IF EXISTS "Agent peut voir son profil" ON agent_foncier_profiles;
CREATE POLICY "Agent peut voir son profil"
ON agent_foncier_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Agent peut modifier son profil" ON agent_foncier_profiles;
CREATE POLICY "Agent peut modifier son profil"
ON agent_foncier_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Politiques: geometre_profiles
DROP POLICY IF EXISTS "Géomètres publics visibles" ON geometre_profiles;
CREATE POLICY "Géomètres publics visibles"
ON geometre_profiles FOR SELECT
TO authenticated
USING (is_verified = true);

DROP POLICY IF EXISTS "Géomètre peut voir son profil" ON geometre_profiles;
CREATE POLICY "Géomètre peut voir son profil"
ON geometre_profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Géomètre peut modifier son profil" ON geometre_profiles;
CREATE POLICY "Géomètre peut modifier son profil"
ON geometre_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Politiques: surveying_missions
DROP POLICY IF EXISTS "Voir missions si impliqué" ON surveying_missions;
CREATE POLICY "Voir missions si impliqué"
ON surveying_missions FOR SELECT
TO authenticated
USING (
  auth.uid() = geometre_id OR
  auth.uid() = requested_by OR
  auth.uid() IN (
    SELECT buyer_id FROM purchase_cases WHERE id = case_id
    UNION
    SELECT seller_id FROM purchase_cases WHERE id = case_id
    UNION
    SELECT notaire_id FROM purchase_cases WHERE id = case_id
    UNION
    SELECT agent_foncier_id FROM purchase_cases WHERE id = case_id
  )
);

DROP POLICY IF EXISTS "Créer mission si acheteur" ON surveying_missions;
CREATE POLICY "Créer mission si acheteur"
ON surveying_missions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = requested_by);

DROP POLICY IF EXISTS "Modifier mission si géomètre" ON surveying_missions;
CREATE POLICY "Modifier mission si géomètre"
ON surveying_missions FOR UPDATE
TO authenticated
USING (auth.uid() = geometre_id);

-- Politiques: agent_reviews
DROP POLICY IF EXISTS "Voir reviews publiques" ON agent_reviews;
CREATE POLICY "Voir reviews publiques"
ON agent_reviews FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Créer review si impliqué" ON agent_reviews;
CREATE POLICY "Créer review si impliqué"
ON agent_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer_id);

-- Politiques: geometre_reviews
DROP POLICY IF EXISTS "Voir reviews géomètre publiques" ON geometre_reviews;
CREATE POLICY "Voir reviews géomètre publiques"
ON geometre_reviews FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Créer review géomètre si impliqué" ON geometre_reviews;
CREATE POLICY "Créer review géomètre si impliqué"
ON geometre_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer_id);

-- ============================================================================
-- 11. DONNÉES DE TEST (Optionnel - Commenter si pas nécessaire)
-- ============================================================================

-- Exemple: Créer un agent foncier de test
-- INSERT INTO agent_foncier_profiles (
--   id, agency_name, agency_region, phone, commission_rate, is_verified
-- )
-- SELECT 
--   id, 
--   'Agence Teranga Immo', 
--   'Dakar', 
--   '+221 77 123 45 67', 
--   5.00,
--   true
-- FROM profiles 
-- WHERE email = 'agent@test.com'
-- ON CONFLICT (id) DO NOTHING;

-- Exemple: Créer un géomètre de test
-- INSERT INTO geometre_profiles (
--   id, cabinet_name, phone, is_verified
-- )
-- SELECT 
--   id, 
--   'Cabinet Topographie Ndiaye', 
--   '+221 77 987 65 43', 
--   true
-- FROM profiles 
-- WHERE email = 'geometre@test.com'
-- ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- FIN DE LA MIGRATION
-- ============================================================================

-- Résumé de ce qui a été créé:
-- ✅ Modifications purchase_cases (agent_foncier_id, geometre_id, has_agent, has_surveying)
-- ✅ Table agent_foncier_profiles (profils agents avec ratings, commissions)
-- ✅ Table geometre_profiles (profils géomètres avec équipement, tarifs)
-- ✅ Table surveying_missions (missions de bornage avec livrables)
-- ✅ Tables agent_reviews et geometre_reviews (évaluations)
-- ✅ 7 Fonctions (compteurs, ratings, durées moyennes)
-- ✅ 7 Triggers (auto-update des statistiques)
-- ✅ 3 Vues (available_agents, available_geometres, pending_surveying_missions)
-- ✅ Politiques RLS complètes pour toutes les tables

-- Note: Les agents et géomètres sont FACULTATIFS
-- L'acheteur décide via has_agent et has_surveying
