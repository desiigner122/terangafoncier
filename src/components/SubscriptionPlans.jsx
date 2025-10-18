import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Shield, TrendingUp } from 'lucide-react';

const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Gratuit',
    price: 0,
    period: 'mois',
    description: 'Parfait pour commencer',
    features: [
      '5 annonces',
      '100 demandes/mois',
      '5 GB de stockage',
      'Support par email',
      'Analytique basique'
    ],
    limits: {
      properties: 5,
      requests: 100,
      storage_gb: 5
    },
    color: 'from-gray-100 to-gray-200',
    icon: 'box'
  },
  basic: {
    name: 'Basic',
    price: 4990, // CFA (50k CFA ≈ 7,60€)
    period: 'mois',
    description: 'Pour vendeurs actifs',
    features: [
      '50 annonces',
      '1000 demandes/mois',
      '50 GB de stockage',
      'Support prioritaire',
      'Analytique avancée',
      'Photos IA',
      'Promotion jusqu\'à 3 propriétés'
    ],
    limits: {
      properties: 50,
      requests: 1000,
      storage_gb: 50
    },
    popular: false,
    color: 'from-blue-100 to-blue-200',
    icon: 'zap'
  },
  pro: {
    name: 'Professionnel',
    price: 9990, // 100k CFA
    period: 'mois',
    description: 'Pour agences immobilières',
    features: [
      'Annonces illimitées',
      'Demandes illimitées',
      'Stockage illimité',
      'Support 24/7',
      'Analytique complète',
      'API personnalisée',
      'Promotion illimitée',
      'Vérification IA complète',
      'Blockchain certifications',
      'Gestion multi-utilisateurs'
    ],
    limits: {
      properties: 'unlimited',
      requests: 'unlimited',
      storage_gb: 'unlimited'
    },
    popular: true,
    color: 'from-purple-100 to-purple-200',
    icon: 'shield'
  },
  enterprise: {
    name: 'Enterprise',
    price: null, // Sur devis
    period: 'custom',
    description: 'Solution sur mesure',
    features: [
      'Tout illimité',
      'Support dédié',
      'Intégrations custom',
      'Formation équipe',
      'API illimitée',
      'SLA garanti 99.9%',
      'Données en cloud privé optionnel',
      'Consulting inclus'
    ],
    limits: {
      properties: 'unlimited',
      requests: 'unlimited',
      storage_gb: 'unlimited'
    },
    color: 'from-amber-100 to-amber-200',
    icon: 'trending'
  }
};

export function SubscriptionPlans({ user, currentPlan = 'free', onPlanSelected }) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);

  const handlePlanSelect = async (planName) => {
    if (planName === 'free') {
      // Pas de paiement pour Free
      await updateSubscription(planName);
      return;
    }

    if (planName === 'enterprise') {
      // Rediriger vers contact
      window.location.href = '/contact?plan=enterprise';
      return;
    }

    setLoading(true);
    setSelectedPlan(planName);

    try {
      // Créer une session Stripe Checkout
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: getPriceIdForPlan(planName),
          userId: user.id,
          planName
        })
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Erreur création session paiement:', error);
      alert('Erreur lors de l\'initialisation du paiement');
      setLoading(false);
    }
  };

  const updateSubscription = async (planName) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_name: planName,
          plan_price: SUBSCRIPTION_PLANS[planName].price,
          status: 'active',
          started_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      setSelectedPlan(planName);
      if (onPlanSelected) onPlanSelected(planName);
    } catch (error) {
      console.error('Erreur mise à jour abonnement:', error);
    }
  };

  return (
    <div className="py-12 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Nos Plans d\'Abonnement</h2>
          <p className="text-lg text-gray-600">Choisissez le plan qui correspond à vos besoins</p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <Card
              key={key}
              className={`relative transition-all transform hover:scale-105 ${
                selectedPlan === key ? 'ring-2 ring-purple-500 shadow-2xl' : ''
              } ${plan.popular ? 'lg:scale-105 md:col-span-1' : ''}`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                  ⭐ Populaire
                </Badge>
              )}

              <CardHeader className={`bg-gradient-to-r ${plan.color} p-6 rounded-t-lg`}>
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-gray-700">{plan.description}</CardDescription>

                {/* Price */}
                <div className="mt-4">
                  {plan.price !== null ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {(plan.price / 100).toLocaleString('fr-FR')}
                      </span>
                      <span className="text-sm text-gray-600">CFA / {plan.period}</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-900">Sur devis</div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limits */}
                <div className="bg-slate-50 p-3 rounded mb-6 text-xs space-y-1">
                  <p className="font-semibold text-gray-900">Limites:</p>
                  <p className="text-gray-600">
                    {typeof plan.limits.properties === 'number'
                      ? `${plan.limits.properties} propriétés`
                      : 'Propriétés illimitées'}
                  </p>
                  <p className="text-gray-600">
                    {typeof plan.limits.storage_gb === 'number'
                      ? `${plan.limits.storage_gb} GB`
                      : 'Stockage illimité'}
                  </p>
                </div>

                {/* Button */}
                <Button
                  onClick={() => handlePlanSelect(key)}
                  disabled={loading && selectedPlan === key}
                  className={`w-full ${
                    selectedPlan === key
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {loading && selectedPlan === key ? '⏳ Traitement...' : 'Choisir ce plan'}
                </Button>

                {selectedPlan === key && (
                  <p className="text-xs text-green-600 mt-2 text-center">✓ Plan sélectionné</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Questions fréquentes</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-2">❓ Puis-je changer de plan à tout moment?</h4>
              <p className="text-gray-600 text-sm">Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment. Les modifications prennent effet immédiatement.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-2">💳 Quels sont les moyens de paiement?</h4>
              <p className="text-gray-600 text-sm">Nous acceptons Stripe (carte bancaire), Wave, et les virements bancaires. Pour l\'Enterprise, contactez notre équipe.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-2">🔄 Y a-t-il une période d\'essai gratuit?</h4>
              <p className="text-gray-600 text-sm">Oui! Le plan Free est gratuit à jamais. Vous pouvez aussi demander un essai de 7 jours des plans payants.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper pour obtenir l'ID Stripe du plan
 */
function getPriceIdForPlan(planName) {
  const priceIds = {
    basic: 'price_1A0000000000000000000001', // À remplacer par vrai ID Stripe
    pro: 'price_1A0000000000000000000002',
  };
  return priceIds[planName] || null;
}

export default SubscriptionPlans;
