import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TerangaLogo from '../../../components/ui/TerangaLogo';
import { hybridDataService } from '../../../services/HybridDataService';
import ModernAdminOverview from '../../../components/admin/ModernAdminOverview';

// Import des nouvelles pages admin
import RevenueManagementPage from '../../admin/RevenueManagementPage';
import PropertyManagementPage from '../../admin/PropertyManagementPage';
import SupportTicketsPage from '../../admin/SupportTicketsPage';
import BulkExportPage from '../../admin/BulkExportPage';
import AdvancedSubscriptionManagementPage from '../../admin/AdvancedSubscriptionManagementPage';
import { 
  // Navigation Icons
  Home,
  Users,
  Building2,
  DollarSign,
  BarChart3,
  Flag,
  Settings,
  Bell,
  LogOut,
  User,
  
  // Content Icons
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  PieChart,
  Globe,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  UserCheck,
  UserX,
  Crown,
  FileText,
  MessageSquare,
  Activity,
  Target,
  Zap,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Monitor,
  Lock,
  Unlock,
  
  // UI Icons
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
// import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Link } from 'react-router-dom';

const CompleteSidebarAdminDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  // Initialisation des données dashboard
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      activeUsers: 0,
      totalProperties: 0,
      totalTransactions: 0,
      systemUptime: 0,
      monthlyRevenue: 0,
      pendingReports: 0,
      systemHealth: 0,
      totalBlogs: 0,
      publishedBlogs: 0,
      auditLogs: 0,
      notifications: 0,
      totalCommissions: 0,
      pendingPayments: 0
    },
    systemHealth: {
      server: {
        cpu: 45,
        memory: 68,
        disk: 72,
        network: 95
      },
      database: {
        connections: 128,
        maxConnections: 200,
        queryTime: 15,
        uptime: 99.9
      },
      apis: {
        supabase: 'online',
        payments: 'online',
        blockchain: 'maintenance',
        ai: 'online'
      }
    },
    financial: {
      monthlyRevenue: 0,
      totalTransactions: 0,
      avgTransactionValue: 0,
      revenueGrowth: 0
    }
  });

  // Navigation Items Configuration - NOUVELLES PAGES MODERNISÉES
  const navigationItems = [
    {
      id: 'overview',
      label: 'Vue d\'ensemble',
      icon: Home,
      description: 'Dashboard principal et statistiques',
      isInternal: true, // Reste sur cette page
      route: '/admin/dashboard'
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      icon: Users,
      description: 'Gestion complète avec IA et données réelles',
      badge: dashboardData.stats.totalUsers > 0 ? `${Math.floor(dashboardData.stats.totalUsers / 100)}k` : null,
      badgeColor: 'bg-blue-500',
      isInternal: false,
      route: '/admin/users'
    },
    {
      id: 'properties',
      label: 'Propriétés',
      icon: Building2,
      description: 'IA + NFT + Blockchain Ready',
      badge: dashboardData.stats.totalProperties > 0 ? `${Math.floor(dashboardData.stats.totalProperties / 100)}k` : null,
      badgeColor: 'bg-purple-500',
      isInternal: false,
      route: '/admin/properties'
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: DollarSign,
      description: 'Détection fraude IA + Blockchain',
      badge: dashboardData.stats.totalTransactions > 0 ? `${Math.floor(dashboardData.stats.totalTransactions / 100)}k` : null,
      badgeColor: 'bg-green-500',
      isInternal: false,
      route: '/admin/transactions'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Prédictions IA + Métriques temps réel',
      badge: 'IA',
      badgeColor: 'bg-indigo-500',
      isInternal: false,
      route: '/admin/analytics'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: Settings,
      description: 'Configuration IA + Blockchain + Mode Maintenance',
      badge: 'Config',
      badgeColor: 'bg-gray-500',
      isInternal: false,
      route: '/admin/settings'
    },
    // Sections administratives supplémentaires 
    {
      id: 'reports',
      label: 'Signalements',
      icon: Flag,
      description: 'Modération et signalements',
      badge: dashboardData.stats.pendingReports > 0 ? dashboardData.stats.pendingReports.toString() : null,
      badgeColor: 'bg-red-500',
      isInternal: false,
      route: '/admin/reports'
    },
    {
      id: 'revenue',
      label: 'Revenus',
      icon: DollarSign,
      description: 'Gestion financière et revenus',
      badge: 'NEW',
      badgeColor: 'bg-green-500',
      isInternal: false,
      route: '/admin/revenue'
    },
    {
      id: 'support',
      label: 'Support',
      icon: MessageSquare,
      description: 'Tickets et support client',
      badge: dashboardData.stats.supportTickets > 0 ? dashboardData.stats.supportTickets.toString() : null,
      badgeColor: 'bg-blue-500',
      isInternal: false,
      route: '/admin/support'
    },
    {
      id: 'audit',
      label: 'Audit & Logs',
      icon: Activity,
      description: 'Journaux d\'activité et audit',
      isInternal: false,
      route: '/admin/audit-log'
    },
    {
      id: 'system',
      label: 'Système',
      icon: Monitor,
      description: 'Configuration et monitoring',
      isInternal: true
    }
  ];

    // dashboardData est déjà initialisé plus haut

  // État pour les statistiques additionnelles
  const [additionalStats, setAdditionalStats] = useState({
    totalViews: 0,
    todayActions: 0,
    uniqueIPs: 0,
    diskUsage: 0,
    backupSize: '0 GB'
  });

  // Fonction pour générer des données de sauvegarde réalistes
  const generateBackupData = () => {
    const backups = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      backups.push({
        date: date.toLocaleString('fr-FR', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        type: i === 3 ? 'Base de données' : 'Complète',
        size: i === 3 ? `${Math.floor(Math.random() * 500 + 500)} MB` : `${(Math.random() * 1 + 1.5).toFixed(1)} GB`,
        status: 'Succès'
      });
    }
    return backups;
  };

  // Handlers pour les actions du dashboard
  const handleExport = (type) => {
    console.log(`📊 Export ${type} déclenché`);
    // TODO: Implémenter l'export réel
    alert(`Export ${type} en cours de développement`);
  };

  const handleFilter = (section) => {
    console.log(`🔍 Filtre ${section} déclenché`);
    // TODO: Implémenter le filtrage réel
    alert(`Filtrage ${section} en cours de développement`);
  };

  const handleAction = (action, item = null) => {
    console.log(`⚡ Action ${action} déclenchée`, item);
    // TODO: Implémenter les actions réelles
    alert(`Action ${action} en cours de développement`);
  };

  const handleRefresh = () => {
    console.log('🔄 Actualisation des données...');
    loadRealData();
  };

  // Fonction pour charger les vraies données hybrides (Supabase + API)
  const loadRealData = async () => {
    setLoadingData(true);
    try {
      console.log('🚀 Chargement données admin hybrides (Supabase + API)...');
      
      const result = await hybridDataService.getAdminDashboardData();
      
      if (result.success) {
        const data = result.data;
        
        setDashboardData(prevData => ({
          ...prevData,
          stats: {
            totalUsers: data.stats.totalUsers || 0,
            activeUsers: data.stats.activeUsers || 0,
            totalProperties: data.stats.totalProperties || 0,
            totalTransactions: data.stats.totalTransactions || 0,
            monthlyRevenue: data.stats.monthlyRevenue || 0,
            totalCommissions: data.stats.totalCommissions || 0,
            pendingPayments: data.stats.pendingPayments || 0,
            systemUptime: data.stats.systemUptime || 99.8,
            systemHealth: 98,
            totalBlogs: 0,
            publishedBlogs: 0,
            auditLogs: 0,
            notifications: 0,
            pendingReports: 0
          },
          // REMPLACEMENT DES DONNÉES MOCKÉES PAR VRAIES DONNÉES
          users: data.users || [],  // Vide si pas de données réelles
          blogPosts: [],            // Vide au lieu des données mockées
          auditLogs: [],            // Vide au lieu des données mockées
          systemAlerts: [],         // Vide au lieu des données mockées
          support: [],              // Vide au lieu des données mockées
          transactions: data.transactions || [],
          reports: [],              // Vide au lieu des données mockées
          // Mettre systemHealth à des valeurs réelles ou par défaut
          systemHealth: {
            server: { cpu: 0, memory: 0, disk: 0, network: 0 },
            database: { connections: 0, queries: 0, performance: 0 },
            security: { threats: 0, blocked: 0, score: 100 }
          }
        }));
        
        console.log('✅ Données hybrides chargées:', data.dataSource);
        
        // Charger les statistiques additionnelles basées sur les vraies données
        setAdditionalStats({
          totalViews: data.stats.totalUsers * 15, // Estimation basée sur les utilisateurs
          todayActions: Math.floor(Math.random() * 50), // Actions simulées (sera remplacé par vraies données)
          uniqueIPs: Math.floor(data.stats.totalUsers * 0.8), // Estimation d'IPs uniques
          diskUsage: Math.floor(data.stats.totalUsers * 0.1), // Utilisation disque estimée
          backupSize: `${(data.stats.totalUsers * 0.05).toFixed(1)} GB` // Taille backup estimée
        });
      } else {
        console.error('❌ Erreur chargement données hybrides:', result.error);
      }

      // Les autres données seront chargées progressivement via les APIs spécialisées
      // TODO: Migrer les endpoints API vers HybridDataService
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données:', error);
      // Garder les données par défaut en cas d'erreur
    } finally {
      setLoadingData(false);
    }
  };

  // Fonction pour nettoyer toutes les données mockées
  const clearMockedData = () => {
    setDashboardData(prevData => ({
      ...prevData,
      // Vider toutes les listes de données mockées
      blogPosts: [],
      auditLogs: [],
      systemAlerts: [],
      support: [],
      reports: [],
      users: [],
      transactions: [],
      // Réinitialiser les systèmes à des valeurs neutres
      systemHealth: {
        server: { cpu: 0, memory: 0, disk: 0, network: 0 },
        database: { connections: 0, queries: 0, performance: 0 },
        security: { threats: 0, blocked: 0, score: 100 }
      },
      // VIDER AUSSI LES ANALYTICS MOCKÉES
      analytics: {
        userGrowth: [],
        revenueGrowth: [],
        topRegions: {},
        platformStats: {
          activeListings: 0,
          pendingApprovals: 0,
          rejectedListings: 0
        }
      }
    }));

    // Réinitialiser les statistiques additionnelles
    setAdditionalStats({
      totalViews: 0,
      todayActions: 0,
      uniqueIPs: 0,
      diskUsage: 0,
      backupSize: '0 GB'
    });

    // VIDER LES MESSAGES ET NOTIFICATIONS MOCKÉS DU HEADER
    setHeaderMessages([]);
    setHeaderNotifications([]);
  };

  // Charger les données au montage du composant
  useEffect(() => {
    // Nettoyer immédiatement les données mockées
    clearMockedData();
    // Puis charger les vraies données
    loadRealData();
  }, []);

  // Données pour les aperçus rapides - CONTROLLABLES
  const [headerMessages, setHeaderMessages] = useState([
    {
      id: 1,
      sender: 'M. Diallo',
      subject: 'Demande terrain Almadies',
      preview: 'Bonjour, je souhaiterais avoir plus d\'informations...',
      time: '2 min',
      unread: true,
      avatar: 'MD'
    },
    {
      id: 2,
      sender: 'Mme Ndiaye',
      subject: 'Question sur transaction',
      preview: 'Le paiement n\'est toujours pas validé...',
      time: '15 min',
      unread: true,
      avatar: 'MN'
    },
    {
      id: 3,
      sender: 'Agent Foncier',
      subject: 'Rapport mensuel',
      preview: 'Voici le rapport d\'activité du mois...',
      time: '1h',
      unread: false,
      avatar: 'AF'
    }
  ]);

  const [headerNotifications, setHeaderNotifications] = useState([
    {
      id: 1,
      type: 'security',
      title: 'Alerte sécurité',
      message: 'Tentatives de connexion suspectes détectées',
      time: '5 min',
      priority: 'high',
      unread: true
    },
    {
      id: 2,
      type: 'system',
      title: 'Maintenance programmée',
      message: 'Redémarrage des serveurs dans 2 heures',
      time: '30 min',
      priority: 'medium',
      unread: true
    },
    {
      id: 3,
      type: 'business',
      title: 'Objectif atteint',
      message: 'Revenus mensuels dépassés de 120%',
      time: '2h',
      priority: 'low',
      unread: false
    },
    {
      id: 4,
      type: 'user',
      title: 'Nouveau compte',
      message: '15 nouveaux utilisateurs aujourd\'hui',
      time: '4h',
      priority: 'low',
      unread: false
    }
  ]);

  useEffect(() => {
    // Simulation chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // Utility Functions
  const getStatusColor = (status) => {
    const colors = {
      'Actif': 'bg-green-500',
      'Inactif': 'bg-gray-500',
      'Suspendu': 'bg-red-500',
      'En attente': 'bg-yellow-500',
      'Complétée': 'bg-green-500',
      'En cours': 'bg-blue-500',
      'Annulée': 'bg-red-500',
      'Nouveau': 'bg-blue-500',
      'Résolu': 'bg-green-500',
      'Fermé': 'bg-gray-500',
      'Publié': 'bg-green-500',
      'Brouillon': 'bg-orange-500',
      'Archivé': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Critique': 'bg-red-500',
      'Élevé': 'bg-orange-500',
      'Moyen': 'bg-yellow-500',
      'Faible': 'bg-blue-500'
    };
    return colors[severity] || 'bg-gray-500';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getActiveItem = () => navigationItems.find(item => item.id === activeTab);

  // Sidebar Component
  const Sidebar = () => (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-lg z-50
        ${sidebarCollapsed ? 'w-16' : 'w-80'}
        ${mobileMenuOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'}
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex flex-col h-full">
        {/* Header Modernisé */}
        <div className="p-6 border-b border-gradient-to-r from-amber-100 to-yellow-100 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0">
                  <TerangaLogo className="h-12 w-12" showText={false} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-yellow-700 to-orange-700 bg-clip-text text-transparent">
                    Admin Panel
                  </h2>
                  <p className="text-sm font-medium text-amber-600">
                    Teranga Foncier - Administration
                  </p>
                </div>
              </motion.div>
            )}
            {sidebarCollapsed && (
              <div className="flex justify-center w-full">
                <TerangaLogo className="h-8 w-8" showText={false} />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex hover:bg-amber-100 text-amber-700 transition-colors"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden hover:bg-amber-100 text-amber-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Modernisée */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-3 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.isInternal) {
                // Onglet interne - reste sur cette page
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 text-amber-800 border border-amber-300 shadow-sm' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:text-amber-700'
                      }
                    `}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-amber-600' : 'text-gray-500'}`} />
                    
                    {!sidebarCollapsed && (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.label}</p>
                          <p className="text-xs text-gray-500 truncate">{item.description}</p>
                        </div>
                        
                        {item.badge && (
                          <Badge 
                            className={`text-xs ${item.badgeColor || 'bg-blue-500'} text-white`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </motion.button>
                );
              } else {
                // Route externe - vers pages Modern*
                return (
                  <Link
                    key={item.id}
                    to={item.route}
                    className="block w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                        text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 hover:text-amber-700
                      `}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0 text-gray-500" />
                      
                      {!sidebarCollapsed && (
                        <>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.label}</p>
                            <p className="text-xs text-gray-500 truncate">{item.description}</p>
                          </div>
                          
                          {item.badge && (
                            <Badge 
                              className={`text-xs ${item.badgeColor || 'bg-blue-500'} text-white`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </motion.div>
                  </Link>
                );
              }
            })}
          </nav>
        </div>

        {/* User Section Modernisée */}
        <div className="p-4 border-t border-gradient-to-r from-amber-200 to-yellow-200 bg-gradient-to-br from-amber-25 to-yellow-25">
          {!sidebarCollapsed && (
            <motion.div 
              className="flex items-center space-x-3 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-800 truncate">Administrateur</p>
                <p className="text-xs text-amber-600 truncate">admin@terangafoncier.sn</p>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="flex-1 hover:bg-amber-100 text-amber-700">
              <Bell className="h-4 w-4" />
              {!sidebarCollapsed && <span className="ml-2 font-medium">Notifications</span>}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-100 text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Main Content Component
  const MainContent = () => {
    const activeItem = getActiveItem();
    
    return (
      <div className={`
        flex-1 transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'}
      `}>
        {/* Header Modernisé */}
        <div className="bg-gradient-to-r from-white via-amber-50 to-yellow-50 border-b border-amber-200 px-6 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden hover:bg-amber-100 text-amber-700"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-yellow-700 to-orange-700 bg-clip-text text-transparent flex items-center">
                  {activeItem && <activeItem.icon className="h-7 w-7 mr-3 text-amber-600" />}
                  {activeItem?.label}
                </h1>
                <p className="text-sm font-medium text-amber-600 mt-1">{activeItem?.description}</p>
              </motion.div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Statistiques rapides modernisées */}
              <div className="hidden md:flex items-center space-x-4">
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-amber-200"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-lg font-bold text-amber-700">
                    {loadingData ? '...' : dashboardData.stats.totalUsers}
                  </p>
                  <p className="text-xs text-amber-600 font-medium">Utilisateurs</p>
                </motion.div>
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-green-200"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-lg font-bold text-green-700">{dashboardData.stats.systemUptime}%</p>
                  <p className="text-xs text-green-600 font-medium">Uptime</p>
                </motion.div>
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border border-blue-200"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-lg font-bold text-blue-700">{dashboardData.stats.pendingReports}</p>
                  <p className="text-xs text-blue-600 font-medium">Reports</p>
                </motion.div>
              </div>

              {/* Séparateur modernisé */}
              <div className="hidden md:block w-px h-8 bg-gradient-to-b from-amber-200 via-yellow-300 to-orange-200"></div>

              {/* Actions Header */}
              <div className="flex items-center space-x-3">
                {/* Messages avec aperçu */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative hover:bg-gray-100"
                    onClick={() => setShowMessages(!showMessages)}
                  >
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    {headerMessages.filter(m => m.unread).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                        {headerMessages.filter(m => m.unread).length}
                      </span>
                    )}
                  </Button>

                  {/* Dropdown Messages */}
                  {showMessages && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                      <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-900">Messages récents</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {headerMessages.map((message) => (
                          <div key={message.id} className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${message.unread ? 'bg-blue-50' : ''}`}>
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                                {message.avatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${message.unread ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                                  {message.sender}
                                </p>
                                <p className="text-xs text-gray-600 truncate mb-1">{message.subject}</p>
                                <p className="text-xs text-gray-500 truncate">{message.preview}</p>
                              </div>
                              <span className="text-xs text-gray-400">{message.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t">
                        <Link to="/admin/messages" className="text-sm text-blue-600 hover:text-blue-800">
                          Voir tous les messages →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Notifications avec aperçu */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative hover:bg-gray-100"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    {headerNotifications.filter(n => n.unread).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {headerNotifications.filter(n => n.unread).length}
                      </span>
                    )}
                  </Button>

                  {/* Dropdown Notifications */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                      <div className="p-4 border-b">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {headerNotifications.map((notification) => (
                          <div key={notification.id} className={`p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${notification.unread ? 'bg-red-50' : ''}`}>
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 mt-2 rounded-full ${
                                notification.priority === 'high' ? 'bg-red-500' :
                                notification.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${notification.unread ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                                <span className="text-xs text-gray-400">{notification.time}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t">
                        <Link to="/admin/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                          Voir toutes les notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Menu Profil */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-gray-100">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-avatar.jpg" />
                        <AvatarFallback className="bg-red-600 text-white text-xs">
                          {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:block text-left">
                        <p className="text-xs font-medium text-gray-900">
                          {profile?.full_name || user?.email?.split('@')[0] || 'Administrateur'}
                        </p>
                        <p className="text-xs text-gray-500">Admin</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/profile" className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-2" />
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/settings" className="flex items-center">
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  };

  // Content Renderer - Import des pages spécialisées
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ModernAdminOverview 
          dashboardData={dashboardData} 
          loadingData={loadingData} 
          onTabChange={setActiveTab} 
        />;
      case 'users':
        return renderUsersSpecialized();
      case 'subscriptions':
        return <AdvancedSubscriptionManagementPage />;
      case 'properties':
        return renderPropertiesSpecialized();
      case 'transactions':
        return renderTransactionsSpecialized();
      case 'financial':
        return renderFinancial();
      case 'revenue-management':
        return <RevenueManagementPage />;
      case 'property-management':
        return <PropertyManagementPage />;
      case 'support-tickets':
        return <SupportTicketsPage />;
      case 'bulk-export':
        return <BulkExportPage />;
      case 'blog':
        return renderBlog();
      case 'reports':
        return renderReports();
      case 'audit':
        return renderAudit();
      case 'analytics':
        return renderAnalyticsSpecialized();
      case 'notifications':
        return renderNotifications();
      case 'system':
        return renderSettingsSpecialized();
      case 'backup':
        return renderBackup();
      default:
        return renderOverview();
    }
  };

  // Fallback Overview (ne devrait plus être utilisé car on utilise ModernAdminOverview)
  const renderOverview = () => (
    <ModernAdminOverview 
      dashboardData={dashboardData} 
      loadingData={loadingData} 
      onTabChange={setActiveTab} 
    />
  );

  // Users Content
  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Utilisateurs Vérifiés</p>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData.users.filter(u => u.verified).length}
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Utilisateurs Suspendus</p>
                <p className="text-2xl font-bold text-red-600">
                  {dashboardData.users.filter(u => u.suspended).length}
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nouveaux ce Mois</p>
                <p className="text-2xl font-bold text-blue-600">147</p>
              </div>
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Taux d'Engagement</p>
                <p className="text-2xl font-bold text-purple-600">78%</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {dashboardData.users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <Badge className={`${getStatusColor(user.status)} text-white`}>
                      {user.status}
                    </Badge>
                    <Badge variant="outline">{user.role}</Badge>
                    {user.verified && (
                      <Badge className="bg-green-500 text-white">Vérifié</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Inscription</p>
                      <p className="font-medium">{new Date(user.joinDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Dernière Connexion</p>
                      <p className="font-medium">{new Date(user.lastLogin).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Transactions</p>
                      <p className="font-medium">{user.totalTransactions}</p>
                    </div>
                  </div>

                  {user.suspensionReason && (
                    <div className="bg-red-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-red-800">
                        <strong>Motif de suspension:</strong> {user.suspensionReason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  {user.suspended ? (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Unlock className="h-4 w-4 mr-1" />
                      Réactiver
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      <Lock className="h-4 w-4 mr-1" />
                      Suspendre
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Properties Content
  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Biens</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {dashboardData.properties.map((property) => (
          <Card key={property.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <Badge className={`${getStatusColor(property.status)} text-white`}>
                      {property.status}
                    </Badge>
                    {property.verified && (
                      <Badge className="bg-green-500 text-white">Vérifié</Badge>
                    )}
                    {property.featured && (
                      <Badge className="bg-purple-500 text-white">Mis en avant</Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Propriétaire</p>
                      <p className="font-medium">{property.owner}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Prix</p>
                      <p className="font-medium text-green-600">{formatCurrency(property.price)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vues</p>
                      <p className="font-medium">{property.views}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Publié le</p>
                      <p className="font-medium">{new Date(property.datePosted).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  {property.reports > 0 && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>⚠️ {property.reports} signalement(s)</strong> - Nécessite une vérification
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Transactions Content
  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Transactions</h2>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      <div className="grid gap-4">
        {dashboardData.transactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-semibold text-lg">{transaction.type}</h3>
                    <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                      {transaction.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        {transaction.type === 'Vente' ? 'Acheteur' : 'Demandeur'}
                      </p>
                      <p className="font-medium">{transaction.buyer || transaction.applicant}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {transaction.type === 'Vente' ? 'Vendeur' : 'Municipalité'}
                      </p>
                      <p className="font-medium">{transaction.seller || transaction.municipality}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Montant</p>
                      <p className="font-medium text-green-600">{formatCurrency(transaction.amount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Commission</p>
                      <p className="font-medium">{formatCurrency(transaction.commission)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Bien: {transaction.property}</span>
                    <span>Date: {new Date(transaction.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    Documents
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Analytics Content
  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Avancées</h2>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Rapport Complet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Croissance Utilisateurs</p>
                <p className="text-2xl font-bold text-blue-600">+18.5%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Croissance Revenus</p>
                <p className="text-2xl font-bold text-green-600">+24.2%</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction Client</p>
                <p className="text-2xl font-bold text-purple-600">96%</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps Réponse Moyen</p>
                <p className="text-2xl font-bold text-orange-600">2.1s</p>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition Régionale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dashboardData.analytics.topRegions).map(([region, percentage]) => (
                <div key={region}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{region}</span>
                    <span className="text-sm">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques Plateforme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{dashboardData.analytics.platformStats.totalListings}</p>
                <p className="text-sm text-gray-600">Total Annonces</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-green-600">{dashboardData.analytics.platformStats.activeListings}</p>
                <p className="text-sm text-gray-600">Annonces Actives</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{dashboardData.analytics.platformStats.soldProperties}</p>
                <p className="text-sm text-gray-600">Biens Vendus</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-red-600">{dashboardData.analytics.platformStats.conversionRate}%</p>
                <p className="text-sm text-gray-600">Taux Conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // Reports Content
  const renderReports = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Signalements</h2>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtrer par type
        </Button>
      </div>

      <div className="grid gap-4">
        {dashboardData.reports.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Aucun rapport disponible pour le moment.</p>
            </CardContent>
          </Card>
        ) : (
          dashboardData.reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-semibold text-lg">{report.type}</h3>
                    <Badge className={`${getStatusColor(report.status)} text-white`}>
                      {report.status}
                    </Badge>
                    <Badge className={`${getSeverityColor(report.severity)} text-white`}>
                      {report.severity}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Signalé par</p>
                      <p className="font-medium">{report.reporter}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Élément signalé</p>
                      <p className="font-medium">{report.reported}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{new Date(report.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  {report.status === 'Nouveau' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Traiter
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Examiner
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );

  // System Content
  const renderSystem = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuration Système</h2>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-blue-600" />
              Monitoring Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm flex items-center">
                    <Cpu className="h-4 w-4 mr-1" />
                    CPU
                  </span>
                  <span className="text-sm font-medium">{dashboardData.systemHealth.server.cpu}%</span>
                </div>
                <Progress value={dashboardData.systemHealth.server.cpu} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm flex items-center">
                    <MemoryStick className="h-4 w-4 mr-1" />
                    Mémoire
                  </span>
                  <span className="text-sm font-medium">{dashboardData.systemHealth.server.memory}%</span>
                </div>
                <Progress value={dashboardData.systemHealth.server.memory} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm flex items-center">
                    <HardDrive className="h-4 w-4 mr-1" />
                    Stockage
                  </span>
                  <span className="text-sm font-medium">{dashboardData.systemHealth.server.disk}%</span>
                </div>
                <Progress value={dashboardData.systemHealth.server.disk} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-green-600" />
              Base de Données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Connexions actives</span>
                <span className="font-medium">{dashboardData.systemHealth.database.connections}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Requêtes/min</span>
                <span className="font-medium">{dashboardData.systemHealth.database.queries}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Performance</span>
                <span className="font-medium text-green-600">{dashboardData.systemHealth.database.performance}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // User Management Content
  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion Complète des Utilisateurs</h2>
        <div className="flex space-x-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Utilisateur
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Créer Utilisateur</p>
                <p className="text-sm text-gray-600">Nouveau compte</p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Import en Masse</p>
                <p className="text-sm text-gray-600">Fichier CSV</p>
              </div>
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Rôles & Permissions</p>
                <p className="text-sm text-gray-600">Gestion droits</p>
              </div>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Audit Utilisateurs</p>
                <p className="text-sm text-gray-600">Historique</p>
              </div>
              <Button size="sm" variant="outline">
                <Activity className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des Rôles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Particulier', 'Vendeur', 'Promoteur', 'Banque', 'Notaire', 'Agent Foncier'].map((role) => (
              <div key={role} className="text-center p-4 border rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{Math.floor(Math.random() * 500) + 100}</p>
                <p className="text-sm text-gray-600">{role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Création Rapide d'Utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom complet</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="Nom et prénom" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full p-2 border rounded-lg" placeholder="email@exemple.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Téléphone</label>
              <input type="tel" className="w-full p-2 border rounded-lg" placeholder="+221 XX XXX XX XX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rôle</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Particulier</option>
                <option>Vendeur</option>
                <option>Promoteur</option>
                <option>Banque</option>
                <option>Notaire</option>
                <option>Agent Foncier</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button className="bg-green-600 hover:bg-green-700">
              <UserCheck className="h-4 w-4 mr-2" />
              Créer et Activer
            </Button>
            <Button variant="outline">
              Créer en Brouillon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Financial Content
  const renderFinancial = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard Financier</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Rapport Financier
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <DollarSign className="h-4 w-4 mr-2" />
            Nouveau Paiement
          </Button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Revenus Mensuels</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData.financial.monthlyRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+24% vs mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Commissions Totales</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(dashboardData.financial.totalCommissions)}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-blue-600">2.57% du CA</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Paiements en Attente</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData.financial.pendingPayments}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <span className="text-orange-600">À traiter</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Transaction Moyenne</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(dashboardData.financial.avgTransactionValue)}</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">+12% ce mois</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Region */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenus par Région</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dashboardData.financial.topEarningRegions).map(([region, revenue]) => {
                const percentage = (revenue / dashboardData.financial.monthlyRevenue * 100).toFixed(1);
                return (
                  <div key={region}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{region}</span>
                      <span className="text-sm">{formatCurrency(revenue)}</span>
                    </div>
                    <Progress value={parseFloat(percentage)} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{percentage}% du total</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux de Commission par Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dashboardData.financial.commissionRates).map(([service, rate]) => (
                <div key={service} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">{service}</span>
                  <Badge className="bg-blue-500 text-white">{rate}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des Revenus (10 mois)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-500">Graphique d'évolution des revenus</p>
              <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-400">
                {dashboardData.financial.revenueGrowth.slice(-5).map((revenue, index) => (
                  <span key={index} className="bg-green-100 px-2 py-1 rounded">{revenue}M</span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Blog Management Content
  const renderBlog = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion du Blog & Contenu</h2>
        <div className="flex space-x-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvel Article
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Catégories
          </Button>
        </div>
      </div>

      {/* Blog Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Total Articles</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.stats.totalBlogs}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Articles Publiés</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.stats.publishedBlogs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">En Brouillon</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData.stats.totalBlogs - dashboardData.stats.publishedBlogs}</p>
              </div>
              <Edit className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Vues Totales</p>
                <p className="text-2xl font-bold text-purple-600">{additionalStats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts List */}
      <div className="grid gap-4">
        {dashboardData.blogPosts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Aucun article de blog disponible pour le moment.</p>
            </CardContent>
          </Card>
        ) : (
          dashboardData.blogPosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <Badge className={`${getStatusColor(post.status)} text-white`}>
                      {post.status}
                    </Badge>
                    {post.featured && (
                      <Badge className="bg-yellow-500 text-white">Featured</Badge>
                    )}
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Auteur</p>
                      <p className="font-medium">{post.author}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{new Date(post.publishDate || post.createDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vues</p>
                      <p className="font-medium">{post.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Statut</p>
                      <p className="font-medium">{post.status}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  {post.status === 'Brouillon' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Publier
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );

  // Audit & Logs Content
  const renderAudit = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Audit & Journaux d'Activité</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter Logs
          </Button>
        </div>
      </div>

      {/* Audit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Total Logs</p>
                <p className="text-2xl font-bold text-blue-600">{dashboardData.stats.auditLogs.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Actions Aujourd'hui</p>
                <p className="text-2xl font-bold text-green-600">{additionalStats.todayActions}</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tentatives Échouées</p>
                <p className="text-2xl font-bold text-red-600">12</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">IPs Uniques</p>
                <p className="text-2xl font-bold text-purple-600">{additionalStats.uniqueIPs}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.auditLogs.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Aucun log d'audit disponible pour le moment.
              </div>
            ) : (
              dashboardData.auditLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-1 ${log.status === 'Succès' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{log.action}</h4>
                    <Badge className={log.status === 'Succès' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                      {log.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                    <span><strong>Utilisateur:</strong> {log.user}</span>
                    <span><strong>Cible:</strong> {log.target}</span>
                    <span><strong>IP:</strong> {log.ip}</span>
                    <span><strong>Date:</strong> {log.timestamp}</span>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Log Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres Avancés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type d'action</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Tous les types</option>
                <option>Connexion</option>
                <option>Création</option>
                <option>Modification</option>
                <option>Suppression</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Utilisateur</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="Email utilisateur" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date début</label>
              <input type="date" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date fin</label>
              <input type="date" className="w-full p-2 border rounded-lg" />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
            <Button variant="outline">
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Notifications Content
  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Système de Notifications</h2>
        <div className="flex space-x-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Notification
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Non Lues</p>
                <p className="text-2xl font-bold text-red-600">{dashboardData.stats.notifications}</p>
              </div>
              <Bell className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Envoyées Aujourd'hui</p>
                <p className="text-2xl font-bold text-blue-600">45</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Taux d'Ouverture</p>
                <p className="text-2xl font-bold text-green-600">87%</p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertes Critiques</p>
                <p className="text-2xl font-bold text-orange-600">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="grid gap-4">
        {dashboardData.notifications.map((notification) => {
          const getPriorityColor = (priority) => {
            return {
              'Haute': 'border-l-red-500 bg-red-50',
              'Moyenne': 'border-l-orange-500 bg-orange-50',
              'Info': 'border-l-blue-500 bg-blue-50'
            }[priority] || 'border-l-gray-500 bg-gray-50';
          };

          return (
            <Card key={notification.id} className={`border-l-4 ${getPriorityColor(notification.priority)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium">{notification.type}</h4>
                      <Badge className={`${notification.priority === 'Haute' ? 'bg-red-500' : notification.priority === 'Moyenne' ? 'bg-orange-500' : 'bg-blue-500'} text-white`}>
                        {notification.priority}
                      </Badge>
                      {!notification.read && (
                        <Badge className="bg-green-500 text-white">Nouveau</Badge>
                      )}
                    </div>
                    <p className="text-gray-700 mb-2">{notification.message}</p>
                    <p className="text-sm text-gray-500">{notification.timestamp}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    {!notification.read && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Marquer Lu
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Send Notification Form */}
      <Card>
        <CardHeader>
          <CardTitle>Envoyer une Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Information Générale</option>
                  <option>Alerte Sécurité</option>
                  <option>Maintenance Système</option>
                  <option>Promotion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priorité</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Info</option>
                  <option>Moyenne</option>
                  <option>Haute</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Destinataires</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Tous les utilisateurs</option>
                <option>Administrateurs uniquement</option>
                <option>Utilisateurs actifs</option>
                <option>Par rôle...</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea className="w-full p-2 border rounded-lg h-24" placeholder="Votre message..."></textarea>
            </div>
            <div className="flex space-x-2">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Bell className="h-4 w-4 mr-2" />
                Envoyer Maintenant
              </Button>
              <Button variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Programmer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Backup & Restore Content
  const renderBackup = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sauvegarde & Restauration</h2>
        <div className="flex space-x-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <Database className="h-4 w-4 mr-2" />
            Nouvelle Sauvegarde
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Paramètres Auto
          </Button>
        </div>
      </div>

      {/* Backup Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dernière Sauvegarde</p>
                <p className="text-lg font-bold text-green-600">Aujourd'hui 03:00</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Taille Totale</p>
                <p className="text-lg font-bold text-blue-600">{additionalStats.backupSize}</p>
              </div>
              <HardDrive className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sauvegardes Auto</p>
                <p className="text-lg font-bold text-purple-600">Activées</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Rétention</p>
                <p className="text-lg font-bold text-orange-600">30 jours</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions de Sauvegarde</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="text-center">
                <Database className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium mb-2">Sauvegarde Complète</h3>
                <p className="text-sm text-gray-600 mb-4">Base de données + fichiers</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Lancer
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <Server className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium mb-2">Sauvegarde DB</h3>
                <p className="text-sm text-gray-600 mb-4">Base de données uniquement</p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Lancer
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <div className="text-center">
                <HardDrive className="h-12 w-12 text-orange-600 mx-auto mb-2" />
                <h3 className="font-medium mb-2">Sauvegarde Fichiers</h3>
                <p className="text-sm text-gray-600 mb-4">Documents et médias</p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  Lancer
                </Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Recent Backups */}
      <Card>
        <CardHeader>
          <CardTitle>Sauvegardes Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generateBackupData().map((backup, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">{backup.date}</p>
                    <p className="text-sm text-gray-600">{backup.type} - {backup.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500 text-white">{backup.status}</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Télécharger
                  </Button>
                  <Button size="sm" variant="outline">
                    Restaurer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de Sauvegarde Automatique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sauvegarde automatique</h4>
                <p className="text-sm text-gray-600">Effectuer des sauvegardes quotidiennes</p>
              </div>
              <Button variant="outline">Activée</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Heure de sauvegarde</h4>
                <p className="text-sm text-gray-600">Tous les jours à 03:00</p>
              </div>
              <Button variant="outline">Modifier</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Rétention</h4>
                <p className="text-sm text-gray-600">Conserver pendant 30 jours</p>
              </div>
              <Button variant="outline">Modifier</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Fonctions de rendu spécialisées utilisant nos pages complètes
  const renderUsersSpecialized = () => {
    const UsersPage = React.lazy(() => import('./UsersPage'));
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }>
        <UsersPage />
      </Suspense>
    );
  };

  const renderPropertiesSpecialized = () => {
    const PropertiesManagementPage = React.lazy(() => import('./PropertiesManagementPage'));
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }>
        <PropertiesManagementPage />
      </Suspense>
    );
  };

  const renderTransactionsSpecialized = () => {
    const TransactionsPage = React.lazy(() => import('./TransactionsPage'));
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }>
        <TransactionsPage />
      </Suspense>
    );
  };

  const renderAnalyticsSpecialized = () => {
    const AnalyticsPage = React.lazy(() => import('./AnalyticsPage'));
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }>
        <AnalyticsPage />
      </Suspense>
    );
  };

  const renderSettingsSpecialized = () => {
    const SettingsPage = React.lazy(() => import('./SettingsPage'));
    return (
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      }>
        <SettingsPage />
      </Suspense>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du panneau d'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-25 to-yellow-25">
      <Sidebar />
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <MainContent />
    </div>
  );
};

export default CompleteSidebarAdminDashboard;
