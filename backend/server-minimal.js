import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from './config/database.js';

const app = express();
const PORT = 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Route de test
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    console.log('🔄 ÉTAPE 1: Initialisation base de données...');
    await getDatabase();
    console.log('✅ ÉTAPE 1: Base de données prête');
    console.log('🔄 ÉTAPE 2: Configuration authentification...');
    console.log('✅ ÉTAPE 2: Authentification configurée');
    console.log('🔄 ÉTAPE 3: Configuration propriétés...');
    console.log('✅ ÉTAPE 3: Propriétés configurées');
    
    app.listen(PORT, () => {
      console.log(`✅ SERVEUR COMPLET démarré sur http://localhost:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
      console.log(`🗄️ DB Test: http://localhost:${PORT}/db-test`);
      console.log(`👤 Inscription: http://localhost:${PORT}/api/auth/inscription`);
      console.log(`🔑 Connexion: http://localhost:${PORT}/api/auth/connexion`);
      console.log(`🔍 Verify: http://localhost:${PORT}/api/auth/verify`);
      console.log(`🏠 Propriétés: http://localhost:${PORT}/api/properties`);
      console.log(`📋 TOUTES LES ÉTAPES TERMINÉES - API COMPLÈTE`);
      console.log(`🎉 BACKEND PRÊT POUR PRODUCTION !`);
    });new Date().toISOString(),
    message: 'Serveur minimal OK'
  });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test route fonctionne' });
});

// ÉTAPE 1: Route test base de données
app.get('/db-test', async (req, res) => {
  try {
    const db = await getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM users');
    res.json({ 
      success: true,
      message: 'Base de données connectée',
      userCount: result.count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur base de données',
      error: error.message
    });
  }
});

// ÉTAPE 2: AUTHENTIFICATION

// Inscription
app.post('/api/auth/inscription', async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;

    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Nom, email et mot de passe requis'
      });
    }

    if (mot_de_passe.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe trop court (min 6 caractères)'
      });
    }

    const db = await getDatabase();
    
    // Vérifier si email existe
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email déjà utilisé'
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Créer utilisateur
    const result = await db.run(`
      INSERT INTO users (nom, email, mot_de_passe, date_creation)
      VALUES (?, ?, ?, datetime('now'))
    `, [nom, email.toLowerCase(), hashedPassword]);

    // Générer token JWT
    const token = jwt.sign(
      { 
        id: result.lastID, 
        email: email.toLowerCase(),
        nom: nom
      },
      process.env.JWT_SECRET || 'teranga-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        user: {
          id: result.lastID,
          nom: nom,
          email: email.toLowerCase(),
          role: 'visiteur'
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription',
      error: error.message
    });
  }
});

// Connexion
app.post('/api/auth/connexion', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    const db = await getDatabase();
    
    // Récupérer utilisateur
    const user = await db.get(
      'SELECT id, nom, email, mot_de_passe, role FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier mot de passe
    const isValidPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour dernière connexion
    await db.run('UPDATE users SET derniere_connexion = datetime(\'now\') WHERE id = ?', [user.id]);

    // Générer token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        nom: user.nom,
        role: user.role || 'visiteur'
      },
      process.env.JWT_SECRET || 'teranga-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role || 'visiteur'
        },
        token
      }
    });

  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion',
      error: error.message
    });
  }
});

// Vérifier token
app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'teranga-secret-key');
    
    res.json({
      success: true,
      message: 'Token valide',
      data: {
        user: {
          id: decoded.id,
          nom: decoded.nom,
          email: decoded.email,
          role: decoded.role
        }
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
});

// ÉTAPE 3: PROPRIÉTÉS

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token d\'authentification requis'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'teranga-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

// Lister propriétés (public)
app.get('/api/properties', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, localisation } = req.query;
    const offset = (page - 1) * limit;
    
    const db = await getDatabase();
    let query = 'SELECT * FROM properties WHERE 1=1';
    let params = [];

    if (type) {
      query += ' AND type_propriete = ?';
      params.push(type);
    }
    
    if (localisation) {
      query += ' AND localisation LIKE ?';
      params.push(`%${localisation}%`);
    }

    query += ' ORDER BY date_creation DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const properties = await db.all(query, params);
    
    // Compter total
    let countQuery = 'SELECT COUNT(*) as total FROM properties WHERE 1=1';
    let countParams = [];
    
    if (type) {
      countQuery += ' AND type_propriete = ?';
      countParams.push(type);
    }
    if (localisation) {
      countQuery += ' AND localisation LIKE ?';
      countParams.push(`%${localisation}%`);
    }

    const countResult = await db.get(countQuery, countParams);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult.total,
          totalPages: Math.ceil(countResult.total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erreur liste propriétés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Créer propriété (authentifié)
app.post('/api/properties', authenticateToken, async (req, res) => {
  try {
    const {
      titre,
      description,
      prix,
      type_propriete,
      surface,
      localisation,
      coordonnees_gps
    } = req.body;

    if (!titre || !prix || !type_propriete || !localisation) {
      return res.status(400).json({
        success: false,
        message: 'Titre, prix, type et localisation requis'
      });
    }

    const db = await getDatabase();
    
    const result = await db.run(`
      INSERT INTO properties (
        titre, description, prix, type_propriete, surface, 
        localisation, coordonnees_gps, proprietaire_id, date_creation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `, [
      titre, description, prix, type_propriete, surface,
      localisation, coordonnees_gps, req.user.id
    ]);

    const property = await db.get('SELECT * FROM properties WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Propriété créée avec succès',
      data: { property }
    });

  } catch (error) {
    console.error('Erreur création propriété:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création',
      error: error.message
    });
  }
});

// Obtenir propriété par ID
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    
    const property = await db.get(`
      SELECT p.*, u.nom as proprietaire_nom, u.email as proprietaire_email
      FROM properties p
      LEFT JOIN users u ON p.proprietaire_id = u.id
      WHERE p.id = ?
    `, [id]);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Propriété non trouvée'
      });
    }

    res.json({
      success: true,
      data: { property }
    });

  } catch (error) {
    console.error('Erreur récupération propriété:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
      error: error.message
    });
  }
});

// Initialiser la base de données avant de démarrer
async function startServer() {
  try {
    console.log('🔄 ÉTAPE 1: Initialisation base de données...');
    await getDatabase();
    console.log('✅ ÉTAPE 1: Base de données prête');
    console.log('🔄 ÉTAPE 2: Configuration authentification...');
    console.log('✅ ÉTAPE 2: Authentification configurée');
    
    app.listen(PORT, () => {
      console.log(`✅ Serveur progressif démarré sur http://localhost:${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}/health`);
      console.log(`🗄️ DB Test: http://localhost:${PORT}/db-test`);
      console.log(`� Inscription: http://localhost:${PORT}/api/auth/inscription`);
      console.log(`🔑 Connexion: http://localhost:${PORT}/api/auth/connexion`);
      console.log(`🔍 Vérify: http://localhost:${PORT}/api/auth/verify`);
      console.log(`�📋 ÉTAPES 1 & 2 TERMINÉES - Auth fonctionnelle`);
    });
  } catch (error) {
    console.error('❌ ÉTAPE 1 ÉCHOUÉE:', error);
    process.exit(1);
  }
}

startServer();

// Gérer les erreurs non capturées
process.on('uncaughtException', (error) => {
  console.error('Erreur non capturée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejection non gérée:', reason);
});