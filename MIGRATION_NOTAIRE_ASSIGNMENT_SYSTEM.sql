-- ============================================================
-- SYSTÈME D'ATTRIBUTION DES NOTAIRES AUX DOSSIERS DE VENTE
-- ============================================================
-- Décisions:
-- 1. Acheteur ET Vendeur choisissent ensemble (les 2 doivent valider)
-- 2. Notaire a 24h pour accepter/refuser
-- 3. Prix libre (chaque notaire fixe ses tarifs)
-- ============================================================

-- ==================================================
-- 1. AJOUTER COLONNES À purchase_cases
-- ==================================================

ALTER TABLE purchase_cases
ADD COLUMN IF NOT EXISTS notaire_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS notaire_assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notaire_accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS notaire_selection_method VARCHAR(50) DEFAULT 'manual',
ADD COLUMN IF NOT EXISTS notaire_fees DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS buyer_approved_notaire BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS seller_approved_notaire BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS buyer_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS seller_approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS assignment_metadata JSONB DEFAULT '{}'::jsonb;

-- Commentaires
COMMENT ON COLUMN purchase_cases.notaire_selection_method IS 'Comment le notaire a été choisi: manual, auto, recommended, geographic';
COMMENT ON COLUMN purchase_cases.buyer_approved_notaire IS 'L''acheteur a-t-il approuvé le choix du notaire?';
COMMENT ON COLUMN purchase_cases.seller_approved_notaire IS 'Le vendeur a-t-il approuvé le choix du notaire?';
COMMENT ON COLUMN purchase_cases.assignment_metadata IS 'Métadonnées: score, distance, raison de sélection';

-- Index
CREATE INDEX IF NOT EXISTS idx_purchase_cases_notaire 
ON purchase_cases(notaire_id) WHERE notaire_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_purchase_cases_notaire_status 
ON purchase_cases(notaire_id, status) WHERE notaire_id IS NOT NULL;

-- ==================================================
-- 2. CRÉER TABLE notaire_profiles
-- ==================================================

CREATE TABLE IF NOT EXISTS notaire_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Informations office notarial
  office_name VARCHAR(255) NOT NULL,
  office_address TEXT,
  office_region VARCHAR(100),
  office_commune VARCHAR(100),
  office_department VARCHAR(100),
  office_latitude DECIMAL(10, 8),
  office_longitude DECIMAL(11, 8),
  
  -- Contact
  office_phone VARCHAR(50),
  office_email VARCHAR(255),
  office_website VARCHAR(255),
  
  -- Spécialisations
  specializations TEXT[] DEFAULT ARRAY['terrain', 'immobilier', 'succession'],
  languages TEXT[] DEFAULT ARRAY['français'],
  
  -- Disponibilité
  is_available BOOLEAN DEFAULT true,
  is_accepting_cases BOOLEAN DEFAULT true,
  max_concurrent_cases INTEGER DEFAULT 15,
  current_cases_count INTEGER DEFAULT 0,
  
  -- Tarification (FCFA)
  base_fee_min DECIMAL(12, 2) DEFAULT 50000,
  base_fee_max DECIMAL(12, 2) DEFAULT 200000,
  percentage_fee DECIMAL(5, 2) DEFAULT 2.00, -- 2% du prix de vente
  fee_structure TEXT DEFAULT 'percentage', -- 'fixed', 'percentage', 'hybrid'
  fee_description TEXT,
  
  -- Performance
  total_cases_completed INTEGER DEFAULT 0,
  total_cases_cancelled INTEGER DEFAULT 0,
  average_completion_days DECIMAL(6, 2),
  average_response_hours DECIMAL(6, 2),
  
  -- Évaluations
  rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  reviews_count INTEGER DEFAULT 0,
  
  -- Certifications
  license_number VARCHAR(100),
  license_expiry_date DATE,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  
  -- Horaires (JSONB)
  business_hours JSONB DEFAULT '{
    "monday": {"open": "08:00", "close": "18:00"},
    "tuesday": {"open": "08:00", "close": "18:00"},
    "wednesday": {"open": "08:00", "close": "18:00"},
    "thursday": {"open": "08:00", "close": "18:00"},
    "friday": {"open": "08:00", "close": "18:00"},
    "saturday": {"open": "09:00", "close": "13:00"},
    "sunday": {"open": null, "close": null}
  }'::jsonb,
  
  -- Bio
  bio TEXT,
  experience_years INTEGER DEFAULT 0,
  
  -- Métadonnées
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_notaire_profiles_region 
ON notaire_profiles(office_region) WHERE is_available = true;

