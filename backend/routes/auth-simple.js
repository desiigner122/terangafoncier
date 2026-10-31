import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../config/database.js';

// Aucun secret de secours : refuser explicitement si JWT_SECRET est absent.
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET manquant ou trop court (32 caractères minimum)');
  }
  return secret;
};

const router = express.Router();

// 🔐 INSCRIPTION UTILISATEUR
router.post('/inscription', async (req, res) => {
  try {
    const { nom, email, mot_de_passe } = req.body;

    // Validation de base
    if (!email || !mot_de_passe || !nom) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    if (mot_de_passe.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    const db = await getDatabase();

    // Vérifier si email existe déjà
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Insérer l'utilisateur
    const result = await db.run(`
      INSERT INTO users (nom, email, mot_de_passe, date_creation)
      VALUES (?, ?, ?, datetime('now'))
    `, [nom, email.toLowerCase(), hashedPassword]);

    const userId = result.lastID;

    // Générer token JWT
    const token = jwt.sign(
      { 
        id: userId, 
        email: email.toLowerCase(),
        nom: nom
      },
      getJwtSecret(),
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
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
});

// 🔑 CONNEXION UTILISATEUR
router.post('/connexion', async (req, res) => {
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
        role: user.role
      },
      getJwtSecret(),
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
      message: 'Erreur serveur lors de la connexion'
    });
  }
});

// 👤 PROFIL UTILISATEUR
router.get('/profil', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis'
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const db = await getDatabase();

    const user = await db.get(
      'SELECT id, nom, email, role, telephone, adresse, date_creation, derniere_connexion FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role,
          telephone: user.telephone,
          adresse: user.adresse,
          dateCreation: user.date_creation,
          derniereConnexion: user.derniere_connexion
        }
      }
    });

  } catch (error) {
    console.error('Erreur profil:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// 🔍 VÉRIFIER TOKEN
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token requis'
      });
    }

    const decoded = jwt.verify(token, getJwtSecret());
    
    res.json({
      success: true,
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

export default router;