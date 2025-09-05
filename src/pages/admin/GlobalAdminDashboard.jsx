import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Users, 
  MapPin, 
  GitPullRequest, 
  Activity, 
  BarChart, 
  Globe, 
  Brain, 
  Zap, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Monitor, 
  BarChart3, 
  Building2, 
  Landmark, 
  Home, 
  Store, 
  Scale, 
  UserCog, 
  PieChart as PieChartIcon, 
  Target, 
  Lightbulb, 
  Database, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Eye, 
  MessageSquare, 
  Heart, 
  Search, 
  Filter, 
  ArrowUp, 
  ArrowDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { supabase } from '@/lib/customSupabaseClient';

// Couleurs pour les graphiques
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0', '#ffb347'];

// Données simulées pour les pays (en attendant la vraie API)
const WORLD_DATA = [
  { country: 'Sénégal', users: 15420, sessions: 89234, revenue: 245000, flag: '🇸🇳' },
  { country: 'France', users: 8930, sessions: 45120, revenue: 123000, flag: '🇫🇷' },
  { country: 'Mali', users: 6780, sessions: 34560, revenue: 87000, flag: '🇲🇱' },
  { country: 'Burkina Faso', users: 5210, sessions: 28900, revenue: 65000, flag: '🇧🇫' },
  { country: 'Côte d\'Ivoire', users: 4980, sessions: 26780, revenue: 78000, flag: '🇨🇮' },
  { country: 'Canada', users: 3450, sessions: 18900, revenue: 95000, flag: '🇨🇦' },
  { country: 'Espagne', users: 2890, sessions: 15600, revenue: 45000, flag: '🇪🇸' },
  { country: 'Maroc', users: 2340, sessions: 12800, revenue: 34000, flag: '🇲🇦' }
];

// Données IA prédictives simulées
const AI_PREDICTIONS = [
  { metric: 'Croissance utilisateurs', current: '+23%', predicted: '+45%', confidence: 87 },
  { metric: 'Revenus Q4', current: '245K €', predicted: '420K €', confidence: 92 },
  { metric: 'Engagement', current: '68%', predicted: '78%', confidence: 75 },
  { metric: 'Conversion', current: '3.2%', predicted: '4.8%', confidence: 83 }
];

// Données de performance en temps réel
const REAL_TIME_DATA = [
  { time: '00:00', users: 150, transactions: 5, revenue: 1200 },
  { time: '04:00', users: 89, transactions: 2, revenue: 450 },
  { time: '08:00', users: 340, transactions: 12, revenue: 3400 },
  { time: '12:00', users: 520, transactions: 18, revenue: 5600 },
  { time: '16:00', users: 780, transactions: 25, revenue: 8900 },
  { time: '20:00', users: 450, transactions: 15, revenue: 4200 },
  { time: '23:59', users: 210, transactions: 8, revenue: 2100 }
];

const GlobalAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [stats, setStats] = useState({});
  const [aiInsights, setAiInsights] = useState([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({});

  useEffect(() => {
    loadGlobalData();
    // Mise à jour en temps réel toutes les 30 secondes
    const interval = setInterval(loadRealTimeData, 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod, selectedCountry]);

  const loadGlobalData = async () => {
    setLoading(true);
    try {
      // Statistiques globales
      const globalStats = {
        totalUsers: 48590,
        activeUsers: 12340,
        totalRevenue: 892000,
        totalTransactions: 5670,
        conversionRate: 3.2,
        avgSessionTime: '8:34',
        bounceRate: 23.4,
        userGrowth: 23.5
      };

      setStats(globalStats);
      
      // Insights IA simulés (à remplacer par vraie API IA)
      const insights = [
        {
          type: 'success',
          title: 'Opportunité détectée',
          message: 'Le marché sénégalais montre une croissance de 45% ce mois',
          confidence: 92,
          action: 'Augmenter les investissements marketing'
        },
        {
          type: 'warning',
          title: 'Anomalie détectée',
          message: 'Baisse inhabituelle de conversions en France (-12%)',
          confidence: 78,
          action: 'Analyser les performances des pages de conversion'
        },
        {
          type: 'info',
          title: 'Prédiction',
          message: 'Pic d\'activité prévu dans 3 jours (+67% utilisateurs)',
          confidence: 85,
          action: 'Préparer l\'infrastructure serveur'
        }
      ];

      setAiInsights(insights);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    // Simulation de données temps réel
    const metrics = {
      currentUsers: Math.floor(Math.random() * 500) + 200,
      currentSessions: Math.floor(Math.random() * 800) + 300,
      revenueToday: Math.floor(Math.random() * 10000) + 5000,
      transactionsToday: Math.floor(Math.random() * 50) + 20
    };
    setRealTimeMetrics(metrics);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord global...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* En-tête avec contrôles */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Globe className="h-8 w-8 text-blue-600" />
            Dashboard Global Admin
            <Badge variant="secondary" className="ml-2">
              <Brain className="h-4 w-4 mr-1" />
              IA Activée
            </Badge>
          </h1>
          <p className="text-gray-600 mt-1">
            Vue d'ensemble mondiale avec intelligence artificielle • Données en temps réel
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">24h</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🌍 Tous pays</SelectItem>
              {WORLD_DATA.map(country => (
                <SelectItem key={country.country} value={country.country}>
                  {country.flag} {country.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtres avancés
          </Button>
        </div>
      </div>

      {/* Métriques en temps réel */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Utilisateurs actifs</p>
                <p className="text-2xl font-bold">{realTimeMetrics.currentUsers || 347}</p>
                <div className="flex items-center mt-1 text-blue-100 text-xs">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +12% vs hier
                </div>
              </div>
              <Eye className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Revenus aujourd'hui</p>
                <p className="text-2xl font-bold">{realTimeMetrics.revenueToday?.toLocaleString() || '8,945'} €</p>
                <div className="flex items-center mt-1 text-green-100 text-xs">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +8% objectif
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Sessions actives</p>
                <p className="text-2xl font-bold">{realTimeMetrics.currentSessions || 523}</p>
                <div className="flex items-center mt-1 text-purple-100 text-xs">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Temps moyen: 8:34
                </div>
              </div>
              <Activity className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Transactions</p>
                <p className="text-2xl font-bold">{realTimeMetrics.transactionsToday || 34}</p>
                <div className="flex items-center mt-1 text-orange-100 text-xs">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Taux: 3.2%
                </div>
              </div>
              <Target className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Insights Intelligence Artificielle
              <Badge variant="outline" className="ml-auto">
                <Zap className="h-3 w-3 mr-1" />
                Temps réel
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 ${
                    insight.type === 'success' ? 'border-green-500 bg-green-50' :
                    insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {insight.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                        {insight.type === 'info' && <Lightbulb className="h-5 w-5 text-blue-600" />}
                        <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          Confiance: {insight.confidence}%
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-2">{insight.message}</p>
                      <p className="text-sm text-gray-600 font-medium">
                        💡 Action recommandée: {insight.action}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Agir
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Graphiques et analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition mondiale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Répartition Mondiale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {WORLD_DATA.slice(0, 6).map((country, index) => (
                <div key={country.country} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-medium">{country.country}</p>
                      <p className="text-sm text-gray-600">{country.users.toLocaleString()} utilisateurs</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{country.revenue.toLocaleString()} €</p>
                    <p className="text-sm text-gray-600">{country.sessions.toLocaleString()} sessions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Prédictions IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prédictions IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {AI_PREDICTIONS.map((prediction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{prediction.metric}</p>
                    <p className="text-sm text-gray-600">Actuel: {prediction.current}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{prediction.predicted}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Brain className="h-3 w-3" />
                      {prediction.confidence}% confiance
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance en temps réel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Temps Réel (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={REAL_TIME_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="users" 
                  fill="#8884d8" 
                  stroke="#8884d8"
                  fillOpacity={0.3}
                />
                <Bar yAxisId="right" dataKey="transactions" fill="#82ca9d" />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#ff7300" 
                  strokeWidth={3}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Users className="h-6 w-6 mb-2" />
              Gestion Utilisateurs
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <BarChart className="h-6 w-6 mb-2" />
              Rapports Avancés
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Brain className="h-6 w-6 mb-2" />
              Config IA
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Shield className="h-6 w-6 mb-2" />
              Sécurité
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Database className="h-6 w-6 mb-2" />
              Base de Données
            </Button>
            <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
              <Monitor className="h-6 w-6 mb-2" />
              Monitoring
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalAdminDashboard;
