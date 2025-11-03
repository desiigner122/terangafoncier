-- =====================================================
-- SEMAINE 1 - JOUR 1: EMAIL VERIFICATION AUTOMATIQUE
-- =====================================================
-- Créé le: 2025-11-03
-- Objectif: Auto-update verification_status quand email confirmé
-- =====================================================

-- Fonction pour mettre à jour verification_status automatiquement
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  -- Si l'email vient d'être confirmé (email_confirmed_at a changé de NULL à une date)
  IF (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL) THEN
    -- Mettre à jour le profil correspondant
    UPDATE public.profiles
    SET 
      verification_status = 'verified',
      updated_at = NOW()
    WHERE id = NEW.id;
    
    RAISE LOG 'Email vérifié automatiquement pour user_id: %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer trigger existant si présent
DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;

-- Créer trigger sur auth.users qui surveille email_confirmed_at
CREATE TRIGGER on_auth_user_email_verified
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  WHEN (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
  EXECUTE FUNCTION public.handle_email_verification();

-- Vérifier que la colonne verification_status existe dans profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'verification_status'
  ) THEN
    ALTER TABLE public.profiles 
    ADD COLUMN verification_status VARCHAR(20) DEFAULT 'unverified';
    
    RAISE NOTICE 'Colonne verification_status ajoutée à profiles';
  END IF;
END $$;

-- Créer index pour améliorer performance
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status 
ON public.profiles(verification_status);

-- Mettre à jour les profils existants avec email déjà vérifié
UPDATE public.profiles p
SET verification_status = 'verified'
FROM auth.users u
WHERE p.id = u.id 
AND u.email_confirmed_at IS NOT NULL
AND p.verification_status = 'unverified';

-- Politique RLS pour verification_status (lecture publique, modification admin seulement)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Les users peuvent voir leur propre verification_status
CREATE POLICY "Users can view own verification status"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Seuls admins/system peuvent modifier verification_status manuellement
CREATE POLICY "Only admins can update verification status"
ON public.profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'super_admin')
  )
);

COMMENT ON FUNCTION public.handle_email_verification() IS 
'Trigger function: Auto-update verification_status=verified quand email confirmé';

COMMENT ON TRIGGER on_auth_user_email_verified ON auth.users IS
'Déclenche handle_email_verification() quand email_confirmed_at change';

-- =====================================================
-- TESTS
-- =====================================================

-- Test 1: Vérifier que le trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_email_verified';

-- Test 2: Compter profils avec email vérifié
SELECT 
  verification_status,
  COUNT(*) as total
FROM public.profiles
GROUP BY verification_status;

-- =====================================================
-- ROLLBACK (si nécessaire)
-- =====================================================
-- DROP TRIGGER IF EXISTS on_auth_user_email_verified ON auth.users;
-- DROP FUNCTION IF EXISTS public.handle_email_verification();
-- DROP INDEX IF EXISTS idx_profiles_verification_status;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS verification_status;
