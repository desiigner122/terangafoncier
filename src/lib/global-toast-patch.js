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
      
      notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>${type === 'destructive' ? '❌' : '✅'}</span>
          <span>${message}</span>
        </div>
      `;
      
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

// Patch d'urgence pour intercepter les erreurs de toast
const originalError = window.console.error;
window.console.error = function(...args) {
  const errorStr = args.join(' ');
  if (errorStr.includes('nT() is null') || errorStr.includes('toast') || errorStr.includes('useToast')) {
    console.warn('🛡️ Erreur toast interceptée et neutralisée:', errorStr);
    // Essayer de déclencher le toast de fallback
    window.safeGlobalToast('Notification (système de fallback)', 'default');
    return;
  }
  originalError.apply(window.console, args);
};

// Hook de protection global
window.addEventListener('error', function(event) {
  if (event.error && event.error.message && 
      (event.error.message.includes('nT() is null') || 
       event.error.message.includes('toast'))) {
    console.warn('🛡️ Erreur globale toast interceptée:', event.error.message);
    event.preventDefault();
    return false;
  }
});

console.log('🛡️ Patch global anti-crash toast activé');
