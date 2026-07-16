import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Clock, XCircle, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import supabase from '@/lib/supabaseClient';

/**
 * Page Vérification Conformité (routée)
 * Source RÉELLE : table compliance_checks
 * (colonnes : id, notaire_id, act_id, check_type, compliance_score,
 *  status 'pending'|'passed'|'failed', details jsonb, created_at)
 * Filtrage par notaire_id = user.id. Aucun chiffre fabriqué :
 * les statistiques sont dérivées des lignes réelles, sinon état vide honnête.
 */

const STATUS_META = {
  passed: { label: 'Conforme', className: 'bg-green-100 text-green-700', Icon: CheckCircle },
  pending: { label: 'En attente', className: 'bg-amber-100 text-amber-700', Icon: Clock },
  failed: { label: 'Non conforme', className: 'bg-red-100 text-red-700', Icon: XCircle }
};

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
};

const ComplianceCheckPage = () => {
  const { user } = useAuth();
  const [checks, setChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.id) loadCompliance();
    else setIsLoading(false);
  }, [user?.id]);

  const loadCompliance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: qError } = await supabase
        .from('compliance_checks')
        .select(`
          id,
          check_type,
          status,
          compliance_score,
          details,
          created_at,
          act:notarial_acts(reference, client_name, act_type)
        `)
        .eq('notaire_id', user.id)
        .order('created_at', { ascending: false });

      if (qError) throw qError;
      setChecks(data || []);
    } catch (err) {
      console.error('Erreur chargement conformité:', err);
      setError(err.message || 'Impossible de charger les vérifications de conformité.');
      setChecks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Statistiques dérivées des données réelles uniquement
  const total = checks.length;
  const passedCount = checks.filter((c) => c.status === 'passed').length;
  const pendingCount = checks.filter((c) => c.status === 'pending').length;
  const failedCount = checks.filter((c) => c.status === 'failed').length;
  const scored = checks.filter((c) => typeof c.compliance_score === 'number');
  const avgScore = scored.length
    ? Math.round(scored.reduce((sum, c) => sum + c.compliance_score, 0) / scored.length)
    : null;

  const filteredChecks = checks.filter((c) => {
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const term = searchTerm.trim().toLowerCase();
    const matchSearch =
      !term ||
      c.check_type?.toLowerCase().includes(term) ||
      c.act?.reference?.toLowerCase().includes(term) ||
      c.act?.client_name?.toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: 'Total vérifications', value: total, className: 'text-gray-900' },
    { label: 'Conformes', value: passedCount, className: 'text-green-600' },
    { label: 'En attente', value: pendingCount, className: 'text-amber-600' },
    { label: 'Non conformes', value: failedCount, className: 'text-red-600' },
    { label: 'Score moyen', value: avgScore === null ? '—' : `${avgScore}%`, className: 'text-purple-600' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-8 w-8 text-purple-600" />
              Vérification Conformité
            </h1>
            <p className="text-gray-600 mt-1">Contrôles de conformité de vos actes notariés</p>
          </div>
          <button
            onClick={loadCompliance}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-4 shadow">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.className}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl p-4 shadow mb-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher (type, référence, client)..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">Tous les statuts</option>
            <option value="passed">Conforme</option>
            <option value="pending">En attente</option>
            <option value="failed">Non conforme</option>
          </select>
        </div>

        {/* Contenu */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="text-center py-16 text-gray-500">
              <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin text-purple-600" />
              Chargement des vérifications...
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
              <p className="text-gray-700 font-medium">Erreur de chargement</p>
              <p className="text-gray-500 text-sm mt-1">{error}</p>
            </div>
          ) : filteredChecks.length === 0 ? (
            <div className="text-center py-16">
              <Shield className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <p className="text-gray-700 font-medium">
                {total === 0 ? 'Aucune vérification de conformité' : 'Aucun résultat pour ces filtres'}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {total === 0
                  ? 'Les contrôles de conformité de vos actes apparaîtront ici.'
                  : 'Ajustez la recherche ou le filtre de statut.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Type de contrôle</th>
                    <th className="px-4 py-3 font-medium">Acte lié</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Statut</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredChecks.map((c) => {
                    const meta = STATUS_META[c.status] || {
                      label: c.status || '—',
                      className: 'bg-gray-100 text-gray-600',
                      Icon: Clock
                    };
                    const { Icon } = meta;
                    return (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{c.check_type || '—'}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {c.act?.reference || c.act?.client_name ? (
                            <span>
                              {c.act?.reference || '—'}
                              {c.act?.client_name ? ` · ${c.act.client_name}` : ''}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {typeof c.compliance_score === 'number' ? `${c.compliance_score}%` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${meta.className}`}>
                            <Icon className="h-3.5 w-3.5" />
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{formatDate(c.created_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ComplianceCheckPage;
