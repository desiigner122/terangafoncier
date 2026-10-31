-- =============================================
-- CRÉATION DE LA TABLE PROPERTY_PHOTOS
-- Pour stocker les photos des propriétés
-- =============================================

-- 📸 TABLE PHOTOS DE PROPRIÉTÉS
CREATE TABLE IF NOT EXISTS property_photos (
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

-- Fonction pour mettre à jour updated_at (si elle n'existe pas déjà)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER property_photos_updated_at
    BEFORE UPDATE ON property_photos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- POLITIQUES RLS
-- =============================================

ALTER TABLE property_photos ENABLE ROW LEVEL SECURITY;

-- SELECT : Tout le monde peut voir les photos (simplifié)
CREATE POLICY "Public can view property photos"
ON property_photos FOR SELECT
USING (true);

-- SELECT : Les vendeurs peuvent voir leurs propres photos
CREATE POLICY "Vendors can view their photos"
ON property_photos FOR SELECT
TO authenticated
USING (auth.uid() = vendor_id);

-- INSERT : Les vendeurs peuvent ajouter des photos à leurs propriétés
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
