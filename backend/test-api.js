// Test simple de l'API Teranga Foncier
const https = require('https');
const http = require('http');

console.log('🧪 TEST API TERANGA FONCIER');
console.log('===========================');

// Test 1: Régions du Sénégal
console.log('\n1. Test des régions du Sénégal...');
http.get('http://localhost:3000/api/regions', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('✅ Régions récupérées:', result.data.length, 'régions');
      console.log('📍 Première région:', result.data[0].name);
      
      // Test 2: Inscription utilisateur
      console.log('\n2. Test inscription utilisateur...');
      const postData = JSON.stringify({
        email: 'testapi@teranga.com',
        password: 'password123',
        first_name: 'API',
        last_name: 'Test'
      });

      const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.success) {
              console.log('✅ Inscription réussie pour:', result.data.user.email);
              console.log('🔑 Token généré:', result.data.token.substring(0, 20) + '...');
              
              // Test 3: Connexion
              testLogin(result.data.user.email);
            } else {
              console.log('⚠️ Inscription échouée:', result.error.message);
              // Si l'utilisateur existe déjà, tester la connexion
              if (result.error.code === 'USER_EXISTS') {
                testLogin('testapi@teranga.com');
              }
            }
          } catch (e) {
            console.log('❌ Erreur parsing inscription:', e.message);
          }
        });
      });

      req.on('error', (e) => {
        console.log('❌ Erreur inscription:', e.message);
      });

      req.write(postData);
      req.end();

    } catch (e) {
      console.log('❌ Erreur parsing régions:', e.message);
    }
  });
}).on('error', (e) => {
  console.log('❌ Erreur connexion serveur:', e.message);
  console.log('🔍 Vérifiez que le serveur tourne sur http://localhost:3000');
});

function testLogin(email) {
  console.log('\n3. Test connexion utilisateur...');
  const postData = JSON.stringify({
    email: email,
    password: 'password123'
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.success) {
          console.log('✅ Connexion réussie pour:', result.data.user.email);
          console.log('👤 Rôles:', result.data.user.roles);
          
          // Test 4: Profil utilisateur
          testProfile(result.data.token);
        } else {
          console.log('❌ Connexion échouée:', result.error.message);
        }
      } catch (e) {
        console.log('❌ Erreur parsing connexion:', e.message);
      }
    });
  });

  req.on('error', (e) => {
    console.log('❌ Erreur connexion:', e.message);
  });

  req.write(postData);
  req.end();
}

function testProfile(token) {
  console.log('\n4. Test profil utilisateur...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.success) {
          console.log('✅ Profil récupéré:', result.data.first_name, result.data.last_name);
          console.log('📧 Email:', result.data.email);
          console.log('📅 Créé le:', new Date(result.data.created_at).toLocaleDateString());
          
          // Test 5: Propriétés publiques
          testPublicProperties();
        } else {
          console.log('❌ Récupération profil échouée:', result.error.message);
        }
      } catch (e) {
        console.log('❌ Erreur parsing profil:', e.message);
      }
    });
  });

  req.on('error', (e) => {
    console.log('❌ Erreur profil:', e.message);
  });

  req.end();
}

function testPublicProperties() {
  console.log('\n5. Test propriétés publiques...');
  
  http.get('http://localhost:3000/api/properties', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('✅ Propriétés récupérées:', result.data.length, 'propriétés');
        console.log('📄 Page:', result.meta.pagination.page, '/', result.meta.pagination.pages);
        console.log('📊 Total:', result.meta.pagination.total, 'propriétés');
        
        console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
        console.log('🚀 L\'API TERANGA FONCIER EST FONCTIONNELLE !');
        console.log('===========================');
      } catch (e) {
        console.log('❌ Erreur parsing propriétés:', e.message);
      }
    });
  }).on('error', (e) => {
    console.log('❌ Erreur propriétés:', e.message);
  });
}