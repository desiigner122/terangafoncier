-- ============================================
-- FIX: Corriger le trigger notify_admins_new_user
-- ============================================
-- Date: 11 octobre 2025
-- Problème: Trigger utilise NEW.name au lieu de NEW.full_name
-- Erreur: record "new" has no field "name"
-- ============================================

-- 1. Supprimer l'ancien trigger
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

-- 2. Recréer la fonction avec la bonne colonne (full_name)
CREATE OR REPLACE FUNCTION notify_admins_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (admin_id, type, title, message, data)
    SELECT 
        id,
        'new_user',
        'Nouvel utilisateur inscrit',
        'Un nouvel utilisateur s''est inscrit: ' || COALESCE(NEW.full_name, NEW.email),
        jsonb_build_object('user_id', NEW.id, 'user_email', NEW.email)
    FROM profiles WHERE role = 'admin';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Recréer le trigger
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION notify_admins_new_user();

-- 4. Vérifier que le trigger est créé
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_profile_created';

-- ============================================
-- INSTRUCTIONS
-- ============================================
-- 1. Exécuter CE SCRIPT EN PREMIER
-- 2. PUIS exécuter FIX-CREATE-USER-PROFILE.sql
-- 3. PUIS exécuter FIX-MARKETING-LEADS-TABLE.sql
-- ============================================

-- ✅ FIN DU SCRIPT
