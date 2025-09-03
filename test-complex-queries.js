import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testComplexQueries() {
    console.log('🔍 Testing complex queries that might fail in production...\n');

    const tests = [
        {
            name: 'Admin Dashboard - Users count',
            test: () => supabase.from('users').select('*', { count: 'exact' })
        },
        {
            name: 'Admin Dashboard - Complex requests join',
            test: () => supabase.from('requests').select('*, user:user_id(full_name, role)').limit(1)
        },
        {
            name: 'Admin Dashboard - Complex parcels join',
            test: () => supabase.from('parcels').select('*, seller:seller_id(full_name)').limit(1)
        },
        {
            name: 'Auth Profile Fetch',
            test: () => supabase.from('users').select('*').eq('role', 'Admin').single()
        },
        {
            name: 'Notifications with User Join',
            test: () => supabase.from('notifications').select('*, user:user_id(full_name)').limit(1)
        },
        {
            name: 'Audit Logs Complex Query',
            test: () => supabase.from('audit_logs').select('*, user:actor_id(full_name)').limit(1)
        }
    ];

    for (const { name, test } of tests) {
        console.log(`\n🧪 Testing: ${name}`);
        try {
            const { data, error, count } = await test();
            if (error) {
                console.log(`❌ ERROR: ${error.message}`);
                console.log(`🔧 Error Code: ${error.code}`);
                console.log(`🔧 Hint: ${error.hint || 'No hint'}`);
                console.log(`🔧 Details: ${error.details || 'No details'}`);
            } else {
                console.log(`✅ SUCCESS: Got ${data?.length || 0} rows${count !== undefined ? ` (count: ${count})` : ''}`);
            }
        } catch (err) {
            console.log(`💥 EXCEPTION: ${err.message}`);
        }
    }
}

testComplexQueries().catch(console.error);
