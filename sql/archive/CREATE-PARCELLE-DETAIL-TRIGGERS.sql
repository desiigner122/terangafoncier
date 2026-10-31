-- ============================================================================
-- PARCELLE DETAIL PAGE - TRIGGERS ET OPTIMISATIONS
-- ============================================================================
-- Ce script ajoute les triggers pour maintenir les compteurs et les indexes

-- 1. TRIGGER pour incrémenter les vues
-- ============================================================================

CREATE OR REPLACE FUNCTION increment_property_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE properties 
  SET views_count = views_count + 1
  WHERE id = NEW.property_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_increment_views ON property_views;
CREATE TRIGGER trigger_increment_views
  AFTER INSERT ON property_views
  FOR EACH ROW
  EXECUTE FUNCTION increment_property_views();

-- 2. TRIGGER pour incrémenter les favoris
-- ============================================================================

CREATE OR REPLACE FUNCTION update_property_favorites()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties 
    SET favorites_count = favorites_count + 1
    WHERE id = NEW.property_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties 
    SET favorites_count = GREATEST(0, favorites_count - 1)
    WHERE id = OLD.property_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_favorites ON favorites;
CREATE TRIGGER trigger_update_favorites
  AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_property_favorites();

-- 3. TRIGGER pour incrémenter les demandes de contact
-- ============================================================================

CREATE OR REPLACE FUNCTION update_property_contact_requests()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE properties 
    SET contact_requests_count = contact_requests_count + 1
    WHERE id = NEW.property_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE properties 
    SET contact_requests_count = GREATEST(0, contact_requests_count - 1)
    WHERE id = OLD.property_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_contact_requests ON contact_requests;
CREATE TRIGGER trigger_update_contact_requests
  AFTER INSERT OR DELETE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_property_contact_requests();

