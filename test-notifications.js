import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://ndenqikcogzrkrjnlvns.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM'
);

(async () => {
  try {
    console.log('=== Test des requêtes notifications ===');
    
    // Test 1: Requête simple sans filtres
    console.log('Test 1: Requête simple...');
    const { data: simple, error: simpleError } = await supabase
      .from('notifications')
      .select('*')
      .limit(5);
    
    if (simpleError) {
      console.error('❌ Erreur requête simple:', simpleError);
    } else {
      console.log('✅ Requête simple réussie:', simple);
    }
    
    // Test 2: Count exact comme dans l'erreur
    console.log('\nTest 2: Count exact...');
    const { count, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Erreur count exact:', countError);
    } else {
      console.log('✅ Count exact réussi:', count);
    }
    
    // Test 3: Avec filtres comme dans l'application
    console.log('\nTest 3: Avec filtres...');
    const testUserId = 'fc695f01-0a6a-4c1a-9788-028316bd8f5d';
    const { data: filtered, error: filteredError } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', testUserId)
      .eq('read', false);
    
    if (filteredError) {
      console.error('❌ Erreur requête filtrée:', filteredError);
    } else {
      console.log('✅ Requête filtrée réussie:', filtered);
    }
    
    // Test 4: Count avec filtres (comme dans l'erreur HTTP 400)
    console.log('\nTest 4: Count avec filtres...');
    const { count: filteredCount, error: filteredCountError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', testUserId)
      .eq('read', false);
    
    if (filteredCountError) {
      console.error('❌ Erreur count filtré:', filteredCountError);
      console.error('Détails de l\'erreur:', JSON.stringify(filteredCountError, null, 2));
    } else {
      console.log('✅ Count filtré réussi:', filteredCount);
    }
    
  } catch (err) {
    console.error('Erreur générale:', err);
  }
})();
