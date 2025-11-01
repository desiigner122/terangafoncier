import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const UserWelcomeGreeting = ({ 
  className = "", 
  showRole = true, 
  variant = "default",
  customMessage = "" 
}) => {
  const { user } = useAuth();

  if (!user) return null;

  // Obtenir le nom d'affichage
  const getDisplayName = () => {
    if (user.full_name) {
      // Si on a un nom complet, prendre le prénom
      const nameParts = user.full_name.trim().split(' ');
      return nameParts[0];
    }
    
    if (user.email) {
      // Sinon, utiliser la partie avant @ de l'email
      return user.email.split('@')[0];
    }
    
    return 'Utilisateur';
  };

  const displayName = getDisplayName();
  const userRole = user.role || user.user_type || 'Utilisateur';

  // Messages personnalisés selon le rôle
  const getRoleBasedMessage = () => {
    if (customMessage) return customMessage;
    
    const normalizedRole = (userRole || '').toLowerCase();
    switch (normalizedRole) {
      case 'banque':
        return 'Gérez vos services financiers et crédits immobiliers';
      case 'notaire':
        return 'Authentifiez et gérez vos actes notariés';
      case 'mairie':
        return 'Administrez les demandes foncières de votre commune';
      case 'agent foncier':
        return 'Supervisez les transactions et vérifications foncières';
      case 'promoteur':
        return 'Développez et gérez vos projets immobiliers';
      case 'investisseur':
        return 'Analysez et suivez vos investissements immobiliers';
      case 'agriculteur':
        return 'Gérez vos parcelles agricoles et productions';
      case 'géomètre':
        return 'Effectuez vos mesures et délimitations de terrain';
      case 'vendeur particulier':
      case 'vendeur pro':
        return 'Gérez vos annonces et transactions immobilières';
      case 'particulier':
      default:
        return 'Gérez vos investissements et propriétés';
    }
  };

  // Emojis selon le rôle
  const getRoleEmoji = () => {
    const normalizedRole = (userRole || '').toLowerCase();
    switch (normalizedRole) {
      case 'banque': return '🏦';
      case 'notaire': return '⚖️';
      case 'mairie': return '🏛️';
      case 'agent foncier': return '🏢';
      case 'promoteur': return '🏗️';
      case 'investisseur': return '💼';
      case 'agriculteur': return '🌾';
      case 'géomètre': return '📐';
      case 'vendeur particulier':
      case 'vendeur pro': return '🏠';
      case 'particulier':
      default: return '👋';
    }
  };

  // Styles selon la variante
  const getStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: "flex items-center gap-2",
          greeting: "text-lg font-semibold",
          message: "text-sm text-muted-foreground"
        };
      case 'hero':
        return {
          container: "text-center space-y-2",
          greeting: "text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
          message: "text-lg text-muted-foreground"
        };
      default:
        return {
          container: "space-y-1",
          greeting: "text-2xl font-bold text-gray-900 dark:text-white",
          message: "text-gray-600 dark:text-gray-300"
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${styles.container} ${className}`}
    >
      <div className={styles.greeting}>
        <span className="mr-2">{getRoleEmoji()}</span>
        Bonjour {displayName} !
      </div>
      
      <p className={styles.message}>
        {getRoleBasedMessage()}
      </p>
      
      {showRole && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize"
        >
          {userRole}
        </motion.span>
      )}
    </motion.div>
  );
};

export default UserWelcomeGreeting;
