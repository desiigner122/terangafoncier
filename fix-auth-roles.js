import { supabase } from './src/lib/supabaseClient.js';

async function fixAuthAndRoles() {
  console.log('🔧 Fixing authentication and roles...');
  
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (session?.user) {
      console.log('✅ User is logged in:', session.user.email);
      console.log('User ID:', session.user.id);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (profileError) {
        console.error('❌ Profile query error:', profileError);
      } else if (!profile) {
        console.log('📝 Creating admin profile for logged in user...');
        
        // Create admin profile
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: session.user.id,
            email: session.user.email,
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
            verification_status: 'verified',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (createError) {
          console.error('❌ Failed to create profile:', createError);
        } else {
          console.log('✅ Admin profile created successfully:', newProfile);
        }
      } else {
        console.log('📋 Current profile:', profile);
        
        // Update to admin role if not already
        if (profile.role !== 'admin') {
          console.log('🔄 Updating role to admin...');
          
          const { data: updatedProfile, error: updateError } = await supabase
            .from('user_profiles')
            .update({
              role: 'admin',
              verification_status: 'verified',
              updated_at: new Date().toISOString()
            })
            .eq('id', session.user.id)
            .select()
            .single();
            
          if (updateError) {
            console.error('❌ Failed to update profile:', updateError);
          } else {
            console.log('✅ Profile updated to admin:', updatedProfile);
          }
        } else {
          console.log('✅ User already has admin role');
        }
      }
    } else {
      console.log('🚫 No user logged in');
      
      // Check all profiles in database
      const { data: allProfiles, error: listError } = await supabase
        .from('user_profiles')
        .select('*');
        
      if (listError) {
        console.error('❌ Failed to list profiles:', listError);
      } else {
        console.log('📊 All profiles in database:');
        allProfiles.forEach(profile => {
          console.log(`- ${profile.email}: ${profile.role} (${profile.verification_status})`);
        });
      }
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

fixAuthAndRoles();
