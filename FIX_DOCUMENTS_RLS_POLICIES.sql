-- Fix RLS policies for documents_administratifs to allow case participants

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "users_create_own_documents" ON documents_administratifs;

-- New policy: Allow document creation for users in the purchase case
-- Users can create documents if:
-- 1. They are the document owner (user_id)
-- 2. They are a participant in the case (seller or buyer)
CREATE POLICY "users_create_case_documents" ON documents_administratifs
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id  -- Own documents
        OR
        EXISTS (
            -- Check if user is seller in a case linked to this request
            SELECT 1 FROM purchase_cases pc
            WHERE pc.id = (
                SELECT id FROM purchase_cases 
                WHERE request_id = documents_administratifs.purchase_request_id
                LIMIT 1
            )
            AND (
                pc.seller_id = auth.uid()  -- Seller in this case
                OR (
                    -- Or buyer in this case (via request)
                    SELECT user_id FROM requests 
                    WHERE id = documents_administratifs.purchase_request_id 
                    LIMIT 1
                ) = auth.uid()
            )
        )
        OR
        -- Admin full access
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' IN ('admin', 'agent_foncier', 'Admin', 'Agent Foncier')
        )
    );

-- Also ensure view policy includes case participants
DROP POLICY IF EXISTS "users_view_own_documents" ON documents_administratifs;

CREATE POLICY "users_view_case_documents" ON documents_administratifs
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id  -- Own documents
        OR
        EXISTS (
            -- User is in a case related to this document
            SELECT 1 FROM purchase_cases pc
            WHERE pc.id = (
                SELECT id FROM purchase_cases 
                WHERE request_id = documents_administratifs.purchase_request_id
                LIMIT 1
            )
            AND (
                pc.seller_id = auth.uid()  -- Seller
                OR (
                    SELECT user_id FROM requests 
                    WHERE id = documents_administratifs.purchase_request_id 
                    LIMIT 1
                ) = auth.uid()  -- Buyer
            )
        )
        OR
        -- Admin access
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid() 
            AND raw_user_meta_data->>'role' IN ('admin', 'agent_foncier', 'Admin', 'Agent Foncier')
        )
    );

