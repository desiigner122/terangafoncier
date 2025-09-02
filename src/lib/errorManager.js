/**
 * Gestionnaire global d'erreurs pour éviter le spam d'API et les erreurs de sécurité
 */

class ErrorManager {
  constructor() {
    this.errorCounts = new Map();
    this.lastErrorTime = new Map();
    this.maxRetries = 3;
    this.cooldownPeriod = 60000; // 1 minute
  }

  // Vérifie si on peut effectuer un appel API
  canMakeApiCall(apiName) {
    const now = Date.now();
    const lastError = this.lastErrorTime.get(apiName);
    const errorCount = this.errorCounts.get(apiName) || 0;

    // Si on a dépassé le nombre max de tentatives et qu'on est encore en cooldown
    if (errorCount >= this.maxRetries && lastError && (now - lastError) < this.cooldownPeriod) {
      return false;
    }

    // Reset le compteur si le cooldown est passé
    if (lastError && (now - lastError) >= this.cooldownPeriod) {
      this.errorCounts.set(apiName, 0);
    }

    return true;
  }

  // Enregistre une erreur d'API
  recordApiError(apiName, error) {
    const now = Date.now();
    const currentCount = this.errorCounts.get(apiName) || 0;
    
    this.errorCounts.set(apiName, currentCount + 1);
    this.lastErrorTime.set(apiName, now);

    // Log différent selon le type d'erreur
    if (error.message?.includes('insecure') || error.message?.includes('https')) {
      console.warn(`[${apiName}] Erreur de sécurité:`, error.message);
    } else if (error.message?.includes('geolocation') || error.message?.includes('location')) {
      console.warn(`[${apiName}] Erreur de géolocalisation:`, error.message);
    } else {
      console.error(`[${apiName}] Erreur API:`, error);
    }
  }

  // Vérifie si on est dans un contexte sécurisé
  isSecureContext() {
    return window.isSecureContext || 
           location.protocol === 'https:' || 
           location.hostname === 'localhost' ||
           location.hostname === '127.0.0.1';
  }

  // Wrapper sécurisé pour les appels API de géolocalisation
  safeGeolocationCall(callback, errorCallback, options = {}) {
    if (!this.canMakeApiCall('geolocation')) {
      errorCallback(new Error('Trop d\'appels à l\'API de géolocalisation. Veuillez patienter.'));
      return;
    }

    if (!navigator.geolocation) {
      const error = new Error('Géolocalisation non supportée');
      this.recordApiError('geolocation', error);
      errorCallback(error);
      return;
    }

    if (!this.isSecureContext()) {
      const error = new Error('Géolocalisation nécessite HTTPS');
      this.recordApiError('geolocation', error);
      errorCallback(error);
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
      ...options
    };

    navigator.geolocation.getCurrentPosition(
      callback,
      (error) => {
        this.recordApiError('geolocation', error);
        errorCallback(error);
      },
      defaultOptions
    );
  }

  // Wrapper sécurisé pour les appels à l'API History
  safeHistoryCall(method, ...args) {
    try {
      if (!this.canMakeApiCall('history')) {
        console.warn('Trop d\'appels à l\'API History. Navigation ignorée.');
        return;
      }

      if (window.history && window.history[method]) {
        window.history[method](...args);
      }
    } catch (error) {
      this.recordApiError('history', error);
      console.warn('Erreur lors de la navigation:', error);
    }
  }

  // Nettoyage périodique des compteurs d'erreurs
  cleanup() {
    const now = Date.now();
    for (const [apiName, lastError] of this.lastErrorTime.entries()) {
      if (now - lastError > this.cooldownPeriod * 2) {
        this.errorCounts.delete(apiName);
        this.lastErrorTime.delete(apiName);
      }
    }
  }
}

// Instance globale
const errorManager = new ErrorManager();

// Nettoyage automatique toutes les 5 minutes
setInterval(() => errorManager.cleanup(), 300000);

// Gestionnaire global d'erreurs pour les erreurs non capturées
window.addEventListener('error', (event) => {
  if (event.error?.message?.includes('insecure') || 
      event.error?.message?.includes('geolocation') ||
      event.error?.message?.includes('history')) {
    console.warn('Erreur capturée globalement:', event.error.message);
    event.preventDefault(); // Empêche l'affichage dans la console
  }
});

// Gestionnaire pour les rejets de promesses non capturés
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('insecure') || 
      event.reason?.message?.includes('geolocation') ||
      event.reason?.message?.includes('history')) {
    console.warn('Promesse rejetée capturée:', event.reason.message);
    event.preventDefault();
  }
});

export default errorManager;
