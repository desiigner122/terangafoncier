-- ============================================
-- CREATE SIMPLE CONVERSATION_MESSAGES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.conversation_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Message content
    content TEXT NOT NULL,
    
    -- Metadata
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_sender_id ON public.conversation_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_conversation_messages_created_at ON public.conversation_messages(created_at DESC);

-- Enable RLS
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can view messages in their conversations
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.conversation_messages;
CREATE POLICY "Users can view messages in their conversations" ON public.conversation_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = conversation_messages.conversation_id
            AND (vendor_id = auth.uid() OR buyer_id = auth.uid())
        )
    );

-- RLS Policy: Users can send messages in their conversations
DROP POLICY IF EXISTS "Users can send messages in their conversations" ON public.conversation_messages;
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

-- RLS Policy: Users can update read status
DROP POLICY IF EXISTS "Users can update message read status" ON public.conversation_messages;
CREATE POLICY "Users can update message read status" ON public.conversation_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.conversations
            WHERE id = conversation_messages.conversation_id
            AND (vendor_id = auth.uid() OR buyer_id = auth.uid())
        )
    );

-- Trigger to auto-update updated_at
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

-- Permissions
GRANT SELECT, INSERT, UPDATE ON public.conversation_messages TO authenticated;
GRANT ALL ON public.conversation_messages TO service_role;

COMMENT ON TABLE public.conversation_messages IS 'Simple message storage for conversations between buyers and vendors';
