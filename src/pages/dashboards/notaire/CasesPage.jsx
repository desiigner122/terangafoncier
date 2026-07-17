import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, Loader2, Search } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import supabase from '@/lib/supabaseClient';

/**
 * Dossiers Notariaux (page routée) — reconnectée à la table réelle `notarial_acts`,
 * filtrée par notaire_id = user.id. Aucune donnée fabriquée : liste réelle ou état vide honnête.
 */

const ACT_TYPE_LABELS = {
  vente_immobiliere: 'Vente immobilière',
  vente_terrain: 'Vente terrain',
  succession: 'Succession',
  donation: 'Donation',
  hypotheque: 'Hypothèque',
  bail: 'Bail',
  partage: 'Partage',
  constitution_societe: 'Constitution société',
  autre: 'Autre'
};

const STATUS_LABELS = {
  draft: 'Brouillon',
  in_progress: 'En cours',
  signed: 'Signé',
  completed: 'Terminé',
  cancelled: 'Annulé'
};

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  signed: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

const formatAmount = (value) => {
  const num = parseFloat(value);
  if (!num || Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('fr-FR').format(num) + ' FCFA';
};

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('fr-FR');
  } catch {
    return '—';
  }
};

const CasesPage = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    let active = true;
    const loadCases = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('notarial_acts')
          .select('id, act_type, reference, client_name, status, notary_fees, amount, signed_at, created_at')
          .eq('notaire_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (active) setCases(data || []);
      } catch (err) {
        console.error('Erreur chargement dossiers notariaux:', err);
        if (active) setCases([]);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadCases();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const filteredCases = cases.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    if (!matchesStatus) return false;
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      c.reference?.toLowerCase().includes(search) ||
      c.client_name?.toLowerCase().includes(search) ||
      (ACT_TYPE_LABELS[c.act_type] || c.act_type || '').toLowerCase().includes(search)
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Dossiers Notariaux</h1>
        <p className="text-gray-600 mb-6">
          {isLoading ? 'Chargement…' : `${filteredCases.length} dossier${filteredCases.length > 1 ? 's' : ''}`}
        </p>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par référence, client ou type d'acte…"
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les statuts</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Contenu */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 text-purple-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Chargement des dossiers…</p>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-12">
              <Folder className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <p className="text-gray-600">
                {cases.length === 0
                  ? "Aucun dossier notarial pour le moment."
                  : "Aucun dossier ne correspond à votre recherche."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-3 px-3 font-medium">Référence</th>
                    <th className="py-3 px-3 font-medium">Type d'acte</th>
                    <th className="py-3 px-3 font-medium">Client</th>
                    <th className="py-3 px-3 font-medium">Statut</th>
                    <th className="py-3 px-3 font-medium">Montant</th>
                    <th className="py-3 px-3 font-medium">Émoluments</th>
                    <th className="py-3 px-3 font-medium">Créé le</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 hover:bg-purple-50/50">
                      <td className="py-3 px-3 font-medium text-gray-900">{c.reference || '—'}</td>
                      <td className="py-3 px-3 text-gray-700">{ACT_TYPE_LABELS[c.act_type] || c.act_type || '—'}</td>
                      <td className="py-3 px-3 text-gray-700">{c.client_name || '—'}</td>
                      <td className="py-3 px-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[c.status] || 'bg-gray-100 text-gray-700'}`}>
                          {STATUS_LABELS[c.status] || c.status || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-700">{formatAmount(c.amount)}</td>
                      <td className="py-3 px-3 text-gray-700">{formatAmount(c.notary_fees)}</td>
                      <td className="py-3 px-3 text-gray-500">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CasesPage;
