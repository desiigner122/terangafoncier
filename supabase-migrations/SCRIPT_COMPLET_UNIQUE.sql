-- =============================================
-- SCRIPT COMPLET SUPABASE - TERANGAFONCIER
-- À copier-coller EN ENTIER dans Supabase SQL Editor
-- Durée d'exécution : ~10 secondes
-- =============================================

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- PARTIE 1 : CRÉER LA TABLE PROPERTIES
-- =============================================

-- 🏡 TABLE PROPRIÉTÉS (Version Complète)
DROP TABLE IF EXISTS property_photos CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

CREATE TABLE properties (
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
    documents JSONB DEFAULT '[]', -- Documents associés
    
    -- Caractéristiques et commodités
    features JSONB DEFAULT '{}', -- main_features, utilities, access, zoning details, etc.
    amenities JSONB DEFAULT '[]', -- Proximités avec distances
    
    -- Métadonnées
    metadata JSONB DEFAULT '{}', -- Financement, NFT, documents flags, etc.
    
    -- Blockchain
    blockchain_hash VARCHAR(66),
    blockchain_network VARCHAR(50) DEFAULT 'polygon',
    blockchain_verified BOOLEAN DEFAULT FALSE,
    nft_token_id VARCHAR(100),
    nft_contract_address VARCHAR(42),
    
    -- Vérification
    verification_paid BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES auth.users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT,
    
    -- IA et analyse
    ai_analysis JSONB DEFAULT '{}',
    market_value DECIMAL(15,2),
    ai_quality_score INTEGER,
    
    -- Construction
    construction_year INTEGER,
    last_renovation_year INTEGER,
    energy_rating VARCHAR(10),
    
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
    search_vector TSVECTOR,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- PARTIE 2 : INDEX PROPERTIES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_region ON properties(region);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_surface ON properties(surface);
CREATE INDEX IF NOT EXISTS idx_properties_geom ON properties USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_properties_published_at ON properties(published_at);
CREATE INDEX IF NOT EXISTS idx_properties_features ON properties USING GIN(features);
CREATE INDEX IF NOT EXISTS idx_properties_amenities ON properties USING GIN(amenities);
CREATE INDEX IF NOT EXISTS idx_properties_metadata ON properties USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_properties_search ON properties USING GIN(search_vector);

-- =============================================
-- PARTIE 3 : FONCTIONS TRIGGER PROPERTIES
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
DROP TRIGGER IF EXISTS properties_updated_at ON properties;
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
DROP TRIGGER IF EXISTS properties_search_vector ON properties;
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
DROP TRIGGER IF EXISTS properties_geom ON properties;
CREATE TRIGGER properties_geom
    BEFORE INSERT OR UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_properties_geom();

-- =============================================
-- PARTIE 4 : POLITIQUES RLS PROPERTIES
-- =============================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Supprimer anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public can view active properties" ON properties;
DROP POLICY IF EXISTS "Owners can view their properties" ON properties;
DROP POLICY IF EXISTS "Admins can view all properties" ON properties;
DROP POLICY IF EXISTS "Authenticated users can create properties" ON properties;
DROP POLICY IF EXISTS "Owners can update their properties" ON properties;
DROP POLICY IF EXISTS "Owners can delete their properties" ON properties;

-- SELECT : Tout le monde peut voir les propriétés publiées
CREATE POLICY "Public can view active properties"
ON properties FOR SELECT
USING (published_at IS NOT NULL);

-- SELECT : Les propriétaires peuvent voir leurs propres propriétés
CREATE POLICY "Owners can view their properties"
ON properties FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

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
-- PARTIE 5 : CRÉER LA TABLE PROPERTY_PHOTOS
-- =============================================

-- 📸 TABLE PHOTOS DE PROPRIÉTÉS
CREATE TABLE property_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    caption TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_property_photos_property ON property_photos(property_id);
CREATE INDEX IF NOT EXISTS idx_property_photos_vendor ON property_photos(vendor_id);
CREATE INDEX IF NOT EXISTS idx_property_photos_order ON property_photos(property_id, order_index);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS property_photos_updated_at ON property_photos;
CREATE TRIGGER property_photos_updated_at
    BEFORE UPDATE ON property_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PARTIE 6 : POLITIQUES RLS PROPERTY_PHOTOS
-- =============================================

ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;

-- Supprimer anciennes politiques
DROP POLICY IF EXISTS "Public can view property photos" ON property_photos;
DROP POLICY IF EXISTS "Vendors can view their photos" ON property_photos;
DROP POLICY IF EXISTS "Vendors can insert photos" ON property_photos;
DROP POLICY IF EXISTS "Vendors can update their photos" ON property_photos;
DROP POLICY IF EXISTS "Vendors can delete their photos" ON property_photos;

-- SELECT : Tout le monde peut voir les photos
CREATE POLICY "Public can view property photos"
ON property_photos FOR SELECT
USING (true);

-- INSERT : Les vendeurs peuvent ajouter des photos
CREATE POLICY "Vendors can insert photos"
ON property_photos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = vendor_id);

-- UPDATE : Les vendeurs peuvent modifier leurs photos
CREATE POLICY "Vendors can update their photos"
ON property_photos FOR UPDATE
TO authenticated
USING (auth.uid() = vendor_id)
WITH CHECK (auth.uid() = vendor_id);

-- DELETE : Les vendeurs peuvent supprimer leurs photos
CREATE POLICY "Vendors can delete their photos"
ON property_photos FOR DELETE
TO authenticated
USING (auth.uid() = vendor_id);

-- =============================================
-- PARTIE 7 : POLITIQUES RLS STORAGE
-- =============================================

-- Supprimer anciennes politiques Storage
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view photos" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can upload property photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their property photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update photos" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their property photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete photos" ON storage.objects;
DROP POLICY IF EXISTS "Owners can view their documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can update their documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Vendors can delete their documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;

-- BUCKET: property-photos (Public)
CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-photos');

CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-photos');

CREATE POLICY "Authenticated users can update photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-photos');

CREATE POLICY "Authenticated users can delete photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-photos');

-- BUCKET: property-documents (Privé)
CREATE POLICY "Authenticated users can view documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'property-documents');

CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-documents');

CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-documents');

CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-documents');

-- =============================================
-- VÉRIFICATION FINALE
-- =============================================

-- Vérifier les tables créées
SELECT 
    'TABLES CRÉÉES' as info,
    COUNT(*) as count
FROM information_schema.tables
WHERE table_schema = 'public' 
AND table_name IN ('properties', 'property_photos');

-- Vérifier les colonnes de properties
SELECT 
    'COLONNES PROPERTIES' as info,
    COUNT(*) as count
FROM information_schema.columns
WHERE table_name = 'properties';

-- Vérifier les politiques Storage
SELECT 
    'POLITIQUES STORAGE' as info,
    COUNT(*) as count
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';

-- Message de succès
SELECT '✅ CONFIGURATION TERMINÉE !' as status;
