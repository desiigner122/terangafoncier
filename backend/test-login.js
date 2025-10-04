const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('🔄 Test de connexion admin...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@teranga.com',
        password: 'admin123'
      })
    });

    console.log('📡 Status:', response.status);
    console.log('📡 Headers:', Object.fromEntries(response.headers));

    const data = await response.text();
    console.log('📄 Réponse brute:', data);

    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('✅ Connexion réussie !');
      console.log('👤 Données utilisateur:', jsonData.data?.user);
      console.log('🔑 Token reçu:', jsonData.data?.token ? 'OUI' : 'NON');
    } else {
      console.log('❌ Erreur de connexion');
      console.log('💬 Message:', data);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testLogin();