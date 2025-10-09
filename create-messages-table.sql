-- Table pour les messages du système
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'general' CHECK (message_type IN ('general', 'system', 'admin', 'notification', 'terrain_request', 'construction_request')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    read_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    reference_id UUID, -- référence vers une demande de terrain ou construction
    reference_type VARCHAR(50), -- type de référence (demande_terrain, demande_construction, etc.)
    attachments JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour les requêtes courantes
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_read_at ON messages(read_at);
CREATE INDEX IF NOT EXISTS idx_messages_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_messages_reference ON messages(reference_id, reference_type);

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy pour que les utilisateurs voient leurs messages (envoyés ou reçus)
CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (
        auth.uid() = recipient_id OR 
        auth.uid() = sender_id
    );

-- Policy pour que les utilisateurs puissent envoyer des messages
CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Policy pour que les utilisateurs puissent marquer leurs messages comme lus
CREATE POLICY "Users can update own received messages" ON messages
    FOR UPDATE USING (auth.uid() = recipient_id)
    WITH CHECK (auth.uid() = recipient_id);

-- Policy pour les admins (voir tous les messages)
CREATE POLICY "Admins can view all messages" ON messages
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

COMMENT ON TABLE messages IS 'Table pour gérer les messages entre utilisateurs et le système';
COMMENT ON COLUMN messages.reference_id IS 'ID de référence vers une demande ou un dossier spécifique';
COMMENT ON COLUMN messages.reference_type IS 'Type de référence (demande_terrain, demande_construction, etc.)';
COMMENT ON COLUMN messages.metadata IS 'Métadonnées additionnelles du message (JSON)';
COMMENT ON COLUMN messages.attachments IS 'Liste des pièces jointes (JSON array)';