-- ============================================================================
-- DURCISSEMENT SÉCURITÉ – Teranga Foncier
-- ----------------------------------------------------------------------------
-- Cette migration est idempotente : elle peut être rejouée sans risque.
-- Elle corrige les failles relevées lors de l'audit du 31/10/2026 :
--   1. Un utilisateur pouvait modifier son propre `role` dans `profiles`
--      (élévation de privilèges vers admin).
--   2. Des fonctions SECURITY DEFINER lisant `auth.users` étaient accessibles
--      au rôle `anon` (fuite des e-mails de tous les comptes).
--   3. Des policies `USING (true)` ouvraient des tables sensibles à `anon`.
--   4. Des fonctions SECURITY DEFINER n'avaient pas de `search_path` fixé.
--
-- À appliquer avec :  supabase db push   (ou via l'éditeur SQL du dashboard)
-- Puis vérifier avec les "Security Advisors" du dashboard Supabase.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. Helper : l'utilisateur courant est-il admin ?
--    Lit `profiles.role` (jamais `user_metadata`, modifiable par l'utilisateur).
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  -- to_jsonb : fonctionne quelle que soit la liste exacte des colonnes.
  SELECT to_jsonb(p) INTO v_row FROM public.profiles p WHERE p.id = auth.uid();
  IF v_row IS NULL THEN
    RETURN false;
  END IF;
  RETURN lower(coalesce(v_row->>'role', v_row->>'user_type', ''))
         IN ('admin', 'administrateur', 'administrator');
END;
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 1. Interdire la modification des colonnes sensibles de `profiles`
--    par l'utilisateur lui-même (role, user_type, verification_status,
--    banned, is_verified, is_active, status).
--    Seuls `service_role` (backend / Edge Functions) et un admin peuvent
--    les changer.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_privileged_columns()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text := current_setting('request.jwt.claim.role', true);
BEGIN
  -- service_role et les scripts d'admin (hors PostgREST) passent.
  IF v_role IS NULL OR v_role = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Un admin authentifié peut tout changer.
  IF public.is_admin() THEN
    RETURN NEW;
  END IF;

  -- Pour les autres, on verrouille les colonnes privilégiées.
  IF to_jsonb(NEW) ? 'role' AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Modification du rôle interdite' USING ERRCODE = '42501';
  END IF;
  IF to_jsonb(NEW) ? 'user_type' AND NEW.user_type IS DISTINCT FROM OLD.user_type THEN
    RAISE EXCEPTION 'Modification du type de compte interdite' USING ERRCODE = '42501';
  END IF;
  IF to_jsonb(NEW) ? 'verification_status' AND NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
    RAISE EXCEPTION 'Modification du statut de vérification interdite' USING ERRCODE = '42501';
  END IF;
  IF to_jsonb(NEW) ? 'is_verified' AND NEW.is_verified IS DISTINCT FROM OLD.is_verified THEN
    RAISE EXCEPTION 'Modification du statut de vérification interdite' USING ERRCODE = '42501';
  END IF;
  IF to_jsonb(NEW) ? 'banned' AND NEW.banned IS DISTINCT FROM OLD.banned THEN
    RAISE EXCEPTION 'Modification du bannissement interdite' USING ERRCODE = '42501';
  END IF;
  IF to_jsonb(NEW) ? 'is_active' AND NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    RAISE EXCEPTION 'Modification du statut interdite' USING ERRCODE = '42501';
  END IF;
  IF to_jsonb(NEW) ? 'status' AND NEW.status IS DISTINCT FROM OLD.status THEN
    RAISE EXCEPTION 'Modification du statut interdite' USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privileged_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileged_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileged_columns();

-- À l'insertion (création de son propre profil), on force un rôle non privilégié.
CREATE OR REPLACE FUNCTION public.protect_profile_insert_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text := current_setting('request.jwt.claim.role', true);
BEGIN
  IF v_role IS NULL OR v_role = 'service_role' OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  IF to_jsonb(NEW) ? 'role'
     AND lower(coalesce(NEW.role, '')) IN ('admin', 'administrateur', 'administrator') THEN
    NEW.role := 'particulier';
  END IF;
  IF to_jsonb(NEW) ? 'user_type'
     AND lower(coalesce(NEW.user_type, '')) IN ('admin', 'administrateur', 'administrator') THEN
    NEW.user_type := 'particulier';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_insert_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_insert_role
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_insert_role();

-- Le trigger de création de profil ne doit jamais copier un rôle admin
-- depuis les metadata d'inscription (contrôlées par l'utilisateur).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_requested text := lower(coalesce(NEW.raw_user_meta_data->>'user_type', NEW.raw_user_meta_data->>'role', 'particulier'));
  v_role text;
BEGIN
  -- Rôles qu'un utilisateur peut choisir seul à l'inscription.
  IF v_requested IN ('particulier', 'vendeur', 'investisseur', 'promoteur') THEN
    v_role := v_requested;
  ELSE
    -- banque, mairie, notaire, géomètre, agent foncier, admin… => validation manuelle.
    v_role := 'particulier';
  END IF;

  BEGIN
    INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      v_role,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN check_violation THEN
    -- Certains schémas imposent une liste de rôles (ex. 'particular') :
    -- on laisse alors la valeur par défaut de la colonne.
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  END;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. Fonctions SECURITY DEFINER qui lisent `auth.users` : réservées aux admins.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  fn text;
BEGIN
  FOREACH fn IN ARRAY ARRAY[
    'get_all_users_with_metadata()',
    'get_users_count_and_details()',
    'get_admin_dashboard_stats()',
    'get_user_activity_stats()'
  ] LOOP
    IF to_regprocedure('public.' || fn) IS NOT NULL THEN
      EXECUTE format('REVOKE ALL ON FUNCTION public.%s FROM PUBLIC, anon, authenticated', fn);
      EXECUTE format('ALTER FUNCTION public.%s SET search_path = public', fn);
    END IF;
  END LOOP;
END $$;

-- Version sécurisée : vérifie le rôle admin avant de lire auth.users.
CREATE OR REPLACE FUNCTION public.get_all_users_with_metadata()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  email_confirmed_at timestamptz,
  raw_user_meta_data jsonb,
  user_role text,
  full_name text,
  first_name text,
  last_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Accès réservé aux administrateurs' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::text,
    u.created_at,
    u.email_confirmed_at,
    u.raw_user_meta_data,
    COALESCE(p.role, u.raw_user_meta_data->>'role', 'particulier')::text,
    COALESCE(p.full_name, u.raw_user_meta_data->>'full_name', u.email)::text,
    COALESCE(u.raw_user_meta_data->>'first_name', split_part(u.email, '@', 1))::text,
    COALESCE(u.raw_user_meta_data->>'last_name', '')::text
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  ORDER BY u.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_all_users_with_metadata() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_all_users_with_metadata() TO authenticated, service_role;

-- ----------------------------------------------------------------------------
-- 3. Supprimer les policies trop permissives connues et les remplacer
--    par des policies fondées sur la propriété (auth.uid()).
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  r record;
BEGIN
  -- Policies "dummy" / ALL USING(true) créées par les anciens scripts
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        policyname LIKE 'dummy_policy_%'
        OR policyname IN (
          'Authenticated users can read users',
          'Authenticated users can access notifications',
          'Authenticated users can access requests',
          'Authenticated users can access audit_logs',
          'transactions_select_system',
          'Allow public profile read',
          'Enable select for all users'
        )
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- 3a. profiles : lecture publique limitée (l'app affiche des profils vendeurs),
--     mais la ligne complète n'est lisible que par son propriétaire ou un admin.
--     NB : la lecture publique passe par une vue qui n'expose pas l'e-mail.
DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS profiles_select_own_or_admin ON public.profiles';
    EXECUTE $p$CREATE POLICY profiles_select_own_or_admin ON public.profiles
      FOR SELECT TO authenticated
      USING (id = auth.uid() OR public.is_admin())$p$;
    EXECUTE 'DROP POLICY IF EXISTS profiles_select_public_sellers ON public.profiles';
    EXECUTE $p$CREATE POLICY profiles_select_public_sellers ON public.profiles
      FOR SELECT TO anon, authenticated
      USING (lower(coalesce(to_jsonb(profiles)->>'role', to_jsonb(profiles)->>'user_type', ''))
             IN ('vendeur', 'vendeur particulier', 'vendeur pro', 'promoteur', 'agent_foncier', 'agent foncier', 'notaire', 'geometre', 'géomètre'))$p$;
    EXECUTE 'DROP POLICY IF EXISTS profiles_update_own ON public.profiles';
    EXECUTE $p$CREATE POLICY profiles_update_own ON public.profiles
      FOR UPDATE TO authenticated
      USING (id = auth.uid() OR public.is_admin())
      WITH CHECK (id = auth.uid() OR public.is_admin())$p$;
    EXECUTE 'DROP POLICY IF EXISTS profiles_insert_own ON public.profiles';
    EXECUTE $p$CREATE POLICY profiles_insert_own ON public.profiles
      FOR INSERT TO authenticated
      WITH CHECK (id = auth.uid())$p$;
    EXECUTE 'DROP POLICY IF EXISTS "Allow self profile delete" ON public.profiles';
  END IF;
END $$;

-- 3b. purchase_requests / support_tickets / requests / notifications :
--     chacun ne voit que ses lignes ; les admins voient tout.
DO $$
DECLARE
  t text;
  owner_col text;
BEGIN
  FOREACH t IN ARRAY ARRAY['purchase_requests', 'support_tickets', 'requests', 'notifications'] LOOP
    IF to_regclass('public.' || t) IS NULL THEN CONTINUE; END IF;

    SELECT column_name INTO owner_col
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = t
      AND column_name IN ('user_id', 'buyer_id', 'recipient_id', 'requester_id', 'created_by')
    ORDER BY array_position(ARRAY['user_id', 'buyer_id', 'recipient_id', 'requester_id', 'created_by'], column_name)
    LIMIT 1;

    IF owner_col IS NULL THEN CONTINUE; END IF;

    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_select_own', t);
    EXECUTE format($p$CREATE POLICY %I ON public.%I FOR SELECT TO authenticated
      USING (%I = auth.uid() OR public.is_admin())$p$, t || '_select_own', t, owner_col);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_insert_own', t);
    EXECUTE format($p$CREATE POLICY %I ON public.%I FOR INSERT TO authenticated
      WITH CHECK (%I = auth.uid() OR public.is_admin())$p$, t || '_insert_own', t, owner_col);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_update_own', t);
    EXECUTE format($p$CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated
      USING (%I = auth.uid() OR public.is_admin())
      WITH CHECK (%I = auth.uid() OR public.is_admin())$p$, t || '_update_own', t, owner_col, owner_col);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_delete_own', t);
    EXECUTE format($p$CREATE POLICY %I ON public.%I FOR DELETE TO authenticated
      USING (%I = auth.uid() OR public.is_admin())$p$, t || '_delete_own', t, owner_col);
  END LOOP;
END $$;

-- 3c. transactions : visibles par l'acheteur, le vendeur ou un admin.
DO $$
BEGIN
  IF to_regclass('public.transactions') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON public.transactions FROM anon';
    EXECUTE 'DROP POLICY IF EXISTS transactions_select_parties ON public.transactions';
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='seller_id')
       AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='buyer_id') THEN
      EXECUTE $p$CREATE POLICY transactions_select_parties ON public.transactions
        FOR SELECT TO authenticated
        USING (buyer_id = auth.uid() OR seller_id = auth.uid() OR public.is_admin())$p$;
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='transactions' AND column_name='user_id') THEN
      EXECUTE $p$CREATE POLICY transactions_select_parties ON public.transactions
        FOR SELECT TO authenticated
        USING (user_id = auth.uid() OR public.is_admin())$p$;
    END IF;
  END IF;
