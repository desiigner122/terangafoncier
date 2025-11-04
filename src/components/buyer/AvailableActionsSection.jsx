import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotaryFeesCalculator from '@/services/NotaryFeesCalculator';
import { AlertCircle, CreditCard, Clock, DollarSign, FileText } from 'lucide-react';
import { toast } from 'sonner';

/**
 * AvailableActionsSection - Affiche les demandes de paiement en attente pour l'acheteur
 * 
 * @param {Object} props
 * @param {Object} props.caseData - Données du dossier d'achat
 * @param {Object} props.user - Utilisateur connecté
 * @param {Function} props.onPaymentClick - Callback quand l'utilisateur clique "Payer"
 */
const AvailableActionsSection = ({ caseData, user, onPaymentClick }) => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadPaymentRequests();
    }
  }, [user?.id, caseData?.id]);

  const loadPaymentRequests = async () => {
    try {
      setLoading(true);
      const result = await NotaryFeesCalculator.getPendingPaymentRequests(user.id);
      
      if (result.success) {
        // Filtrer pour le dossier actuel si caseData fourni
        const filteredRequests = caseData?.id 
          ? result.data.filter(req => req.case_id === caseData.id)
          : result.data;
        
        setPaymentRequests(filteredRequests);
      } else {
        console.error('Error loading payment requests:', result.error);
        toast.error('Erreur lors du chargement des demandes de paiement');
      }
    } catch (error) {
      console.error('Error in loadPaymentRequests:', error);
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  // Mapper les types de paiement vers des labels français
  const getPaymentTypeLabel = (type) => {
    const labels = {
      deposit: 'Arrhes (10%)',
      notary_fees: 'Frais de notaire (17.5%)',
      final_payment: 'Paiement final (90%)'
    };
    return labels[type] || type;
  };

  // Obtenir l'icône selon le type de paiement
  const getPaymentTypeIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <DollarSign className="w-5 h-5 text-blue-600" />;
      case 'notary_fees':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'final_payment':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  // Calculer jours restants avant échéance
  const getDaysRemaining = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Obtenir badge d'urgence selon échéance
  const getUrgencyBadge = (daysRemaining) => {
    if (daysRemaining === null) return null;
    
    if (daysRemaining < 0) {
      return <Badge variant="destructive">En retard de {Math.abs(daysRemaining)} jour(s)</Badge>;
    } else if (daysRemaining === 0) {
      return <Badge variant="destructive">Échéance aujourd'hui</Badge>;
    } else if (daysRemaining <= 3) {
      return <Badge className="bg-orange-500 text-white">Urgent - {daysRemaining} jour(s) restant(s)</Badge>;
    } else if (daysRemaining <= 7) {
      return <Badge className="bg-yellow-500 text-white">{daysRemaining} jour(s) restant(s)</Badge>;
    } else {
      return <Badge variant="outline">{daysRemaining} jour(s) restant(s)</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Chargement des demandes de paiement...</p>
        </CardContent>
      </Card>
    );
  }

  if (paymentRequests.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de demandes
  }

  return (
    <Card className="border-l-4 border-l-red-500 shadow-lg">
      <CardHeader className="bg-red-50 dark:bg-red-900/20">
        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertCircle className="w-6 h-6 animate-pulse" />
          <span className="text-xl">Paiement(s) en attente</span>
          <Badge variant="destructive" className="ml-auto">
            {paymentRequests.length} demande(s)
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {paymentRequests.map((request) => {
          const daysRemaining = getDaysRemaining(request.due_date);
          
          return (
            <div 
              key={request.id} 
              className="p-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* En-tête avec type et urgence */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getPaymentTypeIcon(request.request_type)}
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100">
                      {getPaymentTypeLabel(request.request_type)}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {request.description}
                    </p>
                  </div>
                </div>
                {getUrgencyBadge(daysRemaining)}
              </div>

              {/* Montant principal */}
              <div className="my-4 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-red-300 dark:border-red-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Montant à payer</p>
                <p className="text-3xl font-extrabold text-red-600 dark:text-red-400">
                  {NotaryFeesCalculator.formatCurrency(request.amount)}
                </p>
              </div>

              {/* Ventilation des frais (pour notary_fees) */}
              {request.request_type === 'notary_fees' && request.breakdown && (
                <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    Ventilation des frais
                  </p>
                  <div className="space-y-1 text-sm">
                    {request.breakdown.registration_fees && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Droits d'enregistrement (10%)</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {NotaryFeesCalculator.formatCurrency(request.breakdown.registration_fees)}
                        </span>
                      </div>
                    )}
                    {request.breakdown.notary_fees && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Honoraires notaire (5%)</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {NotaryFeesCalculator.formatCurrency(request.breakdown.notary_fees)}
                        </span>
                      </div>
                    )}
                    {request.breakdown.taxes_stamps && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Taxes et timbres (2.5%)</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {NotaryFeesCalculator.formatCurrency(request.breakdown.taxes_stamps)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Instructions de paiement */}
              {request.payment_instructions && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                    Instructions du notaire
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {request.payment_instructions}
                  </p>
                </div>
              )}

              {/* Date limite */}
              {request.due_date && (
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>
                    Échéance : {new Date(request.due_date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}

              {/* Bouton de paiement */}
              <Button 
                onClick={() => onPaymentClick(request)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 text-lg shadow-md hover:shadow-lg transition-all"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Procéder au paiement
              </Button>

              {/* Informations supplémentaires */}
              <div className="mt-3 pt-3 border-t border-red-200 dark:border-red-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Demandé le {new Date(request.requested_at).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  En attente
                </span>
              </div>
            </div>
          );
        })}

        {/* Message d'aide */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Important :</strong> Ces paiements sont nécessaires pour faire avancer votre dossier d'achat. 
              Vous pouvez payer par Wave, Orange Money, virement bancaire ou carte bancaire.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailableActionsSection;
