import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Serveur test fonctionnel'
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'API Test route works!' });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur TEST opérationnel sur http://localhost:${PORT}`);
});
