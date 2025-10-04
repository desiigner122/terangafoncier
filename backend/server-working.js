import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { getDatabase } from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test base de données
app.get('/test-db', async (req, res) => {
  try {
    const db = await getDatabase();
    res.json({ 
      success: true, 
      message: 'Base de données connectée',
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

// AUTHENTIFICATION SIMPLIFIÉE
app.post('/api/auth/inscription', async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe || !nom) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    const bcrypt = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');
    const db = await getDatabase();

    // Vérifier si email existe
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.default.hash(mot_de_passe, 10);

    // Insérer utilisateur
    const result = await db.run(`
      INSERT INTO users (nom, email, mot_de_passe, date_creation)
      VALUES (?, ?, ?, datetime('now'))
    `, [nom, email.toLowerCase(), hashedPassword]);

    const userId = result.lastID;

    // Générer token
    const token = jwt.default.sign(
      { 
        id: userId, 
        email: email.toLowerCase(),
        nom: nom
      },
      process.env.JWT_SECRET || 'teranga-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
      data: {
        user: {
          id: userId,
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

// CONNEXION
app.post('/api/auth/connexion', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    const bcrypt = await import('bcryptjs');
    const jwt = await import('jsonwebtoken');
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
    const isValidPassword = await bcrypt.default.compare(mot_de_passe, user.mot_de_passe);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer token
    const token = jwt.default.sign(
      { 
        id: user.id, 
        email: user.email,
        nom: user.nom,
        role: user.role
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
          role: user.role
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

// LISTE DES PROPRIÉTÉS
app.get('/api/properties', async (req, res) => {
  try {
    const db = await getDatabase();
    const properties = await db.all('SELECT * FROM properties ORDER BY date_creation DESC LIMIT 20');
    
    res.json({
      success: true,
      data: {
        properties,
        count: properties.length
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Erreur serveur:', error);
  res.status(500).json({
    success: false,
    message: 'Erreur serveur interne',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
  });
});

// Initialiser la base de données au démarrage
async function startServer() {
  try {
    await getDatabase();
    console.log('✅ Base de données initialisée');
    
    app.listen(PORT, () => {
      console.log(`🚀 Serveur Teranga Foncier démarré sur le port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Test DB: http://localhost:${PORT}/test-db`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Erreur démarrage serveur:', error);
    process.exit(1);
  }
}

startServer();

export default app;