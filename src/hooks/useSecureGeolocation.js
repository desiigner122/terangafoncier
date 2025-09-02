import { useEffect, useState } from 'react';
import errorManager from '@/lib/errorManager';

/**
 * Hook sécurisé pour gérer la géolocalisation avec protection contre les appels répétés
 */
export const useSecureGeolocation = (options = {}) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const defaultOptions = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 300000, // 5 minutes de cache
    ...options
  };

  const getCurrentPosition = () => {
    if (!errorManager.canMakeApiCall('geolocation')) {
      setError('Trop de tentatives de géolocalisation. Veuillez patienter une minute.');
      return;
    }

    setLoading(true);
    setError(null);

    errorManager.safeGeolocationCall(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      (error) => {
        let errorMessage = 'Erreur de géolocalisation';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Permission refusée pour accéder à votre position.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Position non disponible.';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Délai d\'attente dépassé.';
            break;
          default:
            errorMessage = error.message || 'Erreur inconnue lors de la géolocalisation.';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      defaultOptions
    );
  };

  return {
    position,
    error,
    loading,
    getCurrentPosition
  };
};

/**
 * Wrapper pour éviter les appels répétés à l'API History
 */
export const safeHistoryPush = (navigate, path, options = {}) => {
  try {
    // Vérifier si on est déjà sur la route demandée
    if (window.location.pathname === path) {
      return;
    }
    
    // Utiliser navigate au lieu de history.push pour éviter les erreurs de sécurité
    if (!errorManager.canMakeApiCall('history')) {
      console.warn('Navigation ignorée - trop d\'appels à l\'API History');
      return;
    }
    
    navigate(path, { replace: false, ...options });
  } catch (error) {
    errorManager.recordApiError('history', error);
    console.warn('Erreur lors de la navigation:', error);
  }
};

/**
 * Détection sécurisée des capacités du navigateur
 */
export const getBrowserCapabilities = () => {
  return {
    geolocation: 'geolocation' in navigator,
    isSecureContext: errorManager.isSecureContext(),
    cookiesEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  };
};
