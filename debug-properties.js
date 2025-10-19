// Script de diagnostic pour vérifier les properties
import { supabase } from './src/lib/supabaseClient.js';

async function debugProperties() {
  try {
    console.log('🔍 Chargement des properties...');
    
    // Charger les première 5 propriétés
    const { data: properties, error } = await supabase
      .from('properties')
      .select('id, title, status, verification_status, owner_id')
      .limit(5);
    
    if (error) {
      console.error('❌ Erreur:', error);
      return;
    }
    
    console.log('✅ Properties trouvées:');
    properties.forEach((prop, index) => {
      console.log(`${index + 1}. ID: ${prop.id}, Title: ${prop.title}, Status: ${prop.status}, Verified: ${prop.verification_status}`);
    });
    
    // Tester l'accès à une property
    if (properties.length > 0) {
      const testId = properties[0].id;
      console.log(`\n🔄 Test d'accès à l'ID: ${testId}`);
      
      const { data: testProp, error: testError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', testId)
        .single();
      
      if (testError) {
        console.error('❌ Erreur lors de l\'accès:', testError);
      } else {
        console.log('✅ Accès réussi:', testProp?.title);
      }
    }
    
  } catch (err) {
    console.error('❌ Erreur:', err);
  }
}

debugProperties();