-- 4. TRIGGER pour générer automatiquement le slug
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_property_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL AND NEW.title IS NOT NULL THEN
    NEW.slug := LOWER(
      REGEXP_REPLACE(
        REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+',
        '-',
        'g'
      )
    ) || '-' || SUBSTRING(NEW.id::TEXT, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_slug ON properties;
CREATE TRIGGER trigger_generate_slug
  BEFORE INSERT OR UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION generate_property_slug();

-- 5. TRIGGER pour mettre à jour la date de modification
-- ============================================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_timestamp_documents ON property_documents;
CREATE TRIGGER trigger_update_timestamp_documents
  BEFORE UPDATE ON property_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_timestamp_financing ON property_financing_options;
CREATE TRIGGER trigger_update_timestamp_financing
  BEFORE UPDATE ON property_financing_options
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_timestamp_blockchain ON property_blockchain_records;
CREATE TRIGGER trigger_update_timestamp_blockchain
  BEFORE UPDATE ON property_blockchain_records
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

DROP TRIGGER IF EXISTS trigger_update_timestamp_contacts ON contact_requests;
CREATE TRIGGER trigger_update_timestamp_contacts
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();

-- 6. VIEW pour obtenir les statistiques de propriété
-- ============================================================================

CREATE OR REPLACE VIEW property_statistics AS
SELECT 
  p.id,
  p.title,
  p.price,
  p.surface,
  p.views_count,
  p.favorites_count,
  p.contact_requests_count,
  COALESCE(f.favorite_users, 0) AS favorite_users_count,
  COALESCE(cr.recent_contacts, 0) AS recent_contacts_count,
  (p.views_count * 0.1 + p.favorites_count * 0.5 + p.contact_requests_count * 0.8) AS engagement_score,
  DATE_PART('day', NOW() - p.created_at)::INT AS days_on_market
FROM properties p
LEFT JOIN (
  SELECT property_id, COUNT(*) AS favorite_users
  FROM favorites
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY property_id
) f ON p.id = f.property_id
LEFT JOIN (
  SELECT property_id, COUNT(*) AS recent_contacts
  FROM contact_requests
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY property_id
) cr ON p.id = cr.property_id;

-- 7. VIEW pour les propriétés avec métadonnées complètes
-- ============================================================================

CREATE OR REPLACE VIEW properties_with_details AS
SELECT 
  p.id,
  p.title,
  p.price,
  p.surface,
  p.location,
  p.city,
  p.region,
  p.status,
  p.verification_status,
  p.blockchain_verified,
  p.nft_token_id,
  p.owner_id,
  pr.full_name AS owner_name,
  pr.email AS owner_email,
  pr.role AS owner_role,
  p.views_count,
  p.favorites_count,
  p.contact_requests_count,
  p.created_at,
  p.updated_at
FROM properties p
LEFT JOIN profiles pr ON p.owner_id = pr.id;

-- 8. FONCTION pour incrémenter les vues d'une propriété
-- ============================================================================

CREATE OR REPLACE FUNCTION track_property_view(
  p_property_id UUID,
  p_viewer_id UUID DEFAULT NULL,
  p_viewer_ip INET DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_view_id UUID;
BEGIN
  INSERT INTO property_views (property_id, viewer_id, viewer_ip_address)
  VALUES (p_property_id, p_viewer_id, p_viewer_ip)
  RETURNING id INTO v_view_id;
  
  RETURN v_view_id;
END;
$$ LANGUAGE plpgsql;

-- 9. FONCTION pour obtenir les propriétés recommandées
-- ============================================================================

CREATE OR REPLACE FUNCTION get_recommended_properties(
  p_limit INT DEFAULT 10,
  p_min_rating DECIMAL DEFAULT 8.0
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  price BIGINT,
  surface INT,
  location VARCHAR,
  ai_score DECIMAL,
  engagement_score NUMERIC,
  days_on_market INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.price,
    p.surface,
    p.location,
    p.ai_score,
    (p.views_count * 0.1 + p.favorites_count * 0.5 + p.contact_requests_count * 0.8)::NUMERIC,
    DATE_PART('day', NOW() - p.created_at)::INT
  FROM properties p
  WHERE p.status = 'published'
    AND p.verification_status = 'verified'
    AND p.ai_score >= p_min_rating
  ORDER BY engagement_score DESC, p.ai_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 10. FONCTION pour chercher les propriétés avec filtres
-- ============================================================================

CREATE OR REPLACE FUNCTION search_properties(
  p_search_term VARCHAR DEFAULT NULL,
  p_min_price BIGINT DEFAULT NULL,
  p_max_price BIGINT DEFAULT NULL,
  p_min_surface INT DEFAULT NULL,
  p_city VARCHAR DEFAULT NULL,
  p_region VARCHAR DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title VARCHAR,
  price BIGINT,
  surface INT,
  location VARCHAR,
  city VARCHAR,
  region VARCHAR,
  status VARCHAR,
  views_count INT,
  favorites_count INT,
  contact_requests_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.price,
    p.surface,
    p.location,
    p.city,
    p.region,
    p.status,
    p.views_count,
    p.favorites_count,
    p.contact_requests_count
  FROM properties p
  WHERE (p_search_term IS NULL OR 
         p.title ILIKE '%' || p_search_term || '%' OR
         p.location ILIKE '%' || p_search_term || '%' OR
         p.description ILIKE '%' || p_search_term || '%')
    AND (p_min_price IS NULL OR p.price >= p_min_price)
    AND (p_max_price IS NULL OR p.price <= p_max_price)
    AND (p_min_surface IS NULL OR p.surface >= p_min_surface)
    AND (p_city IS NULL OR p.city ILIKE p_city)
    AND (p_region IS NULL OR p.region ILIKE p_region)
    AND p.status = 'published'
  ORDER BY p.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PERMISSIONS ET ACCÈS
-- ============================================================================

-- Donner les permissions d'accès public pour les lectures
GRANT SELECT ON properties_with_details TO PUBLIC;
GRANT SELECT ON property_statistics TO PUBLIC;

-- Donner les permissions d'accès à la fonction de suivi
GRANT EXECUTE ON FUNCTION track_property_view TO PUBLIC;
GRANT EXECUTE ON FUNCTION get_recommended_properties TO PUBLIC;
GRANT EXECUTE ON FUNCTION search_properties TO PUBLIC;

-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
