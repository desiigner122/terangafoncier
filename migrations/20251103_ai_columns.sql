/**
 * @file 20251103_ai_columns.sql
 * @description Ajout colonnes IA pour documents, cases et propriétés
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

-- ================================================================
-- AJOUT COLONNES IA - DOCUMENTS
-- ================================================================

-- Colonnes validation IA pour documents
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS ai_validation_status VARCHAR(20) DEFAULT 'not_validated',
ADD COLUMN IF NOT EXISTS ai_validation_score DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS ai_validation_issues JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS ai_validated_at TIMESTAMPTZ;

-- Contrainte validation_status
ALTER TABLE documents
ADD CONSTRAINT IF NOT EXISTS valid_ai_validation_status 
CHECK (ai_validation_status IN ('valid', 'invalid', 'pending', 'warning', 'not_validated'));

-- Index pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_documents_ai_validation_status 
ON documents(ai_validation_status);

CREATE INDEX IF NOT EXISTS idx_documents_ai_validated_at 
ON documents(ai_validated_at DESC);

COMMENT ON COLUMN documents.ai_validation_status IS 'Statut validation IA: valid, invalid, pending, warning, not_validated';
COMMENT ON COLUMN documents.ai_validation_score IS 'Score de confiance IA (0-100)';
COMMENT ON COLUMN documents.ai_validation_issues IS 'Array JSON des problèmes détectés par IA';
COMMENT ON COLUMN documents.ai_validated_at IS 'Date de dernière validation IA';

-- ================================================================
-- AJOUT COLONNES IA - PURCHASE_CASES
-- ================================================================

-- Colonnes validation documents et fraude
ALTER TABLE purchase_cases
ADD COLUMN IF NOT EXISTS ai_documents_validated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ai_documents_score DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS ai_documents_valid_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_documents_total_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS fraud_risk_score DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS fraud_flags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS fraud_analyzed_at TIMESTAMPTZ;

-- Index pour recherches fraude
CREATE INDEX IF NOT EXISTS idx_purchase_cases_fraud_risk_score 
ON purchase_cases(fraud_risk_score DESC);

CREATE INDEX IF NOT EXISTS idx_purchase_cases_fraud_analyzed_at 
ON purchase_cases(fraud_analyzed_at DESC);

CREATE INDEX IF NOT EXISTS idx_purchase_cases_ai_documents_validated 
ON purchase_cases(ai_documents_validated);

COMMENT ON COLUMN purchase_cases.ai_documents_validated IS 'Tous les documents validés par IA';
COMMENT ON COLUMN purchase_cases.ai_documents_score IS 'Score moyen de confiance documents (0-100)';
COMMENT ON COLUMN purchase_cases.ai_documents_valid_count IS 'Nombre de documents valides';
COMMENT ON COLUMN purchase_cases.ai_documents_total_count IS 'Nombre total de documents';
COMMENT ON COLUMN purchase_cases.fraud_risk_score IS 'Score de risque de fraude (0-100)';
COMMENT ON COLUMN purchase_cases.fraud_flags IS 'Array JSON des alertes de fraude détectées';
COMMENT ON COLUMN purchase_cases.fraud_analyzed_at IS 'Date de dernière analyse de fraude';

-- ================================================================
-- AJOUT COLONNES IA - PROPERTIES
-- ================================================================

-- Colonnes évaluation prix IA
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS ai_estimated_price DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS ai_price_confidence DECIMAL(5, 2),
ADD COLUMN IF NOT EXISTS ai_price_range_min DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS ai_price_range_max DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS ai_evaluated_at TIMESTAMPTZ;

-- Index pour recherches prix IA
CREATE INDEX IF NOT EXISTS idx_properties_ai_estimated_price 
ON properties(ai_estimated_price);

CREATE INDEX IF NOT EXISTS idx_properties_ai_evaluated_at 
ON properties(ai_evaluated_at DESC);

COMMENT ON COLUMN properties.ai_estimated_price IS 'Prix estimé par IA (FCFA)';
COMMENT ON COLUMN properties.ai_price_confidence IS 'Niveau de confiance estimation (0-100)';
COMMENT ON COLUMN properties.ai_price_range_min IS 'Prix minimum fourchette IA (FCFA)';
COMMENT ON COLUMN properties.ai_price_range_max IS 'Prix maximum fourchette IA (FCFA)';
COMMENT ON COLUMN properties.ai_evaluated_at IS 'Date de dernière évaluation IA';

-- ================================================================
-- FONCTION: Calculer score global documents d'un cas
-- ================================================================

CREATE OR REPLACE FUNCTION calculate_case_documents_ai_score(case_id_param UUID)
RETURNS TABLE (
  valid_count INTEGER,
  total_count INTEGER,
  average_score DECIMAL(5, 2),
  all_validated BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE ai_validation_status = 'valid')::INTEGER AS valid_count,
    COUNT(*)::INTEGER AS total_count,
    ROUND(AVG(ai_validation_score)::NUMERIC, 2) AS average_score,
    BOOL_AND(ai_validation_status IN ('valid', 'warning')) AS all_validated
  FROM documents
  WHERE case_id = case_id_param
    AND status IN ('uploaded', 'verified')
    AND ai_validation_status != 'not_validated';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION calculate_case_documents_ai_score IS 'Calcule statistiques validation IA pour tous documents d''un cas';

-- ================================================================
-- TRIGGER: Auto-update case stats après validation document
-- ================================================================

CREATE OR REPLACE FUNCTION update_case_ai_stats_on_document_validation()
RETURNS TRIGGER AS $$
DECLARE
  stats_record RECORD;
BEGIN
  -- Recalculer stats du cas
  SELECT * INTO stats_record
  FROM calculate_case_documents_ai_score(NEW.case_id);

  -- Mettre à jour purchase_cases
  UPDATE purchase_cases
  SET 
    ai_documents_valid_count = stats_record.valid_count,
    ai_documents_total_count = stats_record.total_count,
    ai_documents_score = stats_record.average_score,
    ai_documents_validated = stats_record.all_validated,
    updated_at = NOW()
  WHERE id = NEW.case_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer trigger
DROP TRIGGER IF EXISTS trigger_update_case_ai_stats ON documents;

CREATE TRIGGER trigger_update_case_ai_stats
AFTER INSERT OR UPDATE OF ai_validation_status, ai_validation_score
ON documents
FOR EACH ROW
WHEN (NEW.case_id IS NOT NULL)
EXECUTE FUNCTION update_case_ai_stats_on_document_validation();

COMMENT ON TRIGGER trigger_update_case_ai_stats ON documents IS 
'Auto-update stats IA du cas après validation document';

-- ================================================================
-- FONCTION: Obtenir cas à haut risque de fraude
-- ================================================================

CREATE OR REPLACE FUNCTION get_high_risk_fraud_cases(
  risk_threshold DECIMAL DEFAULT 60,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  case_id UUID,
  fraud_risk_score DECIMAL(5, 2),
  fraud_flags JSONB,
  buyer_name TEXT,
  seller_name TEXT,
  property_title TEXT,
  analyzed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pc.id AS case_id,
    pc.fraud_risk_score,
    pc.fraud_flags,
    buyer.full_name AS buyer_name,
    seller.full_name AS seller_name,
    p.title AS property_title,
    pc.fraud_analyzed_at AS analyzed_at
  FROM purchase_cases pc
  LEFT JOIN profiles buyer ON pc.buyer_id = buyer.id
  LEFT JOIN profiles seller ON pc.seller_id = seller.id
  LEFT JOIN properties p ON pc.property_id = p.id
  WHERE pc.fraud_risk_score >= risk_threshold
    AND pc.fraud_analyzed_at IS NOT NULL
  ORDER BY pc.fraud_risk_score DESC, pc.fraud_analyzed_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_high_risk_fraud_cases IS 'Retourne cas avec score fraude >= threshold (défaut 60)';

-- ================================================================
-- RLS: Accès données IA
-- ================================================================

-- Documents: Tout le monde voit ai_validation_status de ses propres documents
-- (RLS déjà configuré sur table documents)

-- Purchase_cases: Notaires et admins voient fraud_risk_score
-- (RLS déjà configuré sur table purchase_cases)

-- Properties: Tout le monde voit ai_estimated_price
-- (Propriétés publiques)

-- ================================================================
-- VUES: Statistiques IA
-- ================================================================

-- Vue: Stats validation documents par cas
CREATE OR REPLACE VIEW ai_documents_stats_by_case AS
SELECT 
  pc.id AS case_id,
  pc.status AS case_status,
  COUNT(d.id) AS total_documents,
  COUNT(d.id) FILTER (WHERE d.ai_validation_status = 'valid') AS valid_documents,
  COUNT(d.id) FILTER (WHERE d.ai_validation_status = 'invalid') AS invalid_documents,
  COUNT(d.id) FILTER (WHERE d.ai_validation_status = 'pending') AS pending_documents,
  COUNT(d.id) FILTER (WHERE d.ai_validation_status = 'warning') AS warning_documents,
  COUNT(d.id) FILTER (WHERE d.ai_validation_status = 'not_validated') AS not_validated_documents,
  ROUND(AVG(d.ai_validation_score)::NUMERIC, 2) AS avg_validation_score,
  pc.ai_documents_validated AS all_validated,
  pc.created_at AS case_created_at
FROM purchase_cases pc
LEFT JOIN documents d ON d.case_id = pc.id
GROUP BY pc.id, pc.status, pc.ai_documents_validated, pc.created_at;

COMMENT ON VIEW ai_documents_stats_by_case IS 'Statistiques validation IA documents par cas';

-- Vue: Stats fraude globales
CREATE OR REPLACE VIEW fraud_detection_stats AS
SELECT 
  COUNT(*) AS total_analyzed,
  COUNT(*) FILTER (WHERE fraud_risk_score >= 80) AS critical_risk,
  COUNT(*) FILTER (WHERE fraud_risk_score >= 60 AND fraud_risk_score < 80) AS high_risk,
  COUNT(*) FILTER (WHERE fraud_risk_score >= 30 AND fraud_risk_score < 60) AS medium_risk,
  COUNT(*) FILTER (WHERE fraud_risk_score < 30) AS low_risk,
  ROUND(AVG(fraud_risk_score)::NUMERIC, 2) AS avg_risk_score,
  COUNT(*) FILTER (WHERE jsonb_array_length(fraud_flags) > 0) AS cases_with_flags,
  SUM(jsonb_array_length(fraud_flags))::INTEGER AS total_flags,
  MAX(fraud_analyzed_at) AS last_analysis_at
FROM purchase_cases
WHERE fraud_analyzed_at IS NOT NULL;

COMMENT ON VIEW fraud_detection_stats IS 'Statistiques globales détection fraude';

-- Vue: Stats évaluation prix IA
CREATE OR REPLACE VIEW ai_price_evaluation_stats AS
SELECT 
  COUNT(*) AS total_evaluated,
  ROUND(AVG(ai_price_confidence)::NUMERIC, 2) AS avg_confidence,
  COUNT(*) FILTER (WHERE ai_price_confidence >= 90) AS very_high_confidence,
  COUNT(*) FILTER (WHERE ai_price_confidence >= 75 AND ai_price_confidence < 90) AS high_confidence,
  COUNT(*) FILTER (WHERE ai_price_confidence >= 60 AND ai_price_confidence < 75) AS medium_confidence,
  COUNT(*) FILTER (WHERE ai_price_confidence < 60) AS low_confidence,
  ROUND(AVG(CASE 
    WHEN price > 0 AND ai_estimated_price > 0 
    THEN ABS((price - ai_estimated_price) / ai_estimated_price * 100)
    ELSE NULL
  END)::NUMERIC, 2) AS avg_price_difference_percent,
  MAX(ai_evaluated_at) AS last_evaluation_at
FROM properties
WHERE ai_evaluated_at IS NOT NULL;

COMMENT ON VIEW ai_price_evaluation_stats IS 'Statistiques globales évaluation prix IA';

-- ================================================================
-- GRANTS: Permissions
-- ================================================================

-- Fonctions accessibles par authenticated users
GRANT EXECUTE ON FUNCTION calculate_case_documents_ai_score TO authenticated;
GRANT EXECUTE ON FUNCTION get_high_risk_fraud_cases TO authenticated;

-- Vues accessibles par authenticated users
GRANT SELECT ON ai_documents_stats_by_case TO authenticated;
GRANT SELECT ON fraud_detection_stats TO authenticated;
GRANT SELECT ON ai_price_evaluation_stats TO authenticated;

-- ================================================================
-- DONNÉES DE TEST (optionnel)
-- ================================================================

-- Exemple: Marquer un document comme validé par IA
-- UPDATE documents
-- SET 
--   ai_validation_status = 'valid',
--   ai_validation_score = 92.5,
--   ai_validation_issues = '[]'::jsonb,
--   ai_validated_at = NOW()
-- WHERE id = 'document-id-here';

-- Exemple: Marquer un cas comme analysé pour fraude
-- UPDATE purchase_cases
-- SET 
--   fraud_risk_score = 25,
--   fraud_flags = '[]'::jsonb,
--   fraud_analyzed_at = NOW()
-- WHERE id = 'case-id-here';

-- Exemple: Ajouter évaluation prix IA
-- UPDATE properties
-- SET 
--   ai_estimated_price = 48000000,
--   ai_price_confidence = 87,
--   ai_price_range_min = 45000000,
--   ai_price_range_max = 51000000,
--   ai_evaluated_at = NOW()
-- WHERE id = 'property-id-here';

-- ================================================================
-- FIN MIGRATION
-- ================================================================
