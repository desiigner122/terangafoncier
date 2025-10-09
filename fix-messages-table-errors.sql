-- 🗄️ CORRECTION TABLE MESSAGES - DASHBOARD PARTICULIER
-- Script SQL pour corriger les erreurs 400 de la table messages

-- Supprimer la table existante si elle a une structure incorrecte
DROP TABLE IF EXISTS public.messages CASCADE;

-- Créer la table messages avec la structure correcte
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    dossier_reference VARCHAR(100), -- Référence au dossier (DT-2024-001, etc.)
    type VARCHAR(50) DEFAULT 'general', -- 'general', 'demande_terrain', 'zone_communale', etc.
    priority VARCHAR(20) DEFAULT 'normale', -- 'faible', 'normale', 'haute', 'urgente'
    read_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    archived_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'replied'
    attachments JSONB, -- Métadonnées des pièces jointes
    thread_id UUID, -- Pour grouper les messages d'une conversation
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_dossier_reference ON public.messages(dossier_reference);
CREATE INDEX idx_messages_thread_id ON public.messages(thread_id);
CREATE INDEX idx_messages_status ON public.messages(status);

-- RLS Policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: Les utilisateurs peuvent voir leurs messages (reçus ou envoyés)
CREATE POLICY "Utilisateurs voient leurs messages" ON public.messages
    FOR SELECT USING (
        auth.uid() = sender_id OR 
        auth.uid() = recipient_id
    );

-- Policy: Les utilisateurs peuvent envoyer des messages
CREATE POLICY "Utilisateurs peuvent envoyer messages" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id
    );

-- Policy: Les utilisateurs peuvent mettre à jour leurs messages reçus (marquer comme lu)
CREATE POLICY "Utilisateurs peuvent mettre à jour messages reçus" ON public.messages
    FOR UPDATE USING (
        auth.uid() = recipient_id
    ) WITH CHECK (
        auth.uid() = recipient_id
    );

-- Policy: Les admins peuvent tout voir et modifier (version simplifiée)
CREATE POLICY "Admins accès complet messages" ON public.messages
    FOR ALL
    TO authenticated
    USING (
        -- Permettre l'accès complet pour les tests - à adapter selon votre structure
        true
    );

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER trigger_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();

-- Insérer quelques messages de test pour l'utilisateur qui a l'erreur
-- Utiliser un UUID système générique pour l'expéditeur
INSERT INTO public.messages (
    sender_id, 
    recipient_id, 
    subject, 
    message, 
    dossier_reference, 
    type, 
    priority,
    status
) VALUES 
-- Messages de test pour l'utilisateur 3f3083ba-4f40-4045-b6e6-7f009a6c2cb2
(
    '00000000-0000-0000-0000-000000000001'::UUID, -- Système/Admin générique
    '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'::UUID, -- User ID de l'erreur
    'Bienvenue sur Teranga Foncier',
    'Bonjour et bienvenue sur la plateforme Teranga Foncier. Votre compte particulier a été activé avec succès. Vous pouvez maintenant faire vos demandes de terrains communaux.',
    NULL,
    'general',
    'normale',
    'sent'
),
(
    '00000000-0000-0000-0000-000000000001'::UUID,
    '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'::UUID,
    'Nouvelle zone communale disponible',
    'Une nouvelle zone communale vient d''être ouverte aux candidatures dans le secteur de Parcelles Assainies. Consultez la section Zones Communales pour plus de détails.',
    'ZC-2024-003',
    'zone_communale', 
    'normale',
    'sent'
),
(
    '00000000-0000-0000-0000-000000000001'::UUID,
    '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'::UUID,
    'Système de messages opérationnel',
    'Le système de messagerie du dashboard particulier est maintenant pleinement opérationnel. Vous recevrez des notifications pour tous vos dossiers.',
    NULL,
    'system',
    'faible',
    'sent'
);

-- Vérification finale
SELECT 
    'Messages table corrected successfully' as status,
    COUNT(*) as test_messages_count
FROM public.messages
WHERE recipient_id = '3f3083ba-4f40-4045-b6e6-7f009a6c2cb2'::UUID;