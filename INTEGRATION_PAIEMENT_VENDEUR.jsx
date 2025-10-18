// VendeurSettingsRealData.jsx - MISE À JOUR RECOMMANDÉE
// Import les composants de paiement

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { SupabaseErrorDisplay, useSupabaseError } from '@/components/SupabaseErrorHandler';
import PaymentGuideVendeur from '@/pages/PaymentGuideVendeur';

export function VendeurSettingsEnhanced() {
  const [user, setUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'subscription', 'guide'
  const { handleError } = useSupabaseError();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (authUser) {
        // Charger plan actuel
        const { data: subscription, error: subError } = await supabase
          .from('subscriptions')
          .select('plan_name')
          .eq('user_id', authUser.id)
          .single();

        if (!subError && subscription) {
          setCurrentPlan(subscription.plan_name);
        }
      }
    } catch (err) {
      const parsed = handleError(err, 'loadUserData');
      setError(parsed);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Error Display */}
        {error && (
          <div className="mb-6">
            <SupabaseErrorDisplay 
              error={error} 
              onDismiss={() => setError(null)} 
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'profile', label: '👤 Profil' },
            { id: 'subscription', label: '💳 Abonnement' },
            { id: 'guide', label: '📖 Guide Paiement' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Profil Vendeur</h2>
              {/* Contenu du profil existant */}
              <p className="text-gray-600">Composant de profil...</p>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="bg-white p-8 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-6">Gestion d'Abonnement</h2>
              
              {/* Plan Actuel */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-2">Plan Actuel</h3>
                <p className="text-2xl font-bold text-purple-600 capitalize">
                  {currentPlan === 'free' ? '🆓' : '💜'} {currentPlan}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {currentPlan === 'free' 
                    ? '5 propriétés, 100 demandes/mois, 5GB'
                    : currentPlan === 'basic'
                    ? '50 propriétés, 1k demandes/mois, 50GB - 4 990 CFA/mois'
                    : 'ILLIMITÉ - 9 990 CFA/mois'
                  }
                </p>
              </div>

              {/* Plans */}
              {user && (
                <SubscriptionPlans 
                  user={user}
                  currentPlan={currentPlan}
                  onPlanSelected={(newPlan) => {
                    setCurrentPlan(newPlan);
                    setError(null); // Clear errors on success
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'guide' && (
            <PaymentGuideVendeur />
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-bold text-blue-900 mb-2">💡 Besoin d'aide?</h4>
          <p className="text-blue-800 text-sm">
            Consultez le guide paiement dans l'onglet "📖 Guide Paiement" pour des explications complètes.
            Vous avez des questions? Contactez <strong>support@terangafoncier.sn</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VendeurSettingsEnhanced;

/*
================================================================================
INTÉGRATION DANS SIDEBAR ROUTAGE
================================================================================

// Dans CompleteSidebarVendeurDashboard.jsx ou routes.jsx
// Ajouter route:

{
  path: '/dashboard/vendeur/settings',
  name: 'Paramètres',
  element: <VendeurSettingsEnhanced />,
  icon: <Settings />
}

================================================================================
NEXT STEPS
================================================================================

1. REMPLACER contenu existant VendeurSettingsRealData.jsx
   - Ou créer nouveau fichier VendeurSettingsEnhanced.jsx
   - Importer SubscriptionPlans et SupabaseErrorHandler

2. AJOUTER ROUTE dans sidebar
   - /dashboard/vendeur/settings/subscription
   - /dashboard/vendeur/settings/guide

3. EXÉCUTER MIGRATION SQL
   - Copier FIX_MISSING_COLUMNS_COMPLETE.sql
   - Exécuter dans Supabase SQL Editor

4. CONFIGURER STRIPE
   - VITE_STRIPE_PUBLIC_KEY=pk_live_...
   - Webhook endpoint: /api/webhooks/stripe

5. TESTER
   - Aller sur /dashboard/vendeur/settings
   - Cliquer sur plan payant
   - Voir redirection Stripe

================================================================================
*/
