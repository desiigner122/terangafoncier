import React, { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  Building2,
  Building,
  Briefcase,
  MapPin,
  Eye,
  Heart,
  Calendar,
  User,
  CreditCard,
  TrendingUp,
  Filter,
  Search,
  Bell,
  Settings,
  MessageSquare,
  Star,
  DollarSign,
  Percent,
  Clock,
  Shield,
  Zap,
  ChevronRight,
  Plus,
  BarChart3,
  PieChart
} from 'lucide-react';

// Lazy loading des composants
const ParticulierPropertiesModern = React.lazy(() => import('./components/ParticulierPropertiesModern'));
const ParticulierFavoritesModern = React.lazy(() => import('./components/ParticulierFavoritesModern'));
const ParticulierSearchModern = React.lazy(() => import('./components/ParticulierSearchModern'));
const ParticulierProfileModern = React.lazy(() => import('./components/ParticulierProfileModern'));

const ParticulierDashboardModern = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Données simulées
  const stats = {
    favoriteProperties: 24,
    viewedProperties: 187,
    savedSearches: 8,
    contactedAgents: 12,
    totalBudget: '450M FCFA',
    averagePrice: '18.7M FCFA',
    priceRange: '5M - 85M FCFA'
  };

  const recentActivity = [
    {
      id: 1,
      type: 'view',
      property: 'Villa moderne à Almadies',
      price: '85M FCFA',
      time: '2h',
      image: '/api/placeholder/100/100'
    },
    {
      id: 2,
      type: 'favorite',
      property: 'Appartement F4 aux Mamelles',
      price: '45M FCFA',
      time: '5h',
      image: '/api/placeholder/100/100'
    },
    {
      id: 3,
      type: 'contact',
      property: 'Bureau à Plateau',
      agent: 'Amadou Diallo',
      time: '1j',
      image: '/api/placeholder/100/100'
    }
  ];

  const propertyTypes = [
    { name: 'Villas', count: 45, icon: Home, color: 'text-emerald-600' },
    { name: 'Appartements', count: 87, icon: Building2, color: 'text-blue-600' },
    { name: 'Bureaux', count: 23, icon: Briefcase, color: 'text-purple-600' },
    { name: 'Studios', count: 34, icon: Building, color: 'text-orange-600' }
  ];

  const quickActions = [
    {
      name: 'Recherche Avancée',
      description: 'Trouvez votre bien idéal',
      icon: Search,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      action: () => setActiveTab('search')
    },
    {
      name: 'Mes Favoris',
      description: '24 biens sauvegardés',
      icon: Heart,
      color: 'bg-gradient-to-r from-pink-500 to-rose-500',
      action: () => setActiveTab('favorites')
    },
    {
      name: 'Visites Planifiées',
      description: '3 visites cette semaine',
      icon: Calendar,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
      action: () => {}
    },
    {
      name: 'Mon Profil',
      description: 'Gérer mes préférences',
      icon: User,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      action: () => setActiveTab('profile')
    }
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'properties':
        return (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-xl"></div>}>
            <ParticulierPropertiesModern />
          </Suspense>
        );
      case 'favorites':
        return (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-xl"></div>}>
            <ParticulierFavoritesModern />
          </Suspense>
        );
      case 'search':
        return (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-xl"></div>}>
            <ParticulierSearchModern />
          </Suspense>
        );
      case 'profile':
        return (
          <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-xl"></div>}>
            <ParticulierProfileModern />
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.header 
        className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Dashboard Particulier</h1>
                  <p className="text-sm text-gray-600">Trouvez votre bien immobilier idéal</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Blockchain Indicator */}
              <motion.div 
                className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Blockchain Sécurisé</span>
              </motion.div>

              {/* AI Assistant */}
              <motion.div 
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-indigo-100 px-3 py-2 rounded-lg cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Assistant IA</span>
              </motion.div>

              <motion.button
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </motion.button>

              <motion.button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Biens Favoris</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.favoriteProperties}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +3 cette semaine
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Biens Vus</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.viewedProperties}</p>
                    <p className="text-sm text-blue-600 flex items-center mt-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Ce mois-ci
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Budget Moyen</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.averagePrice}</p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {stats.priceRange}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Agents Contactés</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.contactedAgents}</p>
                    <p className="text-sm text-purple-600 flex items-center mt-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Réponse moyenne: 2h
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions Rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.name}
                    className={`${action.color} p-6 rounded-2xl text-white text-left group hover:shadow-xl transition-all duration-300`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.action}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <action.icon className="h-8 w-8 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold text-lg mb-2">{action.name}</h3>
                    <p className="text-white/80 text-sm">{action.description}</p>
                    <ChevronRight className="h-5 w-5 mt-3 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Property Types Overview */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Types de Biens Disponibles</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {propertyTypes.map((type, index) => (
                      <motion.div
                        key={type.name}
                        className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <type.icon className={`h-8 w-8 ${type.color} mr-4`} />
                        <div>
                          <p className="font-semibold text-gray-900">{type.name}</p>
                          <p className="text-sm text-gray-600">{type.count} disponibles</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Activité Récente</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {activity.property}
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.type === 'view' && 'Consulté'}
                          {activity.type === 'favorite' && 'Ajouté aux favoris'}
                          {activity.type === 'contact' && `Contact: ${activity.agent}`}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex space-x-2 overflow-x-auto">
                {[
                  { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
                  { id: 'search', name: 'Recherche', icon: Search },
                  { id: 'properties', name: 'Biens', icon: Building2 },
                  { id: 'favorites', name: 'Favoris', icon: Heart },
                  { id: 'profile', name: 'Profil', icon: User }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab !== 'overview' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ParticulierDashboardModern;