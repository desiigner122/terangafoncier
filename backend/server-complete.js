import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { getDatabase } from './config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// JWT Secret (en production, utiliser une variable d'environnement)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes de base
app.get('/health', async (req, res) => {
  try {
    console.log('🔄 Test de la base de données...');
    const db = await getDatabase();
    console.log('✅ Base de données connectée');
    
    res.json({ 
      status: 'OK',
      message: 'Serveur Teranga Foncier - API Complète',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR',
      error: error.message 
    });
  }
});

// Test de base de données
app.get('/db-test', async (req, res) => {
  try {
    const db = await getDatabase();
    const users = db.prepare('SELECT COUNT(*) as count FROM users').get();
    const properties = db.prepare('SELECT COUNT(*) as count FROM properties').get();
    
    res.json({
      message: 'Base de données testée avec succès',
      users: users.count,
      properties: properties.count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTES D'AUTHENTIFICATION

// Inscription
app.post('/api/auth/inscription', async (req, res) => {
  try {
    const { email, password, nom, prenom, telephone } = req.body;

    if (!email || !password || !nom || !prenom) {
      return res.status(400).json({ 
        error: 'Tous les champs requis doivent être fournis' 
      });
    }

    const db = await getDatabase();
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Un utilisateur avec cet email existe déjà' 
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const result = db.prepare(`
      INSERT INTO users (email, password, nom, prenom, telephone, role, created_at)
      VALUES (?, ?, ?, ?, ?, 'user', datetime('now'))
    `).run(email, hashedPassword, nom, prenom, telephone || null);

    // Créer le token JWT
    const token = jwt.sign(
      { userId: result.lastInsertRowid, email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: result.lastInsertRowid,
        email,
        nom,
        prenom,
        role: 'user'
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Connexion
app.post('/api/auth/connexion', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email et mot de passe requis' 
      });
    }

    const db = await getDatabase();
    
    // Récupérer l'utilisateur
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ 
        error: 'Email ou mot de passe incorrect' 
      });
    }

    // Vérifier le mot de passe
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ 
        error: 'Email ou mot de passe incorrect' 
      });
    }

    // Créer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Vérification du token
app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const user = db.prepare('SELECT id, email, nom, prenom, role FROM users WHERE id = ?')
                  .get(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({
      message: 'Token valide',
      user
    });

  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// ROUTES DES PROPRIÉTÉS

// Lister toutes les propriétés
app.get('/api/properties', async (req, res) => {
  try {
    const db = await getDatabase();
    const properties = db.prepare(`
      SELECT p.*, u.nom, u.prenom, u.email as proprietaire_email
      FROM properties p
      LEFT JOIN users u ON p.proprietaire_id = u.id
      ORDER BY p.created_at DESC
    `).all();

    res.json({
      message: 'Propriétés récupérées avec succès',
      count: properties.length,
      properties
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Créer une nouvelle propriété
app.post('/api/properties', authenticateToken, async (req, res) => {
  try {
    const {
      titre,
      description,
      type,
      prix,
      superficie,
      localisation,
      nombre_chambres,
      nombre_salles_bain,
      equipements
    } = req.body;

    if (!titre || !type || !prix || !localisation) {
      return res.status(400).json({ 
        error: 'Titre, type, prix et localisation sont requis' 
      });
    }

    const db = await getDatabase();
    
    const result = db.prepare(`
      INSERT INTO properties (
        titre, description, type, prix, superficie, localisation,
        nombre_chambres, nombre_salles_bain, equipements,
        proprietaire_id, statut, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'disponible', datetime('now'))
    `).run(
      titre,
      description || null,
      type,
      prix,
      superficie || null,
      localisation,
      nombre_chambres || null,
      nombre_salles_bain || null,
      equipements || null,
      req.user.userId
    );

    // Récupérer la propriété créée avec les infos du propriétaire
    const newProperty = db.prepare(`
      SELECT p.*, u.nom, u.prenom, u.email as proprietaire_email
      FROM properties p
      LEFT JOIN users u ON p.proprietaire_id = u.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      message: 'Propriété créée avec succès',
      property: newProperty
    });

  } catch (error) {
    console.error('Erreur lors de la création de la propriété:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Récupérer une propriété par ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    
    const property = db.prepare(`
      SELECT p.*, u.nom, u.prenom, u.email as proprietaire_email
      FROM properties p
      LEFT JOIN users u ON p.proprietaire_id = u.id
      WHERE p.id = ?
    `).get(id);

    if (!property) {
      return res.status(404).json({ 
        error: 'Propriété non trouvée' 
      });
    }

    res.json({
      message: 'Propriété récupérée avec succès',
      property
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la propriété:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Mettre à jour une propriété
app.put('/api/properties/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titre,
      description,
      type,
      prix,
      superficie,
      localisation,
      nombre_chambres,
      nombre_salles_bain,
      equipements,
      statut
    } = req.body;

    const db = await getDatabase();
    
    // Vérifier que la propriété existe et appartient à l'utilisateur
    const existingProperty = db.prepare('SELECT proprietaire_id FROM properties WHERE id = ?').get(id);
    if (!existingProperty) {
      return res.status(404).json({ error: 'Propriété non trouvée' });
    }

    if (existingProperty.proprietaire_id !== req.user.userId) {
      return res.status(403).json({ error: 'Non autorisé à modifier cette propriété' });
    }

    // Mettre à jour la propriété
    db.prepare(`
      UPDATE properties SET
        titre = ?, description = ?, type = ?, prix = ?, superficie = ?,
        localisation = ?, nombre_chambres = ?, nombre_salles_bain = ?,
        equipements = ?, statut = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      titre || null,
      description || null,
      type || null,
      prix || null,
      superficie || null,
      localisation || null,
      nombre_chambres || null,
      nombre_salles_bain || null,
      equipements || null,
      statut || 'disponible',
      id
    );

    // Récupérer la propriété mise à jour
    const updatedProperty = db.prepare(`
      SELECT p.*, u.nom, u.prenom, u.email as proprietaire_email
      FROM properties p
      LEFT JOIN users u ON p.proprietaire_id = u.id
      WHERE p.id = ?
    `).get(id);

    res.json({
      message: 'Propriété mise à jour avec succès',
      property: updatedProperty
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la propriété:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Supprimer une propriété
app.delete('/api/properties/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    
    // Vérifier que la propriété existe et appartient à l'utilisateur
    const existingProperty = db.prepare('SELECT proprietaire_id FROM properties WHERE id = ?').get(id);
    if (!existingProperty) {
      return res.status(404).json({ error: 'Propriété non trouvée' });
    }

    if (existingProperty.proprietaire_id !== req.user.userId) {
      return res.status(403).json({ error: 'Non autorisé à supprimer cette propriété' });
    }

    // Supprimer la propriété
    db.prepare('DELETE FROM properties WHERE id = ?').run(id);

    res.json({
      message: 'Propriété supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la propriété:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route pour les propriétés d'un utilisateur spécifique
app.get('/api/user/properties', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const properties = db.prepare(`
      SELECT * FROM properties 
      WHERE proprietaire_id = ?
      ORDER BY created_at DESC
    `).all(req.user.userId);

    res.json({
      message: 'Propriétés de l\'utilisateur récupérées avec succès',
      count: properties.length,
      properties
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des propriétés utilisateur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route non trouvée',
    availableRoutes: {
      auth: [
        'POST /api/auth/inscription',
        'POST /api/auth/connexion',
        'GET /api/auth/verify'
      ],
      properties: [
        'GET /api/properties',
        'POST /api/properties',
        'GET /api/properties/:id',
        'PUT /api/properties/:id',
        'DELETE /api/properties/:id',
        'GET /api/user/properties'
      ],
      system: [
        'GET /health',
        'GET /db-test'
      ]
    }
  });
});

// Initialisation du serveur
async function startServer() {
  try {
    console.log('🚀 Démarrage du serveur Teranga Foncier...');
    
    console.log('🔄 ÉTAPE 1: Initialisation base de données...');
    await getDatabase();
    console.log('✅ ÉTAPE 1: Base de données prête');
    
    console.log('🔄 ÉTAPE 2: Configuration authentification...');
    console.log('✅ ÉTAPE 2: Authentification configurée (JWT + bcrypt)');
    
    console.log('🔄 ÉTAPE 3: Configuration routes propriétés...');
    console.log('✅ ÉTAPE 3: Routes propriétés configurées');
    
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(60));
      console.log(`✅ SERVEUR COMPLET démarré sur http://localhost:${PORT}`);
      console.log('='.repeat(60));
      console.log(`📊 Health Check: http://localhost:${PORT}/health`);
      console.log(`🗄️ DB Test: http://localhost:${PORT}/db-test`);
      console.log('\n🔐 ROUTES D\'AUTHENTIFICATION:');
      console.log(`   👤 Inscription: POST http://localhost:${PORT}/api/auth/inscription`);
      console.log(`   🔑 Connexion: POST http://localhost:${PORT}/api/auth/connexion`);
      console.log(`   🔍 Verify Token: GET http://localhost:${PORT}/api/auth/verify`);
      console.log('\n🏠 ROUTES DES PROPRIÉTÉS:');
      console.log(`   📋 Liste: GET http://localhost:${PORT}/api/properties`);
      console.log(`   ➕ Créer: POST http://localhost:${PORT}/api/properties`);
      console.log(`   👁️ Détail: GET http://localhost:${PORT}/api/properties/:id`);
      console.log(`   ✏️ Modifier: PUT http://localhost:${PORT}/api/properties/:id`);
      console.log(`   🗑️ Supprimer: DELETE http://localhost:${PORT}/api/properties/:id`);
      console.log(`   👨‍💼 Mes propriétés: GET http://localhost:${PORT}/api/user/properties`);
      console.log('\n' + '='.repeat(60));
      console.log('🎉 TOUTES LES ÉTAPES TERMINÉES - API COMPLÈTE PRÊTE !');
      console.log('='.repeat(60));
    });
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();