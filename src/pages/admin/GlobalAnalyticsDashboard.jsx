import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  Globe, 
  Activity, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Clock, 
  MapPin, 
  Building, 
  DollarSign, 
  UserCheck, 
  AlertCircle, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw
} from 'lucide-react';

const GlobalAnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    overview: {
      totalVisitors: 12847,
      totalUsers: 2156,
      activeUsers: 847,
      conversionRate: 6.7,
      avgSessionDuration: '4m 32s',
      bounceRate: 34.2
    },
    visitors: {
      countries: [
        { name: 'Sénégal', users: 8945, percentage: 69.6 },
        { name: 'France', users: 1832, percentage: 14.3 },
        { name: 'Mali', users: 987, percentage: 7.7 },
        { name: 'Burkina Faso', users: 654, percentage: 5.1 },
        { name: 'Autres', users: 429, percentage: 3.3 }
      ],
      regions: [
        { name: 'Dakar', users: 4523, percentage: 35.2 },
        { name: 'Thiès', users: 1876, percentage: 14.6 },
        { name: 'Saint-Louis', users: 1234, percentage: 9.6 },
        { name: 'Kaolack', users: 987, percentage: 7.7 },
        { name: 'Ziguinchor', users: 765, percentage: 6.0 }
      ]
    },
    userActivity: {
      byRole: [
        { role: 'Particulier', count: 1245, active: 456, percentage: 57.7 },
        { role: 'Vendeur Pro', count: 324, active: 178, percentage: 15.0 },
        { role: 'Investisseur', count: 298, active: 134, percentage: 13.8 },
        { role: 'Promoteur', count: 156, active: 89, percentage: 7.2 },
        { role: 'Géomètre', count: 78, active: 34, percentage: 3.6 },
        { role: 'Notaire', count: 55, active: 21, percentage: 2.5 }
      ],
      interactions: [
        { date: '2024-09-01', views: 1245, clicks: 324, messages: 89 },
        { date: '2024-09-02', views: 1356, clicks: 298, messages: 76 },
        { date: '2024-09-03', views: 1489, clicks: 387, messages: 102 },
        { date: '2024-09-04', views: 1678, clicks: 445, messages: 134 }
      ]
    },
    performance: {
      pageViews: [
        { page: '/accueil', views: 5647, avgTime: '2m 15s' },
        { page: '/recherche', views: 3421, avgTime: '3m 45s' },
        { page: '/proprietes', views: 2876, avgTime: '4m 12s' },
        { page: '/dashboard', views: 1987, avgTime: '6m 23s' },
        { page: '/contact', views: 1234, avgTime: '1m 56s' }
      ],
      devices: [
        { name: 'Mobile', value: 65.4, count: 8403 },
        { name: 'Desktop', value: 28.9, count: 3712 },
        { name: 'Tablet', value: 5.7, count: 732 }
      ]
    }
  });

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const refreshData = () => {
    setLoading(true);
    // Simulation du rechargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Globales</h1>
          <p className="text-gray-600">Vue d'ensemble de l'activité de la plateforme</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue YOUR_API_KEY="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Dernières 24h</SelectItem>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">90 derniers jours</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visiteurs Totaux</CardTitle>
              <Eye className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{formatNumber(analytics.overview.totalVisitors)}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% vs période précédente
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Inscrits</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatNumber(analytics.overview.totalUsers)}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.3% vs période précédente
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{analytics.overview.activeUsers}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.7% vs période précédente
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{analytics.overview.conversionRate}%</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.1% vs période précédente
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Durée Moyenne</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{analytics.overview.avgSessionDuration}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18.2% vs période précédente
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Rebond</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{analytics.overview.bounceRate}%</div>
              <p className="text-xs text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                -5.4% vs période précédente
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="geographic" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geographic">Géographique</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Visiteurs par Pays
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.visitors.countries.map((country, index) => (
                    <div key={country.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="font-medium">{country.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatNumber(country.users)}</div>
                        <div className="text-sm text-gray-500">{country.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Régions Sénégal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.visitors.regions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Rôle</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.userActivity.byRole}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ role, percentage }) => `${role} (${percentage}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analytics.userActivity.byRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activité par Rôle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.userActivity.byRole.map((role, index) => (
                    <div key={role.role} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{role.role}</span>
                        <Badge variant="outline">{role.active}/{role.count} actifs</Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${(role.active / role.count) * 100}%`,
                            backgroundColor: COLORS[index]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Interactions Tab */}
        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interactions Quotidiennes</CardTitle>
              <CardDescription>Vues, clics et messages par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analytics.userActivity.interactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                  <Area type="monotone" dataKey="clicks" stackId="1" stroke="#10B981" fill="#10B981" />
                  <Area type="monotone" dataKey="messages" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pages les Plus Visitées</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.pageViews.map((page) => (
                    <div key={page.page} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">{page.page}</div>
                        <div className="text-sm text-gray-500">{page.avgTime} temps moyen</div>
                      </div>
                      <Badge variant="secondary">{formatNumber(page.views)} vues</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appareils Utilisés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.performance.devices.map((device, index) => (
                    <div key={device.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{device.name}</span>
                        <span className="text-sm text-gray-500">{device.value}% ({formatNumber(device.count)})</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${device.value}%`,
                            backgroundColor: COLORS[index]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GlobalAnalyticsDashboard;
