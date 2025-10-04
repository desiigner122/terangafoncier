const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Connexion à la base de données utilisée par le serveur
const db = new Database(path.join(__dirname, 'teranga_foncier.db'));

console.log('🔄 Initialisation de la base de données teranga_foncier.db...');

// Création des tables principales
try {
  // Table des utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'active',
      is_verified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login_at DATETIME
    );
  `);

  // Table des rôles
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      permissions TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Table des propriétés
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      property_type TEXT NOT NULL,
      price DECIMAL(15,2) NOT NULL,
      surface INTEGER,
      location TEXT NOT NULL,
      owner_id INTEGER,
      status TEXT DEFAULT 'pending',
      featured BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );
  `);

  console.log('✅ Tables créées avec succès');

  // Insérer les rôles par défaut
  const roleInsert = db.prepare(`
    INSERT OR IGNORE INTO roles (name, description, permissions) 
    VALUES (?, ?, ?)
  `);

  roleInsert.run('admin', 'Administrateur système', JSON.stringify(['*']));
  roleInsert.run('user', 'Utilisateur standard', JSON.stringify(['read']));
  roleInsert.run('agence', 'Agence immobilière', JSON.stringify(['read', 'write']));
  roleInsert.run('particulier', 'Particulier', JSON.stringify(['read', 'write']));

  console.log('✅ Rôles par défaut créés');

  // Vérifier si l'admin existe déjà
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@teranga.com');
  
  if (!existingAdmin) {
    // Créer le compte administrateur
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    const userInsert = db.prepare(`
      INSERT INTO users (first_name, last_name, email, password, role, status, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = userInsert.run(
      'Admin',
      'Teranga',
      'admin@teranga.com', 
      hashedPassword,
      'admin',
      'active',
      1
    );

    if (result.changes > 0) {
      console.log('✅ Compte administrateur créé avec succès');
      console.log('📧 Email: admin@teranga.com');
      console.log('🔑 Mot de passe: admin123');
    } else {
      console.log('❌ Erreur lors de la création du compte admin');
    }
  } else {
    console.log('ℹ️ Le compte administrateur existe déjà');
    
    // Mettre à jour le mot de passe au cas où
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const updateResult = db.prepare('UPDATE users SET password = ? WHERE email = ?')
      .run(hashedPassword, 'admin@teranga.com');
    
    if (updateResult.changes > 0) {
      console.log('✅ Mot de passe administrateur mis à jour');
    }
  }

  // Créer quelques données de test
  const existingProps = db.prepare('SELECT COUNT(*) as count FROM properties').get();
  
  if (existingProps.count === 0) {
    const propInsert = db.prepare(`
      INSERT INTO properties (title, description, property_type, price, surface, location, owner_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    propInsert.run(
      'Villa moderne à Dakar', 
      'Belle villa avec vue sur mer',
      'Villa',
      150000000,
      300,
      'Dakar, Sénégal',
      1,
      'pending_approval'
    );

    propInsert.run(
      'Appartement F4 - Plateau', 
      'Appartement spacieux au centre-ville',
      'Appartement',
      85000000,
      120,
      'Plateau, Dakar',
      1,
      'pending_approval'
    );

    console.log('✅ Données de test créées');
  }

  console.log('\n🎉 Base de données initialisée avec succès !');
  console.log('🔗 Fichier: teranga_foncier.db');
  console.log('👤 Admin: admin@teranga.com / admin123');

} catch (error) {
  console.error('❌ Erreur lors de l\'initialisation:', error);
} finally {
  db.close();
}