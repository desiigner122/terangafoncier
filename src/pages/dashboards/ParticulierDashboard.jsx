
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  FileText, 
  UserCheck, 
  Gavel, 
  TrendingUp, 
  CalendarDays, 
  PlusCircle, 
  Heart, 
  UserPlus
} from 'lucide-react';
// useToast remplacé par safeToast
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/spinner';
import BecomeSellerButton from '@/components/auth/BecomeSellerButton';

const sampleAssignedAgent = {
  name: "Agent Alioune",
  email: "alioune.agent@teranga.sn",
  phone: "+221 77 123 45 67",
  avatarDesc: "Agent Alioune",
};

const sampleUserInvestments = [
  { id: 'dk-alm-002', name: 'Terrain Résidentiel Almadies', purchasePrice: 150000000, currentValue: 165000000, purchaseDate: '2023-01-15' },
  { id: 'dmn-cit-005', name: 'Terrain Pôle Urbain Diamniadio', purchasePrice: 25000000, currentValue: 28000000, purchaseDate: '2024-06-10' },
];

const initialEvents = [
  {
    id: 'visit1',
    title: 'Visite Terrain Almadies (dk-alm-002)',
    date: new Date(2025, 6, 15, 10, 0, 0),
    type: 'Visite',
    status: 'Confirmée'
  },
  {
    id: 'visit2',
    title: 'RDV Notaire - Achat sly-ngp-010',
    date: new Date(2025, 6, 20, 14, 30, 0),
    type: 'Rendez-vous',
    status: 'Confirmé'
  },
   {
    id: 'deadline1',
    title: 'Paiement échéance #2 (dmn-cit-005)',
    date: new Date(2025, 6, 30, 23, 59, 0),
    type: 'Echéance',
    status: 'À venir'
  },
];


