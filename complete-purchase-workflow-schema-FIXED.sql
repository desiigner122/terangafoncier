-- ============================================
-- COMPLETE PURCHASE WORKFLOW SCHEMA - FIXED
-- ============================================
-- Purpose: Full case tracking system with participants, fees, tasks, documents
-- Date: October 17, 2025
-- Author: Teranga Foncier Team
-- ============================================

-- ==========================================
-- IMPORTANT: Run this in Supabase SQL Editor
-- If you get errors about existing tables, run CLEANUP section first
-- ==========================================

-- ==========================================
-- CLEANUP SECTION (Only if tables exist with old schema)
-- ==========================================
-- Uncomment these if you get "table already exists" errors:
-- DROP TABLE IF EXISTS purchase_case_timeline CASCADE;
-- DROP TABLE IF EXISTS purchase_case_documents CASCADE;
-- DROP TABLE IF EXISTS purchase_case_tasks CASCADE;
-- DROP TABLE IF EXISTS purchase_case_fees CASCADE;
-- DROP TABLE IF EXISTS purchase_case_participants CASCADE;

-- ==========================================
-- TABLE 1: PURCHASE_CASE_PARTICIPANTS
-- ==========================================
CREATE TABLE IF NOT EXISTS purchase_case_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    email TEXT,
    phone TEXT,
    full_name TEXT,
    joined_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_case_user_role UNIQUE(case_id, user_id, role),
    CONSTRAINT valid_role CHECK (role IN ('buyer', 'seller', 'notary', 'surveyor', 'agent', 'lawyer')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'invited', 'accepted', 'declined', 'completed'))
);

CREATE INDEX IF NOT EXISTS idx_purchase_case_participants_case_id ON purchase_case_participants(case_id);
CREATE INDEX IF NOT EXISTS idx_purchase_case_participants_user_id ON purchase_case_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_purchase_case_participants_role ON purchase_case_participants(role);

-- ==========================================
-- TABLE 2: PURCHASE_CASE_FEES
-- ==========================================
CREATE TABLE IF NOT EXISTS purchase_case_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES purchase_case_participants(id) ON DELETE SET NULL,
    fee_type TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'CFA',
    description TEXT,
    status TEXT DEFAULT 'pending',
    due_date DATE,
    paid_date TIMESTAMP WITH TIME ZONE,
    payment_method TEXT,
    payment_reference TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_fee_type CHECK (fee_type IN ('surveyor_fee', 'notary_fee', 'teranga_commission', 'document_fee', 'other')),
    CONSTRAINT valid_fee_status CHECK (status IN ('pending', 'quoted', 'accepted', 'paid', 'cancelled')),
    CONSTRAINT positive_amount CHECK (amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_purchase_case_fees_case_id ON purchase_case_fees(case_id);
CREATE INDEX IF NOT EXISTS idx_purchase_case_fees_status ON purchase_case_fees(status);
CREATE INDEX IF NOT EXISTS idx_purchase_case_fees_participant_id ON purchase_case_fees(participant_id);

-- ==========================================
-- TABLE 3: PURCHASE_CASE_TASKS
-- ==========================================
CREATE TABLE IF NOT EXISTS purchase_case_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES purchase_case_participants(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    due_date DATE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    completion_notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_task_type CHECK (task_type IN ('verification', 'measurement', 'documentation', 'signature', 'payment', 'transfer', 'other')),
    CONSTRAINT valid_task_status CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'blocked')),
    CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'critical'))
);

CREATE INDEX IF NOT EXISTS idx_purchase_case_tasks_case_id ON purchase_case_tasks(case_id);
CREATE INDEX IF NOT EXISTS idx_purchase_case_tasks_assigned_to ON purchase_case_tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_purchase_case_tasks_status ON purchase_case_tasks(status);

-- ==========================================
-- TABLE 4: PURCHASE_CASE_DOCUMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS purchase_case_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    file_size INTEGER,
    file_type TEXT,
    storage_path TEXT,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    status TEXT DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_document_type CHECK (document_type IN ('identity', 'income_proof', 'bank_statement', 'land_certificate', 'title_deed', 'tax_clearance', 'survey_report', 'notary_deed', 'contract', 'payment_proof', 'other')),
    CONSTRAINT valid_doc_status CHECK (status IN ('pending', 'uploaded', 'verified', 'rejected', 'expired'))
);

CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_case_id ON purchase_case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_type ON purchase_case_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_purchase_case_documents_status ON purchase_case_documents(status);

