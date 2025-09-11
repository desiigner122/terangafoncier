import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { localAuth } from '@/services/LocalAuthService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Vérifier d'abord l'auth locale
    const localUser = localAuth.getCurrentUser();
    if (localUser) {
      setUser(localUser);
      setSession({ access_token: 'local_token', user: localUser });
      setLoading(false);
      return;
    }

    // Vérifier ensuite l'auth temporaire
    const tempAuth = localStorage.getItem('temp_auth');
    if (tempAuth) {
      try {
        const authData = JSON.parse(tempAuth);
        setUser(authData.user);
        setSession(authData.session);
        setLoading(false);
        return;
      } catch (error) {
        console.log('Erreur temp auth:', error);
        localStorage.removeItem('temp_auth');
      }
    }

    // Sinon utiliser Supabase normal
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        handleSession(session);
      } catch (error) {
        console.log('Erreur Supabase session:', error);
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      window.safeGlobalToast({
        variant: "destructive",
        title: "Sign up Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, []);

  const signIn = useCallback(async (email, password) => {
    // Vérifier d'abord l'auth temporaire
    const tempAuth = localStorage.getItem('temp_auth');
    if (tempAuth) {
      try {
        const authData = JSON.parse(tempAuth);
        if (authData.user.email === email) {
          setUser(authData.user);
          setSession(authData.session);
          return { error: null };
        }
      } catch (error) {
        localStorage.removeItem('temp_auth');
      }
    }

    // Sinon utiliser Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      window.safeGlobalToast({
        variant: "destructive",
        title: "Sign in Failed",
        description: error.message || "Something went wrong",
      });
    }

    return { error };
  }, []);

  const signOut = useCallback(async () => {
    // Nettoyer l'auth locale
    localAuth.signOut();
    
    // Nettoyer l'auth temporaire
    localStorage.removeItem('temp_auth');
    
    // Déconnexion Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      window.safeGlobalToast({
        variant: "destructive",
        title: "Sign out Failed",
        description: error.message || "Something went wrong",
      });
    } else {
      setUser(null);
      setSession(null);
    }

    return { error };
  }, []);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
