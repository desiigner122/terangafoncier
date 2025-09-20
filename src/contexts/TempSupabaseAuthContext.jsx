import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { localAuth } from '@/services/LocalAuthService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normalize role values to a consistent label expected by the app
  const normalizeRole = useCallback((role) => {
    if (!role) return 'Particulier';
    const r = String(role).toLowerCase();
    if (['particulier', 'particular', 'acheteur', 'buyer'].includes(r)) return 'Particulier';
    if (['vendeur', 'seller', 'vendeur particulier', 'vendeur pro'].includes(r)) return 'Vendeur';
    if (['investisseur', 'investor'].includes(r)) return 'Investisseur';
    if (['promoteur', 'promoter', 'lotisseur'].includes(r)) return 'Promoteur';
    if (['banque', 'bank'].includes(r)) return 'Banque';
    if (['mairie', 'municipalite', 'municipalite', 'municipalité'].includes(r)) return 'Mairie';
    if (['notaire', 'notary'].includes(r)) return 'Notaire';
    if (['geometre', 'géomètre', 'geometer', 'geomètre'].includes(r)) return 'Géomètre';
    if (['agent_foncier', 'agent foncier', 'agent-foncier'].includes(r)) return 'Agent Foncier';
    if (['admin', 'administrator'].includes(r)) return 'Admin';
    return role;
  }, []);

  // Derive a simple profile from user metadata when DB profile is not provided
  const derivedProfile = useMemo(() => {
    if (!user) return null;
    const md = user.user_metadata || {};
    const normalizedRole = normalizeRole(md.role || md.user_type || md.userType || md.user_role);
    return {
      id: user.id,
      email: user.email,
      role: normalizedRole || 'Particulier',
      user_type: normalizedRole || 'Particulier',
      verification_status: md.verification_status || 'active',
      banned: !!md.banned,
      ...md,
    };
  }, [user, normalizeRole]);

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

  // Mettre à jour le profil utilisateur dans la table "users"
  const updateProfile = useCallback(async (fields) => {
    if (!user) return { error: new Error('No user in session') };
    try {
      // upsert pour créer si inexistant, sinon mettre à jour
      const payload = { id: user.id, ...fields };
      const { data, error } = await supabase.from('users').upsert(payload, { onConflict: 'id' }).select().single();
      if (error) throw error;
      // Optionnel: mettre à jour les métadonnées locales si pertinentes
      return { data, error: null };
    } catch (error) {
      window.safeGlobalToast?.({ variant: 'destructive', title: 'Erreur profil', description: error.message || 'Mise à jour impossible' });
      return { data: null, error };
    }
  }, [user]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    profile: derivedProfile,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }), [user, session, loading, derivedProfile, signUp, signIn, signOut, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
