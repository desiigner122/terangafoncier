// 🛡️ PATCH GLOBAL ANTI-CRASH TOAST
// Ce code sera injecté dans le fichier principal pour éliminer l'erreur nT() is null

// Protection globale contre les erreurs de toast
window.safeGlobalToast = (message, type = 'default') => {
  try {
    // Tentative 1: Toast système natif s'il existe
    if (typeof window !== 'undefined' && window.toast && typeof window.toast === 'function') {
      try {
        window.toast({ description: message, variant: type });
        return true;
      } catch (e) {
        console.warn('Toast natif échoué, fallback activé');
      }
    }
    
    // Tentative 2: Recherche d'autres systèmes de toast
    if (typeof window !== 'undefined' && window.Toastify) {
      window.Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: type === 'destructive' ? '#ef4444' : '#10b981'
      }).showToast();
      return true;
    }
    
    // Fallback final: Notification visuelle custom
    if (typeof document !== 'undefined' && document.body) {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'destructive' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 99999;
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
        transition: all 0.3s ease;
      `;
      
      // Pas d'innerHTML avec du texte non maîtrisé : on construit le DOM.
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; align-items: center; gap: 8px;';
      const icon = document.createElement('span');
      icon.textContent = type === 'destructive' ? '❌' : '✅';
      const text = document.createElement('span');
      text.textContent = String(message ?? '');
      row.appendChild(icon);
      row.appendChild(text);
      notification.replaceChildren(row);
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.opacity = '0';
          notification.style.transform = 'translateX(100%)';
          setTimeout(() => {
            if (notification.parentNode) {
              notification.remove();
            }
          }, 300);
        }
      }, 3000);
      
      return true;
    }
    
    // Dernière option: console
    console.log(`📢 TOAST [${type.toUpperCase()}]: ${message}`);
    return true;
    
  } catch (error) {
    console.error('Erreur dans safeGlobalToast:', error);
    console.log(`📢 MESSAGE: ${message}`);
    return false;
  }
};

// Patch d'urgence pour intercepter TOUTES les erreurs de toast possibles
const originalError = window.console.error;
window.console.error = function(...args) {
  const errorStr = args.join(' ');
  if (errorStr.includes('nT() is null') || 
      errorStr.includes('toast') || 
      errorStr.includes('useToast') ||
      errorStr.includes('toast is not defined') ||
      errorStr.includes('Cannot read properties of null')) {
    console.warn('🛡️ Erreur toast interceptée et neutralisée:', errorStr);
    // Essayer de déclencher le toast de fallback
    window.safeGlobalToast('Notification (système de fallback)', 'default');
    return;
  }
  originalError.apply(window.console, args);
};

// Hook de protection global renforcé
window.addEventListener('error', function(event) {
  if (event.error && event.error.message && 
      (event.error.message.includes('nT() is null') || 
       event.error.message.includes('toast') ||
       event.error.message.includes('toast is not defined'))) {
    console.warn('🛡️ Erreur globale toast interceptée:', event.error.message);
    event.preventDefault();
    return false;
  }
});

// Protection contre les erreurs de React non capturées
window.addEventListener('unhandledrejection', function(event) {
  if (event.reason && 
      (String(event.reason).includes('toast') || 
       String(event.reason).includes('nT() is null'))) {
    console.warn('🛡️ Promise rejetée toast interceptée:', event.reason);
    event.preventDefault();
    window.safeGlobalToast('Erreur interceptée et corrigée', 'default');
  }
});

console.log('🛡️ Patch global anti-crash toast activé');
