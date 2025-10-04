import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { unifiedAuth } from '@/services/UnifiedAuthService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Normaliser les rôles pour compatibilité avec l'interface existante
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

  // Créer un profil dérivé de l'utilisateur pour compatibilité
  const derivedProfile = useMemo(() => {
    if (!user) return null;
    const md = user.user_metadata || {};
    
    // Récupérer le rôle depuis user.roles (API) ou user_metadata (local)
    const userRole = user.roles && user.roles.length > 0 
      ? user.roles[0] 
      : (md.role || md.user_type || md.userType || md.user_role);
    
    const normalizedRole = normalizeRole(userRole);
    
    return {
      id: user.id,
      email: user.email,
      role: normalizedRole || 'Particulier',
      user_type: normalizedRole || 'Particulier',
      roles: user.roles || [userRole], // Garder les rôles originaux
      verification_status: md.verification_status || 'active',
      banned: !!md.banned,
      name: md.name || `${md.firstName || ''} ${md.lastName || ''}`.trim(),
      first_name: md.firstName || md.first_name,
      last_name: md.lastName || md.last_name,
      ...md,
    };
  }, [user, normalizeRole]);

  // Gérer les changements de session
  const handleSession = useCallback(async (session) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  }, []);

  // Initialisation de l'authentification
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // Obtenir la session actuelle
        const { data: { session } } = await unifiedAuth.getSession();
        
        if (session) {
          setUser(session.user);
          setSession(session);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
        setLoading(false);
      }
    };

    initAuth();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = unifiedAuth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [handleSession]);

  // Inscription
  const signUp = useCallback(async (email, password, options = {}) => {
    try {
      setLoading(true);
      const result = await unifiedAuth.signUp({
        email,
        password,
        firstName: options.firstName,
        lastName: options.lastName,
        role: options.role || 'particular'
      });

      if (result.error) {
        window.safeGlobalToast?.({
          variant: "destructive",
          title: "Inscription échouée",
          description: result.error.message || "Une erreur s'est produite",
        });
        return { error: result.error };
      }

      // Mettre à jour l'état local
      if (result.user) {
        setUser(result.user);
        setSession({ user: result.user, access_token: 'local_token' });
      }

      window.safeGlobalToast?.({
        variant: "default",
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès",
      });

      return { error: null };
    } catch (error) {
      console.error('Erreur inscription:', error);
      window.safeGlobalToast?.({
        variant: "destructive",
        title: "Inscription échouée",
        description: error.message || "Une erreur s'est produite",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  }, []);

  // Connexion
  const signIn = useCallback(async (email, password) => {
    try {
      console.log('🔐 UnifiedAuthContext.signIn appelé:', { email });
      setLoading(true);
      const result = await unifiedAuth.signIn(email, password);
      console.log('📋 Résultat du service:', result);

      if (result.error) {
        console.log('❌ Erreur de connexion:', result.error);
        window.safeGlobalToast?.({
          variant: "destructive",
          title: "Connexion échouée",
          description: result.error.message || "Identifiants incorrects",
        });
        return { error: result.error };
      }

      // Mettre à jour l'état local
      if (result.user) {
        console.log('✅ Mise à jour de l\'état utilisateur:', result.user);
        setUser(result.user);
        setSession({ user: result.user, access_token: 'authenticated' });
        
        window.safeGlobalToast?.({
          variant: "default",
          title: "Connexion réussie",
          description: `Bienvenue ${result.user.user_metadata?.name || result.user.email}`,
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Erreur connexion:', error);
      window.safeGlobalToast?.({
        variant: "destructive",
        title: "Connexion échouée",
        description: error.message || "Une erreur s'est produite",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  }, []);

  // Déconnexion
  const signOut = useCallback(async () => {
    try {
      const result = await unifiedAuth.signOut();

      setUser(null);
      setSession(null);

      window.safeGlobalToast?.({
        variant: "default",
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });

      return { error: result.error };
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      window.safeGlobalToast?.({
        variant: "destructive",
        title: "Erreur déconnexion",
        description: error.message || "Une erreur s'est produite",
      });
      return { error };
    }
  }, []);

  // Mettre à jour le profil
  const updateProfile = useCallback(async (fields) => {
    if (!user) return { error: new Error('Aucun utilisateur connecté') };
    
    try {
      const result = await unifiedAuth.updateProfile(fields);
      
      if (result.success) {
        // Mettre à jour l'utilisateur local
        const updatedUser = { ...user, user_metadata: { ...user.user_metadata, ...fields } };
        setUser(updatedUser);
        
        window.safeGlobalToast?.({
          variant: "default",
          title: "Profil mis à jour",
          description: "Vos informations ont été sauvegardées",
        });
        
        return { data: updatedUser, error: null };
      } else {
        window.safeGlobalToast?.({
          variant: "destructive",
          title: "Erreur profil",
          description: result.error || "Mise à jour impossible",
        });
        return { data: null, error: new Error(result.error) };
      }
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      window.safeGlobalToast?.({
        variant: "destructive",
        title: "Erreur profil",
        description: error.message || "Mise à jour impossible",
      });
      return { data: null, error };
    }
  }, [user]);

  // Connexion rapide (mode test)
  const quickSignIn = useCallback(async (role) => {
    try {
      const result = await unifiedAuth.quickSignIn(role);
      
      if (result.user) {
        setUser(result.user);
        setSession({ user: result.user, access_token: 'local_token' });
        
        window.safeGlobalToast?.({
          variant: "default",
          title: "Connexion rapide",
          description: `Connecté en tant que ${result.user.user_metadata?.name}`,
        });
      }
      
      return result;
    } catch (error) {
      console.error('Erreur connexion rapide:', error);
      return { user: null, error };
    }
  }, []);

  // Obtenir les comptes de test disponibles
  const getTestAccounts = useCallback(() => {
    return unifiedAuth.getTestAccounts();
  }, []);

  // Valeur du contexte
  const value = useMemo(() => ({
    user,
    session,
    loading,
    profile: derivedProfile,
    signUp,
    signIn,
    signOut,
    updateProfile,
    quickSignIn, // Méthode bonus pour les tests
    getTestAccounts, // Méthode bonus pour lister les comptes de test
    isLocalMode: unifiedAuth.isLocalMode,
    setLocalMode: unifiedAuth.setLocalMode.bind(unifiedAuth)
  }), [
    user, 
    session, 
    loading, 
    derivedProfile, 
    signUp, 
    signIn, 
    signOut, 
    updateProfile, 
    quickSignIn, 
    getTestAccounts
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;