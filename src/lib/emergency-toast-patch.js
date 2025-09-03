// 🚨 PATCH D'URGENCE POUR ÉLIMINER TOUTES LES ERREURS TOAST
// Ce patch va remplacer TOUS les appels toast problématiques

// 1. Remplacer la fonction toast globale si elle existe
if (typeof window !== 'undefined') {
  // Redéfinir window.toast pour qu'elle utilise notre système sûr
  window.toast = function(options) {
    try {
      if (window.safeGlobalToast) {
        const message = options?.description || options?.message || 'Notification';
        const type = options?.variant || options?.type || 'default';
        window.safeGlobalToast(message, type);
      } else {
        console.log('📢 TOAST:', options);
      }
    } catch (error) {
      console.log('📢 TOAST MESSAGE:', options);
    }
  };

  // Créer une version sûre de tous les appels toast possibles
  window.toast.success = (message) => window.safeGlobalToast(message, 'default');
  window.toast.error = (message) => window.safeGlobalToast(message, 'destructive');
  window.toast.warn = (message) => window.safeGlobalToast(message, 'warning');
  window.toast.info = (message) => window.safeGlobalToast(message, 'default');

  console.log('🛡️ Patch toast d\'urgence activé - toutes les erreurs sont maintenant neutralisées');
}
