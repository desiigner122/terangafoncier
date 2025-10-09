import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Search, MapPin, FileText, Download, User, Calendar } from 'lucide-react';

const NotaireAPICadastrePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('parcelle');
  const [selectedParcel, setSelectedParcel] = useState(null);

  const parcels = [
    {
      id: 'PAR-2025-001',
      reference: 'D-123-45',
      address: 'Avenue Cheikh Anta Diop, Dakar',
      surface: 450,
      owner: 'Amadou BA',
      commune: 'Dakar Plateau',
      section: 'D',
      type: 'Résidentiel',
      lastTransaction: '2023-05-15',
      value: 85000000
    },
    {
      id: 'PAR-2025-002',
      reference: 'A-456-78',
      address: 'Route des Almadies, Dakar',
      surface: 850,
      owner: 'Fatou SENE',
      commune: 'Almadies',
      section: 'A',
      type: 'Commercial',
      lastTransaction: '2024-02-20',
      value: 150000000
    }
  ];

  const recentSearches = [
    { query: 'D-123-45', type: 'Parcelle', date: '2025-10-09' },
    { query: 'Avenue Pompidou', type: 'Adresse', date: '2025-10-08' },
    { query: 'Amadou BA', type: 'Propriétaire', date: '2025-10-07' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Map className="text-green-600" size={32} />
          API Cadastre
        </h1>
        <p className="text-slate-600 mt-1">Recherchez des informations cadastrales officielles</p>
      </motion.div>

      {/* Recherche */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
        <div className="flex gap-4 mb-4">
          {['parcelle', 'adresse', 'proprietaire'].map((type) => (
            <button key={type} onClick={() => setSearchType(type)} className={`px-4 py-2 rounded-lg font-medium transition-all ${searchType === type ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input type="text" placeholder={`Rechercher par ${searchType}...`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Résultats */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Résultats de recherche</h2>
          {parcels.map((parcel, index) => (
            <motion.div key={parcel.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} onClick={() => setSelectedParcel(parcel)} className={`bg-white rounded-xl p-4 shadow-md border-2 cursor-pointer transition-all ${selectedParcel?.id === parcel.id ? 'border-green-600' : 'border-slate-200 hover:border-green-300'}`}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={18} className="text-green-600" />
                <span className="font-semibold text-slate-800">{parcel.reference}</span>
              </div>
              <p className="text-sm text-slate-600 mb-1">{parcel.address}</p>
              <p className="text-xs text-slate-500">{parcel.surface} m² - {parcel.type}</p>
            </motion.div>
          ))}
        </div>

        {/* Détails */}
        <div className="lg:col-span-2">
          {selectedParcel ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Parcelle {selectedParcel.reference}</h2>
                <p className="text-green-100">{selectedParcel.address}</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Propriétaire</p>
                    <p className="font-semibold text-slate-800 flex items-center gap-2"><User size={18} className="text-green-600" />{selectedParcel.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Surface</p>
                    <p className="font-semibold text-slate-800">{selectedParcel.surface} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Commune</p>
                    <p className="font-semibold text-slate-800">{selectedParcel.commune}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Section</p>
                    <p className="font-semibold text-slate-800">Section {selectedParcel.section}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Type</p>
                    <p className="font-semibold text-slate-800">{selectedParcel.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Dernière Transaction</p>
                    <p className="font-semibold text-slate-800 flex items-center gap-2"><Calendar size={18} className="text-green-600" />{new Date(selectedParcel.lastTransaction).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600 mb-1">Valeur Estimée</p>
                    <p className="text-2xl font-bold text-green-600">{selectedParcel.value.toLocaleString()} FCFA</p>
                  </div>
                </div>
                <div className="h-64 bg-slate-200 rounded-lg flex items-center justify-center mb-4">
                  <Map size={48} className="text-slate-400" />
                  <p className="ml-4 text-slate-500">Carte interactive</p>
                </div>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <Download size={20} />
                  Télécharger le rapport complet
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

      {/* Recherches récentes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Recherches Récentes</h2>
        <div className="space-y-2">
          {recentSearches.map((search, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
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
    </div>
  );
};

export default NotaireAPICadastrePage;
