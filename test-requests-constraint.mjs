import { supabase } from './src/lib/supabaseClient.js';

async function testRequestsConstraint() {
  try {
    console.log('🧪 Testing requests.status constraint...');
    
    // Try to create or update with 'accepted' status
    const { data, error } = await supabase
      .from('requests')
      .select('id, status')
      .limit(1);
    
    if (error) {
      console.error('❌ Error querying requests:', error);
      return;
    }
    
    console.log('✅ Requests table accessible, found', data.length, 'requests');
    
    if (data.length > 0) {
      const requestId = data[0].id;
      const currentStatus = data[0].status;
      
      console.log(`ℹ️ Current status of request ${requestId}:`, currentStatus);
      
      // Try to update to 'accepted'
      const { data: updated, error: updateError } = await supabase
        .from('requests')
        .update({ status: 'accepted' })
        .eq('id', requestId)
        .select();
      
      if (updateError) {
        console.error('❌ Error updating to "accepted":', updateError.message);
      } else {
        console.log('✅ Successfully updated to "accepted":', updated[0].status);
      }
    }
  } catch (err) {
    console.error('💥 Exception:', err.message);
  }
}

testRequestsConstraint();
