import { logger } from '@/lib/logger';
/**
 * Utilitaire pour accéder aux variables d'environnement de manière sécurisée
 * Évite l'erreur "process is not defined" dans le navigateur
 */

// Fonction sécurisée pour accéder aux variables d'environnement
export const getEnvVar = (key, defaultValue = null) => {
  // Vérifier si on est dans un environnement Node.js
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  
  // Vérifier si Vite a exposé les variables d'environnement
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue;
  }
  
  // Dernière option : variables définies globalement
  if (typeof window !== 'undefined' && window.env) {
    return window.env[key] || defaultValue;
  }
  
  return defaultValue;
};

// Variables d'environnement spécifiques pour l'application
export const ENV_VARS = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  SUPABASE_URL: getEnvVar('REACT_APP_SUPABASE_URL') || getEnvVar('VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('REACT_APP_SUPABASE_ANON_KEY') || getEnvVar('VITE_SUPABASE_ANON_KEY'),
};

// Configuration pour différents environnements
export const isProduction = ENV_VARS.NODE_ENV === 'production';
export const isDevelopment = ENV_VARS.NODE_ENV === 'development';

// Fonction pour logger les variables d'environnement (sans exposer les clés sensibles)
export const logEnvStatus = () => {
  logger.group('🔧 Configuration Environnement');
  logger.debug('Mode:', ENV_VARS.NODE_ENV);
  logger.debug('OpenAI API:', ENV_VARS.OPENAI_API_KEY ? '✅ Configurée' : '❌ Non configurée (mode simulation)');
  logger.debug('Supabase URL:', ENV_VARS.SUPABASE_URL ? '✅ Configurée' : '❌ Non configurée');
  logger.debug('Supabase Key:', ENV_VARS.SUPABASE_ANON_KEY ? '✅ Configurée' : '❌ Non configurée');
  logger.groupEnd();
};