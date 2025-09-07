// Context temporairement désactivé - Mode comptes de test uniquement
// Utiliser AuthProvider à la place

import React from 'react';

// Mock pour éviter les erreurs pendant la phase de test
export const useAuth = () => {
  console.warn('SupabaseAuthContext désactivé - utiliser AuthProvider');
  return {
    user: null,
    profile: null,
    isLoading: false,
    signIn: () => Promise.reject(new Error('SupabaseAuth désactivé')),
    signOut: () => Promise.resolve()
  };
};

export const SupabaseAuthProvider = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};

export default {
  useAuth,
  SupabaseAuthProvider
};
