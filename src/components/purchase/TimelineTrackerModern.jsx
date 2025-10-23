/**
 * Timeline de progression du dossier d'achat - Version Refondée
 * Utilise les vrais statuts de la BD via WorkflowStatusService
 * Supporte financement bancaire et tous les statuts réels
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Circle, Clock, AlertCircle, ChevronRight, Building2, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import WorkflowStatusService from '@/services/WorkflowStatusService';

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

/**
 * Composant TimelineTracker - Nouvelle version
 * @param {Object} props
 * @param {string} props.currentStatus - Statut actuel du dossier (ex: 'payment_processing')
 * @param {string} props.paymentMethod - Méthode de paiement (one_time, installments, bank_financing, mixed)
 * @param {boolean} props.financingApproved - Si financement bancaire approuvé
 * @param {Array} props.completedStages - Stages complétés (pas utilisé, on calcule à partir de currentStatus)
 * @param {Array} props.history - Historique des changements
 * @param {boolean} props.compact - Mode compact (horizontal)
 */
export const TimelineTracker = ({
  currentStatus = 'initiated',
  paymentMethod = 'one_time',
  financingApproved = false,
  completedStages = [],
  history = [],
  compact = false,
}) => {
  // Construire la timeline basée sur le vrai workflow
  const timelineStages = useMemo(() => {
    const stages = WorkflowStatusService.chronologicalOrder.map((status) => ({
      id: status,
      label: WorkflowStatusService.getLabel(status),
      description: `Étape: ${WorkflowStatusService.getLabel(status)}`,
    }));

    // Ajouter étape bancaire conditionnelle si financement bancaire
    if (paymentMethod === 'bank_financing') {
      // Insérer après signing_process
      const signingIndex = stages.findIndex((s) => s.id === 'signing_process');
      if (signingIndex !== -1) {
        stages.splice(signingIndex + 1, 0, {
          id: 'bank_approval_check',
          label: 'Approbation Bancaire',
          description: 'Vérification finale de la banque avant le paiement',
          isSpecial: true,
          icon: Building2,
        });
      }
    }

    return stages;
  }, [paymentMethod]);

  // Déterminer le statut de chaque étape
  const getStageStatus = (stageId) => {
    if (stageId === 'bank_approval_check') {
      // Étape spéciale pour financement bancaire
      return financingApproved ? 'completed' : 'pending';
    }

    // Utiliser le service pour obtenir les étapes complétées
    const completedFromService = WorkflowStatusService.getCompletedStages(currentStatus);
    
    if (completedFromService.includes(stageId)) {
      return 'completed';
    }
    if (currentStatus === stageId) {
      return 'in_progress';
    }
    return 'pending';
  };

  // Obtenir la date d'une étape depuis l'historique
  const getStageDate = (stageId) => {
    const event = history.find((h) => h.new_status === stageId || h.status === stageId);
    return event?.created_at ? format(new Date(event.created_at), 'dd MMM yyyy', { locale: fr }) : null;
  };

  // Mode compact (horizontal)
  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {timelineStages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          const config = STATUS_CONFIG[status];
          const Icon = stage.icon || config.icon;

          return (
            <React.Fragment key={stage.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className="flex flex-col items-center min-w-[100px]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.08 + 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer',
                    config.bgColor,
                    config.borderColor,
                    stage.isSpecial && 'ring-2 ring-purple-300'
                  )}
                >
                  <motion.div
                    animate={status === 'in_progress' ? { rotate: 360 } : {}}
                    transition={status === 'in_progress' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
                  >
                    <Icon className={cn('w-5 h-5', config.color)} />
                  </motion.div>
                </motion.div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.08 + 0.15, duration: 0.3 }}
                  className="text-xs mt-1 text-center text-gray-600 line-clamp-2"
                >
                  {stage.label}
                </motion.span>
              </motion.div>
              {index < timelineStages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: index * 0.08 + 0.12, duration: 0.3 }}
                  className="origin-left"
                >
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  // Mode full (vertical)
  return (
    <div className="space-y-1">
      {timelineStages.map((stage, index) => {
        const status = getStageStatus(stage.id);
        const config = STATUS_CONFIG[status];
        const Icon = stage.icon || config.icon;
        const date = getStageDate(stage.id);
        const isLast = index === timelineStages.length - 1;

        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <div className="flex gap-4">
              {/* Timeline line & icon */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.1, duration: 0.3 }}
                  whileHover={status === 'in_progress' ? { scale: 1.1 } : {}}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                    config.bgColor,
                    config.borderColor,
                    status === 'in_progress' && 'ring-4 ring-blue-100 animate-pulse',
                    stage.isSpecial && 'ring-4 ring-purple-100'
                  )}
                >
                  <motion.div
                    animate={status === 'in_progress' ? { rotate: 360 } : {}}
                    transition={status === 'in_progress' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
                  >
                    <Icon className={cn('w-6 h-6', config.color)} />
                  </motion.div>
                </motion.div>
                {!isLast && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                    className="origin-top"
                  >
                    <div
                      className={cn(
                        'w-1 h-12 my-1',
                        status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                      )}
                    />
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.15, duration: 0.3 }}
                className="flex-1 py-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={cn(
                      'font-semibold text-base',
                      status === 'completed' && 'text-green-700',
                      status === 'in_progress' && 'text-blue-700',
                      status === 'pending' && 'text-gray-500',
                      status === 'blocked' && 'text-red-700'
                    )}>
                      {stage.label}
                    </p>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>

                  {/* Status Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  >
                    <Badge
                      variant={
                        status === 'completed'
                          ? 'default'
                          : status === 'in_progress'
                          ? 'secondary'
                          : 'outline'
                      }
                      className={cn(
                        'ml-2 flex-shrink-0',
                        status === 'completed' && 'bg-green-100 text-green-800',
                        status === 'in_progress' && 'bg-blue-100 text-blue-800 animate-pulse',
                        status === 'blocked' && 'bg-red-100 text-red-800'
                      )}
                    >
                      {status === 'completed' && 'Complété'}
                      {status === 'in_progress' && 'En cours'}
                      {status === 'pending' && 'En attente'}
                      {status === 'blocked' && 'Bloqué'}
                    </Badge>
                  </motion.div>
                </div>

                {/* Date si disponible */}
                {date && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.25, duration: 0.3 }}
                    className="text-xs text-gray-400 mt-2"
                  >
                    {date}
                  </motion.p>
                )}

                {/* Note spéciale pour étape bancaire */}
                {stage.isSpecial && stage.id === 'bank_approval_check' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.25, duration: 0.3 }}
                    className={cn(
                      'mt-3 p-2 rounded text-sm',
                      financingApproved
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    )}
                  >
                    {financingApproved
                      ? '✅ Financement approuvé par la banque'
                      : '⏳ En attente de l\'approbation bancaire'}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TimelineTracker;
