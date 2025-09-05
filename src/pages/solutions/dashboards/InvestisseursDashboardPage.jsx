import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  TrendingUp, 
  ShieldCheck, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Target, 
  Bell, 
  Calendar, 
  Filter, 
  Eye, 
  Search, 
  AlertCircle, 
  ExternalLink, 
  FileSearch, 
  Users, 
  Download, 
  PlusCircle, 
  Crown, 
  Zap, 
  Star, 
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';


// =====================================================
// DASHBOARD INVESTISSEURS MODERNISÉ - TERANGA FONCIER
// Version Premium avec Analytics Avancés
// =====================================================

// Données simulées pour analytics avancés
const portfolioEvolutionData = [
  { month: 'Jan', value: 850, target: 800, performance: 106 },
  { month: 'Fév', value: 920, target: 850, performance: 108 },
  { month: 'Mar', value: 1150, target: 900, performance: 128 },
  { month: 'Avr', value: 1280, target: 950, performance: 135 },
  { month: 'Mai', value: 1450, target: 1000, performance: 145 },
  { month: 'Jun', value: 1680, target: 1100, performance: 153 }
];

const sectorsData = [
  { name: 'Résidentiel', value: 45, color: '#3B82F6' },
  { name: 'Commercial', value: 30, color: '#10B981' },
  { name: 'Industriel', value: 15, color: '#F59E0B' },
  { name: 'Agricole', value: 10, color: '#EF4444' }
];

const roiComparisonData = [
  { type: 'Résidentiel Dakar', roi: 12.5, risk: 'Faible' },
  { type: 'Commercial Almadies', roi: 18.2, risk: 'Moyen' },
  { type: 'Industriel SAPCO', roi: 22.8, risk: 'Élevé' },
  { type: 'Agricole Thiès', roi: 15.7, risk: 'Moyen' }
];

// Types d'abonnements investisseurs
const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Investisseur Basic',
    price: 75000,
    features: [
      'Portefeuille jusqu\'à 5 investissements',
      'Analytics de base',
      'Alertes opportunités',
      'Support email'
    ]
  },
  premium: {
    name: 'Investisseur Premium', 
    price: 200000,
    features: [
      'Portefeuille illimité',
      'Analytics avancés',
      'Due diligence automatisée',
      'Alertes temps réel',
      'Support prioritaire',
      'Rapports personnalisés'
    ]
  },
  vip: {
    name: 'Fonds d\'Investissement VIP',
    price: 400000,
    features: [
      'Multi-portefeuilles',
      'IA prédictive',
      'API accès',
      'Gestionnaire dédié',
      'Rapports institutionnels',
      'Intégrations bancaires'
    ]
  }
};

