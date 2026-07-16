import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  BarChart3,
  Calendar,
  Download,
  Filter,
  Eye,
  Building,
  Users,
  Percent,
  Target,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calculator,
  FileText,
  CreditCard,
  Wallet,
  TrendingDown,
  Loader2
} from 'lucide-react';

const PromoteurFinances = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Données financières principales (agrégats réels Supabase)
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalCosts: 0,
    netProfit: 0,
    profitMargin: null,
    monthlyGrowth: null,
    cashFlow: 0,
    pendingPayments: 0
  });

  // Rentabilité par projet (developer_projects + project_sales)
  const [projectRevenues, setProjectRevenues] = useState([]);
  // Flux de trésorerie mensuel (financial_transactions + project_sales)
  const [cashFlowData, setCashFlowData] = useState([]);
  // Créances = ventes réservées non soldées (project_sales)
  const [receivables, setReceivables] = useState([]);
  // Résumé des créances
  const [receivablesSummary, setReceivablesSummary] = useState({
    upcoming: 0,
    overdue: 0,
    collectedThisMonth: 0
  });

  const isSold = (s) => ['sold', 'delivered'].includes(String(s || '').toLowerCase());

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [
          { data: projects },
          { data: sales },
          { data: transactions }
        ] = await Promise.all([
          supabase
            .from('developer_projects')
            .select('*')
            .eq('developer_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('project_sales')
            .select('*')
            .eq('promoteur_id', user.id),
          supabase
            .from('financial_transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        ]);

        const projectList = projects || [];
        const salesList = sales || [];
        const txList = transactions || [];

        const projById = {};
        projectList.forEach((p) => { projById[p.id] = p; });

        // ----- Agrégats globaux -----
        const soldSales = salesList.filter((s) => isSold(s.status));
        // Chiffre d'affaires = somme des ventes soldées
        const totalRevenue = soldSales.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
        // Coûts = somme des dépenses réelles des projets (spent)
        const totalCosts = projectList.reduce((sum, p) => sum + (Number(p.spent) || 0), 0);
        const netProfit = totalRevenue - totalCosts;
        const profitMargin = totalRevenue > 0
          ? Math.round((netProfit / totalRevenue) * 1000) / 10
          : null;

        // Créances = ventes réservées non encore encaissées
        const reservedSales = salesList.filter(
          (s) => String(s.status || '').toLowerCase() === 'reserved'
        );
        const pendingPayments = reservedSales.reduce(
          (sum, s) => sum + (Number(s.price) || 0),
          0
        );

        // Croissance mensuelle réelle (CA mois courant vs précédent)
        const now = new Date();
        const curKey = `${now.getFullYear()}-${now.getMonth()}`;
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevKey = `${prev.getFullYear()}-${prev.getMonth()}`;
        let curCA = 0;
        let prevCA = 0;
        soldSales.forEach((s) => {
          if (!s.sale_date) return;
          const d = new Date(s.sale_date);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (key === curKey) curCA += Number(s.price) || 0;
          else if (key === prevKey) prevCA += Number(s.price) || 0;
        });
        const monthlyGrowth =
          prevCA > 0 ? Math.round(((curCA - prevCA) / prevCA) * 1000) / 10 : null;

        // ----- Flux de trésorerie mensuel (12 derniers mois) -----
        // Entrées : ventes soldées (sale_date) + transactions crédit.
        // Sorties : transactions de type débit/dépense.
        const monthsBack = [];
        const monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        for (let i = 11; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          monthsBack.push({
            key: `${d.getFullYear()}-${d.getMonth()}`,
            month: monthLabels[d.getMonth()],
            income: 0,
            expenses: 0,
            net: 0
          });
        }
        const cfMap = {};
        monthsBack.forEach((m) => { cfMap[m.key] = m; });

        soldSales.forEach((s) => {
          const ref = s.sale_date || s.created_at;
          if (!ref) return;
          const d = new Date(ref);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (cfMap[key]) cfMap[key].income += Number(s.price) || 0;
        });

        const isExpense = (t) => {
          const kind = String(t.type || t.transaction_type || '').toLowerCase();
          return ['debit', 'expense', 'depense', 'dépense', 'sortie', 'payment', 'paiement'].some((k) => kind.includes(k));
        };
        const isIncome = (t) => {
          const kind = String(t.type || t.transaction_type || '').toLowerCase();
          return ['credit', 'income', 'revenu', 'entree', 'entrée', 'encaissement', 'sale', 'vente'].some((k) => kind.includes(k));
        };

        txList.forEach((t) => {
          const ref = t.created_at;
          if (!ref) return;
          const d = new Date(ref);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (!cfMap[key]) return;
          const amt = Number(t.amount) || 0;
          if (isExpense(t)) cfMap[key].expenses += Math.abs(amt);
          else if (isIncome(t)) cfMap[key].income += Math.abs(amt);
        });

        monthsBack.forEach((m) => { m.net = m.income - m.expenses; });

        // Flux de trésorerie net cumulé sur la période affichée
        const cashFlow = monthsBack.reduce((sum, m) => sum + m.net, 0);

        setFinancialData({
          totalRevenue,
          totalCosts,
          netProfit,
          profitMargin,
          monthlyGrowth,
          cashFlow,
          pendingPayments
        });
        setCashFlowData(monthsBack.map(({ key, ...rest }) => rest));

        // ----- Rentabilité par projet -----
        const statusLabel = (st) => {
          const s = String(st || '').toLowerCase();
          if (s.includes('complet') || s.includes('termin') || s.includes('done') || s.includes('deliver')) return 'Terminé';
          return 'En cours';
        };
        const perf = projectList.map((p) => {
          const forP = salesList.filter((s) => s.project_id === p.id);
          const closed = forP.filter((s) => isSold(s.status));
          const revenue = closed.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
          const costs = Number(p.spent) || 0;
          const budget = Number(p.budget) || 0;
          const profit = revenue - costs;
          const pm = revenue > 0 ? Math.round((profit / revenue) * 1000) / 10 : null;
          const unitsTotal = forP.length;
          const unitsSold = closed.length;
          const averagePrice = unitsSold ? Math.round(revenue / unitsSold) : 0;
          const completion = Number(p.progress) || 0;
          // Niveau de risque dérivé du dépassement budgétaire réel
          let riskLevel = 'Faible';
          if (budget > 0) {
            const ratio = costs / budget;
            if (ratio > 0.9) riskLevel = 'Élevé';
            else if (ratio > 0.6) riskLevel = 'Moyen';
          } else {
            riskLevel = null;
          }
          return {
            id: p.id,
            name: p.title || 'Projet',
            totalBudget: budget,
            revenue,
            costs,
            profit,
            profitMargin: pm,
            unitsTotal,
            unitsSold,
            averagePrice,
            status: statusLabel(p.status),
            completion,
            expectedCompletion: p.estimated_completion || null,
            completedDate: p.updated_at || null,
            riskLevel
          };
        });
        setProjectRevenues(perf);

        // ----- Créances (ventes réservées) -----
        const today = new Date();
        const recv = reservedSales.map((s) => {
          const due = s.sale_date ? new Date(s.sale_date) : null;
          const daysPastDue = due ? Math.floor((today - due) / (1000 * 60 * 60 * 24)) : 0;
          const overdue = daysPastDue > 0;
          return {
            id: s.id,
            client: s.buyer_name || 'Acquéreur',
            project: projById[s.project_id]?.title || '—',
            amount: Number(s.price) || 0,
            dueDate: s.sale_date || null,
            status: overdue ? 'En retard' : 'À venir',
            daysPastDue: overdue ? daysPastDue : 0,
            type: s.unit_reference ? `Lot ${s.unit_reference}` : (s.unit_type || 'Réservation')
          };
        });
        setReceivables(recv);

        // Résumé des créances
        const upcoming = recv
          .filter((r) => r.status === 'À venir')
          .reduce((sum, r) => sum + r.amount, 0);
        const overdueTotal = recv
          .filter((r) => r.status === 'En retard')
          .reduce((sum, r) => sum + r.amount, 0);
        // Encaissé ce mois = ventes soldées durant le mois courant
        const collectedThisMonth = soldSales
          .filter((s) => {
            const ref = s.sale_date || s.created_at;
            if (!ref) return false;
            const d = new Date(ref);
            return `${d.getFullYear()}-${d.getMonth()}` === curKey;
          })
          .reduce((sum, s) => sum + (Number(s.price) || 0), 0);
        setReceivablesSummary({ upcoming, overdue: overdueTotal, collectedThisMonth });
      } catch (err) {
        console.error('Erreur chargement finances promoteur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'En retard': return 'bg-red-100 text-red-800';
      case 'À venir': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Faible': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Élevé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfitColor = (profit) => {
    return profit >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const maxIncome = cashFlowData.length
    ? Math.max(...cashFlowData.map((m) => m.income), 1)
    : 1;

  if (loading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center py-24">
        <div className="flex flex-col items-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p>Chargement des données financières...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion Financière</h1>
            <p className="text-gray-600">Suivi des finances et rentabilité des projets</p>
          </div>
          <div className="flex items-center space-x-2">
            {financialData.monthlyGrowth !== null && (
              <Badge className={financialData.monthlyGrowth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {formatPercentage(financialData.monthlyGrowth)} ce mois
              </Badge>
            )}
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Rapport
            </Button>
          </div>
        </div>

        {/* Indicateurs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(financialData.totalRevenue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {financialData.monthlyGrowth !== null ? (
                  <>
                    {getChangeIcon(financialData.monthlyGrowth)}
                    <span className={`text-sm font-medium ml-1 ${financialData.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercentage(financialData.monthlyGrowth)} vs mois dernier
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-400">Ventes soldées cumulées</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bénéfice Net</p>
                  <p className={`text-2xl font-bold ${getProfitColor(financialData.netProfit)}`}>
                    {formatCurrency(financialData.netProfit)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={Math.max(0, Math.min(100, financialData.profitMargin || 0))} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">
                  Marge: {financialData.profitMargin !== null ? `${financialData.profitMargin}%` : '—'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Flux de Trésorerie</p>
                  <p className={`text-2xl font-bold ${getProfitColor(financialData.cashFlow)}`}>
                    {formatCurrency(financialData.cashFlow)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${financialData.cashFlow >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
                  {financialData.cashFlow >= 0 ? 'Flux positif' : 'Flux négatif'} (12 mois)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Créances</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatCurrency(financialData.pendingPayments)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-orange-600 font-medium">
                  À encaisser
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Projets
            </TabsTrigger>
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Dépenses
            </TabsTrigger>
            <TabsTrigger value="receivables" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Créances
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution des revenus */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du Chiffre d'Affaires</CardTitle>
                  <CardDescription>Performance mensuelle sur 12 mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Graphique des revenus (bientôt disponible)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Flux de trésorerie */}
              <Card>
                <CardHeader>
                  <CardTitle>Flux de Trésorerie</CardTitle>
                  <CardDescription>Entrées vs sorties mensuelles</CardDescription>
                </CardHeader>
                <CardContent>
                  {cashFlowData.some((m) => m.income > 0 || m.expenses > 0) ? (
                    <div className="space-y-4">
                      {cashFlowData.slice(-6).map((month, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 text-sm font-medium">{month.month}</div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-green-600">
                                  +{formatCurrency(month.income)}
                                </span>
                                <span className="text-red-600">
                                  -{formatCurrency(month.expenses)}
                                </span>
                              </div>
                              <Progress
                                value={(month.income / maxIncome) * 100}
                                className="h-2"
                              />
                            </div>
                          </div>
                          <div className={`font-semibold ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(month.net)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                      Aucun mouvement de trésorerie enregistré
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Alertes financières */}
            <Card>
              <CardHeader>
                <CardTitle>Alertes Financières</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const alerts = [];
                  // Créances en retard réelles
                  const overdue = receivables.filter((r) => r.status === 'En retard');
                  overdue.forEach((r) => {
                    alerts.push({
                      type: 'danger',
                      title: 'Créance en retard',
                      text: `${formatCurrency(r.amount)} de ${r.client} en retard de ${r.daysPastDue} jour(s)`
                    });
                  });
                  // Dépassement budgétaire réel
                  projectRevenues.forEach((p) => {
                    if (p.totalBudget > 0 && p.costs > p.totalBudget) {
                      const pct = Math.round(((p.costs - p.totalBudget) / p.totalBudget) * 100);
                      alerts.push({
                        type: 'warning',
                        title: 'Budget dépassé',
                        text: `Projet ${p.name}: +${pct}% du budget initial`
                      });
                    }
                  });
                  // Objectif de marge atteint
                  if (financialData.profitMargin !== null && financialData.profitMargin >= 30) {
                    alerts.push({
                      type: 'info',
                      title: 'Objectif atteint',
                      text: `Marge bénéficiaire de ${financialData.profitMargin}% atteinte`
                    });
                  }

                  if (alerts.length === 0) {
                    return (
                      <div className="text-center text-gray-400 text-sm py-6">
                        Aucune alerte financière
                      </div>
                    );
                  }

                  const styles = {
                    danger: { box: 'bg-red-50 border-red-200', icon: <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />, title: 'text-red-800', text: 'text-red-600' },
                    warning: { box: 'bg-yellow-50 border-yellow-200', icon: <Clock className="w-5 h-5 text-yellow-600 mr-3" />, title: 'text-yellow-800', text: 'text-yellow-600' },
                    info: { box: 'bg-blue-50 border-blue-200', icon: <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />, title: 'text-blue-800', text: 'text-blue-600' }
                  };

                  return (
                    <div className="space-y-3">
                      {alerts.slice(0, 6).map((a, i) => {
                        const st = styles[a.type];
                        return (
                          <div key={i} className={`flex items-center p-3 border rounded-lg ${st.box}`}>
                            {st.icon}
                            <div className="flex-1">
                              <p className={`font-medium ${st.title}`}>{a.title}</p>
                              <p className={`text-sm ${st.text}`}>{a.text}</p>
                            </div>
                            {a.type !== 'info' && (
                              <Button size="sm" variant="outline">
                                {a.type === 'danger' ? 'Relancer' : 'Analyser'}
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rentabilité par projet */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Rentabilité par Projet</CardTitle>
                  <Button variant="outline" size="sm">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculateur ROI
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {projectRevenues.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <Building className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>Aucun projet enregistré</p>
                  </div>
                ) : (
                <div className="space-y-6">
                  {projectRevenues.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {project.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                            {project.riskLevel && (
                              <Badge className={getRiskColor(project.riskLevel)}>
                                Risque {project.riskLevel}
                              </Badge>
                            )}
                            <Badge className="bg-gray-100 text-gray-800">
                              {project.completion}% terminé
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {project.unitsSold}/{project.unitsTotal} unités vendues
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getProfitColor(project.profit)}`}>
                            {formatCurrency(project.profit)}
                          </p>
                          <p className="text-sm text-gray-500">Bénéfice actuel</p>
                          <p className={`text-sm font-medium ${getProfitColor(project.profit)}`}>
                            Marge: {formatPercentage(project.profitMargin)}
                          </p>
                        </div>
                      </div>

                      {/* Métriques financières */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-lg font-bold text-blue-600">
                            {formatCurrency(project.revenue)}
                          </p>
                          <p className="text-sm text-blue-700">Revenus</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-lg font-bold text-red-600">
                            {formatCurrency(project.costs)}
                          </p>
                          <p className="text-sm text-red-700">Coûts</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-600">
                            {formatCurrency(project.totalBudget)}
                          </p>
                          <p className="text-sm text-gray-700">Budget total</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(project.averagePrice)}
                          </p>
                          <p className="text-sm text-green-700">Prix moyen</p>
                        </div>
                      </div>

                      {/* Progression */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progression du projet</span>
                          <span className="font-medium">{project.completion}%</span>
                        </div>
                        <Progress value={project.completion} className="h-3" />
                      </div>

                      {/* Analyse */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 mb-1">ROI projeté</p>
                            <p className={`font-semibold ${getProfitColor(project.profit)}`}>
                              {formatPercentage(project.profitMargin)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Échéance</p>
                            <p className="font-semibold">
                              {project.status === 'Terminé'
                                ? (project.completedDate ? `Terminé le ${new Date(project.completedDate).toLocaleDateString('fr-FR')}` : 'Terminé')
                                : (project.expectedCompletion ? `Fin prévue: ${new Date(project.expectedCompletion).toLocaleDateString('fr-FR')}` : '—')
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 mb-1">Taux de vente</p>
                            <p className="font-semibold">
                              {project.unitsTotal > 0 ? `${Math.round((project.unitsSold / project.unitsTotal) * 100)}%` : '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyse des dépenses */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Répartition des dépenses */}
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des Dépenses</CardTitle>
                  <CardDescription>Par projet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Graphique en secteurs (bientôt disponible)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Évolution mensuelle */}
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des Dépenses</CardTitle>
                  <CardDescription>Tendance mensuelle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Graphique linéaire (bientôt disponible)</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Détail des dépenses par projet (developer_projects.spent) */}
            <Card>
              <CardHeader>
                <CardTitle>Dépenses par Projet</CardTitle>
                <CardDescription>Dépenses engagées vs budget alloué</CardDescription>
              </CardHeader>
              <CardContent>
                {projectRevenues.filter((p) => p.costs > 0 || p.totalBudget > 0).length === 0 ? (
                  <div className="text-center text-gray-400 py-10">
                    Aucune dépense enregistrée
                  </div>
                ) : (
                <div className="space-y-4">
                  {(() => {
                    const totalSpent = projectRevenues.reduce((s, p) => s + p.costs, 0) || 1;
                    return projectRevenues
                      .filter((p) => p.costs > 0 || p.totalBudget > 0)
                      .map((project, index) => {
                        const pct = Math.round((project.costs / totalSpent) * 1000) / 10;
                        const budgetUse = project.totalBudget > 0
                          ? Math.round((project.costs / project.totalBudget) * 100)
                          : null;
                        return (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border rounded-lg p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                                {budgetUse !== null && (
                                  <span className={`text-sm font-medium ${budgetUse > 100 ? 'text-red-600' : 'text-gray-500'}`}>
                                    {budgetUse}% du budget
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg text-gray-900">
                                  {formatCurrency(project.costs)}
                                </p>
                                <p className="text-sm text-gray-500">{pct}% des dépenses</p>
                              </div>
                            </div>
                            <Progress value={Math.min(100, pct)} className="h-2 mb-3" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Budget alloué:</span>
                                <span className="font-medium">{formatCurrency(project.totalBudget)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Reste disponible:</span>
                                <span className="font-medium">
                                  {formatCurrency(Math.max(0, project.totalBudget - project.costs))}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      });
                  })()}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Créances */}
          <TabsContent value="receivables" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Créances en Cours</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {formatCurrency(financialData.pendingPayments)} à encaisser
                </CardDescription>
              </CardHeader>
              <CardContent>
                {receivables.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>Aucune créance en cours</p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {receivables.map((receivable) => (
                    <motion.div
                      key={receivable.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {receivable.client.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {receivable.client}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {receivable.project} - {receivable.type}
                            </p>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(receivable.status)}>
                                {receivable.status}
                              </Badge>
                              {receivable.daysPastDue > 0 && (
                                <Badge className="bg-red-100 text-red-800">
                                  {receivable.daysPastDue} jours de retard
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600 mb-1">
                            {formatCurrency(receivable.amount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Échéance: {receivable.dueDate ? new Date(receivable.dueDate).toLocaleDateString('fr-FR') : '—'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="text-sm text-gray-600">
                          {receivable.status === 'En retard' && (
                            <span className="text-red-600 font-medium">
                              Action requise: Relance client
                            </span>
                          )}
                          {receivable.status === 'À venir' && receivable.dueDate && (
                            <span className="text-blue-600">
                              Paiement prévu dans {Math.ceil((new Date(receivable.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} jours
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                          {receivable.status === 'En retard' && (
                            <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                              Relancer
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>

            {/* Résumé des créances */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé des Créances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(receivablesSummary.upcoming)}
                    </p>
                    <p className="text-sm text-green-700">À venir</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {formatCurrency(receivablesSummary.overdue)}
                    </p>
                    <p className="text-sm text-red-700">En retard</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(receivablesSummary.collectedThisMonth)}
                    </p>
                    <p className="text-sm text-blue-700">Encaissé ce mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PromoteurFinances;
