const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Initialiser la base de données
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

async function initializeDatabase() {
  try {
    console.log('🔧 Initialisation de la base de données...');

    // Créer la table users (SQLite version simplifiée)
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        role VARCHAR(50) DEFAULT 'particulier',
        status VARCHAR(20) DEFAULT 'active',
        email_verified INTEGER DEFAULT 0,
        phone_verified INTEGER DEFAULT 0,
        profile_image VARCHAR(500),
        address TEXT,
        city VARCHAR(100),
        region VARCHAR(100) DEFAULT 'Dakar',
        country VARCHAR(100) DEFAULT 'Sénégal',
        subscription_type VARCHAR(20) DEFAULT 'basic',
        subscription_expires_at TEXT,
        last_login TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table properties
    db.exec(`
      CREATE TABLE IF NOT EXISTS properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        property_type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        price DECIMAL(15,2),
        surface DECIMAL(10,2),
        location VARCHAR(255),
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        images TEXT, -- JSON array of image URLs
        documents TEXT, -- JSON array of documents
        features TEXT, -- JSON array of features
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id)
      )
    `);

    // Créer la table support_tickets
    db.exec(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        subject VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'open',
        priority VARCHAR(20) DEFAULT 'medium',
        assigned_to INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        last_response_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (assigned_to) REFERENCES users(id)
      )
    `);

    // Créer la table support_responses
    db.exec(`
      CREATE TABLE IF NOT EXISTS support_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticket_id INTEGER NOT NULL,
        admin_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        internal_note TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES support_tickets(id),
        FOREIGN KEY (admin_id) REFERENCES users(id)
      )
    `);

    // Créer la table notifications
    db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT,
        type VARCHAR(50) DEFAULT 'info',
        data TEXT, -- JSON data
        read_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Créer la table revenue_analytics
    db.exec(`
      CREATE TABLE IF NOT EXISTS revenue_analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(100),
        amount DECIMAL(15,2) NOT NULL,
        transaction_count INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Tables créées avec succès !');

    // Vérifier si l'admin existe déjà
    const existingAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@teranga.com');
    
    if (existingAdmin) {
      console.log('✅ Le compte admin existe déjà');
      console.log(`   ID: ${existingAdmin.id}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Rôle: ${existingAdmin.role}`);
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Créer le compte admin
    const insertUser = db.prepare(`
      INSERT INTO users (
        first_name, last_name, email, password, role, 
        status, email_verified, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    const result = insertUser.run(
      'Admin',
      'Teranga',
      'admin@teranga.com',
      hashedPassword,
      'admin',
      'active',
      1,
      now,
      now
    );

    console.log('✅ Compte administrateur créé avec succès !');
    console.log(`   ID: ${result.lastInsertRowid}`);
    console.log(`   Email: admin@teranga.com`);
    console.log(`   Mot de passe: admin123`);
    console.log(`   Rôle: admin`);

    // Créer quelques utilisateurs de test
    const testUsers = [
      {
        first_name: 'Jean',
        last_name: 'Dupont',
        email: 'jean@example.com',
        role: 'particulier'
      },
      {
        first_name: 'Marie',
        last_name: 'Martin',
        email: 'marie@agence.com',
        role: 'agence'
      },
      {
        first_name: 'Fatou',
        last_name: 'Sow',
        email: 'fatou@banque.com',
        role: 'banque'
      }
    ];

    console.log('🔧 Création des utilisateurs de test...');
    for (const user of testUsers) {
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(user.email);
      if (!existingUser) {
        const testPassword = await bcrypt.hash('test123', 10);
        insertUser.run(
          user.first_name,
          user.last_name,
          user.email,
          testPassword,
          user.role,
          'active',
          1,
          now,
          now
        );
        console.log(`✅ Utilisateur ${user.first_name} ${user.last_name} créé`);
      }
    }

    // Créer quelques propriétés de test
    console.log('🔧 Création des propriétés de test...');
    const insertProperty = db.prepare(`
      INSERT INTO properties (
        owner_id, title, description, property_type, status, 
        price, surface, location, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const properties = [
      {
        title: 'Villa moderne avec piscine - Almadies',
        description: 'Magnifique villa moderne avec vue sur mer, 4 chambres, piscine et jardin tropical.',
        property_type: 'maison',
        status: 'pending_approval',
        price: 250000000,
        surface: 350,
        location: 'Almadies, Dakar'
      },
      {
        title: 'Appartement F4 - Plateau',
        description: 'Appartement F4 au cœur du plateau, proche des commodités, 3ème étage avec ascenseur.',
        property_type: 'appartement',
        status: 'pending_approval',
        price: 120000000,
        surface: 120,
        location: 'Plateau, Dakar'
      }
    ];

    const jeanId = db.prepare('SELECT id FROM users WHERE email = ?').get('jean@example.com')?.id;
    const marieId = db.prepare('SELECT id FROM users WHERE email = ?').get('marie@agence.com')?.id;

    if (jeanId && marieId) {
      insertProperty.run(jeanId, properties[0].title, properties[0].description, properties[0].property_type, properties[0].status, properties[0].price, properties[0].surface, properties[0].location, now, now);
      insertProperty.run(marieId, properties[1].title, properties[1].description, properties[1].property_type, properties[1].status, properties[1].price, properties[1].surface, properties[1].location, now, now);
      console.log('✅ Propriétés de test créées');
    }

    // Créer quelques tickets de support de test
    console.log('🔧 Création des tickets de support de test...');
    const insertTicket = db.prepare(`
      INSERT INTO support_tickets (
        user_id, subject, description, category, status, priority, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    if (jeanId) {
      insertTicket.run(
        jeanId,
        'Problème de connexion à mon compte',
        'Je n\'arrive plus à me connecter à mon compte depuis hier. J\'ai essayé de réinitialiser mon mot de passe mais je ne reçois pas l\'email.',
        'Technique',
        'open',
        'high',
        now,
        now
      );
      console.log('✅ Tickets de support créés');
    }

    // Créer quelques données de revenus de test
    console.log('🔧 Création des données de revenus de test...');
    const insertRevenue = db.prepare(`
      INSERT INTO revenue_analytics (category, subcategory, amount, transaction_count, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    const revenueData = [
      { category: 'Commission Vente', subcategory: 'Vente Résidentielle', amount: 45000, count: 3 },
      { category: 'Frais Listing', subcategory: 'Propriété Premium', amount: 25000, count: 5 },
      { category: 'Abonnements Premium', subcategory: 'Agence Pro', amount: 15000, count: 2 },
      { category: 'Services Blockchain', subcategory: 'Certification', amount: 8000, count: 4 }
    ];

    for (const rev of revenueData) {
      insertRevenue.run(rev.category, rev.subcategory, rev.amount, rev.count, now);
    }
    console.log('✅ Données de revenus créées');

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    db.close();
  }
}

// Exécuter l'initialisation
initializeDatabase();