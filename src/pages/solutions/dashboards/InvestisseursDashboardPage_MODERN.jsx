import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  MapPin, 
  DollarSign, 
  Target,
  Calendar,
  FileText,
  Bell,
  Search,
  Filter,
  Eye,
  Heart,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Building,
  Landmark,
  Wallet,
  CreditCard,
  Globe,
  Award,
  ChevronRight,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const InvestisseursDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('6m');

  // État des données du dashboard
  const [dashboardData, setDashboardData] = useState({
    portfolio: {
      totalValue: 45750000, // 45.75M XOF
      totalReturn: 12.5,
      monthlyReturn: 2.1,
      properties: 8,
      transactions: 15
    },
    opportunities: [],
    recentActivity: [],
    marketTrends: [],
    regionPerformance: [],
    notifications: []
  });

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Simulation de chargement des données
    setTimeout(() => {
      setDashboardData({
        portfolio: {
          totalValue: 45750000,
          totalReturn: 12.5,
          monthlyReturn: 2.1,
          properties: 8,
          transactions: 15
        },
        opportunities: [
          {
            id: 1,
            title: "Terrain Résidentiel Almadies",
            location: "Almadies, Dakar",
            price: 25000000,
            expectedReturn: 15.2,
            risk: "Faible",
            area: "500m²",
            type: "Résidentiel",
            status: "Nouveau",
            image: "/api/placeholder/300/200"
          },
          {
            id: 2,
            title: "Lotissement Commercial Mbour",
            location: "Mbour, Thiès",
            price: 18500000,
            expectedReturn: 18.7,
            risk: "Modéré",
            area: "1200m²",
            type: "Commercial",
            status: "Hot",
            image: "/api/placeholder/300/200"
          },
          {
            id: 3,
            title: "Terrain Agricole Kaolack",
            location: "Kaolack",
            price: 8750000,
            expectedReturn: 22.3,
            risk: "Élevé",
            area: "2.5 hectares",
            type: "Agricole",
            status: "Tendance",
            image: "/api/placeholder/300/200"
          }
        ],
        recentActivity: [
          {
            id: 1,
            type: "purchase",
            description: "Acquisition terrain Parcelles Assainies",
            amount: 15000000,
            date: "2024-09-01",
            status: "completed"
          },
          {
            id: 2,
            type: "evaluation",
            description: "Réévaluation portfolio Q3",
            amount: 2800000,
            date: "2024-08-28",
            status: "gain"
          },
          {
            id: 3,
            type: "dividend",
            description: "Dividendes projet Villa Moderne",
            amount: 750000,
            date: "2024-08-25",
            status: "received"
          }
        ],
        marketTrends: [
          { month: 'Jan', dakar: 15.2, thies: 12.1, regions: 8.5 },
          { month: 'Fév', dakar: 16.1, thies: 13.2, regions: 9.1 },
          { month: 'Mar', dakar: 14.8, thies: 12.8, regions: 8.9 },
          { month: 'Avr', dakar: 17.2, thies: 14.5, regions: 10.2 },
          { month: 'Mai', dakar: 18.1, thies: 15.1, regions: 11.1 },
          { month: 'Jun', dakar: 19.3, thies: 16.2, regions: 12.3 }
        ],
        regionPerformance: [
          { name: 'Dakar', value: 35, growth: 8.2 },
          { name: 'Thiès', value: 25, growth: 6.5 },
          { name: 'Saint-Louis', value: 15, growth: 12.1 },
          { name: 'Autres', value: 25, growth: 5.8 }
        ],
        notifications: [
          {
            id: 1,
            type: "opportunity",
            title: "Nouvelle opportunité à Saly",
            message: "Terrain 800m² avec potentiel touristique",
            time: "Il y a 2h"
          },
          {
            id: 2,
            type: "market",
            title: "Marché Dakar en hausse",
            message: "+3.2% ce mois dans la région de Dakar",
            time: "Il y a 5h"
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                Dashboard Investisseur
              </h1>
              <p className="text-gray-600 mt-1">Gérez votre portfolio immobilier foncier</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Search className="w-4 h-4 mr-2" />
                Nouvelles Opportunités
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Valeur Portfolio</p>
                  <p className="text-2xl font-bold">{formatCurrency(dashboardData.portfolio.totalValue)}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    <span className="text-sm">+{dashboardData.portfolio.totalReturn}%</span>
                  </div>
                </div>
                <Wallet className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Propriétés</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.portfolio.properties}</p>
                  <p className="text-green-600 text-sm font-medium">Actives</p>
                </div>
                <Building className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Rendement Mensuel</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.portfolio.monthlyReturn}%</p>
                  <p className="text-green-600 text-sm font-medium">Ce mois</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.portfolio.transactions}</p>
                  <p className="text-blue-600 text-sm font-medium">Total</p>
                </div>
                <Activity className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Notifications</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.notifications.length}</p>
                  <p className="text-amber-600 text-sm font-medium">Nouvelles</p>
                </div>
                <Bell className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-600" />
                      Performance par Région
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dashboardData.marketTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, 'Rendement']} />
                        <Legend />
                        <Line type="monotone" dataKey="dakar" stroke="#10B981" strokeWidth={2} name="Dakar" />
                        <Line type="monotone" dataKey="thies" stroke="#F59E0B" strokeWidth={2} name="Thiès" />
                        <Line type="monotone" dataKey="regions" stroke="#8B5CF6" strokeWidth={2} name="Autres Régions" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Portfolio Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-blue-600" />
                      Répartition Géographique
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={dashboardData.regionPerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {dashboardData.regionPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.type === 'purchase' ? 'bg-blue-100' :
                            activity.type === 'evaluation' ? 'bg-green-100' : 'bg-amber-100'
                          }`}>
                            {activity.type === 'purchase' && <Building className="w-5 h-5 text-blue-600" />}
                            {activity.type === 'evaluation' && <TrendingUp className="w-5 h-5 text-green-600" />}
                            {activity.type === 'dividend' && <DollarSign className="w-5 h-5 text-amber-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{activity.description}</p>
                            <p className="text-sm text-gray-600">{activity.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            activity.status === 'gain' || activity.status === 'received' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {activity.status === 'gain' && '+'}
                            {formatCurrency(activity.amount)}
                          </p>
                          <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                            {activity.status === 'completed' ? 'Terminé' : 
                             activity.status === 'gain' ? 'Gain' : 'Reçu'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="opportunities" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {dashboardData.opportunities.map((opportunity) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={opportunity.image} 
                        alt={opportunity.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge 
                        className={`absolute top-2 right-2 ${
                          opportunity.status === 'Nouveau' ? 'bg-green-500' :
                          opportunity.status === 'Hot' ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                      >
                        {opportunity.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{opportunity.title}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {opportunity.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {opportunity.area} • {opportunity.type}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-2xl font-bold text-emerald-600">
                            {formatCurrency(opportunity.price)}
                          </p>
                          <p className="text-sm text-gray-600">Prix d'achat</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            +{opportunity.expectedReturn}%
                          </p>
                          <p className="text-sm text-gray-600">Rendement prévu</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={
                          opportunity.risk === 'Faible' ? 'default' :
                          opportunity.risk === 'Modéré' ? 'secondary' : 'destructive'
                        }>
                          Risque {opportunity.risk}
                        </Badge>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fonctionnalité de gestion de portfolio en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Avancées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Analytics détaillées en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Notifications Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                Notifications & Alertes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      notification.type === 'opportunity' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default InvestisseursDashboardPage;
