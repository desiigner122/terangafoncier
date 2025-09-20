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
  Settings,
  MessageSquare,
  MoreVertical,
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

  // Métriques de la plateforme enrichies
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
      },
      {
        title: 'Économies Réalisées',
        value: '12.5M FCFA',
        icon: DollarSign,
        color: 'text-emerald-600',
        bg: 'bg-emerald-100',
        change: '+1.8M',
        changeType: 'positive'
      },
      {
        title: 'Parcelles Actives',
        value: '2,834',
        icon: MapPin,
        color: 'text-indigo-600',
        bg: 'bg-indigo-100',
        change: '+145',
        changeType: 'positive'
      },
      {
        title: 'Nouveaux Projets',
        value: '87',
        icon: Building2,
        color: 'text-cyan-600',
        bg: 'bg-cyan-100',
        change: '+12',
        changeType: 'positive'
      },
      {
        title: 'Utilisateurs En Ligne',
        value: '432',
        icon: Users,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        change: '+24',
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

        // Notifications simulées enrichies
        const mockNotifications = [
          {
            id: 1,
            title: 'Action requise: Signature de contrat',
            message: 'Le contrat de vente pour le terrain TER-2024-015 expire dans 24h. Veuillez signer pour finaliser.',
            type: 'urgent',
            time: '2 heures',
            icon: AlertTriangle,
            read: false,
            actionRequired: true,
            metadata: {
              'Contrat': 'CTR-2024-015',
              'Expiration': '23h 45min'
            }
          },
          {
            id: 2,
            title: 'Nouvelle parcelle disponible à Dakar',
            message: 'Une parcelle de 500m² vient d\'être mise en vente dans votre zone de recherche préférée.',
            type: 'info',
            time: '3 heures',
            icon: Home,
            read: false,
            actionRequired: false,
            metadata: {
              'Surface': '500m²',
              'Prix': '35M FCFA'
            }
          },
          {
            id: 3,
            title: 'Paiement reçu ✅',
            message: 'Un paiement de 2 500 000 FCFA a été confirmé pour votre transaction TXN-2024-3847.',
            type: 'success',
            time: '4 heures',
            icon: CheckCircle,
            read: false,
            actionRequired: false,
            metadata: {
              'Montant': '2.5M FCFA',
              'Transaction': 'TXN-2024-3847'
            }
          },
          {
            id: 4,
            title: 'Nouveau message de Amadou Diallo',
            message: 'Bonjour, je suis intéressé par votre terrain à Almadies. Pouvons-nous discuter ?',
            type: 'info',
            time: '6 heures',
            icon: MessageSquare,
            read: true,
            actionRequired: false,
            metadata: {
              'De': 'Amadou Diallo',
              'Sujet': 'Terrain Almadies'
            }
          },
          {
            id: 5,
            title: 'Projet de construction approuvé',
            message: 'Le projet résidentiel "Les Jardins de Thiès" vient d\'être validé par la commission.',
            type: 'success',
            time: '1 jour',
            icon: Building2,
            read: true,
            actionRequired: false,
            metadata: {
              'Projet': 'Les Jardins de Thiès',
              'Logements': '120 unités'
            }
          },
          {
            id: 6,
            title: 'Document à signer',
            message: 'Le contrat de réservation pour votre parcelle est prêt et attend votre signature.',
            type: 'warning',
            time: '2 jours',
            icon: FileText,
            read: false,
            actionRequired: true,
            metadata: {
              'Type': 'Contrat réservation',
              'Échéance': '3 jours'
            }
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {platformStats.map((metric, index) => (
              <div key={metric.title} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-12 h-12 ${metric.bg} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{metric.value}</h3>
                <p className="text-gray-600 text-xs mb-2">{metric.title}</p>
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

        {/* Mes Demandes - Version Ultra-Moderne */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Header avancé */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <FileText className="w-7 h-7 text-indigo-600" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">5</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Mes Demandes</h2>
                  <p className="text-gray-600 text-sm">Suivi en temps réel de toutes vos démarches</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1">
                  <Filter className="w-4 h-4" />
                  <span>Filtrer</span>
                </button>
                <button 
                  onClick={() => navigate('/my-requests')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1"
                >
                  <span>Gérer tout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Filtres et statistiques avancées */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-200">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Toutes (13)</span>
                </span>
              </button>
              <button className="bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium border border-yellow-200 hover:bg-yellow-100">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span>En attente (3)</span>
                </span>
              </button>
              <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-100">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-spin"></div>
                  <span>En cours (2)</span>
                </span>
              </button>
              <button className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200 hover:bg-green-100">
                Complétées (8)
              </button>
            </div>
            
            {/* Métriques détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-yellow-600 text-3xl font-bold mb-2">3</div>
                    <div className="text-yellow-800 text-sm font-semibold mb-1">En Attente</div>
                    <div className="text-yellow-600 text-xs">Construction, Financement, Visite</div>
                  </div>
                  <div className="bg-yellow-200 p-3 rounded-xl">
                    <Clock className="w-6 h-6 text-yellow-700" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-2 bg-yellow-400 rounded-b-xl"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-blue-600 text-3xl font-bold mb-2">2</div>
                    <div className="text-blue-800 text-sm font-semibold mb-1">En Cours</div>
                    <div className="text-blue-600 text-xs">Vérification documents</div>
                  </div>
                  <div className="bg-blue-200 p-3 rounded-xl">
                    <Activity className="w-6 h-6 text-blue-700 animate-pulse" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-2 bg-blue-400 rounded-b-xl"></div>
                <div className="flex absolute top-2 right-2 space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                </div>
              </div>
              
              <div className="relative bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-green-600 text-3xl font-bold mb-2">8</div>
                    <div className="text-green-800 text-sm font-semibold mb-1">Complétées</div>
                    <div className="text-green-600 text-xs">Cette semaine : +3</div>
                  </div>
                  <div className="bg-green-200 p-3 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-700" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-2 bg-green-400 rounded-b-xl"></div>
                <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="text-center mb-8">
              <button 
                onClick={() => navigate('/my-requests')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                <span>Gérer toutes mes demandes (13)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Nouveaux Terrains & Projets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.19 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-green-600" />
              Nouveautés Temps Réel
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 text-sm font-medium">Live</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Nouveaux Terrains
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                  <div>
                    <p className="font-medium text-blue-900">Parcelle Premium - Dakar</p>
                    <p className="text-blue-700 text-sm">500m² - 45,000,000 FCFA</p>
                  </div>
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Nouveau</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <div>
                    <p className="font-medium text-green-900">Terrain Résidentiel - Thiès</p>
                    <p className="text-green-700 text-sm">300m² - 28,000,000 FCFA</p>
                  </div>
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">5min</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-purple-600" />
                Nouveaux Projets
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                  <div>
                    <p className="font-medium text-purple-900">Résidence Les Jardins</p>
                    <p className="text-purple-700 text-sm">120 logements - Livraison 2025</p>
                  </div>
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Nouveau</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-600">
                  <div>
                    <p className="font-medium text-orange-900">Villa Moderne Complex</p>
                    <p className="text-orange-700 text-sm">50 villas - Pré-réservation</p>
                  </div>
                  <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">12min</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nouvelles des Plateformes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.195 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-indigo-600" />
              Actualités Plateforme
            </h2>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Toutes les nouvelles
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="ml-3 text-indigo-800 font-semibold">Nouvelle fonctionnalité</span>
              </div>
              <h3 className="font-bold text-indigo-900 mb-2">Calculateur ROI Avancé</h3>
              <p className="text-indigo-700 text-sm mb-3">Estimez vos retours sur investissement avec précision grâce à notre nouvel outil.</p>
              <span className="text-indigo-600 text-xs bg-indigo-100 px-2 py-1 rounded-full">Il y a 2h</span>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="ml-3 text-green-800 font-semibold">Sécurité renforcée</span>
              </div>
              <h3 className="font-bold text-green-900 mb-2">Authentification 2FA</h3>
              <p className="text-green-700 text-sm mb-3">Protection supplémentaire activée pour tous les comptes utilisateurs.</p>
              <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded-full">Il y a 6h</span>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <span className="ml-3 text-yellow-800 font-semibold">Statistiques marché</span>
              </div>
              <h3 className="font-bold text-yellow-900 mb-2">Tendances Q4 2024</h3>
              <p className="text-yellow-700 text-sm mb-3">Le marché immobilier sénégalais en hausse de 15% ce trimestre.</p>
              <span className="text-yellow-600 text-xs bg-yellow-100 px-2 py-1 rounded-full">Hier</span>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="ml-3 text-purple-800 font-semibold">Communauté</span>
              </div>
              <h3 className="font-bold text-purple-900 mb-2">10 000+ Utilisateurs</h3>
              <p className="text-purple-700 text-sm mb-3">Notre communauté grandit ! Merci de votre confiance.</p>
              <span className="text-purple-600 text-xs bg-purple-100 px-2 py-1 rounded-full">Il y a 2j</span>
            </div>
          </div>
        </motion.div>

        {/* Centre de Notifications Ultra-Moderne */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        >
          {/* Header avec actions avancées */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-7 h-7 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{notifications.filter(n => !n.read).length}</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Centre de Notifications</h2>
                  <p className="text-gray-600 text-sm">Gérez tous vos alertes en temps réel</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1 animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{notifications.filter(n => n.type === 'urgent').length} urgentes</span>
                </button>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium">
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigate('/notifications')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-1"
                >
                  <span>Tout voir</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Filtres rapides */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Toutes ({notifications.length})</span>
                </span>
              </button>
              <button className="bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium border border-red-200 hover:bg-red-100">
                <span className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Urgentes ({notifications.filter(n => n.type === 'urgent').length})</span>
                </span>
              </button>
              <button className="bg-gray-50 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-100">
                Non lues ({notifications.filter(n => !n.read).length})
              </button>
              <button className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200 hover:bg-green-100">
                Aujourd'hui ({notifications.filter(n => n.time.includes('min') || n.time.includes('heure')).length})
              </button>
            </div>
            
            {/* Métriques visuelles améliorées */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="relative bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-red-600 text-3xl font-bold mb-1">2</div>
                    <div className="text-red-700 text-xs font-semibold">Actions Urgentes</div>
                  </div>
                  <div className="bg-red-200 p-2 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-red-400 rounded-b-xl"></div>
              </div>
              
              <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-blue-600 text-3xl font-bold mb-1">5</div>
                    <div className="text-blue-700 text-xs font-semibold">Messages</div>
                  </div>
                  <div className="bg-blue-200 p-2 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-400 rounded-b-xl"></div>
              </div>
              
              <div className="relative bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-green-600 text-3xl font-bold mb-1">3</div>
                    <div className="text-green-700 text-xs font-semibold">Transactions</div>
                  </div>
                  <div className="bg-green-200 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-green-400 rounded-b-xl"></div>
              </div>
              
              <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-purple-600 text-3xl font-bold mb-1">4</div>
                    <div className="text-purple-700 text-xs font-semibold">Documents</div>
                  </div>
                  <div className="bg-purple-200 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-purple-400 rounded-b-xl"></div>
              </div>
            </div>
            
            {/* Liste des notifications améliorée */}
            <div className="space-y-3">
              {notifications.slice(0, 4).map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`group flex items-start space-x-4 p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                    notification.type === 'urgent' ? 'bg-red-50 border-red-200 hover:bg-red-100' :
                    notification.type === 'success' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                    notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' :
                    'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`p-3 rounded-xl ${
                      notification.type === 'urgent' ? 'bg-red-200 text-red-700' :
                      notification.type === 'success' ? 'bg-green-200 text-green-700' :
                      notification.type === 'warning' ? 'bg-yellow-200 text-yellow-700' :
                      'bg-blue-200 text-blue-700'
                    }`}>
                      <notification.icon className="w-6 h-6" />
                    </div>
                    {!notification.read && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          notification.type === 'urgent' ? 'bg-red-200 text-red-800' :
                          notification.type === 'success' ? 'bg-green-200 text-green-800' :
                          notification.type === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                          'bg-blue-200 text-blue-800'
                        }`}>
                          {notification.type === 'urgent' ? 'URGENT' : 
                           notification.type === 'success' ? 'SUCCÈS' : 
                           notification.type === 'warning' ? 'ATTENTION' : 'INFO'}
                        </span>
                        <span className="text-gray-500 text-xs font-medium">
                          Il y a {notification.time}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    {notification.metadata && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {Object.entries(notification.metadata).map(([key, value]) => (
                          <span key={key} className="text-xs bg-white/70 text-gray-600 px-3 py-1 rounded-full border border-gray-200 font-medium">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {notification.actionRequired && (
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors">
                            <span>Action requise</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium">
                          Marquer lu
                        </button>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-all">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {notifications.length > 4 && (
                <div className="text-center pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => navigate('/notifications')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mx-auto transition-colors"
                  >
                    <span>Voir les {notifications.length - 4} autres notifications</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
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