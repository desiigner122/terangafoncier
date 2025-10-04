import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;

export async function getDatabase() {
  if (db) return db;

  const dbPath = path.join(__dirname, 'database.sqlite');
  db = new Database(dbPath);

  console.log('✅ Connexion SQLite établie');
  
  // Activer les clés étrangères
  db.pragma('foreign_keys = ON');
  
  await createTables();
  console.log('✅ Tables étendues créées avec succès');
  
  return db;
}

async function createTables() {
  // ===========================================
  // TABLES UTILISATEURS ÉTENDUES
  // ===========================================
  
  // Table utilisateurs principale
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      telephone TEXT,
      role TEXT NOT NULL DEFAULT 'particulier',
      status TEXT DEFAULT 'active',
      email_verified BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Profils utilisateur étendus par rôle
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      business_data TEXT, -- JSON pour données spécifiques au rôle
      preferences TEXT,   -- JSON pour préférences utilisateur
      avatar_url TEXT,
      bio TEXT,
      location TEXT,
      website TEXT,
      social_links TEXT,  -- JSON pour liens sociaux
      verification_status TEXT DEFAULT 'pending',
      verification_documents TEXT, -- JSON pour documents
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Sessions utilisateur
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      device_info TEXT,
      ip_address TEXT,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Permissions utilisateur
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      permission TEXT NOT NULL,
      granted_by INTEGER,
      granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (granted_by) REFERENCES users(id)
    )
  `);

  // ===========================================
  // TABLES PROPRIÉTÉS ÉTENDUES
  // ===========================================
  
  // Table propriétés étendue
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL, -- villa, appartement, terrain, bureau, etc.
      prix DECIMAL(15,2) NOT NULL,
      devise TEXT DEFAULT 'FCFA',
      superficie DECIMAL(10,2),
      superficie_unite TEXT DEFAULT 'm²',
      localisation TEXT NOT NULL,
      adresse_complete TEXT,
      coordonnees_gps TEXT, -- JSON {lat, lng}
      nombre_chambres INTEGER,
      nombre_salles_bain INTEGER,
      nombre_pieces INTEGER,
      equipements TEXT, -- JSON array
      caracteristiques TEXT, -- JSON object
      proprietaire_id INTEGER NOT NULL,
      agent_id INTEGER, -- Agent gérant la propriété
      statut TEXT DEFAULT 'disponible', -- disponible, vendu, retiré, en_attente
      statut_verification TEXT DEFAULT 'en_attente', -- vérifié, en_attente, rejeté
      priority_score INTEGER DEFAULT 0, -- Score de priorité pour l'affichage
      view_count INTEGER DEFAULT 0,
      favorite_count INTEGER DEFAULT 0,
      inquiry_count INTEGER DEFAULT 0,
      featured BOOLEAN DEFAULT FALSE,
      published BOOLEAN DEFAULT TRUE,
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (proprietaire_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (agent_id) REFERENCES users(id)
    )
  `);

  // Images des propriétés
  db.exec(`
    CREATE TABLE IF NOT EXISTS property_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      alt_text TEXT,
      order_index INTEGER DEFAULT 0,
      is_primary BOOLEAN DEFAULT FALSE,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
    )
  `);

  // Documents des propriétés
  db.exec(`
    CREATE TABLE IF NOT EXISTS property_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      document_type TEXT NOT NULL, -- titre_foncier, acte_vente, plan_cadastral, etc.
      file_url TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_size INTEGER,
      mime_type TEXT,
      verified BOOLEAN DEFAULT FALSE,
      verified_by INTEGER,
      verified_at DATETIME,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
      FOREIGN KEY (verified_by) REFERENCES users(id)
    )
  `);

  // Vues des propriétés (analytics)
  db.exec(`
    CREATE TABLE IF NOT EXISTS property_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      user_id INTEGER,
      ip_address TEXT,
      user_agent TEXT,
      referrer TEXT,
      duration INTEGER, -- durée en secondes
      viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Favoris
  db.exec(`
    CREATE TABLE IF NOT EXISTS property_favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      property_id INTEGER NOT NULL,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
      UNIQUE(user_id, property_id)
    )
  `);

  // Demandes d'information
  db.exec(`
    CREATE TABLE IF NOT EXISTS property_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      contact_preference TEXT DEFAULT 'email', -- email, phone, whatsapp
      status TEXT DEFAULT 'nouveau', -- nouveau, lu, répondu, fermé
      response TEXT,
      responded_by INTEGER,
      responded_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (responded_by) REFERENCES users(id)
    )
  `);

  // ===========================================
  // TABLES TRANSACTIONS ÉTENDUES
  // ===========================================

  // Transactions principales
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_ref TEXT UNIQUE NOT NULL,
      property_id INTEGER NOT NULL,
      buyer_id INTEGER NOT NULL,
      seller_id INTEGER NOT NULL,
      agent_id INTEGER,
      notary_id INTEGER,
      type TEXT NOT NULL, -- vente, location, investissement
      amount DECIMAL(15,2) NOT NULL,
      currency TEXT DEFAULT 'FCFA',
      payment_method TEXT, -- comptant, crédit, mixte
      payment_terms TEXT, -- JSON pour conditions de paiement
      status TEXT DEFAULT 'initié', -- initié, en_cours, complété, annulé
      contract_signed BOOLEAN DEFAULT FALSE,
      contract_url TEXT,
      completion_date DATETIME,
      commission_rate DECIMAL(5,2), -- Taux commission agent
      commission_amount DECIMAL(15,2),
      fees TEXT, -- JSON pour différents frais
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties(id),
      FOREIGN KEY (buyer_id) REFERENCES users(id),
      FOREIGN KEY (seller_id) REFERENCES users(id),
      FOREIGN KEY (agent_id) REFERENCES users(id),
      FOREIGN KEY (notary_id) REFERENCES users(id)
    )
  `);

  // Paiements
  db.exec(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id INTEGER NOT NULL,
      payment_ref TEXT UNIQUE NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      currency TEXT DEFAULT 'FCFA',
      method TEXT NOT NULL, -- carte, virement, mobile_money, crypto
      status TEXT DEFAULT 'en_attente', -- en_attente, confirmé, échoué, remboursé
      gateway TEXT, -- orange_money, wave, paypal, stripe, etc.
      gateway_transaction_id TEXT,
      gateway_response TEXT, -- JSON réponse gateway
      fee DECIMAL(10,2) DEFAULT 0,
      processed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
    )
  `);

  // Comptes séquestre
  db.exec(`
    CREATE TABLE IF NOT EXISTS escrow_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id INTEGER NOT NULL,
      account_ref TEXT UNIQUE NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      currency TEXT DEFAULT 'FCFA',
      status TEXT DEFAULT 'ouvert', -- ouvert, libéré, annulé
      release_conditions TEXT, -- JSON conditions de libération
      managed_by INTEGER, -- Utilisateur gestionnaire
      released_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (transaction_id) REFERENCES transactions(id),
      FOREIGN KEY (managed_by) REFERENCES users(id)
    )
  `);

  // ===========================================
  // TABLES AGENTS FONCIERS
  // ===========================================

  // Profils agents
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      license_number TEXT UNIQUE,
      license_expiry DATETIME,
      agency_name TEXT,
      agency_address TEXT,
      specializations TEXT, -- JSON array
      service_areas TEXT, -- JSON array zones géographiques
      commission_rate DECIMAL(5,2) DEFAULT 3.0,
      rating DECIMAL(3,2) DEFAULT 0.0,
      total_sales INTEGER DEFAULT 0,
      total_volume DECIMAL(15,2) DEFAULT 0.0,
      languages TEXT, -- JSON array
      certifications TEXT, -- JSON array
      active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Clients agents
  db.exec(`
    CREATE TABLE IF NOT EXISTS agent_clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id INTEGER NOT NULL,
      client_id INTEGER NOT NULL,
      client_type TEXT NOT NULL, -- acheteur, vendeur, investisseur
      status TEXT DEFAULT 'actif', -- actif, inactif, converti
      budget_min DECIMAL(15,2),
      budget_max DECIMAL(15,2),
      preferences TEXT, -- JSON critères recherche
      notes TEXT,
      last_contact DATETIME,
      conversion_date DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Matching propriétés-clients
  db.exec(`
    CREATE TABLE IF NOT EXISTS property_matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id INTEGER NOT NULL,
      property_id INTEGER NOT NULL,
      client_id INTEGER NOT NULL,
      match_score DECIMAL(5,2), -- Score algorithme matching
      match_criteria TEXT, -- JSON critères correspondants
      status TEXT DEFAULT 'proposé', -- proposé, intéressé, visité, rejeté
      presented_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      client_feedback TEXT,
      FOREIGN KEY (agent_id) REFERENCES agents(id),
      FOREIGN KEY (property_id) REFERENCES properties(id),
      FOREIGN KEY (client_id) REFERENCES users(id)
    )
  `);

  // Commissions agents
  db.exec(`
    CREATE TABLE IF NOT EXISTS commissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id INTEGER NOT NULL,
      transaction_id INTEGER NOT NULL,
      commission_type TEXT NOT NULL, -- vente, location, parrainage
      rate DECIMAL(5,2) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      currency TEXT DEFAULT 'FCFA',
      status TEXT DEFAULT 'due', -- due, payée, annulée
      due_date DATETIME,
      paid_date DATETIME,
      payment_ref TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (agent_id) REFERENCES agents(id),
      FOREIGN KEY (transaction_id) REFERENCES transactions(id)
    )
  `);

  // ===========================================
  // TABLES NOTIFICATIONS & COMMUNICATION
  // ===========================================

  // Notifications
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL, -- info, success, warning, error, promo
      category TEXT NOT NULL, -- transaction, property, system, marketing
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      data TEXT, -- JSON données additionnelles
      read_status BOOLEAN DEFAULT FALSE,
      action_url TEXT,
      priority INTEGER DEFAULT 0, -- 0=normal, 1=haute, 2=urgente
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Messages entre utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      thread_id TEXT NOT NULL,
      sender_id INTEGER NOT NULL,
      recipient_id INTEGER NOT NULL,
      subject TEXT,
      content TEXT NOT NULL,
      message_type TEXT DEFAULT 'text', -- text, image, document, system
      attachment_url TEXT,
      read_status BOOLEAN DEFAULT FALSE,
      read_at DATETIME,
      replied BOOLEAN DEFAULT FALSE,
      priority TEXT DEFAULT 'normal', -- normal, haute, urgente
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (recipient_id) REFERENCES users(id)
    )
  `);

  // ===========================================
  // TABLES RECHERCHES & PRÉFÉRENCES
  // ===========================================

  // Recherches sauvegardées
  db.exec(`
    CREATE TABLE IF NOT EXISTS saved_searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      search_criteria TEXT NOT NULL, -- JSON critères
      alert_frequency TEXT DEFAULT 'daily', -- never, daily, weekly, monthly
      last_alert DATETIME,
      active BOOLEAN DEFAULT TRUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Préférences de recherche
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_preferences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      preference_type TEXT NOT NULL, -- search, notification, display, etc.
      preference_key TEXT NOT NULL,
      preference_value TEXT NOT NULL, -- JSON value
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // ===========================================
  // TABLES ANALYTICS & REPORTING
  // ===========================================

  // Analytics utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_id TEXT,
      event_type TEXT NOT NULL, -- page_view, search, inquiry, etc.
      event_data TEXT, -- JSON données événement
      ip_address TEXT,
      user_agent TEXT,
      referrer TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Métriques système
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric_type TEXT NOT NULL,
      metric_name TEXT NOT NULL,
      metric_value DECIMAL(15,2) NOT NULL,
      period_start DATETIME NOT NULL,
      period_end DATETIME NOT NULL,
      metadata TEXT, -- JSON données additionnelles
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Logs système
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      log_level TEXT NOT NULL, -- info, warning, error, critical
      category TEXT NOT NULL,
      message TEXT NOT NULL,
      details TEXT, -- JSON détails
      user_id INTEGER,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Créer des index pour les performances
  createIndexes();
}

function createIndexes() {
  // Index pour les utilisateurs
  db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)');

  // Index pour les propriétés
  db.exec('CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(statut)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_properties_localisation ON properties(localisation)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_properties_prix ON properties(prix)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_properties_created ON properties(created_at)');

  // Index pour les transactions
  db.exec('CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_transactions_buyer ON transactions(buyer_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_transactions_seller ON transactions(seller_id)');

  // Index pour les notifications
  db.exec('CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read_status)');

  // Index pour les sessions
  db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at)');

  console.log('✅ Index de performance créés');
}