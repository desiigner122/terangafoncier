-- ============================================
-- CREATE NEGOTIATIONS TABLE FOR TRACKING COUNTER-OFFERS
-- ============================================

CREATE TABLE IF NOT EXISTS public.negotiations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    
    -- Parties
    initiated_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    -- buyer_id or seller_id depending on who initiated
    
    -- Offer details
    original_price DECIMAL(15, 2) NOT NULL,
    proposed_price DECIMAL(15, 2) NOT NULL,
    offer_message TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'counter_offer')),
    
    -- Counter-offer chain
    parent_negotiation_id UUID REFERENCES public.negotiations(id) ON DELETE SET NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_negotiations_request_id ON public.negotiations(request_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_conversation_id ON public.negotiations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_negotiations_initiated_by ON public.negotiations(initiated_by);
CREATE INDEX IF NOT EXISTS idx_negotiations_status ON public.negotiations(status);
CREATE INDEX IF NOT EXISTS idx_negotiations_created_at ON public.negotiations(created_at DESC);

-- Enable RLS
ALTER TABLE public.negotiations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can view negotiations for their requests
DROP POLICY IF EXISTS "Users can view negotiations for their requests" ON public.negotiations;
CREATE POLICY "Users can view negotiations for their requests" ON public.negotiations
    FOR SELECT USING (
        initiated_by = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.requests
            WHERE id = negotiations.request_id
            AND (
                user_id = auth.uid()  -- Buyer initiated the request
                -- Seller can view via conversation
                OR EXISTS (
                    SELECT 1 FROM public.conversations
                    WHERE id = negotiations.conversation_id
                    AND (vendor_id = auth.uid() OR buyer_id = auth.uid())
                )
            )
        )
    );

-- RLS Policy: Users can create negotiations
DROP POLICY IF EXISTS "Users can create negotiations" ON public.negotiations;
CREATE POLICY "Users can create negotiations" ON public.negotiations
    FOR INSERT WITH CHECK (
        initiated_by = auth.uid()
        AND
        EXISTS (
            SELECT 1 FROM public.requests
            WHERE id = request_id
        )
    );

-- RLS Policy: Users can update their negotiations
DROP POLICY IF EXISTS "Users can update negotiations" ON public.negotiations;
CREATE POLICY "Users can update negotiations" ON public.negotiations
    FOR UPDATE USING (
        initiated_by = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM public.requests
            WHERE id = negotiations.request_id
            AND user_id = auth.uid()
        )
    );

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_negotiations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_negotiations_updated_at ON public.negotiations;
CREATE TRIGGER trigger_update_negotiations_updated_at
    BEFORE UPDATE ON public.negotiations
    FOR EACH ROW
    EXECUTE FUNCTION update_negotiations_updated_at();

-- Permissions
GRANT SELECT, INSERT, UPDATE ON public.negotiations TO authenticated;
GRANT ALL ON public.negotiations TO service_role;

COMMENT ON TABLE public.negotiations IS 'Tracks counter-offers and price negotiations between buyer and seller';
COMMENT ON COLUMN public.negotiations.original_price IS 'Original price from the purchase request';
COMMENT ON COLUMN public.negotiations.proposed_price IS 'Counter-offered price';
COMMENT ON COLUMN public.negotiations.status IS 'Current status of the negotiation offer';
