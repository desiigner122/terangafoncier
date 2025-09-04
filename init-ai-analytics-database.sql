-- Script d'initialisation pour Intelligence Artificielle et Analytics Globaux
-- Teranga Foncier - Base de données Supabase

-- ===============================================
-- 1. TABLE POUR LES INTERACTIONS IA
-- ===============================================

-- Table pour auditer les interactions avec l'IA
CREATE TABLE IF NOT EXISTS ai_interactions (
    id SERIAL PRIMARY KEY,
    interaction_type VARCHAR(50) NOT NULL,
    input_data JSONB,
    output_data JSONB,
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processing_time_ms INTEGER,
    ai_model VARCHAR(50) DEFAULT 'gpt-4',
    confidence_score FLOAT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_ai_interactions_type ON ai_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_user ON ai_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_date ON ai_interactions(created_at);

-- ===============================================
-- 2. TABLES POUR ANALYTICS GLOBAUX
-- ===============================================

-- Table pour les sessions utilisateurs
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    country VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    page_views_count INTEGER DEFAULT 0,
    duration_seconds INTEGER
);

-- Index pour les sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(last_activity);
CREATE INDEX IF NOT EXISTS idx_user_sessions_country ON user_sessions(country);

-- Table pour les vues de pages
CREATE TABLE IF NOT EXISTS page_views (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES user_sessions(id),
    user_id UUID REFERENCES users(id),
    page_url TEXT NOT NULL,
    page_title VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    referrer TEXT,
    time_on_page INTEGER,
    scroll_depth FLOAT,
    country VARCHAR(100)
);

-- Index pour les vues de pages
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_timestamp ON page_views(timestamp);
CREATE INDEX IF NOT EXISTS idx_page_views_url ON page_views(page_url);

-- Table pour les activités utilisateurs
CREATE TABLE IF NOT EXISTS user_activities (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    activity_type VARCHAR(50) NOT NULL,
    activity_data JSONB,
    date DATE DEFAULT CURRENT_DATE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    country VARCHAR(100),
    ip_address INET
);

-- Index pour les activités
CREATE INDEX IF NOT EXISTS idx_user_activities_user ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_type ON user_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activities_date ON user_activities(date);
CREATE INDEX IF NOT EXISTS idx_user_activities_country ON user_activities(country);

-- Table pour les transactions
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL,
    amount DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'XOF',
    property_id INTEGER,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Index pour les transactions
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- ===============================================
-- 3. TABLES POUR MÉTRIQUES ET RAPPORTS
-- ===============================================

-- Table pour stocker les métriques calculées
CREATE TABLE IF NOT EXISTS calculated_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value NUMERIC,
    dimension_1 VARCHAR(100), -- ex: country
    dimension_2 VARCHAR(100), -- ex: user_role
    dimension_3 VARCHAR(100), -- ex: device_type
    calculation_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les métriques
CREATE INDEX IF NOT EXISTS idx_calculated_metrics_name ON calculated_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_calculated_metrics_date ON calculated_metrics(calculation_date);
CREATE INDEX IF NOT EXISTS idx_calculated_metrics_dim1 ON calculated_metrics(dimension_1);

-- Table pour les rapports IA générés
CREATE TABLE IF NOT EXISTS ai_reports (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(50) NOT NULL,
    report_title VARCHAR(255),
    report_data JSONB NOT NULL,
    ai_insights JSONB,
    generated_by UUID REFERENCES users(id),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    report_period_start DATE,
    report_period_end DATE,
    confidence_score FLOAT,
    is_scheduled BOOLEAN DEFAULT FALSE
);

-- Index pour les rapports
CREATE INDEX IF NOT EXISTS idx_ai_reports_type ON ai_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_ai_reports_date ON ai_reports(generated_at);
CREATE INDEX IF NOT EXISTS idx_ai_reports_user ON ai_reports(generated_by);

-- ===============================================
-- 4. DONNÉES INITIALES ET CONFIGURATION
-- ===============================================

-- Ajouter colonne country aux users si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='country') THEN
        ALTER TABLE users ADD COLUMN country VARCHAR(100) DEFAULT 'Sénégal';
    END IF;
END $$;

-- Ajouter d'autres colonnes utiles aux users
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_active_at') THEN
        ALTER TABLE users ADD COLUMN last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='verification_status') THEN
        ALTER TABLE users ADD COLUMN verification_status VARCHAR(20) DEFAULT 'pending';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='status') THEN
        ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
END $$;

