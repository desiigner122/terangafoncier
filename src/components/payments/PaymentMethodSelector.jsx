/**
 * @file PaymentMethodSelector.jsx
 * @description Sélection Wave Money ou Orange Money + paiement
 * @created 2025-11-03
 * @week 2 - Day 4-5
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Smartphone, Loader2, CheckCircle2, AlertCircle, 
  DollarSign, Calendar, Wallet 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';
import axios from 'axios';

// Logos (à remplacer par vrais logos)
const WaveLogo = () => (
  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
    W
  </div>
);

const OrangeLogo = () => (
  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
    O
  </div>
);

const PaymentMethodSelector = ({ caseId, caseData, amount, paymentType = 'deposit', onPaymentCreated }) => {
  const [selectedMethod, setSelectedMethod] = useState('wave');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const paymentMethods = [
    {
      id: 'wave',
      name: 'Wave',
      logo: <WaveLogo />,
      description: 'Paiement mobile Wave Money',
      features: ['Instantané', 'Sécurisé', 'Sans frais'],
      available: true,
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      logo: <OrangeLogo />,
      description: 'Paiement mobile Orange Money',
      features: ['Instantané', 'Sécurisé', 'Accepté partout'],
      available: true,
    },
  ];

  /**
   * Créer lien paiement
   */
  const handleCreatePayment = async () => {
    try {
      setIsProcessing(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expirée');
        return;
      }

      const response = await axios.post(
        `${API_BASE}/payments/create`,
        {
          caseId,
          amount,
          paymentMethod: selectedMethod,
          paymentType,
        },
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (response.data.success) {
        setPaymentUrl(response.data.paymentUrl);
        setTransactionId(response.data.transaction.id);
        toast.success('Lien de paiement créé !');
        
        if (onPaymentCreated) {
          onPaymentCreated(response.data.transaction);
        }

        // Ouvrir URL paiement dans nouvelle fenêtre
        window.open(response.data.paymentUrl, '_blank');
        setShowPaymentDialog(true);
      }

    } catch (error) {
      console.error('❌ Error creating payment:', error);
      toast.error(error.response?.data?.error || 'Erreur création paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Vérifier statut paiement
   */
  const handleCheckStatus = async () => {
    try {
      if (!transactionId) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await axios.get(
        `${API_BASE}/payments/status/${transactionId}`,
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      const status = response.data.transaction.status;

      if (status === 'completed') {
        toast.success('🎉 Paiement confirmé !');
        setShowPaymentDialog(false);
        
        // Recharger page ou callback
        if (onPaymentCreated) {
          onPaymentCreated(response.data.transaction);
        }
      } else if (status === 'failed') {
        toast.error('Paiement échoué');
        setShowPaymentDialog(false);
      } else if (status === 'cancelled') {
        toast.error('Paiement annulé');
        setShowPaymentDialog(false);
      } else {
        toast.info('Paiement en attente...');
      }

    } catch (error) {
      console.error('❌ Error checking status:', error);
      toast.error('Erreur vérification statut');
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Choisir le moyen de paiement
          </CardTitle>
          <CardDescription>
            Payez de manière sécurisée avec Wave ou Orange Money
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Montant */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">
                {paymentType === 'deposit' ? 'Acompte à payer' : 'Montant total'}
              </span>
              <span className="text-2xl font-bold text-emerald-600">
                {amount.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          {/* Sélection méthode */}
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!method.available && 'opacity-50 cursor-not-allowed'}`}
                  onClick={() => method.available && setSelectedMethod(method.id)}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem 
                      value={method.id} 
                      id={method.id}
                      disabled={!method.available}
                      className="mt-1"
                    />
                    {method.logo}
                    <div className="flex-1">
                      <Label 
                        htmlFor={method.id}
                        className="cursor-pointer font-semibold text-gray-900 text-lg"
                      >
                        {method.name}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {method.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {!method.available && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary">Bientôt disponible</Badge>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </RadioGroup>

          {/* Info sécurité */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Paiement 100% sécurisé</strong>
              <br />
              Vos informations de paiement sont cryptées et ne sont jamais stockées sur nos serveurs.
            </AlertDescription>
          </Alert>

          {/* Bouton payer */}
          <Button
            onClick={handleCreatePayment}
            disabled={isProcessing || !selectedMethod}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération du lien...
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 mr-2" />
                Payer {amount.toLocaleString('fr-FR')} FCFA
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Dialog statut paiement */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paiement en cours</DialogTitle>
            <DialogDescription>
              Complétez le paiement sur votre téléphone puis vérifiez le statut
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 text-sm">
                <strong>Instructions:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Une nouvelle fenêtre s'est ouverte avec le paiement</li>
                  <li>Suivez les instructions sur votre téléphone</li>
                  <li>Revenez ici après le paiement</li>
                  <li>Cliquez sur "Vérifier le statut"</li>
                </ol>
              </AlertDescription>
            </Alert>

            <div className="flex gap-3">
              <Button
                onClick={handleCheckStatus}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Vérifier le statut
              </Button>

              {paymentUrl && (
                <Button
                  onClick={() => window.open(paymentUrl, '_blank')}
                  variant="outline"
                  className="flex-1"
                >
                  Rouvrir le paiement
                </Button>
              )}
            </div>

            <p className="text-center text-sm text-gray-600">
              Le paiement peut prendre jusqu'à 30 secondes pour être confirmé
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentMethodSelector;
