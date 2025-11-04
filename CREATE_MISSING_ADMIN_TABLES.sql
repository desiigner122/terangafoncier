-- =============================================================
-- Missing admin messaging and participant tables
-- Run this script in the Supabase SQL editor
-- =============================================================

-- Ensure extensions required for UUID generation are available
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- Table: messages_administratifs
-- =============================================================
CREATE TABLE IF NOT EXISTS public.messages_administratifs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destinataire_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_id UUID GENERATED ALWAYS AS (destinataire_id) STORED,
    expediteur JSONB DEFAULT jsonb_build_object(),
    objet TEXT,
    contenu TEXT,
    pieces_jointes JSONB DEFAULT '[]'::jsonb,
    type TEXT DEFAULT 'general',
    priorite TEXT DEFAULT 'normale',
    dossier_ref TEXT,
    statut TEXT DEFAULT 'non_lu',
    archive BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    lu_le TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    CONSTRAINT messages_administratifs_statut_check CHECK (statut IN ('non_lu', 'lu'))
);

CREATE INDEX IF NOT EXISTS messages_administratifs_destinataire_idx
    ON public.messages_administratifs (destinataire_id);
CREATE INDEX IF NOT EXISTS messages_administratifs_created_at_idx
    ON public.messages_administratifs (created_at DESC);
CREATE INDEX IF NOT EXISTS messages_administratifs_archive_idx
    ON public.messages_administratifs (archive);

-- Update helper trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS messages_administratifs_touch_updated_at
    ON public.messages_administratifs;
CREATE TRIGGER messages_administratifs_touch_updated_at
    BEFORE UPDATE ON public.messages_administratifs
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Permissions and RLS
ALTER TABLE public.messages_administratifs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS messages_administratifs_select_self
    ON public.messages_administratifs;
CREATE POLICY messages_administratifs_select_self
    ON public.messages_administratifs
    FOR SELECT USING (
        destinataire_id = auth.uid() OR auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS messages_administratifs_update_self
    ON public.messages_administratifs;
CREATE POLICY messages_administratifs_update_self
    ON public.messages_administratifs
    FOR UPDATE USING (
        destinataire_id = auth.uid() OR auth.role() = 'service_role'
    );

DROP POLICY IF EXISTS messages_administratifs_insert_service
    ON public.messages_administratifs;
CREATE POLICY messages_administratifs_insert_service
    ON public.messages_administratifs
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role'
    );

GRANT SELECT, UPDATE ON public.messages_administratifs TO authenticated;
GRANT SELECT ON public.messages_administratifs TO anon;
GRANT ALL ON public.messages_administratifs TO service_role;

-- =============================================================
-- Table: purchase_case_participants (safety net)
-- =============================================================
CREATE TABLE IF NOT EXISTS public.purchase_case_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.purchase_cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    CONSTRAINT purchase_case_participants_role_check CHECK (role <> '')
);

CREATE INDEX IF NOT EXISTS purchase_case_participants_case_idx
    ON public.purchase_case_participants (case_id);
CREATE INDEX IF NOT EXISTS purchase_case_participants_user_idx
    ON public.purchase_case_participants (user_id);

-- Ensure foreign key toward profiles for PostgREST relationship
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'purchase_case_participants_user_id_profiles_fkey'
          AND table_name = 'purchase_case_participants'
    ) THEN
        ALTER TABLE public.purchase_case_participants
        ADD CONSTRAINT purchase_case_participants_user_id_profiles_fkey
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END$$;

-- Optional helper trigger for updated_at
DROP TRIGGER IF EXISTS purchase_case_participants_touch_updated_at
    ON public.purchase_case_participants;
CREATE TRIGGER purchase_case_participants_touch_updated_at
    BEFORE UPDATE ON public.purchase_case_participants
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

GRANT SELECT ON public.purchase_case_participants TO authenticated;
GRANT SELECT ON public.purchase_case_participants TO anon;
GRANT ALL ON public.purchase_case_participants TO service_role;

ALTER TABLE public.purchase_case_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS purchase_case_participants_select_self
    ON public.purchase_case_participants;
CREATE POLICY purchase_case_participants_select_self
    ON public.purchase_case_participants
    FOR SELECT USING (
        auth.role() = 'service_role'
        OR user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.purchase_cases pc
            WHERE pc.id = purchase_case_participants.case_id
              AND (pc.buyer_id = auth.uid() OR pc.seller_id = auth.uid())
        )
    );

-- =============================================================
-- Compatibility view: case_participants
-- =============================================================
CREATE OR REPLACE VIEW public.case_participants AS
SELECT
    p.id,
    p.case_id,
    p.user_id AS profile_id,
    p.user_id,
    p.role,
    p.status,
    p.metadata,
    p.created_at,
    p.updated_at
FROM public.purchase_case_participants p;

GRANT SELECT ON public.case_participants TO authenticated;
GRANT SELECT ON public.case_participants TO anon;
GRANT ALL ON public.case_participants TO service_role;
