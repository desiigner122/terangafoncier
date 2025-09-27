import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  BarChart3, 
  PieChart, 
  Calendar,
  Users,
  DollarSign,
  CreditCard,
  Percent,
  Clock,
  Star,
  Trophy,
  Zap,
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Settings,
  Globe,
  Smartphone,
  Building2,
  FileText,
  Database,
  Search,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const BanquePerformances = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [performanceData, setPerformanceData] = useState([]);
  const [kpis, setKpis] = useState({});

  // Données de performance simulées
  useEffect(() => {
    const mockPerformanceData = [
      {
        periode: 'Jan 2024',
        revenus: 2500000000,
        clients: 2890,
        credits: 1800000000,
        epargne: 4200000000,
        npa: 2.3,
        roi: 15.8,
        satisfaction: 87,
        conversion: 12.4
      },
      {
        periode: 'Fév 2024',
        revenus: 2750000000,
        clients: 3120,
        credits: 2100000000,
        epargne: 4580000000,
        npa: 2.1,
        roi: 16.2,
        satisfaction: 89,
        conversion: 13.1
      },
      {
        periode: 'Mar 2024',
        revenus: 3200000000,
        clients: 3450,
        credits: 2400000000,
        epargne: 4950000000,
        npa: 1.9,
        roi: 17.5,
        satisfaction: 91,
        conversion: 14.2
      },
      {
        periode: 'Avr 2024',
        revenus: 3100000000,
        clients: 3680,
        credits: 2200000000,
        epargne: 5200000000,
        npa: 2.0,
        roi: 16.8,
        satisfaction: 88,
        conversion: 13.8
      },
      {
        periode: 'Mai 2024',
        revenus: 3450000000,
        clients: 3920,
        credits: 2600000000,
        epargne: 5480000000,
        npa: 1.8,
        roi: 18.1,
        satisfaction: 92,
        conversion: 15.3
      },
      {
        periode: 'Juin 2024',
        revenus: 3680000000,
        clients: 4180,
        credits: 2800000000,
        epargne: 5750000000,
        npa: 1.7,
        roi: 18.9,
        satisfaction: 94,
        conversion: 16.1
      }
    ];

    const mockKpis = {
      revenus: {
        current: 3680000000,
        previous: 3450000000,
        target: 4000000000,
        growth: 6.7,
        status: 'good'
      },
      clients: {
        current: 4180,
        previous: 3920,
        target: 4500,
        growth: 6.6,
        status: 'good'
      },
      roi: {
        current: 18.9,
        previous: 18.1,
        target: 20.0,
        growth: 4.4,
        status: 'good'
      },
      npa: {
        current: 1.7,
        previous: 1.8,
        target: 2.0,
        growth: -5.6,
        status: 'excellent'
      },
      satisfaction: {
        current: 94,
        previous: 92,
        target: 95,
        growth: 2.2,
        status: 'good'
      },
      conversion: {
        current: 16.1,
        previous: 15.3,
        target: 18.0,
        growth: 5.2,
        status: 'good'
      }
    };

    setPerformanceData(mockPerformanceData);
    setKpis(mockKpis);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStatusColor = (status) => {
    const colors = {
      excellent: 'text-green-600 bg-green-100',
      good: 'text-blue-600 bg-blue-100',
      warning: 'text-yellow-600 bg-yellow-100',
      danger: 'text-red-600 bg-red-100'
    };
    return colors[status] || colors.good;
  };

  const getStatusIcon = (status) => {
    const icons = {
      excellent: CheckCircle,
      good: TrendingUp,
      warning: AlertTriangle,
      danger: TrendingDown
    };
    return icons[status] || TrendingUp;
  };

  // Données pour les graphiques
  const pieData = [
    { name: 'Crédits Immobiliers', value: 45, color: '#3B82F6' },
    { name: 'Épargne', value: 30, color: '#10B981' },
    { name: 'Crédits Auto', value: 15, color: '#8B5CF6' },
    { name: 'Cartes', value: 10, color: '#F59E0B' }
  ];

  const clientSegmentData = [
    { segment: 'Particuliers', clients: 2850, revenus: 1520000000 },
    { segment: 'PME', clients: 980, revenus: 1680000000 },
    { segment: 'Diaspora', clients: 350, revenus: 480000000 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Activity className="h-8 w-8 mr-3 text-blue-600" />
            Performances & Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Suivi détaillé des performances bancaires et KPIs stratégiques
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Object.entries(kpis).map(([key, kpi]) => {
          const StatusIcon = getStatusIcon(kpi.status);
          const isPositiveMetric = key !== 'npa'; // NPA est inversé (plus bas = mieux)
          const isGrowthPositive = isPositiveMetric ? kpi.growth > 0 : kpi.growth < 0;
          
          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1 rounded-full ${getStatusColor(kpi.status)}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <div className={`flex items-center text-sm ${isGrowthPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isGrowthPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(kpi.growth).toFixed(1)}%
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">
                    {key === 'revenus' ? 'Revenus' :
                     key === 'clients' ? 'Clients' :
                     key === 'roi' ? 'ROI' :
                     key === 'npa' ? 'NPA' :
                     key === 'satisfaction' ? 'Satisfaction' :
                     'Conversion'}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {key === 'revenus' ? formatCurrency(kpi.current) :
                     key === 'clients' ? kpi.current.toLocaleString() :
                     `${kpi.current}%`}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Objectif: {key === 'revenus' ? formatCurrency(kpi.target) : key === 'clients' ? kpi.target.toLocaleString() : `${kpi.target}%`}</span>
                    <Progress 
                      value={key === 'npa' ? (kpi.target / kpi.current) * 100 : (kpi.current / kpi.target) * 100} 
                      className="w-12 h-1" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des revenus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Évolution des Revenus
            </CardTitle>
            <CardDescription>
              Revenus mensuels et tendance sur 6 mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periode" />
                <YAxis tickFormatter={(value) => `${(value / 1000000000).toFixed(1)}B`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Area 
                  type="monotone" 
                  dataKey="revenus" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par produits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Répartition des Revenus
            </CardTitle>
            <CardDescription>
              Par type de produit bancaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Tooltip formatter={(value) => `${value}%`} />
                <RechartsPieChart data={pieData}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Détails par segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des clients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Croissance Client
            </CardTitle>
            <CardDescription>
              Évolution du nombre de clients actifs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periode" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="clients" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Qualité du portefeuille */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Qualité du Portefeuille
            </CardTitle>
            <CardDescription>
              Évolution du taux de créances douteuses (NPA)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periode" />
                <YAxis domain={[0, 3]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Area 
                  type="monotone" 
                  dataKey="npa" 
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Analyse par segment client */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Performance par Segment Client
          </CardTitle>
          <CardDescription>
            Analyse détaillée des segments de clientèle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientSegmentData.map((segment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{segment.segment}</h4>
                    <p className="text-sm text-gray-500">{segment.clients.toLocaleString()} clients</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(segment.revenus)}</p>
                  <p className="text-sm text-gray-500">
                    {formatCurrency(segment.revenus / segment.clients)} / client
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tableaux de bord temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux de conversion</p>
                <p className="text-2xl font-bold text-gray-900">16.1%</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+5.2%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction client</p>
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+2.2%</span>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Temps traitement</p>
                <p className="text-2xl font-bold text-gray-900">2.4h</p>
                <div className="flex items-center mt-1">
                  <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">-12%</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score IA</p>
                <p className="text-2xl font-bold text-gray-900">96.8%</p>
                <div className="flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+1.8%</span>
                </div>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BanquePerformances;