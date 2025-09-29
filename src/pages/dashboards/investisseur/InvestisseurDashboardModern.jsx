import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Target,
  Building2,
  Calculator,
  Eye,
  Search,
  Bell,
  User,
  Menu,
  X,
  Briefcase,
  Activity,
  Lightbulb,
  Star,
  Award,
  Heart,
  MessageCircle,
  Settings,
  LogOut,
  ChevronRight,
  Brain,
  Blocks,
  FileText
} from 'lucide-react';

// Lazy loading des composants
const InvestisseurPortfolio = React.lazy(() => import('./InvestisseurPortfolio'));
const InvestisseurPortfolioModern = React.lazy(() => import('./InvestisseurPortfolioModern'));
const InvestisseurOpportunites = React.lazy(() => import('./InvestisseurOpportunites'));
const InvestisseurAnalytics = React.lazy(() => import('./InvestisseurAnalytics'));
const InvestisseurCalculateurs = React.lazy(() => import('./InvestisseurCalculateurs'));
const InvestisseurMessages = React.lazy(() => import('./InvestisseurMessages'));
const InvestisseurSettings = React.lazy(() => import('./InvestisseurSettings'));

const InvestisseurDashboardModern = () => {
  const [activeView, setActiveView] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Données du dashboard investisseur
  const dashboardStats = {
    portfolioValue: 2850000000, // 2.85 milliards FCFA
    monthlyReturn: 12.8,
    activeInvestments: 24,
    totalROI: 34.5,
    availableCash: 450000000, // 450 millions FCFA
    opportunitiesWatched: 18
  };

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'portfolio', label: 'Portefeuille', icon: Briefcase },
    { id: 'opportunities', label: 'Opportunités', icon: Target },
    { id: 'analytics', label: 'Analyses', icon: PieChart },
    { id: 'calculators', label: 'Calculateurs', icon: Calculator },
    { id: 'ai', label: 'IA Investissement', icon: Brain },
    { id: 'blockchain', label: 'Blockchain', icon: Blocks },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'portfolio':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <InvestisseurPortfolioModern />
          </Suspense>
        );
      case 'opportunities':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <InvestisseurOpportunites />
          </Suspense>
        );
      case 'analytics':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <InvestisseurAnalytics />
          </Suspense>
        );
      case 'calculators':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <InvestisseurCalculateurs />
          </Suspense>
        );
      case 'messages':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <InvestisseurMessages />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <InvestisseurSettings />
          </Suspense>
        );
      default:
        return <OverviewContent stats={dashboardStats} formatCurrency={formatCurrency} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full bg-white/80 backdrop-blur-sm border-r border-white/20 shadow-xl z-50 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
        style={{ width: '280px' }}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Investisseur
                </h1>
                <p className="text-sm text-gray-500">Dashboard Pro</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {activeView === item.id && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Mamadou Seck</p>
                <p className="text-xs text-gray-600">Investisseur Premium</p>
              </div>
            </div>
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:ml-80 flex-1">
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {menuItems.find(item => item.id === activeView)?.label || 'Vue d\'ensemble'}
                </h2>
                <p className="text-gray-600">Gestion intelligente de votre portefeuille</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-white/60 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button className="relative p-2 rounded-lg hover:bg-blue-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Composant Vue d'ensemble
const OverviewContent = ({ stats, formatCurrency }) => {
  const opportunities = [
    {
      id: 1,
      title: 'Résidence Les Almadies',
      location: 'Almadies, Dakar',
      roi: 18.5,
      investment: 150000000,
      category: 'Résidentiel',
      risk: 'Faible',
      duration: '24 mois'
    },
    {
      id: 2,
      title: 'Centre Commercial Plateau',
      location: 'Plateau, Dakar',
      roi: 22.3,
      investment: 350000000,
      category: 'Commercial',
      risk: 'Moyen',
      duration: '36 mois'
    },
    {
      id: 3,
      title: 'Lotissement Saly Beach',
      location: 'Saly, Mbour',
      roi: 15.2,
      investment: 80000000,
      category: 'Foncier',
      risk: 'Faible',
      duration: '18 mois'
    }
  ];

  const portfolioData = [
    { name: 'Résidentiel', value: 45, color: '#3B82F6' },
    { name: 'Commercial', value: 30, color: '#8B5CF6' },
    { name: 'Foncier', value: 25, color: '#06B6D4' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <Briefcase className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-700">{formatCurrency(stats.portfolioValue).slice(0, -8)}Md</span>
          </div>
          <p className="text-blue-600 text-sm font-medium mt-1">Valeur Portefeuille</p>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-700">{stats.monthlyReturn}%</span>
          </div>
          <p className="text-green-600 text-sm font-medium mt-1">Rendement Mensuel</p>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <Building2 className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-700">{stats.activeInvestments}</span>
          </div>
          <p className="text-purple-600 text-sm font-medium mt-1">Investissements Actifs</p>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <Award className="w-8 h-8 text-orange-600" />
            <span className="text-2xl font-bold text-orange-700">{stats.totalROI}%</span>
          </div>
          <p className="text-orange-600 text-sm font-medium mt-1">ROI Total</p>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <DollarSign className="w-8 h-8 text-emerald-600" />
            <span className="text-2xl font-bold text-emerald-700">{formatCurrency(stats.availableCash).slice(0, -8)}M</span>
          </div>
          <p className="text-emerald-600 text-sm font-medium mt-1">Liquidités</p>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <Target className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-700">{stats.opportunitiesWatched}</span>
          </div>
          <p className="text-indigo-600 text-sm font-medium mt-1">Opportunités Suivies</p>
        </motion.div>
      </div>

      {/* Opportunités d'investissement */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2 text-blue-600" />
            Opportunités Recommandées
          </h3>
          <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
            Voir toutes <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="grid gap-4">
          {opportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">{opportunity.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{opportunity.location}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-600 font-semibold">ROI: {opportunity.roi}%</span>
                    <span className="text-gray-600">Durée: {opportunity.duration}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      opportunity.risk === 'Faible' ? 'bg-green-100 text-green-800' :
                      opportunity.risk === 'Moyen' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {opportunity.risk}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{formatCurrency(opportunity.investment).slice(0, -8)}M</p>
                  <p className="text-xs text-gray-500">{opportunity.category}</p>
                  <button className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                    Analyser
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Portfolio Distribution */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <PieChart className="w-6 h-6 mr-2 text-purple-600" />
          Répartition du Portefeuille
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {portfolioData.map((item, index) => (
            <div key={item.name} className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={item.color}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${item.value * 3.52} 352`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: item.color }}>
                    {item.value}%
                  </span>
                </div>
              </div>
              <h4 className="font-semibold text-gray-800">{item.name}</h4>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InvestisseurDashboardModern;