
    import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
    import { supabase } from '@/lib/customSupabaseClient';
    // TEMPORARILY USING SIMPLE TOAST TO FIX TypeError: nT() is null
    // useToast import supprimÃ© - utilisation window.safeGlobalToast

    const AuthContext = createContext(null);

    export const SupabaseAuthProvider = ({ children }) => {
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
          if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is not an error here
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

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            setSession(session);
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                const profileData = await fetchProfile(currentUser.id);
                setProfile(profileData);
            } else {
                setProfile(null);
            }
            if (_event !== 'INITIAL_SESSION') {
              setLoading(false);
            }
          }
        );

        return () => {
          authListener?.subscription?.unsubscribe();
        };
      }, [fetchProfile, revalidate]);

      const signIn = useCallback(async (email, password) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error('Sign in error:', error);
        } else {
          await revalidate();
        }
        setLoading(false);
        return { error };
      }, [revalidate]);

      const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setProfile(null);
      }, []);

      const value = {
        session,
        user,
        profile,
        loading,
        signIn,
        signOut,
        revalidate,
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (context === undefined) {
        throw new Error('useAuth must be used within a SupabaseAuthProvider');
      }
      return context;
    };
  
