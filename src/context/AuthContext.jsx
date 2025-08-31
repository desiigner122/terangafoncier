import React, { createContext, useState, useEffect, useContext } from 'react';
import { sampleUsers } from '@/data/userData';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser({ ...session.user, ...profile, isAuthenticated: true });
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            setUser({ ...session.user, ...profile, isAuthenticated: true });
        } else {
            setUser(null);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    const { data: profile } = await supabase
  .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const userWithProfile = { ...data.user, ...profile, isAuthenticated: true };
    setUser(userWithProfile);
    return userWithProfile;
  };

  const register = async ({ email, password, fullName, userType }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType,
          role: userType
        },
      },
    });
    if (error) throw error;
    
    // The profile is created by a trigger `handle_new_user`
    const { data: profile } = await supabase
  .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    const userWithProfile = { ...data.user, ...profile, isAuthenticated: true };
    setUser(userWithProfile);
    return { user: userWithProfile };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };
  
  const updateUserProfile = async (updates) => {
    if (!user) throw new Error("No user is logged in.");
    
    const { data, error } = await supabase
  .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) throw error;
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    return updatedUser;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};