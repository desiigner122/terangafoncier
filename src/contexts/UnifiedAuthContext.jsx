import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { unifiedAuth } from '@/services/UnifiedAuthService';
import { supabase } from '@/lib/supabaseClient';
import { logger } from '@/lib/logger';

// Colonnes de `profiles` qu'un utilisateur ne peut jamais modifier lui-même.
// (Verrouillées aussi côté base par le trigger protect_profile_privileged_columns.)
const PRIVILEGED_FIELDS = ['role', 'user_type', 'verification_status', 'is_verified', 'banned', 'is_active', 'status', 'id', 'email'];

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  // Profil chargé depuis la table `profiles` (protégée par RLS) : c'est la
  // SEULE source de vérité pour le rôle. `user_metadata` est modifiable par
  // l'utilisateur lui-même et ne doit jamais servir à une décision d'accès.
  const [dbProfile, setDbProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

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

  // Charger le profil depuis la base à chaque changement d'utilisateur
  const loadDbProfile = useCallback(async (authUser) => {
    if (!authUser?.id) {
      setDbProfile(null);
      return null;
    }
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();
      if (error) {
        logger.error('Erreur chargement profil:', error.message);
        setDbProfile(null);
        return null;
      }
      setDbProfile(data || null);
      return data || null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDbProfile(user);
  }, [user?.id, loadDbProfile]);

  // Profil exposé à l'application.
  // Priorité du rôle : profiles.role (base) > app_metadata.role (posé côté
  // serveur uniquement). Jamais user_metadata.
  const derivedProfile = useMemo(() => {
    if (!user) return null;
    const md = user.user_metadata || {};
    const appMd = user.app_metadata || {};
    const db = dbProfile || {};

    const rawRole = db.role || db.user_type || appMd.role || null;
    const normalizedRole = normalizeRole(rawRole);

    // Données d'affichage non sensibles : la base d'abord, puis les metadata.
    const displayMd = { ...md };
    PRIVILEGED_FIELDS.forEach((k) => delete displayMd[k]);

    return {
      ...displayMd,
      ...db,
      id: user.id,
      email: user.email,
      role: normalizedRole || 'Particulier',
      user_type: normalizedRole || 'Particulier',
      roles: [rawRole || 'particulier'],
      verification_status: db.verification_status || (db.is_verified ? 'verified' : 'active'),
      banned: !!db.banned,
      name: db.full_name || md.name || `${md.firstName || md.first_name || ''} ${md.lastName || md.last_name || ''}`.trim(),
      first_name: db.first_name || md.firstName || md.first_name,
      last_name: db.last_name || md.lastName || md.last_name,
      full_name: db.full_name || md.full_name || md.name,
      avatar_url: db.avatar_url || md.avatar_url,
    };
  }, [user, dbProfile, normalizeRole]);

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
        logger.error('Erreur initialisation auth:', error);
        setLoading(false);
      }
    };

    initAuth();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = unifiedAuth.onAuthStateChange(
      async (event, session) => {
        logger.debug('Auth state change:', event, session?.user?.email);
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
      logger.error('Erreur inscription:', error);
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
      logger.debug('🔐 UnifiedAuthContext.signIn appelé:', { email });
      setLoading(true);
      const result = await unifiedAuth.signIn(email, password);
      logger.debug('📋 Résultat du service:', result);

      if (result.error) {
        logger.debug('❌ Erreur de connexion:', result.error);
        window.safeGlobalToast?.({
          variant: "destructive",
          title: "Connexion échouée",
          description: result.error.message || "Identifiants incorrects",
        });
        return { error: result.error };
      }

      // Mettre à jour l'état local
      if (result.user) {
        logger.debug('✅ Mise à jour de l\'état utilisateur:', result.user);
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
      logger.error('Erreur connexion:', error);
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
      logger.error('Erreur déconnexion:', error);
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
      // On n'autorise jamais la modification des champs privilégiés depuis le client.
      const safeFields = { ...fields };
      PRIVILEGED_FIELDS.forEach((k) => delete safeFields[k]);

      const result = await unifiedAuth.updateProfile(safeFields);
      
      if (result.success) {
        // Mettre à jour l'utilisateur local et recharger le profil
        const updatedUser = { ...user, user_metadata: { ...user.user_metadata, ...safeFields } };
        setUser(updatedUser);
        await loadDbProfile(user);
        
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
      logger.error('Erreur mise à jour profil:', error);
      window.safeGlobalToast?.({
        variant: "destructive",
        title: "Erreur profil",
        description: error.message || "Mise à jour impossible",
      });
      return { data: null, error };
    }
  }, [user, loadDbProfile]);

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
      logger.error('Erreur connexion rapide:', error);
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
    loading: loading || (!!user && profileLoading && !dbProfile),
    profile: derivedProfile,
    refreshProfile: () => loadDbProfile(user),
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
    profileLoading,
    dbProfile,
    loadDbProfile,
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