CREATE INDEX IF NOT EXISTS idx_notaire_profiles_available 
ON notaire_profiles(is_accepting_cases, current_cases_count, is_available);

CREATE INDEX IF NOT EXISTS idx_notaire_profiles_rating 
ON notaire_profiles(rating DESC, reviews_count DESC);

CREATE INDEX IF NOT EXISTS idx_notaire_profiles_location 
ON notaire_profiles(office_latitude, office_longitude) 
WHERE office_latitude IS NOT NULL AND office_longitude IS NOT NULL;

-- RLS
ALTER TABLE notaire_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view active notaire profiles"
ON notaire_profiles FOR SELECT
USING (is_available = true OR auth.uid() = id);

CREATE POLICY "Notaires can update their own profile"
ON notaire_profiles FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Notaires can insert their own profile"
ON notaire_profiles FOR INSERT
WITH CHECK (id = auth.uid());

-- ==================================================
-- 3. CRÉER TABLE notaire_case_assignments
-- ==================================================

CREATE TABLE IF NOT EXISTS notaire_case_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  notaire_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Qui a proposé ce notaire?
  proposed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  proposed_by_role VARCHAR(50), -- 'buyer', 'seller', 'system', 'admin'
  
  -- Status de l'assignment
  status VARCHAR(50) DEFAULT 'pending', 
  
  -- Approbations (les 2 parties doivent approuver)
  buyer_approved BOOLEAN DEFAULT false,
  seller_approved BOOLEAN DEFAULT false,
  buyer_approved_at TIMESTAMP WITH TIME ZONE,
  seller_approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Réponse du notaire
  notaire_status VARCHAR(50) DEFAULT 'pending',
  notaire_responded_at TIMESTAMP WITH TIME ZONE,
  notaire_decline_reason TEXT,
  
  -- Timing
  proposed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  
  -- Scoring (calculé par algorithme)
  assignment_score INTEGER,
  assignment_reason TEXT,
  distance_km DECIMAL(8, 2),
  assignment_metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Devis du notaire
  quoted_fee DECIMAL(12, 2),
  fee_breakdown JSONB DEFAULT '{}'::jsonb,
  
  -- Notes
  buyer_notes TEXT,
  seller_notes TEXT,
  notaire_notes TEXT,
  admin_notes TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_assignment_status CHECK (status IN 
    ('pending', 'buyer_approved', 'seller_approved', 'both_approved', 
     'notaire_accepted', 'notaire_declined', 'expired', 'cancelled', 'completed')
  ),
  CONSTRAINT valid_notaire_status CHECK (notaire_status IN 
    ('pending', 'accepted', 'declined', 'expired')
  ),
  CONSTRAINT valid_proposed_by_role CHECK (proposed_by_role IN 
    ('buyer', 'seller', 'system', 'admin', 'notaire')
  )
);

-- Index
CREATE INDEX IF NOT EXISTS idx_assignments_case 
ON notaire_case_assignments(case_id);

CREATE INDEX IF NOT EXISTS idx_assignments_notaire 
ON notaire_case_assignments(notaire_id);

CREATE INDEX IF NOT EXISTS idx_assignments_status 
ON notaire_case_assignments(status);

