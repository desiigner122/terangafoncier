-- Table pour les paramètres de notification des utilisateurs
CREATE TABLE IF NOT EXISTS user_notification_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email_notifications BOOLEAN DEFAULT true,
    email_messages BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    notification_frequency VARCHAR(20) DEFAULT 'immediate' CHECK (notification_frequency IN ('immediate', 'daily', 'weekly', 'never')),
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    weekend_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger pour updated_at
CREATE TRIGGER update_user_notification_settings_updated_at 
    BEFORE UPDATE ON user_notification_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index
CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON user_notification_settings(user_id);

-- RLS Policies
ALTER TABLE user_notification_settings ENABLE ROW LEVEL SECURITY;

-- Les utilisateurs peuvent voir et modifier leurs propres paramètres
CREATE POLICY "Users can manage own notification settings" ON user_notification_settings
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Les admins peuvent voir tous les paramètres (pour le support)
CREATE POLICY "Admins can view all notification settings" ON user_notification_settings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'support')
        )
    );

COMMENT ON TABLE user_notification_settings IS 'Paramètres de notification personnalisés pour chaque utilisateur';
COMMENT ON COLUMN user_notification_settings.quiet_hours_start IS 'Heure de début des heures silencieuses (pas de notifications)';
COMMENT ON COLUMN user_notification_settings.quiet_hours_end IS 'Heure de fin des heures silencieuses';