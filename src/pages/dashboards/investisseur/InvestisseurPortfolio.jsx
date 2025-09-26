import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Building, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Users, 
  Eye, 
  Download, 
  Filter,
  Search,
  Plus,
  BarChart3,
  PieChart,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Briefcase
} from 'lucide-react';
// Layout géré par CompleteSidebarInvestisseurDashboard

const InvestisseurPortfolio = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Portfolio complet
  const portfolioSummary = {
    totalValue: 2850000,
    totalInvested: 2400000,
    totalGains: 450000,
    averageRoi: 18.75,
    activeInvestments: 12,
    completedInvestments: 8
  };

  // Répartition par type
  const allocationData = [
    { type: 'Résidentiel', value: 1200000, percentage: 42.1, color: 'bg-blue-500' },
    { type: 'Commercial', value: 850000, percentage: 29.8, color: 'bg-green-500' },
    { type: 'Foncier', value: 520000, percentage: 18.2, color: 'bg-purple-500' },
    { type: 'Industriel', value: 280000, percentage: 9.9, color: 'bg-orange-500' }
  ];

  // Tous les investissements
  const allInvestments = [
    {
      id: 1,
      title: 'Résidence Les Almadies',
      location: 'Almadies, Dakar',
      type: 'Résidentiel',
      status: 'En construction',
      dateInvestment: '2024-01-15',
      invested: 450000,
      currentValue: 485000,
      roi: 7.8,
      expectedRoi: 18.5,
      completion: 65,
      nextMilestone: 'Fin de gros œuvre - Mars 2025',
      riskLevel: 'Modéré',
      duration: '24 mois'
    },
    {
      id: 2,
      title: 'Centre Commercial Liberté 6',
      location: 'Liberté 6, Dakar',
      type: 'Commercial',
      status: 'Opérationnel',
      dateInvestment: '2023-08-10',
      invested: 800000,
      currentValue: 920000,
      roi: 15.0,
      expectedRoi: 22.0,
      completion: 100,
      monthlyRevenue: 45000,
      occupancyRate: 95,
      riskLevel: 'Faible',
      duration: '36 mois'
    },
    {
      id: 3,
      title: 'Lotissement Diamaguène',
      location: 'Diamaguène, Sicap',
      type: 'Foncier',
      status: 'Disponible',
      dateInvestment: '2023-12-05',
      invested: 320000,
      currentValue: 385000,
      roi: 20.3,
      expectedRoi: 25.0,
      completion: 100,
      lotsTotal: 15,
      lotsSold: 8,
      riskLevel: 'Modéré',
      duration: '18 mois'
    },
    {
      id: 4,
      title: 'Entrepôt Rufisque',
      location: 'Rufisque',
      type: 'Industriel',
      status: 'En construction',
      dateInvestment: '2024-03-01',
      invested: 280000,
      currentValue: 295000,
      roi: 5.4,
      expectedRoi: 19.2,
      completion: 40,
      nextMilestone: 'Installation équipements - Avril 2025',
      riskLevel: 'Élevé',
      duration: '30 mois'
    },
    {
      id: 5,
      title: 'Villa Duplex VDN',
      location: 'VDN, Dakar',
      type: 'Résidentiel',
      status: 'Vendu',
      dateInvestment: '2023-05-20',
      dateSale: '2024-11-15',
      invested: 650000,
      salePrice: 780000,
      roi: 20.0,
      riskLevel: 'Faible',
      duration: '18 mois'
    }
  ];

  const filteredInvestments = allInvestments.filter(investment => {
    const matchesType = filterType === 'all' || investment.type.toLowerCase() === filterType.toLowerCase();
    const matchesSearch = investment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investment.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

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
      case 'Vendu': return 'bg-gray-100 text-gray-800';
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'En construction': return <Clock className="w-4 h-4" />;
      case 'Opérationnel': return <CheckCircle className="w-4 h-4" />;
      case 'Disponible': return <Building className="w-4 h-4" />;
      case 'Vendu': return <Target className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* En-tête du portefeuille */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(portfolioSummary.totalValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">
                    +{formatCurrency(portfolioSummary.totalGains)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Plus-value totale</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">ROI Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{portfolioSummary.averageRoi}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={portfolioSummary.averageRoi * 4} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Performance excellent</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Investissements Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{portfolioSummary.activeInvestments}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {portfolioSummary.completedInvestments} investissements terminés
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Capital Investi</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(portfolioSummary.totalInvested)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Rendement global positif</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des investissements */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mon Portefeuille Détaillé</CardTitle>
                    <CardDescription>
                      Tous vos investissements et leur performance
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Exporter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filtres et recherche */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un investissement..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant={filterType === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('all')}
                    >
                      Tous
                    </Button>
                    <Button
                      variant={filterType === 'résidentiel' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('résidentiel')}
                    >
                      Résidentiel
                    </Button>
                    <Button
                      variant={filterType === 'commercial' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('commercial')}
                    >
                      Commercial
                    </Button>
                    <Button
                      variant={filterType === 'foncier' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilterType('foncier')}
                    >
                      Foncier
                    </Button>
                  </div>
                </div>

                {/* Liste des investissements */}
                <div className="space-y-4">
                  {filteredInvestments.map((investment) => (
                    <motion.div
                      key={investment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {getStatusIcon(investment.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{investment.title}</h3>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-1" />
                              {investment.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(investment.status)}>
                            {investment.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{investment.type}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Investi</p>
                          <p className="font-semibold">{formatCurrency(investment.invested)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            {investment.status === 'Vendu' ? 'Prix de vente' : 'Valeur actuelle'}
                          </p>
                          <p className="font-semibold">
                            {formatCurrency(investment.salePrice || investment.currentValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ROI</p>
                          <p className="font-semibold text-green-600">+{investment.roi}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Durée</p>
                          <p className="font-semibold">{investment.duration}</p>
                        </div>
                      </div>

                      {/* Informations spécifiques selon le statut */}
                      {investment.status === 'En construction' && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progression</span>
                            <span className="font-medium">{investment.completion}%</span>
                          </div>
                          <Progress value={investment.completion} className="h-2 mb-2" />
                          <p className="text-xs text-blue-600">{investment.nextMilestone}</p>
                        </div>
                      )}

                      {investment.status === 'Opérationnel' && (
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Revenus mensuels</p>
                            <p className="font-semibold text-green-600">
                              {formatCurrency(investment.monthlyRevenue)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Taux d'occupation</p>
                            <p className="font-semibold">{investment.occupancyRate}%</p>
                          </div>
                        </div>
                      )}

                      {investment.status === 'Disponible' && investment.lotsTotal && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Lots vendus</span>
                            <span className="font-medium">{investment.lotsSold}/{investment.lotsTotal}</span>
                          </div>
                          <Progress 
                            value={(investment.lotsSold / investment.lotsTotal) * 100} 
                            className="h-2 mt-1" 
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getRiskColor(investment.riskLevel)} text-xs`}>
                            Risque {investment.riskLevel}
                          </Badge>
                          {investment.expectedRoi && (
                            <span className="text-xs text-gray-500">
                              ROI attendu: {investment.expectedRoi}%
                            </span>
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Répartition du portefeuille */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Type</CardTitle>
                <CardDescription>
                  Diversification de votre portefeuille
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allocationData.map((item) => (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-sm text-gray-600">{item.percentage}%</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={item.percentage} className="flex-1 h-2" />
                        <span className="text-sm font-medium min-w-0">
                          {formatCurrency(item.value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel Investissement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyser Performance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Rapport Mensuel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestisseurPortfolio;