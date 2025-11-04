import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Check, 
  X, 
  Zap, 
  TrendingUp, 
  Users, 
  HardDrive, 
  FileText,
  Download,
  Calendar,
  Euro
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';

const NotaireSubscriptionsPage = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [plans, setPlans] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ DONNÉES RÉELLES - Chargement depuis Supabase
  useEffect(() => {
    if (user) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    setIsLoading(true);
    try {
      // Charger les plans disponibles
      const plansResult = await NotaireSupabaseService.getSubscriptionPlans();
      if (plansResult.success) {
        setPlans(plansResult.data || []);
      }

      // Charger l'abonnement actuel de l'utilisateur
      const subResult = await NotaireSupabaseService.getUserSubscription(user.id);
      if (subResult.success && subResult.data) {
        setUserSubscription(subResult.data);
        setCurrentPlan(subResult.data.plan_id || 'pro');
      }

      // Charger les factures
      const invoicesResult = await NotaireSupabaseService.getInvoices(user.id);
      if (invoicesResult.success) {
        setInvoices(invoicesResult.data || []);
      }
    } catch (error) {
      console.error('Erreur chargement abonnements:', error);
      setPlans([]);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Usage data from subscription
  const usage = userSubscription?.usage || {
    actes: { current: 0, max: 0, label: 'Actes ce mois' },
    storage: { current: 0, max: 0, label: 'Stockage (Go)' },
    users: { current: 0, max: 0, label: 'Utilisateurs actifs' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <CreditCard className="text-indigo-600" size={32} />
          Abonnements & Facturation
        </h1>
        <p className="text-slate-600 mt-1">
          Gérez votre abonnement et consultez vos factures
        </p>
      </motion.div>

      {/* Abonnement actuel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Abonnement Actuel</p>
            <h2 className="text-4xl font-bold">Plan Professionnel</h2>
            <p className="text-indigo-100 mt-2">Renouvellement le 1er novembre 2025</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold">79 000 FCFA</p>
            <p className="text-indigo-100 mt-1">par mois</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(usage).map(([key, data]) => (
            <div key={key} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-indigo-100 text-sm mb-2">{data.label}</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold">{data.current}</span>
                {data.max !== 'unlimited' && (
                  <span className="text-indigo-200 text-sm mb-1">/ {data.max}</span>
                )}
                {data.max === 'unlimited' && (
                  <span className="text-indigo-200 text-sm mb-1">/ illimité</span>
                )}
              </div>
              {data.max !== 'unlimited' && (
                <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all"
                    style={{ width: `${(data.current / data.max) * 100}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plans disponibles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Plans Disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
                plan.popular ? 'border-indigo-500 ring-4 ring-indigo-100' : 'border-slate-200'
              } ${currentPlan === plan.id ? 'ring-4 ring-green-100 border-green-500' : ''}`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                  ⭐ Plus Populaire
                </div>
              )}
              {currentPlan === plan.id && (
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-2 text-sm font-semibold">
                  ✓ Plan Actuel
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <p className="text-slate-600 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  {plan.price !== null ? (
                    <>
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold text-slate-800">
                          {plan.price.toLocaleString('fr-FR')}
                        </span>
                        <span className="text-slate-600 mb-1">FCFA</span>
                      </div>
                      <p className="text-slate-500 text-sm">par {plan.period}</p>
                    </>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-slate-800">Sur devis</span>
                      <p className="text-slate-500 text-sm mt-1">Contactez-nous</p>
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X size={18} className="text-slate-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-slate-700' : 'text-slate-400'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    currentPlan === plan.id
                      ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id ? 'Plan Actuel' : plan.price ? 'Choisir ce plan' : 'Nous Contacter'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Historique des factures */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText size={24} className="text-slate-600" />
            Historique des Factures
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">N° Facture</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Période</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{invoice.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(invoice.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{invoice.plan}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{invoice.period}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                    {invoice.amount.toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Payé
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium">
                      <Download size={16} />
                      Télécharger
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default NotaireSubscriptionsPage;
