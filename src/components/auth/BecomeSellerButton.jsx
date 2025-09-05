
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  UserPlus
} from 'lucide-react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const BecomeSellerButton = ({ variant = "default", size = "default", className = "" }) => {
  // Protection contre useAuth qui peut retourner null
  const authData = useAuth();
  const user = authData?.user || null;
  const navigate = useNavigate();
  
  // Si pas d'utilisateur, ne pas afficher le composant
  if (!user) {
    return null;
  }

  // Récupérer le rôle de l'utilisateur
  const userRole = user?.user_metadata?.role || user?.role || 'Particulier';
  
  // Seulement afficher pour les particuliers qui ne sont pas encore vendeurs
  if (userRole !== 'Particulier' && !userRole.includes('Particulier')) {
    return null;
  }

  // Si l'utilisateur est déjà vendeur, ne pas afficher le bouton
  if (userRole.includes('Vendeur')) {
    return null;
  }

  const handleClick = () => {
    // Rediriger vers la page de demande de vendeur
    navigate('/become-seller');
  };

  return (
    <Button 
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white ${className}`}
    >
      <UserPlus className="w-4 h-4 mr-2" />
      Devenir Vendeur
    </Button>
  );
};

export default BecomeSellerButton;
  
