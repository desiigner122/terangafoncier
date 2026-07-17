import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  X,
  FileText,
  FileSignature,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';
import { supabase } from '@/lib/supabaseClient';

// Libellé de période dérivé de la durée réelle (duration_months)
const periodLabel = (months) => {
  if (!months || months === 1) return 'mois';
  if (months === 12) return 'an';
  return `${months} mois`;
};

// Construit la liste de fonctionnalités à partir des VRAIES colonnes du plan
const buildFeatures = (plan) => ([
  {
    included: true,
    text: plan.max_properties != null
      ? `${plan.max_properties} biens gérés`
      : 'Biens illimités'
  },
  { included: !!plan.priority_support, text: 'Support prioritaire' },
  { included: !!plan.featured_listings, text: 'Annonces mises en avant' },
  { included: !!plan.analytics_access, text: 'Accès aux statistiques' },
  { included: !!plan.api_access, text: 'Accès API' },
  { included: !!plan.custom_branding, text: 'Personnalisation (marque)' }
]);

const NotaireSubscriptionsPage = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [activity, setActivity] = useState({ actesMois: 0, actesSignes: 0, clients: 0 });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    setIsLoading(true);
    try {
      // Plans réels (subscription_plans)
      const plansResult = await NotaireSupabaseService.getSubscriptionPlans();
      if (plansResult.success) {
        setPlans(plansResult.data || []);
      }

      // Abonnement actif réel (user_subscriptions + plan joint)
      const subResult = await NotaireSupabaseService.getUserSubscription(user.id);
      if (subResult.success && subResult.data) {
        setUserSubscription(subResult.data);
        setCurrentPlanId(subResult.data.plan_id || null);
      }

      // Historique de paiement réel : toutes les souscriptions de l'utilisateur
      const { data: history } = await supabase
        .from('user_subscriptions')
        .select('id, status, start_date, end_date, last_payment, amount_paid, created_at, plan:subscription_plans(name, duration_months)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setPaymentHistory(history || []);

      // Activité notariale réelle (indicateurs d'usage)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const [actesMoisRes, actesSignesRes, clientsRes] = await Promise.all([
        supabase.from('notarial_acts').select('id', { count: 'exact', head: true })
          .eq('notaire_id', user.id).gte('created_at', startOfMonth.toISOString()),
        supabase.from('notarial_acts').select('id', { count: 'exact', head: true })
          .eq('notaire_id', user.id).in('status', ['signed', 'completed']),
        supabase.from('clients_notaire').select('id', { count: 'exact', head: true })
          .eq('notaire_id', user.id)
      ]);

      setActivity({
        actesMois: actesMoisRes.count || 0,
        actesSignes: actesSignesRes.count || 0,
        clients: clientsRes.count || 0
      });
    } catch (error) {
      console.error('Erreur chargement abonnements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activePlan = userSubscription?.plan || null;
  const activePrice = activePlan?.price != null
    ? Number(activePlan.price)
    : (userSubscription?.amount_paid != null ? Number(userSubscription.amount_paid) : null);

  const usageTiles = [
    { label: 'Actes ce mois', value: activity.actesMois, icon: FileText },
    { label: 'Actes signés', value: activity.actesSignes, icon: FileSignature },
    { label: 'Clients', value: activity.clients, icon: Users }
  ];

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
          Gérez votre abonnement et consultez votre activité
        </p>
      </motion.div>

      {/* Abonnement actuel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-xl"
      >
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="text-indigo-100 text-sm mb-1">Abonnement Actuel</p>
            {activePlan ? (
              <>
                <h2 className="text-4xl font-bold">Plan {activePlan.name}</h2>
                {userSubscription?.end_date && (
                  <p className="text-indigo-100 mt-2">
                    Renouvellement le {new Date(userSubscription.end_date).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold">Aucun abonnement actif</h2>
                <p className="text-indigo-100 mt-2">
                  Choisissez un plan ci-dessous pour démarrer
                </p>
              </>
            )}
          </div>
          {activePrice != null && (
            <div className="text-right">
              <p className="text-5xl font-bold">{activePrice.toLocaleString('fr-FR')} FCFA</p>
              <p className="text-indigo-100 mt-1">par {periodLabel(activePlan?.duration_months)}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {usageTiles.map((tile) => (
            <div key={tile.label} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-2 text-indigo-100 text-sm mb-2">
                <tile.icon size={16} />
                {tile.label}
              </div>
              <span className="text-2xl font-bold">{tile.value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Plans disponibles */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Plans Disponibles</h2>
        {plans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-10 text-center text-slate-500">
            {isLoading ? 'Chargement des plans...' : 'Aucun plan disponible pour le moment'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => {
              const isCurrent = currentPlanId === plan.id;
              const priceNum = plan.price != null ? Number(plan.price) : null;
              const features = buildFeatures(plan);
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
                    isCurrent ? 'ring-4 ring-green-100 border-green-500' : 'border-slate-200'
                  }`}
                >
                  {isCurrent && (
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-2 text-sm font-semibold">
                      ✓ Plan Actuel
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                    <p className="text-slate-600 text-sm mb-4">{plan.description}</p>

                    <div className="mb-6">
                      {priceNum != null ? (
                        <>
                          <div className="flex items-end gap-1">
                            <span className="text-4xl font-bold text-slate-800">
                              {priceNum.toLocaleString('fr-FR')}
                            </span>
                            <span className="text-slate-600 mb-1">FCFA</span>
                          </div>
                          <p className="text-slate-500 text-sm">par {periodLabel(plan.duration_months)}</p>
                        </>
                      ) : (
                        <div>
                          <span className="text-4xl font-bold text-slate-800">Sur devis</span>
                          <p className="text-slate-500 text-sm mt-1">Contactez-nous</p>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {features.map((feature, idx) => (
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
                        isCurrent
                          ? 'bg-slate-200 text-slate-600 cursor-not-allowed'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg'
                      }`}
                      disabled={isCurrent}
                    >
                      {isCurrent ? 'Plan Actuel' : priceNum != null ? 'Choisir ce plan' : 'Nous Contacter'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historique des paiements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText size={24} className="text-slate-600" />
            Historique des Paiements
          </h2>
        </div>

        {paymentHistory.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Aucun paiement enregistré
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Période</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paymentHistory.map((sub) => {
                  const payDate = sub.last_payment || sub.start_date || sub.created_at;
                  const isActive = sub.status === 'active';
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {payDate ? new Date(payDate).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{sub.plan?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {sub.start_date && sub.end_date
                          ? `${new Date(sub.start_date).toLocaleDateString('fr-FR')} → ${new Date(sub.end_date).toLocaleDateString('fr-FR')}`
                          : periodLabel(sub.plan?.duration_months)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                        {sub.amount_paid != null
                          ? `${Number(sub.amount_paid).toLocaleString('fr-FR')} FCFA`
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isActive ? 'Actif' : sub.status}
                        </span>
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
  );
};

export default NotaireSubscriptionsPage;
