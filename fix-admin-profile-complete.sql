-- CORRECTION COMPLÈTE DU PROFIL ADMIN
-- Ce script gère tous les cas possibles

DO $$
DECLARE
    admin_user_id UUID;
    profile_exists BOOLEAN := FALSE;
    role_column_exists BOOLEAN := FALSE;
BEGIN
    -- Récupérer l'ID de l'utilisateur admin
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@terangafoncier.sn';
    
    IF admin_user_id IS NULL THEN
        RAISE NOTICE '❌ Utilisateur admin non trouvé dans auth.users';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Utilisateur admin trouvé avec ID: %', admin_user_id;
    
    -- Vérifier si le profil existe
    SELECT EXISTS(
        SELECT 1 FROM public.profiles WHERE id = admin_user_id
    ) INTO profile_exists;
    
    -- Vérifier si la colonne role existe
    SELECT EXISTS(
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role'
    ) INTO role_column_exists;
    
    RAISE NOTICE 'Profil existe: %, Colonne role existe: %', profile_exists, role_column_exists;
    
    -- Cas 1: Le profil n'existe pas du tout
    IF NOT profile_exists THEN
        RAISE NOTICE '🔧 Création du profil manquant...';
        
        IF role_column_exists THEN
            INSERT INTO public.profiles (id, email, role, full_name)
            VALUES (admin_user_id, 'admin@terangafoncier.sn', 'admin', 'Administrateur Système');
        ELSE
            INSERT INTO public.profiles (id, email, full_name)
            VALUES (admin_user_id, 'admin@terangafoncier.sn', 'Administrateur Système');
        END IF;
        
        RAISE NOTICE '✅ Profil créé';
        
    -- Cas 2: Le profil existe mais pas la colonne role
    ELSIF NOT role_column_exists THEN
        RAISE NOTICE '🔧 Colonne role n''existe pas, mise à jour basique...';
        
        UPDATE public.profiles 
        SET full_name = 'Administrateur Système'
        WHERE id = admin_user_id;
        
        RAISE NOTICE '✅ Profil mis à jour (sans role)';
        
    -- Cas 3: Le profil existe et la colonne role aussi
    ELSE
        RAISE NOTICE '🔧 Mise à jour complète du profil...';
        
        UPDATE public.profiles 
        SET 
            role = 'admin',
            full_name = 'Administrateur Système'
        WHERE id = admin_user_id;
        
        RAISE NOTICE '✅ Profil mis à jour complètement';
    END IF;
    
END $$;

-- Vérification finale
SELECT 
    '=== VÉRIFICATION FINALE ===' as status;

SELECT 
    u.email,
    u.raw_user_meta_data->>'role' as metadata_role,
    COALESCE(p.role, 'N/A') as profile_role,
    COALESCE(p.full_name, 'N/A') as full_name,
    CASE 
        WHEN u.raw_user_meta_data->>'role' = 'admin' 
        THEN '✅ MÉTADONNÉES OK' 
        ELSE '❌ MÉTADONNÉES KO' 
    END as metadata_status,
    CASE 
        WHEN p.id IS NOT NULL 
        THEN '✅ PROFIL EXISTE' 
        ELSE '❌ PROFIL MANQUANT' 
    END as profile_status
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'admin@terangafoncier.sn';