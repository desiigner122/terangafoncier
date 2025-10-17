import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook personnalisé pour mettre à jour le titre de la page (document.title)
 * en fonction de la route actuelle
 * 
 * Utilisation:
 * usePageTitle('Mon Titre');
 */
export const usePageTitle = (title, subtitle = null) => {
  useEffect(() => {
    const pageTitle = subtitle 
      ? `${title} - ${subtitle} | Teranga Foncier`
      : `${title} | Teranga Foncier`;
    
    document.title = pageTitle;
    
    // Nettoyer en sortant
    return () => {
      document.title = 'Teranga Foncier';
    };
  }, [title, subtitle]);
};

/**
 * Hook pour définir les titles automatiquement par route
 */
export const useTitleByRoute = () => {
  const location = useLocation();
  
  const pageTitles = {
    '/': 'Accueil',
    '/login': 'Connexion',
    '/register': 'Inscription',
    '/forgot-password': 'Mot de passe oublié',
    '/reset-password': 'Réinitialiser mot de passe',
    '/about': 'À Propos',
    '/contact': 'Contact',
    '/how-it-works': 'Comment ça marche',
    '/faq': 'Questions Fréquentes',
    '/blog': 'Blog',
    '/privacy': 'Politique de Confidentialité',
    '/legal': 'Mentions Légales',
    '/cookie-policy': 'Politique des Cookies',
    
    // Vendeur Dashboard
    '/vendeur': 'Dashboard Vendeur',
    '/vendeur/mes-proprietes': 'Mes Propriétés',
    '/vendeur/demandes-achat': 'Demandes d\'Achat',
    '/vendeur/messages': 'Messages',
    '/vendeur/notifications': 'Notifications',
    '/vendeur/documents': 'Documents',
    '/vendeur/settings': 'Paramètres',
    '/vendeur/purchase-requests': 'Demandes d\'Achat',
    
    // Acheteur Dashboard
    '/acheteur': 'Dashboard Acheteur',
    '/acheteur/mes-achats': 'Mes Achats',
    '/acheteur/mes-interets': 'Mes Intérêts',
    '/acheteur/demandes-municipales': 'Demandes Municipales',
    '/acheteur/reservations': 'Réservations',
    '/acheteur/proprietes-possedees': 'Propriétés Possédées',
    '/acheteur/messages': 'Messages',
    '/acheteur/notifications': 'Notifications',
    '/acheteur/documents': 'Documents',
    '/acheteur/settings': 'Paramètres',
    
    // Admin Dashboard
    '/admin': 'Dashboard Admin',
    '/admin/users': 'Gestion Utilisateurs',
    '/admin/transactions': 'Transactions',
    '/admin/properties': 'Propriétés',
    '/admin/reports': 'Rapports',
    '/admin/settings': 'Paramètres Admin',
    
    // Pages publiques
    '/parcelles-vendeurs': 'Parcelles Vendeurs',
    '/terrains-vendeurs': 'Terrains Vendeurs',
    '/parcelles-communales': 'Parcelles Communales',
    '/sell-property': 'Vendre une Propriété',
    '/add-property': 'Ajouter une Propriété',
    
    // Autres
    '/profile': 'Mon Profil',
    '/settings': 'Paramètres',
    '/help': 'Aide',
  };
  
  useEffect(() => {
    const pathname = location.pathname;
    
    // Chercher une correspondance exacte
    let title = pageTitles[pathname];
    
    // Si pas de correspondance exacte, chercher par préfixe
    if (!title) {
      const matchedKey = Object.keys(pageTitles).find(key => 
        pathname.startsWith(key) && key !== '/'
      );
      title = matchedKey ? pageTitles[matchedKey] : 'Teranga Foncier';
    }
    
    document.title = title === 'Teranga Foncier' 
      ? title 
      : `${title} | Teranga Foncier`;
  }, [location.pathname]);
};

export default usePageTitle;
