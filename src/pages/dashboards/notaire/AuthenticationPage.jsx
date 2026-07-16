import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, FileText, CheckCircle, Clock, XCircle, RefreshCw, Copy } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import supabase from '@/lib/supabaseClient';

const STATUS_META = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  verified: { label: 'Vérifié', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejeté', color: 'bg-red-100 text-red-800' }
};

const AuthenticationPage = () => {
  const { user } = useAuth();
  const [authentications, setAuthentications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadAuthentications();
    }
  }, [user]);

  const loadAuthentications = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('document_authentication')
        .select('id, document_name, document_type, verification_status, authenticity_hash, verified_at, created_at')
        .eq('notaire_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAuthentications(data || []);
    } catch (error) {
      console.error('Erreur chargement authentifications:', error);
      setAuthentications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Erreur copie:', error);
    }
  };

  const verifiedCount = authentications.filter(a => a.verification_status === 'verified').length;
  const pendingCount = authentications.filter(a => a.verification_status === 'pending').length;
  const rejectedCount = authentications.filter(a => a.verification_status === 'rejected').length;

  const stats = [
    { label: 'Total', value: authentications.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Vérifiés', value: verifiedCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'En attente', value: pendingCount, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Rejetés', value: rejectedCount, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Authentification</h1>
            <p className="text-gray-600">Vérification et authentification de vos documents notariaux</p>
          </div>
          <button
            onClick={loadAuthentications}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
        </div>

        {/* Statistiques réelles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Liste des authentifications */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Historique des authentifications</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : authentications.length === 0 ? (
            <div className="text-center py-12">
              <Key className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Aucune authentification de document pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-600">
                    <th className="py-3 pr-4 font-medium">Document</th>
                    <th className="py-3 pr-4 font-medium">Type</th>
                    <th className="py-3 pr-4 font-medium">Statut</th>
                    <th className="py-3 pr-4 font-medium">Hash d'authenticité</th>
                    <th className="py-3 pr-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {authentications.map((auth) => {
                    const meta = STATUS_META[auth.verification_status] || STATUS_META.pending;
                    return (
                      <tr key={auth.id} className="border-b border-gray-100 text-sm">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{auth.document_name || 'Document'}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{auth.document_type || '—'}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${meta.color}`}>
                            {meta.label}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          {auth.authenticity_hash ? (
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {auth.authenticity_hash.substring(0, 10)}...
                              </code>
                              <button
                                onClick={() => copyToClipboard(auth.authenticity_hash)}
                                className="text-gray-400 hover:text-gray-700"
                                title="Copier le hash"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-gray-600">
                          {formatDate(auth.verified_at || auth.created_at)}
                        </td>
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

export default AuthenticationPage;
