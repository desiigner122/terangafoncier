import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, FileText, Loader2, Search, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import supabase from '@/lib/supabaseClient';

/**
 * Archives Notariales (page routée) — reconnectée aux tables réelles :
 *  - `notarial_acts` (actes finalisés : status 'completed' ou 'signed'), filtré par notaire_id = user.id
 *  - `documents` du notaire (owner_id = user.id)
 * Aucune donnée fabriquée : listes réelles ou état vide honnête.
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
  signed: 'Signé',
  completed: 'Terminé'
};

const STATUS_STYLES = {
  signed: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700'
};

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('fr-FR');
  } catch {
    return '—';
  }
};

const ArchivesPage = () => {
  const { user } = useAuth();
  const [acts, setActs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('acts');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    let active = true;
    const loadArchives = async () => {
      setIsLoading(true);
      try {
        const [actsRes, docsRes] = await Promise.all([
          supabase
            .from('notarial_acts')
            .select('id, act_type, reference, client_name, status, signed_at, created_at')
            .eq('notaire_id', user.id)
            .in('status', ['completed', 'signed'])
            .order('signed_at', { ascending: false, nullsFirst: false }),
          supabase
            .from('documents')
            .select('id, name, type, url, status, created_at')
            .eq('owner_id', user.id)
            .order('created_at', { ascending: false })
        ]);

        if (actsRes.error) throw actsRes.error;
        if (docsRes.error) throw docsRes.error;
        if (active) {
          setActs(actsRes.data || []);
          setDocuments(docsRes.data || []);
        }
      } catch (err) {
        console.error('Erreur chargement archives notariales:', err);
        if (active) {
          setActs([]);
          setDocuments([]);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadArchives();
    return () => {
      active = false;
    };
  }, [user?.id]);

  const search = searchTerm.toLowerCase();

  const filteredActs = acts.filter((a) => {
    if (!searchTerm) return true;
    return (
      a.reference?.toLowerCase().includes(search) ||
      a.client_name?.toLowerCase().includes(search) ||
      (ACT_TYPE_LABELS[a.act_type] || a.act_type || '').toLowerCase().includes(search)
    );
  });

  const filteredDocs = documents.filter((d) => {
    if (!searchTerm) return true;
    return (
      d.name?.toLowerCase().includes(search) ||
      (d.type || '').toLowerCase().includes(search)
    );
  });

  const count = activeTab === 'acts' ? filteredActs.length : filteredDocs.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Archives Notariales</h1>
        <p className="text-gray-600 mb-6">
          {isLoading
            ? 'Chargement…'
            : `${count} ${activeTab === 'acts' ? 'acte' : 'document'}${count > 1 ? 's' : ''} archivé${count > 1 ? 's' : ''}`}
        </p>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          {/* Onglets */}
          <div className="flex gap-2 mb-6 border-b border-gray-100">
            <button
              onClick={() => setActiveTab('acts')}
              className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'acts'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Archive className="h-4 w-4" />
              Actes finalisés {!isLoading && `(${acts.length})`}
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-4 py-2 -mb-px border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'documents'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              Documents {!isLoading && `(${documents.length})`}
            </button>
          </div>

          {/* Recherche */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'acts'
                  ? "Rechercher par référence, client ou type d'acte…"
                  : 'Rechercher par nom ou type de document…'
              }
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Contenu */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 text-purple-600 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Chargement des archives…</p>
            </div>
          ) : activeTab === 'acts' ? (
            filteredActs.length === 0 ? (
              <div className="text-center py-12">
                <Archive className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  {acts.length === 0
                    ? 'Aucun acte finalisé archivé pour le moment.'
                    : 'Aucun acte ne correspond à votre recherche.'}
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
                      <th className="py-3 px-3 font-medium">Signé le</th>
                      <th className="py-3 px-3 font-medium">Créé le</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActs.map((a) => (
                      <tr key={a.id} className="border-b border-gray-50 hover:bg-purple-50/50">
                        <td className="py-3 px-3 font-medium text-gray-900">{a.reference || '—'}</td>
                        <td className="py-3 px-3 text-gray-700">{ACT_TYPE_LABELS[a.act_type] || a.act_type || '—'}</td>
                        <td className="py-3 px-3 text-gray-700">{a.client_name || '—'}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[a.status] || 'bg-gray-100 text-gray-700'}`}>
                            {STATUS_LABELS[a.status] || a.status || '—'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-500">{formatDate(a.signed_at)}</td>
                        <td className="py-3 px-3 text-gray-500">{formatDate(a.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-purple-300 mx-auto mb-4" />
              <p className="text-gray-600">
                {documents.length === 0
                  ? 'Aucun document archivé pour le moment.'
                  : 'Aucun document ne correspond à votre recherche.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="py-3 px-3 font-medium">Nom</th>
                    <th className="py-3 px-3 font-medium">Type</th>
                    <th className="py-3 px-3 font-medium">Statut</th>
                    <th className="py-3 px-3 font-medium">Ajouté le</th>
                    <th className="py-3 px-3 font-medium">Fichier</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((d) => (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-purple-50/50">
                      <td className="py-3 px-3 font-medium text-gray-900">{d.name || '—'}</td>
                      <td className="py-3 px-3 text-gray-700">{d.type || '—'}</td>
                      <td className="py-3 px-3 text-gray-700">{d.status || '—'}</td>
                      <td className="py-3 px-3 text-gray-500">{formatDate(d.created_at)}</td>
                      <td className="py-3 px-3">
                        {d.url ? (
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800"
                          >
                            Ouvrir <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
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

export default ArchivesPage;
