// Direct SQL execution via Supabase REST API
// This uses the Query HTTP API endpoint that Supabase exposes

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const fixSql = `
ALTER TABLE public.requests
DROP CONSTRAINT IF EXISTS requests_status_check;

ALTER TABLE public.requests
ADD CONSTRAINT requests_status_check 
CHECK (status IN ('pending', 'initiated', 'accepted', 'rejected', 'cancelled', 'negotiation', 'completed', 'on_hold'));
`;

async function executeDirectSQL() {
  try {
    console.log('🔧 Attempting direct SQL execution via REST API...\n');
    
    // Supabase's psql-http endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        sql: fixSql
      })
    });
    
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response:', JSON.stringify(result, null, 2));
    
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\nℹ️  Direct SQL execution via REST API not available.');
    console.log('\n💡 SOLUTION: Execute the SQL manually in Supabase Dashboard > SQL Editor');
    console.log('\nSQL to execute:');
    console.log('---');
    console.log(fixSql);
    console.log('---');
  }
}

executeDirectSQL();
