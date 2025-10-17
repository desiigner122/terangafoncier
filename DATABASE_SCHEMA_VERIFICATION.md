# Database Schema Verification - October 17, 2025

## Current Status

All required tables for the purchase case workflow have been defined and should exist in your Supabase database.

## Required Tables Summary

| Table | Purpose | Status | Verified |
|-------|---------|--------|----------|
| `purchase_cases` | Main case records | ✅ Defined in database-purchase-workflow.sql | ⏳ TODO |
| `purchase_case_history` | Status change tracking | ✅ Defined in database-purchase-workflow.sql | ⏳ TODO |
| `purchase_case_documents` | Document storage for cases | ✅ Defined in database-purchase-workflow.sql | ⏳ TODO |
| `purchase_case_messages` | Real-time messaging | ✅ Defined in add-purchase-case-messages-table.sql | ⏳ TODO |
| `purchase_case_notifications` | Automated notifications | ✅ Defined in database-purchase-workflow.sql | ⏳ TODO |
| `purchase_case_milestones` | Workflow milestones | ✅ Defined in database-purchase-workflow.sql | ⏳ TODO |
| `purchase_case_participants` | Case participants (agents, notaries) | ✅ Defined in database-purchase-workflow.sql | ⏳ TODO |

## Table Details

### 1. purchase_cases (Main Case Table)
**Columns:**
- `id` - UUID Primary Key
- `request_id` - References requests table
- `buyer_id` - References auth.users
- `seller_id` - References auth.users
- `parcelle_id` - References parcelles table
- `purchase_price` - DECIMAL(15,2)
- `negotiated_price` - DECIMAL(15,2)
- `payment_method` - TEXT (one_time, installments, bank_financing, mixed)
- `status` - TEXT (initiated, buyer_verification, seller_notification, negotiation, preliminary_agreement, contract_preparation, legal_verification, document_audit, property_evaluation, notary_appointment, signing_process, payment_processing, property_transfer, completed, cancelled, rejected, seller_declined, negotiation_failed, legal_issues_found)
- `phase` - INTEGER (0, 1, 2, 3, 4)
- `progress_percentage` - INTEGER (0-100)
- `created_at`, `last_updated`, `completed_at` - TIMESTAMP WITH TIME ZONE
- `metadata` - JSONB

**RLS Policies:**
- SELECT: Users can view their own cases (buyer_id or seller_id)
- UPDATE: Users can update their own cases
- Admins/Agents/Notaries can also update if in participants table

### 2. purchase_case_history (Audit Log)
**Columns:**
- `id` - UUID Primary Key
- `case_id` - UUID (FK to purchase_cases)
- `previous_status` - TEXT
- `new_status` - TEXT
- `status` - TEXT (duplicate for compatibility)
- `updated_by` - TEXT
- `notes` - TEXT
- `attachments` - JSONB
- `created_at` - TIMESTAMP WITH TIME ZONE
- `ip_address` - INET
- `user_agent` - TEXT
- `metadata` - JSONB

**Triggers:**
- Automatically created on status change via trigger `log_purchase_case_status_change()`

### 3. purchase_case_documents (Document Storage)
**Columns:**
- `id` - UUID Primary Key
- `case_id` - UUID (FK to purchase_cases)
- `document_type` - TEXT (identity_proof, income_proof, bank_statement, title_deed, land_certificate, tax_clearance, survey_report, insurance_policy, contract, notary_deed, payment_proof, other)
- `document_name` - TEXT
- `file_path` - TEXT
- `file_size` - INTEGER
- `file_type` - TEXT
- `verification_status` - TEXT (pending, verified, rejected, expired)
- `verified_by` - TEXT
- `verified_at` - TIMESTAMP WITH TIME ZONE
- `rejection_reason` - TEXT
- `uploaded_by` - UUID (FK to auth.users)
- `uploaded_at` - TIMESTAMP WITH TIME ZONE
- `is_required` - BOOLEAN
- `expiry_date` - TIMESTAMP WITH TIME ZONE
- `metadata` - JSONB

**RLS Policies:**
- SELECT: Users can view documents of their cases
- INSERT: Users can upload documents to their cases

### 4. purchase_case_messages (Real-time Messaging) ⭐ NEW
**Columns:**
- `id` - UUID Primary Key
- `case_id` - UUID (FK to purchase_cases) ← **CRITICAL FOR LINKING**
- `sender_id` - UUID (FK to auth.users)
- `message` - TEXT (NOT NULL, NOT EMPTY)
- `message_type` - TEXT (text, system, announcement)
- `attachments` - JSONB (default: [])
- `file_urls` - TEXT[] (array of file URLs)
- `is_read` - BOOLEAN
- `read_by` - UUID
- `read_at` - TIMESTAMP WITH TIME ZONE
- `created_at`, `updated_at` - TIMESTAMP WITH TIME ZONE
- `metadata` - JSONB

