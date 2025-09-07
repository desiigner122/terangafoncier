import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

const SupabaseAuthContext = createContext();

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    console.error('❌ useSupabaseAuth called outside of SupabaseAuthProvider!');
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  console.log('✅ useSupabaseAuth context found:', { 
    hasUser: !!context.user, 
    hasProfile: !!context.profile, 
    loading: context.loading 
  });
  return context;
};

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Flag pour éviter les appels multiples
  const [isRevalidating, setIsRevalidating] = useState(false);
  
  // Track failed profile fetches to prevent infinite retries
  const [failedProfiles, setFailedProfiles] = useState(new Set());
  
  // Circuit breaker to prevent infinite loops
  const [fetchAttempts, setFetchAttempts] = useState(new Map());

  // Fetch user profile with protection against loops
  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId || isRevalidating) return null;
    
    // Circuit breaker: check if we've tried too many times
    const attempts = fetchAttempts.get(userId) || 0;
    const MAX_ATTEMPTS = 3;
    
    if (attempts >= MAX_ATTEMPTS) {
      console.log(`🔒 Circuit breaker: Too many attempts for user ${userId}, stopping fetches`);
      return null;
    }
    
    // Skip if we already know this profile doesn't exist
    if (failedProfiles.has(userId)) {
      console.log(`🚫 Skipping profile fetch for ${userId} - known to not exist`);
      return null;
    }
    
    try {
      setIsRevalidating(true);
      
      // Increment attempt counter
      setFetchAttempts(prev => new Map(prev.set(userId, attempts + 1)));
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle missing profiles

      if (error) {
        // Only log as warning if it's not a "no rows found" error
        if (error.code !== 'PGRST116') {
          console.warn('Profile fetch error:', error.message);
        } else {
          // Add to failed profiles to prevent future attempts
          setFailedProfiles(prev => new Set([...prev, userId]));
          console.log(`🔍 Profile not found for user ${userId}, added to skip list`);
        }
        return null;
      }

      // Remove from failed profiles if we successfully fetch it
      if (data && failedProfiles.has(userId)) {
        setFailedProfiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
      
      // Reset attempt counter on success
      setFetchAttempts(prev => {
        const newMap = new Map(prev);
        newMap.delete(userId);
        return newMap;
      });

      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    } finally {
      setIsRevalidating(false);
    }
  }, [isRevalidating, failedProfiles, fetchAttempts]);

  // Revalidate function with loop protection
  const revalidate = useCallback(async () => {
    if (isRevalidating) {
      console.log('🔄 Revalidation already in progress, skipping...');
      return;
    }

    try {
      setIsRevalidating(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (currentUser) {
        setUser(currentUser);
        const userProfile = await fetchUserProfile(currentUser.id);
        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error during revalidation:', error);
    } finally {
      setIsRevalidating(false);
      setLoading(false);
    }
  }, [fetchUserProfile, isRevalidating]);

  // Initialize authentication state
  useEffect(() => {
    if (initialized) return;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // First check for mock session
        const mockData = localStorage.getItem('teranga_mock_user');
        if (mockData) {
          try {
            const { user, profile } = JSON.parse(mockData);
            setUser(user);
            setProfile(profile);
            console.log('🔄 Mock session restored:', profile.full_name);
            setLoading(false);
            setInitialized(true);
            return;
          } catch (error) {
            console.log('⚠️ Error restoring mock session:', error.message);
            localStorage.removeItem('teranga_mock_user');
          }
        }
        
        // Regular Supabase session check
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          const userProfile = await fetchUserProfile(session.user.id);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [initialized, fetchUserProfile]);

  // Listen for auth changes (only after initialization)
  useEffect(() => {
    if (!initialized) return;

    console.log('🔧 Setting up auth state listener...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.id);
        
        // Prevent infinite loops by checking if user actually changed
        if (session?.user) {
          if (user?.id !== session.user.id) {
            console.log('👤 User changed, updating profile...');
            setUser(session.user);
            const userProfile = await fetchUserProfile(session.user.id);
            setProfile(userProfile);
          } else {
            console.log('👤 Same user, no profile update needed');
          }
        } else {
          console.log('🚪 User signed out');
          setUser(null);
          setProfile(null);
          // Clear failed profiles on sign out
          setFailedProfiles(new Set());
        }
        
        setLoading(false);
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth listener');
      subscription?.unsubscribe?.();
    };
  }, [initialized, fetchUserProfile, user?.id]);

  // Sign in function with mock support
  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true);
      
      // First try mock authentication for test accounts
      if (email.includes('@terangafoncier.sn')) {
        console.log('🧪 Attempting mock authentication for:', email);
        
        const { data: mockUsers, error: searchError } = await supabase
          .from('parcels')
          .select('*')
          .like('status', '%-User');

        if (!searchError && mockUsers) {
          for (const mockUser of mockUsers) {
            try {
              const profile = JSON.parse(mockUser.description);
              if (profile.email === email && profile.password === password) {
                // Create mock user object
                const mockUserObj = {
                  id: mockUser.id,
                  email: profile.email,
                  user_metadata: {
                    full_name: `${profile.first_name} ${profile.last_name}`,
                    role: profile.role,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    phone: profile.phone,
                    address: profile.address
                  }
                };
                
                // Create mock profile
                const mockProfile = {
                  id: mockUser.id,
                  user_id: mockUser.id,
                  email: profile.email,
                  full_name: `${profile.first_name} ${profile.last_name}`,
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                  role: profile.role,
                  phone: profile.phone,
                  address: profile.address,
                  avatar_url: `https://avatar.vercel.sh/${profile.email}.png`
                };
                
                setUser(mockUserObj);
                setProfile(mockProfile);
                
                // Store mock session
                localStorage.setItem('teranga_mock_user', JSON.stringify({
                  user: mockUserObj,
                  profile: mockProfile
                }));
                
                console.log('✅ Mock authentication successful:', mockProfile.full_name);
                return { data: { user: mockUserObj }, error: null };
              }
            } catch (e) {
              continue;
            }
          }
        }
        
        // If no mock user found, return error
        throw new Error('Invalid login credentials');
      }
      
      // Regular Supabase authentication for non-test accounts
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // User state will be updated via onAuthStateChange
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out function
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clear mock session if exists
      localStorage.removeItem('teranga_mock_user');
      
      // Regular Supabase sign out
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      
      console.log('👋 Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile function
  const updateProfile = useCallback(async (updates) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }, [user?.id]);

  const value = {
    user,
    profile,
    loading,
    revalidate,
    signIn,
    signOut,
    updateProfile,
    isRevalidating
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};

// Export useAuth as an alias for useSupabaseAuth for compatibility
export const useAuth = useSupabaseAuth;
