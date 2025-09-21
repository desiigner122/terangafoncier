-- ======================================================================
-- LISTE SIMPLE DE TOUS LES COMPTES UTILISATEURS
-- Script optimisé pour affichage complet dans Supabase
-- ======================================================================

-- Liste complète de tous les comptes
SELECT 
    '📋 TOUS LES COMPTES UTILISATEURS' as section,
    u.email,
    u.raw_user_meta_data->>'full_name' as nom,
    u.raw_user_meta_data->>'role' as role,
    TO_CHAR(u.created_at, 'DD/MM/YYYY HH24:MI') as date_creation,
    CASE 
        WHEN p.id IS NOT NULL THEN '✅'
        ELSE '❌'
    END as profil,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN '✅'
        ELSE '❌'
    END as email_confirme
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email NOT LIKE '%@test.com'
ORDER BY 
    CASE u.raw_user_meta_data->>'role'
        WHEN 'admin' THEN 1
        WHEN 'particulier' THEN 2
        WHEN 'vendeur' THEN 3
        WHEN 'promoteur' THEN 4
        WHEN 'banque' THEN 5
        WHEN 'notaire' THEN 6
        WHEN 'agent_foncier' THEN 7
        WHEN 'mairie' THEN 8
        WHEN 'investisseur' THEN 9
        WHEN 'geometre' THEN 10
        ELSE 11
    END,
    u.email;