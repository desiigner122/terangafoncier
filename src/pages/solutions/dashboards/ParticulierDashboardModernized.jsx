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
        if (typeof document !== 'undefined') {
          const notification = document.createElement('div');
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
          document.body.appendChild(notification);
          
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

      } catch (err) {
        setFetchError(err.message);
        console.error('Erreur lors du chargement des données:', err);
        safeToast('Erreur lors du chargement des données', 'destructive');
      } finally {
        setLoading(false);
      }
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

  const myActiveRequests = requests.filter(r => r.status !== 'Traitée' && r.status !== 'Annulée');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-800">Erreur de chargement: {fetchError}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6 lg:p-8"
    >
      {/* En-tête */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mon Portfolio Immobilier
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue {user?.full_name || 'Utilisateur'} ! Gérez vos investissements et propriétés
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            asChild 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link to="/request-municipal-land">
              <PlusCircle className="mr-2 h-4 w-4"/> 
              Nouvelle Demande
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Notification de devenir vendeur */}
      {!user?.role?.includes('Vendeur') && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <UserPlus className="h-5 w-5" /> 
                Boostez votre activité !
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-emerald-50">
                Devenez vendeur certifié et accédez à des outils professionnels avancés
              </p>
              <BecomeSellerButton />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* KPIs principaux */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Valeur du Portfolio</CardTitle>
            <Building className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {formatPrice(analytics.propertyValue)}
            </div>
            <div className="flex items-center text-xs text-blue-600 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{analytics.monthlyGrowth?.toFixed(1)}% ce mois
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">Propriétés Actives</CardTitle>
            <Home className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{analytics.portfolioSize}</div>
            <div className="flex items-center text-xs text-emerald-600 mt-2">
              <Heart className="h-3 w-3 mr-1" />
              {favoriteCount} favoris
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Demandes Actives</CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{myActiveRequests.length}</div>
            <Link to="/my-requests" className="text-xs text-purple-600 hover:underline mt-2 block">
              Voir détails
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Total Investissements</CardTitle>
            <Wallet className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{analytics.totalTransactions}</div>
            <div className="flex items-center text-xs text-amber-600 mt-2">
              <BarChart3 className="h-3 w-3 mr-1" />
              {formatPrice(analytics.avgPropertyValue)} moyenne
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Graphiques principaux */}
        <div className="lg:col-span-2 space-y-8">
          {/* Activité mensuelle */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Activité Mensuelle
                </CardTitle>
                <CardDescription>
                  Évolution de vos demandes et investissements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData.monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="demandes" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                      name="Demandes"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="investissements" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.6}
                      name="Investissements"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance des investissements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Performance Investissements
                </CardTitle>
                <CardDescription>
                  Comparaison prix d'achat vs valeur actuelle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.investmentPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        formatPrice(value), 
                        name === 'achat' ? 'Prix d\'achat' : 'Valeur actuelle'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="achat" fill="#3b82f6" name="Prix d'achat" />
                    <Bar dataKey="actuel" fill="#10b981" name="Valeur actuelle" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-8">
          {/* Types de propriétés */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  Répartition Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData.propertyTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                    >
                      {chartData.propertyTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Timeline d'activité */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-600" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activityTimeline.slice(0, 6).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`p-2 rounded-full ${
                      activity.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      activity.color === 'green' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.date.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {activityTimeline.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune activité récente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Agent assigné */}
          {assignedAgent && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    Mon Agent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(assignedAgent.name)}&background=random`} />
                      <AvatarFallback>{assignedAgent.avatarDesc?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{assignedAgent.name}</p>
                      <p className="text-sm text-gray-500">{assignedAgent.email}</p>
                      <p className="text-sm text-gray-500">{assignedAgent.phone}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    Contacter
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Événements à venir */}
      {userEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-indigo-600" />
                Rendez-vous à venir
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userEvents.slice(0, 3).map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="p-4 rounded-lg border bg-gradient-to-r from-indigo-50 to-purple-50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {event.date.toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <Badge variant={event.status === 'Planifié' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ParticulierDashboard;
