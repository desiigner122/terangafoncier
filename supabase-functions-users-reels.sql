-- ============================================================================
-- FONCTION SQL POUR RÉCUPÉRER LES VRAIS UTILISATEURS DEPUIS AUTH.USERS
-- ============================================================================

-- Créer une fonction pour obtenir tous les utilisateurs avec leurs métadonnées
CREATE OR REPLACE FUNCTION get_all_users_with_metadata()
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
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.created_at,
        u.email_confirmed_at,
        u.raw_user_meta_data,
        COALESCE(u.raw_user_meta_data->>'role', 'particulier')::text as user_role,
        COALESCE(u.raw_user_meta_data->>'full_name', u.email)::text as full_name,
        COALESCE(u.raw_user_meta_data->>'first_name', split_part(u.email, '@', 1))::text as first_name,
        COALESCE(u.raw_user_meta_data->>'last_name', '')::text as last_name
    FROM auth.users u
    WHERE u.email NOT LIKE '%@test.com'
    ORDER BY u.created_at DESC;
END;
$$;

-- Créer une fonction pour compter les utilisateurs et obtenir des statistiques
CREATE OR REPLACE FUNCTION get_users_count_and_details()
RETURNS TABLE (
    total_users bigint,
    active_users bigint,
    pending_users bigint,
    users_by_role jsonb,
    recent_signups bigint
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::bigint as total_users,
        COUNT(CASE WHEN u.email_confirmed_at IS NOT NULL THEN 1 END)::bigint as active_users,
        COUNT(CASE WHEN u.email_confirmed_at IS NULL THEN 1 END)::bigint as pending_users,
        jsonb_object_agg(
            COALESCE(u.raw_user_meta_data->>'role', 'particulier'),
            role_counts.count
        ) as users_by_role,
        COUNT(CASE WHEN u.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END)::bigint as recent_signups
    FROM auth.users u
    LEFT JOIN (
        SELECT 
            COALESCE(raw_user_meta_data->>'role', 'particulier') as role,
            COUNT(*) as count
        FROM auth.users
        WHERE email NOT LIKE '%@test.com'
        GROUP BY COALESCE(raw_user_meta_data->>'role', 'particulier')
    ) role_counts ON COALESCE(u.raw_user_meta_data->>'role', 'particulier') = role_counts.role
    WHERE u.email NOT LIKE '%@test.com';
END;
$$;

-- Créer une fonction pour obtenir les utilisateurs avec leurs profils (si existants)
CREATE OR REPLACE FUNCTION get_users_with_profiles()
RETURNS TABLE (
    user_id uuid,
    email text,
    user_role text,
    first_name text,
    last_name text,
    phone text,
    status text,
    created_at timestamptz,
    email_confirmed boolean,
    has_profile boolean,
    profile_complete boolean
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.email,
        COALESCE(
            p.user_type,
            u.raw_user_meta_data->>'role', 
            'particulier'
        )::text as user_role,
        COALESCE(
            p.first_name,
            u.raw_user_meta_data->>'first_name',
            split_part(u.email, '@', 1)
        )::text as first_name,
        COALESCE(
            p.last_name,
            u.raw_user_meta_data->>'last_name',
            ''
        )::text as last_name,
        p.phone,
        COALESCE(
            p.status,
            CASE 
                WHEN u.email_confirmed_at IS NOT NULL THEN 'active'
                ELSE 'pending'
            END
        )::text as status,
        u.created_at,
        (u.email_confirmed_at IS NOT NULL) as email_confirmed,
        (p.id IS NOT NULL) as has_profile,
        (
            p.id IS NOT NULL AND 
            p.first_name IS NOT NULL AND 
            p.last_name IS NOT NULL AND
            p.phone IS NOT NULL
        ) as profile_complete
    FROM auth.users u
    LEFT JOIN public.profiles p ON u.id = p.id
    WHERE u.email NOT LIKE '%@test.com'
    ORDER BY u.created_at DESC;
END;
$$;

-- Fonction pour obtenir les statistiques dashboard admin en temps réel
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS TABLE (
    total_users bigint,
    active_users bigint,
    total_properties bigint,
    active_properties bigint,
    total_transactions bigint,
    completed_transactions bigint,
    monthly_revenue numeric,
    user_growth_rate numeric,
    last_updated timestamptz
)
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    prev_month_users bigint;
    current_month_users bigint;
BEGIN
    -- Compter les utilisateurs du mois précédent pour calculer la croissance
    SELECT COUNT(*) INTO prev_month_users
    FROM auth.users
    WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
    AND created_at < DATE_TRUNC('month', CURRENT_DATE)
    AND email NOT LIKE '%@test.com';
    
    -- Compter les utilisateurs du mois actuel
    SELECT COUNT(*) INTO current_month_users
    FROM auth.users
    WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
    AND email NOT LIKE '%@test.com';

    RETURN QUERY
    SELECT 
        -- Utilisateurs
        (SELECT COUNT(*) FROM auth.users WHERE email NOT LIKE '%@test.com')::bigint as total_users,
        (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL AND email NOT LIKE '%@test.com')::bigint as active_users,
        
        -- Propriétés (si la table existe)
        COALESCE((SELECT COUNT(*) FROM public.properties), 0)::bigint as total_properties,
        COALESCE((SELECT COUNT(*) FROM public.properties WHERE status = 'approved'), 0)::bigint as active_properties,
        
        -- Transactions (si la table existe)  
        COALESCE((SELECT COUNT(*) FROM public.transactions), 0)::bigint as total_transactions,
        COALESCE((SELECT COUNT(*) FROM public.transactions WHERE status = 'completed'), 0)::bigint as completed_transactions,
        
        -- Revenus (depuis les abonnements)
        COALESCE(
            (SELECT SUM(sp.price) 
             FROM public.user_subscriptions us 
             JOIN public.subscription_plans sp ON us.plan_id = sp.id 
             WHERE us.status = 'active'), 
            0
        )::numeric as monthly_revenue,
        
        -- Taux de croissance des utilisateurs
        CASE 
            WHEN prev_month_users > 0 THEN 
                ROUND(((current_month_users::numeric - prev_month_users::numeric) / prev_month_users::numeric) * 100, 2)
            ELSE 0
        END as user_growth_rate,
        
        NOW() as last_updated;
END;
$$;

-- Accorder les permissions nécessaires
GRANT EXECUTE ON FUNCTION get_all_users_with_metadata() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_users_count_and_details() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_users_with_profiles() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_admin_dashboard_stats() TO anon, authenticated;

-- Message de confirmation
SELECT '✅ Fonctions SQL créées avec succès pour récupérer les vrais utilisateurs!' as message;