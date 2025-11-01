import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import NotaryFeesCalculator from '@/services/NotaryFeesCalculator';
import PurchaseWorkflowService from '@/services/PurchaseWorkflowService';
import NotificationService from '@/services/NotificationService';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/UnifiedAuthContext';

/**
 * PaymentModal - Modal permettant à l'acheteur de choisir le mode de paiement
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal ouvert ou fermé
 * @param {Function} props.onClose - Callback fermeture modal
 * @param {Object} props.paymentRequest - Demande de paiement à traiter
 * @param {Function} props.onSuccess - Callback succès paiement
 */
const PaymentModal = ({ isOpen, onClose, paymentRequest, onSuccess }) => {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState('select'); // 'select' | 'confirm' | 'instructions'

  // Configuration des méthodes de paiement
  const paymentMethods = [
    {
      id: 'wave',
      name: 'Wave',
      icon: <Smartphone className="w-8 h-8" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      fees: '0%',
      feesAmount: 0,
      description: 'Paiement instantané via Wave',
      available: true,
      instructions: [
        'Ouvrez votre application Wave',
        'Scannez le QR code qui apparaîtra',
        'Confirmez le paiement',
        'Le paiement sera validé automatiquement'
      ]
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: <Wallet className="w-8 h-8" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-700',
      fees: '1%',
      feesAmount: 0.01,
      description: 'Paiement via Orange Money',
      available: true,
      instructions: [
        'Composez #144# sur votre téléphone',
        'Sélectionnez "Payer un marchand"',
        'Entrez le code marchand qui apparaîtra',
        'Confirmez avec votre code PIN'
      ]
    },
    {
      id: 'bank_transfer',
      name: 'Virement Bancaire',
      icon: <Building2 className="w-8 h-8" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-700',
      fees: '0%',
      feesAmount: 0,
      description: 'Virement direct depuis votre banque',
      available: true,
      instructions: [
        'Connectez-vous à votre espace bancaire',
        'Effectuez un virement vers le compte indiqué',
        'Utilisez la référence de paiement fournie',
        'Le paiement sera vérifié sous 24-48h'
      ]
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      fees: '2.5%',
      feesAmount: 0.025,
      description: 'Paiement sécurisé par carte',
      available: true,
      instructions: [
        'Entrez vos informations de carte bancaire',
        'Vérifiez le montant',
        'Validez avec le code de sécurité',
        'Confirmation instantanée'
      ]
    }
  ];

  // Calculer le montant total avec frais
  const calculateTotalAmount = (method) => {
    if (!paymentRequest || !method) return 0;
    const fees = paymentRequest.amount * method.feesAmount;
    return paymentRequest.amount + fees;
  };

  // Gérer sélection méthode
  const handleSelectMethod = (method) => {
    setSelectedMethod(method);
    setStep('confirm');
  };

  // Retour à la sélection
  const handleBack = () => {
    setStep('select');
    setSelectedMethod(null);
  };

  // Confirmation et traitement du paiement
  const handleConfirmPayment = async () => {
    if (!selectedMethod || !paymentRequest) return;

    try {
      setProcessing(true);
      setStep('instructions');

      // TODO Phase 4: Intégrer PaymentGatewayService pour vrais paiements
      // Pour Phase 3, on simule le paiement
      
      // Simuler délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Marquer la demande de paiement comme payée
      const markPaidResult = await NotaryFeesCalculator.markAsPaid(
        paymentRequest.id,
        {
          payment_method: selectedMethod.id,
          transaction_id: `SIM-${Date.now()}`, // Simulé pour Phase 3
          paid_at: new Date().toISOString()
        }
      );

      if (!markPaidResult.success) {
        throw new Error(markPaidResult.error || 'Erreur lors de la mise à jour du paiement');
      }

      // Envoyer notification au notaire
      await NotificationService.create({
        userId: paymentRequest.notary_id,
        type: 'payment_received',
        title: 'Paiement reçu',
        message: `${user?.full_name || user?.email} a effectué un paiement de ${NotaryFeesCalculator.formatCurrency(paymentRequest.amount)}`,
        relatedId: paymentRequest.case_id,
        relatedType: 'purchase_case'
      });

      // Callback succès
      toast.success('Paiement effectué avec succès !');
      onSuccess?.();
      
      // Fermer modal après succès
      setTimeout(() => {
        onClose();
        resetModal();
      }, 1500);

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Erreur lors du paiement');
      setStep('confirm'); // Retour à la confirmation
    } finally {
      setProcessing(false);
    }
  };

  // Réinitialiser le modal
  const resetModal = () => {
    setSelectedMethod(null);
    setStep('select');
    setProcessing(false);
  };

  // Gérer fermeture
  const handleClose = () => {
    if (!processing) {
      onClose();
      resetModal();
    }
  };

  if (!paymentRequest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" />
            Mode de paiement
          </DialogTitle>
          <DialogDescription>
            Choisissez votre méthode de paiement préférée
          </DialogDescription>
        </DialogHeader>

        {/* Résumé du paiement */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Montant à payer</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                {NotaryFeesCalculator.formatCurrency(paymentRequest.amount)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {paymentRequest.description}
              </p>
            </div>
            {paymentRequest.due_date && (
              <Badge variant="outline" className="text-xs">
                Échéance : {new Date(paymentRequest.due_date).toLocaleDateString('fr-FR')}
              </Badge>
            )}
          </div>
        </Card>

        {/* Étape 1: Sélection de la méthode */}
        {step === 'select' && (
          <div className="space-y-4 mt-4">
            <h3 className="font-semibold text-lg">Sélectionnez votre mode de paiement</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleSelectMethod(method)}
                  disabled={!method.available}
                  className={`
                    p-5 rounded-xl border-2 transition-all text-left
                    ${method.available 
                      ? `${method.borderColor} ${method.bgColor} hover:shadow-lg hover:scale-105 cursor-pointer` 
                      : 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`${method.color}`}>
                      {method.icon}
                    </div>
                    <Badge 
                      variant={method.fees === '0%' ? 'secondary' : 'outline'}
                      className="text-xs"
                    >
                      Frais : {method.fees}
                    </Badge>
                  </div>
                  
                  <h4 className="font-bold text-lg mb-1">{method.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {method.description}
                  </p>
                  
                  {method.feesAmount > 0 && (
                    <p className="text-xs text-gray-500">
                      Total avec frais : {NotaryFeesCalculator.formatCurrency(calculateTotalAmount(method))}
                    </p>
                  )}

                  {method.available && (
                    <div className="flex items-center gap-1 mt-3 text-emerald-600 text-sm font-semibold">
                      <span>Sélectionner</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Message d'information */}
            <div className="flex items-start gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-1">Paiement sécurisé</p>
                <p>
                  Tous les paiements sont sécurisés et cryptés. Votre argent ne sera transféré 
                  qu'après validation du notaire.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Étape 2: Confirmation */}
        {step === 'confirm' && selectedMethod && (
          <div className="space-y-4 mt-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="mb-2"
            >
              ← Changer de méthode
            </Button>

            <h3 className="font-semibold text-lg">Confirmer le paiement</h3>

            {/* Récapitulatif */}
            <Card className={`p-5 ${selectedMethod.bgColor} border-2 ${selectedMethod.borderColor}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={selectedMethod.color}>
                  {selectedMethod.icon}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{selectedMethod.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedMethod.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Montant</span>
                  <span className="font-semibold">
                    {NotaryFeesCalculator.formatCurrency(paymentRequest.amount)}
                  </span>
                </div>
                
                {selectedMethod.feesAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Frais de transaction ({selectedMethod.fees})
                    </span>
                    <span className="font-semibold">
                      {NotaryFeesCalculator.formatCurrency(paymentRequest.amount * selectedMethod.feesAmount)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total à payer</span>
                  <span className="text-emerald-600">
                    {NotaryFeesCalculator.formatCurrency(calculateTotalAmount(selectedMethod))}
                  </span>
                </div>
              </div>
            </Card>

            {/* Instructions */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="font-semibold mb-2 text-sm">Étapes à suivre :</p>
              <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {selectedMethod.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-600 flex-shrink-0">
                      {index + 1}.
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Bouton confirmation */}
            <Button
              onClick={handleConfirmPayment}
              disabled={processing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 text-lg"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Confirmer le paiement de {NotaryFeesCalculator.formatCurrency(calculateTotalAmount(selectedMethod))}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Étape 3: Instructions de paiement */}
        {step === 'instructions' && selectedMethod && (
          <div className="space-y-4 mt-4 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-pulse" />
              </div>
            </div>
            
            <h3 className="font-bold text-2xl text-emerald-600">Paiement en cours...</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Votre paiement est en cours de traitement. Veuillez patienter.
            </p>

            <div className="flex justify-center">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
