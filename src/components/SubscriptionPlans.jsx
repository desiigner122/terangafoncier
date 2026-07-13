import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';

/**
 * Composant Plans d'Abonnement — données 100% réelles.
 *
 * - Les plans sont chargés depuis la table `subscription_plans` (aucune donnée codée en dur).
 * - « Choisir ce plan » enregistre une vraie souscription dans `user_subscriptions`
 *   avec le statut `pending` (en attente de validation / paiement).
 *   Le paiement en ligne n'est pas encore branché (voir Edge Function à venir).
 */

const CURRENCY_LABELS = { XOF: 'FCFA', EUR: '€', USD: '$' };

function formatPrice(price, currency) {
  const value = Number(price || 0).toLocaleString('fr-FR');
  return `${value} ${CURRENCY_LABELS[currency] || currency || ''}`.trim();
}

function periodLabel(durationMonths) {
  if (durationMonths === 12) return 'an';
  if (durationMonths === 1) return 'mois';
  return `${durationMonths} mois`;
}

function buildFeatures(plan) {
  const features = [];
  if (plan.max_properties != null) {
    features.push(`${plan.max_properties} annonces`);
  }
  if (plan.max_images_per_property != null) {
    features.push(`${plan.max_images_per_property} photos par annonce`);
  }
  features.push(plan.priority_support ? 'Support prioritaire' : 'Support par email');
  if (plan.featured_listings) features.push('Annonces mises en avant');
  if (plan.analytics_access) features.push('Accès aux statistiques');
  if (plan.api_access) features.push('Accès API');
  if (plan.custom_branding) features.push('Personnalisation de marque');
  return features;
}

export function SubscriptionPlans({ user, onPlanSelected }) {
  const { user: authUser } = useAuth();
  const userId = user?.id || authUser?.id || null;

  const [plans, setPlans] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState(null);

  const loadPlans = useCallback(async () => {
    setLoadingPlans(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('status', 'active')
        .order('price', { ascending: true });
      if (err) throw err;
      setPlans(data || []);
    } catch (e) {
      console.error('Erreur chargement des plans:', e);
      setError("Impossible de charger les plans d'abonnement.");
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  const loadCurrentSubscription = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error: err } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans (*)')
        .eq('user_id', userId)
        .in('status', ['active', 'pending'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (err && err.code !== 'PGRST116') throw err;
      setCurrentSub(data || null);
    } catch (e) {
      console.error('Erreur chargement abonnement:', e);
    }
  }, [userId]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    loadCurrentSubscription();
  }, [loadCurrentSubscription]);

  const handleSelectPlan = async (plan) => {
    if (!userId) {
      toast.error('Vous devez être connecté pour souscrire.');
      return;
    }
    if (currentSub?.plan_id === plan.id) {
      toast.info('Vous avez déjà ce plan.');
      return;
    }

    setProcessingId(plan.id);
    try {
      // Clôturer les souscriptions en cours de l'utilisateur (active/pending)
      const { error: cancelErr } = await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .in('status', ['active', 'pending']);
      if (cancelErr) throw cancelErr;

      const start = new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + (plan.duration_months || 12));

      const { data, error: insertErr } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: plan.id,
          status: 'pending',
          start_date: start.toISOString().slice(0, 10),
          end_date: end.toISOString().slice(0, 10),
          auto_renew: false,
          amount_paid: 0,
        })
        .select('*, subscription_plans (*)')
        .single();
      if (insertErr) throw insertErr;

      setCurrentSub(data);
      toast.success(`Demande d'abonnement « ${plan.name} » enregistrée. En attente de validation.`);
      if (onPlanSelected) onPlanSelected(data);
    } catch (e) {
      console.error('Erreur souscription:', e);
      toast.error("Erreur lors de l'enregistrement de l'abonnement.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="py-12 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Nos Plans d'Abonnement</h2>
          <p className="text-lg text-gray-600">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </div>

        {/* États de chargement / erreur / vide */}
        {loadingPlans && (
          <div className="flex justify-center items-center py-16 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Chargement des plans…
          </div>
        )}

        {!loadingPlans && error && (
          <div className="max-w-md mx-auto bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">{error}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={loadPlans}>
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {!loadingPlans && !error && plans.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            Aucun plan d'abonnement disponible pour le moment.
          </div>
        )}

        {/* Grille des plans */}
        {!loadingPlans && !error && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => {
              const isCurrent = currentSub?.plan_id === plan.id;
              const isPopular = index === 1; // 2e plan le moins cher, mise en avant
              const features = buildFeatures(plan);
              const processing = processingId === plan.id;

              return (
                <Card
                  key={plan.id}
                  className={`relative transition-all transform hover:scale-105 ${
                    isCurrent ? 'ring-2 ring-purple-500 shadow-2xl' : ''
                  } ${isPopular ? 'lg:scale-105' : ''}`}
                >
                  {isPopular && !isCurrent && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500">
                      ⭐ Populaire
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600">
                      ✓ Votre plan
                    </Badge>
                  )}

                  <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 rounded-t-lg">
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-700 min-h-[40px]">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(plan.price, plan.currency)}
                      </span>
                      <span className="text-sm text-gray-600">
                        / {periodLabel(plan.duration_months)}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <ul className="space-y-3 mb-8">
                      {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={processing || isCurrent}
                      className={`w-full ${
                        isCurrent
                          ? 'bg-green-600 hover:bg-green-600'
                          : 'bg-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Traitement…
                        </>
                      ) : isCurrent ? (
                        currentSub?.status === 'pending' ? 'En attente de validation' : 'Plan actuel'
                      ) : (
                        'Choisir ce plan'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Questions fréquentes</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-2">Puis-je changer de plan à tout moment ?</h4>
              <p className="text-gray-600 text-sm">
                Oui. Choisir un nouveau plan enregistre une nouvelle demande et clôture la
                précédente.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-2">Comment se passe le paiement ?</h4>
              <p className="text-gray-600 text-sm">
                Votre demande est d'abord enregistrée en attente. Le règlement et l'activation
                sont finalisés avec notre équipe. Le paiement en ligne arrive prochainement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPlans;
