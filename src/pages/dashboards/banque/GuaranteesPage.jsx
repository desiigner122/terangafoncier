import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Banknote,
  Clock,
  RefreshCw,
  Loader2,
  Inbox,
  Search,
  AlertTriangle
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const formatXOF = (value) => {
  const n = Number(value) || 0;
  return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
};

const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('fr-FR');
  } catch {
    return '—';
  }
};

const STATUS_META = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
  released: { label: 'Levée', className: 'bg-gray-100 text-gray-600' },
  expired: { label: 'Expirée', className: 'bg-red-100 text-red-700' },
  seized: { label: 'Saisie', className: 'bg-purple-100 text-purple-700' }
};

const statusBadge = (status) => {
  const meta = STATUS_META[status] || { label: status || '—', className: 'bg-gray-100 text-gray-600' };
  return <Badge className={`${meta.className} border-0`}>{meta.label}</Badge>;
};

const isExpiringSoon = (expiry) => {
  if (!expiry) return false;
  const now = new Date();
  const exp = new Date(expiry);
  const diffDays = (exp - now) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 90;
};

const GuaranteesPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guarantees, setGuarantees] = useState([]);
  const [search, setSearch] = useState('');

  const fetchGuarantees = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: qError } = await supabase
        .from('guarantees')
        .select('*')
        .eq('bank_id', user.id)
        .order('created_at', { ascending: false });

      if (qError) throw qError;
      setGuarantees(data || []);
    } catch (err) {
      console.error('Erreur chargement garanties:', err);
      setError("Impossible de charger les garanties.");
      setGuarantees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuarantees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const stats = useMemo(() => {
    const total = guarantees.length;
    const active = guarantees.filter((g) => g.status === 'active').length;
    const totalValue = guarantees.reduce((s, g) => s + (Number(g.value) || 0), 0);
    const expiringSoon = guarantees.filter((g) => isExpiringSoon(g.expiry_date)).length;
    return { total, active, totalValue, expiringSoon };
  }, [guarantees]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return guarantees;
    return guarantees.filter((g) =>
      [g.client_name, g.type, g.status]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [guarantees, search]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              Gestion des Garanties
            </h1>
            <p className="text-gray-600 mt-1">
              Suivi des garanties liées à votre portefeuille de crédits
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchGuarantees}
            disabled={loading}
            className="bg-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-indigo-100">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total garanties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <ShieldCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Actives</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Banknote className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Valeur totale</p>
                <p className="text-xl font-bold text-gray-900">{formatXOF(stats.totalValue)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Expirent sous 90j</p>
                <p className="text-2xl font-bold text-gray-900">{stats.expiringSoon}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-indigo-600" />
              Liste des garanties
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher (client, type, statut)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin mb-3" />
                <p>Chargement des garanties...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-red-500">
                <AlertTriangle className="h-10 w-10 mb-3" />
                <p>{error}</p>
                <Button variant="outline" onClick={fetchGuarantees} className="mt-4">
                  Réessayer
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Inbox className="h-12 w-12 mb-3 text-gray-300" />
                <p className="font-medium">
                  {guarantees.length === 0
                    ? 'Aucune garantie enregistrée'
                    : 'Aucune garantie ne correspond à votre recherche'}
                </p>
                {guarantees.length === 0 && (
                  <p className="text-sm text-gray-400 mt-1">
                    Les garanties liées à vos crédits apparaîtront ici.
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-3 px-3 font-medium">Client</th>
                      <th className="py-3 px-3 font-medium">Type</th>
                      <th className="py-3 px-3 font-medium">Valeur</th>
                      <th className="py-3 px-3 font-medium">Statut</th>
                      <th className="py-3 px-3 font-medium">Échéance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((g) => (
                      <tr key={g.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 px-3 font-medium text-gray-900">
                          {g.client_name || '—'}
                        </td>
                        <td className="py-3 px-3 text-gray-700">{g.type || '—'}</td>
                        <td className="py-3 px-3 text-gray-700">{formatXOF(g.value)}</td>
                        <td className="py-3 px-3">{statusBadge(g.status)}</td>
                        <td className="py-3 px-3">
                          <span className={isExpiringSoon(g.expiry_date) ? 'text-yellow-600 font-medium' : 'text-gray-700'}>
                            {formatDate(g.expiry_date)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default GuaranteesPage;
