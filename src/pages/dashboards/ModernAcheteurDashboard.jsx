import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  TrendingUp, 
  Bell, 
  MapPin, 
  Building2, 
  Users, 
  FileText, 
  Heart, 
  Search, 
  Star,
  Calendar,
  Eye,
  ArrowRight,
  Filter,
  BarChart3,
  Activity,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  User,
  Download,
  Upload,
  MousePointer,
  Database,
  TrendingDown,
  Zap,
  DollarSign,
  Percent,
  Timer,
  Target,
  LineChart,
  PieChart
} from 'lucide-react';

// Imports sécurisés
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import DashboardHeaderWrapper from '@/components/common/DashboardHeaderWrapper';

const ModernAcheteurDashboard = () => {
  console.log('🚀 ModernAcheteurDashboard component initializing...');
  
  // Hooks standards
  const navigate = useNavigate();
  const { user } = useAuth();
  
  console.log('✅ Hooks initialized, user:', user?.email);
  
  // États pour les données du dashboard
  const [statistics, setStatistics] = useState({
    totalParcels: 0,
    totalProjects: 0,
    favoriteCount: 0,
    requestsCount: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [recentParcels, setRecentParcels] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [platformMetrics, setPlatformMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  // Statistiques du dashboard
  const dashboardStats = React.useMemo(() => {
    console.log('📊 Building dashboard stats...', statistics);
    
    try {
      return [
        {
          title: 'Parcelles Disponibles',
          value: statistics.totalParcels || 0,
          icon: Home,
          gradient: 'bg-gradient-to-br from-blue-600 to-blue-800',
          change: '+12 cette semaine',
          changeType: 'positive'
        },
        {
          title: 'Projets Actifs',
          value: statistics.totalProjects || 0,
          icon: Building2,
          gradient: 'bg-gradient-to-br from-green-600 to-green-800',
          change: '+5 ce mois',
          changeType: 'positive'
        },
        {
          title: 'Mes Favoris',
          value: statistics.favoriteCount || 0,
          icon: Heart,
          gradient: 'bg-gradient-to-br from-purple-600 to-purple-800',
          change: 'Dernière modification',
          changeType: 'neutral'
        },
        {
          title: 'Mes Demandes',
          value: statistics.requestsCount || 0,
          icon: FileText,
          gradient: 'bg-gradient-to-br from-orange-600 to-orange-800',
          change: 'En cours de traitement',
          changeType: 'neutral'
        }
      ];
    } catch (error) {
      console.error('❌ Error building dashboard stats:', error);
      return [];
    }
  }, [statistics]);

  // Métriques de la plateforme
  const platformStats = React.useMemo(() => {
    return [
      {
        title: 'Taux de Réussite',
        value: '94.5%',
        icon: Target,
        color: 'text-green-600',
        bg: 'bg-green-100',
        change: '+2.3%',
        changeType: 'positive'
      },
      {
        title: 'Temps Moyen de Traitement',
        value: '3.2j',
        icon: Timer,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        change: '-0.8j',
        changeType: 'positive'
      },
      {
        title: 'Satisfaction Client',
        value: '4.8/5',
        icon: Star,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        change: '+0.2',
        changeType: 'positive'
      },
      {
        title: 'Transactions Complétées',
        value: '1,247',
        icon: CheckCircle,
        color: 'text-purple-600',
        bg: 'bg-purple-100',
        change: '+89',
        changeType: 'positive'
      }
    ];
  }, []);

  // Services immobiliers
  const realEstateServices = [
    {
      title: 'Rechercher une Parcelle',
      subtitle: 'Trouvez votre terrain idéal',
      icon: Search,
      color: 'bg-blue-600/20',
      href: '/parcelles-vendeurs'
    },
    {
      title: 'Projets de Construction',
      subtitle: 'Découvrez les nouveaux projets',
      icon: Building2,
      color: 'bg-green-600/20',
      href: '/promoters-projects'
    },
    {
      title: 'Zones Communales',
      subtitle: 'Terrains communaux disponibles',
      icon: MapPin,
      color: 'bg-purple-600/20',
      href: '/communal-zones'
    },
    {
      title: 'Mes Favoris',
      subtitle: 'Parcelles que vous aimez',
      icon: Heart,
      color: 'bg-red-600/20',
      href: '/favorites'
    },
    {
      title: 'Mes Demandes',
      subtitle: 'Suivi de vos demandes',
      icon: FileText,
      color: 'bg-orange-600/20',
      href: '/my-requests'
    },
    {
      title: 'Calculateur de Prix',
      subtitle: 'Estimez le coût de votre terrain',
      icon: BarChart3,
      color: 'bg-indigo-600/20',
      href: '/tools/price-calculator'
    }
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      console.log('🔄 Loading dashboard data...');
      setLoading(true);
      
      if (!user) {
        console.log('❌ No user found');
        setLoading(false);
        return;
      }
      
      try {
        // Données de base avec valeurs par défaut
        let stats = {
          totalParcels: 45,
          totalProjects: 12,
          favoriteCount: 0,
          requestsCount: 0
        };

        // Notifications simulées
        const mockNotifications = [
          {
            id: 1,
            title: 'Nouvelle parcelle disponible à Dakar',
            message: 'Une parcelle de 500m² vient d\'être mise en vente dans votre zone de recherche.',
            type: 'info',
            time: '2 heures',
            icon: Home
          },
          {
            id: 2,
            title: 'Projet de construction approuvé',
            message: 'Le projet résidentiel "Les Jardins de Thiès" vient d\'être validé.',
            type: 'success',
            time: '5 heures',
            icon: Building2
          },
          {
            id: 3,
            title: 'Mise à jour de votre demande',
            message: 'Votre demande de terrain communal est en cours de traitement.',
            type: 'warning',
            time: '1 jour',
            icon: FileText
          }
        ];

        // Parcelles récentes simulées
        const mockParcels = [
          {
            id: 1,
            title: 'Terrain résidentiel - Almadies',
            location: 'Almadies, Dakar',
            price: '45,000,000',
            area: '600m²',
            image: '/api/placeholder/300/200',
            features: ['Titre foncier', 'Accès route', 'Électricité']
          },
          {
            id: 2,
            title: 'Parcelle commerciale - Plateau',
            location: 'Plateau, Dakar',
            price: '75,000,000',
            area: '400m²',
            image: '/api/placeholder/300/200',
            features: ['Zone commerciale', 'Transport', 'Services']
          },
          {
            id: 3,
            title: 'Terrain agricole - Thiès',
            location: 'Thiès Nord',
            price: '12,000,000',
            area: '2000m²',
            image: '/api/placeholder/300/200',
            features: ['Sol fertile', 'Irrigation', 'Accès véhicule']
          }
        ];

        // Projets récents simulés
        const mockProjects = [
          {
            id: 1,
            title: 'Résidence Les Palmiers',
            location: 'Saly, Mbour',
            units: 24,
            completion: '75%',
            priceFrom: '35,000,000',
            image: '/api/placeholder/300/200'
          },
          {
            id: 2,
            title: 'Centre Commercial Teranga',
            location: 'Rufisque',
            units: 48,
            completion: '60%',
            priceFrom: '20,000,000',
            image: '/api/placeholder/300/200'
          }
        ];

        // Journal d'audit simulé
        const mockAuditLogs = [
          {
            id: 1,
            action: 'Connexion utilisateur',
            description: 'Connexion réussie sur la plateforme',
            timestamp: new Date().toISOString(),
            type: 'success',
            icon: User,
            ip: '192.168.1.1'
          },
          {
            id: 2,
            action: 'Consultation parcelle',
            description: 'Parcelle #4521 consultée - Almadies, Dakar',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            type: 'info',
            icon: Eye,
            ip: '192.168.1.1'
          },
          {
            id: 3,
            action: 'Ajout aux favoris',
            description: 'Parcelle ajoutée aux favoris',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            type: 'info',
            icon: Heart,
            ip: '192.168.1.1'
          },
          {
            id: 4,
            action: 'Demande de financement',
            description: 'Nouvelle demande de financement soumise',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            type: 'warning',
            icon: FileText,
            ip: '192.168.1.1'
          },
          {
            id: 5,
            action: 'Téléchargement document',
            description: 'Titre foncier téléchargé',
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            type: 'success',
            icon: Download,
            ip: '192.168.1.1'
          }
        ];

        // Chargement des données Supabase si disponible
        if (supabase) {
          try {
            // Compter les favoris de l'utilisateur
            const { count: favCount } = await supabase
              .from('favorites')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id);
            stats.favoriteCount = favCount || 0;

            // Compter les demandes de l'utilisateur
            const { count: requestsCount } = await supabase
              .from('requests')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id);
            stats.requestsCount = requestsCount || 0;
            
            console.log('✅ Supabase data loaded');
          } catch (supabaseError) {
            console.error('Supabase error:', supabaseError);
          }
        }

        // Mise à jour des états
        setStatistics(stats);
        setNotifications(mockNotifications);
        setRecentParcels(mockParcels);
        setRecentProjects(mockProjects);
        setAuditLogs(mockAuditLogs);
        
        console.log('✅ Dashboard data loaded successfully');
        
      } catch (error) {
        console.error('❌ Erreur chargement données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  console.log('✅ Component render ready');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header unifié moderne */}
      <DashboardHeaderWrapper 
        userRole="Particulier"
        showQuickActions={true}
        showSearch={true}
        enableNotifications={true}
      />
      
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {dashboardStats.map((stat, index) => (
            <div
              key={stat.title}
              className={`${stat.gradient} rounded-xl p-6 text-white relative overflow-hidden shadow-lg`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <stat.icon className="w-8 h-8" />
                  {stat.changeType === 'positive' && <TrendingUp className="w-5 h-5" />}
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-white/90 text-sm font-medium mb-2">{stat.title}</p>
                <p className="text-white/70 text-xs">{stat.change}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Métriques de la plateforme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-blue-600" />
              Métriques de la Plateforme
            </h2>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              En temps réel
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformStats.map((metric, index) => (
              <div key={metric.title} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`w-12 h-12 ${metric.bg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{metric.value}</h3>
                <p className="text-gray-600 text-sm mb-2">{metric.title}</p>
                <div className={`flex items-center justify-center text-xs ${
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.changeType === 'positive' ? 
                    <TrendingUp className="w-3 h-3 mr-1" /> : 
                    <TrendingDown className="w-3 h-3 mr-1" />
                  }
                  {metric.change}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Bell className="w-6 h-6 mr-2 text-blue-600" />
              Notifications
            </h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {notifications.length} nouvelles
            </span>
          </div>
          
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  notification.type === 'success' ? 'bg-green-100 text-green-600' :
                  notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <notification.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{notification.title}</h3>
                  <p className="text-gray-600 text-sm">{notification.message}</p>
                  <p className="text-gray-400 text-xs mt-2">Il y a {notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Journal d'Audit et Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-600" />
              Journal d'Audit
            </h2>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                Sécurisé
              </span>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
                Exporter
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-4 p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  log.type === 'success' ? 'bg-green-100 text-green-600' :
                  log.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <log.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">{log.action}</h3>
                    <span className="text-gray-400 text-xs">
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{log.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center">
                      <Database className="w-3 h-3 mr-1" />
                      ID: {log.id}
                    </span>
                    <span className="flex items-center">
                      <MousePointer className="w-3 h-3 mr-1" />
                      IP: {log.ip}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={() => navigate('/audit-logs')}
              className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
            >
              <Clock className="w-4 h-4 mr-2" />
              Voir l'historique complet
            </button>
          </div>
        </motion.div>

        {/* Services Immobiliers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Services <span className="text-blue-600">Immobiliers</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realEstateServices.map((service, index) => (
              <motion.div
                key={service.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(service.href)}
                className={`${service.color} bg-white border border-gray-200 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg hover:border-blue-300`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-semibold">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  <span>Découvrir</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Nouvelles Parcelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Home className="w-6 h-6 mr-2 text-blue-600" />
              Nouvelles Parcelles
            </h2>
            <button 
              onClick={() => navigate('/parcelles-vendeurs')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Voir tout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentParcels.map((parcel) => (
              <div key={parcel.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Home className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{parcel.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {parcel.location}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-blue-600 font-bold">{parcel.price} FCFA</span>
                    <span className="text-gray-500 text-sm">{parcel.area}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {parcel.features.map((feature, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button 
                    onClick={() => navigate(`/parcelle/${parcel.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Nouveaux Projets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Building2 className="w-6 h-6 mr-2 text-blue-600" />
              Nouveaux Projets
            </h2>
            <button 
              onClick={() => navigate('/promoters-projects')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Voir tout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentProjects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-blue-600 font-bold">À partir de {project.priceFrom} FCFA</span>
                    <span className="text-gray-500 text-sm">{project.units} unités</span>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Avancement</span>
                      <span className="text-gray-800 font-medium">{project.completion}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: project.completion }}
                      ></div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/project/${project.id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Voir le projet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernAcheteurDashboard;