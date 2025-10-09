import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, FileText, Users, ArrowUp, ArrowDown, Calendar } from 'lucide-react';

const NotaireFinancialDashboardPage = () => {
  const kpis = [
    { label: 'Revenus', value: '12,450,000', currency: 'FCFA', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'green' },
    { label: 'Dépenses', value: '3,280,000', currency: 'FCFA', change: '-8.3%', trend: 'down', icon: TrendingUp, color: 'red' },
    { label: 'Bénéfice Net', value: '9,170,000', currency: 'FCFA', change: '+18.2%', trend: 'up', icon: TrendingUp, color: 'blue' },
    { label: 'Transactions', value: '127', change: '+15', trend: 'up', icon: FileText, color: 'purple' }
  ];

  const monthlyData = [
    { month: 'Jan', revenue: 8500000, expenses: 2800000 },
    { month: 'Fév', revenue: 9200000, expenses: 2950000 },
    { month: 'Mar', revenue: 10100000, expenses: 3100000 },
    { month: 'Avr', revenue: 9800000, expenses: 3050000 },
    { month: 'Mai', revenue: 11200000, expenses: 3200000 },
    { month: 'Juin', revenue: 12450000, expenses: 3280000 }
  ];

  const revenueByType = [
    { type: 'Actes de vente', amount: 6800000, percentage: 54.6, color: 'blue' },
    { type: 'Successions', amount: 3200000, percentage: 25.7, color: 'green' },
    { type: 'Donations', amount: 1850000, percentage: 14.9, color: 'purple' },
    { type: 'Autres', amount: 600000, percentage: 4.8, color: 'orange' }
  ];

  const topClients = [
    { name: 'Amadou BA', revenue: 2850000, transactions: 12 },
    { name: 'Fatou SENE', revenue: 1950000, transactions: 8 },
    { name: 'Moussa DIALLO', revenue: 1450000, transactions: 6 },
    { name: 'Aïssatou FALL', revenue: 1200000, transactions: 5 },
    { name: 'Omar NDIAYE', revenue: 980000, transactions: 4 }
  ];

  const recentTransactions = [
    { id: 'TRX-2025-045', client: 'Amadou BA', type: 'Acte de vente', amount: 450000, date: '2025-10-08', status: 'completed' },
    { id: 'TRX-2025-044', client: 'Fatou SENE', type: 'Succession', amount: 280000, date: '2025-10-07', status: 'completed' },
    { id: 'TRX-2025-043', client: 'Moussa DIALLO', type: 'Donation', amount: 180000, date: '2025-10-06', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <TrendingUp className="text-indigo-600" size={32} />
          Dashboard Financier
        </h1>
        <p className="text-slate-600 mt-1">Analyse complète de vos finances</p>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
            <div className="flex items-start justify-between mb-2">
              <div className={`bg-${kpi.color}-100 p-3 rounded-lg`}>
                <kpi.icon className={`text-${kpi.color}-600`} size={24} />
              </div>
              <span className={`flex items-center gap-1 text-sm font-semibold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.trend === 'up' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {kpi.change}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
            {kpi.currency && <p className="text-xs text-slate-500 mt-1">{kpi.currency}</p>}
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique évolution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Évolution Mensuelle</h2>
          <div className="h-64 flex items-end gap-2">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <div className="bg-indigo-600 rounded-t transition-all hover:bg-indigo-700" style={{ height: `${(data.revenue / 15000000) * 200}px` }} title={`Revenus: ${data.revenue.toLocaleString()} FCFA`}></div>
                  <div className="bg-red-400 rounded-b transition-all hover:bg-red-500" style={{ height: `${(data.expenses / 15000000) * 200}px` }} title={`Dépenses: ${data.expenses.toLocaleString()} FCFA`}></div>
                </div>
                <p className="text-xs text-center text-slate-600 font-medium">{data.month}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-indigo-600 rounded"></div><span className="text-sm text-slate-600">Revenus</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-400 rounded"></div><span className="text-sm text-slate-600">Dépenses</span></div>
          </div>
        </motion.div>

        {/* Répartition */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Revenus par Type</h2>
          <div className="space-y-4">
            {revenueByType.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700">{item.type}</span>
                  <span className="text-sm font-semibold text-slate-800">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className={`bg-${item.color}-600 h-2 rounded-full transition-all`} style={{ width: `${item.percentage}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">{item.amount.toLocaleString()} FCFA</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Clients */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Users size={24} className="text-indigo-600" />Top 5 Clients</h2>
          <div className="space-y-3">
            {topClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-semibold text-slate-800">{client.name}</p>
                  <p className="text-xs text-slate-500">{client.transactions} transactions</p>
                </div>
                <p className="font-bold text-indigo-600">{(client.revenue / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transactions récentes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Transactions Récentes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Client</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Montant</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-600">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{trx.id}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{trx.client}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{trx.type}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-800">{trx.amount.toLocaleString()} FCFA</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{new Date(trx.date).toLocaleDateString('fr-FR')}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${trx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{trx.status === 'completed' ? 'Complété' : 'En attente'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotaireFinancialDashboardPage;
