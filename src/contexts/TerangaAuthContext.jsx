import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const TerangaAuthContext = createContext({});

// Mock authentication system pour développement
export const useTerangaAuth = () => {
  const context = useContext(TerangaAuthContext);
  if (context === undefined) {
    throw new Error('useTerangaAuth must be used within a TerangaAuthProvider');
  }
  return context;
};

export const TerangaAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction de connexion mock
  const signInWithMock = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Rechercher l'utilisateur dans les données mock (table parcels)
      const { data: mockUsers, error: searchError } = await supabase
        .from('parcels')
        .select('*')
        .like('status', '%-User')
        .single();

      if (searchError) {
        throw new Error('Utilisateur non trouvé');
      }

      // Parcourir les utilisateurs mock pour trouver la correspondance
      const { data: allMockUsers } = await supabase
        .from('parcels')
        .select('*')
        .like('status', '%-User');

      let foundUser = null;
      for (const mockUser of allMockUsers) {
        try {
          const profile = JSON.parse(mockUser.description);
          if (profile.email === email && profile.password === password) {
            foundUser = {
              id: mockUser.id,
              email: profile.email,
              profile: profile
            };
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!foundUser) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Simuler une session utilisateur
      setUser(foundUser);
      setUserProfile(foundUser.profile);
      
      // Stocker dans le localStorage pour persistance
      localStorage.setItem('teranga_user', JSON.stringify(foundUser));
      
      console.log('✅ Connexion réussie:', foundUser.profile.first_name, foundUser.profile.last_name);
      return { data: foundUser, error: null };

    } catch (error) {
      console.error('❌ Erreur connexion:', error.message);
      setError(error.message);
      return { data: null, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const signOut = async () => {
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('teranga_user');
    console.log('👋 Déconnexion réussie');
  };

  // Vérifier la session au chargement
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = localStorage.getItem('teranga_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setUserProfile(userData.profile);
          console.log('🔄 Session restaurée:', userData.profile.first_name);
        }
      } catch (error) {
        console.log('⚠️ Erreur restauration session:', error.message);
        localStorage.removeItem('teranga_user');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Données d'exemple pour les dashboards
  const getMockDashboardData = (role) => {
    const baseData = {
      totalProperties: 156,
      totalUsers: 1247,
      totalTransactions: 89,
      totalRevenue: 2450000000 // 2.45B FCFA
    };

    switch (role) {
      case 'admin':
        return {
          ...baseData,
          pendingApprovals: 23,
          activeAgents: 45,
          monthlyGrowth: 12.5,
          recentActivities: [
            'Nouveau agent validé: Moussa Diallo',
            'Propriété tokenisée: Terrain Almadies',
            'Transaction validée: 75M FCFA'
          ]
        };
      
      case 'agent_foncier':
        return {
          myProperties: 34,
          myClients: 67,
          commissions: 15750000, // 15.75M FCFA
          monthlyTarget: 25000000, // 25M FCFA
          recentSales: [
            'Terrain Mermoz - 45M FCFA',
            'Parcelle Yoff - 32M FCFA',
            'Bureau Plateau - 85M FCFA'
          ]
        };
      
      case 'banque':
        return {
          pendingLoans: 12,
          approvedAmount: 850000000, // 850M FCFA
          defaultRate: 2.3,
          portfolioValue: 12500000000, // 12.5B FCFA
          recentApplications: [
            'Demande 75M FCFA - En cours',
            'Demande 120M FCFA - Approuvée',
            'Demande 45M FCFA - En étude'
          ]
        };
      
      case 'notaire':
        return {
          pendingActs: 8,
          completedActs: 156,
          monthlyRevenue: 12500000, // 12.5M FCFA
          certifications: 234,
          recentActs: [
            'Acte de vente - Almadies',
            'Certification - Plateau',
            'Transfert - Sacré-Cœur'
          ]
        };
      
      case 'geometre':
        return {
          surveyRequests: 15,
          completedSurveys: 89,
          monthlyRevenue: 8750000, // 8.75M FCFA
          accuracy: 99.8,
          recentSurveys: [
            'Délimitation Yoff - 500m²',
            'Topographie Rufisque - 2000m²',
            'Certification Almadies - 300m²'
          ]
        };
      
      case 'particulier':
        return {
          savedProperties: 12,
          applications: 3,
          budget: 75000000, // 75M FCFA
          notifications: 5,
          recentViews: [
            'Terrain Almadies Premium',
            'Parcelle Yoff Résidentiel',
            'Bureau Plateau Centre'
          ]
        };
      
      default:
        return baseData;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signInWithMock,
    signOut,
    getMockDashboardData,
    isAuthenticated: !!user
  };

  return (
    <TerangaAuthContext.Provider value={value}>
      {children}
    </TerangaAuthContext.Provider>
  );
};
