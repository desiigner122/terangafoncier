/**
 * Timeline de progression du dossier d'achat
 * Affiche les étapes franchies et à venir
 */
import React from 'react';
import { Check, Circle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const WORKFLOW_STAGES = [
  {
    id: 'offer_submitted',
    label: 'Offre soumise',
    description: 'Votre offre d\'achat a été envoyée au vendeur',
  },
  {
    id: 'offer_accepted',
    label: 'Offre acceptée',
    description: 'Le vendeur a accepté votre offre',
  },
  {
    id: 'documents_pending',
    label: 'Documents en attente',
    description: 'Constitution du dossier administratif',
  },
  {
    id: 'financing_approval',
    label: 'Financement validé',
    description: 'Accord de principe de la banque',
  },
  {
    id: 'compromis_signed',
    label: 'Compromis signé',
    description: 'Signature du compromis de vente',
  },
  {
    id: 'final_payment',
    label: 'Paiement final',
    description: 'Versement du solde du prix',
  },
  {
    id: 'title_transfer',
    label: 'Transfert de propriété',
    description: 'Signature chez le notaire',
  },
  {
    id: 'completed',
    label: 'Transaction finalisée',
    description: 'Vous êtes maintenant propriétaire',
  },
];

const STATUS_CONFIG = {
  completed: {
    icon: Check,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-500',
  },
  in_progress: {
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-500',
  },
  pending: {
    icon: Circle,
    color: 'text-gray-400',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
  },
  blocked: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-500',
  },
};

export const TimelineTracker = ({ currentStage, completedStages = [], history = [], compact = false }) => {
  const getStageStatus = (stageId) => {
    if (completedStages.includes(stageId)) return 'completed';
    if (currentStage === stageId) return 'in_progress';
    return 'pending';
  };

  const getStageDate = (stageId) => {
    const event = history.find(h => h.stage === stageId);
    return event?.created_at ? format(new Date(event.created_at), 'dd MMM yyyy', { locale: fr }) : null;
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {WORKFLOW_STAGES.map((stage, index) => {
          const status = getStageStatus(stage.id);
          const config = STATUS_CONFIG[status];
          const Icon = config.icon;

          return (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center min-w-[100px]">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all',
                    config.bgColor,
                    config.borderColor
                  )}
                >
                  <Icon className={cn('w-5 h-5', config.color)} />
                </div>
                <span className="text-xs mt-1 text-center text-gray-600 line-clamp-2">
                  {stage.label}
                </span>
              </div>
              {index < WORKFLOW_STAGES.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {WORKFLOW_STAGES.map((stage, index) => {
        const status = getStageStatus(stage.id);
        const config = STATUS_CONFIG[status];
        const Icon = config.icon;
        const date = getStageDate(stage.id);
        const isLast = index === WORKFLOW_STAGES.length - 1;

        return (
          <div key={stage.id} className="flex gap-4">
            {/* Timeline line & icon */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                  config.bgColor,
                  config.borderColor,
                  status === 'in_progress' && 'ring-4 ring-blue-100 animate-pulse'
                )}
              >
                <Icon className={cn('w-6 h-6', config.color)} />
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 h-16 mt-2',
                    status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{stage.label}</h4>
                    {status === 'completed' && (
                      <Badge className="bg-green-100 text-green-800">
                        Terminé
                      </Badge>
                    )}
                    {status === 'in_progress' && (
                      <Badge className="bg-blue-100 text-blue-800">
                        En cours
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                  {date && (
                    <p className="text-xs text-gray-500 mt-1">{date}</p>
                  )}
                </div>
              </div>

              {/* Historique des événements pour cette étape */}
              {history.filter(h => h.stage === stage.id).length > 0 && (
                <div className="mt-3 space-y-2">
                  {history
                    .filter(h => h.stage === stage.id)
                    .map((event, idx) => (
                      <Card key={idx} className="bg-gray-50 border-0">
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2" />
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{event.description}</p>
                              {event.actor && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Par {event.actor} • {format(new Date(event.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimelineTracker;
