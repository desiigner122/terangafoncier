#!/usr/bin/env npx tsx

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  try {
    // Try to insert a test request with 'accepted' status
    const testData = {
      id: '00000000-0000-0000-0000-000000000001', // Fake UUID for testing
      status: 'accepted',
      created_at: new Date().toISOString()
    };
    
    console.log('🧪 Testing requests.status constraint with accepted value...');
    
    const { data, error } = await supabase
      .from('requests')
      .insert([testData])
      .select();
    
    if (error) {
      console.error('❌ Insert failed:', error.code, '-', error.message);
      if (error.code === '23514') {
        console.log('⚠️ CHECK constraint violation - "accepted" is not in allowed values');
      }
    } else {
      console.log('✅ Insert succeeded! Constraint accepts "accepted"');
      console.log('Data:', data);
      
      // Clean up
      await supabase.from('requests').delete().eq('id', testData.id);
    }
  } catch (err) {
    console.error('💥 Exception:', err.message);
  }
}

test();
