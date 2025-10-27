-- ============================================
-- SAFE REBUILD CONVERSATION_MESSAGES TABLE
-- ============================================
-- Handles system triggers and foreign key constraints properly

-- 1. Drop dependent foreign keys and triggers first
ALTER TABLE IF EXISTS public.conversation_messages DISABLE TRIGGER USER;

-- 2. Temporarily drop constraints on tables that reference conversation_messages
ALTER TABLE IF EXISTS public.purchase_case_messages DROP CONSTRAINT IF EXISTS fk_purchase_case_messages_conversation CASCADE;

-- 3. Now we can safely drop the table
DROP TABLE IF EXISTS public.conversation_messages CASCADE;

-- 4. Recreate with clean schema
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

-- 5. Create indexes
CREATE INDEX idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX idx_conversation_messages_sender_id ON public.conversation_messages(sender_id);
CREATE INDEX idx_conversation_messages_created_at ON public.conversation_messages(created_at DESC);

-- 6. Enable RLS
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies
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

-- 8. Create trigger function
CREATE OR REPLACE FUNCTION update_conversation_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger
CREATE TRIGGER trigger_update_conversation_messages_updated_at
    BEFORE UPDATE ON public.conversation_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_messages_updated_at();

-- 10. Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.conversation_messages TO authenticated;
GRANT ALL ON public.conversation_messages TO service_role;

-- 11. Refresh schema cache
NOTIFY pgrst, 'reload schema';

SELECT 'Table rebuilt successfully - system triggers handled!' as status;
