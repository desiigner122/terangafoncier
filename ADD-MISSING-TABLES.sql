-- ============================================
-- AJOUT DES TABLES MANQUANTES UNIQUEMENT
-- ============================================
-- Date: 11 octobre 2025
-- Objectif: Créer uniquement les tables qui n'existent pas encore
-- ============================================

-- ================================================
-- TABLE: OFFERS (si elle n'existe pas)
-- ================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'offers' AND table_schema = 'public') THEN
        CREATE TABLE public.offers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            
            -- Références
            property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
            buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
            
            -- Montant de l'offre
            amount NUMERIC NOT NULL,
            initial_amount NUMERIC,
            
            -- Statut
            status TEXT DEFAULT 'pending',
            
            -- Message et conditions
            message TEXT,
            conditions TEXT,
            financing_type TEXT,
            
            -- Dates
            expires_at TIMESTAMPTZ,
            accepted_at TIMESTAMPTZ,
            rejected_at TIMESTAMPTZ,
            completed_at TIMESTAMPTZ,
            
            -- Notes
            buyer_notes TEXT,
            seller_notes TEXT,
            
            -- Timestamps
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Index pour offers
        CREATE INDEX idx_offers_property ON public.offers(property_id);
        CREATE INDEX idx_offers_buyer ON public.offers(buyer_id);
        CREATE INDEX idx_offers_seller ON public.offers(seller_id);
        CREATE INDEX idx_offers_status ON public.offers(status);
        CREATE INDEX idx_offers_created_at ON public.offers(created_at DESC);

        RAISE NOTICE '✅ Table offers créée';
    ELSE
        RAISE NOTICE '⚠️  Table offers existe déjà';
    END IF;
END $$;

-- ================================================
-- TABLE: DOCUMENTS (si elle n'existe pas)
-- ================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'documents' AND table_schema = 'public') THEN
        CREATE TABLE public.documents (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            
            -- Références
            property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
            owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            
            -- Type de document
            document_type TEXT NOT NULL,
            category TEXT,
            
            -- Informations
            title TEXT NOT NULL,
            description TEXT,
            document_number TEXT,
            
            -- Fichier
            file_url TEXT NOT NULL,
            file_name TEXT,
            file_size BIGINT,
            mime_type TEXT,
            
            -- Vérification
            status TEXT DEFAULT 'pending',
            verified_by UUID REFERENCES public.profiles(id),
            verified_at TIMESTAMPTZ,
            verification_notes TEXT,
            
            -- Dates importantes
            issue_date DATE,
            expiry_date DATE,
            
            -- Sécurité
            is_confidential BOOLEAN DEFAULT false,
            password_protected BOOLEAN DEFAULT false,
            
            -- Timestamps
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            deleted_at TIMESTAMPTZ
        );

        -- Index pour documents
        CREATE INDEX idx_documents_property ON public.documents(property_id);
        CREATE INDEX idx_documents_owner ON public.documents(owner_id);
        CREATE INDEX idx_documents_type ON public.documents(document_type);
        CREATE INDEX idx_documents_status ON public.documents(status);
        CREATE INDEX idx_documents_created_at ON public.documents(created_at DESC);

        RAISE NOTICE '✅ Table documents créée';
    ELSE
        RAISE NOTICE '⚠️  Table documents existe déjà';
    END IF;
END $$;

-- ================================================
-- TABLE: NOTIFICATIONS (si elle n'existe pas)
-- ================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications' AND table_schema = 'public') THEN
        CREATE TABLE public.notifications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            
            -- Destinataire
            user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            
            -- Type et priorité
            type TEXT NOT NULL,
            priority TEXT DEFAULT 'normal',
            
            -- Contenu
            title TEXT NOT NULL,
            message TEXT,
            icon TEXT,
            color TEXT,
            
            -- Données additionnelles
            data JSONB,
            action_url TEXT,
            
            -- État
            read BOOLEAN DEFAULT false,
            read_at TIMESTAMPTZ,
            archived BOOLEAN DEFAULT false,
            archived_at TIMESTAMPTZ,
            
            -- Timestamps
            created_at TIMESTAMPTZ DEFAULT NOW(),
            expires_at TIMESTAMPTZ
        );

        -- Index pour notifications
        CREATE INDEX idx_notifications_user ON public.notifications(user_id);
        CREATE INDEX idx_notifications_read ON public.notifications(read);
        CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
        CREATE INDEX idx_notifications_type ON public.notifications(type);

        RAISE NOTICE '✅ Table notifications créée';
    ELSE
        RAISE NOTICE '⚠️  Table notifications existe déjà';
    END IF;
END $$;

-- ================================================
-- TABLE: FAVORITES (si elle n'existe pas)
-- ================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'favorites' AND table_schema = 'public') THEN
        CREATE TABLE public.favorites (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            
            -- Références
            user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
            property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
            
            -- Notes personnelles
            notes TEXT,
            
            -- Timestamps
            created_at TIMESTAMPTZ DEFAULT NOW(),
            
            UNIQUE(user_id, property_id)
        );

        -- Index pour favorites
        CREATE INDEX idx_favorites_user ON public.favorites(user_id);
        CREATE INDEX idx_favorites_property ON public.favorites(property_id);
        CREATE INDEX idx_favorites_created_at ON public.favorites(created_at DESC);

        RAISE NOTICE '✅ Table favorites créée';
    ELSE
        RAISE NOTICE '⚠️  Table favorites existe déjà';
    END IF;
END $$;

-- ================================================
-- TABLE: PROPERTY_VIEWS (si elle n'existe pas)
-- ================================================

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'property_views' AND table_schema = 'public') THEN
        CREATE TABLE public.property_views (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            
            -- Références
            property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
            viewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
            
            -- Métadonnées
            ip_address INET,
            user_agent TEXT,
            referrer TEXT,
            device_type TEXT,
            
            -- Timestamps
            viewed_at TIMESTAMPTZ DEFAULT NOW()
        );

        -- Index pour property_views
        CREATE INDEX idx_property_views_property ON public.property_views(property_id);
        CREATE INDEX idx_property_views_viewer ON public.property_views(viewer_id);
        CREATE INDEX idx_property_views_date ON public.property_views(viewed_at DESC);

        RAISE NOTICE '✅ Table property_views créée';
    ELSE
        RAISE NOTICE '⚠️  Table property_views existe déjà';
    END IF;
END $$;

-- ================================================
-- FONCTION: Créer trigger updated_at si absent
-- ================================================

CREATE OR REPLACE FUNCTION add_updated_at_trigger(table_name TEXT) 
RETURNS VOID AS $$
DECLARE
    trigger_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE event_object_table = table_name 
        AND trigger_name LIKE '%updated_at%'
    ) INTO trigger_exists;
    
    IF NOT trigger_exists THEN
        EXECUTE format('
            CREATE TRIGGER trigger_update_%I_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW
            EXECUTE FUNCTION update_properties_updated_at()
        ', table_name, table_name);
        
        RAISE NOTICE '✅ Trigger updated_at créé pour %', table_name;
    ELSE
        RAISE NOTICE '⚠️  Trigger updated_at existe déjà pour %', table_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Appliquer les triggers
SELECT add_updated_at_trigger('offers');
SELECT add_updated_at_trigger('documents');

-- ================================================
-- VÉRIFICATION FINALE
-- ================================================

SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as columns,
    (SELECT COUNT(*) FROM information_schema.table_constraints WHERE table_name = t.table_name AND table_schema = 'public') as constraints
FROM information_schema.tables t
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
AND table_name IN ('offers', 'documents', 'notifications', 'favorites', 'property_views')
ORDER BY table_name;
