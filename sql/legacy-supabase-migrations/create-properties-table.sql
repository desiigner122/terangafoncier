-- =============================================
-- CRÉATION DE LA TABLE PROPERTIES
-- Pour TerangaFoncier - Ajout de terrains par vendeurs
-- =============================================

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Supprimer la table si elle existe (ATTENTION: supprime les données)
-- DROP TABLE IF EXISTS properties CASCADE;

-- 🏡 TABLE PROPRIÉTÉS (Version Complète)
CREATE TABLE IF NOT EXISTS properties (
    -- IDs et références
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations de base
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL CHECK (property_type IN ('terrain', 'maison', 'appartement', 'commerce', 'industriel', 'agricole')),
    type VARCHAR(100), -- Type de terrain : Résidentiel, Commercial, Agricole, Industriel, Mixte
    
    -- Statut
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'sold', 'reserved', 'suspended', 'pending', 'rejected')),
    verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in_progress', 'verified', 'rejected')),
    
    -- Prix et surface
    price DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'XOF',
    surface DECIMAL(10,2), -- en m²
    surface_unit VARCHAR(10) DEFAULT 'm²',
    
    -- Localisation
    location TEXT NOT NULL,
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    postal_code VARCHAR(10),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    nearby_landmarks JSONB DEFAULT '[]', -- Points d'intérêt à proximité
    geom GEOMETRY(POINT, 4326), -- PostGIS pour géolocalisation
    
    -- Caractéristiques terrain
    zoning VARCHAR(50), -- R1, R2, R3, R4, C, I, A, M
    buildable_ratio DECIMAL(3,2), -- Coefficient d'emprise au sol (0-1)
    max_floors INTEGER, -- Nombre d'étages maximum
    land_registry_ref VARCHAR(100), -- Référence cadastrale
    title_deed_number VARCHAR(100), -- Numéro titre foncier
    legal_status VARCHAR(100), -- Titre Foncier, Bail, Concession, etc.
    
    -- Médias
    images JSONB DEFAULT '[]', -- URLs des images
    documents JSONB DEFAULT '[]', -- Documents associés (titre foncier, plan de bornage, etc.)
    
    -- Caractéristiques et commodités
    features JSONB DEFAULT '{}', -- main_features, utilities, access, zoning details, etc.
    amenities JSONB DEFAULT '[]', -- Proximités (école, hôpital, etc.) avec distances
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}', -- Financement, NFT, documents flags, etc.
    
    -- Blockchain
    blockchain_hash VARCHAR(66), -- Hash de la transaction blockchain
    blockchain_network VARCHAR(50) DEFAULT 'polygon',
    blockchain_verified BOOLEAN DEFAULT FALSE,
    nft_token_id VARCHAR(100), -- ID du NFT si tokenisé
    nft_contract_address VARCHAR(42), -- Adresse du contrat NFT
    
    -- Vérification
    verification_paid BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT,
    
    -- IA et analyse
    ai_analysis JSONB DEFAULT '{}', -- Analyse IA du bien
    market_value DECIMAL(15,2), -- Valeur estimée par IA
    ai_quality_score INTEGER, -- Score qualité annonce (0-100)
    
    -- Construction (si applicable)
    construction_year INTEGER,
    last_renovation_year INTEGER,
    energy_rating VARCHAR(10), -- DPE si applicable
    
    -- Statistiques
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    contact_requests_count INTEGER DEFAULT 0,
    
    -- Promotion
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMP,
    published_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Recherche full-text
    search_vector TSVECTOR, -- Pour recherche textuelle
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEX POUR PERFORMANCES
-- =============================================

-- Index sur owner_id pour trouver les propriétés d'un vendeur
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);

-- Index sur status et verification_status
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status, verification_status);

-- Index sur property_type
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);

-- Index sur city et region pour recherche par localisation
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);

-- Index sur price pour tri et filtrage
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);

-- Index sur surface pour tri et filtrage
CREATE INDEX IF NOT EXISTS idx_properties_surface ON properties(surface);

-- Index spatial pour recherche géographique
CREATE INDEX IF NOT EXISTS idx_properties_geom ON properties USING GIST(geom);

-- Index sur published_at pour tri chronologique
CREATE INDEX IF NOT EXISTS idx_properties_published_at ON properties(published_at DESC NULLS LAST);

-- Index GIN pour recherche dans JSONB
CREATE INDEX IF NOT EXISTS idx_properties_features ON properties USING GIN(features);
CREATE INDEX IF NOT EXISTS idx_properties_amenities ON properties USING GIN(amenities);
CREATE INDEX IF NOT EXISTS idx_properties_metadata ON properties USING GIN(metadata);

-- Index pour recherche full-text
CREATE INDEX IF NOT EXISTS idx_properties_search ON properties USING GIN(search_vector);

-- =============================================
-- TRIGGER POUR MISE À JOUR AUTOMATIQUE
-- =============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur UPDATE
CREATE TRIGGER properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_updated_at();

-- Fonction pour générer le vecteur de recherche
CREATE OR REPLACE FUNCTION update_properties_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('french', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('french', COALESCE(NEW.description, '')), 'B') ||
        setweight(to_tsvector('french', COALESCE(NEW.city, '')), 'C') ||
        setweight(to_tsvector('french', COALESCE(NEW.region, '')), 'C') ||
        setweight(to_tsvector('french', COALESCE(NEW.address, '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour search_vector
CREATE TRIGGER properties_search_vector
    BEFORE INSERT OR UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_search_vector();

-- Fonction pour mettre à jour la géométrie PostGIS
CREATE OR REPLACE FUNCTION update_properties_geom()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.geom := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour geom
CREATE TRIGGER properties_geom
    BEFORE INSERT OR UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_geom();

-- =============================================
-- POLITIQUES RLS (Row Level Security)
-- =============================================

-- Activer RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- SELECT : Tout le monde peut voir les propriétés actives et vérifiées
CREATE POLICY "Public can view active properties"
ON properties FOR SELECT
USING (
    status = 'active' 
    AND verification_status = 'verified'
    AND published_at IS NOT NULL
);

-- SELECT : Les propriétaires peuvent voir leurs propres propriétés
CREATE POLICY "Owners can view their properties"
ON properties FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

-- SELECT : Les admins peuvent tout voir
CREATE POLICY "Admins can view all properties"
ON properties FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- INSERT : Utilisateurs authentifiés peuvent créer des propriétés
CREATE POLICY "Authenticated users can create properties"
ON properties FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

-- UPDATE : Les propriétaires peuvent modifier leurs propriétés
CREATE POLICY "Owners can update their properties"
ON properties FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- DELETE : Les propriétaires peuvent supprimer leurs propriétés
CREATE POLICY "Owners can delete their properties"
ON properties FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- =============================================
-- VÉRIFICATION
-- =============================================

-- Afficher la structure de la table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'properties'
ORDER BY ordinal_position;

-- Compter les propriétés
SELECT COUNT(*) as total_properties FROM properties;
