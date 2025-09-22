import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Target,
  FileText,
  MapPin,
  Calendar,
  Users,
  Calculator,
  Eye,
  Heart,
  Filter,
  Search,
  Building2,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const ModernInvestisseurDashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      portfolioValue: 850000000,
      activeInvestments: 12,
      monthlyReturn: 8.5,
      projectsTracked: 28,
      totalProfit: 125000000,
      riskScore: 6.8
    },
    portfolio: [
      {
        id: 1,
        name: 'Résidence Les Palmiers',
        type: 'Résidentiel',
        location: 'Almadies, Dakar',
        investment: 150000000,
        currentValue: 185000000,
        roi: 23.3,
        status: 'En cours',
        progress: 75
      },
      {
        id: 2,
        name: 'Centre Commercial Teranga',
        type: 'Commercial',
        location: 'Plateau, Dakar',
        investment: 300000000,
        currentValue: 340000000,
        roi: 13.3,
        status: 'Terminé',
        progress: 100
      },
      {
        id: 3,
        name: 'Lotissement Moderne Thiès',
        type: 'Foncier',
        location: 'Thiès',
        investment: 80000000,
        currentValue: 95000000,
        roi: 18.8,
        status: 'En cours',
        progress: 60
      }
    ],
    opportunities: [
      {
        id: 1,
        title: 'Complexe Résidentiel Premium',
        location: 'Mermoz, Dakar',
        expectedRoi: 22,
        duration: '18 mois',
        minInvestment: 50000000,
        riskLevel: 'Modéré',
        promoter: 'Sahel Construction'
      },
      {
        id: 2,
        title: 'Parc Industriel Sénégal',
        location: 'Diamniadio',
        expectedRoi: 28,
        duration: '24 mois',
        minInvestment: 100000000,
        riskLevel: 'Élevé',
        promoter: 'Industrial Development Corp'
      }
    ]
  });

  useEffect(() => {
    // Simulation chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const stats = [
    { value: `${(dashboardData.stats.portfolioValue / 1000000).toFixed(0)}M`, label: 'Portfolio (FCFA)' },
    { value: dashboardData.stats.activeInvestments, label: 'Investissements Actifs' },
    { value: `${dashboardData.stats.monthlyReturn}%`, label: 'Rendement Mensuel' },
    { value: dashboardData.stats.projectsTracked, label: 'Projets Suivis' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'En cours': 'bg-blue-500',
      'Terminé': 'bg-green-500',
      'Planifié': 'bg-yellow-500',
      'Suspendu': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Faible': 'text-green-600 bg-green-100',
      'Modéré': 'text-yellow-600 bg-yellow-100',
      'Élevé': 'text-red-600 bg-red-100'
    };
    return colors[risk] || 'text-gray-600 bg-gray-100';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Portfolio Investisseur"
      subtitle="Gestion & Analyse des Investissements"
      userRole="Investisseur"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Investisseur" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Investisseur" />
        </div>

        {/* Status & Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Performance */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Profit Total</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(dashboardData.stats.totalProfit)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Risk Score */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Score de Risque</p>
                  <p className="text-lg font-bold text-purple-600">
                    {dashboardData.stats.riskScore}/10
                  </p>
                </div>
                <Target className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          {/* Calculator */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Calculateur ROI</p>
                  <Button size="sm" variant="outline" className="mt-1">
                    <Calculator className="h-4 w-4 mr-1" />
                    Ouvrir
                  </Button>
                </div>
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
            <TabsTrigger value="analyses">Analyses</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-purple-600" />
                    Mes Investissements Actifs
                  </CardTitle>
                  <CardDescription>
                    Suivi en temps réel de vos investissements immobiliers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.portfolio.map((investment) => (
                      <div key={investment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{investment.name}</h3>
                            <p className="text-gray-600 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {investment.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(investment.status)} text-white`}>
                              {investment.status}
                            </Badge>
                            <p className="text-sm text-gray-500 mt-1">{investment.type}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-500">Investissement</p>
                            <p className="font-semibold">{formatCurrency(investment.investment)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Valeur Actuelle</p>
                            <p className="font-semibold text-green-600">{formatCurrency(investment.currentValue)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">ROI</p>
                            <p className="font-semibold text-blue-600">+{investment.roi}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Progression</p>
                            <Progress value={investment.progress} className="mt-1" />
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            Rapports
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-orange-600" />
                  Nouvelles Opportunités
                </CardTitle>
                <CardDescription>
                  Découvrez des projets d'investissement sélectionnés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.opportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{opportunity.title}</h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {opportunity.location}
                          </p>
                          <p className="text-sm text-gray-500">Par {opportunity.promoter}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getRiskColor(opportunity.riskLevel)}>
                            {opportunity.riskLevel}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">ROI Attendu</p>
                          <p className="font-semibold text-green-600">{opportunity.expectedRoi}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Durée</p>
                          <p className="font-semibold">{opportunity.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Investissement Min.</p>
                          <p className="font-semibold">{formatCurrency(opportunity.minInvestment)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Risque</p>
                          <p className="font-semibold">{opportunity.riskLevel}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <DollarSign className="h-4 w-4 mr-1" />
                          Investir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          En savoir plus
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4 mr-1" />
                          Suivre
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyses Tab */}
          <TabsContent value="analyses" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Performance Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>ROI Moyen</span>
                      <span className="font-semibold text-green-600">18.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Diversification</span>
                      <span className="font-semibold">Élevée</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Risque Global</span>
                      <span className="font-semibold text-yellow-600">Modéré</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-green-600" />
                    Répartition Secteurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Résidentiel</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Commercial</span>
                      <span className="font-semibold">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Foncier</span>
                      <span className="font-semibold">20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Investisseur</CardTitle>
                <CardDescription>
                  Configurez vos préférences d'investissement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Seuil de Risque Acceptable</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Faible (1-3)</option>
                      <option>Modéré (4-7)</option>
                      <option>Élevé (8-10)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Secteur Préféré</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Résidentiel</option>
                      <option>Commercial</option>
                      <option>Industriel</option>
                      <option>Foncier</option>
                    </select>
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Sauvegarder les Paramètres
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ModernInvestisseurDashboard;
