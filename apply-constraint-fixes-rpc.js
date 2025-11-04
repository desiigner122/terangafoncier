import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function applyConstraintFixes() {
  try {
    console.log('🔧 Attempting to apply constraint fixes via RPC...\n');
    
    // Try to call the function
    const { data, error } = await supabase.rpc('apply_constraint_fixes');
    
    if (error) {
      console.error('❌ RPC call failed:', error.message);
      console.log('\nℹ️  The RPC function may not exist yet on the server.');
      console.log('You need to execute the SQL migrations directly in Supabase dashboard.');
      return;
    }
    
    console.log('✅ RPC call succeeded:', data);
    
    // Test if the fix worked
    console.log('\n🧪 Testing if constraints now accept "accepted" status...');
    
    const testId = '00000000-0000-0000-0000-111111111111';
    const { error: insertError } = await supabase
      .from('requests')
      .insert([{
        id: testId,
        status: 'accepted',
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (insertError) {
      if (insertError.code === '23514') {
        console.error('❌ Constraint still rejects "accepted" - RPC fix did not work');
      } else {
        console.error('❌ Insert failed:', insertError.message);
      }
    } else {
      console.log('✅✅✅ SUCCESS! Constraints now accept "accepted" status!');
      // Clean up test data
      await supabase.from('requests').delete().eq('id', testId);
    }
    
  } catch (err) {
    console.error('💥 Exception:', err.message);
  }
}

applyConstraintFixes();
