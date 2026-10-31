-- Table pour les notifications du système
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) DEFAULT 'general' CHECK (notification_type IN ('general', 'system', 'admin', 'terrain_request', 'construction_request', 'payment', 'document', 'reminder')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    read_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    reference_id UUID, -- référence vers une demande ou un dossier
    reference_type VARCHAR(50), -- type de référence
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour les requêtes courantes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_reference ON notifications(reference_id, reference_type);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy pour que les utilisateurs voient seulement leurs notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Policy pour que les utilisateurs puissent marquer leurs notifications comme lues
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy pour les admins (créer et gérer toutes les notifications)
CREATE POLICY "Admins can manage all notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'agent_foncier')
        )
    );

-- Policy pour le système (création automatique de notifications)
CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (TRUE); -- À restreindre selon vos besoins de sécurité

COMMENT ON TABLE notifications IS 'Table pour gérer les notifications du système vers les utilisateurs';
COMMENT ON COLUMN notifications.reference_id IS 'ID de référence vers une demande ou un dossier spécifique';
COMMENT ON COLUMN notifications.reference_type IS 'Type de référence (demande_terrain, demande_construction, etc.)';
COMMENT ON COLUMN notifications.action_url IS 'URL vers laquelle rediriger quand l''utilisateur clique sur la notification';
COMMENT ON COLUMN notifications.metadata IS 'Métadonnées additionnelles de la notification (JSON)';