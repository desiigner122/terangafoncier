import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Calendar,
  Download,
  Filter,
  Eye,
  Building,
  Users,
  Percent,
  Target,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calculator,
  FileText,
  CreditCard,
  Wallet,
  TrendingDown
} from 'lucide-react';

const PromoteurFinances = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  // Données financières principales
  const financialData = {
    totalRevenue: 2800000000,
    totalCosts: 1950000000,
    netProfit: 850000000,
    profitMargin: 30.36,
    monthlyGrowth: 12.5,
    cashFlow: 450000000,
    pendingPayments: 320000000,
    expenses: 185000000,
    taxes: 127500000,
    investments: 520000000
  };

  // Revenus par projet
  const projectRevenues = [
    {
      id: 1,
      name: 'Résidence Teranga',
      totalBudget: 2800000000,
      revenue: 1530000000,
      costs: 2100000000,
      profit: -570000000,
      profitMargin: -37.25,
      unitsTotal: 24,
      unitsSold: 18,
      averagePrice: 85000000,
      status: 'En cours',
      completion: 75,
      expectedCompletion: '2025-06-30',
      riskLevel: 'Moyen'
    },
    {
      id: 2,
      name: 'Villa Duplex Mermoz',
      totalBudget: 180000000,
      revenue: 390000000,
      costs: 172000000,
      profit: 218000000,
      profitMargin: 55.9,
      unitsTotal: 8,
      unitsSold: 6,
      averagePrice: 65000000,
      status: 'Terminé',
      completion: 100,
      completedDate: '2024-11-30',
      riskLevel: 'Faible'
    },
    {
      id: 3,
      name: 'Appartements VDN',
      totalBudget: 5200000000,
      revenue: 540000000,
      costs: 2340000000,
      profit: -1800000000,
      profitMargin: -333.33,
      unitsTotal: 36,
      unitsSold: 12,
      averagePrice: 45000000,
      status: 'En cours',
      completion: 45,
      expectedCompletion: '2025-12-15',
      riskLevel: 'Élevé'
    },
    {
      id: 4,
      name: 'Entrepôt Logistics',
      totalBudget: 1800000000,
      revenue: 0,
      costs: 630000000,
      profit: -630000000,
      profitMargin: 0,
      unitsTotal: 1,
      unitsSold: 0,
      averagePrice: 1800000000,
      status: 'En cours',
      completion: 35,
      expectedCompletion: '2025-08-30',
      riskLevel: 'Élevé'
    }
  ];

  // Flux de trésorerie mensuel
  const cashFlowData = [
    { month: 'Jan', income: 180000000, expenses: 145000000, net: 35000000 },
    { month: 'Fév', income: 220000000, expenses: 165000000, net: 55000000 },
    { month: 'Mar', income: 195000000, expenses: 178000000, net: 17000000 },
    { month: 'Avr', income: 285000000, expenses: 198000000, net: 87000000 },
    { month: 'Mai', income: 320000000, expenses: 215000000, net: 105000000 },
    { month: 'Jun', income: 275000000, expenses: 189000000, net: 86000000 },
    { month: 'Jul', income: 360000000, expenses: 245000000, net: 115000000 },
    { month: 'Aoû', income: 298000000, expenses: 203000000, net: 95000000 },
    { month: 'Sep', income: 415000000, expenses: 278000000, net: 137000000 },
    { month: 'Oct', income: 385000000, expenses: 256000000, net: 129000000 },
    { month: 'Nov', income: 425000000, expenses: 289000000, net: 136000000 },
    { month: 'Déc', income: 380000000, expenses: 265000000, net: 115000000 }
  ];

  // Catégories de dépenses
  const expenseCategories = [
    {
      category: 'Construction',
      amount: 1650000000,
      percentage: 68.4,
      change: -5.2,
      subcategories: [
        { name: 'Matériaux', amount: 890000000 },
        { name: 'Main d\'œuvre', amount: 520000000 },
        { name: 'Équipement', amount: 240000000 }
      ]
    },
    {
      category: 'Marketing & Ventes',
      amount: 185000000,
      percentage: 7.7,
      change: 12.3,
      subcategories: [
        { name: 'Publicité digitale', amount: 85000000 },
        { name: 'Événements', amount: 45000000 },
        { name: 'Commissions', amount: 55000000 }
      ]
    },
    {
      category: 'Administration',
      amount: 125000000,
      percentage: 5.2,
      change: 3.1,
      subcategories: [
        { name: 'Salaires', amount: 85000000 },
        { name: 'Bureaux', amount: 25000000 },
        { name: 'Autres', amount: 15000000 }
      ]
    },
    {
      category: 'Légal & Réglementaire',
      amount: 95000000,
      percentage: 3.9,
      change: 8.7,
      subcategories: [
        { name: 'Permis', amount: 35000000 },
        { name: 'Avocats', amount: 30000000 },
        { name: 'Assurances', amount: 30000000 }
      ]
    },
    {
      category: 'Autres',
      amount: 355000000,
      percentage: 14.8,
      change: -2.1,
      subcategories: [
        { name: 'Maintenance', amount: 155000000 },
        { name: 'Transport', amount: 85000000 },
        { name: 'Divers', amount: 115000000 }
      ]
    }
  ];

  // Créances et dettes
  const receivables = [
    {
      id: 1,
      client: 'Moussa Ba',
      project: 'Résidence Teranga',
      amount: 45000000,
      dueDate: '2024-12-20',
      status: 'En retard',
      daysPastDue: 5,
      type: 'Acompte'
    },
    {
      id: 2,
      client: 'Aminata Diop',
      project: 'Villa Duplex Mermoz',
      amount: 32500000,
      dueDate: '2024-12-25',
      status: 'À venir',
      daysPastDue: 0,
      type: 'Solde final'
    },
    {
      id: 3,
      client: 'Société IMMO Plus',
      project: 'Appartements VDN',
      amount: 135000000,
      dueDate: '2025-01-15',
      status: 'À venir',
      daysPastDue: 0,
      type: 'Paiement échelonné'
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

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'En retard': return 'bg-red-100 text-red-800';
      case 'À venir': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Faible': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Élevé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfitColor = (profit) => {
    return profit >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  return (
    <div className="w-full h-full bg-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion Financière</h1>
            <p className="text-gray-600">Suivi des finances et rentabilité des projets</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{financialData.monthlyGrowth}% ce mois
            </Badge>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Rapport
            </Button>
          </div>
        </div>

        {/* Indicateurs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(financialData.totalRevenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{financialData.monthlyGrowth}% vs mois dernier
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bénéfice Net</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(financialData.netProfit)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={financialData.profitMargin} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">
                  Marge: {financialData.profitMargin}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Flux de Trésorerie</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(financialData.cashFlow)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-purple-600 font-medium">
                  Flux positif
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Créances</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(financialData.pendingPayments)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-orange-600 font-medium">
                  À encaisser
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Projets
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Dépenses
            </TabsTrigger>
            <TabsTrigger value="receivables" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Créances
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution des revenus */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
                  <CardDescription>Performance mensuelle sur 12 mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Graphique des revenus (à intégrer)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Flux de trésorerie */}
              <Card>
                <CardHeader>
                  <CardTitle>Flux de Trésorerie</CardTitle>
                  <CardDescription>Entrées vs sorties mensuelles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cashFlowData.slice(-6).map((month) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 text-sm font-medium">{month.month}</div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-green-600">
                                +{formatCurrency(month.income)}
                              </span>
                              <span className="text-red-600">
                                -{formatCurrency(month.expenses)}
                              </span>
                            </div>
                            <Progress 
                              value={(month.income / Math.max(...cashFlowData.map(m => m.income))) * 100} 
                              className="h-2" 
                            />
                          </div>
                        </div>
                        <div className={`font-semibold ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(month.net)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertes financières */}
            <Card>
              <CardHeader>
                <CardTitle>Alertes Financières</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-red-800">Créance en retard</p>
                      <p className="text-sm text-red-600">
                        {formatCurrency(45000000)} de Moussa Ba en retard de 5 jours
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Relancer
                    </Button>
                  </div>
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-yellow-800">Budget dépassé</p>
                      <p className="text-sm text-yellow-600">
                        Projet Appartements VDN: +15% du budget initial
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Analyser
                    </Button>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">Objectif atteint</p>
                      <p className="text-sm text-blue-600">
                        Marge bénéficiaire de 30% atteinte ce mois
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rentabilité par projet */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Rentabilité par Projet</CardTitle>
                  <Button variant="outline" size="sm">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculateur ROI
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projectRevenues.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {project.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            <Badge className={getRiskColor(project.riskLevel)}>
                              Risque {project.riskLevel}
                            </Badge>
                            <Badge className="bg-gray-100 text-gray-800">
                              {project.completion}% terminé
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {project.unitsSold}/{project.unitsTotal} unités vendues
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getProfitColor(project.profit)}`}>
                            {formatCurrency(project.profit)}
                          </p>
                          <p className="text-sm text-gray-500">Bénéfice actuel</p>
                          <p className={`text-sm font-medium ${getProfitColor(project.profit)}`}>
                            Marge: {formatPercentage(project.profitMargin)}
                          </p>
                        </div>
                      </div>

                      {/* Métriques financières */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-lg font-bold text-blue-600">
                            {formatCurrency(project.revenue)}
                          </p>
                          <p className="text-sm text-blue-700">Revenus</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-lg font-bold text-red-600">
                            {formatCurrency(project.costs)}
                          </p>
                          <p className="text-sm text-red-700">Coûts</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-600">
                            {formatCurrency(project.totalBudget)}
                          </p>
                          <p className="text-sm text-gray-700">Budget total</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(project.averagePrice)}
                          </p>
                          <p className="text-sm text-green-700">Prix moyen</p>
                        </div>
                      </div>

                      {/* Progression */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progression du projet</span>
                          <span className="font-medium">{project.completion}%</span>
                        </div>
                        <Progress value={project.completion} className="h-3" />
                      </div>

                      {/* Analyse */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">ROI projeté</p>
                            <p className={`font-semibold ${getProfitColor(project.profit)}`}>
                              {formatPercentage(project.profitMargin)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Temps restant</p>
                            <p className="font-semibold">
                              {project.status === 'Terminé' 
                                ? `Terminé le ${new Date(project.completedDate).toLocaleDateString('fr-FR')}`
                                : `Fin prévue: ${new Date(project.expectedCompletion).toLocaleDateString('fr-FR')}`
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Taux de vente</p>
                            <p className="font-semibold">
                              {Math.round((project.unitsSold / project.unitsTotal) * 100)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyse des dépenses */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition des dépenses */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des Dépenses</CardTitle>
                  <CardDescription>Par catégorie</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Graphique en secteurs (à intégrer)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Évolution mensuelle */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des Dépenses</CardTitle>
                  <CardDescription>Tendance mensuelle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Graphique linéaire (à intégrer)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Détail des catégories */}
            <Card>
              <CardHeader>
                <CardTitle>Détail des Catégories de Dépenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900">{category.category}</h3>
                          <div className="flex items-center">
                            {getChangeIcon(category.change)}
                            <span className={`text-sm font-medium ml-1 ${
                              category.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatPercentage(category.change)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-gray-900">
                            {formatCurrency(category.amount)}
                          </p>
                          <p className="text-sm text-gray-500">{category.percentage}% du total</p>
                        </div>
                      </div>
                      
                      <Progress value={category.percentage} className="h-2 mb-3" />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        {category.subcategories.map((sub, subIndex) => (
                          <div key={subIndex} className="flex justify-between">
                            <span className="text-gray-600">{sub.name}:</span>
                            <span className="font-medium">{formatCurrency(sub.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Créances */}
          <TabsContent value="receivables" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Créances en Cours</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {formatCurrency(financialData.pendingPayments)} à encaisser
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {receivables.map((receivable) => (
                    <motion.div
                      key={receivable.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {receivable.client.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {receivable.client}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {receivable.project} - {receivable.type}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(receivable.status)}>
                                {receivable.status}
                              </Badge>
                              {receivable.daysPastDue > 0 && (
                                <Badge className="bg-red-100 text-red-800">
                                  {receivable.daysPastDue} jours de retard
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600 mb-1">
                            {formatCurrency(receivable.amount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Échéance: {new Date(receivable.dueDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="text-sm text-gray-600">
                          {receivable.status === 'En retard' && (
                            <span className="text-red-600 font-medium">
                              Action requise: Relance client
                            </span>
                          )}
                          {receivable.status === 'À venir' && (
                            <span className="text-blue-600">
                              Paiement prévu dans {Math.ceil((new Date(receivable.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} jours
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                          {receivable.status === 'En retard' && (
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                              Relancer
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Résumé des créances */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé des Créances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(167500000)}
                    </p>
                    <p className="text-sm text-green-700">À venir</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(45000000)}
                    </p>
                    <p className="text-sm text-red-700">En retard</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(107500000)}
                    </p>
                    <p className="text-sm text-blue-700">Encaissé ce mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PromoteurFinances;