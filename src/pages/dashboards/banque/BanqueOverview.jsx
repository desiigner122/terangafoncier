import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
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

  // Données RÉELLES depuis Supabase (aucune valeur aléatoire)
  useEffect(() => {
    let active = true;
    const loadRealTime = async () => {
      try {
        const [{ count: processingCredits }, { count: pendingApprovals }] = await Promise.all([
          supabase.from('demandes_financement').select('id', { count: 'exact', head: true }).eq('status', 'processing'),
          supabase.from('demandes_financement').select('id', { count: 'exact', head: true }).eq('status', 'pending')
        ]);
        if (active) {
          setRealTimeData({
            activeClients: null,
            processingCredits: processingCredits || 0,
            pendingApprovals: pendingApprovals || 0,
            systemLoad: null
          });
        }
      } catch (err) {
        console.warn('Données banque indisponibles:', err?.message);
        if (active) setRealTimeData({ activeClients: null, processingCredits: 0, pendingApprovals: 0, systemLoad: null });
      }
    };
    loadRealTime();
    return () => { active = false; };
  }, []);

  // KPIs principaux enrichis
  const mainKPIs = [
    {
      title: 'Crédits Terrain Actifs',
      value: '—',
      subtitle: '348 dossiers',
      change: null,
      changeType: 'positive',
      icon: Home,
      color: 'bg-blue-500',
      trend: [],
      details: {
        approved: '285 approuvés',
        pending: '43 en attente',
        rejected: '20 rejetés'
      }
    },
    {
      title: 'Portfolio Total',
      value: '—',
      subtitle: 'Encours global',
      change: null,
      changeType: 'positive',
      icon: Wallet,
      color: 'bg-green-500',
      trend: [],
      details: {
        performing: '42.1M (93%)',
        watchlist: '2.8M (6%)',
        npls: '0.3M (1%)'
      }
    },
    {
      title: 'Nouveaux Clients',
      value: '—',
      subtitle: 'Ce mois',
      change: null,
      changeType: 'positive',
      icon: Users,
      color: 'bg-purple-500',
      trend: [],
      details: {
        individual: '98 particuliers',
        corporate: '19 entreprises',
        diaspora: '10 diaspora'
      }
    },
    {
      title: 'Score IA Moyen',
      value: '—',
      subtitle: 'Précision crédit',
      change: null,
      changeType: 'positive',
      icon: Zap,
      color: 'bg-yellow-500',
      trend: [],
      details: {
        excellent: '65% (>85)',
        good: '28% (70-85)',
        fair: '7% (<70)'
      }
    }
  ];

  // Métriques secondaires
  const secondaryMetrics = [
    { title: 'Taux d\'approbation', value: '—', change: null, icon: CheckCircle },
    { title: 'Délai moyen', value: '—', change: null, icon: Clock },
    { title: 'Satisfaction client', value: '—', change: null, icon: Star },
    { title: 'KYC automatisé', value: '—', change: null, icon: Shield },
    { title: 'API Uptime', value: '—', change: null, icon: Server },
    { title: 'Blockchain sync', value: '—', change: null, icon: Database }
  ];

  // Données graphiques RÉELLES (agrégées depuis Supabase)
  const [creditEvolution, setCreditEvolution] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        // Évolution des crédits par mois (6 derniers) selon le statut
        const since = new Date(); since.setMonth(since.getMonth() - 5); since.setDate(1);
        const { data: dem } = await supabase
          .from('demandes_financement')
          .select('status, created_at')
          .gte('created_at', since.toISOString());
        const moisFr = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const buckets = {};
        for (let i = 5; i >= 0; i--) {
          const d = new Date(); d.setMonth(d.getMonth() - i);
          buckets[`${d.getFullYear()}-${d.getMonth()}`] = { month: moisFr[d.getMonth()], approved: 0, pending: 0, rejected: 0 };
        }
        (dem || []).forEach((r) => {
          const d = new Date(r.created_at); const k = `${d.getFullYear()}-${d.getMonth()}`;
          if (!buckets[k]) return;
          if (r.status === 'approved') buckets[k].approved += 1;
          else if (r.status === 'rejected') buckets[k].rejected += 1;
          else buckets[k].pending += 1;
        });

        // Répartition du risque selon le statut de vérification des biens
        const { data: props } = await supabase.from('properties').select('verification_status');
        const colors = { verified: '#22c55e', pending: '#f59e0b', rejected: '#ef4444' };
        const counts = {};
        (props || []).forEach((p) => { const s = p.verification_status || 'pending'; counts[s] = (counts[s] || 0) + 1; });
        const labels = { verified: 'Vérifié (faible risque)', pending: 'En attente (risque moyen)', rejected: 'Rejeté (risque élevé)' };

        if (!active) return;
        setCreditEvolution(Object.values(buckets));
        setRiskDistribution(Object.entries(counts).map(([s, value]) => ({
          name: labels[s] || s, value, color: colors[s] || '#8b5cf6'
        })));
      } catch (err) {
        console.warn('Graphiques banque indisponibles:', err?.message);
      }
    })();
    return () => { active = false; };
  }, []);

  // Dernières activités
  const recentActivities = []; // démo retirée

  // Clients prioritaires
  const priorityClients = []; // démo retirée

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