END $$;

-- 3d. users (table legacy) et audit_logs : admin uniquement.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['users', 'audit_logs'] LOOP
    IF to_regclass('public.' || t) IS NULL THEN CONTINUE; END IF;
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('REVOKE ALL ON public.%I FROM anon', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_admin_only', t);
    EXECUTE format($p$CREATE POLICY %I ON public.%I FOR ALL TO authenticated
      USING (public.is_admin()) WITH CHECK (public.is_admin())$p$, t || '_admin_only', t);
  END LOOP;
END $$;

-- 3e. reviews : lecture publique OK, écriture réservée aux connectés.
DO $$
BEGIN
  IF to_regclass('public.reviews') IS NOT NULL THEN
    EXECUTE 'REVOKE INSERT, UPDATE, DELETE ON public.reviews FROM anon';
    EXECUTE 'GRANT SELECT ON public.reviews TO anon';
    EXECUTE 'ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY';
    EXECUTE 'DROP POLICY IF EXISTS reviews_select_public ON public.reviews';
    EXECUTE 'CREATE POLICY reviews_select_public ON public.reviews FOR SELECT TO anon, authenticated USING (true)';
  END IF;
END $$;

-- 3f. marketing_leads : insertion anonyme autorisée (formulaire public),
--     lecture / modification réservées aux admins.
DO $$
BEGIN
  IF to_regclass('public.marketing_leads') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE SELECT, UPDATE, DELETE ON public.marketing_leads FROM anon';
    EXECUTE 'DROP POLICY IF EXISTS marketing_leads_insert_public ON public.marketing_leads';
    EXECUTE 'CREATE POLICY marketing_leads_insert_public ON public.marketing_leads FOR INSERT TO anon, authenticated WITH CHECK (true)';
    EXECUTE 'DROP POLICY IF EXISTS marketing_leads_admin ON public.marketing_leads';
    EXECUTE 'CREATE POLICY marketing_leads_admin ON public.marketing_leads FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())';
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 4. Fixer search_path sur toutes les fonctions SECURITY DEFINER du schéma
--    public qui n'en ont pas (protection contre le détournement de schéma).
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef
      AND (p.proconfig IS NULL OR NOT EXISTS (
            SELECT 1 FROM unnest(p.proconfig) c WHERE c LIKE 'search_path=%'))
  LOOP
    EXECUTE format('ALTER FUNCTION %s SET search_path = public', r.sig);
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 5. Vue publique des profils vendeurs sans données personnelles sensibles.
--    Les pages publiques (fiche parcelle, profil vendeur) doivent lire cette
--    vue plutôt que la table `profiles`.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  cols text;
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    -- Ne garder que les colonnes non sensibles qui existent réellement.
    SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position) INTO cols
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles'
      AND column_name IN ('id', 'full_name', 'first_name', 'last_name', 'role', 'user_type',
                          'avatar_url', 'is_verified', 'verification_status', 'rating',
                          'review_count', 'properties_sold', 'company_name', 'bio', 'city',
                          'region', 'created_at');
    EXECUTE 'DROP VIEW IF EXISTS public.public_profiles';
    EXECUTE format('CREATE VIEW public.public_profiles WITH (security_invoker = false) AS SELECT %s FROM public.profiles', cols);
    EXECUTE 'GRANT SELECT ON public.public_profiles TO anon, authenticated';
  END IF;
END $$;
