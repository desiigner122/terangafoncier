const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('better-sqlite3');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'teranga_foncier_secret_key_2024';

// =================================
// CONFIGURATION BASE DE DONNÉES
// =================================

const db = new Database(path.join(__dirname, 'teranga_foncier.db'));

// Création des tables (version simplifiée pour SQLite)
db.exec(`
  -- Tables principales
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    status TEXT DEFAULT 'active',
    email_verified_at DATETIME,
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    hierarchy_level INTEGER DEFAULT 0,
    permissions TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_roles (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
  );

  CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    company TEXT,
    address TEXT,
    city TEXT,
    region TEXT,
    country TEXT DEFAULT 'Sénégal',
    verified_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS subscription_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'XOF',
    billing_cycle TEXT DEFAULT 'monthly',
    features TEXT DEFAULT '[]',
    trial_days INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES subscription_plans(id),
    status TEXT DEFAULT 'active',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ends_at DATETIME,
    trial_ends_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    starts_at DATETIME,
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS financial_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id),
    subscription_id INTEGER REFERENCES user_subscriptions(id),
    type TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    currency TEXT DEFAULT 'XOF',
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    gateway_transaction_id TEXT,
    processed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    property_type TEXT NOT NULL,
    listing_type TEXT DEFAULT 'sale',
    price DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'XOF',
    address TEXT,
    city TEXT,
    region TEXT,
    surface_area DECIMAL(10,2),
    bedrooms INTEGER,
    bathrooms INTEGER,
    status TEXT DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    favorites_count INTEGER DEFAULT 0,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS property_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data TEXT DEFAULT '{}',
    read_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS notification_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    variables TEXT DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS email_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    scheduled_at DATETIME,
    sent_at DATETIME,
    recipients_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sms_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    scheduled_at DATETIME,
    sent_at DATETIME,
    recipients_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    cost DECIMAL(10,2),
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    status TEXT DEFAULT 'new',
    assigned_to INTEGER REFERENCES users(id),
    responded_at DATETIME,
    response TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS support_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ticket_number TEXT UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    priority TEXT DEFAULT 'normal',
    status TEXT DEFAULT 'open',
    assigned_to INTEGER REFERENCES users(id),
    resolution TEXT,
    resolved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category TEXT,
    tags TEXT DEFAULT '[]',
    status TEXT DEFAULT 'draft',
    views_count INTEGER DEFAULT 0,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS news_articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    category TEXT,
    status TEXT DEFAULT 'draft',
    views_count INTEGER DEFAULT 0,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_title TEXT,
    client_company TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'pending',
    approved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS static_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    type TEXT DEFAULT 'page',
    is_published BOOLEAN DEFAULT TRUE,
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS senegal_regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    code TEXT UNIQUE NOT NULL,
    capital TEXT,
    area_km2 DECIMAL(10,2),
    population INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS senegal_communes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    region_id INTEGER REFERENCES senegal_regions(id),
    name TEXT NOT NULL,
    type TEXT,
    population INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS platform_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(12,2) NOT NULL,
    metric_type TEXT,
    metadata TEXT DEFAULT '{}',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id INTEGER,
    old_data TEXT,
    new_data TEXT,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS security_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    severity TEXT DEFAULT 'info',
    description TEXT NOT NULL,
    ip_address TEXT,
    resolved BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insertion des données de base
db.exec(`
  INSERT OR IGNORE INTO roles (name, display_name, description, hierarchy_level) VALUES
  ('admin', 'Administrateur', 'Accès complet au système', 10),
  ('agent_foncier', 'Agent Foncier', 'Agent immobilier certifié', 8),
  ('banque', 'Banque', 'Institution bancaire', 7),
  ('particulier', 'Particulier', 'Utilisateur standard', 1),
  ('vendeur_particulier', 'Vendeur Particulier', 'Vendeur individuel', 3),
  ('vendeur_professionnel', 'Vendeur Professionnel', 'Vendeur professionnel', 5),
  ('investisseur', 'Investisseur', 'Investisseur immobilier', 4),
  ('promoteur', 'Promoteur', 'Promoteur immobilier', 6),
  ('notaire', 'Notaire', 'Notaire certifié', 7),
  ('geometre', 'Géomètre', 'Géomètre expert', 6),
  ('mairie', 'Mairie', 'Administration municipale', 8),
  ('agriculteur', 'Agriculteur', 'Exploitant agricole', 2);

  INSERT OR IGNORE INTO subscription_plans (name, slug, description, price, billing_cycle, features, trial_days) VALUES
  ('Basic', 'basic', 'Plan de base pour particuliers', 15000, 'monthly', '["5 propriétés", "Support email"]', 7),
  ('Pro', 'pro', 'Plan professionnel pour agents', 35000, 'monthly', '["25 propriétés", "CRM intégré", "Analytics"]', 14),
  ('Enterprise', 'enterprise', 'Plan entreprise', 75000, 'monthly', '["Propriétés illimitées", "API access", "Support dédié"]', 30);

  INSERT OR IGNORE INTO senegal_regions (name, code, capital, area_km2, population) VALUES
  ('Dakar', 'DK', 'Dakar', 547, 3732284),
  ('Thiès', 'TH', 'Thiès', 6670, 1789000),
  ('Saint-Louis', 'SL', 'Saint-Louis', 19241, 1029000),
  ('Diourbel', 'DB', 'Diourbel', 4824, 1497000),
  ('Louga', 'LG', 'Louga', 24847, 897000),
  ('Fatick', 'FK', 'Fatick', 7935, 714000),
  ('Kolda', 'KD', 'Kolda', 21011, 679000),
  ('Kaolack', 'KL', 'Kaolack', 16010, 960000),
  ('Tambacounda', 'TC', 'Tambacounda', 42364, 682000),
  ('Ziguinchor', 'ZG', 'Ziguinchor', 7339, 550000),
  ('Matam', 'MT', 'Matam', 29445, 562000),
  ('Kaffrine', 'KF', 'Kaffrine', 11262, 567000),
  ('Kédougou', 'KE', 'Kédougou', 16896, 152000),
  ('Sédhiou', 'SE', 'Sédhiou', 7341, 453000);
`);

// =================================
// MIDDLEWARES
// =================================

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configuration Multer pour upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// Middleware d'authentification
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: { code: 'NO_TOKEN', message: 'Token d\'accès requis' } 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: { code: 'INVALID_TOKEN', message: 'Token invalide' } 
    });
  }
};

// Middleware de vérification des rôles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        error: { code: 'UNAUTHORIZED', message: 'Authentification requise' } 
      });
    }

    const userRoles = db.prepare(`
      SELECT r.name FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ?
    `).all(req.user.id);

    const hasRole = userRoles.some(role => roles.includes(role.name));
    
    if (!hasRole) {
      return res.status(403).json({ 
        success: false, 
        error: { code: 'FORBIDDEN', message: 'Accès refusé' } 
      });
    }

    next();
  };
};

// Middleware de logging des actions
const logAction = (action, resource) => {
  return (req, res, next) => {
    const originalSend = res.send;
    res.send = function(data) {
      // Log l'action après la réponse
      if (req.user && res.statusCode < 400) {
        db.prepare(`
          INSERT INTO audit_logs (user_id, action, resource, resource_id, new_data, ip_address)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          req.user.id,
          action,
          resource,
          req.params.id || null,
          JSON.stringify(req.body),
          req.ip
        );
      }
      originalSend.call(this, data);
    };
    next();
  };
};

