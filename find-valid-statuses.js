import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function findValidStatuses() {
  const statuses = ['pending', 'initiated', 'accepted', 'rejected', 'cancelled', 'negotiation', 'completed', 'seller_accepted', 'on_hold', 'draft'];
  
  console.log('🔍 Testing which status values are accepted by requests.status constraint...\n');
  
  for (const status of statuses) {
    const testId = `00000000-0000-0000-0000-${String(statuses.indexOf(status)).padStart(12, '0')}`;
    
    const { error } = await supabase
      .from('requests')
      .insert([{ 
        id: testId, 
        status,
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error && error.code === '23514') {
      console.log(`❌ ${status.padEnd(20)} - REJECTED by constraint`);
    } else if (error) {
      console.log(`⚠️  ${status.padEnd(20)} - Error: ${error.code}`);
    } else {
      console.log(`✅ ${status.padEnd(20)} - ACCEPTED`);
      // Clean up
      await supabase.from('requests').delete().eq('id', testId);
    }
  }
}

findValidStatuses();
