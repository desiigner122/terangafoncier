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
import { Badge } from '@/components/ui/badge';

const ModernAcheteurDashboard = () => {
  console.log('🚀 ModernAcheteurDashboard component initializing...');
  
  // Hooks standards
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management pour les données dynamiques
  const [dashboardData, setDashboardData] = useState({
    totalProperties: 45,
    savedFavorites: 12,
    activeRequests: 5,
    completedTransactions: 3,
    monthlyProgress: 78,
    estimatedValue: 85000000 // 85M FCFA
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: CheckCircle,
      title: "Terrain Almadies validé",
      message: "Votre demande de terrain a été approuvée par la commission",
      time: "Il y a 2h",
      type: "success",
      read: false,
      metadata: { category: "Validation", priority: "Haute", action: "Voir détails" }
    },
    {
      id: 2,
      icon: AlertTriangle,
      title: "Document manquant",
      message: "Veuillez compléter votre dossier pour la parcelle Plateau",
      time: "Il y a 4h",
      type: "urgent",
      read: false,
      metadata: { category: "Document", priority: "Critique", action: "Compléter" }
    },
    {
      id: 3,
      icon: Info,
      title: "Nouveau terrain disponible",
      message: "3 nouveaux terrains correspondent à vos critères à Sacré-Cœur",
      time: "Il y a 6h",
      type: "info",
      read: false,
      metadata: { category: "Opportunité", priority: "Normale", action: "Explorer" }
    },
    {
      id: 4,
      icon: DollarSign,
      title: "Financement approuvé",
      message: "Votre demande de crédit de 25M FCFA a été acceptée",
      time: "Hier",
      type: "success",
      read: true,
      metadata: { category: "Finance", priority: "Haute", action: "Voir contrat" }
    }
  ]);

  const [requests, setRequests] = useState([
    { id: 1, title: "Demande terrain Almadies", status: "En cours", progress: 75, type: "Construction", date: "15/03/2024" },
    { id: 2, title: "Financement Sacré-Cœur", status: "En attente", progress: 45, type: "Financement", date: "18/03/2024" },
    { id: 3, title: "Visite Plateau", status: "Programmée", progress: 30, type: "Visite", date: "20/03/2024" }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, action: "Connexion système", timestamp: "10:30", type: "security", details: "Connexion réussie depuis Dakar" },
    { id: 2, action: "Document uploadé", timestamp: "09:45", type: "document", details: "Titre de propriété ajouté" },
    { id: 3, action: "Recherche effectuée", timestamp: "09:20", type: "activity", details: "Filtres: Almadies, 500m²-1000m²" },
    { id: 4, action: "Favori ajouté", timestamp: "08:55", type: "favorite", details: "Terrain résidentiel Plateau" }
  ]);

  // Quick actions pour navigation rapide
  const quickActions = [
    { 
      icon: Search, 
      title: "Rechercher", 
      description: "Terrains disponibles",
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => navigate('/search')
    },
    { 
      icon: Heart, 
      title: "Mes Favoris", 
      description: "12 terrains sauvés",
      color: "bg-red-500 hover:bg-red-600",
      onClick: () => navigate('/favorites')
    },
    { 
      icon: FileText, 
      title: "Mes Demandes", 
      description: "5 dossiers en cours",
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => navigate('/my-requests')
    },
    { 
      icon: Building2, 
      title: "Promoteurs", 
      description: "Projets disponibles",
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => navigate('/promoters')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                  Tableau de Bord Particulier
                </h1>
                <p className="text-sm text-gray-600">
                  Gérez vos achats immobiliers et suivez vos projets
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {(dashboardData.estimatedValue / 1000000).toFixed(1)}M FCFA
                  </div>
                  <div className="text-xs text-gray-500">Portfolio estimé</div>
                </div>
              </div>
            </div>

            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{dashboardData.totalProperties}</div>
                    <div className="text-blue-100 text-xs">Terrains explorés</div>
                  </div>
                  <Home className="w-6 h-6 text-blue-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{dashboardData.savedFavorites}</div>
                    <div className="text-red-100 text-xs">Favoris sauvés</div>
                  </div>
                  <Heart className="w-6 h-6 text-red-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{dashboardData.activeRequests}</div>
                    <div className="text-green-100 text-xs">Demandes actives</div>
                  </div>
                  <FileText className="w-6 h-6 text-green-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{dashboardData.completedTransactions}</div>
                    <div className="text-purple-100 text-xs">Achats complétés</div>
                  </div>
                  <CheckCircle className="w-6 h-6 text-purple-200" />
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
          {/* Centre de Notifications Simplifié */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
          >
            {/* Header simplifié */}
            <div className="bg-purple-50 px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-purple-600" />
                  <h2 className="text-md font-semibold text-gray-800">Notifications</h2>
                  {notifications.filter(n => !n.read).length > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">
                      {notifications.filter(n => !n.read).length}
                    </Badge>
                  )}
                </div>
                <button 
                  onClick={() => navigate('/notifications')}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Voir tout →
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification, index) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex-shrink-0">
                      <notification.icon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                ))}

                {notifications.length > 3 && (
                  <button 
                    onClick={() => navigate('/notifications')}
                    className="w-full mt-3 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all"
                  >
                    Voir {notifications.length - 3} autres notifications
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Mes Demandes - Version Simplifiée */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
          >
            {/* Header simplifié */}
            <div className="bg-indigo-50 px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-md font-semibold text-gray-800">Mes Demandes</h2>
                  <Badge className="bg-orange-500 text-white text-xs">5</Badge>
                </div>
                <button 
                  onClick={() => navigate('/my-requests')}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Gérer tout →
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Métriques simplifiées */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <div className="text-yellow-600 text-lg font-bold">3</div>
                  <div className="text-yellow-700 text-xs">En Attente</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                  <div className="text-blue-600 text-lg font-bold">2</div>
                  <div className="text-blue-700 text-xs">En Cours</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="text-green-600 text-lg font-bold">8</div>
                  <div className="text-green-700 text-xs">Terminées</div>
                </div>
              </div>

              {/* Liste des demandes récentes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Terrain Almadies</p>
                      <p className="text-xs text-gray-500">En attente de validation</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">2j</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Financement Banque</p>
                      <p className="text-xs text-gray-500">Dossier en cours d'étude</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">5j</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Documents Notariés</p>
                      <p className="text-xs text-gray-500">Complété avec succès</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">1sem</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Journal d'Activité Simplifié */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-lg shadow-md p-4 mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-600" />
              <h2 className="text-md font-semibold text-gray-800">Activité Récente</h2>
            </div>
            <button className="text-gray-500 hover:text-gray-700 text-sm">
              Voir tout
            </button>
          </div>

          <div className="space-y-2">
            {auditLogs.slice(0, 3).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1 rounded-full ${
                    log.type === 'security' ? 'bg-red-100 text-red-600' :
                    log.type === 'document' ? 'bg-blue-100 text-blue-600' :
                    log.type === 'activity' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {log.type === 'security' ? <Shield className="w-3 h-3" /> :
                     log.type === 'document' ? <Upload className="w-3 h-3" /> :
                     log.type === 'activity' ? <Search className="w-3 h-3" /> :
                     <Heart className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{log.action}</p>
                    <p className="text-xs text-gray-500">{log.details}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernAcheteurDashboard;