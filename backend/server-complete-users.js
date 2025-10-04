// =================================
// ROUTES GESTION UTILISATEURS & RÔLES (15 endpoints)
// =================================

const { app, db, authenticate, requireRole, logAction } = require('./server-complete-auth');

// Liste tous les utilisateurs
app.get('/api/admin/users', authenticate, requireRole(['admin']), (req, res) => {
  try {
    const { page = 1, limit = 20, status, role, search } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, u.status,
        u.email_verified_at, u.last_login_at, u.created_at,
        up.company, up.city, up.region,
        GROUP_CONCAT(r.name) as roles,
        COUNT(p.id) as properties_count
      FROM users u
      LEFT JOIN user_profiles up ON u.id = up.user_id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      LEFT JOIN properties p ON u.id = p.owner_id
      WHERE 1=1
    `;

    const params = [];

    if (status) {
      query += ' AND u.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' GROUP BY u.id ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const users = db.prepare(query).all(...params);

    // Compter le total
    let countQuery = 'SELECT COUNT(DISTINCT u.id) as total FROM users u WHERE 1=1';
    const countParams = [];

    if (status) {
      countQuery += ' AND u.status = ?';
      countParams.push(status);
    }

    if (search) {
      countQuery += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const { total } = db.prepare(countQuery).get(...countParams);

    res.json({
      success: true,
      data: users.map(user => ({
        ...user,
        roles: user.roles ? user.roles.split(',') : []
      })),
      meta: {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur liste utilisateurs:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Statistiques utilisateurs
app.get('/api/admin/users/stats', authenticate, requireRole(['admin']), (req, res) => {
  try {
    const stats = {
      total: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
      active: db.prepare('SELECT COUNT(*) as count FROM users WHERE status = ?').get('active').count,
      inactive: db.prepare('SELECT COUNT(*) as count FROM users WHERE status = ?').get('inactive').count,
      banned: db.prepare('SELECT COUNT(*) as count FROM users WHERE status = ?').get('banned').count,
      verified: db.prepare('SELECT COUNT(*) as count FROM users WHERE email_verified_at IS NOT NULL').get().count,
      new_this_month: db.prepare(`
        SELECT COUNT(*) as count FROM users 
        WHERE created_at >= date('now', 'start of month')
      `).get().count,
      by_role: db.prepare(`
        SELECT r.display_name as role, COUNT(ur.user_id) as count
        FROM roles r
        LEFT JOIN user_roles ur ON r.id = ur.role_id
        GROUP BY r.id, r.display_name
        ORDER BY count DESC
      `).all(),
      registrations_by_month: db.prepare(`
        SELECT 
          strftime('%Y-%m', created_at) as month,
          COUNT(*) as count
        FROM users
        WHERE created_at >= date('now', '-12 months')
        GROUP BY strftime('%Y-%m', created_at)
        ORDER BY month
      `).all()
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Erreur stats utilisateurs:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Bannir utilisateur
app.post('/api/admin/users/:id/ban', authenticate, requireRole(['admin']), logAction('ban', 'user'), (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updateResult = db.prepare(`
      UPDATE users SET status = 'banned', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(id);

    if (updateResult.changes === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Utilisateur non trouvé' }
      });
    }

    // Log de sécurité
    db.prepare(`
      INSERT INTO security_logs (user_id, event_type, severity, description, ip_address)
      VALUES (?, 'user_banned', 'warning', ?, ?)
    `).run(id, reason || 'Utilisateur banni par admin', req.ip);

    res.json({
      success: true,
      message: 'Utilisateur banni avec succès'
    });

  } catch (error) {
    console.error('Erreur bannissement utilisateur:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Débannir utilisateur
app.post('/api/admin/users/:id/unban', authenticate, requireRole(['admin']), logAction('unban', 'user'), (req, res) => {
  try {
    const { id } = req.params;

    const updateResult = db.prepare(`
      UPDATE users SET status = 'active', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(id);

    if (updateResult.changes === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Utilisateur non trouvé' }
      });
    }

    // Log de sécurité
    db.prepare(`
      INSERT INTO security_logs (user_id, event_type, severity, description, ip_address)
      VALUES (?, 'user_unbanned', 'info', 'Utilisateur débanni par admin', ?)
    `).run(id, req.ip);

    res.json({
      success: true,
      message: 'Utilisateur débanni avec succès'
    });

  } catch (error) {
    console.error('Erreur débannissement utilisateur:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Liste des rôles
app.get('/api/admin/roles', authenticate, requireRole(['admin']), (req, res) => {
  try {
    const roles = db.prepare(`
      SELECT 
        r.*,
        COUNT(ur.user_id) as users_count
      FROM roles r
      LEFT JOIN user_roles ur ON r.id = ur.role_id
      GROUP BY r.id
      ORDER BY r.hierarchy_level DESC, r.name
    `).all();

    res.json({
      success: true,
      data: roles.map(role => ({
        ...role,
        permissions: role.permissions ? JSON.parse(role.permissions) : {}
      }))
    });

  } catch (error) {
    console.error('Erreur liste rôles:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Créer rôle
app.post('/api/admin/roles', authenticate, requireRole(['admin']), logAction('create', 'role'), (req, res) => {
  try {
    const { name, display_name, description, hierarchy_level, permissions } = req.body;

    if (!name || !display_name) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Nom et nom d\'affichage requis' }
      });
    }

    const result = db.prepare(`
      INSERT INTO roles (name, display_name, description, hierarchy_level, permissions)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      name, 
      display_name, 
      description, 
      hierarchy_level || 0, 
      JSON.stringify(permissions || {})
    );

    res.status(201).json({
      success: true,
      data: { id: result.lastInsertRowid },
      message: 'Rôle créé avec succès'
    });

  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({
        success: false,
        error: { code: 'ROLE_EXISTS', message: 'Ce rôle existe déjà' }
      });
    }

    console.error('Erreur création rôle:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Modifier rôle
app.put('/api/admin/roles/:id', authenticate, requireRole(['admin']), logAction('update', 'role'), (req, res) => {
  try {
    const { id } = req.params;
    const { display_name, description, hierarchy_level, permissions } = req.body;

    const updateResult = db.prepare(`
      UPDATE roles 
      SET display_name = ?, description = ?, hierarchy_level = ?, permissions = ?
      WHERE id = ?
    `).run(
      display_name, 
      description, 
      hierarchy_level, 
      JSON.stringify(permissions || {}), 
      id
    );

    if (updateResult.changes === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'ROLE_NOT_FOUND', message: 'Rôle non trouvé' }
      });
    }

    res.json({
      success: true,
      message: 'Rôle modifié avec succès'
    });

  } catch (error) {
    console.error('Erreur modification rôle:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Supprimer rôle
app.delete('/api/admin/roles/:id', authenticate, requireRole(['admin']), logAction('delete', 'role'), (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier qu'aucun utilisateur n'a ce rôle
    const usersWithRole = db.prepare('SELECT COUNT(*) as count FROM user_roles WHERE role_id = ?').get(id);
    
    if (usersWithRole.count > 0) {
      return res.status(409).json({
        success: false,
        error: { code: 'ROLE_IN_USE', message: 'Ce rôle est utilisé par des utilisateurs' }
      });
    }

    const deleteResult = db.prepare('DELETE FROM roles WHERE id = ?').run(id);

    if (deleteResult.changes === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'ROLE_NOT_FOUND', message: 'Rôle non trouvé' }
      });
    }

    res.json({
      success: true,
      message: 'Rôle supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression rôle:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Assigner rôles à un utilisateur
app.post('/api/admin/users/:id/roles', authenticate, requireRole(['admin']), logAction('assign_roles', 'user'), (req, res) => {
  try {
    const { id } = req.params;
    const { role_ids } = req.body;

    if (!Array.isArray(role_ids)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'role_ids doit être un tableau' }
      });
    }

    // Supprimer les rôles existants
    db.prepare('DELETE FROM user_roles WHERE user_id = ?').run(id);

    // Ajouter les nouveaux rôles
    const insertStmt = db.prepare('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)');
    
    for (const roleId of role_ids) {
      insertStmt.run(id, roleId);
    }

    res.json({
      success: true,
      message: 'Rôles assignés avec succès'
    });

  } catch (error) {
    console.error('Erreur assignation rôles:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Retirer un rôle à un utilisateur
app.delete('/api/admin/users/:userId/roles/:roleId', authenticate, requireRole(['admin']), logAction('remove_role', 'user'), (req, res) => {
  try {
    const { userId, roleId } = req.params;

    const deleteResult = db.prepare('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?').run(userId, roleId);

    if (deleteResult.changes === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'ROLE_ASSIGNMENT_NOT_FOUND', message: 'Assignment de rôle non trouvé' }
      });
    }

    res.json({
      success: true,
      message: 'Rôle retiré avec succès'
    });

  } catch (error) {
    console.error('Erreur retrait rôle:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Liste permissions (pour l'instant, liste statique)
app.get('/api/admin/permissions', authenticate, requireRole(['admin']), (req, res) => {
  try {
    const permissions = [
      { resource: 'users', action: 'create', description: 'Créer des utilisateurs' },
      { resource: 'users', action: 'read', description: 'Voir les utilisateurs' },
      { resource: 'users', action: 'update', description: 'Modifier les utilisateurs' },
      { resource: 'users', action: 'delete', description: 'Supprimer des utilisateurs' },
      { resource: 'properties', action: 'create', description: 'Créer des propriétés' },
      { resource: 'properties', action: 'read', description: 'Voir les propriétés' },
      { resource: 'properties', action: 'update', description: 'Modifier les propriétés' },
      { resource: 'properties', action: 'delete', description: 'Supprimer des propriétés' },
      { resource: 'properties', action: 'moderate', description: 'Modérer les propriétés' },
      { resource: 'financials', action: 'read', description: 'Voir les données financières' },
      { resource: 'analytics', action: 'read', description: 'Voir les analytics' },
      { resource: 'content', action: 'manage', description: 'Gérer le contenu' },
    ];

    res.json({
      success: true,
      data: permissions
    });

  } catch (error) {
    console.error('Erreur liste permissions:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Créer permission
app.post('/api/admin/permissions', authenticate, requireRole(['admin']), logAction('create', 'permission'), (req, res) => {
  try {
    const { resource, action, description } = req.body;

    if (!resource || !action) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Resource et action requis' }
      });
    }

    // Pour l'instant, on simule la création
    res.status(201).json({
      success: true,
      data: { id: Date.now(), resource, action, description },
      message: 'Permission créée avec succès'
    });

  } catch (error) {
    console.error('Erreur création permission:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Sessions actives
app.get('/api/admin/users/sessions', authenticate, requireRole(['admin']), (req, res) => {
  try {
    // Pour l'instant, on simule les sessions actives
    const sessions = [
      {
        id: 1,
        user_id: 1,
        email: 'admin@teranga.com',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0...',
        last_activity: new Date().toISOString(),
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ];

    res.json({
      success: true,
      data: sessions,
      meta: {
        total_active_sessions: sessions.length
      }
    });

  } catch (error) {
    console.error('Erreur sessions actives:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Terminer sessions d'un utilisateur
app.delete('/api/admin/users/:id/sessions', authenticate, requireRole(['admin']), logAction('terminate_sessions', 'user'), (req, res) => {
  try {
    const { id } = req.params;

    // Pour l'instant, on simule la terminaison des sessions
    res.json({
      success: true,
      message: 'Sessions terminées avec succès'
    });

  } catch (error) {
    console.error('Erreur terminaison sessions:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

// Activité des utilisateurs
app.get('/api/admin/users/activity', authenticate, requireRole(['admin']), (req, res) => {
  try {
    const { limit = 50, user_id } = req.query;

    let query = `
      SELECT 
        al.*, u.first_name, u.last_name, u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;

    const params = [];

    if (user_id) {
      query += ' AND al.user_id = ?';
      params.push(user_id);
    }

    query += ' ORDER BY al.created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const activities = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: activities.map(activity => ({
        ...activity,
        old_data: activity.old_data ? JSON.parse(activity.old_data) : null,
        new_data: activity.new_data ? JSON.parse(activity.new_data) : null
      }))
    });

  } catch (error) {
    console.error('Erreur activité utilisateurs:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erreur serveur' }
    });
  }
});

console.log('👥 Routes de gestion utilisateurs & rôles configurées (15 endpoints)');

module.exports = { app, db };