// =================================
// ROUTES AUTHENTIFICATION (12 endpoints)
// =================================

// Inscription utilisateur
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email et mot de passe requis' }
      });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'Utilisateur déjà existant' }
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insérer l'utilisateur
    const result = db.prepare(`
      INSERT INTO users (email, password, first_name, last_name, phone)
      VALUES (?, ?, ?, ?, ?)
    `).run(email, hashedPassword, first_name, last_name, phone);

    const userId = result.lastInsertRowid;

    // Assigner le rôle par défaut ou celui spécifié
    const defaultRole = role || 'particulier';
    const roleData = db.prepare('SELECT id FROM roles WHERE name = ?').get(defaultRole);
    
    if (roleData) {
      db.prepare('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)').run(userId, roleData.id);
    }

    // Créer le profil utilisateur
    db.prepare(`
      INSERT INTO user_profiles (user_id, country)
      VALUES (?, 'Sénégal')
    `).run(userId);

    // Générer le token
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      success: true,
      data: {
        user: { id: userId, email, first_name, last_name },
        token
      },
      message: 'Inscription réussie'
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Connexion utilisateur
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email et mot de passe requis' }
      });
    }

    // Trouver l'utilisateur
    const user = db.prepare(`
      SELECT u.*, GROUP_CONCAT(r.name) as roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = ?
      GROUP BY u.id
    `).get(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Identifiants invalides' }
      });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Identifiants invalides' }
      });
    }

    // Vérifier le statut du compte
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: { code: 'ACCOUNT_DISABLED', message: 'Compte désactivé' }
      });
    }

    // Mettre à jour last_login
    db.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    // Générer le token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          roles: user.roles ? user.roles.split(',') : []
        },
        token
      },
      message: 'Connexion réussie'
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Déconnexion utilisateur
app.post('/api/auth/logout', authenticate, (req, res) => {
  // En JWT, la déconnexion côté serveur est optionnelle
  // On peut implémenter une blacklist des tokens si nécessaire
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  });
});

