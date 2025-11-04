-- ============================================
-- REBUILD CONVERSATION_MESSAGES TABLE (NUCLEAR OPTION)
-- ============================================
-- This drops and recreates the table completely if the column won't drop

BEGIN;

-- 1. Disable all triggers and constraints temporarily
ALTER TABLE IF EXISTS public.conversation_messages DISABLE TRIGGER ALL;

-- 2. Drop the problematic table if it has bad schema
DROP TABLE IF EXISTS public.conversation_messages CASCADE;

-- 3. Recreate with clean schema
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

-- 4. Create indexes
CREATE INDEX idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX idx_conversation_messages_sender_id ON public.conversation_messages(sender_id);
CREATE INDEX idx_conversation_messages_created_at ON public.conversation_messages(created_at DESC);

-- 5. Enable RLS
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies
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

-- 7. Create trigger
CREATE OR REPLACE FUNCTION update_conversation_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_messages_updated_at
    BEFORE UPDATE ON public.conversation_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_messages_updated_at();

-- 8. Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.conversation_messages TO authenticated;
GRANT ALL ON public.conversation_messages TO service_role;

-- 9. Refresh schema
NOTIFY pgrst, 'reload schema';

COMMIT;

SELECT 'Table rebuilt successfully!' as status;
