import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Import middlewares
import { globalErrorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth-simple.js';
import propertiesRoutes from './routes/properties-simple.js';
import usersRoutes from './routes/users.js';
import transactionsRoutes from './routes/transactions.js';
import documentsRoutes from './routes/documents.js';
import blockchainRoutes from './routes/blockchain.js';
import aiRoutes from './routes/ai.js';
import aiRoutesNew from './routes/aiRoutes.js'; // SEMAINE 3: Nouvelles routes IA
import notificationsRoutes from './routes/notifications.js';
import dashboardRoutes from './routes/dashboard.js';
import paymentsRoutes from './routes/payments.js';
import paymentRoutesNew from './routes/paymentRoutes.js'; // SEMAINE 2: Nouvelles routes paiements
import docusignRoutes from './routes/docusignRoutes.js'; // SEMAINE 2: Routes DocuSign
import mapsRoutes from './routes/maps.js';

// Import admin routes - NOUVELLES ROUTES ADMIN
import adminRoutes from './routes/admin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
  message: 'Trop de requêtes depuis cette IP, réessayez plus tard.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/ai', aiRoutes); // Routes IA existantes
app.use('/api/ai', aiRoutesNew); // SEMAINE 3: Nouvelles routes IA (validation, fraude, recommandations)
app.use('/api/notifications', notificationsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentsRoutes); // Routes paiements existantes
app.use('/api/payments', paymentRoutesNew); // SEMAINE 2: Nouvelles routes Wave/Orange Money
app.use('/api/docusign', docusignRoutes); // SEMAINE 2: Routes DocuSign e-signature
app.use('/api/maps', mapsRoutes);

// Routes administrateur - NOUVELLES FONCTIONNALITÉS
app.use('/api', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Error handling middleware
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Serveur Teranga Foncier démarré sur le port ${PORT}`);
  console.log(`� Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
});

export default app;