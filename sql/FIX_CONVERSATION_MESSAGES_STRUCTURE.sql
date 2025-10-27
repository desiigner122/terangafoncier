-- ============================================
-- FIX CONVERSATION_MESSAGES TABLE STRUCTURE
-- ============================================
-- Cette migration corrige la structure de conversation_messages
-- pour correspondre au code frontend

-- 1. Vérifier si la table existe
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'conversation_messages') THEN
        RAISE NOTICE 'Table conversation_messages existe déjà, application des corrections...';
        
        -- Ajouter les colonnes manquantes si elles n'existent pas
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversation_messages' AND column_name = 'content') THEN
            ALTER TABLE public.conversation_messages ADD COLUMN content TEXT;
            RAISE NOTICE 'Colonne content ajoutée';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversation_messages' AND column_name = 'is_read') THEN
            ALTER TABLE public.conversation_messages ADD COLUMN is_read BOOLEAN DEFAULT false;
            RAISE NOTICE 'Colonne is_read ajoutée';
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversation_messages' AND column_name = 'read_at') THEN
            ALTER TABLE public.conversation_messages ADD COLUMN read_at TIMESTAMPTZ;
            RAISE NOTICE 'Colonne read_at ajoutée';
        END IF;
        
        -- Copier les données de 'message' vers 'content' si la colonne 'message' existe
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversation_messages' AND column_name = 'message') THEN
            UPDATE public.conversation_messages SET content = message WHERE content IS NULL;
            RAISE NOTICE 'Données copiées de message vers content';
        END IF;
        
        -- Supprimer la colonne message_count si elle existe
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'conversation_messages' AND column_name = 'message_count') THEN
            ALTER TABLE public.conversation_messages DROP COLUMN message_count;
            RAISE NOTICE 'Colonne message_count supprimée';
        END IF;
        
    ELSE
        -- Si la table n'existe pas, la créer avec la bonne structure
        RAISE NOTICE 'Table conversation_messages n''existe pas, création...';
        
        CREATE TABLE public.conversation_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
            sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            is_read BOOLEAN DEFAULT false,
            read_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Indexes
        CREATE INDEX idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
        CREATE INDEX idx_conversation_messages_sender_id ON public.conversation_messages(sender_id);
        CREATE INDEX idx_conversation_messages_created_at ON public.conversation_messages(created_at DESC);
        
        -- Enable RLS
        ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
        
        RAISE NOTICE 'Table conversation_messages créée';
    END IF;
END $$;

-- 2. S'assurer que RLS est activé
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- 3. Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.conversation_messages;
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.conversation_messages;
DROP POLICY IF EXISTS "Users can update message read status" ON public.conversation_messages;

-- 4. Créer les nouvelles politiques RLS
CREATE POLICY "Users can view messages in their conversations" ON public.conversation_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = conversation_messages.conversation_id
            AND (vendor_id = auth.uid() OR buyer_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages in their conversations" ON public.conversation_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid()
        AND
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = conversation_id
            AND (vendor_id = auth.uid() OR buyer_id = auth.uid())
        )
    );

CREATE POLICY "Users can update message read status" ON public.conversation_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = conversation_messages.conversation_id
            AND (vendor_id = auth.uid() OR buyer_id = auth.uid())
        )
    );

-- 5. Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_conversation_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_conversation_messages_updated_at ON public.conversation_messages;
CREATE TRIGGER trigger_update_conversation_messages_updated_at
    BEFORE UPDATE ON public.conversation_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_messages_updated_at();

-- 6. Permissions
GRANT SELECT, INSERT, UPDATE ON public.conversation_messages TO authenticated;
GRANT ALL ON public.conversation_messages TO service_role;

-- 7. Refresh schema cache (forcer Supabase à recharger)
NOTIFY pgrst, 'reload schema';

SELECT 'Migration completed successfully!' as status;