-- ==========================================
-- TABLE 5: PURCHASE_CASE_TIMELINE
-- ==========================================
CREATE TABLE IF NOT EXISTS purchase_case_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    triggered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    old_value JSONB,
    new_value JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_event_type CHECK (event_type IN ('status_change', 'participant_added', 'fee_created', 'task_completed', 'document_uploaded', 'message_sent', 'payment_received', 'notification_sent', 'other'))
);

CREATE INDEX IF NOT EXISTS idx_purchase_case_timeline_case_id ON purchase_case_timeline(case_id);
CREATE INDEX IF NOT EXISTS idx_purchase_case_timeline_event_type ON purchase_case_timeline(event_type);
CREATE INDEX IF NOT EXISTS idx_purchase_case_timeline_created_at ON purchase_case_timeline(created_at DESC);

-- ==========================================
-- ENABLE ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE purchase_case_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_case_timeline ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- RLS POLICIES
-- ==========================================

-- Participants
DROP POLICY IF EXISTS "Users can view participants in their cases" ON purchase_case_participants;
CREATE POLICY "Users can view participants in their cases" ON purchase_case_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = purchase_case_participants.case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
        OR user_id = auth.uid()
    );

-- Fees
DROP POLICY IF EXISTS "Users can view fees for their cases" ON purchase_case_fees;
CREATE POLICY "Users can view fees for their cases" ON purchase_case_fees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = purchase_case_fees.case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

-- Tasks
DROP POLICY IF EXISTS "Users can view tasks for their cases" ON purchase_case_tasks;
CREATE POLICY "Users can view tasks for their cases" ON purchase_case_tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = purchase_case_tasks.case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
        OR assigned_to = auth.uid()
    );

DROP POLICY IF EXISTS "Assigned users can update their tasks" ON purchase_case_tasks;
CREATE POLICY "Assigned users can update their tasks" ON purchase_case_tasks
    FOR UPDATE USING (assigned_to = auth.uid());

-- Documents
DROP POLICY IF EXISTS "Users can view documents for their cases" ON purchase_case_documents;
CREATE POLICY "Users can view documents for their cases" ON purchase_case_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = purchase_case_documents.case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

DROP POLICY IF EXISTS "Users can upload documents to their cases" ON purchase_case_documents;
CREATE POLICY "Users can upload documents to their cases" ON purchase_case_documents
    FOR INSERT WITH CHECK (
        uploaded_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

-- Timeline
DROP POLICY IF EXISTS "Users can view timeline for their cases" ON purchase_case_timeline;
CREATE POLICY "Users can view timeline for their cases" ON purchase_case_timeline
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = purchase_case_timeline.case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

-- ==========================================
-- TRIGGERS FOR AUTO TIMESTAMPS
-- ==========================================
CREATE OR REPLACE FUNCTION update_purchase_case_table_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_participants_updated_at ON purchase_case_participants;
CREATE TRIGGER trigger_update_participants_updated_at
    BEFORE UPDATE ON purchase_case_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_purchase_case_table_updated_at();

DROP TRIGGER IF EXISTS trigger_update_fees_updated_at ON purchase_case_fees;
CREATE TRIGGER trigger_update_fees_updated_at
    BEFORE UPDATE ON purchase_case_fees
    FOR EACH ROW
    EXECUTE FUNCTION update_purchase_case_table_updated_at();

DROP TRIGGER IF EXISTS trigger_update_tasks_updated_at ON purchase_case_tasks;
CREATE TRIGGER trigger_update_tasks_updated_at
    BEFORE UPDATE ON purchase_case_tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_purchase_case_table_updated_at();

DROP TRIGGER IF EXISTS trigger_update_documents_updated_at ON purchase_case_documents;
CREATE TRIGGER trigger_update_documents_updated_at
    BEFORE UPDATE ON purchase_case_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_purchase_case_table_updated_at();

-- ==========================================
-- GRANTS
-- ==========================================
GRANT SELECT, INSERT, UPDATE ON purchase_case_participants TO authenticated;
GRANT SELECT, INSERT, UPDATE ON purchase_case_fees TO authenticated;
GRANT SELECT, INSERT, UPDATE ON purchase_case_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE ON purchase_case_documents TO authenticated;
GRANT SELECT ON purchase_case_timeline TO authenticated;

-- ==========================================
-- VERIFICATION
-- ==========================================
SELECT 
    'SUCCESS' as status,
    'All purchase workflow tables created successfully!' as message,
    NOW() as completed_at;
