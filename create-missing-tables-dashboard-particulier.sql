-- 📄 CRÉATION TABLES MANQUANTES - DASHBOARD PARTICULIER
-- Script SQL complet pour toutes les tables manquantes du dashboard particulier

-- ========================================
-- 1. TABLE: documents_administratifs
-- ========================================

-- Supprimer si existe
DROP TABLE IF EXISTS public.documents_administratifs CASCADE;

-- Créer la table
CREATE TABLE public.documents_administratifs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations fichier
    file_name TEXT NOT NULL,
    title TEXT,
    description TEXT,
    file_format VARCHAR(10) DEFAULT 'PDF',
    file_size TEXT,
    storage_path TEXT, -- Chemin dans Supabase Storage
    
    -- Métadonnées
    document_type VARCHAR(50) DEFAULT 'autre', -- 'demande', 'identite', 'plan', 'permis', 'candidature', 'financier', 'guide', 'autre'
    case_reference VARCHAR(100), -- Référence du dossier (DT-2024-001, PC-2024-007, etc.)
    status VARCHAR(50) DEFAULT 'En attente', -- 'Validé', 'En vérification', 'Approuvé', 'Incomplet', 'Rejeté', 'Publié'
    priority VARCHAR(20) DEFAULT 'Normale', -- 'Faible', 'Normale', 'Élevée', 'Urgente'
    
    -- Workflow
    workflow_stage VARCHAR(100), -- 'Soumission', 'Vérification identité', 'Validation technique', etc.
    owner_name TEXT, -- Nom du propriétaire du document
    access_level VARCHAR(50) DEFAULT 'Lecture seule', -- 'Public', 'Lecture seule', 'Lecture/Écriture', 'Confidentiel'
    version VARCHAR(20) DEFAULT '1.0',
    
    -- Métadonnées JSON flexibles
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Dates
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT documents_type_check CHECK (document_type IN ('demande', 'identite', 'plan', 'permis', 'candidature', 'financier', 'guide', 'autre')),
    CONSTRAINT documents_status_check CHECK (status IN ('En attente', 'Validé', 'En vérification', 'Approuvé', 'Incomplet', 'Rejeté', 'Publié')),
    CONSTRAINT documents_priority_check CHECK (priority IN ('Faible', 'Normale', 'Élevée', 'Urgente')),
    CONSTRAINT documents_access_check CHECK (access_level IN ('Public', 'Lecture seule', 'Lecture/Écriture', 'Confidentiel'))
);

-- Index pour performances
CREATE INDEX idx_documents_user_id ON public.documents_administratifs(user_id);
CREATE INDEX idx_documents_case_ref ON public.documents_administratifs(case_reference) WHERE case_reference IS NOT NULL;
CREATE INDEX idx_documents_type ON public.documents_administratifs(document_type);
CREATE INDEX idx_documents_status ON public.documents_administratifs(status);
CREATE INDEX idx_documents_created_at ON public.documents_administratifs(created_at DESC);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_documents_updated_at
    BEFORE UPDATE ON public.documents_administratifs
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_updated_at();

-- Commentaires
COMMENT ON TABLE public.documents_administratifs IS 'Documents administratifs des utilisateurs particuliers';
COMMENT ON COLUMN public.documents_administratifs.case_reference IS 'Référence du dossier associé (DT-xxx, PC-xxx, etc.)';
COMMENT ON COLUMN public.documents_administratifs.storage_path IS 'Chemin du fichier dans Supabase Storage';

-- ========================================
-- 2. TABLE: security_logs
-- ========================================

-- Supprimer si existe
DROP TABLE IF EXISTS public.security_logs CASCADE;

-- Créer la table
CREATE TABLE public.security_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Informations action
    action TEXT NOT NULL, -- 'Connexion réussie', 'Modification du profil', 'Tentative de connexion', etc.
    action_type VARCHAR(50) DEFAULT 'auth', -- 'auth', 'profile', 'document', 'settings', 'data'
    status VARCHAR(20) DEFAULT 'success', -- 'success', 'failed', 'warning', 'info'
    
    -- Informations contexte
    device TEXT, -- 'Chrome sur Windows', 'Mobile App', 'Firefox sur Mac'
    location TEXT, -- 'Dakar, Sénégal', 'Thiès, Sénégal'
    ip_address INET,
    user_agent TEXT,
    
    -- Détails additionnels
    details JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    
    -- Date
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Contraintes
    CONSTRAINT security_logs_status_check CHECK (status IN ('success', 'failed', 'warning', 'info')),
    CONSTRAINT security_logs_action_type_check CHECK (action_type IN ('auth', 'profile', 'document', 'settings', 'data', 'other'))
);

-- Index pour performances
CREATE INDEX idx_security_logs_user_id ON public.security_logs(user_id);
CREATE INDEX idx_security_logs_created_at ON public.security_logs(created_at DESC);
CREATE INDEX idx_security_logs_action_type ON public.security_logs(action_type);
CREATE INDEX idx_security_logs_status ON public.security_logs(status);

-- Commentaires
COMMENT ON TABLE public.security_logs IS 'Logs de sécurité et d\'activité des utilisateurs';
COMMENT ON COLUMN public.security_logs.action IS 'Description de l\'action effectuée';
COMMENT ON COLUMN public.security_logs.ip_address IS 'Adresse IP de l\'utilisateur';

