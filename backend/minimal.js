import express from 'express'; const app = express(); app.get('/health', (req,res) => res.json({status:'OK'})); app.listen(5000, () => console.log('✅ Server OK http://localhost:5000/health'));
