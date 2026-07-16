import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  Eye,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  FileText
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// --- Statuts réels de la table demandes_financement ---
const STATUS_META = {
  pending: { label: 'En attente', cls: 'bg-amber-100 text-amber-700', icon: Clock },
  evaluating: { label: 'En évaluation', cls: 'bg-blue-100 text-blue-700', icon: Clock },
  approved: { label: 'Approuvée', cls: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  rejected: { label: 'Rejetée', cls: 'bg-red-100 text-red-700', icon: XCircle }
};

const statusMeta = (status) =>
  STATUS_META[status] || { label: status || 'Inconnu', cls: 'bg-gray-100 text-gray-600', icon: Clock };

const formatXOF = (value) => {
  const n = Number(value) || 0;
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(n);
};

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
};

const FundingRequestsPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Demandes de financement entrantes (table réelle demandes_financement).
      // Colonnes réelles : id, user_id, property_id, client_name, property_title,
      // amount, status, rejection_reason, notaire, documents_count, importance,
      // approved_at, created_at. La banque consulte l'ensemble des demandes reçues
      // (aucune colonne bank_id dans ce schéma) ; RLS = lisible par tout authentifié.
      const { data: rows, error: fetchError } = await supabase
        .from('demandes_financement')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Erreur chargement demandes_financement:', fetchError);
        setError("Impossible de charger les demandes de financement.");
        setData([]);
      } else {
        setData(rows || []);
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors du chargement.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const patch = { status };
      if (status === 'approved') patch.approved_at = new Date().toISOString();
      const { error: updError } = await supabase
        .from('demandes_financement')
        .update(patch)
        .eq('id', id);
      if (updError) {
        console.error('Erreur mise à jour statut:', updError);
        return;
      }
      setData((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return data.filter((r) => {
      if (statusFilter !== 'all' && (r.status || 'pending') !== statusFilter) return false;
      if (!term) return true;
      return (
        (r.client_name || '').toLowerCase().includes(term) ||
        (r.property_title || '').toLowerCase().includes(term)
      );
    });
  }, [data, search, statusFilter]);

  const stats = useMemo(() => {
    const total = data.length;
    const pending = data.filter((r) => (r.status || 'pending') === 'pending').length;
    const approved = data.filter((r) => r.status === 'approved').length;
    const totalAmount = data.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    return { total, pending, approved, totalAmount };
  }, [data]);

  const statCards = [
    { label: 'Demandes reçues', value: stats.total, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'En attente', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Approuvées', value: stats.approved, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Montant total', value: formatXOF(stats.totalAmount), icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Demandes de Financement</h1>
            <p className="text-gray-600">Gestion des demandes de crédit immobilier reçues</p>
          </div>
          <button
            onClick={loadRequests}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? '—' : card.value}
                  </p>
                </div>
                <div className={`${card.bg} p-3 rounded-lg`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filtres + Contenu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par client ou bien..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="evaluating">En évaluation</option>
              <option value="approved">Approuvées</option>
              <option value="rejected">Rejetées</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-10 w-10 text-indigo-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-500">Chargement des demandes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <p className="text-gray-700 font-medium mb-1">{error}</p>
              <button onClick={loadRequests} className="text-indigo-600 hover:underline mt-2">
                Réessayer
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Building className="h-16 w-16 text-indigo-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {data.length === 0 ? 'Aucune demande de financement' : 'Aucun résultat'}
              </h3>
              <p className="text-gray-500">
                {data.length === 0
                  ? "Les nouvelles demandes de crédit reçues apparaîtront ici."
                  : 'Aucune demande ne correspond à votre recherche.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-3 px-3 font-medium">Client</th>
                    <th className="py-3 px-3 font-medium">Bien</th>
                    <th className="py-3 px-3 font-medium">Montant</th>
                    <th className="py-3 px-3 font-medium">Documents</th>
                    <th className="py-3 px-3 font-medium">Date</th>
                    <th className="py-3 px-3 font-medium">Statut</th>
                    <th className="py-3 px-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((req) => {
                    const meta = statusMeta(req.status || 'pending');
                    const StatusIcon = meta.icon;
                    const isPending = (req.status || 'pending') === 'pending' || req.status === 'evaluating';
                    return (
                      <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <Users className="h-4 w-4 text-indigo-600" />
                            </div>
                            <span className="font-medium text-gray-900">
                              {req.client_name || 'Client'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 text-gray-600">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {req.property_title || '—'}
                          </div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-gray-900">
                          {formatXOF(req.amount)}
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          {req.documents_count != null ? `${req.documents_count} doc.` : '—'}
                        </td>
                        <td className="py-3 px-3 text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {formatDate(req.created_at)}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${meta.cls}`}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {meta.label}
                          </span>
                          {req.status === 'rejected' && req.rejection_reason && (
                            <p className="text-xs text-gray-400 mt-1">{req.rejection_reason}</p>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-end gap-2">
                            {isPending && (
                              <>
                                <button
                                  onClick={() => updateStatus(req.id, 'approved')}
                                  disabled={updatingId === req.id}
                                  title="Approuver"
                                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
                                >
                                  {updatingId === req.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => updateStatus(req.id, 'rejected')}
                                  disabled={updatingId === req.id}
                                  title="Rejeter"
                                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button
                              title="Détails"
                              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FundingRequestsPage;
