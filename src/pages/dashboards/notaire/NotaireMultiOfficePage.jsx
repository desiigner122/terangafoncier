import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Users, FileText, TrendingUp, MapPin, Edit, Trash2 } from 'lucide-react';

const NotaireMultiOfficePage = () => {
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const offices = [
    {
      id: 1,
      name: 'Bureau Principal - Dakar Plateau',
      address: 'Avenue Léopold Sédar Senghor, Dakar',
      manager: 'Me. Amadou BA',
      staff: 12,
      active: true,
      stats: {
        transactions: 45,
        revenue: 8500000,
        clients: 234,
        growth: '+18%'
      }
    },
    {
      id: 2,
      name: 'Succursale Almadies',
      address: 'Route des Almadies, Dakar',
      manager: 'Me. Fatou SENE',
      staff: 8,
      active: true,
      stats: {
        transactions: 32,
        revenue: 6200000,
        clients: 156,
        growth: '+12%'
      }
    },
    {
      id: 3,
      name: 'Agence Thiès',
      address: 'Avenue Lamine Guèye, Thiès',
      manager: 'Me. Moussa DIALLO',
      staff: 6,
      active: true,
      stats: {
        transactions: 18,
        revenue: 3800000,
        clients: 89,
        growth: '+8%'
      }
    }
  ];

  const globalStats = {
    totalOffices: offices.length,
    totalStaff: offices.reduce((sum, office) => sum + office.staff, 0),
    totalTransactions: offices.reduce((sum, office) => sum + office.stats.transactions, 0),
    totalRevenue: offices.reduce((sum, office) => sum + office.stats.revenue, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Building2 className="text-cyan-600" size={32} />
              Gestion Multi-Bureaux
            </h1>
            <p className="text-slate-600 mt-1">Pilotez tous vos bureaux depuis un seul tableau de bord</p>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
            <Plus size={20} />
            Nouveau Bureau
          </motion.button>
        </div>
      </motion.div>

      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Bureaux Actifs', value: globalStats.totalOffices, icon: Building2, color: 'cyan' },
          { label: 'Personnel Total', value: globalStats.totalStaff, icon: Users, color: 'blue' },
          { label: 'Transactions', value: globalStats.totalTransactions, icon: FileText, color: 'purple' },
          { label: 'Revenus Total', value: `${(globalStats.totalRevenue / 1000000).toFixed(1)}M`, suffix: 'FCFA', icon: TrendingUp, color: 'green' }
        ].map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                {stat.suffix && <p className="text-xs text-slate-500 mt-1">{stat.suffix}</p>}
              </div>
              <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Liste des bureaux */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {offices.map((office, index) => (
          <motion.div key={office.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => setSelectedOffice(office)} className={`bg-white rounded-xl shadow-md border-2 cursor-pointer transition-all hover:shadow-xl ${selectedOffice?.id === office.id ? 'border-cyan-600 ring-4 ring-cyan-100' : 'border-slate-200 hover:border-cyan-300'}`}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-100 p-3 rounded-lg">
                    <Building2 className="text-cyan-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{office.name}</h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin size={14} />
                      {office.address}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Actif</span>
              </div>

              <div className="mb-4 pb-4 border-b border-slate-200">
                <p className="text-sm text-slate-600">Responsable</p>
                <p className="font-semibold text-slate-800">{office.manager}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-slate-600">Personnel</p>
                  <p className="text-lg font-bold text-slate-800">{office.staff}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Clients</p>
                  <p className="text-lg font-bold text-slate-800">{office.stats.clients}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Transactions</p>
                  <p className="text-lg font-bold text-slate-800">{office.stats.transactions}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600">Croissance</p>
                  <p className="text-lg font-bold text-green-600">{office.stats.growth}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-slate-600 mb-1">Revenus ce mois</p>
                <p className="text-xl font-bold text-cyan-600">{office.stats.revenue.toLocaleString()} FCFA</p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <Edit size={16} />
                  Modifier
                </button>
                <button className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Détails du bureau sélectionné */}
      {selectedOffice && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Détails - {selectedOffice.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Équipe</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-slate-600" />
                    <span className="text-sm text-slate-700">Notaires</span>
                  </div>
                  <span className="font-semibold text-slate-800">{Math.floor(selectedOffice.staff / 3)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-slate-600" />
                    <span className="text-sm text-slate-700">Assistants</span>
                  </div>
                  <span className="font-semibold text-slate-800">{selectedOffice.staff - Math.floor(selectedOffice.staff / 3)}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-3">Performance</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Taux de conversion</span>
                  <span className="font-semibold text-green-600">68%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">Satisfaction client</span>
                  <span className="font-semibold text-green-600">4.7/5</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal Création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Créer un Nouveau Bureau</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom du bureau</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Ex: Succursale Rufisque" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Adresse complète" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Responsable</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option>Sélectionner...</option>
                    <option>Me. Omar NDIAYE</option>
                    <option>Me. Bineta SOW</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Personnel</label>
                  <input type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="Nombre" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">Annuler</button>
                <button className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">Créer le Bureau</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NotaireMultiOfficePage;
