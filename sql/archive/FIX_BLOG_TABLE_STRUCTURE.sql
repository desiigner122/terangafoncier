-- Script pour ajouter les colonnes manquantes à la table blog
-- Exécuter dans l'interface Supabase SQL Editor

-- 1. Ajouter la colonne slug (unique et indexed)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'slug') THEN
        ALTER TABLE blog ADD COLUMN slug TEXT UNIQUE;
        CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog(slug);
    END IF;
END $$;

-- 2. Ajouter la colonne excerpt
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'excerpt') THEN
        ALTER TABLE blog ADD COLUMN excerpt TEXT;
    END IF;
END $$;

-- 3. Ajouter la colonne tags (array de text)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'tags') THEN
        ALTER TABLE blog ADD COLUMN tags TEXT[];
    END IF;
END $$;

-- 4. Ajouter la colonne author_name
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'author_name') THEN
        ALTER TABLE blog ADD COLUMN author_name TEXT DEFAULT 'Admin Teranga';
    END IF;
END $$;

-- 5. Ajouter la colonne image_url si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'image_url') THEN
        ALTER TABLE blog ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- 6. Ajouter la colonne published si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'published') THEN
        ALTER TABLE blog ADD COLUMN published BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 7. Ajouter la colonne category si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'category') THEN
        ALTER TABLE blog ADD COLUMN category TEXT;
    END IF;
END $$;

-- 8. Générer des slugs pour les articles existants qui n'en ont pas
UPDATE blog 
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- 9. Vérifier les permissions RLS pour les utilisateurs admin
-- Créer une politique pour permettre aux administrateurs d'insérer des articles
DROP POLICY IF EXISTS "Admins can insert blog posts" ON blog;
CREATE POLICY "Admins can insert blog posts" ON blog
    FOR INSERT WITH CHECK (true); -- Temporairement permissif pour test

-- 10. Politique pour permettre la lecture publique
DROP POLICY IF EXISTS "Anyone can read published blog posts" ON blog;
CREATE POLICY "Anyone can read published blog posts" ON blog
    FOR SELECT USING (published = true OR published IS NULL);

-- 11. Politique pour permettre aux admins de modifier
DROP POLICY IF EXISTS "Admins can update blog posts" ON blog;
CREATE POLICY "Admins can update blog posts" ON blog
    FOR UPDATE USING (true); -- Temporairement permissif pour test

COMMENT ON TABLE blog IS 'Table des articles de blog avec toutes les colonnes requises';
