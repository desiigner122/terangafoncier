import React, { useState, useEffect } from 'react';
import { Crown, CreditCard, Download, Check, X, Zap, Shield, Star, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/config/supabase';

/**
 * NotaireSubscription - Gestion des abonnements pour notaires
 * Affiche le plan actuel, l'historique et permet de changer de plan
 */
export default function NotaireSubscription() {
  const { user } = useAuth();
  
  // États
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  /**
   * Plans disponibles
   */
  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: 0,
      period: 'mois',
      description: 'Pour découvrir la plateforme',
      features: [
        { text: '10 actes par mois', included: true },
        { text: 'Authentification blockchain', included: true },
        { text: '2 Go de stockage', included: true },
        { text: 'Support email', included: true },
        { text: 'Analytiques avancées', included: false },
        { text: 'API access', included: false },
        { text: 'Support prioritaire', included: false },
        { text: 'Clients illimités', included: false }
      ],
      color: 'gray',
      popular: false
    },
    {
      id: 'pro',
      name: 'Professionnel',
      price: 25000,
      period: 'mois',
      description: 'Pour les notaires actifs',
      features: [
        { text: '100 actes par mois', included: true },
        { text: 'Authentification blockchain', included: true },
        { text: '50 Go de stockage', included: true },
        { text: 'Support email & chat', included: true },
        { text: 'Analytiques avancées', included: true },
        { text: 'API access basique', included: true },
        { text: 'Support prioritaire', included: false },
        { text: 'Clients illimités', included: true }
      ],
      color: 'blue',
      popular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 50000,
      period: 'mois',
      description: 'Pour les études notariales',
      features: [
        { text: 'Actes illimités', included: true },
        { text: 'Authentification blockchain', included: true },
        { text: 'Stockage illimité', included: true },
        { text: 'Support 24/7', included: true },
        { text: 'Analytiques avancées', included: true },
        { text: 'API access complet', included: true },
        { text: 'Support prioritaire', included: true },
        { text: 'Clients illimités', included: true }
      ],
      color: 'purple',
      popular: false
    }
  ];

  /**
   * Charger l'abonnement et les factures
   */
  useEffect(() => {
    if (user?.id) {
      loadSubscriptionData();
    }
  }, [user]);

  const loadSubscriptionData = async () => {
    setIsLoading(true);
    try {
      // Charger l'abonnement
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!subError && subData) {
        setSubscription(subData);
      } else {
        // Créer un abonnement gratuit par défaut
        setSubscription({
          plan: 'free',
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: null
        });
      }

      // Charger les factures
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!invoicesError) {
        setInvoices(invoicesData || []);
      }
    } catch (error) {
      console.error('Erreur chargement abonnement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Changer de plan
   */
  const handleChangePlan = async (planId) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan: planId,
          status: 'active',
          start_date: new Date().toISOString(),
          end_date: null
        });

      if (error) throw error;

      setSubscription(prev => ({ ...prev, plan: planId }));
      setShowUpgradeDialog(false);
      
      window.safeGlobalToast?.({
        title: "Plan modifié",
        description: `Vous êtes maintenant sur le plan ${plans.find(p => p.id === planId)?.name}`,
        variant: "success"
      });
    } catch (error) {
      console.error('Erreur changement plan:', error);
      window.safeGlobalToast?.({
        title: "Erreur",
        description: "Impossible de changer de plan",
        variant: "destructive"
      });
    }
  };

  /**
   * Annuler l'abonnement
   */
  const handleCancelSubscription = async () => {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id);

      if (error) throw error;

      setSubscription(prev => ({ ...prev, status: 'cancelled' }));
      
      window.safeGlobalToast?.({
        title: "Abonnement annulé",
        description: "Votre abonnement sera résilié à la fin de la période en cours",
        variant: "success"
      });
    } catch (error) {
      console.error('Erreur annulation:', error);
    }
  };

  /**
   * Formater le prix
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  /**
   * Obtenir le plan actuel
   */
  const currentPlan = plans.find(p => p.id === subscription?.plan) || plans[0];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-600" />
          Abonnement & Facturation
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gérez votre abonnement et consultez vos factures
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Plan actuel */}
          <Card className="border-2 border-blue-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className={`h-5 w-5 text-${currentPlan.color}-600`} />
                    Plan actuel : {currentPlan.name}
                  </CardTitle>
                  <CardDescription>{currentPlan.description}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(currentPlan.price)}
                  </p>
                  <p className="text-sm text-gray-600">par {currentPlan.period}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600">Statut</p>
                    <Badge className={subscription?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {subscription?.status === 'active' ? 'Actif' : 'Annulé'}
                    </Badge>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600">Date de début</p>
                    <p className="font-semibold">
                      {subscription?.start_date ? new Date(subscription.start_date).toLocaleDateString('fr-FR') : '-'}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600">Prochain paiement</p>
                    <p className="font-semibold">
                      {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600">Factures</p>
                    <p className="font-semibold">{invoices.length}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {currentPlan.id !== 'premium' && (
                    <Button onClick={() => setShowUpgradeDialog(true)} className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Améliorer le plan
                    </Button>
                  )}
                  {currentPlan.id !== 'free' && subscription?.status === 'active' && (
                    <Button variant="outline" onClick={handleCancelSubscription}>
                      Annuler l'abonnement
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historique des factures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Historique des factures
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Aucune facture pour le moment</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{invoice.invoice_number}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(invoice.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">{formatPrice(invoice.amount)}</p>
                          <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                            {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tous les plans disponibles */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Tous nos plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card key={plan.id} className={`relative ${plan.popular ? 'border-2 border-blue-500' : ''} ${subscription?.plan === plan.id ? 'ring-2 ring-green-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg text-sm font-semibold">
                      Populaire
                    </div>
                  )}
                  {subscription?.plan === plan.id && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white px-3 py-1 rounded-br-lg text-sm font-semibold">
                      Plan actuel
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className={`h-5 w-5 text-${plan.color}-600`} />
                      {plan.name}
                    </CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-gray-400'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {subscription?.plan !== plan.id && (
                      <Button
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowUpgradeDialog(true);
                        }}
                        className="w-full"
                        variant={plan.popular ? 'default' : 'outline'}
                      >
                        {plan.price === 0 ? 'Rester gratuit' : 'Choisir ce plan'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Dialog Confirmation changement */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer de plan</DialogTitle>
            <DialogDescription>
              {selectedPlan && `Passer au plan ${selectedPlan.name}`}
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Nouveau montant</p>
                <p className="text-3xl font-bold">{formatPrice(selectedPlan.price)}</p>
                <p className="text-sm text-gray-600">par {selectedPlan.period}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Inclus dans ce plan :</p>
                <ul className="space-y-2">
                  {selectedPlan.features.filter(f => f.included).map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
              Annuler
            </Button>
            <Button onClick={() => selectedPlan && handleChangePlan(selectedPlan.id)}>
              Confirmer le changement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