**Indexes:**
- `idx_purchase_case_messages_case_id` - For querying by case
- `idx_purchase_case_messages_sender_id` - For querying by sender
- `idx_purchase_case_messages_created_at` - For sorting
- `idx_purchase_case_messages_case_created` - Composite for efficient queries

**RLS Policies:**
- SELECT: Users can view messages only if they're buyer or seller of the case
- INSERT: Users can send messages only to their own cases
- UPDATE: Users can only update their own messages

**Triggers:**
- `trigger_update_purchase_case_messages_updated_at()` - Auto-updates `updated_at` on modification

### 5. purchase_case_notifications (Automated Notifications)
**Columns:**
- `id` - UUID Primary Key
- `case_id` - UUID (FK to purchase_cases)
- `user_id` - UUID (FK to auth.users)
- `notification_type` - TEXT (status_update, document_required, payment_due, appointment_reminder, deadline_approaching, case_completed)
- `title` - TEXT
- `message` - TEXT
- `status` - TEXT (pending, sent, delivered, read, failed)
- `priority` - TEXT (low, medium, high, urgent)
- `email_sent`, `sms_sent`, `push_sent`, `in_app_read` - BOOLEAN
- `scheduled_for`, `sent_at`, `read_at`, `created_at` - TIMESTAMP WITH TIME ZONE
- `metadata` - JSONB

**RLS Policies:**
- SELECT: Users can view their own notifications only
- UPDATE: Users can update their own notifications

### 6. purchase_case_milestones (Workflow Milestones)
**Columns:**
- `id` - UUID Primary Key
- `case_id` - UUID (FK to purchase_cases)
- `milestone_type` - TEXT (agreement_signed, payment_completed, documents_verified, notary_appointment, property_transferred, case_closed)
- `milestone_name` - TEXT
- `description` - TEXT
- `status` - TEXT (pending, in_progress, completed, skipped, failed)
- `due_date`, `completed_at` - TIMESTAMP WITH TIME ZONE
- `completed_by` - TEXT
- `depends_on_milestone`, `blocks_milestone` - UUID (references self for dependencies)
- `created_at` - TIMESTAMP WITH TIME ZONE
- `metadata` - JSONB

### 7. purchase_case_participants (Team Members)
**Columns:**
- `id` - UUID Primary Key
- `case_id` - UUID (FK to purchase_cases)
- `user_id` - UUID (FK to auth.users)
- `role` - TEXT (buyer, seller, agent, notary, legal_advisor, financial_advisor, surveyor, inspector, admin)
- `permissions` - JSONB (array of permission strings)
- `status` - TEXT (active, inactive, removed, blocked)
- `joined_at`, `left_at` - TIMESTAMP WITH TIME ZONE
- `contact_name`, `contact_email`, `contact_phone` - TEXT
- `metadata` - JSONB

## Application Code Verification

### Files Using These Tables

1. **ParticulierCaseTracking.jsx** ✅
   - Uses: `purchase_cases`, `requests`, `profiles`, `parcels`, `purchase_case_history`, `purchase_case_messages`, `purchase_case_documents`
   - Subscribes to real-time updates via `RealtimeSyncService.subscribeToCaseUpdates()`
   - Sends messages: `INSERT INTO purchase_case_messages`
   - Loads messages: `SELECT * FROM purchase_case_messages`

2. **VendeurCaseTracking.jsx** ✅
   - Uses: `purchase_cases`, `requests`, `profiles`, `parcels`, `purchase_case_history`, `purchase_case_messages`, `purchase_case_documents`
   - Same functionality as Particulier version (seller perspective)

3. **RealtimeSyncService.js** ✅
   - Subscribes to: `purchase_cases` changes
   - Real-time callback: `channel().on('postgres_changes', (payload) => {...})`
   - Used by: Buyer and seller dashboards

4. **ParticulierMesAchats.jsx** ✅
   - Uses: `requests`, `purchase_cases`, `parcels`, `profiles`
   - Links to: `/acheteur/cases/:caseNumber` (ParticulierCaseTracking)
   - Shows "Suivi dossier" button when `purchaseCase` exists

5. **PurchaseWorkflowService.js** ✅
   - Defines workflow statuses and transitions
   - Updates `purchase_cases.status` field

## Next Steps

### Step 1: Execute SQL to Create Tables
Execute these SQL files in your Supabase console (in order):

