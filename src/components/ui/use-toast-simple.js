import { useState, useEffect, useCallback } from "react"

// Version simplifiée et stable de useToast pour éviter les erreurs en production
let toastId = 0;

const generateId = () => {
  toastId += 1;
  return `toast-${toastId}`;
};

// Store global simple pour les toasts
const toastState = {
  toasts: [],
  listeners: [],
};

const addToast = (toast) => {
  const id = generateId();
  const newToast = { id, ...toast };
  
  toastState.toasts = [...toastState.toasts, newToast];
  toastState.listeners.forEach(listener => listener(toastState.toasts));
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    removeToast(id);
  }, 5000);
  
  return id;
};

const removeToast = (id) => {
  toastState.toasts = toastState.toasts.filter(t => t.id !== id);
  toastState.listeners.forEach(listener => listener(toastState.toasts));
};

export const toast = ({ title, description, variant = "default", ...props }) => {
  // Validate that we have content to show
  if (!title && !description) {
    console.warn('Toast called without title or description');
    return;
  }
  
  return addToast({
    title,
    description,
    variant,
    ...props
  });
};

export function useToast() {
  const [toasts, setToasts] = useState(toastState.toasts);
  
  useEffect(() => {
    const unsubscribe = (newToasts) => {
      setToasts([...newToasts]);
    };
    
    toastState.listeners.push(unsubscribe);
    
    return () => {
      toastState.listeners = toastState.listeners.filter(l => l !== unsubscribe);
    };
  }, []);
  
  const dismiss = useCallback((toastId) => {
    removeToast(toastId);
  }, []);
  
  return {
    toast,
    toasts,
    dismiss,
  };
}