-- ========================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Activer RLS sur documents_administratifs
ALTER TABLE public.documents_administratifs ENABLE ROW LEVEL SECURITY;

-- Policy 1: Les utilisateurs peuvent voir leurs propres documents
CREATE POLICY "users_view_own_documents" ON public.documents_administratifs
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy 2: Les utilisateurs peuvent créer leurs propres documents
CREATE POLICY "users_create_own_documents" ON public.documents_administratifs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Les utilisateurs peuvent modifier leurs propres documents
CREATE POLICY "users_update_own_documents" ON public.documents_administratifs
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Les utilisateurs peuvent supprimer leurs propres documents
CREATE POLICY "users_delete_own_documents" ON public.documents_administratifs
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy 5: Admin a accès complet aux documents
CREATE POLICY "admin_full_access_documents" ON public.documents_administratifs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' IN ('admin', 'agent_foncier', 'Admin', 'Agent Foncier')
        )
    );

-- Activer RLS sur security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Policy 1: Les utilisateurs peuvent voir leurs propres logs
CREATE POLICY "users_view_own_logs" ON public.security_logs
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy 2: Système peut créer des logs pour tous
CREATE POLICY "system_create_logs" ON public.security_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true); -- Tout utilisateur authentifié peut créer des logs

-- Policy 3: Admin a accès complet aux logs
CREATE POLICY "admin_full_access_logs" ON public.security_logs
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' IN ('admin', 'agent_foncier', 'Admin', 'Agent Foncier')
        )
    );

-- ========================================
-- 4. DONNÉES DE TEST
-- ========================================

-- Insérer des documents de test pour l'utilisateur par défaut
INSERT INTO public.documents_administratifs (
    user_id,
    file_name,
    title,
    description,
    document_type,
    case_reference,
    status,
    priority,
    workflow_stage,
    owner_name,
    access_level,
    file_size,
    file_format
) VALUES 
(
    '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'::UUID,
    'demande_terrain_communal.pdf',
    'Demande initiale terrain communal',
    'Formulaire de demande de terrain communal dûment rempli et signé',
    'demande',
    'DT-2024-001',
    'Validé',
    'Normale',
    'Soumission',
    'Système',
    'Lecture seule',
    '2.3 MB',
    'PDF'
),
(
    '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'::UUID,
    'copie_cni_certifiee.pdf',
    'Copie CNI certifiée conforme',
    'Copie de la carte d''identité nationale certifiée conforme',
    'identite',
    'DT-2024-001',
    'En vérification',
    'Élevée',
    'Vérification identité',
    'Citoyen',
    'Lecture/Écriture',
    '850 KB',
    'PDF'
),
(
    '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'::UUID,
    'plan_situation_terrain.pdf',
    'Plan de situation du terrain',
    'Plan cadastral avec délimitation précise du terrain demandé',
    'plan',
    'DT-2024-001',
    'Approuvé',
    'Élevée',
    'Validation technique',
    'Commission Technique',
    'Lecture seule',
    '4.2 MB',
    'PDF'
)
ON CONFLICT DO NOTHING;

-- Insérer des logs de sécurité de test
INSERT INTO public.security_logs (
    user_id,
    action,
    action_type,
    status,
    device,
    location
) VALUES 
(
    '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'::UUID,
    'Connexion réussie',
    'auth',
    'success',
    'Chrome sur Windows',
    'Dakar, Sénégal'
),
(
    '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'::UUID,
    'Modification du profil',
    'profile',
    'success',
    'Mobile App',
    'Dakar, Sénégal'
)
ON CONFLICT DO NOTHING;

-- ========================================
-- 5. VÉRIFICATION FINALE
-- ========================================

DO $$
DECLARE
    doc_count INTEGER;
    log_count INTEGER;
BEGIN
    -- Compter les documents
    SELECT COUNT(*) INTO doc_count FROM public.documents_administratifs;
    
    -- Compter les logs
    SELECT COUNT(*) INTO log_count FROM public.security_logs;
    
    -- Afficher les résultats
    RAISE NOTICE '✅ Tables créées avec succès !';
    RAISE NOTICE '📄 Documents administratifs : % lignes', doc_count;
    RAISE NOTICE '🔒 Security logs : % lignes', log_count;
    RAISE NOTICE '';
    RAISE NOTICE '🔐 RLS Policies actives :';
    RAISE NOTICE '  - documents_administratifs : % policies', (
        SELECT COUNT(*) FROM pg_policies 
        WHERE tablename = 'documents_administratifs'
    );
    RAISE NOTICE '  - security_logs : % policies', (
        SELECT COUNT(*) FROM pg_policies 
        WHERE tablename = 'security_logs'
    );
END
$$;

-- Requête finale de vérification
SELECT 
    'SUCCÈS - Tables créées et sécurisées !' as status,
    (SELECT COUNT(*) FROM public.documents_administratifs) as total_documents,
    (SELECT COUNT(*) FROM public.security_logs) as total_logs,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'documents_administratifs') as policies_documents,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'security_logs') as policies_logs;
