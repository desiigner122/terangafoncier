// Test debug pour l'authentification frontend
console.log('🔍 DEBUG: Test de l\'authentification');

// Test 1: Vérifier la configuration
console.log('1. Vérification de la configuration...');
console.log('localStorage use_local_auth:', localStorage.getItem('use_local_auth'));
console.log('hostname:', window.location.hostname);

// Test 2: Test direct de l'API
console.log('2. Test direct de l\'API...');
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
.then(response => response.json())
.then(data => {
    console.log('✅ API Response:', data);
    
    // Test 3: Simuler le comportement du UnifiedAuthService
    if (data.success && data.data) {
        const { user, token } = data.data;
        console.log('✅ User:', user);
        console.log('✅ Token:', token.substring(0, 30) + '...');
        
        // Sauvegarder temporairement
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
        console.log('✅ Données sauvegardées dans localStorage');
    }
})
.catch(error => {
    console.error('❌ Erreur API:', error);
});

// Export pour pouvoir être appelé depuis la console
window.debugAuth = () => {
    console.log('🔍 État actuel:');
    console.log('- Token:', localStorage.getItem('auth_token')?.substring(0, 30) + '...');
    console.log('- User:', JSON.parse(localStorage.getItem('current_user') || 'null'));
};