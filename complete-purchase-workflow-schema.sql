-- ============================================
-- COMPLETE PURCHASE WORKFLOW SCHEMA
-- ============================================
-- Purpose: Full case tracking system with participants, fees, tasks, documents
-- Date: October 17, 2025
-- Author: Teranga Foncier Team
-- ============================================

-- ==========================================
-- DROP EXISTING TABLES (if they exist with old schema)
-- ==========================================
DROP TABLE IF EXISTS purchase_case_timeline CASCADE;
DROP TABLE IF EXISTS purchase_case_documents CASCADE;
DROP TABLE IF EXISTS purchase_case_tasks CASCADE;
DROP TABLE IF EXISTS purchase_case_fees CASCADE;
DROP TABLE IF EXISTS purchase_case_participants CASCADE;

-- ==========================================
-- TABLE 1: PURCHASE_CASE_PARTICIPANTS
-- ==========================================
-- Tracks all participants in a case and their roles
CREATE TABLE purchase_case_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Role in the case
    role TEXT NOT NULL CHECK (role IN ('buyer', 'seller', 'notary', 'surveyor', 'agent', 'lawyer')) ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'accepted', 'declined', 'completed')),
    
    -- Contact info
    email TEXT,
    phone TEXT,
    full_name TEXT,
    
    -- Participation details
    joined_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT unique_case_user_role UNIQUE(case_id, user_id, role)
);

CREATE INDEX idx_purchase_case_participants_case_id 
    ON purchase_case_participants(case_id);

CREATE INDEX idx_purchase_case_participants_user_id 
    ON purchase_case_participants(user_id);

CREATE INDEX idx_purchase_case_participants_role 
    ON purchase_case_participants(role);

-- ==========================================
-- TABLE 2: PURCHASE_CASE_FEES
-- ==========================================
-- Tracks all fees associated with a case
CREATE TABLE purchase_case_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES purchase_case_participants(id) ON DELETE SET NULL,
    
    -- Fee details
    fee_type TEXT NOT NULL CHECK (fee_type IN ('surveyor_fee', 'notary_fee', 'teranga_commission', 'document_fee', 'other')),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    currency TEXT DEFAULT 'CFA',
    description TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'paid', 'cancelled')),
    
    -- Payment tracking
    due_date DATE,
    paid_date TIMESTAMP WITH TIME ZONE,
    payment_method TEXT,
    payment_reference TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_purchase_case_fees_case_id 
    ON purchase_case_fees(case_id);

CREATE INDEX idx_purchase_case_fees_status 
    ON purchase_case_fees(status);

CREATE INDEX idx_purchase_case_fees_participant_id 
    ON purchase_case_fees(participant_id);

-- ==========================================
-- TABLE 3: PURCHASE_CASE_TASKS
-- ==========================================
-- Tracks tasks for each participant in a case
CREATE TABLE purchase_case_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    participant_id UUID REFERENCES purchase_case_participants(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Task details
    title TEXT NOT NULL,
    description TEXT,
    task_type TEXT CHECK (task_type IN ('verification', 'measurement', 'documentation', 'signature', 'payment', 'transfer', 'other')),
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled', 'blocked')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    
    -- Timeline
    due_date DATE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Notes
    notes TEXT,
    completion_notes TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_purchase_case_tasks_case_id 
    ON purchase_case_tasks(case_id);

CREATE INDEX idx_purchase_case_tasks_assigned_to 
    ON purchase_case_tasks(assigned_to);

CREATE INDEX idx_purchase_case_tasks_status 
    ON purchase_case_tasks(status);

-- ==========================================
-- TABLE 4: PURCHASE_CASE_DOCUMENTS
-- ==========================================
-- Tracks documents required and submitted for a case
CREATE TABLE purchase_case_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Document details
    document_type TEXT NOT NULL CHECK (document_type IN ('identity', 'income_proof', 'bank_statement', 'land_certificate', 'title_deed', 'tax_clearance', 'survey_report', 'notary_deed', 'contract', 'payment_proof', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    
    -- File info
    file_url TEXT,
    file_size INTEGER,
    file_type TEXT,
    storage_path TEXT,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'uploaded', 'verified', 'rejected', 'expired')),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_purchase_case_documents_case_id 
    ON purchase_case_documents(case_id);

CREATE INDEX idx_purchase_case_documents_type 
    ON purchase_case_documents(document_type);

CREATE INDEX idx_purchase_case_documents_status 
    ON purchase_case_documents(status);

-- ==========================================
-- TABLE 5: PURCHASE_CASE_TIMELINE
-- ==========================================
-- Complete audit trail of case events
CREATE TABLE purchase_case_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign keys
    case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
    triggered_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Event details
    event_type TEXT NOT NULL CHECK (event_type IN ('status_change', 'participant_added', 'fee_created', 'task_completed', 'document_uploaded', 'message_sent', 'payment_received', 'notification_sent', 'other')),
    title TEXT NOT NULL,
    description TEXT,
    
    -- Change details
    old_value JSONB,
    new_value JSONB,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_purchase_case_timeline_case_id 
    ON purchase_case_timeline(case_id);

CREATE INDEX idx_purchase_case_timeline_event_type 
    ON purchase_case_timeline(event_type);

CREATE INDEX idx_purchase_case_timeline_created_at 
    ON purchase_case_timeline(created_at DESC);

-- ==========================================
-- RLS POLICIES
-- ==========================================

-- TABLE: purchase_case_participants
ALTER TABLE purchase_case_participants ENABLE ROW LEVEL SECURITY;

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

-- TABLE: purchase_case_fees
ALTER TABLE purchase_case_fees ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view fees for their cases" ON purchase_case_fees;
CREATE POLICY "Users can view fees for their cases" ON purchase_case_fees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM purchase_cases 
            WHERE id = purchase_case_fees.case_id 
            AND (buyer_id = auth.uid() OR seller_id = auth.uid())
        )
    );

-- TABLE: purchase_case_tasks
ALTER TABLE purchase_case_tasks ENABLE ROW LEVEL SECURITY;

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

-- TABLE: purchase_case_documents
ALTER TABLE purchase_case_documents ENABLE ROW LEVEL SECURITY;

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

-- TABLE: purchase_case_timeline
ALTER TABLE purchase_case_timeline ENABLE ROW LEVEL SECURITY;

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
-- TRIGGERS
-- ==========================================

-- Update timestamps
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
-- SUMMARY
-- ==========================================

SELECT 
    'COMPLETE' as status,
    'All purchase workflow tables created' as message,
    (SELECT COUNT(*) FROM information_schema.tables 
     WHERE table_name IN ('purchase_case_participants', 'purchase_case_fees', 'purchase_case_tasks', 'purchase_case_documents', 'purchase_case_timeline')
     AND table_schema = 'public') as tables_created;
