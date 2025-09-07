// Quick auth debug script
import { supabase } from './src/lib/supabaseClient.js';

async function debugAuth() {
  console.log('🔍 Debugging Authentication...');
  
  try {
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Current session:', session ? 'EXISTS' : 'NULL');
    if (sessionError) console.error('Session error:', sessionError);
    
    if (session?.user) {
      console.log('User ID:', session.user.id);
      console.log('User email:', session.user.email);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error('Profile error:', profileError);
      } else if (profile) {
        console.log('Profile found:', profile);
      } else {
        console.log('❌ No profile found for user');
        
        // Create profile
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: session.user.id,
            email: session.user.email,
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            verification_status: 'verified'
          })
          .select()
          .single();
          
        if (createError) {
          console.error('Create profile error:', createError);
        } else {
          console.log('✅ Profile created:', newProfile);
        }
      }
    }
    
    // List all profiles
    const { data: allProfiles, error: listError } = await supabase
      .from('user_profiles')
      .select('*');
      
    if (listError) {
      console.error('List profiles error:', listError);
    } else {
      console.log('All profiles:', allProfiles);
    }
    
  } catch (error) {
    console.error('Debug error:', error);
  }
}

debugAuth();
