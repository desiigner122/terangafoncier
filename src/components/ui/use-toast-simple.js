// Version minimale de useToast pour éviter les TypeError en production
// Aucun hook complexe, juste des fonctions simples

export const toast = ({ title, description, variant, ...props } = {}) => {
  // Simple console.log pour éviter toute erreur
  if (typeof console !== 'undefined' && console.log) {
    console.log('Toast:', title, description);
  }
  return Date.now().toString();
};

export function useToast() {
  // Retour le plus simple possible pour éviter toute erreur null
  return {
    toast: toast,
    toasts: [],
    dismiss: () => {},
  };
}
