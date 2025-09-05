
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { 
  Badge, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../../components/ui';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Home, 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText, 
  Heart, 
  CalendarDays, 
  Target, 
  Activity, 
  ShoppingCart, 
  MapPin, 
  Star, 
  Clock, 
  PlusCircle, 
  UserPlus, 
  Building, 
  Wallet, 
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/ui/spinner';
import BecomeSellerButton from '@/components/auth/BecomeSellerButton';


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
  
  // États pour les métriques de base
  const [requests, setRequests] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [userInvestments, setUserInvestments] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [assignedAgent, setAssignedAgent] = useState(null);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  // États pour analytics avancés
  const [analytics, setAnalytics] = useState({
    propertyValue: 0,
    monthlyGrowth: 0,
    portfolioSize: 0,
    avgPropertyValue: 0,
    totalTransactions: 0,
    activeListings: 0
  });
  
  const [chartData, setChartData] = useState({
    monthlyActivity: [],
    propertyTypes: [],
    priceEvolution: [],
    investmentPerformance: [],
    marketComparison: []
  });
  
  const [activityTimeline, setActivityTimeline] = useState([]);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price);
  };

  if (!user) {
    return <div className="flex items-center justify-center h-full"><LoadingSpinner size="large" /></div>;
  }

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        // 1. Récupérer les demandes utilisateur
        const { data: reqs, error: reqsError } = await supabase
          .from('requests')
          .select('*')
          .eq('user_id', user.id);
        if (reqsError) throw reqsError;
        setRequests(reqs || []);

        // 2. Récupérer les parcelles liées
        const parcelIds = reqs?.map(r => r.parcel_id).filter(Boolean) || [];
        let parcelsMap = {};
        if (parcelIds.length > 0) {
          const { data: parcelsData, error: parcelsError } = await supabase
            .from('parcels')
            .select('id, name, price, description, current_value, created_at, type, location')
            .in('id', parcelIds);
          if (!parcelsError && parcelsData) {
            parcelsMap = Object.fromEntries(parcelsData.map(p => [p.id, p]));
          }
        }
        setParcels(parcelsMap);

        // 3. Récupérer les investissements/achats
        const { data: investments, error: investError } = await supabase
          .from('transactions')
          .select(`
            id,
            amount,
            created_at,
            status,
            type,
            parcels (id, name, price, current_value, type, location)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (!investError && investments) {
          setUserInvestments(investments.map(inv => ({
            id: inv.parcels?.id || inv.id,
            name: inv.parcels?.name || 'Terrain non spécifié',
            purchasePrice: inv.amount,
            currentValue: inv.parcels?.current_value || inv.amount,
            purchaseDate: inv.created_at,
            status: inv.status,
            type: inv.parcels?.type || 'Terrain',
            location: inv.parcels?.location || 'Non spécifié'
          })));
        }

        // 4. Récupérer les événements/rendez-vous
        const { data: events, error: eventsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .order('scheduled_date', { ascending: false });
        
        if (!eventsError && events) {
          setUserEvents(events.map(event => ({
            id: event.id,
            title: event.title || `Rendez-vous ${event.type}`,
            date: new Date(event.scheduled_date),
            type: event.type || 'Rendez-vous',
            status: event.status || 'Planifié'
          })));
        }

        // 5. Récupérer l'agent assigné et analytics avancés
        await Promise.all([
          fetchUserProfile(),
          fetchFavorites(),
          generateAdvancedAnalytics(reqs, investments, parcelsMap)
        ]);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select(`
            assigned_agent_id,
            agents (id, name, email, phone, avatar_url)
          `)
          .eq('id', user.id)
          .single();
        
        if (!profileError && profile?.agents) {
          setAssignedAgent({
            name: profile.agents.name,
            email: profile.agents.email,
            phone: profile.agents.phone,
            avatarDesc: profile.agents.name
          });
        }

        // 6. Compter les favoris
        const { count: favCount, error: favError } = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (!favError) {
          setFavoriteCount(favCount || 0);
        }

      } catch (err) {
        setFetchError(err.message);
        console.error('Erreur lors du chargement des données:', err);
        safeToast('Erreur lors du chargement des données', 'destructive');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAllData();
  }, [user]);

  // Fonctions utilitaires pour les calculs
  const calculateMonthlyGrowth = (investments) => {
    if (!investments || investments.length < 2) return 0;
    
    const thisMonth = new Date();
    const lastMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);
    
    const thisMonthInv = investments.filter(inv => 
      new Date(inv.created_at) >= lastMonth
    ).length;
    
    const prevMonthInv = investments.filter(inv => {
      const invDate = new Date(inv.created_at);
      return invDate < lastMonth && invDate >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1);
    }).length;
    
    return prevMonthInv > 0 ? ((thisMonthInv - prevMonthInv) / prevMonthInv * 100) : 0;
  };

  const generateMonthlyActivity = (requests, investments) => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toLocaleDateString('fr-FR', { month: 'short' }),
        demandes: requests?.filter(r => 
          new Date(r.created_at).getMonth() === date.getMonth() &&
          new Date(r.created_at).getFullYear() === date.getFullYear()
        ).length || 0,
        investissements: investments?.filter(inv => 
          new Date(inv.created_at).getMonth() === date.getMonth() &&
          new Date(inv.created_at).getFullYear() === date.getFullYear()
        ).length || 0
      });
    }
    return months;
  };

  const generatePropertyTypeDistribution = (parcelsData) => {
    const types = {};
    Object.values(parcelsData).forEach(parcel => {
      const type = parcel.type || 'Terrain';
      types[type] = (types[type] || 0) + 1;
    });
    
    return Object.entries(types).map(([type, count]) => ({
      name: type,
      value: count,
      color: getTypeColor(type)
    }));
  };

  const generatePriceEvolution = (investments) => {
    return investments?.slice(0, 10).map((inv, index) => ({
      mois: `M${index + 1}`,
      prix: inv.amount || 0,
      valeur: inv.currentValue || inv.amount || 0
    })) || [];
  };

  const generateInvestmentPerformance = (investments) => {
    return investments?.map(inv => ({
      nom: inv.name?.slice(0, 15) || 'Terrain',
      achat: inv.purchasePrice || 0,
      actuel: inv.currentValue || inv.purchasePrice || 0,
      performance: inv.currentValue ? ((inv.currentValue - inv.purchasePrice) / inv.purchasePrice * 100) : 0
    })) || [];
  };

  const generateMarketComparison = (parcelsData) => {
    const locations = {};
    Object.values(parcelsData).forEach(parcel => {
      const loc = parcel.location || 'Dakar';
      if (!locations[loc]) {
        locations[loc] = { total: 0, count: 0 };
      }
      locations[loc].total += parcel.current_value || parcel.price || 0;
      locations[loc].count += 1;
    });
    
    return Object.entries(locations).map(([location, data]) => ({
      zone: location,
      moyenne: data.count > 0 ? data.total / data.count : 0,
      proprietes: data.count
    }));
  };

  const generateActivityTimeline = (requests, investments) => {
    const activities = [];
    
    requests?.slice(0, 5).forEach(req => {
      activities.push({
        id: `req-${req.id}`,
        type: 'Demande',
        title: `Demande ${req.request_type || 'générale'}`,
        description: `Statut: ${req.status}`,
        date: new Date(req.created_at),
        icon: FileText,
        color: 'blue'
      });
    });
    
    investments?.slice(0, 5).forEach(inv => {
      activities.push({
        id: `inv-${inv.id}`,
        type: 'Investissement',
        title: `Achat ${inv.name}`,
        description: `${formatPrice(inv.purchasePrice)}`,
        date: new Date(inv.purchaseDate),
        icon: TrendingUp,
        color: 'green'
      });
    });
    
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Terrain': '#3b82f6',
      'Résidentiel': '#10b981',
      'Commercial': '#f59e0b',
      'Industriel': '#ef4444',
      'Agricole': '#8b5cf6'
    };
    return colors[type] || '#6b7280';
  };

  // Fonctions pour récupérer le profil utilisateur
  const fetchUserProfile = async () => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        assigned_agent_id,
        agents (id, name, email, phone)
      `)
      .eq('id', user.id)
      .single();
    
    if (!profileError && profile?.agents) {
      setAssignedAgent({
        id: profile.agents.id,
        name: profile.agents.name,
        email: profile.agents.email,
        phone: profile.agents.phone,
        avatarDesc: profile.agents.name
      });
    }
  };

  // Fonction pour récupérer les favoris
  const fetchFavorites = async () => {
    const { count: favCount, error: favError } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    if (!favError) {
      setFavoriteCount(favCount || 0);
    }
  };

  // Fonction pour générer les analytics avancés
  const generateAdvancedAnalytics = async (requests, investments, parcelsData) => {
    try {
      // Calcul des métriques de base
      const totalPropertyValue = Object.values(parcelsData).reduce((sum, p) => sum + (p.current_value || p.price || 0), 0);
      const avgPropertyValue = Object.keys(parcelsData).length > 0 ? totalPropertyValue / Object.keys(parcelsData).length : 0;
      
      // Analytics détaillés
      const portfolioAnalytics = {
        propertyValue: totalPropertyValue,
        monthlyGrowth: calculateMonthlyGrowth(investments),
        portfolioSize: Object.keys(parcelsData).length,
        avgPropertyValue: avgPropertyValue,
        totalTransactions: investments?.length || 0,
        activeListings: requests?.filter(r => r.status === 'En cours').length || 0
      };
      
      setAnalytics(portfolioAnalytics);

      // Données pour les graphiques
      const chartAnalytics = {
        monthlyActivity: generateMonthlyActivity(requests, investments),
        propertyTypes: generatePropertyTypeDistribution(parcelsData),
        priceEvolution: generatePriceEvolution(investments),
        investmentPerformance: generateInvestmentPerformance(investments),
        marketComparison: generateMarketComparison(parcelsData)
      };
      
      setChartData(chartAnalytics);

      // Timeline d'activité
      const timeline = generateActivityTimeline(requests, investments);
      setActivityTimeline(timeline);

    } catch (error) {
      console.error('Erreur dans generateAdvancedAnalytics:', error);
    }
  };

  const myActiveRequests = requests.filter(r => r.status !== 'Traitée' && r.status !== 'Annulée');

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
                <div className="text-2xl font-bold">{favoriteCount}</div>
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
                    {assignedAgent ? (
                      <>
                        <AvatarImage src={assignedAgent.avatar_url || `/api/placeholder/40/40?text=${encodeURIComponent(assignedAgent.name.charAt(0))}`} alt={assignedAgent.avatarDesc} />
                        <AvatarFallback>{assignedAgent.name.substring(0,1)}</AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/placeholder-agent.png" alt="Aucun agent" />
                        <AvatarFallback>?</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <p className="text-sm font-medium truncate">
                    {assignedAgent ? assignedAgent.name : 'Aucun agent assigné'}
                  </p>
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
              {loading ? (
                <div className="flex items-center justify-center py-8"><LoadingSpinner size="large" /></div>
              ) : fetchError ? (
                <div className="text-center py-8 text-red-600">Erreur : {fetchError}</div>
              ) : myActiveRequests.length > 0 ? (
                <div className="space-y-4">
                  {myActiveRequests.slice(0, 3).map(req => (
                    <div key={req.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                         <p className="font-semibold">{parcels[req.parcel_id]?.name || `Demande à ${req.recipient}`}</p>
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
                {userInvestments.length > 0 ? (
                  <ul className="space-y-3">
                    {userInvestments.map(inv => (
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
                        {userEvents.length > 0 ? userEvents.map(event => (
                            <li key={event.id} className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50">
                               <div className="flex-shrink-0 pt-1">
                                  <CalendarDays className="h-4 w-4 text-primary" />
                               </div>
                               <div>
                                  <p className="font-medium text-sm">{event.title}</p>
                                  <p className="text-xs text-muted-foreground">{event.date.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })} - <span className="font-semibold">{event.status}</span></p>
                               </div>
                            </li>
                        )) : (
                            <li className="text-sm text-muted-foreground py-4 text-center">
                                Aucun événement programmé
                            </li>
                        )}
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

