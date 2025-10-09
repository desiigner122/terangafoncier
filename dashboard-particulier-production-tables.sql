-- Script de création des tables manquantes pour le dashboard particulier production

-- Table pour les tickets de support
CREATE TABLE IF NOT EXISTS support_tickets (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    priority VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'ouvert',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les messages des tickets de support
CREATE TABLE IF NOT EXISTS support_messages (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_from_user BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les préférences utilisateur
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les demandes de construction aux promoteurs
CREATE TABLE IF NOT EXISTS demandes_construction (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    promoteur_id UUID REFERENCES profiles(id),
    projet_id UUID,
    type_construction VARCHAR(100) NOT NULL,
    surface_souhaitee INTEGER,
    budget_max DECIMAL(15,2),
    localisation_preferee TEXT,
    description TEXT,
    documents JSONB DEFAULT '[]',
    statut VARCHAR(50) DEFAULT 'en_attente',
    date_souhaitee DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les candidatures aux projets de promoteurs
CREATE TABLE IF NOT EXISTS candidatures_promoteurs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    promoteur_id UUID REFERENCES profiles(id),
    projet_id UUID,
    type_candidature VARCHAR(100) NOT NULL,
    motivations TEXT,
    budget_disponible DECIMAL(15,2),
    documents JSONB DEFAULT '[]',
    statut VARCHAR(50) DEFAULT 'en_attente',
    date_reponse_souhaitee DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les visites planifiées
CREATE TABLE IF NOT EXISTS visites_planifiees (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    propriete_id UUID,
    type_propriete VARCHAR(50), -- 'terrain', 'zone_communale', 'maison', etc.
    date_visite TIMESTAMP WITH TIME ZONE NOT NULL,
    statut VARCHAR(50) DEFAULT 'planifiee',
    notes TEXT,
    contact_vendeur JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les favoris
CREATE TABLE IF NOT EXISTS favoris_proprietes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    propriete_id UUID NOT NULL,
    type_propriete VARCHAR(50) NOT NULL, -- 'terrain', 'zone_communale', etc.
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les offres reçues
CREATE TABLE IF NOT EXISTS offres_recues (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    proprietaire_id UUID REFERENCES profiles(id),
    propriete_id UUID NOT NULL,
    type_propriete VARCHAR(50) NOT NULL,
    prix_offre DECIMAL(15,2) NOT NULL,
    conditions TEXT,
    date_expiration DATE,
    statut VARCHAR(50) DEFAULT 'en_attente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les demandes de financement
CREATE TABLE IF NOT EXISTS demandes_financement (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type_financement VARCHAR(100) NOT NULL,
    montant_demande DECIMAL(15,2) NOT NULL,
    duree_souhaitee INTEGER, -- en mois
    revenus_mensuels DECIMAL(15,2),
    apport_personnel DECIMAL(15,2),
    propriete_id UUID,
    documents JSONB DEFAULT '[]',
    statut VARCHAR(50) DEFAULT 'en_cours',
    banque_partenaire VARCHAR(255),
    taux_propose DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_demandes_construction_user_id ON demandes_construction(user_id);
CREATE INDEX IF NOT EXISTS idx_candidatures_promoteurs_user_id ON candidatures_promoteurs(user_id);
CREATE INDEX IF NOT EXISTS idx_visites_planifiees_user_id ON visites_planifiees(user_id);
CREATE INDEX IF NOT EXISTS idx_favoris_proprietes_user_id ON favoris_proprietes(user_id);
CREATE INDEX IF NOT EXISTS idx_offres_recues_user_id ON offres_recues(user_id);
CREATE INDEX IF NOT EXISTS idx_demandes_financement_user_id ON demandes_financement(user_id);

-- Triggers pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Ajouter les triggers aux tables
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_demandes_construction_updated_at BEFORE UPDATE ON demandes_construction FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_candidatures_promoteurs_updated_at BEFORE UPDATE ON candidatures_promoteurs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_visites_planifiees_updated_at BEFORE UPDATE ON visites_planifiees FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_offres_recues_updated_at BEFORE UPDATE ON offres_recues FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_demandes_financement_updated_at BEFORE UPDATE ON demandes_financement FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes_construction ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatures_promoteurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE visites_planifiees ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoris_proprietes ENABLE ROW LEVEL SECURITY;
ALTER TABLE offres_recues ENABLE ROW LEVEL SECURITY;
ALTER TABLE demandes_financement ENABLE ROW LEVEL SECURITY;

-- Policies pour support_tickets
CREATE POLICY "Users can view their own support tickets" ON support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own support tickets" ON support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own support tickets" ON support_tickets FOR UPDATE USING (auth.uid() = user_id);

-- Policies pour support_messages
CREATE POLICY "Users can view messages from their tickets" ON support_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = support_messages.ticket_id AND support_tickets.user_id = auth.uid())
);
CREATE POLICY "Users can create messages in their tickets" ON support_messages FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM support_tickets WHERE support_tickets.id = support_messages.ticket_id AND support_tickets.user_id = auth.uid())
);

-- Policies pour user_preferences
CREATE POLICY "Users can manage their own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- Policies pour demandes_construction
CREATE POLICY "Users can manage their own construction requests" ON demandes_construction FOR ALL USING (auth.uid() = user_id);

-- Policies pour candidatures_promoteurs
CREATE POLICY "Users can manage their own developer applications" ON candidatures_promoteurs FOR ALL USING (auth.uid() = user_id);

-- Policies pour visites_planifiees
CREATE POLICY "Users can manage their own planned visits" ON visites_planifiees FOR ALL USING (auth.uid() = user_id);

-- Policies pour favoris_proprietes
CREATE POLICY "Users can manage their own favorites" ON favoris_proprietes FOR ALL USING (auth.uid() = user_id);

-- Policies pour offres_recues
CREATE POLICY "Users can view offers made to them" ON offres_recues FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update offers made to them" ON offres_recues FOR UPDATE USING (auth.uid() = user_id);

-- Policies pour demandes_financement
CREATE POLICY "Users can manage their own financing requests" ON demandes_financement FOR ALL USING (auth.uid() = user_id);