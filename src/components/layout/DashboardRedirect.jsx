import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    // Ne pas rediriger si on est encore en train de charger
    if (loading) {
      console.log('🔄 Auth still loading...');
      return;
    }

    if (user) {
      // Utiliser soit le profil complet, soit les métadonnées de l'utilisateur
      const roleFromProfile = profile?.role || profile?.user_type;
      const roleFromUserMeta = user.user_metadata?.role || user.user_metadata?.user_type || user.user_metadata?.userType;
      
      const finalRole = roleFromProfile || roleFromUserMeta || 'Particulier';
      
      console.log('🔄 Dashboard redirection debugging:');
      console.log('- User:', user);
      console.log('- Profile:', profile);
      console.log('- Role from profile:', roleFromProfile);
      console.log('- Role from user metadata:', roleFromUserMeta);
      console.log('- Final role determined:', finalRole);
      
      // Redirection basée sur le rôle
      switch (finalRole) {
        case 'Vendeur':
        case 'vendeur':
        case 'Vendeur Particulier':
        case 'vendeur particulier':
        case 'Vendeur Pro':
        case 'vendeur pro':
          console.log('✅ Redirecting to Vendeur dashboard');
          navigate('/dashboard/vendeur', { replace: true });
          break;
        case 'Promoteur':
        case 'promoteur':
          console.log('✅ Redirecting to Promoteur dashboard');
          navigate('/dashboard/promoteur', { replace: true });
          break;
        case 'Banque':
        case 'banque':
          console.log('✅ Redirecting to Banque dashboard');
          navigate('/dashboard/banque', { replace: true });
          break;
        case 'Investisseur':
        case 'investisseur':
          console.log('✅ Redirecting to Investisseur dashboard');
          navigate('/dashboard/investisseur', { replace: true });
          break;
        case 'Mairie':
        case 'mairie':
          console.log('✅ Redirecting to Mairie dashboard');
          navigate('/dashboard/mairie', { replace: true });
          break;
        case 'Notaire':
        case 'notaire':
          console.log('✅ Redirecting to Notaire dashboard');
          navigate('/dashboard/notaire', { replace: true });
          break;
        case 'Géomètre':
        case 'géomètre':
        case 'geometre':
          console.log('✅ Redirecting to Géomètre dashboard');
          navigate('/dashboard/geometre', { replace: true });
          break;
        case 'Agent Foncier':
        case 'agent_foncier':
          console.log('✅ Redirecting to Agent Foncier dashboard');
          navigate('/dashboard/agent-foncier', { replace: true });
          break;
        case 'Admin':
        case 'admin':
          console.log('✅ Redirecting to Admin dashboard');
          navigate('/admin', { replace: true });
          break;
        case 'Acheteur':
        case 'acheteur':
        case 'Particulier':
        case 'particulier':
        default:
          console.log('✅ Redirecting to Acheteur/Particulier dashboard (default)');
          navigate('/dashboard/acheteur', { replace: true });
          break;
      }
    } else {
      // Pas d'utilisateur connecté, on redirige vers la page de connexion
      console.log('❌ No user found, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [user, profile, loading, navigate]);

  // Affichage de chargement pendant la redirection
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {loading ? 'Chargement de votre profil...' : 'Redirection vers votre espace...'}
        </p>
      </div>
    </div>
  );
};

export default DashboardRedirect;