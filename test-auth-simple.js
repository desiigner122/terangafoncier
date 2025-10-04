// Test simple de l'authentification frontend
console.log('Test de l\'authentification...');

// Test 1: Appel direct à l'API
fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'admin@teranga.com',
        password: 'admin123'
    })
})
.then(response => {
    console.log('Response status:', response.status);
    return response.json();
})
.then(data => {
    console.log('✓ SUCCESS - Login API works:', data);
})
.catch(error => {
    console.error('✗ ERROR - Login API failed:', error);
});