const ParticulierDashboard = () => {
  // Système de notification sécurisé
const safeToast = (message, type = 'default') => {
  try {
    // Utilisation du système global sécurisé
    if (typeof window !== 'undefined' && window.safeGlobalToast) {
      window.safeGlobalToast(message, type);
      return;
    }
    
    // Fallback 1: Console pour développement
    console.log(`📢 TOAST [${type.toUpperCase()}]: ${message}`);
    
    // Fallback 2: Alert pour utilisateur en cas d'erreur critique
    if (type === 'destructive' || type === 'error') {
      alert(`❌ Erreur: ${message}`);
    } else if (type === 'success') {
      // Notification discrète pour succès
      if (typeof FileText !== 'undefined') {
        const notification = FileText.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          transition: all 0.3s ease;
        `;
        notification.textContent = `✅ ${message}`;
        FileText.body.appendChild(notification);
        
        setTimeout(() => {
          if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
          }
        }, 3000);
      }
    }
  } catch (error) {
    console.error('Erreur dans safeToast:', error);
    console.log(`📢 MESSAGE: ${message}`);
  }
};

  const { user } = useAuth();

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price);
  };


  if (!user) {
    return <div className="flex items-center justify-center h-full"><LoadingSpinner size="large" /></div>;
  }
  const myActiveRequests = sampleRequests.filter(r => r.user_id === user.id && r.status !== 'Traitée' && r.status !== 'Annulée'); 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 md:p-6 lg:p-8"
    >
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-primary">
                 Tableau de Bord
            </h1>
            <p className="text-muted-foreground">Bienvenue, {user.full_name} ! Gérez vos activités foncières ici.</p>
        </div>
        <Button asChild>
            <Link to="/request-municipal-land">
                <PlusCircle className="mr-2 h-4 w-4"/> Demander un Terrain Communal
            </Link>
        </Button>
      </div>
      
       {!user.role.includes('Vendeur') && (
            <Card className="bg-gradient-to-r from-primary/90 to-green-600/90 text-primary-foreground">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><UserPlus /> Passez au niveau supérieur !</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p>Prêt à vendre un bien ? Devenez un vendeur vérifié et accédez à de nouveaux outils.</p>
                    <BecomeSellerButton />
                </CardContent>
            </Card>
        )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div id="kpi-cards" className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Demandes Actives</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myActiveRequests.length}</div>
                <Link to="/my-requests" className="text-xs text-primary hover:underline mt-1 block">Voir détails</Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mes Favoris</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <Link to="/favorites" className="text-xs text-primary hover:underline mt-1 block">Gérer mes favoris</Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mon Conseiller</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://avatar.vercel.sh/${sampleAssignedAgent.name}.png`} alt={sampleAssignedAgent.avatarDesc} />
                    <AvatarFallback>{sampleAssignedAgent.name.substring(0,1)}</AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium truncate">{sampleAssignedAgent.name}</p>
                </div>
                <Link to="/messaging" className="text-xs text-primary hover:underline mt-1 block">Contacter</Link>
              </CardContent>
            </Card>
          </div>

          <Card id="requests-card">
            <CardHeader>
              <CardTitle>Suivi de mes Demandes</CardTitle>
              <CardDescription>Visualisez l'avancement de vos dossiers en cours.</CardDescription>
            </CardHeader>
            <CardContent>
              {myActiveRequests.length > 0 ? (
                <div className="space-y-4">
                  {myActiveRequests.slice(0, 3).map(req => (
                    <div key={req.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                         <p className="font-semibold">{sampleParcels.find(p=>p.id === req.parcel_id)?.name || `Demande à ${req.recipient}`}</p>
                         <p className="text-sm text-muted-foreground">ID: {req.id} | Statut: <span className="font-medium text-primary">{req.status}</span></p>
                      </div>
                      <Button asChild size="sm">
                        <Link to={`/case-tracking/${req.id}`}>
                          Suivi détaillé <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                      </Button>
                    </div>
                  ))}
                   {myActiveRequests.length > 3 && (
                      <div className="text-center mt-4">
                        <Button asChild variant="outline">
                          <Link to="/my-requests">Voir toutes les demandes ({myActiveRequests.length})</Link>
                        </Button>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-center py-8">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="text-muted-foreground mt-4">Aucune demande active pour le moment.</p>
                    <Button asChild className="mt-4">
                        <Link to="/parcelles">Découvrir des biens</Link>
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card id="investments-card">
              <CardHeader>
                <CardTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5"/> Mes Investissements</CardTitle>
                <CardDescription>Aperçu de vos parcelles acquises.</CardDescription>
              </CardHeader>
              <CardContent>
                {sampleUserInvestments.length > 0 ? (
                  <ul className="space-y-3">
                    {sampleUserInvestments.map(inv => (
                      <li key={inv.id} className="text-sm p-3 bg-muted/50 rounded-md">
                        <Link to={`/parcelles/${inv.id}`} className="font-semibold text-primary hover:underline block truncate">{inv.name}</Link>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-muted-foreground">Achat: {formatPrice(inv.purchasePrice)}</span>
                          <span className={`text-xs font-medium ${inv.currentValue >= inv.purchasePrice ? 'text-green-600' : 'text-red-600'}`}>
                            Actuel: {formatPrice(inv.currentValue)}
                            {inv.currentValue >= inv.purchasePrice ? ' ▲' : ' ▼'}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-muted-foreground">Aucun investissement enregistré.</p>}
              </CardContent>
            </Card>
            
            <Card id="calendar-card">
                <CardHeader>
                    <CardTitle className="flex items-center"><CalendarDays className="mr-2 h-5 w-5"/> Mes Événements</CardTitle>
                    <CardDescription>Vos prochains rendez-vous et échéances.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        {initialEvents.sort((a,b) => a.date - b.date).slice(0, 3).map(event => (
                            <li key={event.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50">
                               <div className="flex-shrink-0 pt-1">
                                  <CalendarDays className="h-4 w-4 text-primary" />
                               </div>
                               <div>
                                  <p className="font-medium text-sm">{event.title}</p>
                                  <p className="text-xs text-muted-foreground">{event.date.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })} - <span className="font-semibold">{event.status}</span></p>
                               </div>
                            </li>
                        ))}
                    </ul>
                    <Button variant="link" className="p-0 h-auto mt-2 text-sm">Voir tout</Button>
                </CardContent>
            </Card>
        </div>
      </div>
      
    </motion.div>
  );
};

export default ParticulierDashboard;