-- Données de test pour les pays (optionnel)
INSERT INTO calculated_metrics (metric_name, metric_value, dimension_1, calculation_date) VALUES
('total_users', 15420, 'Sénégal', CURRENT_DATE),
('total_users', 8930, 'France', CURRENT_DATE),
('total_users', 6780, 'Mali', CURRENT_DATE),
('total_users', 5210, 'Burkina Faso', CURRENT_DATE),
('total_users', 4980, 'Côte d''Ivoire', CURRENT_DATE),
('total_users', 3450, 'Canada', CURRENT_DATE),
('total_users', 2890, 'Espagne', CURRENT_DATE),
('total_users', 2340, 'Maroc', CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- ===============================================
-- 5. FONCTIONS UTILITAIRES
-- ===============================================

-- Fonction pour calculer les métriques journalières
CREATE OR REPLACE FUNCTION calculate_daily_metrics()
RETURNS void AS $$
BEGIN
    -- Insérer les métriques du jour précédent
    INSERT INTO calculated_metrics (metric_name, metric_value, dimension_1, calculation_date)
    SELECT 
        'daily_active_users',
        COUNT(DISTINCT user_id),
        country,
        CURRENT_DATE - INTERVAL '1 day'
    FROM user_activities 
    WHERE date = CURRENT_DATE - INTERVAL '1 day'
    GROUP BY country;
    
    -- Autres métriques...
    INSERT INTO calculated_metrics (metric_name, metric_value, calculation_date)
    VALUES ('calculation_completed', 1, CURRENT_DATE - INTERVAL '1 day');
END;
$$ LANGUAGE plpgsql;

-- Fonction pour nettoyer les anciennes données
CREATE OR REPLACE FUNCTION cleanup_old_analytics_data()
RETURNS void AS $$
BEGIN
    -- Supprimer les sessions de plus de 90 jours
    DELETE FROM user_sessions 
    WHERE start_time < NOW() - INTERVAL '90 days';
    
    -- Supprimer les vues de pages de plus de 60 jours
    DELETE FROM page_views 
    WHERE timestamp < NOW() - INTERVAL '60 days';
    
    -- Supprimer les activités de plus de 180 jours
    DELETE FROM user_activities 
    WHERE timestamp < NOW() - INTERVAL '180 days';
END;
$$ LANGUAGE plpgsql;

-- ===============================================
-- 6. TRIGGERS POUR MISE À JOUR AUTOMATIQUE
-- ===============================================

-- Trigger pour mettre à jour last_active_at des utilisateurs
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET last_active_at = NOW() 
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger
DROP TRIGGER IF EXISTS trigger_update_user_last_active ON user_activities;
CREATE TRIGGER trigger_update_user_last_active
    AFTER INSERT ON user_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_user_last_active();

-- ===============================================
-- 7. PERMISSIONS ET SÉCURITÉ RLS
-- ===============================================

-- Activer RLS sur les nouvelles tables
ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculated_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;

-- Politiques pour les admins (accès total)
CREATE POLICY "Admin access all ai_interactions" ON ai_interactions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
    );

CREATE POLICY "Admin access all user_sessions" ON user_sessions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
    );

CREATE POLICY "Admin access all page_views" ON page_views
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
    );

CREATE POLICY "Admin access all user_activities" ON user_activities
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
    );

CREATE POLICY "Admin access all transactions" ON transactions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
    );

CREATE POLICY "Admin access all calculated_metrics" ON calculated_metrics
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
    );

CREATE POLICY "Admin access all ai_reports" ON ai_reports
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Admin')
    );

-- Politiques pour les utilisateurs (accès à leurs propres données)
CREATE POLICY "Users access own sessions" ON user_sessions
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users access own activities" ON user_activities
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users access own transactions" ON transactions
    FOR ALL USING (user_id = auth.uid());

-- ===============================================
-- 8. VUES MATÉRIALISÉES POUR PERFORMANCE
-- ===============================================

-- Vue pour les statistiques par pays
CREATE MATERIALIZED VIEW IF NOT EXISTS country_stats AS
SELECT 
    u.country,
    COUNT(*) as total_users,
    COUNT(CASE WHEN u.last_active_at > NOW() - INTERVAL '30 days' THEN 1 END) as active_users,
    COUNT(CASE WHEN u.created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d,
    AVG(CASE WHEN t.amount IS NOT NULL THEN t.amount END) as avg_transaction_amount,
    COUNT(t.id) as total_transactions
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
GROUP BY u.country;

-- Index sur la vue matérialisée
CREATE UNIQUE INDEX IF NOT EXISTS idx_country_stats_country ON country_stats(country);

-- Vue pour les métriques temps réel
CREATE MATERIALIZED VIEW IF NOT EXISTS real_time_metrics AS
SELECT 
    COUNT(DISTINCT s.user_id) as active_users_1h,
    COUNT(DISTINCT CASE WHEN t.created_at > NOW() - INTERVAL '1 day' THEN t.user_id END) as transactions_today,
    COALESCE(SUM(CASE WHEN t.created_at > NOW() - INTERVAL '1 day' THEN t.amount END), 0) as revenue_today,
    COUNT(CASE WHEN pv.timestamp > NOW() - INTERVAL '1 day' THEN pv.id END) as page_views_today
FROM user_sessions s
LEFT JOIN transactions t ON s.user_id = t.user_id
LEFT JOIN page_views pv ON s.id = pv.session_id
WHERE s.last_activity > NOW() - INTERVAL '1 hour';

-- ===============================================
-- FINALISATION
-- ===============================================

-- Rafraîchir les vues matérialisées
REFRESH MATERIALIZED VIEW country_stats;
REFRESH MATERIALIZED VIEW real_time_metrics;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Base de données initialisée avec succès pour l''IA et Analytics Globaux !';
    RAISE NOTICE 'Tables créées: ai_interactions, user_sessions, page_views, user_activities, transactions, calculated_metrics, ai_reports';
    RAISE NOTICE 'Vues matérialisées: country_stats, real_time_metrics';
    RAISE NOTICE 'Fonctions: calculate_daily_metrics(), cleanup_old_analytics_data()';
    RAISE NOTICE 'Prêt pour le dashboard global admin !';
END $$;
