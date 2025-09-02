// Script de diagnostic pour la console du navigateur
// À coller dans https://terangafoncier.vercel.app (F12 > Console)

console.log('=== DIAGNOSTIC VERCEL/SUPABASE ===');

// Fonction pour charger Supabase depuis CDN
function loadSupabase() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.30.0/dist/umd/supabase.min.js';
    script.onload = () => resolve(window.supabase);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Fonction principale de diagnostic
async function diagnose() {
  try {
    // Attendre le chargement de Supabase
    await loadSupabase();

    // Vérifier les variables d'environnement (si elles sont exposées)
    console.log('Vérification des variables...');

    // Pour Vite, les variables sont injectées dans import.meta.env
    // mais on ne peut pas y accéder directement dans la console
    // On va tester avec les valeurs connues

    const SUPABASE_URL = 'https://ndenqikcogzrkrjnlvns.supabase.co'; // À remplacer si différent
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM'; // À remplacer si différent

    console.log('URL testée:', SUPABASE_URL);
    console.log('Clé présente:', !!SUPABASE_ANON_KEY);

    // Créer le client Supabase
    const { createClient } = window.supabase;
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Test de connexion
    console.log('Test de connexion à la table users...');
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Erreur de connexion:', error.message);
      console.error('Détails:', error);

      if (error.message.includes('Could not find the table')) {
        console.log('🔍 Problème: Table users introuvable');
        console.log('Solutions:');
        console.log('1. Vérifier que la table existe dans Supabase');
        console.log('2. Vérifier les variables d\'environnement sur Vercel');
        console.log('3. Vider le cache Supabase');
      }
    } else {
      console.log('✅ Connexion réussie!');
      console.log('Données reçues:', data);
    }

  } catch (e) {
    console.error('❌ Erreur lors du diagnostic:', e.message);
  }
}

// Lancer le diagnostic
diagnose();
