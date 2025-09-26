import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building, 
  BarChart3, 
  PieChart,
  Target,
  Calendar,
  MapPin,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Filter,
  Download
} from 'lucide-react';
// Layout géré par CompleteSidebarInvestisseurDashboard

const InvestisseurOverview = () => {
  const [timeframe, setTimeframe] = useState('30d');

  // Données du portefeuille
  const portfolioStats = {
    totalValue: 2850000,
    monthlyGrowth: 8.5,
    totalInvestments: 12,
    activeProjects: 8,
    monthlyReturn: 125000,
    yearlyReturn: 15.2
  };

  // Investissements actifs
  const activeInvestments = [
    {
      id: 1,
      title: 'Résidence Les Almadies',
      location: 'Almadies, Dakar',
      type: 'Résidentiel',
      invested: 450000,
      currentValue: 485000,
      roi: 7.8,
      status: 'En construction',
      completion: 65,
      expectedReturn: 18.5,
      timeframe: '24 mois'
    },
    {
      id: 2,
      title: 'Centre Commercial Liberté 6',
      location: 'Liberté 6, Dakar',
      type: 'Commercial',
      invested: 800000,
      currentValue: 920000,
      roi: 15.0,
      status: 'Opérationnel',
      completion: 100,
      expectedReturn: 22.0,
      timeframe: '36 mois'
    },
    {
      id: 3,
      title: 'Lotissement Diamaguène',
      location: 'Diamaguène, Sicap',
      type: 'Foncier',
      invested: 320000,
      currentValue: 385000,
      roi: 20.3,
      status: 'Disponible',
      completion: 100,
      expectedReturn: 25.0,
      timeframe: '18 mois'
    }
  ];

  // Opportunités récentes
  const recentOpportunities = [
    {
      id: 1,
      title: 'Villa Moderne VDN',
      location: 'VDN, Dakar',
      type: 'Résidentiel',
      minInvestment: 200000,
      expectedRoi: 16.5,
      duration: '30 mois',
      riskLevel: 'Modéré',
      status: 'Nouveau'
    },
    {
      id: 2,
      title: 'Entrepôt Industriel Rufisque',
      location: 'Rufisque',
      type: 'Industriel',
      minInvestment: 500000,
      expectedRoi: 19.2,
      duration: '42 mois',
      riskLevel: 'Élevé',
      status: 'En cours'
    }
  ];

  // Activités récentes
  const recentActivities = [
    {
      id: 1,
      type: 'investment',
      title: 'Nouvel investissement',
      description: 'Résidence Les Almadies - 450K XOF',
      time: '2 heures',
      amount: 450000,
      positive: false
    },
    {
      id: 2,
      type: 'return',
      title: 'Retour sur investissement',
      description: 'Centre Commercial Liberté 6 - Dividendes Q4',
      time: '1 jour',
      amount: 85000,
      positive: true
    },
    {
      id: 3,
      type: 'sale',
      title: 'Vente réalisée',
      description: 'Terrain Yoff - Plus-value',
      time: '3 jours',
      amount: 150000,
      positive: true
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En construction': return 'bg-blue-100 text-blue-800';
      case 'Opérationnel': return 'bg-green-100 text-green-800';
      case 'Disponible': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Faible': return 'bg-green-100 text-green-800';
      case 'Modéré': return 'bg-yellow-100 text-yellow-800';
      case 'Élevé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* En-tête avec statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Portefeuille Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(portfolioStats.totalValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{portfolioStats.monthlyGrowth}%
                </span>
                <span className="text-sm text-gray-500 ml-1">ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Investissements</p>
                  <p className="text-2xl font-bold text-gray-900">{portfolioStats.totalInvestments}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">
                  {portfolioStats.activeProjects} projets actifs
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rendement Mensuel</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(portfolioStats.monthlyReturn)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{portfolioStats.yearlyReturn}%
                </span>
                <span className="text-sm text-gray-500 ml-1">annuel</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Performance</p>
                  <p className="text-2xl font-bold text-gray-900">{portfolioStats.yearlyReturn}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={portfolioStats.yearlyReturn * 5} className="h-2" />
                <span className="text-sm text-gray-600 mt-1">Objectif: 18%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investissements actifs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mes Investissements Actifs</CardTitle>
                    <CardDescription>
                      Performance de vos investissements en cours
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Tout voir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeInvestments.map((investment) => (
                    <motion.div
                      key={investment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{investment.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {investment.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(investment.status)}>
                            {investment.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{investment.type}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Investi</p>
                          <p className="font-semibold">{formatCurrency(investment.invested)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Valeur actuelle</p>
                          <p className="font-semibold">{formatCurrency(investment.currentValue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ROI actuel</p>
                          <p className="font-semibold text-green-600">+{investment.roi}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ROI attendu</p>
                          <p className="font-semibold">{investment.expectedReturn}%</p>
                        </div>
                      </div>

                      {investment.status === 'En construction' && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progression</span>
                            <span className="font-medium">{investment.completion}%</span>
                          </div>
                          <Progress value={investment.completion} className="h-2" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Opportunités récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Nouvelles Opportunités
                  <Badge variant="secondary">2 nouvelles</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{opportunity.title}</h4>
                        {opportunity.status === 'Nouveau' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{opportunity.location}</p>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Min. investissement:</span>
                          <span className="font-medium">{formatCurrency(opportunity.minInvestment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">ROI attendu:</span>
                          <span className="font-medium text-green-600">{opportunity.expectedRoi}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Durée:</span>
                          <span className="font-medium">{opportunity.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Risque:</span>
                          <Badge className={`${getRiskColor(opportunity.riskLevel)} text-xs`}>
                            {opportunity.riskLevel}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full mt-3">
                        <Plus className="w-3 h-3 mr-1" />
                        Investir
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activités récentes */}
            <Card>
              <CardHeader>
                <CardTitle>Activités Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.positive ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.positive ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          activity.positive ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {activity.positive ? '+' : '-'}{formatCurrency(activity.amount)}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Gérez rapidement vos investissements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col">
                <Plus className="w-6 h-6 mb-2" />
                Nouvel Investissement
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <BarChart3 className="w-6 h-6 mb-2" />
                Analyser Marché
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Download className="w-6 h-6 mb-2" />
                Exporter Rapport
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Calendar className="w-6 h-6 mb-2" />
                Planifier RDV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestisseurOverview;