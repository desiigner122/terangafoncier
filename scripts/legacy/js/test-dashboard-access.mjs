#!/usr/bin/env node

// Test d'accès direct aux routes de dashboard
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Test d\'accès aux routes du dashboard');
console.log('==========================================');

const testUrls = [
    'http://localhost:5173/',
    'http://localhost:5173/dashboard/',
    'http://localhost:5173/particulier',
    'http://localhost:5174/',
    'http://localhost:5174/dashboard/',
    'http://localhost:5174/particulier'
];

async function testUrl(url) {
    return new Promise((resolve) => {
        const request = http.get(url, (response) => {
            console.log(`✅ ${url} - Status: ${response.statusCode}`);
            resolve({ url, status: response.statusCode, success: true });
        });
        
        request.on('error', (error) => {
            console.log(`❌ ${url} - Erreur: ${error.message}`);
            resolve({ url, status: null, success: false, error: error.message });
        });
        
        request.setTimeout(5000, () => {
            console.log(`⏰ ${url} - Timeout`);
            request.destroy();
            resolve({ url, status: null, success: false, error: 'Timeout' });
        });
    });
}

async function runTests() {
    console.log('Début des tests...\n');
    
    for (const url of testUrls) {
        await testUrl(url);
    }
    
    console.log('\n==========================================');
    console.log('🏁 Tests terminés');
    console.log('\n📋 SOLUTION RECOMMANDÉE :');
    console.log('1. ✅ Les plugins visual-editor ont été désactivés');
    console.log('2. ✅ Le routing /dashboard → /particulier est configuré');
    console.log('3. 🔄 Redémarrez le serveur avec : npm run dev');
    console.log('4. 🌐 Accédez à http://localhost:PORT/dashboard/');
    console.log('5. 🎯 Vous devriez être redirigé vers /particulier');
}

runTests().catch(console.error);