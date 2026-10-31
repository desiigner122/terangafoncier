-- Créer la table user_avatars pour stocker les avatars des utilisateurs
CREATE TABLE IF NOT EXISTS public.user_avatars (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    avatar_data text NOT NULL, -- Base64 encoded image
    file_name text,
    file_size integer,
    content_type text DEFAULT 'image/jpeg',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Activer RLS sur la table
ALTER TABLE public.user_avatars ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs puissent voir et modifier leur propre avatar
CREATE POLICY "Users can view their own avatar" ON public.user_avatars
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own avatar" ON public.user_avatars
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own avatar" ON public.user_avatars
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own avatar" ON public.user_avatars
    FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_user_avatars_updated_at
    BEFORE UPDATE ON public.user_avatars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour sauvegarder l'avatar d'un utilisateur
CREATE OR REPLACE FUNCTION save_user_avatar(
    p_user_id uuid,
    p_avatar_data text,
    p_file_name text DEFAULT NULL,
    p_file_size integer DEFAULT NULL,
    p_content_type text DEFAULT 'image/jpeg'
)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    -- Insérer ou mettre à jour l'avatar
    INSERT INTO public.user_avatars (user_id, avatar_data, file_name, file_size, content_type)
    VALUES (p_user_id, p_avatar_data, p_file_name, p_file_size, p_content_type)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        avatar_data = EXCLUDED.avatar_data,
        file_name = EXCLUDED.file_name,
        file_size = EXCLUDED.file_size,
        content_type = EXCLUDED.content_type,
        updated_at = timezone('utc'::text, now());
    
    -- Retourner les informations de l'avatar
    SELECT json_build_object(
        'id', id,
        'user_id', user_id,
        'file_name', file_name,
        'file_size', file_size,
        'content_type', content_type,
        'created_at', created_at,
        'updated_at', updated_at
    ) INTO result
    FROM public.user_avatars
    WHERE user_id = p_user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour récupérer l'avatar d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_avatar(p_user_id uuid)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'id', id,
        'user_id', user_id,
        'avatar_data', avatar_data,
        'file_name', file_name,
        'file_size', file_size,
        'content_type', content_type,
        'created_at', created_at,
        'updated_at', updated_at
    ) INTO result
    FROM public.user_avatars
    WHERE user_id = p_user_id;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Accorder les permissions nécessaires
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_avatars TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION save_user_avatar TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_avatar TO authenticated;
