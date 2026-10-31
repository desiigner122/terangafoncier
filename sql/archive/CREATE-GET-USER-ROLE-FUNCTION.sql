-- ===================================================================
-- CRÉATION DE LA FONCTION UTILITAIRE GET_USER_ROLE
-- ===================================================================
-- Objectif: Créer la fonction requise par les politiques de sécurité (RLS)
--           pour déterminer le rôle d'un utilisateur.
-- Date: 12 Octobre 2025
-- ===================================================================

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Vérifie si un utilisateur est authentifié
    IF auth.uid() IS NULL THEN
        RETURN 'anon';
    END IF;

    -- Récupère le rôle depuis la table des profils
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = auth.uid();
    
    -- Retourne le rôle trouvé, ou 'authenticated' par défaut si aucun rôle n'est défini
    RETURN COALESCE(user_role, 'authenticated');
END;
$$;

-- ===================================================================
-- VÉRIFICATION
-- ===================================================================
-- Teste la fonction. En tant qu'admin, cela devrait retourner 'admin'.
-- ===================================================================
SELECT public.get_user_role() as current_role;
