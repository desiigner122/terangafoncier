import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMinimalInsertion() {
    console.log('🧪 Test insertion très minimal...\n');

    // Test avec seulement title
    console.log('1️⃣ Test avec title seulement:');
    let result = await supabase.from('blog').insert([{ title: 'Test Title Only' }]);
    console.log('Résultat:', result.error ? `❌ ${result.error.message}` : '✅ Succès');

    // Test avec title et content
    console.log('\n2️⃣ Test avec title et content:');
    result = await supabase.from('blog').insert([{ 
        title: 'Test Title Content', 
        content: 'Test content' 
    }]);
    console.log('Résultat:', result.error ? `❌ ${result.error.message}` : '✅ Succès');

    // Test avec author_id au lieu d'author_name
    console.log('\n3️⃣ Test avec author_id:');
    result = await supabase.from('blog').insert([{ 
        title: 'Test Author ID', 
        content: 'Test content',
        author_id: '123' 
    }]);
    console.log('Résultat:', result.error ? `❌ ${result.error.message}` : '✅ Succès');

    // Test avec excerpt
    console.log('\n4️⃣ Test avec excerpt:');
    result = await supabase.from('blog').insert([{ 
        title: 'Test Excerpt', 
        content: 'Test content',
        excerpt: 'Test excerpt'
    }]);
    console.log('Résultat:', result.error ? `❌ ${result.error.message}` : '✅ Succès');

    // Test avec image_url
    console.log('\n5️⃣ Test avec image_url:');
    result = await supabase.from('blog').insert([{ 
        title: 'Test Image', 
        content: 'Test content',
        image_url: 'https://example.com/image.jpg'
    }]);
    console.log('Résultat:', result.error ? `❌ ${result.error.message}` : '✅ Succès');

    // Test avec published
    console.log('\n6️⃣ Test avec published:');
    result = await supabase.from('blog').insert([{ 
        title: 'Test Published', 
        content: 'Test content',
        published: true
    }]);
    console.log('Résultat:', result.error ? `❌ ${result.error.message}` : '✅ Succès');

    // Test avec tags
    console.log('\n7️⃣ Test avec tags:');
    result = await supabase.from('blog').insert([{ 
        title: 'Test Tags', 
        content: 'Test content',
        tags: ['test', 'blog']
    }]);
    console.log('Résultat:', result.error ? `❌ ${result.error.message}` : '✅ Succès');
}

testMinimalInsertion().catch(console.error);
