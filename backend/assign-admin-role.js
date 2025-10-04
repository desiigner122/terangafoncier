const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'teranga_foncier.db'));

console.log('🔧 Attribution du rôle admin...');

try {
  // Vérifier si le rôle admin existe dans la table roles
  let adminRole = db.prepare('SELECT * FROM roles WHERE name = ?').get('admin');
  
  if (!adminRole) {
    // Créer le rôle admin s'il n'existe pas
    const roleInsert = db.prepare('INSERT INTO roles (name, description, permissions, created_at) VALUES (?, ?, ?, ?)');
    const result = roleInsert.run('admin', 'Administrateur système', JSON.stringify(['*']), new Date().toISOString());
    adminRole = { id: result.lastInsertRowid, name: 'admin' };
    console.log('✅ Rôle admin créé avec ID:', adminRole.id);
  } else {
    console.log('ℹ️ Rôle admin existant avec ID:', adminRole.id);
  }

  // Récupérer l'utilisateur admin
  const adminUser = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@teranga.com');
  
  if (adminUser) {
    console.log('👤 Utilisateur admin trouvé avec ID:', adminUser.id);
    
    // Vérifier si l'association user_roles existe déjà
    const existingUserRole = db.prepare('SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?')
      .get(adminUser.id, adminRole.id);
    
    if (!existingUserRole) {
      // Ajouter l'association user-role
      const userRoleInsert = db.prepare('INSERT INTO user_roles (user_id, role_id, assigned_at) VALUES (?, ?, ?)');
      userRoleInsert.run(adminUser.id, adminRole.id, new Date().toISOString());
      console.log('✅ Rôle admin attribué à l\'utilisateur');
    } else {
      console.log('ℹ️ L\'utilisateur a déjà le rôle admin');
    }

    // Vérifier la configuration finale
    const verification = db.prepare(`
      SELECT u.email, u.first_name, u.last_name, r.name as role_name 
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = ?
    `).get('admin@teranga.com');
    
    console.log('🎯 Configuration finale:', verification);
    
    if (verification.role_name === 'admin') {
      console.log('✅ Compte admin configuré correctement !');
      console.log('📧 Email: admin@teranga.com');
      console.log('🔑 Mot de passe: admin123');
      console.log('👤 Rôle: admin');
    } else {
      console.log('❌ Problème avec l\'attribution du rôle');
    }
    
  } else {
    console.log('❌ Utilisateur admin non trouvé');
  }

} catch (error) {
  console.error('❌ Erreur:', error.message);
} finally {
  db.close();
}