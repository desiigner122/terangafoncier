-- CORRECTION URGENTE STRUCTURE BASE DONNÉES
-- Résout: Blocage étape 2 création utilisateurs
-- Erreur: column users.departement does not exist

-- 1. AJOUT DES COLONNES MANQUANTES POUR LOCALISATION
ALTER TABLE users ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS departement TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS commune TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;

-- 2. AJOUT DES AUTRES COLONNES MANQUANTES IDENTIFIÉES
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS professional_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_type TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 3. MISE À JOUR DES CONTRAINTES SI NÉCESSAIRE
UPDATE users SET verification_status = 'pending' WHERE verification_status IS NULL;
UPDATE users SET user_type = role WHERE user_type IS NULL AND role IS NOT NULL;

-- 4. INDEX POUR PERFORMANCE (optionnel)
CREATE INDEX IF NOT EXISTS idx_users_region ON users(region);
CREATE INDEX IF NOT EXISTS idx_users_departement ON users(departement);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON users(verification_status);

-- 5. VÉRIFICATION DES COLONNES AJOUTÉES
SELECT 'Vérification des colonnes users:' as status;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name IN ('region', 'departement', 'commune', 'address', 'company_name', 'professional_id', 'date_of_birth', 'verification_status', 'user_type', 'avatar_url')
ORDER BY column_name;

-- 6. RÉSULTAT ATTENDU
SELECT '✅ Structure table users corrigée pour support localisation' as result;
