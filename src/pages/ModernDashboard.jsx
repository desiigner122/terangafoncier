import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Heart, 
  Bell, 
  Settings, 
  TrendingUp, 
  Calendar,
  CreditCard,
  Users,
  Building,
  DollarSign,
  Activity,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const ModernDashboard = () => {
  const [user] = useState({
    name: 'Amadou Diallo',
    email: 'amadou.diallo@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    role: 'Particulier',
    memberSince: '2024'
  });

  const [stats] = useState({
    favoriteProperties: 12,
    viewedProperties: 45,
    savedSearches: 8,
    notifications: 3,
    totalSpent: 0,
    activeRequests: 2
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'view',
      title: 'Terrain de 500m² à Almadies',
      description: 'Consulté il y a 2 heures',
      price: '75,000,000 FCFA',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 2,
      type: 'favorite',
      title: 'Villa moderne à Fann Résidence',
      description: 'Ajouté aux favoris il y a 1 jour',
      price: '450,000,000 FCFA',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 3,
      type: 'search',
      title: 'Recherche: Terrains à Diamniadio',
      description: 'Sauvegardé il y a 3 jours',
      price: '15 résultats trouvés',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80'
    }
  ]);

  const [quickActions] = useState([
    {
      title: 'Rechercher un bien',
      description: 'Trouvez le terrain ou la propriété idéale',
      icon: Search,
      color: 'bg-blue-500',
      link: '/parcelles'
    },
    {
      title: 'Vendre un bien',
      description: 'Mettez votre propriété en vente',
      icon: Plus,
      color: 'bg-green-500',
      link: '/sell-property'
    },
    {
      title: 'Mes favoris',
      description: 'Consultez vos biens sauvegardés',
      icon: Heart,
      color: 'bg-red-500',
      link: '/dashboard/favorites'
    },
    {
      title: 'Paramètres',
      description: 'Gérez votre compte et préférences',
      icon: Settings,
      color: 'bg-gray-500',
      link: '/dashboard/settings'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-6 h-6" />
                {stats.notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.notifications}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Bienvenue, {user.name.split(' ')[0]} !</h2>
            <p className="text-blue-100 mb-6">
              Gérez vos biens immobiliers et découvrez de nouvelles opportunités
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Heart className="w-8 h-8 text-blue-200 mb-2" />
                <p className="text-2xl font-bold">{stats.favoriteProperties}</p>
                <p className="text-sm text-blue-200">Favoris</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Eye className="w-8 h-8 text-blue-200 mb-2" />
                <p className="text-2xl font-bold">{stats.viewedProperties}</p>
                <p className="text-sm text-blue-200">Vues</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Search className="w-8 h-8 text-blue-200 mb-2" />
                <p className="text-2xl font-bold">{stats.savedSearches}</p>
                <p className="text-sm text-blue-200">Recherches</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Activity className="w-8 h-8 text-blue-200 mb-2" />
                <p className="text-2xl font-bold">{stats.activeRequests}</p>
                <p className="text-sm text-blue-200">Demandes</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Actions Rapides</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Activité Récente</h3>
                <Link to="/dashboard/activity" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir tout
                </Link>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                      index !== recentActivities.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-sm font-medium text-blue-600 mt-2">{activity.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {activity.type === 'view' && <Eye className="w-5 h-5 text-blue-500" />}
                      {activity.type === 'favorite' && <Heart className="w-5 h-5 text-red-500" />}
                      {activity.type === 'search' && <Search className="w-5 h-5 text-green-500" />}
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Market Trends */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Tendances du Marché</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Dakar Centre</p>
                      <p className="text-sm text-gray-600">Prix moyen m²</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">150,000 FCFA</p>
                      <div className="flex items-center gap-1 text-green-600">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-sm">+5.2%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Almadies</p>
                      <p className="text-sm text-gray-600">Prix moyen m²</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">180,000 FCFA</p>
                      <div className="flex items-center gap-1 text-green-600">
                        <ArrowUpRight className="w-4 h-4" />
                        <span className="text-sm">+3.8%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Pikine</p>
                      <p className="text-sm text-gray-600">Prix moyen m²</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">85,000 FCFA</p>
                      <div className="flex items-center gap-1 text-red-600">
                        <ArrowDownRight className="w-4 h-4" />
                        <span className="text-sm">-1.2%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recommended Properties */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recommandé pour vous</h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <img
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
                    alt="Propriété recommandée"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900">Terrain de 300m² à Diamniadio</h4>
                    <p className="text-sm text-gray-600 mt-1">Zone en développement rapide</p>
                    <p className="text-lg font-bold text-blue-600 mt-2">25,000,000 FCFA</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">4.8 (24 avis)</span>
                    </div>
                    <Link
                      to="/parcelles/123"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-4 block text-center"
                    >
                      Voir les détails
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
