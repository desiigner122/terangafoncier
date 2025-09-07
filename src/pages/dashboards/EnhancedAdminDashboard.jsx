import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  TrendingUp,
  Database,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  BarChart3,
  Globe,
  Lock,
  Coins,
  Eye,
  Settings,
  UserCheck,
  Building
} from 'lucide-react';

const EnhancedAdminDashboard = () => {
  const [blockchainStats, setBlockchainStats] = useState({
    totalNFTs: 1247,
    activeContracts: 89,
    escrowVolume: 2850000000,
    securityScore: 98.5
  });

  const [platformStats, setPlatformStats] = useState({
    totalUsers: 15847,
    activeProperties: 3456,
    monthlyRevenue: 1250000000,
    conversionRate: 23.4
  });

  const blockchainActivities = [
    {
      type: 'NFT_MINT',
      description: 'Propriété TF-2024-001 tokenisée en NFT',
      user: 'Aminata Diallo',
      timestamp: '2 min ago',
      status: 'success',
      txHash: '0x7d1af7f3...'
    },
    {
      type: 'ESCROW_RELEASE',
      description: 'Paiement libéré pour transaction #ESC-456',
      amount: '25,000,000 FCFA',
      timestamp: '15 min ago',
      status: 'success',
      txHash: '0x9c2fe8a1...'
    },
    {
      type: 'SMART_CONTRACT',
      description: 'Nouveau contrat déployé pour projet Almadies',
      timestamp: '1 hour ago',
      status: 'pending',
      txHash: '0x4f1b6e2d...'
    }
  ];

  const aiInsights = [
    {
      title: 'Prédiction Marché',
      value: '+12.5%',
      description: 'Croissance prévue Q4 2024',
      confidence: '94%',
      trend: 'up'
    },
    {
      title: 'Détection Fraude',
      value: '3 alertes',
      description: 'Tentatives bloquées aujourd\'hui',
      confidence: '99%',
      trend: 'neutral'
    },
    {
      title: 'Optimisation Prix',
      value: '€ 2.3M',
      description: 'Revenue optimisé par IA ce mois',
      confidence: '96%',
      trend: 'up'
    }
  ];

  const riskAlerts = [
    {
      level: 'high',
      title: 'Activité Suspecte Détectée',
      description: 'Multiple tentatives de connexion depuis IP différentes',
      user: 'user_789',
      action: 'Compte temporairement suspendu'
    },
    {
      level: 'medium',
      title: 'Transaction Volume Élevé',
      description: 'Utilisateur dépasse le seuil quotidien habituel',
      user: 'Moussa Seck',
      action: 'Vérification manuelle requise'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme Teranga Foncier</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Activity className="w-4 h-4 mr-1" />
                Blockchain Active
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Database className="w-4 h-4 mr-1" />
                IA Opérationnelle
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="ai">Intelligence IA</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
                      <p className="text-2xl font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1">+12.5% ce mois</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">NFT Propriétés</p>
                      <p className="text-2xl font-bold text-gray-900">{blockchainStats.totalNFTs.toLocaleString()}</p>
                      <p className="text-xs text-green-600 mt-1">+89 cette semaine</p>
                    </div>
                    <Database className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Volume Escrow</p>
                      <p className="text-2xl font-bold text-gray-900">{(blockchainStats.escrowVolume / 1000000000).toFixed(1)}B FCFA</p>
                      <p className="text-xs text-green-600 mt-1">+34% ce mois</p>
                    </div>
                    <Lock className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Score Sécurité</p>
                      <p className="text-2xl font-bold text-gray-900">{blockchainStats.securityScore}%</p>
                      <p className="text-xs text-green-600 mt-1">Excellent</p>
                    </div>
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {aiInsights.map((insight, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                      <Badge className="bg-blue-100 text-blue-800">IA</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-gray-900">{insight.value}</p>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                      <p className="text-xs text-green-600">Confiance: {insight.confidence}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Blockchain */}
          <TabsContent value="blockchain" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Activité Blockchain Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blockchainActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                            <span>{activity.user || activity.amount}</span>
                            <span>{activity.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">TX: {activity.txHash}</p>
                        </div>
                        <Badge className={
                          activity.status === 'success' ? 'bg-green-100 text-green-800' :
                          activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Métriques Blockchain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Smart Contracts Actifs</span>
                        <span className="text-sm font-bold">{blockchainStats.activeContracts}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">NFT Générés</span>
                        <span className="text-sm font-bold">{blockchainStats.totalNFTs}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Sécurité Blockchain</span>
                        <span className="text-sm font-bold">{blockchainStats.securityScore}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${blockchainStats.securityScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Intelligence IA */}
          <TabsContent value="ai" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Prédictions IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Marché Immobilier Q4</h4>
                      <p className="text-2xl font-bold text-blue-700">+12.5% croissance</p>
                      <p className="text-sm text-blue-600">Confiance: 94% • Basé sur 50K+ data points</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Demande Diaspora</h4>
                      <p className="text-2xl font-bold text-green-700">+23% prévue</p>
                      <p className="text-sm text-green-600">Zone focus: Almadies, Mermoz</p>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Optimisation Revenue</h4>
                      <p className="text-2xl font-bold text-purple-700">€2.3M optimisé</p>
                      <p className="text-sm text-purple-600">Prix dynamique IA ce mois</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Alertes Sécurité IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskAlerts.map((alert, index) => (
                      <div key={index} className={`p-4 rounded-lg border-l-4 ${
                        alert.level === 'high' ? 'bg-red-50 border-l-red-500' : 
                        alert.level === 'medium' ? 'bg-yellow-50 border-l-yellow-500' : 
                        'bg-blue-50 border-l-blue-500'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge className={
                            alert.level === 'high' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {alert.level.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                        <p className="text-xs text-gray-500">Utilisateur: {alert.user}</p>
                        <p className="text-xs text-green-600 mt-1">Action: {alert.action}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Autres onglets avec contenu similaire... */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Interface de gestion des utilisateurs avec blockchain wallet management...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Centre de Sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Monitoring sécurité blockchain et détection des menaces...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Avancées</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Métriques détaillées et insights business avec données blockchain...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAdminDashboard;
