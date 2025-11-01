import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NotaryFeesCalculator from '@/services/NotaryFeesCalculator';
import PaymentGatewayService from '@/services/PaymentGatewayService';
import NotificationService from '@/services/NotificationService';
import { toast } from 'sonner';

/**
 * PaymentSuccess - Page de retour après paiement réussi
 * 
 * Gère les retours de :
 * - Wave Money
 * - Orange Money
 * - PayTech (cartes)
 */
const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Récupérer les données de paiement stockées
      const pendingPaymentStr = localStorage.getItem('pending_payment');
      if (!pendingPaymentStr) {
        throw new Error('Aucune information de paiement trouvée');
      }

      const pendingPayment = JSON.parse(pendingPaymentStr);
      setPaymentData(pendingPayment);

      // Récupérer les paramètres de retour (varient selon la passerelle)
      const waveSessionId = searchParams.get('wave_session_id');
      const orangeToken = searchParams.get('payment_token');
      const paytechToken = searchParams.get('token');
      const transactionId = searchParams.get('transaction_id') || pendingPayment.transaction_id;

      console.log('🔍 Vérification paiement:', {
        transactionId,
        waveSessionId,
        orangeToken,
        paytechToken
      });

      // Vérifier le statut de la transaction
      const statusResult = await PaymentGatewayService.checkPaymentStatus(transactionId);

      if (!statusResult.success) {
        throw new Error('Impossible de vérifier le statut du paiement');
      }

      // Si le paiement est confirmé
      if (statusResult.status === 'completed' || statusResult.status === 'success') {
        // Marquer la demande notaire comme payée
        await NotaryFeesCalculator.markAsPaid(
          pendingPayment.notary_request_id,
          {
            payment_method: statusResult.data.payment_method,
            transaction_id: transactionId,
            paid_at: new Date().toISOString()
          }
        );

        // Envoyer notification
        if (statusResult.data.metadata?.notary_id) {
          await NotificationService.create({
            userId: statusResult.data.metadata.notary_id,
            type: 'payment_received',
            title: 'Paiement confirmé',
            message: `Paiement de ${pendingPayment.amount} FCFA confirmé`,
            relatedId: pendingPayment.case_id,
            relatedType: 'purchase_case'
          });
        }

        setVerified(true);
        toast.success('Paiement confirmé avec succès !');

        // Nettoyer localStorage
        localStorage.removeItem('pending_payment');

        // Rediriger vers le dossier après 3 secondes
        setTimeout(() => {
          navigate(`/acheteur/dossier/${pendingPayment.case_id}`);
        }, 3000);
      } else if (statusResult.status === 'pending' || statusResult.status === 'processing') {
        setError('Paiement en cours de traitement. Veuillez patienter...');
        
        // Réessayer après 5 secondes
        setTimeout(() => {
          verifyPayment();
        }, 5000);
      } else {
        throw new Error('Le paiement n\'a pas été confirmé');
      }
    } catch (err) {
      console.error('❌ Erreur vérification paiement:', err);
      setError(err.message);
      setVerifying(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Erreur de vérification
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error}
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => verifyPayment()}
                className="w-full"
              >
                Réessayer
              </Button>
              
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full"
              >
                Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Vérification du paiement...
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400">
              Nous vérifions votre paiement auprès de la passerelle.
              <br />
              Cela peut prendre quelques instants.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-50">
      <Card className="max-w-md w-full shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-green-600">
            Paiement confirmé !
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Votre paiement de
          </p>
          
          <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {paymentData?.amount ? (
              new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'XOF',
                minimumFractionDigits: 0
              }).format(paymentData.amount)
            ) : '---'}
          </p>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            a été confirmé avec succès. Vous recevrez une notification de confirmation
            et votre dossier sera mis à jour automatiquement.
          </p>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✅ Le notaire sera notifié de votre paiement
              <br />
              ✅ Votre dossier avancera automatiquement
              <br />
              ✅ Vous recevrez un reçu par email
            </p>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Redirection automatique dans 3 secondes...
          </p>

          <Button
            onClick={() => navigate(`/acheteur/dossier/${paymentData?.case_id}`)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Retour au dossier
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
