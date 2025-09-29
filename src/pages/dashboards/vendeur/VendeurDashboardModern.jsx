import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Building2,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Plus,
  Star,
  Eye,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  TrendingUp,
  Camera,
  Edit,
  Share2,
  Clock,
  CheckCircle,
  Bell,
  Search,
  Filter,
  Calendar,
  CreditCard,
  Award,
  Target,
  Activity,
  Crown,
  Zap,
  Brain,
  Shield,
  Menu,
  X,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// Import des composants CRM et Communication
const VendeurCRM = React.lazy(() => import('./VendeurCRM'));
const VendeurCommunication = React.lazy(() => import('./VendeurCommunication'));

const VendeurDashboardModern = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Données du vendeur
  const vendeurData = {
    profile: {
      name: 'Amadou Diallo',
      status: 'Vendeur Pro',
      rating: 4.9,
      totalSales: 127,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      badge: 'gold'
    },
    stats: {
      totalProperties: 18,
      activeListings: 12,
      soldThisMonth: 6,
      totalRevenue: 485000000,
      monthlyViews: 2847,
      inquiriesThisWeek: 24
    },
    properties: [
      {
        id: 1,
        title: 'Villa Moderne Almadies',
        location: 'Almadies, Dakar',
        price: 125000000,
        size: '450m²',
        status: 'Actif',
        views: 342,
        inquiries: 18,
        photos: 15,
        type: 'Villa',
        priority: 'high',
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=250&fit=crop'
      },
      {
        id: 2,
        title: 'Appartement Standing Plateau',
        location: 'Plateau, Dakar',
        price: 85000000,
        size: '120m²',
        status: 'Actif',
        views: 198,
        inquiries: 12,
        photos: 10,
        type: 'Appartement',
        priority: 'medium',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop'
      },
      {
        id: 3,
        title: 'Terrain Commercial Liberté 6',
        location: 'Liberté 6, Dakar',
        price: 65000000,
        size: '600m²',
        status: 'En négociation',
        views: 156,
        inquiries: 8,
        photos: 8,
        type: 'Terrain',
        priority: 'medium',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop'
      }
    ],
    prospects: [
      {
        id: 1,
        name: 'Fatou Sall',
        email: 'fatou.sall@email.com',
        phone: '+221 77 234 56 78',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c3e9a3?w=80&h=80&fit=crop&crop=face',
        interest: 'Villa Almadies',
        budget: '100-150M',
        score: 85,
        status: 'Chaud'
      },
      {
        id: 2,
        name: 'Moussa Diop',
        email: 'moussa.diop@email.com',
        phone: '+221 76 345 67 89',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
        interest: 'Appartement Plateau',
        budget: '80-100M',
        score: 65,
        status: 'Tiède'
      }
    ]
  };

  // Navigation du sidebar
  const navigation = [
    { id: 'dashboard', name: 'Tableau de bord', icon: Home, badge: null },
    { id: 'properties', name: 'Mes Biens', icon: Building2, badge: vendeurData.stats.activeListings },
    { id: 'crm', name: 'CRM Prospects', icon: Users, badge: vendeurData.prospects.length },
    { id: 'communication', name: 'Communication', icon: MessageSquare, badge: 8 },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, badge: null },
    { id: 'settings', name: 'Paramètres', icon: Settings, badge: null }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Actif': 'bg-green-100 text-green-800',
      'En négociation': 'bg-yellow-100 text-yellow-800',
      'Vendu': 'bg-blue-100 text-blue-800',
      'Suspendu': 'bg-gray-100 text-gray-800',
      'Chaud': 'bg-red-100 text-red-800',
      'Tiède': 'bg-yellow-100 text-yellow-800',
      'Froid': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'border-l-red-500',
      'medium': 'border-l-yellow-500',
      'low': 'border-l-green-500'
    };
    return colors[priority] || 'border-l-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 font-medium">Chargement de votre espace vendeur...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed left-0 top-0 h-full w-80 bg-white/80 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -320 }}
      >
        {/* Header du sidebar */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={vendeurData.profile.avatar}
                  alt={vendeurData.profile.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-200"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{vendeurData.profile.name}</h3>
                <p className="text-sm text-orange-600 font-medium">{vendeurData.profile.status}</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Rating */}
          <div className="mt-4 flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(vendeurData.profile.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-600">
              {vendeurData.profile.rating} ({vendeurData.profile.totalSales} ventes)
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/60 hover:text-orange-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  activeTab === item.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Widget IA */}
        <div className="m-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Assistant IA</span>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            Optimisez vos annonces avec l'intelligence artificielle
          </p>
          <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
            <Zap className="w-4 h-4 inline mr-1" />
            Analyser maintenant
          </button>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div className="lg:ml-80">
        {/* Header */}
        <motion.header 
          className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-30"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Dashboard Vendeur
                  </h1>
                  <p className="text-gray-600">Gérez vos biens et prospects efficacement</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 bg-white/60 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <button className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Contenu des onglets */}
        <div className={activeTab === 'communication' ? '' : 'p-6'}>
          {activeTab === 'dashboard' && <DashboardContent vendeurData={vendeurData} formatCurrency={formatCurrency} />}
          {activeTab === 'properties' && <PropertiesContent properties={vendeurData.properties} formatCurrency={formatCurrency} getStatusColor={getStatusColor} getPriorityColor={getPriorityColor} />}
          {activeTab === 'crm' && <CRMContent />}
          {activeTab === 'communication' && <CommunicationContent />}
          {activeTab === 'analytics' && <AnalyticsContent vendeurData={vendeurData} formatCurrency={formatCurrency} />}
          {activeTab === 'settings' && <SettingsContent />}
        </div>
      </div>
    </div>
  );
};

