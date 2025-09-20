import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  PlusCircle, 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart,
  MessageSquare,
  Calendar,
  DollarSign,
  FileText,
  Users,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { Badge } from '@/components/ui/badge';

const ModernVendeurDashboard = () => {
  console.log('🏢 ModernVendeurDashboard component initializing...');
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management pour les données du vendeur
  const [dashboardData, setDashboardData] = useState({
    totalProperties: 12,
    activeListing: 8,
    soldProperties: 4,
    totalRevenue: 450000000, // 450M FCFA
    monthlyViews: 234,
    inquiries: 18,
    scheduledVisits: 5
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      icon: Eye,
      title: "Nouvelle visite programmée",
      message: "Terrain Almadies - Visite prévue demain 14h",
      time: "Il y a 2h",
      type: "visit",
      status: "info"
    },
    {
      id: 2,
      icon: MessageSquare,
      title: "Nouvelle demande de contact",
      message: "Client intéressé par votre terrain à Sacré-Cœur",
      time: "Il y a 4h",
      type: "inquiry",
      status: "success"
    },
    {
      id: 3,
      icon: DollarSign,
      title: "Négociation en cours",
      message: "Offre reçue pour terrain Plateau - 85M FCFA",
      time: "Il y a 6h",
      type: "offer",
      status: "warning"
    },
    {
      id: 4,
      icon: CheckCircle,
      title: "Vente finalisée",
      message: "Terrain résidentiel Mermoz vendu avec succès",
      time: "Hier",
      type: "sale",
      status: "success"
    }
  ]);

  const [myProperties, setMyProperties] = useState([
    { id: 1, title: "Terrain Almadies", price: "125M", status: "Disponible", views: 45, inquiries: 8 },
    { id: 2, title: "Parcelle Sacré-Cœur", price: "95M", status: "En négociation", views: 32, inquiries: 5 },
    { id: 3, title: "Terrain Plateau", price: "110M", status: "Visite programmée", views: 28, inquiries: 3 },
    { id: 4, title: "Lot Mermoz", price: "80M", status: "Vendu", views: 67, inquiries: 12 }
  ]);

  // Actions spécifiques pour le vendeur
  const quickActions = [
    { 
      icon: PlusCircle, 
      title: 'Nouveau Terrain', 
      description: 'Ajouter une propriété',
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/dashboard/add-parcel')
    },
    { 
      icon: BarChart3, 
      title: 'Statistiques', 
      description: 'Performance des ventes',
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/dashboard/analytics')
    },
    { 
      icon: Users, 
      title: 'Mes Clients', 
      description: 'Gestion des contacts',
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/dashboard/clients')
    },
    { 
      icon: Calendar, 
      title: 'Planning', 
      description: 'Visites et RDV',
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => navigate('/dashboard/calendar')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec statistiques importantes */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                  Dashboard Vendeur
                </h1>
                <p className="text-sm text-gray-600">
                  Gérez vos annonces et suivez vos performances de vente
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {(dashboardData.totalRevenue / 1000000).toFixed(0)}M FCFA
                  </div>
                  <div className="text-xs text-gray-500">Revenus totaux</div>
                </div>
              </div>
            </div>

            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{dashboardData.totalProperties}</div>
                    <div className="text-orange-100 text-xs">Propriétés totales</div>
                  </div>
                  <Building className="w-6 h-6 text-orange-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{dashboardData.activeListing}</div>
                    <div className="text-green-100 text-xs">Annonces actives</div>
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{dashboardData.monthlyViews}</div>
                    <div className="text-blue-100 text-xs">Vues ce mois</div>
                  </div>
                  <Eye className="w-6 h-6 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{dashboardData.inquiries}</div>
                    <div className="text-purple-100 text-xs">Demandes reçues</div>
                  </div>
                  <MessageSquare className="w-6 h-6 text-purple-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${action.color} rounded-lg p-4 text-white cursor-pointer shadow-md hover:shadow-lg transition-all`}
                onClick={action.onClick}
              >
                <action.icon className="w-6 h-6 mb-2" />
                <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                <p className="text-xs opacity-90">{action.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activité Récente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
          >
            <div className="bg-indigo-50 px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-md font-semibold text-gray-800">Activité Récente</h2>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/activity')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Voir tout →
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  >
                    <div className={`flex-shrink-0 p-2 rounded-lg ${
                      activity.status === 'success' ? 'bg-green-100 text-green-600' :
                      activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Mes Propriétés */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
          >
            <div className="bg-green-50 px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-green-600" />
                  <h2 className="text-md font-semibold text-gray-800">Mes Propriétés</h2>
                  <Badge className="bg-green-500 text-white text-xs">{myProperties.length}</Badge>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/my-listings')}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  Gérer tout →
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                {myProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{property.title}</p>
                        <p className="text-xs text-gray-500">{property.price} FCFA</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-1 ${
                        property.status === 'Disponible' ? 'bg-green-100 text-green-700' :
                        property.status === 'En négociation' ? 'bg-yellow-100 text-yellow-700' :
                        property.status === 'Visite programmée' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {property.status}
                      </span>
                      <div className="text-xs text-gray-500">
                        {property.views} vues • {property.inquiries} demandes
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ModernVendeurDashboard;