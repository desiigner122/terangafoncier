-- NETTOYAGE COMPLET DU COMPTE ADMIN
-- Ce script supprime toutes les traces de l'admin dans toutes les tables possibles

-- 1. Identifier l'ID de l'utilisateur admin s'il existe
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Récupérer l'ID de l'utilisateur admin
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@terangafoncier.sn';
    
    IF admin_user_id IS NOT NULL THEN
        -- Supprimer de toutes les tables possibles
        DELETE FROM public.profiles WHERE id = admin_user_id OR email = 'admin@terangafoncier.sn';
        DELETE FROM public.users WHERE id = admin_user_id OR email = 'admin@terangafoncier.sn';
        DELETE FROM auth.users WHERE id = admin_user_id OR email = 'admin@terangafoncier.sn';
        
        RAISE NOTICE 'Utilisateur admin % supprimé de toutes les tables', admin_user_id;
    ELSE
        -- Supprimer par email au cas où
        DELETE FROM public.profiles WHERE email = 'admin@terangafoncier.sn';
        DELETE FROM public.users WHERE email = 'admin@terangafoncier.sn';
        DELETE FROM auth.users WHERE email = 'admin@terangafoncier.sn';
        
        RAISE NOTICE 'Nettoyage par email effectué';
    END IF;
END $$;

-- 2. Vérifier que tout est supprimé
SELECT 'auth.users' as table_name, COUNT(*) as count 
FROM auth.users WHERE email = 'admin@terangafoncier.sn'
UNION ALL
SELECT 'public.profiles' as table_name, COUNT(*) as count 
FROM public.profiles WHERE email = 'admin@terangafoncier.sn'
UNION ALL
SELECT 'public.users' as table_name, COUNT(*) as count 
FROM public.users WHERE email = 'admin@terangafoncier.sn';