-- Table pour les documents des utilisateurs
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    nom_fichier VARCHAR(255) NOT NULL,
    chemin_fichier TEXT NOT NULL, -- chemin dans Supabase Storage
    taille_fichier BIGINT NOT NULL, -- en bytes
    type_mime VARCHAR(100),
    type_document VARCHAR(50) NOT NULL CHECK (type_document IN ('identite', 'residence', 'financier', 'technique', 'demande', 'autre')),
    description TEXT,
    dossier_reference VARCHAR(100), -- référence vers un dossier (DT-2024-001, PC-2024-007, etc.)
    statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'archive', 'supprime')),
    statut_validation VARCHAR(20) DEFAULT 'en_attente' CHECK (statut_validation IN ('en_attente', 'valide', 'rejete', 'en_revision')),
    commentaire_validation TEXT,
    valide_par UUID REFERENCES auth.users(id),
    date_validation TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb, -- métadonnées additionnelles
    version INTEGER DEFAULT 1,
    document_parent_id UUID REFERENCES user_documents(id), -- pour les versions de documents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les téléchargements de documents (logs)
CREATE TABLE IF NOT EXISTS document_downloads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES user_documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger pour updated_at
CREATE TRIGGER update_user_documents_updated_at 
    BEFORE UPDATE ON user_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON user_documents(type_document);
CREATE INDEX IF NOT EXISTS idx_user_documents_dossier ON user_documents(dossier_reference);
CREATE INDEX IF NOT EXISTS idx_user_documents_statut ON user_documents(statut);
CREATE INDEX IF NOT EXISTS idx_user_documents_created_at ON user_documents(created_at);

CREATE INDEX IF NOT EXISTS idx_document_downloads_document_id ON document_downloads(document_id);
CREATE INDEX IF NOT EXISTS idx_document_downloads_user_id ON document_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_document_downloads_date ON document_downloads(downloaded_at);

-- RLS Policies pour user_documents
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir et gérer leurs propres documents
CREATE POLICY "Users can manage own documents" ON user_documents
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent voir tous les documents
CREATE POLICY "Admins can view all documents" ON user_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

-- Les admins peuvent valider les documents
CREATE POLICY "Admins can validate documents" ON user_documents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

-- RLS Policies pour document_downloads
ALTER TABLE document_downloads ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir leurs propres téléchargements
CREATE POLICY "Users can view own downloads" ON document_downloads
    FOR SELECT USING (auth.uid() = user_id);

-- Insertion automatique lors des téléchargements
CREATE POLICY "Users can log own downloads" ON document_downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent voir tous les téléchargements
CREATE POLICY "Admins can view all downloads" ON document_downloads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

-- Fonction pour créer automatiquement le bucket de documents s'il n'existe pas
CREATE OR REPLACE FUNCTION create_documents_bucket()
RETURNS void AS $$
BEGIN
    -- Créer le bucket s'il n'existe pas
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('documents', 'documents', false)
    ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exécuter la création du bucket
SELECT create_documents_bucket();

-- Politique de stockage pour le bucket documents
CREATE POLICY "Users can upload own documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'documents' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'documents' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Les admins peuvent accéder à tous les documents
CREATE POLICY "Admins can manage all documents" ON storage.objects
    FOR ALL USING (
        bucket_id = 'documents' AND
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

-- Commentaires des tables
COMMENT ON TABLE user_documents IS 'Documents téléchargés par les utilisateurs pour leurs dossiers';
COMMENT ON TABLE document_downloads IS 'Log des téléchargements de documents pour audit';

COMMENT ON COLUMN user_documents.chemin_fichier IS 'Chemin du fichier dans Supabase Storage';
COMMENT ON COLUMN user_documents.dossier_reference IS 'Référence vers un dossier spécifique (DT-2024-001, etc.)';
COMMENT ON COLUMN user_documents.version IS 'Version du document (pour suivi des modifications)';
COMMENT ON COLUMN user_documents.document_parent_id IS 'ID du document parent (pour les versions)';
COMMENT ON COLUMN user_documents.metadata IS 'Métadonnées additionnelles en JSON';