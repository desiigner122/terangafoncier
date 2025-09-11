/**
 * 🛡️ PANNEAU ANTI-FRAUDE EN TEMPS RÉEL - TERANGA FONCIER
 * ======================================================
 * 
 * Interface de monitoring anti-fraude pour les administrateurs
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Eye, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { fraudDetectionAI } from '../../services/FraudDetectionAI';

const FraudMonitoringPanel = ({ className = "" }) => {
  const [fraudStats, setFraudStats] = useState({
    todayDetections: 0,
    riskLevel: 'FAIBLE',
    blockedTransactions: 0,
    suspiciousUsers: 0,
    totalAnalyzed: 0
  });

  const [recentAlerts, setRecentAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);

  useEffect(() => {
    loadFraudData();
    
    // Mise à jour temps réel toutes les 30 secondes
    const interval = setInterval(() => {
      if (realTimeMonitoring) {
        loadFraudData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [realTimeMonitoring]);

  const loadFraudData = async () => {
    try {
      // Simulation des données anti-fraude
      const mockStats = {
        todayDetections: Math.floor(Math.random() * 15) + 2,
        riskLevel: ['FAIBLE', 'MODÉRÉ', 'ÉLEVÉ'][Math.floor(Math.random() * 3)],
        blockedTransactions: Math.floor(Math.random() * 8),
        suspiciousUsers: Math.floor(Math.random() * 25) + 5,
        totalAnalyzed: Math.floor(Math.random() * 500) + 150
      };

      const mockAlerts = [
        {
          id: 1,
          type: 'DOCUMENT_FRAUD',
          severity: 'HIGH',
          userId: 'user_892',
          description: 'Document suspect détecté - Altération de signature',
          timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
          status: 'BLOCKED'
        },
        {
          id: 2,
          type: 'BEHAVIOR_ANOMALY',
          severity: 'MEDIUM',
          userId: 'user_445',
          description: 'Pattern de connexion inhabituel - 15 tentatives en 5 min',
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
          status: 'INVESTIGATING'
        },
        {
          id: 3,
          type: 'SUSPICIOUS_AMOUNT',
          severity: 'HIGH',
          userId: 'user_123',
          description: 'Montant suspect: 50M FCFA pour terrain Pikine',
          timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1h30 ago
          status: 'REVIEWED'
        }
      ];

      setFraudStats(mockStats);
      setRecentAlerts(mockAlerts);
      setIsLoading(false);

    } catch (error) {
      console.error('❌ Erreur chargement données anti-fraude:', error);
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (level) => {
    const colors = {
      'FAIBLE': 'text-green-600 bg-green-100',
      'MODÉRÉ': 'text-yellow-600 bg-yellow-100',
      'ÉLEVÉ': 'text-red-600 bg-red-100',
      'CRITIQUE': 'text-red-800 bg-red-200'
    };
    return colors[level] || 'text-gray-600 bg-gray-100';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'LOW': 'text-blue-600 bg-blue-100',
      'MEDIUM': 'text-yellow-600 bg-yellow-100',
      'HIGH': 'text-red-600 bg-red-100',
      'CRITICAL': 'text-red-800 bg-red-200'
    };
    return colors[severity] || 'text-gray-600 bg-gray-100';
  };

  const getStatusColor = (status) => {
    const colors = {
      'BLOCKED': 'text-red-700 bg-red-50 border-red-200',
      'INVESTIGATING': 'text-yellow-700 bg-yellow-50 border-yellow-200',
      'REVIEWED': 'text-green-700 bg-green-50 border-green-200',
      'RESOLVED': 'text-blue-700 bg-blue-50 border-blue-200'
    };
    return colors[status] || 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const formatTimeAgo = (timestamp) => {
    const diffMs = Date.now() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}j`;
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Monitoring Anti-Fraude
              </h3>
              <p className="text-sm text-gray-500">Surveillance temps réel</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(fraudStats.riskLevel)}`}>
              Risque: {fraudStats.riskLevel}
            </div>
            
            <button
              onClick={() => setRealTimeMonitoring(!realTimeMonitoring)}
              className={`p-2 rounded-lg transition-colors ${
                realTimeMonitoring 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Activity className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Détections aujourd'hui</p>
                <p className="text-2xl font-bold text-red-700">{fraudStats.todayDetections}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Transactions bloquées</p>
                <p className="text-2xl font-bold text-orange-700">{fraudStats.blockedTransactions}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Utilisateurs suspects</p>
                <p className="text-2xl font-bold text-yellow-700">{fraudStats.suspiciousUsers}</p>
              </div>
              <Eye className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total analysé</p>
                <p className="text-2xl font-bold text-blue-700">{fraudStats.totalAnalyzed}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Alertes récentes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900">Alertes Récentes</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Temps réel</span>
            </div>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    <span className="text-sm text-gray-500">#{alert.userId}</span>
                    <span className="text-xs text-gray-400">{formatTimeAgo(alert.timestamp)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                  
                  <div className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded border ${getStatusColor(alert.status)}`}>
                    {alert.status}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded">
                    Détails
                  </button>
                  {alert.status === 'INVESTIGATING' && (
                    <button className="px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded">
                      Bloquer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Rapport Détaillé
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                Configurer Alertes
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              Dernière mise à jour: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudMonitoringPanel;
