import React, { createContext, useState, useEffect, useContext } from 'react';

const SimpleAuthContext = createContext(null);

export const SimpleAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const contextValue = {
    user,
    setUser,
    loading,
    setLoading,
    signIn: () => console.log('signIn called'),
    signOut: () => console.log('signOut called'),
    signUp: () => console.log('signUp called'),
  };

  return (
    <SimpleAuthContext.Provider value={contextValue}>
      {children}
    </SimpleAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a SimpleAuthProvider');
  }
  return context;
};
