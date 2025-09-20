-- Fix and complete structure for requests and transactions tables
-- This script is idempotent: safe to run multiple times

-- =====================
-- REQUESTS TABLE PATCH
-- =====================
-- Ensure base columns exist (aligned with check-requests-structure.sql)
ALTER TABLE IF EXISTS public.requests
  ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ADD COLUMN IF NOT EXISTS type text,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS description text,
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS property_id uuid,
  ADD COLUMN IF NOT EXISTS municipality_id uuid,
  ADD COLUMN IF NOT EXISTS data jsonb,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- New columns used by app features
ALTER TABLE IF EXISTS public.requests
  ADD COLUMN IF NOT EXISTS project_id uuid,
  ADD COLUMN IF NOT EXISTS nft_token_id bigint,
  ADD COLUMN IF NOT EXISTS nft_tx_hash text;

-- Optional: lightweight indexes for frequent filters
CREATE INDEX IF NOT EXISTS idx_requests_user_id ON public.requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_type ON public.requests(type);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON public.requests(created_at);

-- Ensure updated_at auto-update trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_requests_set_updated_at ON public.requests;
CREATE TRIGGER trg_requests_set_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- TRANSACTIONS TABLE PATCH
-- =========================
-- Add blockchain hash column used when on-chain payment is enabled
ALTER TABLE IF EXISTS public.transactions
  ADD COLUMN IF NOT EXISTS blockchain_hash text;

-- Optional: status and created_at defaults (safe no-ops if already set)
ALTER TABLE IF EXISTS public.transactions
  ALTER COLUMN created_at SET DEFAULT now();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);

-- =========================
-- NOTES
-- =========================
-- 1) We did not add FKs for project_id/property_id/municipality_id to avoid breaking if target tables differ by env.
--    Add them later if your schema is stable, e.g.:
--    ALTER TABLE public.requests ADD CONSTRAINT fk_requests_project FOREIGN KEY (project_id) REFERENCES public.projects(id);
-- 2) RLS policies are environment-specific and not included here.
-- 3) The app expects:
--    - requests.type values like: 'offer', 'installments', 'bank_financing', 'municipal_land', 'construction_request'
--    - requests.status default 'new'
--    - NFT optional columns (nft_token_id, nft_tx_hash)
--    - transactions.blockchain_hash when on-chain payments are used.
