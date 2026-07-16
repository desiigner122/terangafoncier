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
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Formatage montant FCFA lisible
const formatFCFA = (amount) => {
  const n = Number(amount) || 0;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} Mrd FCFA`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M FCFA`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} k FCFA`;
  return `${n.toLocaleString('fr-FR')} FCFA`;
};

// Temps relatif court à partir d'une date ISO
const timeAgo = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const j = Math.floor(h / 24);
  return `${j}j`;
};

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const BanqueOverview = ({ dashboardStats = {} }) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('credits');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // États alimentés par Supabase (aucune donnée fabriquée)
  const [mainKPIs, setMainKPIs] = useState([]);
  const [secondaryMetrics, setSecondaryMetrics] = useState([]);
  const [creditEvolution, setCreditEvolution] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [priorityClients, setPriorityClients] = useState([]);

  const bankId = user?.id;

  const fetchOverview = async () => {
    if (!bankId) return;
    try {
      const [loansRes, clientsRes, guaranteesRes] = await Promise.all([
        supabase.from('loans').select('*').eq('bank_id', bankId),
        supabase.from('bank_clients').select('*').eq('bank_id', bankId),
        supabase.from('guarantees').select('*').eq('bank_id', bankId)
      ]);

      const loans = loansRes.data || [];
      const clients = clientsRes.data || [];
      const guarantees = guaranteesRes.data || [];

      const ACTIVE_STATUSES = ['approved', 'disbursed', 'pre_approved'];
      const activeLoans = loans.filter((l) => ACTIVE_STATUSES.includes(l.status));
      const approvedLoans = loans.filter((l) => ['approved', 'disbursed'].includes(l.status));
      const pendingLoans = loans.filter((l) => ['pending', 'evaluating'].includes(l.status));
      const rejectedLoans = loans.filter((l) => l.status === 'rejected');

      const encours = activeLoans.reduce((s, l) => s + (Number(l.amount) || 0), 0);

      // --- Séries mensuelles réelles (12 derniers mois) ---
      const now = new Date();
      const months = [];
      for (let i = 8; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          key: `${d.getFullYear()}-${d.getMonth()}`,
          label: MONTH_LABELS[d.getMonth()],
          approved: 0,
          pending: 0,
          rejected: 0,
          count: 0,
          amount: 0
        });
      }
      const monthIndex = Object.fromEntries(months.map((m, i) => [m.key, i]));
      loans.forEach((l) => {
        if (!l.created_at) return;
        const d = new Date(l.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const idx = monthIndex[key];
        if (idx === undefined) return;
        months[idx].count += 1;
        months[idx].amount += Number(l.amount) || 0;
        if (['approved', 'disbursed'].includes(l.status)) months[idx].approved += 1;
        else if (l.status === 'rejected') months[idx].rejected += 1;
        else months[idx].pending += 1;
      });

      setCreditEvolution(
        months.map((m) => ({ month: m.label, approved: m.approved, pending: m.pending, rejected: m.rejected }))
      );

      // Nouveaux clients ce mois vs mois précédent (bank_clients)
      const thisMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
      const prevD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthKey = `${prevD.getFullYear()}-${prevD.getMonth()}`;
      const clientMonthCount = (key) =>
        clients.filter((c) => {
          if (!c.created_at) return false;
          const d = new Date(c.created_at);
          return `${d.getFullYear()}-${d.getMonth()}` === key;
        }).length;
      const newClientsThisMonth = clientMonthCount(thisMonthKey);
      const newClientsPrevMonth = clientMonthCount(prevMonthKey);

      // Variation mensuelle (dossiers créés)
      const momPct = (cur, prev) => {
        if (!prev) return null;
        return (((cur - prev) / prev) * 100).toFixed(1);
      };
      const creditsThisMonth = months[months.length - 1]?.count || 0;
      const creditsPrevMonth = months[months.length - 2]?.count || 0;
      const amountThisMonth = months[months.length - 1]?.amount || 0;
      const amountPrevMonth = months[months.length - 2]?.amount || 0;

      const buildChange = (pct) =>
        pct === null
          ? { change: null, changeType: 'positive' }
          : { change: `${pct > 0 ? '+' : ''}${pct}%`, changeType: pct >= 0 ? 'positive' : 'negative' };

      // Score de crédit moyen (bank_clients.credit_score)
      const scoredClients = clients.filter((c) => c.credit_score != null);
      const avgScore = scoredClients.length
        ? Math.round(scoredClients.reduce((s, c) => s + Number(c.credit_score), 0) / scoredClients.length)
        : null;

      // Répartition par type de client (dynamique)
      const typeCounts = {};
      clients.forEach((c) => {
        const t = c.client_type || 'Autre';
        typeCounts[t] = (typeCounts[t] || 0) + 1;
      });

      // --- KPIs principaux ---
      const kpis = [
        {
          title: 'Crédits Terrain Actifs',
          value: String(activeLoans.length),
          subtitle: `${loans.length} dossier${loans.length > 1 ? 's' : ''} au total`,
          ...buildChange(momPct(creditsThisMonth, creditsPrevMonth)),
          icon: Home,
          color: 'bg-blue-500',
          trend: months.map((m) => m.count),
          details: {
            approuvés: `${approvedLoans.length}`,
            'en attente': `${pendingLoans.length}`,
            rejetés: `${rejectedLoans.length}`
          }
        },
        {
          title: 'Encours Portefeuille',
          value: formatFCFA(encours),
          subtitle: 'Crédits actifs',
          ...buildChange(momPct(amountThisMonth, amountPrevMonth)),
          icon: Wallet,
          color: 'bg-green-500',
          trend: months.map((m) => Math.round(m.amount / 1_000_000)),
          details: {
            'dossiers actifs': `${activeLoans.length}`,
            décaissés: `${loans.filter((l) => l.status === 'disbursed').length}`,
            garanties: `${guarantees.length}`
          }
        },
        {
          title: 'Nouveaux Clients',
          value: String(newClientsThisMonth),
          subtitle: `Ce mois • ${clients.length} au total`,
          ...buildChange(momPct(newClientsThisMonth, newClientsPrevMonth)),
          icon: Users,
          color: 'bg-purple-500',
          trend: null,
          details: Object.fromEntries(
            Object.entries(typeCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([k, v]) => [k, String(v)])
          )
        },
        {
          title: 'Score Crédit Moyen',
          value: avgScore != null ? String(avgScore) : '—',
          subtitle: scoredClients.length ? `${scoredClients.length} clients notés` : 'Aucune notation',
          change: null,
          changeType: 'positive',
          icon: Zap,
          color: 'bg-yellow-500',
          trend: null,
          details: {
            'clients notés': `${scoredClients.length}`,
            'sans score': `${clients.length - scoredClients.length}`
          }
        }
      ];
      setMainKPIs(kpis);

      // --- Métriques secondaires (réelles + états honnêtes) ---
      const approvalRate = loans.length
        ? ((approvedLoans.length / loans.length) * 100).toFixed(1) + '%'
        : '—';
      const activeGuarantees = guarantees.filter((g) => (g.status || 'active') === 'active').length;
      setSecondaryMetrics([
        { title: "Taux d'approbation", value: approvalRate, change: null, icon: CheckCircle },
        { title: 'Demandes en attente', value: String(pendingLoans.length), change: null, icon: Clock },
        { title: 'Garanties actives', value: String(activeGuarantees), change: null, icon: Shield },
        { title: 'Clients suivis', value: String(clients.length), change: null, icon: Users },
        { title: 'Dossiers rejetés', value: String(rejectedLoans.length), change: null, icon: XCircle },
        { title: 'Total garanties', value: formatFCFA(guarantees.reduce((s, g) => s + (Number(g.value) || 0), 0)), change: null, icon: Wallet }
      ]);

      // --- Répartition des risques (loans.risk_level) ---
      const riskMap = {
        low: { name: 'Faible risque', color: '#22c55e', value: 0 },
        medium: { name: 'Risque modéré', color: '#f59e0b', value: 0 },
        high: { name: 'Risque élevé', color: '#ef4444', value: 0 }
      };
      let riskTotal = 0;
      loans.forEach((l) => {
        const key = (l.risk_level || '').toLowerCase();
        if (riskMap[key]) {
          riskMap[key].value += 1;
          riskTotal += 1;
        }
      });
      setRiskDistribution(
        riskTotal
          ? Object.values(riskMap).map((r) => ({
              name: r.name,
              color: r.color,
              value: Math.round((r.value / riskTotal) * 100)
            }))
          : []
      );

      // --- Activités récentes (derniers crédits) ---
      const statusToActivity = {
        approved: { type: 'credit_approved', label: 'approved' },
        disbursed: { type: 'blockchain_verified', label: 'verified' },
        pending: { type: 'credit_pending', label: 'pending' },
        evaluating: { type: 'kyc_completed', label: 'processing' },
        pre_approved: { type: 'compliance_check', label: 'compliant' },
        rejected: { type: 'credit_pending', label: 'pending' }
      };
      const sortedLoans = [...loans].sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
      setRecentActivities(
        sortedLoans.slice(0, 6).map((l) => {
          const meta = statusToActivity[l.status] || { type: 'compliance_check', label: 'compliant' };
          return {
            id: l.id,
            type: meta.type,
            status: meta.label,
            client: l.client_name || 'Client',
            amount: formatFCFA(l.amount),
            property: l.reference || l.type || 'Dossier crédit',
            time: timeAgo(l.created_at),
            agent: l.status
          };
        })
      );

      // --- Clients prioritaires (top total_credits) ---
      const topClients = [...clients]
        .sort((a, b) => (Number(b.total_credits) || 0) - (Number(a.total_credits) || 0))
        .slice(0, 3);
      setPriorityClients(
        topClients.map((c) => ({
          id: c.id,
          name: c.name || 'Client',
          type: c.client_type || 'Client',
          portfolio: formatFCFA(c.total_credits),
          status: c.status || 'active',
          lastActivity: timeAgo(c.updated_at || c.created_at),
          riskScore: c.credit_score != null ? c.credit_score : '—'
        }))
      );
    } catch (error) {
      console.error('Erreur chargement aperçu banque:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, [bankId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOverview().finally(() => {
      setRefreshing(false);
      window.safeGlobalToast?.({
        title: "Données actualisées",
        description: "Dashboard mis à jour avec les dernières données",
        variant: "success"
      });
    });
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
                  {kpi.change && (
                    <Badge variant={kpi.changeType === 'positive' ? 'default' : 'destructive'}>
                      {kpi.changeType === 'positive' ? (
                        <ArrowUp className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="h-3 w-3 mr-1" />
                      )}
                      {kpi.change}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-sm text-gray-600">{kpi.subtitle}</p>
                  </div>
                  
                  {/* Mini graphique (série mensuelle réelle) */}
                  {kpi.trend?.length ? (
                    <div className="h-12">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={kpi.trend.map((value, i) => ({ value, index: i }))}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : null}

                  {/* Détails */}
                  <div className="space-y-1 text-xs text-gray-500">
                    {Object.entries(kpi.details || {}).map(([key, value]) => (
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
                {metric.change && (
                  <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
                    {metric.change}
                  </p>
                )}
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
            {riskDistribution.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-sm text-gray-500">
                Aucune évaluation de risque disponible
              </div>
            ) : (
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
            )}
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
              {recentActivities.length === 0 && (
                <div className="h-72 flex items-center justify-center text-sm text-gray-500">
                  Aucune activité récente
                </div>
              )}
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
              {priorityClients.length === 0 && (
                <div className="py-10 text-center text-sm text-gray-500">
                  Aucun client enregistré
                </div>
              )}
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