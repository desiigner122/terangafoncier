const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Initialiser la base de données
const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

async function createAdminUser() {
  try {
    console.log('🔧 Création du compte administrateur...');

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
      ) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?)
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

    // Créer quelques utilisateurs de test supplémentaires
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

  } catch (error) {
    console.error('❌ Erreur lors de la création du compte admin:', error);
  } finally {
    db.close();
  }
}

// Exécuter la création
createAdminUser();