CREATE INDEX IF NOT EXISTS idx_assignments_notaire_status 
ON notaire_case_assignments(notaire_id, notaire_status) 
WHERE notaire_status = 'pending';

CREATE INDEX IF NOT EXISTS idx_assignments_expires 
ON notaire_case_assignments(expires_at) 
WHERE status IN ('pending', 'buyer_approved', 'seller_approved', 'both_approved');

-- RLS
ALTER TABLE notaire_case_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assignments for their cases"
ON notaire_case_assignments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE id = notaire_case_assignments.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  OR notaire_id = auth.uid()
);

CREATE POLICY "Buyers and sellers can create assignments"
ON notaire_case_assignments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE id = notaire_case_assignments.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
);

CREATE POLICY "Parties can update assignments"
ON notaire_case_assignments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE id = notaire_case_assignments.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
  )
  OR notaire_id = auth.uid()
);

-- ==================================================
-- 4. CRÉER TABLE notaire_reviews
-- ==================================================

CREATE TABLE IF NOT EXISTS notaire_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  notaire_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewer_role VARCHAR(50) NOT NULL, -- 'buyer', 'seller'
  
  -- Évaluation
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  -- Critères détaillés (1-5)
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  speed_rating INTEGER CHECK (speed_rating >= 1 AND speed_rating <= 5),
  expertise_rating INTEGER CHECK (expertise_rating >= 1 AND expertise_rating <= 5),
  
  -- Commentaire
  comment TEXT,
  
  -- Recommandation
  would_recommend BOOLEAN DEFAULT true,
  
  -- Statut
  status VARCHAR(50) DEFAULT 'published',
  
  -- Réponse du notaire
  notaire_response TEXT,
  notaire_responded_at TIMESTAMP WITH TIME ZONE,
  
  -- Modération
  is_verified BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_reviewer_role CHECK (reviewer_role IN ('buyer', 'seller')),
  CONSTRAINT valid_review_status CHECK (status IN ('draft', 'published', 'hidden', 'deleted')),
  
  -- Un reviewer ne peut évaluer qu'une fois par dossier
  UNIQUE(case_id, reviewer_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_reviews_notaire 
ON notaire_reviews(notaire_id, status) WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_reviews_rating 
ON notaire_reviews(notaire_id, rating) WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_reviews_case 
ON notaire_reviews(case_id);

-- RLS
ALTER TABLE notaire_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published reviews"
ON notaire_reviews FOR SELECT
USING (status = 'published');

CREATE POLICY "Reviewers can create their own reviews"
ON notaire_reviews FOR INSERT
WITH CHECK (
  reviewer_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM purchase_cases
    WHERE id = notaire_reviews.case_id
    AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    AND status = 'completed'
  )
);

CREATE POLICY "Reviewers can update their own reviews"
ON notaire_reviews FOR UPDATE
USING (reviewer_id = auth.uid());

-- ==================================================
-- 5. FONCTIONS POSTGRESQL
-- ==================================================

