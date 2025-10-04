import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de base
app.use(helmet());
app.use(cors());
app.use(express.json());

// Route de test ultra simple
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Serveur minimal fonctionnel'
  });
});

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'API Teranga Foncier - Version test' });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur TEST démarré sur http://localhost:${PORT}`);
});