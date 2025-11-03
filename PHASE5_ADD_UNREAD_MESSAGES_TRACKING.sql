-- ============================================================
-- PHASE 5: Compteur messages non lus
-- Ajoute le tracking de lecture des messages par utilisateur
-- @author Teranga Foncier Team
-- ============================================================

-- ÉTAPE 1: Ajouter colonne read_by (JSONB array des users qui ont lu)
-- Permet de tracker qui a lu chaque message
ALTER TABLE purchase_case_messages 
ADD COLUMN IF NOT EXISTS read_by JSONB DEFAULT '[]'::jsonb;

-- ÉTAPE 2: Créer index sur read_by pour performances
CREATE INDEX IF NOT EXISTS idx_case_messages_read_by 
ON purchase_case_messages USING GIN (read_by);

-- ÉTAPE 3: Fonction RPC pour marquer messages comme lus
-- Marque tous les messages d'un dossier comme lus par l'utilisateur actuel
CREATE OR REPLACE FUNCTION mark_messages_as_read(
  p_case_id UUID,
  p_user_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_updated_count INTEGER := 0;
BEGIN
  -- Mettre à jour tous les messages non lus de ce dossier
  UPDATE purchase_case_messages
  SET 
    read_by = CASE 
      WHEN read_by @> to_jsonb(p_user_id::text) THEN read_by
      ELSE read_by || to_jsonb(p_user_id::text)
    END,
    read_at = CASE 
      WHEN read_at IS NULL THEN NOW()
      ELSE read_at
    END,
    updated_at = NOW()
  WHERE 
    case_id = p_case_id
    AND sent_by != p_user_id  -- Ne pas marquer ses propres messages
    AND NOT (read_by @> to_jsonb(p_user_id::text));  -- Seulement les non-lus
  
  GET DIAGNOSTICS v_updated_count = ROW_COUNT;
  
  RETURN v_updated_count;
END;
$$;

-- ÉTAPE 4: Fonction RPC pour compter messages non lus
-- Compte les messages non lus pour un utilisateur dans un dossier
CREATE OR REPLACE FUNCTION count_unread_messages(
  p_case_id UUID,
  p_user_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_unread_count INTEGER := 0;
BEGIN
  SELECT COUNT(*)
  INTO v_unread_count
  FROM purchase_case_messages
  WHERE 
    case_id = p_case_id
    AND sent_by != p_user_id  -- Exclure ses propres messages
    AND NOT (read_by @> to_jsonb(p_user_id::text));  -- Messages non lus
  
  RETURN v_unread_count;
END;
$$;

-- ÉTAPE 5: Fonction RPC pour compter TOUS messages non lus d'un user
-- Compte le total de messages non lus à travers TOUS les dossiers
CREATE OR REPLACE FUNCTION count_all_unread_messages(
  p_user_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_unread_count INTEGER := 0;
BEGIN
  SELECT COUNT(*)
  INTO v_unread_count
  FROM purchase_case_messages pcm
  INNER JOIN purchase_cases pc ON pc.id = pcm.case_id
  WHERE 
    (pc.buyer_id = p_user_id OR pc.seller_id = p_user_id OR pc.notaire_id = p_user_id)
    AND pcm.sent_by != p_user_id  -- Exclure ses propres messages
    AND NOT (pcm.read_by @> to_jsonb(p_user_id::text));  -- Messages non lus
  
  RETURN v_unread_count;
END;
$$;

-- ÉTAPE 6: Vue pour messages avec statut de lecture
-- Facilite les requêtes frontend
CREATE OR REPLACE VIEW purchase_case_messages_with_read_status AS
SELECT 
  pcm.*,
  (pcm.read_by @> to_jsonb(auth.uid()::text)) AS is_read_by_current_user,
  (pcm.sent_by = auth.uid()) AS is_sent_by_current_user,
  p_sender.full_name AS sender_name,
  p_sender.avatar_url AS sender_avatar
FROM purchase_case_messages pcm
LEFT JOIN profiles p_sender ON p_sender.id = pcm.sent_by;

-- ÉTAPE 7: Accorder permissions
GRANT EXECUTE ON FUNCTION mark_messages_as_read(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION count_unread_messages(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION count_all_unread_messages(UUID) TO authenticated;
GRANT SELECT ON purchase_case_messages_with_read_status TO authenticated;

-- ÉTAPE 8: Trigger pour auto-marquer read_at quand ajouté à read_by
CREATE OR REPLACE FUNCTION update_read_at_on_read_by_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Si read_by change et read_at est NULL, le définir
  IF NEW.read_by != OLD.read_by AND OLD.read_at IS NULL THEN
    NEW.read_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_update_read_at
  BEFORE UPDATE ON purchase_case_messages
  FOR EACH ROW
  WHEN (OLD.read_by IS DISTINCT FROM NEW.read_by)
  EXECUTE FUNCTION update_read_at_on_read_by_change();

-- ============================================================
-- VÉRIFICATION
-- ============================================================

-- Test 1: Vérifier que la colonne existe
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'purchase_case_messages'
AND column_name = 'read_by';

-- Test 2: Vérifier que les fonctions existent
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name IN (
  'mark_messages_as_read',
  'count_unread_messages',
  'count_all_unread_messages'
);

-- Test 3: Compter messages non lus pour user actuel (exemple)
-- SELECT count_all_unread_messages(auth.uid());

-- ============================================================
-- NOTES D'UTILISATION
-- ============================================================

/*
FRONTEND USAGE:

1. Marquer messages comme lus quand tab Messages ouvert:
   await supabase.rpc('mark_messages_as_read', {
     p_case_id: caseId,
     p_user_id: userId
   });

2. Compter messages non lus pour un dossier:
   const { data } = await supabase.rpc('count_unread_messages', {
     p_case_id: caseId,
     p_user_id: userId
   });

3. Compter TOUS messages non lus:
   const { data } = await supabase.rpc('count_all_unread_messages', {
     p_user_id: userId
   });

4. Query avec vue (includes read status):
   const { data } = await supabase
     .from('purchase_case_messages_with_read_status')
     .select('*')
     .eq('case_id', caseId);
*/
