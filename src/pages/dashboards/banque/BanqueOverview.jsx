import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  FileText,
  Users,
  CreditCard,
  Shield,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Target,
  Calendar,
  Activity,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calculator,
  Award,
  Briefcase,
  Banknote,
  Percent,
  Eye,
  Database,
  Zap,
  Globe,
  Smartphone,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Filter,
  Search,
  Plus,
  Bell,
  MessageSquare,
  Share2,
  ExternalLink,
  Wallet,
  Receipt,
  FileCheck,
  Send,
  Lock,
  Key,
  Fingerprint,
  QrCode,
  Wifi,
  Monitor,
  Server,
  Cloud,
  MapPin,
  Home,
  Edit,
  XCircle,
  Mail,
  Phone
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BanqueOverview = ({ dashboardStats = {} }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('credits');
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeData, setRealTimeData] = useState({});

  // Données temps réel simulées
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        activeClients: Math.floor(Math.random() * 50) + 150,
        processingCredits: Math.floor(Math.random() * 10) + 25,
        pendingApprovals: Math.floor(Math.random() * 5) + 8,
        systemLoad: Math.floor(Math.random() * 30) + 45
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // KPIs principaux enrichis
  const mainKPIs = [
    {
      title: 'Crédits Terrain Actifs',
      value: '2.8M',
      subtitle: '348 dossiers',
      change: '+12.5%',
      changeType: 'positive',
      icon: Home,
      color: 'bg-blue-500',
      trend: [65, 72, 68, 75, 82, 78, 85, 88, 92, 89, 95, 98],
      details: {
        approved: '285 approuvés',
        pending: '43 en attente',
        rejected: '20 rejetés'
      }
    },
    {
      title: 'Portfolio Total',
      value: '45.2M FCFA',
      subtitle: 'Encours global',
      change: '+8.3%',
      changeType: 'positive',
      icon: Wallet,
      color: 'bg-green-500',
      trend: [45, 48, 52, 47, 55, 58, 62, 59, 65, 68, 72, 75],
      details: {
        performing: '42.1M (93%)',
        watchlist: '2.8M (6%)',
        npls: '0.3M (1%)'
      }
    },
    {
      title: 'Nouveaux Clients',
      value: '127',
      subtitle: 'Ce mois',
      change: '+23.1%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-purple-500',
      trend: [20, 25, 18, 30, 35, 28, 42, 38, 45, 52, 48, 55],
      details: {
        individual: '98 particuliers',
        corporate: '19 entreprises',
        diaspora: '10 diaspora'
      }
    },
    {
      title: 'Score IA Moyen',
      value: '87.3',
      subtitle: 'Précision crédit',
      change: '+2.1%',
      changeType: 'positive',
      icon: Zap,
      color: 'bg-yellow-500',
      trend: [82, 83, 85, 84, 86, 87, 85, 88, 89, 87, 90, 87],
      details: {
        excellent: '65% (>85)',
        good: '28% (70-85)',
        fair: '7% (<70)'
      }
    }
  ];

  // Métriques secondaires
  const secondaryMetrics = [
    { title: 'Taux d\'approbation', value: '82.1%', change: '+3.2%', icon: CheckCircle },
    { title: 'Délai moyen', value: '4.2j', change: '-15%', icon: Clock },
    { title: 'Satisfaction client', value: '4.7/5', change: '+0.3', icon: Star },
    { title: 'KYC automatisé', value: '94.5%', change: '+8.1%', icon: Shield },
    { title: 'API Uptime', value: '99.8%', change: '0%', icon: Server },
    { title: 'Blockchain sync', value: '100%', change: '0%', icon: Database }
  ];

  // Données graphiques
  const creditEvolution = [
    { month: 'Jan', approved: 45, pending: 12, rejected: 8 },
    { month: 'Fév', approved: 52, pending: 15, rejected: 6 },
    { month: 'Mar', approved: 48, pending: 18, rejected: 7 },
    { month: 'Avr', approved: 61, pending: 14, rejected: 9 },
    { month: 'Mai', approved: 55, pending: 16, rejected: 5 },
    { month: 'Jun', approved: 67, pending: 11, rejected: 8 },
    { month: 'Jul', approved: 73, pending: 13, rejected: 6 },
    { month: 'Aoû', approved: 68, pending: 17, rejected: 7 },
    { month: 'Sep', approved: 82, pending: 19, rejected: 4 }
  ];

  const riskDistribution = [
    { name: 'Faible risque', value: 65, color: '#22c55e' },
    { name: 'Risque modéré', value: 28, color: '#f59e0b' },
    { name: 'Risque élevé', value: 7, color: '#ef4444' }
  ];

  // Dernières activités
  const recentActivities = [
    {
      id: 1,
      type: 'credit_approved',
      client: 'Amadou Diallo',
      amount: '85M FCFA',
      property: 'Terrain Almadies',
      time: '5 min',
      status: 'approved',
      agent: 'Me Fatou Ndiaye'
    },
    {
      id: 2,
      type: 'kyc_completed',
      client: 'Aïcha Sow',
      amount: '120M FCFA',
      property: 'Villa Mermoz',
      time: '12 min',
      status: 'processing',
      agent: 'IA KYC System'
    },
    {
      id: 3,
      type: 'credit_pending',
      client: 'Moussa Thiam',
      amount: '65M FCFA',
      property: 'Terrain Rufisque',
      time: '25 min',
      status: 'pending',
      agent: 'Équipe crédit'
    },
    {
      id: 4,
      type: 'blockchain_verified',
      client: 'Fatou Diop',
      amount: '95M FCFA',
      property: 'Appartement Plateau',
      time: '1h',
      status: 'verified',
      agent: 'TerangaChain'
    },
    {
      id: 5,
      type: 'compliance_check',
      client: 'Ibrahima Fall',
      amount: '110M FCFA',
      property: 'Terrain Liberté 6',
      time: '2h',
      status: 'compliant',
      agent: 'Système conformité'
    }
  ];

  // Clients prioritaires
  const priorityClients = [
    {
      id: 1,
      name: 'Amadou Diallo',
      type: 'Premium',
      portfolio: '450M FCFA',
      properties: 5,
      lastActivity: '2h',
      status: 'active',
      riskScore: 92
    },
    {
      id: 2,
      name: 'Aïcha Sow',
      type: 'Diaspora VIP',
      portfolio: '320M FCFA',
      properties: 3,
      lastActivity: '5h',
      status: 'active',
      riskScore: 88
    },
    {
      id: 3,
      name: 'Moussa Thiam',
      type: 'Corporate', 
      portfolio: '1.2B FCFA',
      properties: 12,
      lastActivity: '1j',
      status: 'active',
      riskScore: 95
    }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      window.safeGlobalToast({
        title: "Données actualisées",
        description: "Dashboard mis à jour avec les dernières données",
        variant: "success"
      });
    }, 2000);
  };

  const handleExport = () => {
    window.safeGlobalToast({
      title: "Export en cours",
      description: "Génération du rapport PDF...",
      variant: "success"
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'credit_approved': return CheckCircle;
      case 'kyc_completed': return Shield;
      case 'credit_pending': return Clock;
      case 'blockchain_verified': return Database;
      case 'compliance_check': return FileCheck;
      default: return Activity;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'verified': return 'text-purple-600 bg-purple-50';
      case 'compliant': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête enrichi */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tableau de Bord Bancaire</h2>
          <p className="text-gray-600 mt-1">
            Aperçu complet de l'activité bancaire et des crédits terrain
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <Wifi className="h-3 w-3 mr-1" />
              En ligne
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Database className="h-3 w-3 mr-1" />
              Synchronisé
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              <Zap className="h-3 w-3 mr-1" />
              IA Active
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
              <SelectItem value="90d">90 jours</SelectItem>
              <SelectItem value="1y">1 année</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* KPIs principaux avec graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainKPIs.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${kpi.color} text-white`}>
                    <kpi.icon className="h-5 w-5" />
                  </div>
                  <Badge variant={kpi.changeType === 'positive' ? 'default' : 'destructive'}>
                    {kpi.changeType === 'positive' ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {kpi.change}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-sm text-gray-600">{kpi.subtitle}</p>
                  </div>
                  
                  {/* Mini graphique */}
                  <div className="h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={kpi.trend.map((value, i) => ({ value, index: i }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={kpi.color.replace('bg-', '#').replace('-500', '')} 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Détails */}
                  <div className="space-y-1 text-xs text-gray-500">
                    {Object.entries(kpi.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Métriques secondaires */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {secondaryMetrics.map((metric, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <metric.icon className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                <p className="text-xs text-gray-500">{metric.title}</p>
                <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                  {metric.change}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Graphiques et données */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Évolution des crédits */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Évolution des Crédits
            </CardTitle>
            <CardDescription>
              Analyse des approbations, rejets et dossiers en attente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={creditEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="approved" fill="#22c55e" name="Approuvés" />
                  <Bar dataKey="pending" fill="#f59e0b" name="En attente" />
                  <Bar dataKey="rejected" fill="#ef4444" name="Rejetés" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribution des risques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Répartition des Risques
            </CardTitle>
            <CardDescription>
              Classification par niveau de risque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {riskDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activités récentes et clients prioritaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Activités Récentes
              </div>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div className={`p-1.5 rounded-full ${getActivityColor(activity.status)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.client}
                          </p>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.amount} • {activity.property}</p>
                        <p className="text-xs text-gray-500">Agent: {activity.agent}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Clients prioritaires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Clients Prioritaires
              </div>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-600">{client.type}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {client.properties} biens
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Score: {client.riskScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{client.portfolio}</p>
                    <p className="text-xs text-gray-500">Dernière activité: {client.lastActivity}</p>
                    <div className="flex space-x-1 mt-2">
                      <Button size="sm" variant="ghost">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Actions Rapides
          </CardTitle>
          <CardDescription>
            Raccourcis pour les tâches fréquentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Plus className="h-6 w-6" />
              <span className="text-xs">Nouveau crédit</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Shield className="h-6 w-6" />
              <span className="text-xs">KYC Express</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Calculator className="h-6 w-6" />
              <span className="text-xs">Simulateur</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <FileCheck className="h-6 w-6" />
              <span className="text-xs">Approbation</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <BarChart3 className="h-6 w-6" />
              <span className="text-xs">Rapport</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <MessageSquare className="h-6 w-6" />
              <span className="text-xs">Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BanqueOverview;