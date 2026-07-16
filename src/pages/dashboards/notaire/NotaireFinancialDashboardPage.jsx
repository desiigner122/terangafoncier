import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, FileText, Users, ArrowUp, ArrowDown, Star, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const TYPE_COLORS = ['blue', 'green', 'purple', 'orange', 'indigo', 'pink'];

const formatFCFA = (n) => `${Math.round(Number(n) || 0).toLocaleString('fr-FR')} FCFA`;

const NotaireFinancialDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [revenueByType, setRevenueByType] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      setLoading(true);
      try {
        // Source principale : actes notariés du notaire (honoraires réels)
        const { data: actsData } = await supabase
          .from('notarial_acts')
          .select('id, act_type, reference, client_id, client_name, status, notary_fees, amount, client_satisfaction, signed_at, created_at')
          .eq('notaire_id', user.id)
          .order('created_at', { ascending: false });

        // Source complémentaire : transactions financières réelles du compte
        const { data: txData } = await supabase
          .from('financial_transactions')
          .select('id, reference, client_name, type, transaction_type, category, amount, fees, status, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        const acts = actsData || [];
        const txs = txData || [];

        // ---- KPIs (agrégats réels sur notarial_acts) ----
        const totalFees = acts.reduce((s, a) => s + (Number(a.notary_fees) || 0), 0);
        const totalVolume = acts.reduce((s, a) => s + (Number(a.amount) || 0), 0);
        const satisfList = acts.filter((a) => a.client_satisfaction != null);
        const avgSatisf = satisfList.length
          ? Math.round(satisfList.reduce((s, a) => s + Number(a.client_satisfaction), 0) / satisfList.length)
          : null;

        // Variation honoraires : mois courant vs mois précédent (dates réelles)
        const now = new Date();
        const curKey = `${now.getFullYear()}-${now.getMonth()}`;
        const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevKey = `${prev.getFullYear()}-${prev.getMonth()}`;
        const feesByMonthKey = {};
        acts.forEach((a) => {
          const d = new Date(a.signed_at || a.created_at);
          if (isNaN(d)) return;
          const k = `${d.getFullYear()}-${d.getMonth()}`;
          feesByMonthKey[k] = (feesByMonthKey[k] || 0) + (Number(a.notary_fees) || 0);
        });
        const curFees = feesByMonthKey[curKey] || 0;
        const prevFees = feesByMonthKey[prevKey] || 0;
        let feesChange = null;
        if (prevFees > 0) feesChange = ((curFees - prevFees) / prevFees) * 100;

        setKpis([
          {
            label: 'Honoraires perçus',
            value: acts.length ? formatFCFA(totalFees) : '—',
            change: feesChange != null ? `${feesChange >= 0 ? '+' : ''}${feesChange.toFixed(1)}%` : null,
            trend: feesChange != null && feesChange >= 0 ? 'up' : 'down',
            icon: DollarSign, color: 'green'
          },
          {
            label: 'Volume traité',
            value: acts.length ? formatFCFA(totalVolume) : '—',
            change: null, trend: 'up', icon: TrendingUp, color: 'blue'
          },
          {
            label: 'Actes réalisés',
            value: acts.length ? String(acts.length) : '0',
            change: null, trend: 'up', icon: FileText, color: 'purple'
          },
          {
            label: 'Satisfaction moyenne',
            value: avgSatisf != null ? `${avgSatisf}%` : '—',
            change: null, trend: 'up', icon: Star, color: 'orange'
          }
        ]);

        // ---- Évolution mensuelle (6 derniers mois, honoraires réels) ----
        const months = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          months.push({
            key: `${d.getFullYear()}-${d.getMonth()}`,
            month: MONTH_LABELS[d.getMonth()],
            revenue: 0
          });
        }
        acts.forEach((a) => {
          const d = new Date(a.signed_at || a.created_at);
          if (isNaN(d)) return;
          const k = `${d.getFullYear()}-${d.getMonth()}`;
          const bucket = months.find((m) => m.key === k);
          if (bucket) bucket.revenue += Number(a.notary_fees) || 0;
        });
        setMonthlyData(months);

        // ---- Revenus par type d'acte ----
        const byType = {};
        acts.forEach((a) => {
          const t = a.act_type || 'Autres';
          byType[t] = (byType[t] || 0) + (Number(a.notary_fees) || 0);
        });
        const typeEntries = Object.entries(byType).sort((x, y) => y[1] - x[1]);
        const typeTotal = typeEntries.reduce((s, [, v]) => s + v, 0) || 1;
        setRevenueByType(typeEntries.map(([type, amount], i) => ({
          type,
          amount,
          percentage: (amount / typeTotal) * 100,
          color: TYPE_COLORS[i % TYPE_COLORS.length]
        })));

        // ---- Top clients (par honoraires) ----
        const byClient = {};
        acts.forEach((a) => {
          const key = a.client_id || a.client_name || 'Client';
          const name = a.client_name || 'Client';
          if (!byClient[key]) byClient[key] = { name, revenue: 0, transactions: 0 };
          byClient[key].revenue += Number(a.notary_fees) || 0;
          byClient[key].transactions += 1;
        });
        setTopClients(Object.values(byClient).sort((x, y) => y.revenue - x.revenue).slice(0, 5));

        // ---- Transactions récentes (financial_transactions réelles + actes) ----
        const txRows = txs.map((t) => ({
          id: t.reference || t.id,
          client: t.client_name || '—',
          type: t.transaction_type || t.type || t.category || 'Transaction',
          amount: Number(t.amount) || 0,
          date: t.created_at,
          status: t.status
        }));
        const actRows = acts.map((a) => ({
          id: a.reference || a.id,
          client: a.client_name || '—',
          type: a.act_type || 'Acte',
          amount: Number(a.notary_fees) || 0,
          date: a.signed_at || a.created_at,
          status: a.status
        }));
        setRecentTransactions(
          [...txRows, ...actRows]
            .sort((x, y) => new Date(y.date) - new Date(x.date))
            .slice(0, 6)
        );
      } catch (err) {
        console.error('Erreur chargement dashboard financier notaire:', err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  const maxRevenue = Math.max(1, ...monthlyData.map((m) => m.revenue));

  const isCompleted = (s) => ['completed', 'signed', 'success', 'paid'].includes((s || '').toLowerCase());
  const statusLabel = (s) => {
    const v = (s || '').toLowerCase();
    if (['completed', 'signed', 'success', 'paid'].includes(v)) return 'Complété';
    if (['pending', 'in_progress', 'draft'].includes(v)) return 'En attente';
    if (['cancelled', 'failed', 'rejected'].includes(v)) return 'Annulé';
    return s || '—';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <TrendingUp className="text-indigo-600" size={32} />
          Dashboard Financier
        </h1>
        <p className="text-slate-600 mt-1">Analyse de vos honoraires et actes notariés</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-slate-500">
          <Loader2 className="animate-spin mr-2" size={22} /> Chargement des données financières...
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {kpis.map((kpi, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                <div className="flex items-start justify-between mb-2">
                  <div className={`bg-${kpi.color}-100 p-3 rounded-lg`}>
                    <kpi.icon className={`text-${kpi.color}-600`} size={24} />
                  </div>
                  {kpi.change && (
                    <span className={`flex items-center gap-1 text-sm font-semibold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                      {kpi.change}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Graphique évolution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6">Évolution des Honoraires (6 mois)</h2>
              {monthlyData.some((m) => m.revenue > 0) ? (
                <>
                  <div className="h-64 flex items-end gap-2">
                    {monthlyData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col gap-2">
                        <div className="bg-indigo-600 rounded-t transition-all hover:bg-indigo-700" style={{ height: `${(data.revenue / maxRevenue) * 220}px` }} title={`Honoraires: ${formatFCFA(data.revenue)}`}></div>
                        <p className="text-xs text-center text-slate-600 font-medium">{data.month}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-600 rounded"></div><span className="text-sm text-slate-600">Honoraires perçus</span></div>
                  </div>
                </>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">Aucun honoraire enregistré sur la période</div>
              )}
            </motion.div>

            {/* Répartition */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Honoraires par Type d'Acte</h2>
              {revenueByType.length ? (
                <div className="space-y-4">
                  {revenueByType.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-700">{item.type}</span>
                        <span className="text-sm font-semibold text-slate-800">{item.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className={`bg-${item.color}-600 h-2 rounded-full transition-all`} style={{ width: `${item.percentage}%` }}></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{formatFCFA(item.amount)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 text-sm">Aucun acte enregistré</div>
              )}
            </motion.div>

            {/* Top Clients */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Users size={24} className="text-indigo-600" />Top 5 Clients</h2>
              {topClients.length ? (
                <div className="space-y-3">
                  {topClients.map((client, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-slate-800">{client.name}</p>
                        <p className="text-xs text-slate-500">{client.transactions} acte{client.transactions > 1 ? 's' : ''}</p>
                      </div>
                      <p className="font-bold text-indigo-600">{(client.revenue / 1000).toFixed(0)}K</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400 text-sm">Aucun client enregistré</div>
              )}
            </motion.div>

            {/* Transactions récentes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Transactions Récentes</h2>
              {recentTransactions.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Référence</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Client</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Montant</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {recentTransactions.map((trx, i) => (
                        <tr key={`${trx.id}-${i}`} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{trx.id}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{trx.client}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{trx.type}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-slate-800">{formatFCFA(trx.amount)}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{trx.date ? new Date(trx.date).toLocaleDateString('fr-FR') : '—'}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${isCompleted(trx.status) ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{statusLabel(trx.status)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">Aucune transaction récente</div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotaireFinancialDashboardPage;
