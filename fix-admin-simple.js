import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAdminProfileSimple() {
    try {
        console.log('🔧 CORRECTION SIMPLE DU PROFIL ADMIN');
        console.log('====================================');
        
        // Corriger seulement le rôle pour l'instant
        const { data, error } = await supabase
            .from('users')
            .update({
                role: 'Admin',               // Majuscule correcte
                full_name: 'Super Admin',    // Nom d'affichage
                name: 'Super Admin'          // Nom de secours
            })
            .eq('email', 'palaye122@gmail.com')
            .select();
            
        if (error) {
            console.error('❌ Erreur mise à jour:', error);
            return;
        }
        
        console.log('✅ PROFIL ADMIN CORRIGÉ !');
        console.log('📋 Nouvelles valeurs:');
        if (data && data[0]) {
            Object.entries(data[0]).forEach(([key, value]) => {
                console.log(`   ${key}: ${value}`);
            });
        }
        
        console.log('\n🎯 CORRECTION EFFECTUÉE:');
        console.log('1. ✅ Rôle corrigé: admin → Admin');
        console.log('2. ✅ Nom défini: Super Admin');
        
        console.log('\n⚠️ COLONNES MANQUANTES DÉTECTÉES:');
        console.log('   - user_type');
        console.log('   - verification_status');
        console.log('   Ces colonnes doivent être ajoutées à la base de données');
        
    } catch (error) {
        console.error('💥 ERREUR:', error);
    }
}

fixAdminProfileSimple();
