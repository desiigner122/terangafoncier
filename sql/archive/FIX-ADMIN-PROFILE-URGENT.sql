-- ===================================================================
-- FIX URGENT: CRÉATION DU PROFIL ADMINISTRATEUR MANQUANT
-- ===================================================================
-- Objectif: Résoudre l'erreur HTTP 406 et PGRST116 en créant
--           le profil pour l'utilisateur admin.
-- Date: 12 Octobre 2025
-- ===================================================================

-- Insérer le profil uniquement s'il n'existe pas déjà pour éviter les doublons.
INSERT INTO public.profiles (id, full_name, email, role)
SELECT 
    '4089e51f-85e4-4348-ae0c-f00e4f8ff497'::UUID,
    'Admin Teranga',
    'contact@terangafoncier.com',
    'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497'
);

-- ===================================================================
-- VÉRIFICATION
-- ===================================================================
-- Cette requête doit maintenant retourner 1 ligne avec le rôle 'admin'.
-- Si c'est le cas, le problème de connexion est résolu.
-- ===================================================================

SELECT 
    id,
    full_name,
    email,
    role,
    created_at
FROM 
    public.profiles 
WHERE 
    id = '4089e51f-85e4-4348-ae0c-f00e4f8ff497';
