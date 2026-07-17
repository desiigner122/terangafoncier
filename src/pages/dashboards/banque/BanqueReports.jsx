import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  PieChart,
  Calendar,
  Download,
  Filter,
  Eye,
  RefreshCw,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Building2,
  Smartphone,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
const SEGMENT_COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'];
const APPROVED_STATUSES = ['approved', 'pre_approved', 'disbursed'];
const DISBURSED_STATUSES = ['approved', 'disbursed'];

const PERIOD_DAYS = { week: 7, month: 30, quarter: 90, year: 365 };

const RISK_LEVEL_META = {
  low: { label: 'Faible', order: 1 },
  medium: { label: 'Modéré', order: 2 },
  moderate: { label: 'Modéré', order: 2 },
  high: { label: 'Élevé', order: 3 }
};

const BanqueReports = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(false);

  // Données réelles Supabase
  const [loans, setLoans] = useState([]);
  const [clients, setClients] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [riskAssessments, setRiskAssessments] = useState([]);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const [
        { data: loansData },
        { data: clientsData },
        { data: txData },
        { data: riskData }
      ] = await Promise.all([
        supabase.from('loans').select('*').eq('bank_id', user.id),
        supabase.from('bank_clients').select('*').eq('bank_id', user.id),
        supabase.from('financial_transactions').select('*').eq('user_id', user.id),
        supabase.from('risk_assessments').select('*').eq('bank_id', user.id)
      ]);
      setLoans(loansData || []);
      setClients(clientsData || []);
      setTransactions(txData || []);
      setRiskAssessments(riskData || []);
    } catch (err) {
      setLoans([]);
      setClients([]);
      setTransactions([]);
      setRiskAssessments([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (value) => {
    const v = Number(value) || 0;
    if (v >= 1000000000) {
      return `${(v / 1000000000).toFixed(1)}Md XOF`;
    } else if (v >= 1000000) {
      return `${(v / 1000000).toFixed(1)}M XOF`;
    } else if (v >= 1000) {
      return `${(v / 1000).toFixed(0)}K XOF`;
    }
    return `${v} XOF`;
  };

  const formatGrowth = (g) => (g == null ? '—' : `${g >= 0 ? '+' : ''}${g.toFixed(1)}%`);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Faible': return 'text-green-600 bg-green-100';
      case 'Modéré': return 'text-yellow-600 bg-yellow-100';
      case 'Élevé': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Fenêtre temporelle sélectionnée (jours)
  const windowDays = PERIOD_DAYS[selectedPeriod] || 30;

  // Bornes de la fenêtre courante et de la fenêtre précédente (pour la croissance)
  const { curStart, prevStart } = useMemo(() => {
    const now = Date.now();
    return {
      curStart: new Date(now - windowDays * 86400000),
      prevStart: new Date(now - 2 * windowDays * 86400000)
    };
  }, [windowDays]);

  const growth = (cur, prev) => {
    if (!prev || prev === 0) return null;
    return ((cur - prev) / prev) * 100;
  };

  // Transactions "revenus" = transactions réussies/complétées
  const isCompleted = (t) => ['completed', 'success', 'succeeded', 'paid'].includes((t.status || '').toLowerCase());

  // ---- Métriques principales (réelles) ----
  const performanceMetrics = useMemo(() => {
    const inCur = (d) => d && new Date(d) >= curStart;
    const inPrev = (d) => d && new Date(d) >= prevStart && new Date(d) < curStart;

    // Revenus depuis financial_transactions (montants des transactions complétées)
    const curTx = transactions.filter((t) => inCur(t.created_at));
    const prevTx = transactions.filter((t) => inPrev(t.created_at));
    const sumTx = (arr) => arr.filter(isCompleted).reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const totalRevenue = sumTx(curTx);
    const revenueGrowth = growth(totalRevenue, sumTx(prevTx));

    // Clients actifs
    const totalClients = clients.filter((c) => (c.status || 'active') === 'active').length;
    const newCur = clients.filter((c) => inCur(c.created_at)).length;
    const newPrev = clients.filter((c) => inPrev(c.created_at)).length;
    const clientGrowth = growth(newCur, newPrev);

    // Transactions (nombre)
    const totalTransactions = curTx.length;
    const transactionGrowth = growth(curTx.length, prevTx.length);
    const completedCur = curTx.filter(isCompleted);
    const averageTransactionValue = completedCur.length
      ? completedCur.reduce((s, t) => s + (Number(t.amount) || 0), 0) / completedCur.length
      : 0;

    // Portefeuille de crédits (loans)
    const creditPortfolio = loans.reduce((s, l) => s + (Number(l.amount) || 0), 0);
    const portfolioValue = loans
      .filter((l) => DISBURSED_STATUSES.includes(l.status))
      .reduce((s, l) => s + (Number(l.amount) || 0), 0);

    // Ratio de risque = part des crédits à risque élevé
    const decided = loans.filter((l) => l.risk_level);
    const highRisk = decided.filter((l) => (l.risk_level || '').toLowerCase() === 'high').length;
    const riskRatio = decided.length ? (highRisk / decided.length) * 100 : null;

    return {
      totalRevenue,
      revenueGrowth,
      totalClients,
      clientGrowth,
      totalTransactions,
      transactionGrowth,
      averageTransactionValue,
      portfolioValue,
      creditPortfolio,
      riskRatio,
      // Pas de source réelle pour un score de conformité normalisé
      complianceScore: null
    };
  }, [transactions, clients, loans, curStart, prevStart]);

  // ---- Évolution mensuelle (9 derniers mois) : revenus, transactions, nouveaux clients ----
  const monthlyRevenue = useMemo(() => {
    const nb = 9;
    const now = new Date();
    const buckets = [];
    for (let i = nb - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTH_LABELS[d.getMonth()], revenue: 0, transactions: 0, clients: 0 });
    }
    const byKey = Object.fromEntries(buckets.map((b) => [b.key, b]));
    const keyOf = (dateStr) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${d.getMonth()}`;
    };
    transactions.forEach((t) => {
      if (!t.created_at) return;
      const b = byKey[keyOf(t.created_at)];
      if (!b) return;
      b.transactions += 1;
      if (isCompleted(t)) b.revenue += Number(t.amount) || 0;
    });
    clients.forEach((c) => {
      if (!c.created_at) return;
      const b = byKey[keyOf(c.created_at)];
      if (b) b.clients += 1;
    });
    return buckets;
  }, [transactions, clients]);

  const hasMonthlyData = monthlyRevenue.some((m) => m.revenue > 0 || m.transactions > 0 || m.clients > 0);

  // ---- Segmentation clients par client_type (réel) ----
  const clientSegments = useMemo(() => {
    if (clients.length === 0) return [];
    const counts = {};
    clients.forEach((c) => {
      const key = c.client_type || 'Non défini';
      counts[key] = (counts[key] || 0) + 1;
    });
    const total = clients.length;
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({
        name,
        value: Math.round((count / total) * 100),
        count,
        color: SEGMENT_COLORS[i % SEGMENT_COLORS.length]
      }));
  }, [clients]);

  // ---- Types de transactions (réel) ----
  const transactionTypes = useMemo(() => {
    if (transactions.length === 0) return [];
    const groups = {};
    let totalAmount = 0;
    transactions.forEach((t) => {
      const key = t.transaction_type || t.type || t.category || 'Autre';
      if (!groups[key]) groups[key] = { type: key, amount: 0, count: 0 };
      const amt = Number(t.amount) || 0;
      groups[key].amount += amt;
      groups[key].count += 1;
      totalAmount += amt;
    });
    return Object.values(groups)
      .sort((a, b) => b.amount - a.amount)
      .map((g, i) => ({
        ...g,
        percentage: totalAmount ? Math.round((g.amount / totalAmount) * 100) : 0,
        color: SEGMENT_COLORS[i % SEGMENT_COLORS.length]
      }));
  }, [transactions]);

  // ---- Analyse des risques : exposition par type de crédit (loans + risk_assessments) ----
  const riskAnalysis = useMemo(() => {
    if (loans.length === 0) return [];
    // Map loan_id -> dernier risk_score
    const scoreByLoan = {};
    riskAssessments.forEach((r) => {
      if (r.loan_id != null && r.risk_score != null) scoreByLoan[r.loan_id] = Number(r.risk_score);
    });
    const groups = {};
    loans.forEach((l) => {
      const key = l.type || 'Crédit';
      if (!groups[key]) groups[key] = { category: key, exposure: 0, levelCounts: {}, scores: [] };
      groups[key].exposure += Number(l.amount) || 0;
      const lvl = (l.risk_level || '').toLowerCase();
      if (lvl) groups[key].levelCounts[lvl] = (groups[key].levelCounts[lvl] || 0) + 1;
      if (scoreByLoan[l.id] != null) groups[key].scores.push(scoreByLoan[l.id]);
    });
    return Object.values(groups)
      .sort((a, b) => b.exposure - a.exposure)
      .map((g) => {
        // Niveau de risque dominant
        const dominant = Object.entries(g.levelCounts).sort((a, b) => b[1] - a[1])[0];
        const risk = dominant ? (RISK_LEVEL_META[dominant[0]]?.label || 'N/D') : 'N/D';
        const score = g.scores.length
          ? Math.round(g.scores.reduce((a, b) => a + b, 0) / g.scores.length)
          : null;
        return { category: g.category, exposure: g.exposure, risk, score };
      });
  }, [loans, riskAssessments]);

  const exportReport = () => {
    window.safeGlobalToast?.({
      title: "Export du rapport",
      description: "Génération du rapport à partir des données réelles du portefeuille.",
      variant: "success"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
            Rapports & Analyses
          </h2>
          <p className="text-gray-600 mt-1">
            Analyses détaillées et rapports de performance bancaire
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
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter PDF
          </Button>
          <Button onClick={fetchData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus (période)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(performanceMetrics.totalRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  {performanceMetrics.revenueGrowth != null && performanceMetrics.revenueGrowth < 0
                    ? <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    : <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
                  <span className="text-sm text-green-600 font-medium">
                    {formatGrowth(performanceMetrics.revenueGrowth)}
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clients Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceMetrics.totalClients}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">
                    {formatGrowth(performanceMetrics.clientGrowth)}
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transactions (période)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceMetrics.totalTransactions}
                </p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">
                    {formatGrowth(performanceMetrics.transactionGrowth)}
                  </span>
                </div>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ratio de risque</p>
                <p className="text-2xl font-bold text-gray-900">
                  {performanceMetrics.riskRatio != null ? `${performanceMetrics.riskRatio.toFixed(1)}%` : '—'}
                </p>
                <div className="flex items-center mt-1">
                  {performanceMetrics.riskRatio != null ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-gray-600 font-medium">Crédits à risque élevé</span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400 font-medium">Aucune évaluation</span>
                  )}
                </div>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets des rapports */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="risk">Analyse Risques</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Évolution des revenus */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des Revenus</CardTitle>
                <CardDescription>Revenus mensuels (transactions complétées)</CardDescription>
              </CardHeader>
              <CardContent>
                {hasMonthlyData ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                    Aucune transaction sur la période
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Répartition par type de transaction */}
            <Card>
              <CardHeader>
                <CardTitle>Types de Transactions</CardTitle>
                <CardDescription>Répartition des volumes par type</CardDescription>
              </CardHeader>
              <CardContent>
                {transactionTypes.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={transactionTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                        nameKey="type"
                      >
                        {transactionTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                    Aucune transaction enregistrée
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Métriques de performance détaillées */}
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs de Performance</CardTitle>
              <CardDescription>Métriques clés du portefeuille</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Portefeuille</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Crédits décaissés</span>
                      <span className="font-semibold">{formatCurrency(performanceMetrics.portfolioValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Portefeuille total</span>
                      <span className="font-semibold">{formatCurrency(performanceMetrics.creditPortfolio)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Nb crédits</span>
                      <span className="font-semibold">{loans.length}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Transactions</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valeur moyenne</span>
                      <span className="font-semibold">{formatCurrency(performanceMetrics.averageTransactionValue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Volume (période)</span>
                      <span className="font-semibold">{performanceMetrics.totalTransactions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Croissance</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {formatGrowth(performanceMetrics.transactionGrowth)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Risques</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ratio de risque élevé</span>
                      <Badge className="bg-green-100 text-green-800">
                        {performanceMetrics.riskRatio != null ? `${performanceMetrics.riskRatio.toFixed(1)}%` : '—'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Évaluations</span>
                      <span className="font-semibold">{riskAssessments.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Conformité</span>
                      <span className="text-sm text-gray-400">Bientôt disponible</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Acquisition Clients</CardTitle>
                <CardDescription>Nouveaux clients par mois</CardDescription>
              </CardHeader>
              <CardContent>
                {clients.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="clients" stroke="#10B981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">
                    Aucun client enregistré
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segmentation Clients</CardTitle>
                <CardDescription>Répartition par type de client</CardDescription>
              </CardHeader>
              <CardContent>
                {clientSegments.length > 0 ? (
                  <div className="space-y-4">
                    {clientSegments.map((segment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: segment.color }}></div>
                          <span className="font-medium">{segment.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold">{segment.value}%</span>
                          <p className="text-xs text-gray-500">{segment.count} client(s)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-gray-400 text-sm">
                    Aucun client à segmenter
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Transactions</CardTitle>
              <CardDescription>Volume et fréquence par type</CardDescription>
            </CardHeader>
            <CardContent>
              {transactionTypes.length > 0 ? (
                <div className="space-y-4">
                  {transactionTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{type.type}</h4>
                          <p className="text-sm text-gray-600">{type.count} transactions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(type.amount)}</p>
                        <Badge className="bg-gray-100 text-gray-800">{type.percentage}%</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400 text-sm">
                  Aucune transaction enregistrée
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse des Risques</CardTitle>
              <CardDescription>Exposition par catégorie de crédit</CardDescription>
            </CardHeader>
            <CardContent>
              {riskAnalysis.length > 0 ? (
                <div className="space-y-4">
                  {riskAnalysis.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Target className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{category.category}</h4>
                          <p className="text-sm text-gray-600">
                            {category.score != null ? `Score: ${category.score}/100` : 'Score non évalué'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <p className="text-lg font-bold">{formatCurrency(category.exposure)}</p>
                        <Badge className={getRiskColor(category.risk)}>{category.risk}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-400 text-sm">
                  Aucun crédit à analyser
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueReports;
