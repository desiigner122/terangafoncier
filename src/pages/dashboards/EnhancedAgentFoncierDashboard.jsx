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
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  FileText,
  BarChart3,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Home,
  Coins,
  Lock,
  Eye
} from 'lucide-react';

const EnhancedAgentFoncierDashboard = () => {
  const [agentStats, setAgentStats] = useState({
    totalClients: 47,
    activeListings: 23,
    monthlyCommissions: 2800000,
    conversionRate: 18.5,
    blockchainDeals: 12,
    nftCommissions: 450000
  });

  const [aiRecommendations, setAiRecommendations] = useState([
    {
      type: 'lead',
      title: 'Lead Chaud Détecté',
      description: 'Moussa Ba recherche terrain 400m² Almadies',
      confidence: '92%',
      action: 'Contacter maintenant',
      priority: 'high'
    },
    {
      type: 'pricing',
      title: 'Ajustement Prix Suggéré',
      description: 'Propriété ALM-001: +8% recommandé',
      confidence: '87%',
      action: 'Ajuster prix',
      priority: 'medium'
    },
    {
      type: 'blockchain',
      title: 'Opportunité NFT',
      description: 'Client prêt pour tokenisation propriété',
      confidence: '95%',
      action: 'Proposer NFT',
      priority: 'high'
    }
  ]);

  const blockchainActivity = [
    {
      type: 'NFT_SALE',
      property: 'Terrain Almadies 500m²',
      client: 'Aminata Diallo',
      commission: '125,000 FCFA',
      status: 'completed',
      timestamp: '2h ago'
    },
    {
      type: 'SMART_CONTRACT',
      property: 'Villa Mermoz',
      client: 'Ibrahima Sarr',
      commission: '200,000 FCFA',
      status: 'pending',
      timestamp: '5h ago'
    },
    {
      type: 'ESCROW_RELEASE',
      property: 'Appartement Plateau',
      client: 'Fatou Kane',
      commission: '150,000 FCFA',
      status: 'completed',
      timestamp: '1 day ago'
    }
  ];

  const clientsPipeline = [
    {
      name: 'Moussa Ba',
      stage: 'Recherche Active',
      budget: '25M FCFA',
      preference: 'Terrain Almadies',
      lastContact: '2h ago',
      aiScore: 92,
      blockchainReady: true
    },
    {
      name: 'Aissatou Diop',
      stage: 'Négociation',
      budget: '45M FCFA',
      preference: 'Villa Mermoz',
      lastContact: '1 day ago',
      aiScore: 78,
      blockchainReady: false
    },
    {
      name: 'Omar Ndiaye',
      stage: 'Visite Planifiée',
      budget: '18M FCFA',
      preference: 'Appartement Centre',
      lastContact: '3h ago',
      aiScore: 65,
      blockchainReady: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Agent Foncier</h1>
              <p className="text-gray-600 mt-1">Gérez vos clients et propriétés avec l'IA et la blockchain</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Target className="w-4 h-4 mr-1" />
                {agentStats.conversionRate}% Conversion
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Database className="w-4 h-4 mr-1" />
                {agentStats.blockchainDeals} Deals Blockchain
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="clients">Clients IA</TabsTrigger>
            <TabsTrigger value="properties">Propriétés</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
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
                      <p className="text-sm font-medium text-gray-600">Clients Actifs</p>
                      <p className="text-2xl font-bold text-gray-900">{agentStats.totalClients}</p>
                      <p className="text-xs text-green-600 mt-1">+8 ce mois</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Deals Blockchain</p>
                      <p className="text-2xl font-bold text-gray-900">{agentStats.blockchainDeals}</p>
                      <p className="text-xs text-green-600 mt-1">+200% ce mois</p>
                    </div>
                    <Database className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Commissions Mois</p>
                      <p className="text-2xl font-bold text-gray-900">{(agentStats.monthlyCommissions / 1000000).toFixed(1)}M</p>
                      <p className="text-xs text-green-600 mt-1">+45% vs mois dernier</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Taux Conversion</p>
                      <p className="text-2xl font-bold text-gray-900">{agentStats.conversionRate}%</p>
                      <p className="text-xs text-green-600 mt-1">Au-dessus moyenne</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {aiRecommendations.map((rec, index) => (
                <Card key={index} className={`border-l-4 ${
                  rec.priority === 'high' ? 'border-l-red-500' : 
                  rec.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      <Badge className={`${
                        rec.type === 'blockchain' ? 'bg-yellow-100 text-yellow-800' :
                        rec.type === 'lead' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.type === 'blockchain' ? '⛓️ Blockchain' : 
                         rec.type === 'lead' ? '🎯 Lead' : '💰 Prix'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{rec.description}</p>
                      <p className="text-xs text-green-600">Confiance IA: {rec.confidence}</p>
                      <Button size="sm" className="w-full mt-3">
                        {rec.action}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pipeline Clients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Pipeline Clients avec Score IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clientsPipeline.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-blue-800">{client.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{client.name}</h4>
                          <p className="text-sm text-gray-600">{client.preference} • {client.budget}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            <Badge className="text-xs bg-blue-100 text-blue-800">{client.stage}</Badge>
                            {client.blockchainReady && (
                              <Badge className="text-xs bg-yellow-100 text-yellow-800">🔗 Blockchain Ready</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium mr-2">Score IA:</span>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${
                            client.aiScore >= 80 ? 'bg-green-100 text-green-800' :
                            client.aiScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {client.aiScore}%
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{client.lastContact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients IA */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  CRM Intelligent avec IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">🤖 Insights IA du Jour</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-700">7</p>
                        <p className="text-sm text-blue-600">Leads chauds détectés</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-700">3</p>
                        <p className="text-sm text-blue-600">Clients prêts à signer</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-700">12</p>
                        <p className="text-sm text-blue-600">Rappels recommandés</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-4">Actions Prioritaires IA</h4>
                      <div className="space-y-3">
                        <div className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                          <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                          <div>
                            <p className="font-medium text-red-900">Appeler Moussa Ba</p>
                            <p className="text-sm text-red-700">Lead très chaud, score 92%</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                          <div>
                            <p className="font-medium text-yellow-900">Follow-up Aissatou Diop</p>
                            <p className="text-sm text-yellow-700">En négociation depuis 3 jours</p>
                          </div>
                        </div>
                        <div className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                          <div>
                            <p className="font-medium text-green-900">Proposer blockchain à Omar</p>
                            <p className="text-sm text-green-700">Profil parfait pour NFT</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Analyse Comportementale</h4>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Préférences Détectées</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Zones premium (Almadies, Mermoz)</span>
                              <span className="font-medium">68%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Budget 20-50M FCFA</span>
                              <span className="font-medium">45%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Intérêt blockchain/NFT</span>
                              <span className="font-medium">23%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blockchain */}
          <TabsContent value="blockchain" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Transactions Blockchain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {blockchainActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.property}</p>
                          <div className="flex items-center mt-1 space-x-4 text-sm text-gray-600">
                            <span>Client: {activity.client}</span>
                            <span>{activity.timestamp}</span>
                          </div>
                          <p className="text-sm font-medium text-green-600 mt-1">
                            Commission: {activity.commission}
                          </p>
                        </div>
                        <Badge className={
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
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
                    <Coins className="w-5 h-5 mr-2" />
                    Revenus Blockchain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-2">Commissions NFT ce Mois</h3>
                      <p className="text-3xl font-bold text-yellow-700">{(agentStats.nftCommissions / 1000).toFixed(0)}K FCFA</p>
                      <p className="text-sm text-yellow-600 mt-1">+300% vs mois dernier</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">NFT Vendus</span>
                          <span className="text-sm font-bold">{agentStats.blockchainDeals}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Smart Contracts Actifs</span>
                          <span className="text-sm font-bold">8</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Conversion Blockchain</span>
                          <span className="text-sm font-bold">23%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '23%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Autres onglets... */}
          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion Propriétés Blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Interface de gestion des propriétés avec tokenisation NFT...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tracking Commissions</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Suivi détaillé des commissions classiques et blockchain...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Métriques de performance avec insights IA...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAgentFoncierDashboard;
