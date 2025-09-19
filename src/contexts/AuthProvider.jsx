// Contexte d'authentification simplifié pour Teranga Foncier
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useTestAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useTestAuth must be used within an AuthProvider');
  }
  return context;
};

// Utilisateurs de test pour chaque rôle - Version Blockchain Complète
const TEST_USERS = {
  'admin@test.com': {
    id: '1',
    email: 'admin@test.com',
    role: 'admin',
    name: 'Maître Aminata Sall',
    phone: '+221 77 123 45 67',
    region: 'Dakar',
    profile: {
      type: 'admin',
      title: 'Notaire Principal',
      office: 'Étude Notariale Teranga'
    }
  },
  'agent@test.com': {
    id: '2',
    email: 'agent@test.com',
    role: 'agent_foncier',
    name: 'Moussa Diallo',
    phone: '+221 77 234 56 78',
    region: 'Thiès',
    profile: {
      type: 'agent_foncier',
      agency: 'Teranga Immobilier',
      license: 'AF-2024-001'
    }
  },
  'mairie@test.com': {
    id: '3',
    email: 'mairie@test.com',
    role: 'mairie',
    name: 'Mairie de Dakar',
    phone: '+221 33 456 78 90',
    region: 'Dakar',
    profile: {
      type: 'mairie',
      municipality: 'Dakar',
      department: 'Urbanisme et Foncier'
    }
  },
  'geometre@test.com': {
    id: '4',
    email: 'geometre@test.com',
    role: 'geometre',
    name: 'Fatou Ndiaye',
    phone: '+221 77 345 67 89',
    region: 'Saint-Louis',
    profile: {
      type: 'geometre',
      license: 'GEO-2024-012',
      specialization: 'Foncier Urbain'
    }
  },
  'banque@test.com': {
    id: '5',
    email: 'banque@test.com',
    role: 'banque',
    name: 'Banque Atlantique',
    phone: '+221 33 567 89 01',
    region: 'Dakar',
    profile: {
      type: 'banque',
      institution: 'Banque Atlantique',
      services: ['credits immobiliers', 'evaluations']
    }
  },
  'vendeur-particulier@test.com': {
    id: '6',
    email: 'vendeur-particulier@test.com',
    role: 'vendeur_particulier',
    name: 'Ibrahima Sarr',
    phone: '+221 77 456 78 90',
    region: 'Kaolack',
    profile: {
      type: 'vendeur_particulier',
      properties: ['terrain familial', 'maison secondaire']
    }
  },
  'promoteur@test.com': {
    id: '7',
    email: 'promoteur@test.com',
    role: 'promoteur',
    name: 'SOGEA Sénégal',
    phone: '+221 33 678 90 12',
    region: 'Dakar',
    profile: {
      type: 'promoteur',
      company: 'SOGEA Promotion',
      projects: ['résidentiel', 'commercial', 'industriel']
    }
  },
  'investisseur@test.com': {
    id: '8',
    email: 'investisseur@test.com',
    role: 'investisseur',
    name: 'Capital Invest Sénégal',
    phone: '+221 77 567 89 01',
    region: 'Dakar',
    profile: {
      type: 'investisseur',
      fund: 'Capital Invest',
      focus: ['immobilier', 'agriculture', 'tourisme']
    }
  },
  'particulier@test.com': {
    id: '9',
    email: 'particulier@test.com',
    role: 'particulier',
    name: 'Amadou Ba',
    phone: '+221 77 678 90 12',
    region: 'Ziguinchor',
    profile: {
      type: 'particulier',
      status: 'resident',
      interests: ['terrain habitation', 'commerce']
    }
  },
  'diaspora@test.com': {
    id: '10',
    email: 'diaspora@test.com',
    role: 'diaspora',
    name: 'Mariama Cissé',
    phone: '+33 6 12 34 56 78',
    region: 'Europe',
    profile: {
      type: 'diaspora',
      country: 'France',
      projects: ['maison familiale', 'investissement locatif']
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const signIn = async (email, password) => {
    setLoading(true);
    
    try {
      // Simulation d'authentification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const testUser = TEST_USERS[email];
      if (testUser && password === 'test123') {
        setUser(testUser);
        setProfile(testUser.profile);
        localStorage.setItem('auth_user', JSON.stringify(testUser));
        return { success: true, user: testUser };
      } else {
        throw new Error('Email ou mot de passe incorrect');
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    setLoading(true);
    
    try {
      // Simulation d'inscription
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        role: userData.userType,
        name: userData.name,
        phone: userData.phone,
        region: userData.region,
        profile: {
          type: userData.userType,
          ...userData
        }
      };
      
      setUser(newUser);
      setProfile(newUser.profile);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('auth_user');
  };

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setProfile(parsedUser.profile);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