const InvestmentValueChart = () => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        <LineChart className="h-4 w-4 text-emerald-600" />
        Évolution Portefeuille
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={portfolioEvolutionData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [
              `${(value/1000).toFixed(0)}M FCFA`, 
              name === 'value' ? 'Valeur' : 'Objectif'
            ]}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#10B981" 
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
          <Area 
            type="monotone" 
            dataKey="target" 
            stroke="#6B7280" 
            strokeDasharray="5 5"
            fillOpacity={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const DiversificationPieChart = () => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        <PieChart className="h-4 w-4 text-blue-600" />
        Diversification Sectorielle
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <RechartsPieChart>
          <Pie
            data={sectorsData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            dataKey="value"
          >
            {sectorsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'Répartition']} />
        </RechartsPieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {sectorsData.map((sector) => (
          <div key={sector.name} className="flex items-center gap-2 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: sector.color }}
            />
            <span>{sector.name}: {sector.value}%</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ROIAnalysisChart = () => (
  <Card className="h-full">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-amber-600" />
        Analyse ROI par Secteur
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={roiComparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" tick={{fontSize: 10}} />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}%`, 'ROI']} />
          <Bar dataKey="roi" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-gray-600 space-y-1">
        {roiComparisonData.map((item) => (
          <div key={item.type} className="flex justify-between">
            <span>{item.type}</span>
            <Badge variant={item.risk === 'Faible' ? 'default' : item.risk === 'Moyen' ? 'secondary' : 'destructive'}>
              {item.risk}
            </Badge>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const InvestisseursDashboardPage = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Données simulées mais réalistes pour investisseurs
  const [dashboardStats, setDashboardStats] = useState({
    totalValue: 1680000000, // 1.68Md FCFA
    activeInvestments: 12,
    monthlyReturn: 15.3, // %
    portfolioGrowth: 24.8, // %
    riskScore: 6.2, // /10
    diversificationIndex: 82 // %
  });

  // Alertes et opportunités
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: 'Résidence Premium Almadies',
      type: 'Résidentiel',
      expectedROI: 18.5,
      investmentMin: 25000000,
      riskLevel: 'Moyen',
      deadline: '2025-09-20'
    },
    {
      id: 2, 
      title: 'Centre Commercial Yeumbeul',
      type: 'Commercial',
      expectedROI: 22.3,
      investmentMin: 50000000,
      riskLevel: 'Élevé', 
      deadline: '2025-09-15'
    },
    {
      id: 3,
      title: 'Complexe Industriel Diamniadio',
      type: 'Industriel',
      expectedROI: 25.7,
      investmentMin: 100000000,
      riskLevel: 'Élevé',
      deadline: '2025-10-01'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState([
    { type: 'buy', description: 'Acquisition terrain Thiès', amount: 15000000, date: '2025-09-01' },
    { type: 'profit', description: 'Dividendes complexe Dakar', amount: 2500000, date: '2025-08-28' },
    { type: 'sell', description: 'Cession partielle Almadies', amount: 32000000, date: '2025-08-25' },
    { type: 'alert', description: 'Nouvelle opportunité détectée', amount: 0, date: '2025-08-20' }
  ]);

  useEffect(() => {
    // Simulation auto-refresh des données
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
      // Légères variations des métriques pour simulation temps réel
      setDashboardStats(prev => ({
        ...prev,
        monthlyReturn: prev.monthlyReturn + (Math.random() - 0.5) * 0.1,
        portfolioGrowth: prev.portfolioGrowth + (Math.random() - 0.5) * 0.2,
        riskScore: Math.max(1, Math.min(10, prev.riskScore + (Math.random() - 0.5) * 0.1))
      }));
    }, 8000);

    setLoading(false);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) return `${(amount/1000000000).toFixed(1)}Md`;
    if (amount >= 1000000) return `${(amount/1000000).toFixed(0)}M`;
    if (amount >= 1000) return `${(amount/1000).toFixed(0)}k`;
    return amount.toString();
  };

  const getROIColor = (roi) => {
    if (roi >= 20) return 'text-green-600';
    if (roi >= 15) return 'text-emerald-600';
    if (roi >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadgeColor = (risk) => {
    switch(risk) {
      case 'Faible': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Élevé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 space-y-6">
      {/* Header avec branding investisseurs */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Dashboard Investisseurs
            </h1>
            <p className="text-emerald-600 font-medium">
              Plateforme d'Investissement Immobilier Premium
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Plan Premium Active
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.safeGlobalToast({ 
              title: "Mise à jour", 
              description: "Données actualisées avec succès" 
            })}
          >
            <Activity className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* KPIs Principaux */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Valeur Portefeuille</p>
                <p className="text-2xl font-bold">{formatCurrency(dashboardStats.totalValue)} FCFA</p>
                <p className="text-xs text-emerald-200">+{dashboardStats.portfolioGrowth.toFixed(1)}% ce mois</p>
              </div>
              <DollarSign className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Investissements</p>
                <p className="text-2xl font-bold">{dashboardStats.activeInvestments}</p>
                <p className="text-xs text-blue-200">Actifs dans portefeuille</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Rendement</p>
                <p className="text-2xl font-bold">{dashboardStats.monthlyReturn.toFixed(1)}%</p>
                <p className="text-xs text-green-200">ROI mensuel moyen</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Risque</p>
                <p className="text-2xl font-bold">{dashboardStats.riskScore.toFixed(1)}/10</p>
                <p className="text-xs text-purple-200">Score de risque</p>
              </div>
              <ShieldCheck className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Diversification</p>
                <p className="text-2xl font-bold">{dashboardStats.diversificationIndex}%</p>
                <p className="text-xs text-amber-200">Index de répartition</p>
              </div>
              <Target className="h-8 w-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-pink-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Alertes</p>
                <p className="text-2xl font-bold">{opportunities.length}</p>
                <p className="text-xs text-red-200">Nouvelles opportunités</p>
              </div>
              <Bell className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analytics Charts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <InvestmentValueChart />
        <DiversificationPieChart />
        <ROIAnalysisChart />
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'opportunities', label: 'Opportunités', icon: Target },
            { id: 'portfolio', label: 'Portefeuille', icon: Briefcase },
            { id: 'analytics', label: 'Analytics', icon: LineChart }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-100 text-emerald-700 shadow-sm'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activité Récente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  Activité Récente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'buy' ? 'bg-green-100 text-green-600' :
                        activity.type === 'sell' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'profit' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {activity.type === 'buy' && <PlusCircle className="h-4 w-4" />}
                        {activity.type === 'sell' && <ExternalLink className="h-4 w-4" />}
                        {activity.type === 'profit' && <DollarSign className="h-4 w-4" />}
                        {activity.type === 'alert' && <Bell className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      {activity.amount > 0 && (
                        <div className="text-right">
                          <p className={`text-sm font-bold ${
                            activity.type === 'profit' || activity.type === 'sell' 
                              ? 'text-green-600' 
                              : 'text-blue-600'
                          }`}>
                            {activity.type === 'profit' || activity.type === 'sell' ? '+' : '-'}
                            {formatCurrency(activity.amount)} FCFA
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Plans d'Abonnement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-amber-600" />
                  Votre Abonnement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                    <div 
                      key={key} 
                      className={`p-4 border-2 rounded-lg transition-all ${
                        key === 'premium' 
                          ? 'border-emerald-500 bg-emerald-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">
                            {formatCurrency(plan.price)} FCFA
                          </p>
                          <p className="text-xs text-gray-500">par mois</p>
                        </div>
                      </div>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {key === 'premium' && (
                        <Badge className="mt-2 bg-emerald-100 text-emerald-800">
                          Abonnement Actuel
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  Opportunités d'Investissement Premium
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunities.map((opp) => (
                  <Card key={opp.id} className="border-l-4 border-l-emerald-500">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{opp.title}</h3>
                          <Badge variant="outline" className="mt-1">
                            {opp.type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">ROI Attendu</span>
                            <span className={`font-bold ${getROIColor(opp.expectedROI)}`}>
                              {opp.expectedROI}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Investissement Min</span>
                            <span className="font-medium">
                              {formatCurrency(opp.investmentMin)} FCFA
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Risque</span>
                            <Badge className={getRiskBadgeColor(opp.riskLevel)}>
                              {opp.riskLevel}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Date limite</span>
                            <span className="text-sm font-medium">{opp.deadline}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Analyser
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileSearch className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'portfolio' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Mon Portefeuille d'Investissements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['Résidentiel - Dakar', 'Commercial - Almadies', 'Industriel - Diamniadio', 'Agricole - Thiès'].map((investment, index) => (
                    <Card key={index} className="bg-gradient-to-br from-gray-50 to-gray-100">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{investment}</h4>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Valeur actuelle</span>
                              <span className="font-bold text-green-600">
                                {formatCurrency(Math.random() * 200000000 + 50000000)} FCFA
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Performance</span>
                              <span className="font-bold text-emerald-600">
                                +{(Math.random() * 20 + 5).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyse de Performance Avancée</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg">
                    <LineChart className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics IA Avancées</h3>
                    <p className="text-gray-600 mb-4">
                      Analyses prédictives et recommandations d'investissement basées sur l'IA
                    </p>
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600">
                      <Zap className="h-4 w-4 mr-2" />
                      Activer l'IA Premium
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rapports Personnalisés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Rapport Mensuel', type: 'PDF', size: '2.3 MB' },
                    { name: 'Analyse Risques', type: 'Excel', size: '1.8 MB' },
                    { name: 'Performance YTD', type: 'PDF', size: '3.1 MB' }
                  ].map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-gray-500">{report.type} • {report.size}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch(activeTab) {
        case 'overview':
            return (
                <>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {kpiData.map((kpi, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-red-500">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-5 w-5 text-red-600" />
                            </CardHeader>
                            <CardContent>
                            <div className="text-2xl font-bold">{kpi.value} <span className="text-sm text-muted-foreground">{kpi.unit}</span></div>
                            {kpi.trend && <p className={`text-xs ${kpi.trendColor}`}>{kpi.trend}</p>}
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2 mt-6">
                        <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center text-red-700 dark:text-red-300"><BarChartHorizontalBig className="mr-2 h-5 w-5"/>Évolution de la Valeur du Portefeuille</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full flex flex-col">
                            <InvestmentValueChart />
                        </CardContent>
                        </Card>
                        <Card className="h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center text-indigo-700 dark:text-indigo-300"><ShieldCheck className="mr-2 h-5 w-5"/>Diversification du Portefeuille</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full flex flex-col">
                            <DiversificationPieChart />
                        </CardContent>
                        </Card>
                    </div>
                </>
            );
        case 'portfolio':
            return (
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5"/>Mon Portefeuille d'Investissements</CardTitle>
                     <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 mt-2">
                        <div className="relative w-full sm:w-auto sm:flex-grow">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Rechercher par nom, zone..." className="pl-8 w-full sm:w-[300px]" onChange={(e) => handleSimulatedAction(`Recherche portefeuille: ${e.target.value}`)} />
                        </div>
                        <Select onValueChange={(value) => handleSimulatedAction(`Filtrage portefeuille par type: ${value}`)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filtrer par type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous types</SelectItem>
                            <SelectItem value="residentiel">Résidentiel</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="agricole">Agricole</SelectItem>
                             <SelectItem value="touristique">Touristique</SelectItem>
                        </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => handleSimulatedAction("Export du portefeuille au format PDF.")}>
                            <Download className="mr-2 h-4 w-4" /> Exporter PDF
                        </Button>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                            <th className="text-left p-2 font-semibold">Nom / Référence</th>
                            <th className="text-left p-2 font-semibold">Zone</th>
                            <th className="text-left p-2 font-semibold">Valeur Actuelle</th>
                            <th className="text-left p-2 font-semibold">Rdt. Annuel Est.</th>
                            <th className="text-left p-2 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolioHighlights.map((item) => (
                            <tr key={item.id} className="border-b hover:bg-muted/30">
                                <td className="p-2 text-primary hover:underline"><Link to={`/parcelles/${item.id}`}>{item.name}</Link></td>
                                <td className="p-2">{item.zone}</td>
                                <td className="p-2">{item.valeurActuelle}</td>
                                <td className="p-2 text-green-600">{item.rendementAnnuelEst}</td>
                                <td className="p-2 space-x-1">
                                <Button variant="outline" size="xs" onClick={() => handleSimulatedAction(`Affichage des détails de performance pour ${item.name}`)}>Performance</Button>
                                <Button variant="ghost" size="xs" onClick={() => handleSimulatedAction(`Affichage des FileTexts pour ${item.name}`)} title="FileTexts">
                                    <FileSearch className="h-3.5 w-3.5"/>
                                </Button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    <Button variant="link" className="mt-4 p-0" onClick={() => handleSimulatedAction("Affichage du portefeuille complet.")}>Voir le portefeuille complet</Button>
                    </CardContent>
                </Card>
            );
        case 'opportunities':
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5"/>Nouvelles Opportunités d'Investissement</CardTitle>
                        <CardDescription>Terrains sélectionnés pour leur potentiel (simulation).</CardDescription>
                        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 mt-2">
                            <Input type="search" placeholder="Rechercher par zone, potentiel..." className="w-full sm:w-[250px]" onChange={(e) => handleSimulatedAction(`Recherche opportunités: ${e.target.value}`)} />
                             <Select onValueChange={(value) => handleSimulatedAction(`Filtrage opportunités par risque: ${value}`)}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Filtrer par risque" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous risques</SelectItem>
                                    <SelectItem value="faible">Faible</SelectItem>
                                    <SelectItem value="moyen">Moyen</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {newOpportunities.map(opp => (
                                <li key={opp.id} className="p-3 bg-muted/30 rounded-md flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                    <div>
                                        <p className="font-medium text-primary">{opp.name} ({opp.zone})</p>
                                        <p className="text-xs text-muted-foreground">Potentiel: {opp.potentiel} | Prix estimé: {opp.prixEst} | Risque: <span className={opp.risque === 'Faible' ? 'text-green-600' : 'text-yellow-600'}>{opp.risque}</span></p>
                                        <p className="text-xs text-muted-foreground">Diligence: {opp.dueDiligenceStatus}</p>
                                    </div>
                                    <div className="flex space-x-2 shrink-0">
                                        <Button size="sm" variant="outline" onClick={() => handleSimulatedAction(`Demande de Due Diligence pour ${opp.name}`)} disabled={opp.dueDiligenceStatus !== 'Demandable'}>Due Diligence</Button>
                                        <Button size="sm" onClick={() => handleSimulatedAction(`Ajout de ${opp.name} à la liste de suivi.`)}><AlertCircle className="mr-1 h-4 w-4"/>Suivre</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <Button variant="link" className="mt-4 p-0" onClick={() => handleSimulatedAction("Affichage de toutes les opportunités.")}>Voir toutes les opportunités</Button>
                    </CardContent>
                </Card>
            );
        default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 md:p-6 lg:p-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <TrendingUp className="h-8 w-8 mr-3 text-red-600"/>
            Tableau de Bord Investisseurs
          </h1>
          <p className="text-muted-foreground">Suivi de portefeuille, analyse de performances et détection d'opportunités.</p>
        </div>
        <Button onClick={() => setActiveTab('opportunities')}>
            <PlusCircle className="mr-2 h-4 w-4"/> Rechercher une Opportunité
        </Button>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['overview', 'portfolio', 'opportunities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab === 'overview' ? 'Vue d\'ensemble' : tab === 'portfolio' ? 'Mon Portefeuille Actif' : 'Nouvelles Opportunités'}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="mt-6">
        {renderTabContent()}
      </div>

    </motion.div>
  );
};

export default InvestisseursDashboardPage;
