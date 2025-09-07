import { supabase } from './src/lib/supabaseClient.js';

async function createTestAdmin() {
  console.log('👤 Creating test admin user...');
  
  try {
    // Use a simpler test email
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    console.log(`🔑 Trying to sign in with ${testEmail}...`);
    
    // Try to sign in first
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });
    
    if (signInError) {
      console.log('⚠️ Sign in failed, trying to create user:', signInError.message);
      
      // Try to sign up
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            first_name: 'Test',
            last_name: 'Admin'
          }
        }
      });
      
      if (signUpError) {
        console.error('❌ Sign up also failed:', signUpError.message);
        return;
      } else {
        console.log('✅ User created:', authData.user?.email);
        if (authData.user && !authData.session) {
          console.log('📧 Check your email for confirmation link');
          return;
        }
      }
    } else {
      console.log('✅ Signed in successfully:', signInData.user.email);
    }
    
    // Get current session to verify
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      console.log('👤 Current user:', session.user.email, session.user.id);
      
      // Create or update profile with admin role
      const { data: profile, error: upsertError } = await supabase
        .from('user_profiles')
        .upsert({
          id: session.user.id,
          email: session.user.email,
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          verification_status: 'verified',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single();
        
      if (upsertError) {
        console.error('❌ Failed to create/update profile:', upsertError);
      } else {
        console.log('✅ Admin profile created/updated:', profile);
      }
      
      console.log('🎉 Test admin ready! You can now log in with:');
      console.log('Email: admin@terangafoncier.com');
      console.log('Password: admin123');
      console.log('Role: admin');
    }
    
  } catch (error) {
    console.error('💥 Error creating test admin:', error);
  }
}

createTestAdmin();
