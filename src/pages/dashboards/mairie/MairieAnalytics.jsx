import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Download,
  RefreshCw,
  Target,
  PieChart,
  LineChart,
  FileText,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  LineChart as RechartsLine,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBar,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const TYPE_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#EC4899'];

const isApproved = (s) => s === 'approved';
const isRejected = (s) => s === 'rejected';
const isTreated = (s) => isApproved(s) || isRejected(s);

// Délai de traitement en jours (created_at -> updated_at)
const processingDays = (r) => {
  if (!r.created_at || !r.updated_at) return null;
  const diff = new Date(r.updated_at).getTime() - new Date(r.created_at).getTime();
  if (!isFinite(diff) || diff < 0) return null;
  return diff / (1000 * 60 * 60 * 24);
};

const MairieAnalytics = ({ dashboardStats, profile: profileProp }) => {
  const { profile: profileCtx } = useAuth();
  const profile = profileProp || profileCtx;

  const [activeTab, setActiveTab] = useState('overview');
  const [timeFilter, setTimeFilter] = useState('12m');

  const [requests, setRequests] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let reqQuery = supabase
        .from('communal_requests')
        .select('id, commune, zone, type, surface, status, created_at, updated_at')
        .order('created_at', { ascending: false });
      // Les mairies gèrent les demandes de leur commune si connue
      if (profile?.city) {
        reqQuery = reqQuery.eq('commune', profile.city);
      }

      const [reqRes, dispRes] = await Promise.all([
        reqQuery,
        supabase
          .from('disputes')
          .select('id, title, status, created_at, updated_at')
          .order('created_at', { ascending: false })
      ]);

      if (reqRes.error) throw reqRes.error;
      setRequests(reqRes.data || []);
      // disputes : pas de colonne commune, on affiche l'ensemble (RLS authentifié)
      if (!dispRes.error) setDisputes(dispRes.data || []);
    } catch (err) {
      console.error('Erreur chargement analytics mairie:', err);
      setError(err.message || 'Erreur de chargement');
      setRequests([]);
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  }, [profile?.city]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fenêtre temporelle sélectionnée
  const monthsWindow = useMemo(() => {
    const map = { '3m': 3, '6m': 6, '12m': 12, '24m': 24 };
    return map[timeFilter] || 12;
  }, [timeFilter]);

  const filteredRequests = useMemo(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - monthsWindow);
    return requests.filter((r) => r.created_at && new Date(r.created_at) >= cutoff);
  }, [requests, monthsWindow]);

  // Agrégats mensuels réels (created_at -> mois)
  const monthlyRequests = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = monthsWindow - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        key: `${d.getFullYear()}-${d.getMonth()}`,
        month: `${MONTH_LABELS[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`,
        requests: 0,
        approved: 0,
        rejected: 0
      });
    }
    const index = new Map(buckets.map((b) => [b.key, b]));
    filteredRequests.forEach((r) => {
      const d = new Date(r.created_at);
      const b = index.get(`${d.getFullYear()}-${d.getMonth()}`);
      if (!b) return;
      b.requests += 1;
      if (isApproved(r.status)) b.approved += 1;
      else if (isRejected(r.status)) b.rejected += 1;
    });
    return buckets;
  }, [filteredRequests, monthsWindow]);

  // Répartition par type réelle
  const requestsByType = useMemo(() => {
    const counts = {};
    filteredRequests.forEach((r) => {
      const key = r.type || 'Non précisé';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({ name, value, color: TYPE_COLORS[i % TYPE_COLORS.length] }));
  }, [filteredRequests]);

  // Répartition par zone réelle
  const requestsByZone = useMemo(() => {
    const total = filteredRequests.length || 1;
    const grp = {};
    filteredRequests.forEach((r) => {
      const key = r.zone || 'Non précisé';
      if (!grp[key]) grp[key] = { zone: key, requests: 0, approved: 0, treated: 0, delaySum: 0, delayCount: 0 };
      grp[key].requests += 1;
      if (isApproved(r.status)) grp[key].approved += 1;
      if (isTreated(r.status)) grp[key].treated += 1;
      const days = processingDays(r);
      if (days !== null) { grp[key].delaySum += days; grp[key].delayCount += 1; }
    });
    return Object.values(grp)
      .sort((a, b) => b.requests - a.requests)
      .map((z) => ({
        ...z,
        percentage: Math.round((z.requests / total) * 100),
        approvalRate: z.treated > 0 ? Math.round((z.approved / z.treated) * 100) : null,
        avgDays: z.delayCount > 0 ? Math.round(z.delaySum / z.delayCount) : null
      }));
  }, [filteredRequests]);

  // Délais réels par type (created_at -> updated_at des demandes traitées)
  const processingTimes = useMemo(() => {
    const grp = {};
    filteredRequests.forEach((r) => {
      if (!isTreated(r.status)) return;
      const days = processingDays(r);
      if (days === null) return;
      const key = r.type || 'Non précisé';
      if (!grp[key]) grp[key] = { type: key, sum: 0, count: 0 };
      grp[key].sum += days;
      grp[key].count += 1;
    });
    return Object.values(grp)
      .map((g) => ({ type: g.type, avgDays: Math.round(g.sum / g.count), count: g.count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredRequests]);

  // KPIs réels avec comparaison mois courant vs mois précédent
  const kpis = useMemo(() => {
    const treated = filteredRequests.filter((r) => isTreated(r.status));
    const approved = filteredRequests.filter((r) => isApproved(r.status));
    const approvalRate = treated.length > 0 ? (approved.length / treated.length) * 100 : null;

    const delays = treated.map(processingDays).filter((d) => d !== null);
    const avgDelay = delays.length > 0 ? delays.reduce((a, b) => a + b, 0) / delays.length : null;

    // Mois courant vs précédent (sur l'ensemble des requests, pas la fenêtre)
    const now = new Date();
    const curKey = `${now.getFullYear()}-${now.getMonth()}`;
    const prevD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = `${prevD.getFullYear()}-${prevD.getMonth()}`;
    let curTreated = 0, prevTreated = 0;
    requests.forEach((r) => {
      if (!r.created_at || !isTreated(r.status)) return;
      const d = new Date(r.created_at);
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      if (k === curKey) curTreated += 1;
      else if (k === prevKey) prevTreated += 1;
    });
    const treatedChange = curTreated - prevTreated;

    return {
      treatedTotal: treated.length,
      treatedChange,
      approvalRate,
      avgDelay,
      openDisputes: disputes.filter((d) => d.status !== 'resolved' && d.status !== 'closed').length
    };
  }, [filteredRequests, requests, disputes]);

  // Résumé du mois courant (réel)
  const currentMonthSummary = useMemo(() => {
    const now = new Date();
    const curKey = `${now.getFullYear()}-${now.getMonth()}`;
    let created = 0, approved = 0, treated = 0, delaySum = 0, delayCount = 0;
    requests.forEach((r) => {
      if (!r.created_at) return;
      const d = new Date(r.created_at);
      if (`${d.getFullYear()}-${d.getMonth()}` !== curKey) return;
      created += 1;
      if (isApproved(r.status)) approved += 1;
      if (isTreated(r.status)) {
        treated += 1;
        const days = processingDays(r);
        if (days !== null) { delaySum += days; delayCount += 1; }
      }
    });
    return {
      created,
      approved,
      approvalRate: treated > 0 ? Math.round((approved / treated) * 100) : null,
      avgDays: delayCount > 0 ? Math.round(delaySum / delayCount) : null
    };
  }, [requests]);

  const mainKPIs = useMemo(() => [
    {
      title: 'Demandes Traitées',
      value: loading ? '…' : String(kpis.treatedTotal),
      change: kpis.treatedChange !== 0 ? `${kpis.treatedChange > 0 ? '+' : ''}${kpis.treatedChange} ce mois` : null,
      trend: kpis.treatedChange >= 0 ? 'up' : 'down',
      icon: FileText,
      color: 'blue'
    },
    {
      title: "Taux d'Approbation",
      value: loading ? '…' : (kpis.approvalRate !== null ? `${kpis.approvalRate.toFixed(1)}%` : '—'),
      change: null,
      trend: 'up',
      icon: Target,
      color: 'green'
    },
    {
      title: 'Délai Moyen',
      value: loading ? '…' : (kpis.avgDelay !== null ? `${kpis.avgDelay.toFixed(1)}j` : '—'),
      change: null,
      trend: 'up',
      icon: Clock,
      color: 'orange'
    },
    {
      title: 'Litiges Ouverts',
      value: loading ? '…' : String(kpis.openDisputes),
      change: null,
      trend: kpis.openDisputes > 0 ? 'down' : 'up',
      icon: Users,
      color: 'purple'
    }
  ], [kpis, loading]);

  const getKPIColor = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      orange: 'text-orange-600 bg-orange-100',
      purple: 'text-purple-600 bg-purple-100'
    };
    return colors[color] || 'text-gray-600 bg-gray-100';
  };

  const getTrendIcon = (trend) => (trend === 'up' ? TrendingUp : TrendingDown);
  const getTrendColor = (trend) => (trend === 'up' ? 'text-green-600' : 'text-red-600');

  const hasRequests = filteredRequests.length > 0;
  const EmptyChart = ({ label }) => (
    <div className="flex items-center justify-center h-[300px] text-sm text-gray-400">
      {label || 'Aucune donnée disponible'}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analyses & Rapports</h2>
          <p className="text-gray-600 mt-1">
            Statistiques et indicateurs de performance municipale
            {profile?.city ? ` — ${profile.city}` : ''}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 mois</SelectItem>
              <SelectItem value="6m">6 mois</SelectItem>
              <SelectItem value="12m">12 mois</SelectItem>
              <SelectItem value="24m">24 mois</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Button className="bg-teal-600 hover:bg-teal-700" disabled>
            <Download className="h-4 w-4 mr-2" />
            Export Rapport
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
          Erreur de chargement des données : {error}
        </div>
      )}

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainKPIs.map((kpi, index) => {
          const TrendIcon = getTrendIcon(kpi.trend);
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{kpi.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                      {kpi.change && (
                        <div className={`flex items-center space-x-1 mt-1 ${getTrendColor(kpi.trend)}`}>
                          <TrendIcon className="h-3 w-3" />
                          <span className="text-sm">{kpi.change}</span>
                        </div>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${getKPIColor(kpi.color)}`}>
                      <kpi.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="population">Population</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution mensuelle des demandes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 text-blue-600 mr-2" />
                  Évolution des Demandes
                </CardTitle>
                <CardDescription>Demandes et approbations par mois</CardDescription>
              </CardHeader>
              <CardContent>
                {hasRequests ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyRequests}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="requests"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        name="Demandes"
                      />
                      <Area
                        type="monotone"
                        dataKey="approved"
                        stackId="2"
                        stroke="#10B981"
                        fill="#10B981"
                        fillOpacity={0.3}
                        name="Approuvées"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart label={loading ? 'Chargement…' : 'Aucune demande communale sur la période'} />
                )}
              </CardContent>
            </Card>

            {/* Répartition par type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 text-purple-600 mr-2" />
                  Répartition par Type
                </CardTitle>
                <CardDescription>Distribution des types de demandes</CardDescription>
              </CardHeader>
              <CardContent>
                {requestsByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={requestsByType}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {requestsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPie>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart label={loading ? 'Chargement…' : 'Aucune donnée'} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Résumé mensuel */}
          <Card>
            <CardHeader>
              <CardTitle>Résumé du Mois en Cours</CardTitle>
              <CardDescription>Principales métriques du mois calendaire courant</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{currentMonthSummary.created}</div>
                  <div className="text-sm text-gray-600">Nouvelles demandes</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{currentMonthSummary.approved}</div>
                  <div className="text-sm text-gray-600">Demandes approuvées</div>
                  <div className="text-xs text-green-600 mt-1">
                    {currentMonthSummary.approvalRate !== null ? `Taux: ${currentMonthSummary.approvalRate}%` : 'Taux: —'}
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">
                    {currentMonthSummary.avgDays !== null ? `${currentMonthSummary.avgDays}j` : '—'}
                  </div>
                  <div className="text-sm text-gray-600">Délai moyen traitement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analyse des demandes */}
        <TabsContent value="requests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution détaillée */}
            <Card>
              <CardHeader>
                <CardTitle>Tendances Détaillées</CardTitle>
                <CardDescription>Évolution mensuelle par statut</CardDescription>
              </CardHeader>
              <CardContent>
                {hasRequests ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLine data={monthlyRequests}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="requests" stroke="#3B82F6" name="Demandes" />
                      <Line type="monotone" dataKey="approved" stroke="#10B981" name="Approuvées" />
                      <Line type="monotone" dataKey="rejected" stroke="#EF4444" name="Rejetées" />
                    </RechartsLine>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart label={loading ? 'Chargement…' : 'Aucune demande sur la période'} />
                )}
              </CardContent>
            </Card>

            {/* Répartition par statut */}
            <Card>
              <CardHeader>
                <CardTitle>Motifs de Rejet</CardTitle>
                <CardDescription>Détail non disponible dans le schéma actuel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-[260px] text-center text-sm text-gray-400 space-y-2">
                  <FileText className="h-8 w-8 text-gray-300" />
                  <p>Les motifs de rejet ne sont pas encore enregistrés.</p>
                  <p className="text-xs">Bientôt disponible</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analyse par zones */}
        <TabsContent value="zones" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demandes par zone */}
            <Card>
              <CardHeader>
                <CardTitle>Demandes par Zone</CardTitle>
                <CardDescription>Répartition géographique des demandes</CardDescription>
              </CardHeader>
              <CardContent>
                {requestsByZone.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBar data={requestsByZone.slice(0, 6)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="zone" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="requests" fill="#3B82F6" />
                    </RechartsBar>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart label={loading ? 'Chargement…' : 'Aucune zone renseignée'} />
                )}
              </CardContent>
            </Card>

            {/* Statistiques zones */}
            <Card>
              <CardHeader>
                <CardTitle>Performance par Zone</CardTitle>
                <CardDescription>Taux d'approbation et délais réels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {requestsByZone.length === 0 && (
                  <p className="text-sm text-gray-400">Aucune donnée de zone disponible.</p>
                )}
                {requestsByZone.map((zone, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{zone.zone}</span>
                      <Badge variant="secondary">{zone.requests} demandes</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Taux approbation</span>
                        <p className="font-medium text-green-600">
                          {zone.approvalRate !== null ? `${zone.approvalRate}%` : '—'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Délai moyen</span>
                        <p className="font-medium text-blue-600">
                          {zone.avgDays !== null ? `${zone.avgDays}j` : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Délais de Traitement par Type</CardTitle>
              <CardDescription>Délai moyen réel (création → décision) sur les demandes traitées</CardDescription>
            </CardHeader>
            <CardContent>
              {processingTimes.length === 0 ? (
                <p className="text-sm text-gray-400">
                  {loading ? 'Chargement…' : 'Aucune demande traitée sur la période.'}
                </p>
              ) : (
                <div className="space-y-6">
                  {processingTimes.map((item, index) => {
                    const maxDays = Math.max(...processingTimes.map((p) => p.avgDays), 1);
                    return (
                      <div key={index} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{item.type}</span>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-600">
                              Délai moyen: <span className="font-medium">{item.avgDays}j</span>
                            </span>
                            <Badge variant="secondary">{item.count} traitées</Badge>
                          </div>
                        </div>
                        <Progress value={Math.round((item.avgDays / maxDays) * 100)} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Population */}
        <TabsContent value="population" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Données Démographiques</CardTitle>
              <CardDescription>Statistiques de population de la commune</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-[280px] text-center text-sm text-gray-400 space-y-2">
                <Users className="h-10 w-10 text-gray-300" />
                <p>Les données démographiques ne sont pas encore connectées.</p>
                <p className="text-xs">Bientôt disponible</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MairieAnalytics;
