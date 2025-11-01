import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentGatewayService from '@/services/PaymentGatewayService';

/**
 * PaymentCancel - Page de retour après annulation de paiement
 */
const PaymentCancel = () => {
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    // Récupérer les données de paiement
    const pendingPaymentStr = localStorage.getItem('pending_payment');
    if (pendingPaymentStr) {
      const data = JSON.parse(pendingPaymentStr);
      setPaymentData(data);

      // Annuler la transaction si elle existe
      if (data.transaction_id) {
        PaymentGatewayService.cancelPayment(data.transaction_id)
          .then(result => {
            console.log('Transaction annulée:', result);
          })
          .catch(err => {
            console.error('Erreur annulation:', err);
          });
      }
    }
  }, []);

  const handleRetry = () => {
    if (paymentData?.case_id) {
      navigate(`/acheteur/dossier/${paymentData.case_id}`);
    } else {
      navigate(-1);
    }
  };

  const handleGoBack = () => {
    // Nettoyer localStorage
    localStorage.removeItem('pending_payment');
    
    if (paymentData?.case_id) {
      navigate(`/acheteur/dossier/${paymentData.case_id}`);
    } else {
      navigate('/acheteur');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="max-w-md w-full shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-red-600">
            Paiement annulé
          </h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Vous avez annulé le processus de paiement.
            {paymentData?.amount && (
              <>
                <br />
                Le montant de{' '}
                <span className="font-semibold">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XOF',
                    minimumFractionDigits: 0
                  }).format(paymentData.amount)}
                </span>{' '}
                n'a pas été débité.
              </>
            )}
          </p>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800 dark:text-orange-300">
              ℹ️ Aucun montant n'a été prélevé
              <br />
              ⚠️ La demande de paiement reste en attente
              <br />
              🔄 Vous pouvez réessayer à tout moment
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Réessayer le paiement
            </Button>
            
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour au dossier
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500">
              Besoin d'aide ? Contactez notre support :
              <br />
              <a href="mailto:support@teranga-foncier.sn" className="text-blue-600 hover:underline">
                support@teranga-foncier.sn
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;
