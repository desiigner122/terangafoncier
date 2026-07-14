// Utilitaires d'authentification pour Teranga Foncier
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Types d'utilisateurs supportés
export const USER_TYPES = {
  PARTICULIER: 'particulier',
  AGENT_FONCIER: 'agent_foncier',
  BANQUE: 'banque',
  PROMOTEUR: 'promoteur',
  MAIRIE: 'mairie',
  INVESTISSEUR: 'investisseur',
  DIASPORA: 'diaspora'
};

// Régions du Sénégal
export const SENEGAL_REGIONS = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Diourbel', 'Louga', 'Fatick',
  'Kaolack', 'Kolda', 'Ziguinchor', 'Tambacounda', 'Kaffrine',
  'Kédougou', 'Matam', 'Sédhiou'
];

// Validation du mot de passe
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
    .filter(Boolean).length;
  
  return {
    isValid: score >= 4,
    score,
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    }
  };
};

// Hook d'authentification basé sur Supabase (aucune donnée simulée)
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (isMounted) setUser(data?.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) setUser(data?.user ?? null);
      setLoading(false);
      return { data, error };
    } catch (error) {
      setLoading(false);
      return { data: null, error };
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata }
      });
      if (!error) setUser(data?.user ?? null);
      setLoading(false);
      return { data, error };
    } catch (error) {
      setLoading(false);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
};

// Fonction de validation d'email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fonction de formatage des erreurs d'auth
export const formatAuthError = (error) => {
  if (!error) return '';
  
  const errorMessages = {
    'Invalid login credentials': 'Email ou mot de passe incorrect',
    'Email not confirmed': 'Veuillez confirmer votre email',
    'User already registered': 'Un compte existe déjà avec cet email',
    'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères',
    'Invalid email': 'Format d\'email invalide'
  };
  
  return errorMessages[error.message] || error.message || 'Une erreur est survenue';
};

export default {
  USER_TYPES,
  SENEGAL_REGIONS,
  validatePassword,
  useAuth,
  validateEmail,
  formatAuthError
};