// Profil utilisateur connecté
app.get('/api/auth/me', authenticate, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, u.status,
        u.email_verified_at, u.last_login_at, u.created_at,
        up.avatar_url, up.bio, up.company, up.address, up.city, up.region,
        GROUP_CONCAT(r.name) as roles
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = ?
      GROUP BY u.id
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Utilisateur non trouvé' }
      });
    }

    res.json({
      success: true,
      data: {
        ...user,
        roles: user.roles ? user.roles.split(',') : []
      }
    });

  } catch (error) {
    console.error('Erreur profil:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Mot de passe oublié
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email);
    
    if (!user) {
      // Ne pas révéler si l'email existe ou non
      return res.json({
        success: true,
        message: 'Si votre email existe, vous recevrez un lien de réinitialisation'
      });
    }

    // TODO: Générer token de reset et envoyer email
    // Pour l'instant, on simule la réussite
    res.json({
      success: true,
      message: 'Email de réinitialisation envoyé'
    });

  } catch (error) {
    console.error('Erreur mot de passe oublié:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Reset mot de passe
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Token et mot de passe requis' }
      });
    }

    // TODO: Vérifier le token de reset
    // Pour l'instant, on simule la réussite
    res.json({
      success: true,
      message: 'Mot de passe réinitialisé avec succès'
    });

  } catch (error) {
    console.error('Erreur reset mot de passe:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Modifier utilisateur
app.put('/api/users/:id', authenticate, logAction('update', 'user'), async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone, email } = req.body;

    // Vérifier que l'utilisateur peut modifier ce profil
    if (req.user.id != id) {
      const userRoles = db.prepare(`
        SELECT r.name FROM roles r
        JOIN user_roles ur ON r.id = ur.role_id
        WHERE ur.user_id = ?
      `).all(req.user.id);

      const isAdmin = userRoles.some(role => role.name === 'admin');
      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          error: { code: 'FORBIDDEN', message: 'Accès refusé' }
        });
      }
    }

    // Mettre à jour l'utilisateur
    const updateResult = db.prepare(`
      UPDATE users 
      SET first_name = ?, last_name = ?, phone = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(first_name, last_name, phone, email, id);

    if (updateResult.changes === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Utilisateur non trouvé' }
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur modifié avec succès'
    });

  } catch (error) {
    console.error('Erreur modification utilisateur:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Supprimer utilisateur
app.delete('/api/users/:id', authenticate, requireRole(['admin']), logAction('delete', 'user'), (req, res) => {
  try {
    const { id } = req.params;

    const deleteResult = db.prepare('DELETE FROM users WHERE id = ?').run(id);

    if (deleteResult.changes === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Utilisateur non trouvé' }
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression utilisateur:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Profil détaillé
app.get('/api/users/:id/profile', authenticate, (req, res) => {
  try {
    const { id } = req.params;

    const profile = db.prepare(`
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, u.status,
        u.created_at, up.*
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      WHERE u.id = ?
    `).get(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: 'Profil non trouvé' }
      });
    }

    res.json({
      success: true,
      data: profile
    });

  } catch (error) {
    console.error('Erreur profil détaillé:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Modifier profil
app.put('/api/users/:id/profile', authenticate, logAction('update', 'profile'), (req, res) => {
  try {
    const { id } = req.params;
    const { avatar_url, bio, company, address, city, region } = req.body;

    // Vérifier que l'utilisateur peut modifier ce profil
    if (req.user.id != id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Accès refusé' }
      });
    }

    // Mettre à jour ou insérer le profil
    const updateResult = db.prepare(`
      INSERT INTO user_profiles (user_id, avatar_url, bio, company, address, city, region, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
      avatar_url = excluded.avatar_url,
      bio = excluded.bio,
      company = excluded.company,
      address = excluded.address,
      city = excluded.city,
      region = excluded.region,
      updated_at = excluded.updated_at
    `).run(id, avatar_url, bio, company, address, city, region);

    res.json({
      success: true,
      message: 'Profil modifié avec succès'
    });

  } catch (error) {
    console.error('Erreur modification profil:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Paramètres utilisateur
app.get('/api/users/:id/settings', authenticate, (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur peut accéder à ces paramètres
    if (req.user.id != id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Accès refusé' }
      });
    }

    // Pour l'instant, on retourne des paramètres par défaut
    res.json({
      success: true,
      data: {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        privacy: {
          profile_visible: true,
          show_phone: false,
          show_email: false
        },
        preferences: {
          theme: 'light',
          language: 'fr',
          timezone: 'Africa/Dakar'
        }
      }
    });

  } catch (error) {
    console.error('Erreur paramètres utilisateur:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Modifier paramètres
app.put('/api/users/:id/settings', authenticate, logAction('update', 'settings'), (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur peut modifier ces paramètres
    if (req.user.id != id) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Accès refusé' }
      });
    }

    // TODO: Implémenter la sauvegarde des paramètres
    res.json({
      success: true,
      message: 'Paramètres modifiés avec succès'
    });

  } catch (error) {
    console.error('Erreur modification paramètres:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

console.log('🔐 Routes d\'authentification configurées (12 endpoints)');

module.exports = { app, db, authenticate, requireRole, logAction, upload };