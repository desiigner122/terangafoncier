import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Target,
  PieChart,
  Users,
  Clock,
  Star,
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Building2,
  CreditCard,
  Percent
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, AreaChart, Area, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const APPROVED_STATUSES = ['approved', 'pre_approved', 'disbursed'];
const PORTFOLIO_STATUSES = ['approved', 'disbursed'];
const PRODUCT_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
const SEGMENT_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-cyan-500'];

const BanquePerformances = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('12m');
  const [isLoading, setIsLoading] = useState(false);

  // Données réelles Supabase
  const [loans, setLoans] = useState([]);
  const [guarantees, setGuarantees] = useState([]);
  const [clients, setClients] = useState([]);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const [{ data: loansData }, { data: guaranteesData }, { data: clientsData }] = await Promise.all([
        supabase.from('loans').select('*').eq('bank_id', user.id),
        supabase.from('guarantees').select('*').eq('bank_id', user.id),
        supabase.from('bank_clients').select('*').eq('bank_id', user.id)
      ]);
      setLoans(loansData || []);
      setGuarantees(guaranteesData || []);
      setClients(clientsData || []);
    } catch (err) {
      setLoans([]);
      setGuarantees([]);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const windowMonths = useMemo(() => {
    const map = { '3m': 3, '6m': 6, '12m': 12, '24m': 24 };
    return map[selectedPeriod] || 12;
  }, [selectedPeriod]);

  const windowStart = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - windowMonths);
    return d;
  }, [windowMonths]);

  const filteredLoans = useMemo(
    () => loans.filter((l) => l.created_at && new Date(l.created_at) >= windowStart),
    [loans, windowStart]
  );

  const formatCurrency = (value) => {
    const n = Number(value) || 0;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(n);
  };

  const getStatusColor = (status) => {
    const colors = {
      excellent: 'text-green-600 bg-green-100',
      good: 'text-blue-600 bg-blue-100',
      warning: 'text-yellow-600 bg-yellow-100',
      danger: 'text-red-600 bg-red-100',
      default: 'text-gray-500 bg-gray-100'
    };
    return colors[status] || colors.default;
  };

  const getStatusIcon = (status) => {
    const icons = {
      excellent: CheckCircle,
      good: TrendingUp,
      warning: AlertTriangle,
      danger: TrendingDown,
      default: Activity
    };
    return icons[status] || Activity;
  };

  // KPIs agrégés réels (loans / guarantees / bank_clients)
  const kpis = useMemo(() => {
    const total = filteredLoans.length;
    const approved = filteredLoans.filter((l) => APPROVED_STATUSES.includes(l.status)).length;
    const rejected = filteredLoans.filter((l) => l.status === 'rejected').length;
    const portfolio = filteredLoans
      .filter((l) => PORTFOLIO_STATUSES.includes(l.status))
      .reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
    const rates = filteredLoans.map((l) => Number(l.interest_rate)).filter((r) => !Number.isNaN(r) && r > 0);
    const avgRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : null;
    const guaranteesValue = guarantees.reduce((sum, g) => sum + (Number(g.value) || 0), 0);
    const highRisk = filteredLoans.filter((l) => l.risk_level === 'high').length;
    const scores = clients.map((c) => Number(c.credit_score)).filter((s) => !Number.isNaN(s) && s > 0);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

    return {
      portfolio: {
        label: 'Portefeuille',
        value: portfolio > 0 ? formatCurrency(portfolio) : '—',
        detail: 'Crédits approuvés / décaissés',
        status: portfolio > 0 ? 'good' : 'default'
      },
      clients: {
        label: 'Clients',
        value: clients.length > 0 ? clients.length.toLocaleString('fr-FR') : '—',
        detail: 'Clients enregistrés',
        status: clients.length > 0 ? 'good' : 'default'
      },
      approval: {
        label: 'Taux Approbation',
        value: total ? `${Math.round((approved / total) * 100)}%` : '—',
        detail: total ? `${approved}/${total} dossiers` : 'Aucun dossier',
        status: total ? 'good' : 'default'
      },
      rejection: {
        label: 'Taux de Rejet',
        value: total ? `${Math.round((rejected / total) * 100)}%` : '—',
        detail: total ? `${rejected}/${total} dossiers` : 'Aucun dossier',
        status: total ? (rejected / total > 0.3 ? 'warning' : 'good') : 'default'
      },
      avgRate: {
        label: 'Taux Intérêt Moyen',
        value: avgRate != null ? `${avgRate.toFixed(1)}%` : '—',
        detail: `${rates.length} crédit(s) avec taux`,
        status: avgRate != null ? 'good' : 'default'
      },
      guarantees: {
        label: 'Garanties',
        value: guaranteesValue > 0 ? formatCurrency(guaranteesValue) : '—',
        detail: `${guarantees.length} garantie(s)`,
        status: guaranteesValue > 0 ? 'excellent' : 'default'
      },
      _extra: { highRisk, total, avgScore }
    };
  }, [filteredLoans, guarantees, clients]);

  // Évolution mensuelle réelle du portefeuille de crédits (montant + nombre)
  const creditEvolution = useMemo(() => {
    const nbMonths = Math.min(windowMonths, 12);
    const buckets = [];
    const now = new Date();
    for (let i = nbMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, periode: MONTH_LABELS[d.getMonth()], credits: 0, dossiers: 0 });
    }
    const index = {};
    buckets.forEach((b) => { index[b.key] = b; });
    filteredLoans.forEach((l) => {
      if (!l.created_at) return;
      const d = new Date(l.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (index[key]) {
        index[key].credits += Number(l.amount) || 0;
        index[key].dossiers += 1;
      }
    });
    return buckets;
  }, [filteredLoans, windowMonths]);

  // Croissance client réelle (cumul par mois d'inscription)
  const clientEvolution = useMemo(() => {
    if (clients.length === 0) return [];
    const nbMonths = Math.min(windowMonths, 12);
    const buckets = [];
    const now = new Date();
    for (let i = nbMonths - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, periode: MONTH_LABELS[d.getMonth()], nouveaux: 0, clients: 0 });
    }
    const index = {};
    buckets.forEach((b) => { index[b.key] = b; });
    // Clients inscrits avant la fenêtre = base cumulative de départ
    let base = 0;
    clients.forEach((c) => {
      if (!c.created_at) return;
      const d = new Date(c.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (index[key]) index[key].nouveaux += 1;
      else if (new Date(c.created_at) < windowStart) base += 1;
    });
    let cumul = base;
    buckets.forEach((b) => { cumul += b.nouveaux; b.clients = cumul; });
    return buckets;
  }, [clients, windowMonths, windowStart]);

  // Répartition des crédits par type (réel)
  const productData = useMemo(() => {
    const map = {};
    filteredLoans
      .filter((l) => PORTFOLIO_STATUSES.includes(l.status))
      .forEach((l) => {
        const key = l.type || 'Autre';
        map[key] = (map[key] || 0) + (Number(l.amount) || 0);
      });
    const entries = Object.entries(map);
    return entries.map(([name, value], i) => ({ name, value, color: PRODUCT_COLORS[i % PRODUCT_COLORS.length] }));
  }, [filteredLoans]);

  // Segments par type de client (réel)
  const clientSegmentData = useMemo(() => {
    const map = {};
    clients.forEach((c) => {
      const key = c.client_type || 'Non catégorisé';
      if (!map[key]) map[key] = { segment: key, clients: 0, credits: 0 };
      map[key].clients += 1;
      map[key].credits += Number(c.total_credits) || 0;
    });
    return Object.values(map).sort((a, b) => b.clients - a.clients);
  }, [clients]);

  const hasData = loans.length > 0 || guarantees.length > 0 || clients.length > 0;

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
            Suivi des performances bancaires à partir de vos crédits, garanties et clients
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 derniers mois</SelectItem>
              <SelectItem value="6m">6 derniers mois</SelectItem>
              <SelectItem value="12m">12 derniers mois</SelectItem>
              <SelectItem value="24m">24 derniers mois</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" disabled>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Object.entries(kpis).filter(([key]) => key !== '_extra').map(([key, kpi]) => {
          const StatusIcon = getStatusIcon(kpi.status);
          return (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1 rounded-full ${getStatusColor(kpi.status)}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-medium">{kpi.label}</p>
                  <p className="text-lg font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-500">{kpi.detail}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution du portefeuille de crédits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Évolution du Portefeuille
            </CardTitle>
            <CardDescription>
              Montant des crédits accordés par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLoans.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                Aucun crédit sur la période
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={creditEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periode" />
                  <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area type="monotone" dataKey="credits" name="Crédits" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Répartition par type de crédit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Répartition du Portefeuille
            </CardTitle>
            <CardDescription>
              Par type de crédit (montant décaissé)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                Aucun crédit au portefeuille
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Pie data={productData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => e.name}>
                    {productData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Détails par segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Croissance client */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Croissance Client
            </CardTitle>
            <CardDescription>
              Évolution cumulée du nombre de clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientEvolution.length === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
                Aucun client enregistré
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={clientEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periode" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="clients" name="Clients cumulés" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Qualité du portefeuille (part de crédits à risque élevé) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Qualité du Portefeuille
            </CardTitle>
            <CardDescription>
              Part des crédits classés à risque élevé
            </CardDescription>
          </CardHeader>
          <CardContent>
            {kpis._extra.total === 0 ? (
              <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">
                Aucun dossier sur la période
              </div>
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center space-y-4">
                <div className="text-5xl font-bold text-gray-900">
                  {Math.round((kpis._extra.highRisk / kpis._extra.total) * 100)}%
                </div>
                <p className="text-sm text-gray-500">
                  {kpis._extra.highRisk} / {kpis._extra.total} dossiers à risque élevé
                </p>
                <Progress
                  value={(kpis._extra.highRisk / kpis._extra.total) * 100}
                  className="w-2/3 h-2"
                />
              </div>
            )}
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
            Répartition par type de client (crédits cumulés)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clientSegmentData.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">
              Aucun client enregistré
            </div>
          ) : (
            <div className="space-y-4">
              {clientSegmentData.map((segment, index) => (
                <div key={segment.segment} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${SEGMENT_COLORS[index % SEGMENT_COLORS.length]}`}></div>
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">{segment.segment}</h4>
                      <p className="text-sm text-gray-500">{segment.clients.toLocaleString('fr-FR')} client(s)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{formatCurrency(segment.credits)}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(segment.clients ? segment.credits / segment.clients : 0)} / client
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Indicateurs synthétiques réels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux d'approbation</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.approval.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpis.approval.detail}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score crédit moyen</p>
                <p className="text-2xl font-bold text-gray-900">{kpis._extra.avgScore != null ? kpis._extra.avgScore : '—'}</p>
                <p className="text-xs text-gray-500 mt-1">Sur {clients.length} client(s)</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux intérêt moyen</p>
                <p className="text-2xl font-bold text-gray-900">{kpis.avgRate.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpis.avgRate.detail}</p>
              </div>
              <Percent className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Garanties actives</p>
                <p className="text-2xl font-bold text-gray-900">{guarantees.length.toLocaleString('fr-FR')}</p>
                <p className="text-xs text-gray-500 mt-1">{kpis.guarantees.value}</p>
              </div>
              <CreditCard className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {!hasData && !isLoading && (
        <p className="text-center text-sm text-gray-400">
          Aucune donnée de performance disponible pour le moment.
        </p>
      )}
    </div>
  );
};

export default BanquePerformances;
