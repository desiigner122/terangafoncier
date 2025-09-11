/**
 * ==========================================================
 * 📊 TERANGA UNIFIED DASHBOARD
 * Dashboard unifié pour toutes les sources de données
 * ==========================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Database, 
  Activity, 
  Users,
  MapPin,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Zap,
  Globe,
  Server,
  Cpu
} from 'lucide-react';

import { blockchainSyncService } from '../../services/TerangaBlockchainSyncService.js';
import { terangaAIService } from '../../services/TerangaAIService.js';
import { useSupabase } from '../../hooks/useSupabase';

const UnifiedDashboard = () => {
  // États du dashboard
  const [dashboardData, setDashboardData] = useState({
    // Métriques globales
    totalUsers: 0,
    totalProperties: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    
    // Blockchain
    blockchainStats: {
      totalDocuments: 0,
      verifiedDocuments: 0,
      fraudAttempts: 0,
      successRate: 0
    },
    
    // IA
    aiStats: {
      totalAnalyses: 0,
      accuracyRate: 0,
      averageProcessingTime: 0,
      activeModels: 0
    },
    
    // Synchronisation
    syncStats: {
      lastSync: null,
      syncStatus: 'idle',
      totalSynced: 0,
      isRunning: false
    }
  });

  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [realtimeData, setRealtimeData] = useState([]);
  const [systemHealth, setSystemHealth] = useState('healthy');
  
  const { supabase } = useSupabase();
  const refreshInterval = useRef(null);

  /**
   * 🚀 Initialisation du dashboard
   */
  useEffect(() => {
    initializeDashboard();
    startRealtimeUpdates();
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, []);

  /**
   * 📊 Initialiser le dashboard
   */
  const initializeDashboard = async () => {
    try {
      setLoading(true);
      
      await Promise.all([
        loadGlobalMetrics(),
        loadBlockchainStats(),
        loadAIStats(),
        loadSyncStatus(),
        checkSystemHealth()
      ]);
      
    } catch (error) {
      console.error('❌ Erreur initialisation dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🌍 Charger les métriques globales
   */
  const loadGlobalMetrics = async () => {
    try {
      // Utilisateurs totaux
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      // Propriétés totales
      const { count: propertiesCount } = await supabase
        .from('annonces')
        .select('*', { count: 'exact' });
      
      // Transactions totales (estimation depuis les annonces)
      const { count: transactionsCount } = await supabase
        .from('annonces')
        .select('*', { count: 'exact' })
        .eq('status', 'sold');
      
      // Revenus estimés
      const { data: revenueData } = await supabase
        .from('annonces')
        .select('price')
        .eq('status', 'sold');
      
      const totalRevenue = revenueData?.reduce((sum, item) => sum + (item.price || 0), 0) || 0;
      
      setDashboardData(prev => ({
        ...prev,
        totalUsers: usersCount || 0,
        totalProperties: propertiesCount || 0,
        totalTransactions: transactionsCount || 0,
        totalRevenue: totalRevenue
      }));
      
    } catch (error) {
      console.error('❌ Erreur métriques globales:', error);
    }
  };

  /**
   * ⛓️ Charger les statistiques blockchain
   */
  const loadBlockchainStats = async () => {
    try {
      // Récupérer les stats depuis le service blockchain
      const stats = await blockchainSyncService.getSyncStats();
      
      // Métriques depuis Supabase
      const { count: documentsCount } = await supabase
        .from('blockchain_sync_data')
        .select('*', { count: 'exact' });
      
      const { count: verifiedCount } = await supabase
        .from('blockchain_sync_data')
        .select('*', { count: 'exact' })
        .eq('document_type', 'verification');
      
      const { count: fraudCount } = await supabase
        .from('blockchain_sync_data')
        .select('*', { count: 'exact' })
        .eq('document_type', 'fraud_pattern');
      
      const successRate = documentsCount > 0 ? ((verifiedCount / documentsCount) * 100) : 0;
      
      setDashboardData(prev => ({
        ...prev,
        blockchainStats: {
          totalDocuments: documentsCount || 0,
          verifiedDocuments: verifiedCount || 0,
          fraudAttempts: fraudCount || 0,
          successRate: successRate.toFixed(1)
        },
        syncStats: {
          ...stats,
          lastSync: stats.lastSync,
          totalSynced: stats.totalSynced || 0,
          isRunning: stats.isRunning || false
        }
      }));
      
    } catch (error) {
      console.error('❌ Erreur stats blockchain:', error);
    }
  };

  /**
   * 🤖 Charger les statistiques IA
   */
  const loadAIStats = async () => {
    try {
      // Simuler des stats IA pour la démo
      const aiStats = {
        totalAnalyses: Math.floor(Math.random() * 10000) + 5000,
        accuracyRate: (95 + Math.random() * 4).toFixed(1),
        averageProcessingTime: (0.5 + Math.random() * 2).toFixed(2),
        activeModels: 8
      };
      
      setDashboardData(prev => ({
        ...prev,
        aiStats
      }));
      
    } catch (error) {
      console.error('❌ Erreur stats IA:', error);
    }
  };

  /**
   * 🔄 Charger le statut de synchronisation
   */
  const loadSyncStatus = async () => {
    try {
      const syncStats = blockchainSyncService.getSyncStats();
      
      setDashboardData(prev => ({
        ...prev,
        syncStats: {
          lastSync: syncStats.lastSync,
          syncStatus: syncStats.isRunning ? 'running' : 'idle',
          totalSynced: syncStats.totalSynced || 0,
          isRunning: syncStats.isRunning || false
        }
      }));
      
    } catch (error) {
      console.error('❌ Erreur status sync:', error);
    }
  };

  /**
   * 🏥 Vérifier la santé du système
   */
  const checkSystemHealth = async () => {
    try {
      const health = await blockchainSyncService.healthCheck();
      setSystemHealth(health.status);
      
    } catch (error) {
      console.error('❌ Erreur health check:', error);
      setSystemHealth('unhealthy');
    }
  };

  /**
   * ⚡ Démarrer les mises à jour temps réel
   */
  const startRealtimeUpdates = () => {
    refreshInterval.current = setInterval(() => {
      loadGlobalMetrics();
      loadSyncStatus();
      updateRealtimeData();
    }, 30000); // 30 secondes
  };

  /**
   * 📈 Mettre à jour les données temps réel
   */
  const updateRealtimeData = () => {
    const newDataPoint = {
      timestamp: new Date().toLocaleTimeString(),
      users: dashboardData.totalUsers + Math.floor(Math.random() * 5),
      transactions: dashboardData.totalTransactions + Math.floor(Math.random() * 3),
      revenue: dashboardData.totalRevenue + Math.floor(Math.random() * 100000)
    };
    
    setRealtimeData(prev => {
      const updated = [...prev, newDataPoint];
      return updated.slice(-20); // Garder seulement les 20 derniers points
    });
  };

  /**
   * 🔄 Forcer une synchronisation
   */
  const handleForceSync = async () => {
    try {
      await blockchainSyncService.forceSync();
      await loadSyncStatus();
      alert('✅ Synchronisation forcée terminée');
    } catch (error) {
      console.error('❌ Erreur sync forcée:', error);
      alert('❌ Erreur lors de la synchronisation');
    }
  };

  /**
   * 🎨 Formater les nombres
   */
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  /**
   * 💰 Formater le montant
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teranga-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard unifié...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Globe className="text-teranga-500" />
              Dashboard Unifié
            </h1>
            <p className="text-gray-600 mt-1">
              Vue d'ensemble complète - Blockchain, IA et Supabase
            </p>
          </div>
          
          {/* Indicateur de santé système */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                systemHealth === 'healthy' ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`}></div>
              <span className="text-sm font-medium">
                Système {systemHealth === 'healthy' ? 'Opérationnel' : 'Problème'}
              </span>
            </div>
            
            {/* Boutons d'action */}
            <button 
              onClick={handleForceSync}
              className="bg-teranga-500 hover:bg-teranga-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Zap size={16} />
              Sync Forcée
            </button>
          </div>
        </div>
      </div>

      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.totalUsers)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-green-600">
            <TrendingUp size={16} />
            <span className="ml-2 text-sm">+12% ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Propriétés</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.totalProperties)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="text-green-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-green-600">
            <TrendingUp size={16} />
            <span className="ml-2 text-sm">+8% ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.totalTransactions)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-green-600">
            <TrendingUp size={16} />
            <span className="ml-2 text-sm">+15% ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <DollarSign className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="flex items-center mt-4 text-green-600">
            <TrendingUp size={16} />
            <span className="ml-2 text-sm">+22% ce mois</span>
          </div>
        </div>
      </div>

      {/* Section Blockchain & IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Stats Blockchain */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-teranga-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Blockchain Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Database size={20} className="text-blue-600" />
                <span className="font-medium">Documents Totaux</span>
              </div>
              <span className="text-lg font-bold">{dashboardData.blockchainStats.totalDocuments}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-medium">Documents Vérifiés</span>
              </div>
              <span className="text-lg font-bold">{dashboardData.blockchainStats.verifiedDocuments}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle size={20} className="text-red-600" />
                <span className="font-medium">Tentatives de Fraude</span>
              </div>
              <span className="text-lg font-bold">{dashboardData.blockchainStats.fraudAttempts}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-teranga-50 rounded-lg border border-teranga-200">
              <div className="flex items-center gap-3">
                <Activity size={20} className="text-teranga-600" />
                <span className="font-medium">Taux de Réussite</span>
              </div>
              <span className="text-lg font-bold text-teranga-600">{dashboardData.blockchainStats.successRate}%</span>
            </div>
          </div>
        </div>

        {/* Stats IA */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Cpu className="text-purple-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Intelligence Artificielle</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart3 size={20} className="text-blue-600" />
                <span className="font-medium">Analyses Totales</span>
              </div>
              <span className="text-lg font-bold">{formatNumber(dashboardData.aiStats.totalAnalyses)}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-green-600" />
                <span className="font-medium">Taux de Précision</span>
              </div>
              <span className="text-lg font-bold">{dashboardData.aiStats.accuracyRate}%</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-orange-600" />
                <span className="font-medium">Temps Moyen (s)</span>
              </div>
              <span className="text-lg font-bold">{dashboardData.aiStats.averageProcessingTime}s</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3">
                <Server size={20} className="text-purple-600" />
                <span className="font-medium">Modèles Actifs</span>
              </div>
              <span className="text-lg font-bold text-purple-600">{dashboardData.aiStats.activeModels}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Synchronisation */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="text-teranga-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Synchronisation Blockchain ↔ Supabase</h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              dashboardData.syncStats.isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-sm font-medium">
              {dashboardData.syncStats.isRunning ? 'Synchronisation Active' : 'Arrêtée'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-teranga-600">{formatNumber(dashboardData.syncStats.totalSynced)}</div>
            <div className="text-sm text-gray-600 mt-1">Enregistrements Synchronisés</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {dashboardData.syncStats.lastSync ? 
                new Date(dashboardData.syncStats.lastSync).toLocaleTimeString() : 
                'Jamais'
              }
            </div>
            <div className="text-sm text-gray-600 mt-1">Dernière Synchronisation</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">30s</div>
            <div className="text-sm text-gray-600 mt-1">Intervalle Auto-Sync</div>
          </div>
        </div>
      </div>

      {/* Footer avec actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Actions Système</h3>
            <p className="text-gray-600 text-sm">Gestion et monitoring avancé</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Activity size={16} />
              Actualiser
            </button>
            
            <button 
              onClick={() => alert('Export des données en cours...')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Database size={16} />
              Exporter
            </button>
            
            <button 
              onClick={() => alert('Configuration système...')}
              className="bg-teranga-500 hover:bg-teranga-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Eye size={16} />
              Configurer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedDashboard;