1. **database-purchase-workflow.sql** ← Run first (creates main tables)
   - Creates: purchase_cases, purchase_case_history, purchase_case_documents, purchase_case_notifications, purchase_case_milestones, purchase_case_participants
   - Creates triggers for auto-updates
   - Enables RLS and creates policies

2. **add-purchase-case-messages-table.sql** ← Run second (adds messaging)
   - Creates: purchase_case_messages with RLS policies
   - Adds indexes for performance
   - Creates trigger for auto-updated_at

3. **FIX_RLS_PURCHASE_CASES.sql** ← Already executed (RLS policies)
   - Ensures RLS policies are correct (buyer can read their cases, etc.)

### Step 2: Verify Tables Exist
After running SQL, verify in Supabase:

```sql
-- Check if all required tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'purchase_cases',
    'purchase_case_history',
    'purchase_case_documents',
    'purchase_case_messages',
    'purchase_case_notifications',
    'purchase_case_milestones',
    'purchase_case_participants'
)
ORDER BY table_name;
```

Expected result:
```
purchase_cases
purchase_case_documents
purchase_case_history
purchase_case_messages
purchase_case_milestones
purchase_case_notifications
purchase_case_participants
```

### Step 3: Test Table Functions
```sql
-- Test 1: Insert a test message
INSERT INTO purchase_case_messages (case_id, sender_id, message)
VALUES (
    (SELECT id FROM purchase_cases LIMIT 1),
    auth.uid(),
    'Test message'
);

-- Test 2: Verify RLS is working
SELECT * FROM purchase_case_messages 
WHERE case_id = (SELECT id FROM purchase_cases LIMIT 1);

-- Test 3: Check indexes exist
SELECT indexname FROM pg_indexes 
WHERE tablename = 'purchase_case_messages';
```

## Critical RLS Policies Status

✅ **Already Fixed (Commit from earlier):**
- 9 RLS policies on purchase_cases table are active and verified
- Buyers can read: `WHERE buyer_id = auth.uid()`
- Sellers can read: `WHERE seller_id = auth.uid()`
- Both can update their own cases

✅ **New for Messages:**
- SELECT: Only case participants (buyer or seller) can view messages
- INSERT: Only case participants can send messages
- UPDATE: Only message sender can update their own messages

## Troubleshooting

If you get errors when running the SQL:

### Error: "Table already exists"
**Solution:** This is fine! The `CREATE TABLE IF NOT EXISTS` statements will skip creation if tables already exist.

### Error: "Policy already exists"
**Solution:** Use `CREATE POLICY IF NOT EXISTS`. Some policies may have been created by earlier scripts.

### Error: "permission denied for schema public"
**Solution:** Run scripts as `postgres` role or superuser in Supabase console. This should be automatic.

### Messages not appearing
**Checklist:**
1. Is `case_id` a valid UUID from `purchase_cases`?
2. Is `sender_id` the current user's UUID?
3. Check RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'purchase_case_messages';`
4. Check if user has `authenticated` role in Supabase

### Real-time not updating
**Checklist:**
1. Is `RealtimeSyncService.subscribeToCaseUpdates()` being called?
2. Are there console logs showing subscription established?
3. Check browser console for `🟢 [REALTIME]` logs
4. Verify Supabase realtime is enabled for the project

## Reference: File Locations

**SQL Scripts:**
- `/database-purchase-workflow.sql` - Main schema definition
- `/add-purchase-case-messages-table.sql` - Messaging table
- `/FIX_RLS_PURCHASE_CASES.sql` - RLS policy fixes

**React Components:**
- `/src/pages/dashboards/particulier/ParticulierCaseTracking.jsx` - Buyer case tracking
- `/src/pages/dashboards/vendeur/VendeurCaseTracking.jsx` - Seller case tracking
- `/src/pages/dashboards/particulier/ParticulierMesAchats.jsx` - Buyer purchase requests (links to case tracking)
- `/src/services/RealtimeSyncService.js` - Real-time subscriptions
- `/src/services/PurchaseWorkflowService.js` - Workflow state management

**Configuration:**
- `/src/App.jsx` - Routes (added `/acheteur/cases/:caseNumber` route)

## Verification Checklist

- [ ] Executed `database-purchase-workflow.sql`
- [ ] Executed `add-purchase-case-messages-table.sql`
- [ ] Verified 7 main tables exist in Supabase
- [ ] Verified RLS policies are in place
- [ ] Tested inserting a purchase case
- [ ] Tested inserting a message
- [ ] Tested real-time subscription updates
- [ ] Ran test: Vendor accepts → Buyer sees immediately
- [ ] All pages load without errors
- [ ] Ready to proceed to final testing

---

**Created:** October 17, 2025
**Status:** Ready for user to execute SQL and verify
