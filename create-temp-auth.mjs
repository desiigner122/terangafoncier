// Script de test pour créer une authentification temporaire
import { supabase } from './src/lib/customSupabaseClient.js';

console.log('🧪 Test de création d\'authentification temporaire...');

// Créer un utilisateur de test temporaire
const testUser = {
  id: 'f6675084-963a-4727-9188-4e7d1cdbffd6',
  email: 'palaye122@hotmail.fr',
  role: 'particulier',
  verification_status: 'verified',
  created_at: new Date().toISOString(),
  user_metadata: {
    role: 'particulier',
    full_name: 'Utilisateur Test',
    region: 'Dakar'
  }
};

const testSession = {
  access_token: 'test_token_' + Date.now(),
  refresh_token: 'refresh_token_' + Date.now(),
  expires_at: Date.now() + 3600000, // 1 heure
  user: testUser
};

// Sauvegarder dans localStorage pour simulation
const authData = {
  user: testUser,
  session: testSession
};

console.log('✅ Données d\'authentification temporaire créées');
console.log('📝 Pour utiliser:', JSON.stringify(authData, null, 2));

// Instructions pour la console du navigateur
console.log(`
🔧 Pour activer l'authentification temporaire dans le navigateur:
1. Ouvrir la console (F12)
2. Exécuter: localStorage.setItem('temp_auth', '${JSON.stringify(authData).replace(/'/g, "\\'")}');
3. Recharger la page (F5)
`);