// Configuration pour éviter les erreurs de Service Worker et gérer la sécurité

// Désactiver les Service Workers si non supportés ou en contexte non sécurisé
if ('serviceWorker' in navigator && window.isSecureContext) {
  // Service Worker optionnel uniquement en contexte sécurisé
  console.log('Service Worker supporté et contexte sécurisé');
} else {
  console.warn('Service Worker non disponible ou contexte non sécurisé');
}

// Configuration pour éviter les erreurs HTTPS/HTTP
export const securityConfig = {
  // Force HTTPS en production
  enforceHTTPS: process.env.NODE_ENV === 'production',
  
  // APIs qui nécessitent un contexte sécurisé
  secureAPIs: ['geolocation', 'camera', 'microphone', 'push'],
  
  // Vérification du contexte sécurisé
  isSecure: () => {
    return window.isSecureContext || 
           location.protocol === 'https:' || 
           location.hostname === 'localhost' ||
           location.hostname === '127.0.0.1';
  },
  
  // Redirection vers HTTPS si nécessaire
  redirectToHTTPS: () => {
    if (securityConfig.enforceHTTPS && location.protocol === 'http:' && location.hostname !== 'localhost') {
      location.replace(location.href.replace('http:', 'https:'));
    }
  }
};

// Application automatique de la redirection HTTPS
securityConfig.redirectToHTTPS();
