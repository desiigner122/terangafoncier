import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
// useToast import supprimÃ© - utilisation window.safeGlobalToast

const AuthContext = createContext(null);

export const SimpleSupabaseAuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  // toast remplacÃ© par window.safeGlobalToast

  const fetchProfile = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.error('AuthContext: Error fetching profile:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('AuthContext: Catch block error fetching profile:', error);
      return null;
    }
  }, []);

  const revalidate = useCallback(async () => {
    setLoading(true);
    const { data: { session: currentSession }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("AuthContext: Error revalidating session:", error);
    }

    setSession(currentSession);
    const currentUser = currentSession?.user ?? null;
    setUser(currentUser);
    
    if (currentUser) {
      const profileData = await fetchProfile(currentUser.id);
      setProfile(profileData);
    } else {
      setProfile(null);
    }
    setLoading(false);
  }, [fetchProfile]);

  useEffect(() => {
    revalidate();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state changed:', event, session?.user?.id);
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      if (currentUser) {
        const profileData = await fetchProfile(currentUser.id);
        setProfile(profileData);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, revalidate]);

  const signIn = async (email, password) => {
    console.log('AuthContext: signIn called');
    return { data: null, error: null };
  };

  const signOut = async () => {
    console.log('AuthContext: signOut called');
    return await supabase.auth.signOut();
  };

  const signUp = async (email, password, metadata = {}) => {
    console.log('AuthContext: signUp called');
    return { data: null, error: null };
  };

  const contextValue = {
    session,
    user,
    profile,
    loading,
    signIn,
    signOut,
    signUp,
    revalidate,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a SimpleSupabaseAuthProvider');
  }
  return context;
};

