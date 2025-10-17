import React, { useMemo } from 'react';
import { CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const CaseTrackingStatus = ({ caseData = {} }) => {
  const translateStatus = (status) => {
    if (!status) return 'En attente';
    const normalized = status.toLowerCase();
    const translations = {
      pending: 'En attente',
      initiated: 'Initiée',
      seller_notification: 'Notification vendeur',
      seller_accepted: 'Acceptée par le vendeur',
      seller_declined: 'Refusée par le vendeur',
      negotiation: 'En négociation',
      preliminary_agreement: 'Accord préliminaire',
      buyer_verification: 'Vérification acheteur',
      verified: 'Documents vérifiés',
      legal_processing: 'Traitement juridique',
      payment_pending: 'Paiement en attente',
      payment_processing: 'Traitement du paiement',
      payment_processed: 'Paiement traité',
      property_transfer: 'Transfert de propriété',
      contract_preparation: 'Préparation du contrat',
      completed: 'Terminé',
      declined: 'Refusée',
      cancelled: 'Annulée'
    };

    if (translations[normalized]) {
      return translations[normalized];
    }

    const fallback = normalized.replace(/_/g, ' ');
    return fallback.charAt(0).toUpperCase() + fallback.slice(1);
  };

  const currentStatusLabel = translateStatus(caseData?.status);
  const normalizedStatus = typeof caseData?.status === 'string' ? caseData.status.toLowerCase() : '';
  const normalizedSellerStatus = typeof caseData?.seller_status === 'string' ? caseData.seller_status.toLowerCase() : '';
  const vendorAcceptedStatuses = useMemo(
    () => new Set([
      'seller_accepted',
      'preliminary_agreement',
      'buyer_verification',
      'verified',
      'legal_processing',
      'payment_pending',
      'payment_processing',
      'payment_processed',
      'property_transfer',
      'contract_preparation',
      'completed'
    ]),
    []
  );
  const vendorAccepted = normalizedSellerStatus === 'accepted' || vendorAcceptedStatuses.has(normalizedStatus);
  const vendorDeclined = normalizedSellerStatus === 'declined' || normalizedStatus === 'seller_declined' || normalizedStatus === 'declined';

  // Define workflow phases
  const phases = useMemo(() => {
    const documentCompletedStatuses = ['verified', 'legal_processing', 'payment_pending', 'payment_processing', 'payment_processed', 'property_transfer', 'contract_preparation', 'completed'];
    const documentCurrentStatuses = ['seller_accepted', 'preliminary_agreement', 'buyer_verification'];
    const legalCompletedStatuses = ['verified', 'payment_pending', 'payment_processing', 'payment_processed', 'property_transfer', 'contract_preparation', 'completed'];
    const paymentCurrentStatuses = ['payment_pending', 'payment_processing'];
    const paymentCompletedStatuses = ['payment_processed', 'property_transfer', 'contract_preparation', 'completed'];

    return [
      {
        id: 1,
        title: 'Demande Créée',
        description: 'Demande d\'achat initiée',
        icon: '📋',
        status: caseData?.created_at ? 'completed' : 'pending',
        date: caseData?.created_at,
        color: 'bg-blue-50 border-blue-200',
        textColor: 'text-blue-900'
      },
      {
        id: 2,
        title: 'Acceptation Vendeur',
        description: 'Le vendeur accepte la demande',
        icon: '✅',
        status: vendorAccepted ? 'completed' : vendorDeclined ? 'declined' : 'pending',
        date: caseData?.seller_response_date,
        color: 'bg-green-50 border-green-200',
        textColor: 'text-green-900'
      },
      {
        id: 3,
        title: 'Vérification Documents',
        description: 'Tous les documents sont vérifiés',
        icon: '🔍',
        status: documentCompletedStatuses.includes(normalizedStatus)
          ? 'completed'
          : documentCurrentStatuses.includes(normalizedStatus)
            ? 'current'
            : 'pending',
        date: null,
        color: 'bg-purple-50 border-purple-200',
        textColor: 'text-purple-900'
      },
      {
        id: 4,
        title: 'Traitement Juridique',
        description: 'Notaire et vérification légale',
        icon: '⚖️',
        status: normalizedStatus === 'legal_processing'
          ? 'current'
          : legalCompletedStatuses.includes(normalizedStatus)
            ? 'completed'
            : 'pending',
        date: null,
        color: 'bg-orange-50 border-orange-200',
        textColor: 'text-orange-900'
      },
      {
        id: 5,
        title: 'Traitement Paiement',
        description: 'Les frais et paiements sont traités',
        icon: '💰',
        status: paymentCurrentStatuses.includes(normalizedStatus)
          ? 'current'
          : paymentCompletedStatuses.includes(normalizedStatus)
            ? 'completed'
            : 'pending',
        date: null,
        color: 'bg-yellow-50 border-yellow-200',
        textColor: 'text-yellow-900'
      },
      {
        id: 6,
        title: 'Transfert Complété',
        description: 'Transfert de propriété enregistré',
        icon: '🎉',
        status: normalizedStatus === 'completed' ? 'completed' : 'pending',
        date: caseData?.completed_at,
        color: 'bg-emerald-50 border-emerald-200',
        textColor: 'text-emerald-900'
      }
    ];
  }, [caseData, normalizedStatus, vendorAccepted, vendorDeclined]);

  // Get status badge color and text
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'bg-green-100 text-green-800', icon: '✅', text: 'Complété' };
      case 'current':
        return { color: 'bg-blue-100 text-blue-800', icon: '⏳', text: 'En cours' };
      case 'declined':
        return { color: 'bg-red-100 text-red-800', icon: '❌', text: 'Refusé' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: '⏸️', text: 'En attente' };
    }
  };

  // Calculate progress percentage
  const completedPhases = phases.filter(p => p.status === 'completed').length;
  const progressPercent = Math.round((completedPhases / phases.length) * 100);

  return (
    <Card className="w-full bg-gradient-to-br from-white to-gray-50 border-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              📦 Suivi de la Demande
              <Badge variant="outline" className="ml-2">
                {completedPhases}/{phases.length} étapes
              </Badge>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Statut actuel: <span className="font-semibold text-blue-700">{currentStatusLabel}</span>
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Progression</span>
            <span className="text-xs font-bold text-blue-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Timeline */}
        <div className="space-y-3">
          {phases.map((phase, idx) => {
            const statusDisplay = getStatusDisplay(phase.status);
            const isLast = idx === phases.length - 1;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                {/* Phase Item */}
                <div className={`border-l-4 ${
                  phase.status === 'completed' ? 'border-green-400' :
                  phase.status === 'current' ? 'border-blue-400' :
                  phase.status === 'declined' ? 'border-red-400' :
                  'border-gray-300'
                } pl-4 py-3`}>
                  <div className={`rounded-lg border p-3 ${phase.color}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Phase Number and Title */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{phase.icon}</span>
                          <div>
                            <h4 className={`font-semibold text-sm ${phase.textColor}`}>
                              {phase.id}. {phase.title}
                            </h4>
                            <p className="text-xs text-gray-600">{phase.description}</p>
                          </div>
                        </div>

                        {/* Date if available */}
                        {phase.date && (
                          <p className="text-xs text-gray-600 ml-10 mt-1">
                            📅 {new Date(phase.date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                      </div>

                      {/* Status Badge */}
                      <Badge className={`${statusDisplay.color} whitespace-nowrap ml-2`}>
                        {statusDisplay.icon} {statusDisplay.text}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Connector to next phase */}
                {!isLast && (
                  <div className={`w-1 h-4 ml-1.5 ${
                    phase.status === 'completed' ? 'bg-green-400' : 'bg-gray-300'
                  }`} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Status Summary Card */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              📌 Résumé du Statut
            </p>
            <div className="space-y-1 text-xs text-blue-800">
              <p>
                <span className="font-semibold">Identifiant demande:</span> {caseData?.id?.substring(0, 8)}...
              </p>
              <p>
                <span className="font-semibold">Date création:</span>{' '}
                {caseData?.created_at ? new Date(caseData.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Dernière mise à jour:</span>{' '}
                {caseData?.updated_at ? new Date(caseData.updated_at).toLocaleString('fr-FR', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        {caseData?.status !== 'completed' && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              ⏭️ Prochaines Étapes
            </p>
            <ul className="text-xs text-amber-800 space-y-1">
              {caseData?.status === 'pending' && (
                <li>• En attente de l'acceptation du vendeur</li>
              )}
              {(caseData?.status === 'seller_accepted' || caseData?.seller_status === 'accepted') && (
                <>
                  <li>• Vérification des documents en cours</li>
                  <li>• Toutes les parties seront informées des prochaines étapes</li>
                </>
              )}
              {caseData?.status === 'verified' && (
                <>
                  <li>• Le notaire va commencer le traitement juridique</li>
                  <li>• Délai prévu: 5-7 jours ouvrables</li>
                </>
              )}
              {caseData?.status === 'legal_processing' && (
                <>
                  <li>• En attente de la fin de l'examen juridique</li>
                  <li>• Le traitement des paiements suivra</li>
                </>
              )}
              {caseData?.status === 'payment_pending' && (
                <>
                  <li>• Traiter le paiement des frais</li>
                  <li>• Le transfert sera enregistré après le paiement</li>
                </>
              )}
            </ul>
          </div>
        )}

        {caseData?.status === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-lg font-bold text-green-900">
              🎉 Demande Complétée!
            </p>
            <p className="text-xs text-green-800 mt-1">
              Toutes les étapes ont été complétées avec succès. Le transfert de propriété est enregistré.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CaseTrackingStatus;