// Composant Dashboard
const DashboardContent = ({ vendeurData, formatCurrency }) => (
  <div className="space-y-6">
    {/* Statistiques */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Biens Actifs</p>
            <p className="text-3xl font-bold text-orange-600">{vendeurData.stats.activeListings}</p>
            <p className="text-sm text-green-600">+2 ce mois</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-xl">
            <Building2 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Ventes Mois</p>
            <p className="text-3xl font-bold text-green-600">{vendeurData.stats.soldThisMonth}</p>
            <p className="text-sm text-green-600">+15% vs prev</p>
          </div>
          <div className="bg-green-100 p-3 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Vues Mois</p>
            <p className="text-3xl font-bold text-blue-600">{vendeurData.stats.monthlyViews}</p>
            <p className="text-sm text-green-600">+8% vs prev</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl">
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Revenus</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(vendeurData.stats.totalRevenue)}</p>
            <p className="text-sm text-green-600">+12% vs prev</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-xl">
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </motion.div>
    </div>

    {/* Biens récents et prospects */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Biens récents */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Biens Performants</h3>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {vendeurData.properties.slice(0, 3).map((property) => (
            <div key={property.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <img
                src={property.image}
                alt={property.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{property.title}</h4>
                <p className="text-sm text-gray-600">{property.location}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-orange-600 font-bold">{formatCurrency(property.price)}</span>
                  <span className="text-xs text-gray-500">• {property.views} vues</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Prospects chauds */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Prospects Chauds</h3>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {vendeurData.prospects.map((prospect) => (
            <div key={prospect.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <img
                src={prospect.avatar}
                alt={prospect.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">{prospect.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    prospect.status === 'Chaud' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prospect.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{prospect.interest}</p>
                <p className="text-sm text-orange-600 font-medium">{prospect.budget}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

// Composant Properties
const PropertiesContent = ({ properties, formatCurrency, getStatusColor, getPriorityColor }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">Mes Biens Immobiliers</h2>
      <div className="flex space-x-3">
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/60 border border-gray-200 rounded-lg hover:bg-white transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filtrer</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all">
          <Plus className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </div>
    </div>

    <div className="grid gap-6">
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-l-4 ${getPriorityColor(property.priority)} border-t border-r border-b border-white/20`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start space-x-6">
            <img
              src={property.image}
              alt={property.title}
              className="w-32 h-24 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </span>
                    <span>{property.size}</span>
                    <span>{property.type}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(property.price)}</p>
                  <p className="text-xs text-gray-500">Prix</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">{property.views}</p>
                  <p className="text-xs text-gray-500">Vues</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">{property.inquiries}</p>
                  <p className="text-xs text-gray-500">Demandes</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600">{property.photos}</p>
                  <p className="text-xs text-gray-500">Photos</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>Voir</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Publié le {new Date(property.datePosted || '2024-03-10').toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Composant Prospects
const ProspectsContent = ({ prospects, getStatusColor }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">Gestion des Prospects</h2>
      <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg">
        <Plus className="w-4 h-4" />
        <span>Nouveau Prospect</span>
      </button>
    </div>

    <div className="grid gap-6">
      {prospects.map((prospect, index) => (
        <motion.div
          key={prospect.id}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start space-x-6">
            <img
              src={prospect.avatar}
              alt={prospect.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{prospect.name}</h3>
                  <p className="text-gray-600">{prospect.interest}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prospect.status)}`}>
                    {prospect.status}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{prospect.score}/100</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold text-orange-600">{prospect.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{prospect.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-medium">{prospect.phone}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>RDV</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Composant Messages (placeholder)
const MessagesContent = () => (
  <div className="text-center py-12">
    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Centre de Messages</h3>
    <p className="text-gray-600">Fonctionnalité en cours de développement</p>
  </div>
);

// Composant Analytics (placeholder)
const AnalyticsContent = ({ vendeurData, formatCurrency }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Analytics & Performance</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Performance Globale</h3>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Taux de conversion</span>
            <span className="font-semibold">12.5%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Temps moyen vente</span>
            <span className="font-semibold">45 jours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Satisfaction client</span>
            <span className="font-semibold">4.9/5</span>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Revenus</h3>
          <DollarSign className="w-5 h-5 text-green-500" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Ce mois</span>
            <span className="font-semibold">{formatCurrency(45000000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mois dernier</span>
            <span className="font-semibold">{formatCurrency(38000000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Évolution</span>
            <span className="font-semibold text-green-600">+18%</span>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Activité</h3>
          <Activity className="w-5 h-5 text-blue-500" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Vues totales</span>
            <span className="font-semibold">{vendeurData.stats.monthlyViews}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nouvelles demandes</span>
            <span className="font-semibold">{vendeurData.stats.inquiriesThisWeek}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Taux d'engagement</span>
            <span className="font-semibold">8.4%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composant CRM
const CRMContent = () => (
  <div className="-m-6">
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <VendeurCRM />
    </Suspense>
  </div>
);

// Composant Communication
const CommunicationContent = () => (
  <div className="-m-6 h-screen">
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <VendeurCommunication />
    </Suspense>
  </div>
);

// Composant Settings (placeholder)
const SettingsContent = () => (
  <div className="text-center py-12">
    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Paramètres</h3>
    <p className="text-gray-600">Configuration du compte en cours de développement</p>
  </div>
);

export default VendeurDashboardModern;