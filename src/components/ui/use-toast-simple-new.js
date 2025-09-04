import { useState, useCallback } from "react"

// Version ultra-simple de useToast pour éviter toute erreur en production
// Cette version est volontairement minimale pour éliminer les TypeError

export const toast = ({ title, description, variant = "default", ...props }) => {
  // Log pour débugger, mais ne fait rien de complexe qui pourrait planter
  console.log('Toast:', { title, description, variant });
  
  // Retourne un ID simple
  return `toast-${Date.now()}`;
};

export function useToast() {
  // État local simple sans store global complexe
  const [toasts, setToasts] = useState([]);
  
  // Fonction toast simple qui ne fait que logger
  const toastFn = useCallback(({ title, description, variant = "default", ...props }) => {
    console.log('Toast appelé:', { title, description, variant });
    
    // Ajouter le toast localement (optionnel)
    const newToast = {
      id: `toast-${Date.now()}`,
      title,
      description,
      variant,
      ...props
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove simple
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
    
    return newToast.id;
  }, []);
  
  const dismiss = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);
  
  return {
    toast: toastFn,
    toasts,
    dismiss,
  };
}
