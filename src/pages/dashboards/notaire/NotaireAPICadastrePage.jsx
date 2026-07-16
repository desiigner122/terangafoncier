import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Search, MapPin, FileText, Download, User, Calendar, Info, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import supabase from '@/lib/supabaseClient';

const SEARCH_TYPES = [
  { key: 'parcelle', label: 'Parcelle' },
  { key: 'adresse', label: 'Adresse' },
  { key: 'proprietaire', label: 'Propriétaire' }
];

const NotaireAPICadastrePage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('parcelle');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [parcels, setParcels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    loadProperties();
  }, [user]);

  const loadProperties = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, owner_id, title, name, type, price, surface, location, region, city, status, verification_status, estimated_value, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const rows = data || [];

      // Résoudre le nom des propriétaires depuis profiles
      const ownerIds = [...new Set(rows.map((r) => r.owner_id).filter(Boolean))];
      let ownersMap = {};
      if (ownerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', ownerIds);
        ownersMap = Object.fromEntries((profiles || []).map((p) => [p.id, p.full_name]));
      }

      const mapped = rows.map((p) => ({
        id: p.id,
        reference: p.name || p.title || '—',
        title: p.title || p.name || '—',
        address: p.location || [p.city, p.region].filter(Boolean).join(', ') || '—',
        surface: p.surface,
        owner: ownersMap[p.owner_id] || null,
        commune: p.city || '—',
        region: p.region || '—',
        type: p.type || '—',
        status: p.status,
        verification_status: p.verification_status,
        createdAt: p.created_at,
        value: p.estimated_value || p.price || null
      }));

      setParcels(mapped);
    } catch (err) {
      console.error('Erreur chargement propriétés:', err);
      setParcels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const registerSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const label = SEARCH_TYPES.find((t) => t.key === searchType)?.label || searchType;
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => !(s.query === trimmed && s.type === label));
      return [{ query: trimmed, type: label, date: new Date().toISOString() }, ...filtered].slice(0, 5);
    });
  };

  const q = searchQuery.trim().toLowerCase();
  const filteredParcels = parcels.filter((p) => {
    if (!q) return true;
    if (searchType === 'proprietaire') return (p.owner || '').toLowerCase().includes(q);
    if (searchType === 'adresse') return `${p.address} ${p.commune} ${p.region}`.toLowerCase().includes(q);
    return `${p.reference} ${p.title}`.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Map className="text-green-600" size={32} />
          API Cadastre
        </h1>
        <p className="text-slate-600 mt-1">Recherchez des informations foncières sur la plateforme</p>
      </motion.div>

      {/* Info : intégration cadastre externe non branchée */}
      <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <Info size={20} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-800">
          La connexion directe au cadastre national officiel sera bientôt disponible. En attendant, la
          recherche porte sur les biens fonciers enregistrés sur la plateforme Teranga Foncier.
        </p>
      </div>

      {/* Recherche */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
        <div className="flex gap-4 mb-4">
          {SEARCH_TYPES.map((type) => (
            <button key={type.key} onClick={() => setSearchType(type.key)} className={`px-4 py-2 rounded-lg font-medium transition-all ${searchType === type.key ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {type.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={`Rechercher par ${SEARCH_TYPES.find((t) => t.key === searchType)?.label.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') registerSearch(searchQuery); }}
            className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Résultats */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Résultats de recherche</h2>
          {isLoading ? (
            <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 flex items-center justify-center">
              <Loader2 className="animate-spin text-green-600" size={28} />
            </div>
          ) : filteredParcels.length === 0 ? (
            <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 text-center">
              <MapPin size={32} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">{parcels.length === 0 ? 'Aucun bien foncier enregistré' : 'Aucun résultat pour cette recherche'}</p>
            </div>
          ) : (
            filteredParcels.map((parcel, index) => (
              <motion.div key={parcel.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedParcel(parcel)} className={`bg-white rounded-xl p-4 shadow-md border-2 cursor-pointer transition-all ${selectedParcel?.id === parcel.id ? 'border-green-600' : 'border-slate-200 hover:border-green-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} className="text-green-600" />
                  <span className="font-semibold text-slate-800">{parcel.reference}</span>
                </div>
                <p className="text-sm text-slate-600 mb-1">{parcel.address}</p>
                <p className="text-xs text-slate-500">{parcel.surface ? `${parcel.surface} m² - ` : ''}{parcel.type}</p>
              </motion.div>
            ))
          )}
        </div>

        {/* Détails */}
        <div className="lg:col-span-2">
          {selectedParcel ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedParcel.reference}</h2>
                <p className="text-green-100">{selectedParcel.address}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Propriétaire</p>
                    <p className="font-semibold text-slate-800 flex items-center gap-2"><User size={18} className="text-green-600" />{selectedParcel.owner || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Surface</p>
                    <p className="font-semibold text-slate-800">{selectedParcel.surface ? `${selectedParcel.surface} m²` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Commune</p>
                    <p className="font-semibold text-slate-800">{selectedParcel.commune}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Région</p>
                    <p className="font-semibold text-slate-800">{selectedParcel.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Type</p>
                    <p className="font-semibold text-slate-800">{selectedParcel.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Date d'enregistrement</p>
                    <p className="font-semibold text-slate-800 flex items-center gap-2"><Calendar size={18} className="text-green-600" />{selectedParcel.createdAt ? new Date(selectedParcel.createdAt).toLocaleDateString('fr-FR') : '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600 mb-1">Valeur estimée</p>
                    <p className="text-2xl font-bold text-green-600">{selectedParcel.value != null ? `${Number(selectedParcel.value).toLocaleString('fr-FR')} FCFA` : '—'}</p>
                  </div>
                </div>
                <div className="h-64 bg-slate-100 rounded-lg flex flex-col items-center justify-center mb-4 border border-dashed border-slate-300">
                  <Map size={48} className="text-slate-400" />
                  <p className="mt-2 text-slate-500 text-sm">Carte interactive - bientôt disponible</p>
                </div>
                <button disabled className="w-full bg-slate-200 text-slate-500 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                  <Download size={20} />
                  Rapport cadastral officiel - bientôt disponible
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
              <Map size={64} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">Sélectionnez une parcelle</h3>
              <p className="text-slate-500">Les détails s'afficheront ici</p>
            </div>
          )}
        </div>
      </div>

      {/* Recherches récentes (session courante) */}
      {recentSearches.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Recherches Récentes</h2>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <div key={index} onClick={() => setSearchQuery(search.query)} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Search size={18} className="text-slate-400" />
                  <div>
                    <p className="font-medium text-slate-800">{search.query}</p>
                    <p className="text-xs text-slate-500">{search.type}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">{new Date(search.date).toLocaleDateString('fr-FR')}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NotaireAPICadastrePage;
