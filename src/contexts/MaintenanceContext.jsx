/**
 * CONTEXTE MODE MAINTENANCE
 * 
 * Gère l'état global du mode maintenance de l'application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import globalAdminService from '@/services/GlobalAdminService';
import { supabase } from '@/lib/supabaseClient';

const MaintenanceContext = createContext();

export const useMaintenanceMode = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenanceMode must be used within a MaintenanceProvider');
  }
  return context;
};

export const MaintenanceProvider = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [maintenanceConfig, setMaintenanceConfig] = useState({
    message: 'Maintenance en cours...',
    estimatedDuration: null,
    allowedUsers: [], // Liste des utilisateurs autorisés (admins)
    startTime: null,
    endTime: null
  });
  const [loading, setLoading] = useState(true);

  // Vérifier le statut de maintenance ET récupérer le profil utilisateur
  useEffect(() => {
    const initializeMaintenanceCheck = async () => {
      try {
        // 1. Récupérer le profil utilisateur
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, email')
            .eq('id', user.id)
            .single();
          
          setUserProfile(profile);
          console.log('✅ Profil utilisateur récupéré:', profile);
        }

        // 2. Vérifier le mode maintenance
        await checkMaintenanceStatus();
      } catch (error) {
        console.error('Erreur initialisation maintenance:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeMaintenanceCheck();
  }, []);

  const checkMaintenanceStatus = async () => {
    try {
      // Vérifier si le mode maintenance est activé
      const storedMaintenanceMode = localStorage.getItem('maintenanceMode');
      const storedConfig = localStorage.getItem('maintenanceConfig');
      
      if (storedMaintenanceMode === 'true') {
        setIsMaintenanceMode(true);
        if (storedConfig) {
          setMaintenanceConfig(JSON.parse(storedConfig));
        }
      }

      // Optionnel: vérifier avec le serveur
      try {
        const systemConfig = await globalAdminService.getSystemConfig();
        if (systemConfig?.data?.general?.maintenanceMode) {
          setIsMaintenanceMode(true);
          setMaintenanceConfig(prev => ({
            ...prev,
            message: systemConfig.data.maintenanceMessage || prev.message
          }));
        }
      } catch (serverError) {
        console.log('Vérification serveur maintenance échouée, utilisation cache local');
      }
    } catch (error) {
      console.error('Erreur vérification maintenance:', error);
    } finally {
      setLoading(false);
    }
  };

  const enableMaintenanceMode = (config = {}) => {
    const maintenanceData = {
      message: config.message || 'Site en maintenance',
      estimatedDuration: config.estimatedDuration || null,
      allowedUsers: config.allowedUsers || ['admin'],
      startTime: new Date().toISOString(),
      endTime: config.endTime || null
    };

    setIsMaintenanceMode(true);
    setMaintenanceConfig(maintenanceData);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('maintenanceMode', 'true');
    localStorage.setItem('maintenanceConfig', JSON.stringify(maintenanceData));

    // Optionnel: notifier le serveur
    try {
      globalAdminService.updateSystemSettings({
        settings: {
          general: {
            maintenanceMode: true,
            maintenanceMessage: maintenanceData.message
          }
        }
      });
    } catch (error) {
      console.error('Erreur activation maintenance serveur:', error);
    }
  };

  const disableMaintenanceMode = () => {
    setIsMaintenanceMode(false);
    setMaintenanceConfig(prev => ({
      ...prev,
      endTime: new Date().toISOString()
    }));

    // Supprimer du localStorage
    localStorage.removeItem('maintenanceMode');
    localStorage.removeItem('maintenanceConfig');

    // Optionnel: notifier le serveur
    try {
      globalAdminService.updateSystemSettings({
        settings: {
          general: {
            maintenanceMode: false
          }
        }
      });
    } catch (error) {
      console.error('Erreur désactivation maintenance serveur:', error);
    }
  };

  const isUserAllowed = () => {
    if (!isMaintenanceMode) return true;
    
    // Les admins peuvent toujours accéder
    if (userProfile?.role === 'admin' || userProfile?.role === 'Admin') {
      console.log('✅ Admin autorisé malgré maintenance');
      return true;
    }
    
    // Vérifier la liste des utilisateurs autorisés
    if (userProfile?.email && maintenanceConfig.allowedUsers.includes(userProfile.email)) {
      console.log('✅ Utilisateur autorisé malgré maintenance');
      return true;
    }

    console.log('❌ Utilisateur non autorisé - mode maintenance actif');
    return false;
  };

  const value = {
    isMaintenanceMode,
    maintenanceConfig,
    loading,
    enableMaintenanceMode,
    disableMaintenanceMode,
    isUserAllowed,
    checkMaintenanceStatus,
    userProfile // Exposer le profil utilisateur
  };

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export default MaintenanceContext;