-- Fonction: Incrémenter le compteur de dossiers du notaire
CREATE OR REPLACE FUNCTION increment_notaire_cases(p_notaire_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE notaire_profiles
  SET current_cases_count = current_cases_count + 1,
      updated_at = NOW()
  WHERE id = p_notaire_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Décrémenter le compteur de dossiers du notaire
CREATE OR REPLACE FUNCTION decrement_notaire_cases(p_notaire_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE notaire_profiles
  SET current_cases_count = GREATEST(current_cases_count - 1, 0),
      updated_at = NOW()
  WHERE id = p_notaire_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Mettre à jour la note moyenne d'un notaire
CREATE OR REPLACE FUNCTION update_notaire_rating(p_notaire_id UUID)
RETURNS void AS $$
DECLARE
  v_avg_rating DECIMAL(3,2);
  v_review_count INTEGER;
BEGIN
  SELECT 
    COALESCE(AVG(rating), 0),
    COUNT(*)
  INTO v_avg_rating, v_review_count
  FROM notaire_reviews
  WHERE notaire_id = p_notaire_id
    AND status = 'published';
  
  UPDATE notaire_profiles
  SET rating = v_avg_rating,
      reviews_count = v_review_count,
      updated_at = NOW()
  WHERE id = p_notaire_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Expirer les assignments non répondus
CREATE OR REPLACE FUNCTION expire_pending_assignments()
RETURNS void AS $$
BEGIN
  UPDATE notaire_case_assignments
  SET status = 'expired',
      notaire_status = 'expired',
      updated_at = NOW()
  WHERE expires_at < NOW()
    AND notaire_status = 'pending'
    AND status NOT IN ('notaire_accepted', 'notaire_declined', 'cancelled', 'expired');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction: Calculer distance entre 2 points GPS (Haversine)
CREATE OR REPLACE FUNCTION calculate_distance_km(
  lat1 DECIMAL, lon1 DECIMAL,
  lat2 DECIMAL, lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  R CONSTANT DECIMAL := 6371; -- Rayon Terre en km
  dLat DECIMAL;
  dLon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  dLat := radians(lat2 - lat1);
  dLon := radians(lon2 - lon1);
  
  a := sin(dLat/2) * sin(dLat/2) +
       cos(radians(lat1)) * cos(radians(lat2)) *
       sin(dLon/2) * sin(dLon/2);
  
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==================================================
-- 6. TRIGGERS
-- ==================================================

-- Trigger: Auto-update notaire rating après nouvelle review
CREATE OR REPLACE FUNCTION trigger_update_notaire_rating()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_notaire_rating(NEW.notaire_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS after_review_insert ON notaire_reviews;
CREATE TRIGGER after_review_insert
  AFTER INSERT ON notaire_reviews
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_notaire_rating();

DROP TRIGGER IF EXISTS after_review_update ON notaire_reviews;
CREATE TRIGGER after_review_update
  AFTER UPDATE ON notaire_reviews
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status OR OLD.rating IS DISTINCT FROM NEW.rating)
  EXECUTE FUNCTION trigger_update_notaire_rating();

-- Trigger: Auto-update assignment status quand les 2 parties approuvent
CREATE OR REPLACE FUNCTION trigger_check_both_approved()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.buyer_approved = true AND NEW.seller_approved = true THEN
    NEW.status := 'both_approved';
  ELSIF NEW.buyer_approved = true AND NEW.seller_approved = false THEN
    NEW.status := 'buyer_approved';
  ELSIF NEW.buyer_approved = false AND NEW.seller_approved = true THEN
    NEW.status := 'seller_approved';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS before_assignment_approval ON notaire_case_assignments;
CREATE TRIGGER before_assignment_approval
  BEFORE UPDATE ON notaire_case_assignments
  FOR EACH ROW
  WHEN (OLD.buyer_approved IS DISTINCT FROM NEW.buyer_approved 
     OR OLD.seller_approved IS DISTINCT FROM NEW.seller_approved)
  EXECUTE FUNCTION trigger_check_both_approved();

-- Trigger: Mettre à jour updated_at
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_notaire_profiles_updated_at ON notaire_profiles;
CREATE TRIGGER set_notaire_profiles_updated_at
  BEFORE UPDATE ON notaire_profiles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_assignments_updated_at ON notaire_case_assignments;
CREATE TRIGGER set_assignments_updated_at
  BEFORE UPDATE ON notaire_case_assignments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_updated_at();

-- ==================================================
-- 7. VUES UTILES
-- ==================================================

-- Vue: Notaires disponibles avec statistiques
CREATE OR REPLACE VIEW available_notaires AS
SELECT 
  np.*,
  p.email,
  p.full_name,
  p.avatar_url,
  (np.max_concurrent_cases - np.current_cases_count) as available_slots,
  CASE 
    WHEN np.current_cases_count >= np.max_concurrent_cases THEN 'full'
    WHEN np.current_cases_count::DECIMAL / np.max_concurrent_cases > 0.8 THEN 'busy'
    ELSE 'available'
  END as capacity_status
FROM notaire_profiles np
JOIN profiles p ON np.id = p.id
WHERE np.is_available = true
  AND np.is_accepting_cases = true
  AND np.current_cases_count < np.max_concurrent_cases;

-- Vue: Assignments en attente de réponse notaire
CREATE OR REPLACE VIEW pending_notaire_assignments AS
SELECT 
  nca.*,
  pc.case_number,
  pc.buyer_id,
  pc.seller_id,
  buyer.full_name as buyer_name,
  seller.full_name as seller_name,
  notaire.full_name as notaire_name,
  np.office_name,
  EXTRACT(EPOCH FROM (nca.expires_at - NOW()))/3600 as hours_remaining
FROM notaire_case_assignments nca
JOIN purchase_cases pc ON nca.case_id = pc.id
JOIN profiles buyer ON pc.buyer_id = buyer.id
JOIN profiles seller ON pc.seller_id = seller.id
JOIN profiles notaire ON nca.notaire_id = notaire.id
JOIN notaire_profiles np ON nca.notaire_id = np.id
WHERE nca.notaire_status = 'pending'
  AND nca.status = 'both_approved'
  AND nca.expires_at > NOW();

-- ==================================================
-- 8. DONNÉES DE TEST (OPTIONNEL)
-- ==================================================

-- Insérer 3 profils notaires de test (à adapter avec vos UUIDs)
-- INSERT INTO notaire_profiles (id, office_name, office_region, office_commune, ...)
-- VALUES (...);

-- ==================================================
-- 9. VÉRIFICATION
-- ==================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Système d''attribution des notaires créé avec succès !';
  RAISE NOTICE '';
  RAISE NOTICE '📋 Tables créées:';
  RAISE NOTICE '  - notaire_profiles (profils détaillés)';
  RAISE NOTICE '  - notaire_case_assignments (propositions)';
  RAISE NOTICE '  - notaire_reviews (évaluations)';
  RAISE NOTICE '';
  RAISE NOTICE '🔧 Fonctions créées:';
  RAISE NOTICE '  - increment_notaire_cases()';
  RAISE NOTICE '  - decrement_notaire_cases()';
  RAISE NOTICE '  - update_notaire_rating()';
  RAISE NOTICE '  - expire_pending_assignments()';
  RAISE NOTICE '  - calculate_distance_km()';
  RAISE NOTICE '';
  RAISE NOTICE '⚡ Triggers actifs:';
  RAISE NOTICE '  - Auto-update rating après review';
  RAISE NOTICE '  - Auto-update status quand 2 parties approuvent';
  RAISE NOTICE '  - Auto-update updated_at timestamps';
  RAISE NOTICE '';
  RAISE NOTICE '🔒 RLS activé sur toutes les tables';
  RAISE NOTICE '';
  RAISE NOTICE '📊 Workflow:';
  RAISE NOTICE '  1. Acheteur/Vendeur propose un notaire';
  RAISE NOTICE '  2. Les 2 parties doivent approuver';
  RAISE NOTICE '  3. Notaire a 24h pour accepter/refuser';
  RAISE NOTICE '  4. Si accepté → Dossier assigné';
  RAISE NOTICE '  5. Après vente → Review possible';
END $$;

-- Afficher nombre de tables
SELECT 
  'notaire_profiles' as table_name,
  COUNT(*) as row_count
FROM notaire_profiles
UNION ALL
SELECT 
  'notaire_case_assignments',
  COUNT(*)
FROM notaire_case_assignments
UNION ALL
SELECT 
  'notaire_reviews',
  COUNT(*)
FROM notaire_reviews;
