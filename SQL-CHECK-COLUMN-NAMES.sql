-- CORRECTION DES COLONNES OWNER_ID MAL UTILISÉES
-- Certaines tables utilisent buyer_id ou property_id, pas owner_id

-- ========================================
-- DIAGNOSTIC: Vérifier les colonnes réelles
-- ========================================

-- 1. property_inquiries - devrait avoir property_id ET buyer_id
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'property_inquiries' 
  AND column_name IN ('owner_id', 'property_id', 'buyer_id', 'seller_id');

-- 2. purchase_requests - devrait avoir property_id ET buyer_id
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'purchase_requests' 
  AND column_name IN ('owner_id', 'property_id', 'buyer_id', 'seller_id');

-- 3. crm_contacts - vérifier la vraie colonne pour le vendeur
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'crm_contacts' 
  AND column_name IN ('owner_id', 'vendor_id', 'seller_id', 'agent_id', 'created_by');

-- 4. property_photos - vérifier la colonne pour lier au property
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'property_photos' 
  AND column_name IN ('owner_id', 'property_id', 'uploaded_by');

-- 5. messages - vérifier la vraie colonne de conversation
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'messages' 
  AND column_name IN ('conversation_id', 'thread_id', 'chat_id');

-- 6. wallet_connections - vérifier la colonne de date de connexion
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'wallet_connections' 
  AND column_name IN ('connected_at', 'created_at', 'connection_date');

-- ========================================
-- NOTE: Après avoir exécuté ces queries,
-- copiez-moi les résultats pour que je corrige
-- les fichiers React qui utilisent les mauvais noms
-- ========================================
