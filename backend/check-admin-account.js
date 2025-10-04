const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

// Connexion à la base de données
const db = new Database(path.join(__dirname, 'teranga_foncier.db'));

console.log('🔍 Vérification de la structure de la base de données...');

try {
  // Vérifier la structure des tables existantes
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('📋 Tables existantes:', tables.map(t => t.name));

  // Vérifier la structure de la table users
  if (tables.some(t => t.name === 'users')) {
    const userColumns = db.prepare("PRAGMA table_info(users)").all();
    console.log('👤 Colonnes table users:', userColumns.map(c => c.name));
  }

  // Vérifier la structure de la table properties si elle existe
  if (tables.some(t => t.name === 'properties')) {
    const propColumns = db.prepare("PRAGMA table_info(properties)").all();
    console.log('🏠 Colonnes table properties:', propColumns.map(c => c.name));
  }

  // Vérifier si l'admin existe
  const admin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@teranga.com');
  if (admin) {
    console.log('👤 Compte admin trouvé:', {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      status: admin.status
    });
  } else {
    console.log('❌ Aucun compte admin trouvé');
    
    // Créer le compte admin
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    
    const userInsert = db.prepare(`
      INSERT INTO users (first_name, last_name, email, password, role, status, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    try {
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
      }
    } catch (error) {
      console.log('❌ Erreur création admin:', error.message);
    }
  }

  // Tester la connexion admin
  console.log('\n🔐 Test de connexion admin...');
  const testAdmin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@teranga.com');
  
  if (testAdmin) {
    const isPasswordValid = bcrypt.compareSync('admin123', testAdmin.password);
    console.log('🔑 Mot de passe valide:', isPasswordValid);
    
    if (isPasswordValid) {
      console.log('✅ Connexion admin fonctionnelle !');
      console.log('📧 Email: admin@teranga.com');
      console.log('🔑 Mot de passe: admin123');
      console.log('👤 Rôle:', testAdmin.role);
    } else {
      console.log('❌ Mot de passe incorrect, mise à jour...');
      const newHashedPassword = bcrypt.hashSync('admin123', 10);
      db.prepare('UPDATE users SET password = ? WHERE email = ?')
        .run(newHashedPassword, 'admin@teranga.com');
      console.log('✅ Mot de passe mis à jour');
    }
  }

} catch (error) {
  console.error('❌ Erreur:', error.message);
} finally {
  db.close();
  console.log('\n🎯 Vérification terminée');
}