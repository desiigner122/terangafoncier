import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

/**
 * Composant ProfileLink - Lien vers les pages de profil
 * @param {Object} props
 * @param {string} props.type - Type de profil (user, seller, promoter, bank, notary, geometer, investor, agent, municipality)
 * @param {string|number} props.id - ID du profil
 * @param {string} props.name - Nom à afficher
 * @param {React.ReactNode} props.children - Contenu du lien
 * @param {string} props.className - Classes CSS additionnelles
 * @param {boolean} props.external - Afficher l'icône de lien externe
 * @param {function} props.onClick - Fonction appelée au clic
 * @returns {React.Component}
 */
const ProfileLink = ({ 
  type, 
  id, 
  name, 
  children, 
  className = "", 
  external = false, 
  onClick,
  ...props 
}) => {
  // Mapping des types vers les routes
  const routeMap = {
    user: 'user',
    particulier: 'user',
    seller: 'seller',
    'vendeur-particulier': 'seller',
    'vendeur-pro': 'seller',
    promoter: 'promoter',
    promoteur: 'promoter',
    bank: 'bank',
    banque: 'bank',
    notary: 'notary',
    notaire: 'notary',
    geometer: 'geometer',
    geometre: 'geometer',
    investor: 'investor',
    investisseur: 'investor',
    agent: 'agent',
    'agent-foncier': 'agent',
    municipality: 'municipality',
    mairie: 'municipality',
    municipalite: 'municipality'
  };

  // Normaliser le type
  const normalizedType = type.toLowerCase().replace(/[^a-z-]/g, '');
  const profileType = routeMap[normalizedType];

  if (!profileType) {
    console.warn(`Type de profil non reconnu: ${type}`);
    return <span className={className}>{children || name}</span>;
  }

  const profileUrl = `/profile/${profileType}/${id}`;

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link 
      to={profileUrl}
      className={`inline-flex items-center gap-1 hover:text-blue-600 transition-colors ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children || name}
      {external && <ExternalLink className="w-3 h-3 ml-1" />}
    </Link>
  );
};

export default ProfileLink;
