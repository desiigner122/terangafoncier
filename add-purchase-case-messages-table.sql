-- ============================================
-- ADD PURCHASE_CASE_MESSAGES TABLE
-- ============================================
-- Purpose: Enable real-time messaging between buyer and seller within a case
-- Date: October 17, 2025
-- ============================================

-- Create the messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS purchase_case_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Message content
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'system', 'announcement')),
    
    -- Attachments (optional)
    attachments JSONB DEFAULT '[]',
    file_urls TEXT[] DEFAULT '{}',
    
    -- Metadata
    is_read BOOLEAN DEFAULT false,
    read_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata JSONB for extensibility
    metadata JSONB DEFAULT '{}',
    
    -- Constraints
    CONSTRAINT non_empty_message CHECK (message IS NOT NULL AND message != '')
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_purchase_case_messages_case_id 
    ON purchase_case_messages(case_id);

CREATE INDEX IF NOT EXISTS idx_purchase_case_messages_sender_id 
    ON purchase_case_messages(sender_id);

CREATE INDEX IF NOT EXISTS idx_purchase_case_messages_created_at 
    ON purchase_case_messages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_purchase_case_messages_case_created 
    ON purchase_case_messages(case_id, created_at DESC);

-- Enable RLS for messages
ALTER TABLE purchase_case_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view messages in their cases
CREATE POLICY IF NOT EXISTS "Users can view messages of their cases" ON purchase_case_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = purchase_case_messages.case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

-- RLS Policy: Users can insert messages to their cases
CREATE POLICY IF NOT EXISTS "Users can send messages to their cases" ON purchase_case_messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

-- RLS Policy: Users can update their own messages (mark as read, edit)
CREATE POLICY IF NOT EXISTS "Users can update their own messages" ON purchase_case_messages
    FOR UPDATE USING (sender_id = auth.uid());

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_purchase_case_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS trigger_update_purchase_case_messages_updated_at ON purchase_case_messages;
CREATE TRIGGER trigger_update_purchase_case_messages_updated_at
    BEFORE UPDATE ON purchase_case_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_purchase_case_messages_updated_at();

-- Summary
COMMENT ON TABLE purchase_case_messages IS 'Real-time messaging between buyer and seller within a purchase case';
COMMENT ON COLUMN purchase_case_messages.case_id IS 'Reference to the purchase case';
COMMENT ON COLUMN purchase_case_messages.sender_id IS 'User who sent the message';
COMMENT ON COLUMN purchase_case_messages.message IS 'Message content';
COMMENT ON COLUMN purchase_case_messages.is_read IS 'Whether the message has been read by recipient';
COMMENT ON COLUMN purchase_case_messages.read_at IS 'Timestamp when message was read';

-- Grant permissions (if using row-level security)
GRANT SELECT, INSERT, UPDATE ON purchase_case_messages TO authenticated;

-- Summary output
SELECT 
    'COMPLETE' as status,
    'purchase_case_messages table created/verified' as message,
    COUNT(*) as existing_messages
FROM purchase_case_messages;
