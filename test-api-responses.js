import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAPIResponses() {
    console.log('🔍 Testing API responses that might be causing JSON parse errors...\n');

    const tests = [
        {
            name: 'Users table basic query',
            test: () => supabase.from('users').select('id').limit(1)
        },
        {
            name: 'Requests table with request_type column',
            test: () => supabase.from('requests').select('request_type').limit(1)
        },
        {
            name: 'Parcels table with name column',
            test: () => supabase.from('parcels').select('name').limit(1)
        },
        {
            name: 'Blog table with published_at column',
            test: () => supabase.from('blog').select('published_at').limit(1)
        },
        {
            name: 'Audit_logs table with target_id column',
            test: () => supabase.from('audit_logs').select('target_id').limit(1)
        }
    ];

    for (const { name, test } of tests) {
        console.log(`\n🧪 Testing: ${name}`);
        try {
            const { data, error } = await test();
            if (error) {
                console.log(`❌ ERROR: ${error.message}`);
                console.log(`🔧 Details: ${JSON.stringify(error, null, 2)}`);
            } else {
                console.log(`✅ SUCCESS: Got ${data?.length || 0} rows`);
            }
        } catch (err) {
            console.log(`💥 EXCEPTION: ${err.message}`);
        }
    }
}

testAPIResponses().catch(console.error);
