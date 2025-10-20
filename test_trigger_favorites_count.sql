-- Test du trigger favorites_count
-- Remplacez les IDs par des valeurs réelles de votre base

-- Ce script teste le trigger favorites_count en utilisant des IDs existants automatiquement
-- Il choisit un user et une property existants dans la base et effectue les vérifications
DO
$$
DECLARE
	v_user_id uuid;
	v_property_id uuid;
	v_before_count int;
	v_after_count int;
	v_fav_id uuid := gen_random_uuid();
BEGIN
	-- Récupérer un utilisateur existant et une propriété existante
	SELECT id INTO v_user_id FROM auth.users LIMIT 1;
	IF v_user_id IS NULL THEN
		RAISE EXCEPTION 'Aucun utilisateur trouvé dans auth.users';
	END IF;

	SELECT id INTO v_property_id FROM properties WHERE favorites_count IS NOT NULL LIMIT 1;
	IF v_property_id IS NULL THEN
		RAISE EXCEPTION 'Aucune propriété valide trouvée dans properties';
	END IF;

	-- Stocker le compteur avant insertion
	SELECT favorites_count INTO v_before_count FROM properties WHERE id = v_property_id;

	-- Insérer un favori
	INSERT INTO favorites (id, user_id, property_id, created_at)
	VALUES (v_fav_id, v_user_id, v_property_id, NOW());

	-- Vérifier incrémentation
	SELECT favorites_count INTO v_after_count FROM properties WHERE id = v_property_id;
	RAISE NOTICE 'Before=% before_count: %, After=%', v_property_id, v_before_count, v_after_count;
	IF v_after_count <> v_before_count + 1 THEN
		RAISE EXCEPTION 'favorites_count not incremented (before=% after=%)', v_before_count, v_after_count;
	END IF;

	-- Supprimer le favori
	DELETE FROM favorites WHERE id = v_fav_id;

	-- Vérifier décrémentation
	SELECT favorites_count INTO v_after_count FROM properties WHERE id = v_property_id;
	IF v_after_count <> v_before_count THEN
		RAISE EXCEPTION 'favorites_count not restored after delete (before=% after=%)', v_before_count, v_after_count;
	END IF;

	RAISE NOTICE 'Trigger favorites_count works as expected for property %', v_property_id;
END;
$$;

-- Si favorites_count ne change pas, le trigger n'est pas actif ou la fonction n'est pas correcte.
