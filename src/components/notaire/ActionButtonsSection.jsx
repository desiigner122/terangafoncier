import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  CheckCircle,
  Bell,
  FileText,
  DollarSign,
  Shield,
  Search,
  FileCheck,
  Receipt,
  Map,
  Calculator,
  Send,
  Clock,
  FileEdit,
  Calendar,
  CreditCard,
  Book,
  Key,
  CheckCircle2,
  Info,
  Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import WorkflowStatusService from '@/services/WorkflowStatusService';

// Map des icônes Lucide
const iconMap = {
  CheckCircle,
  Bell,
  FileText,
  DollarSign,
  Shield,
  Search,
  FileCheck,
  Receipt,
  Map,
  Calculator,
  Send,
  Clock,
  FileEdit,
  Calendar,
  CreditCard,
  Book,
  Key,
  CheckCircle2
};

/**
 * Composant affichant le bouton d'action du notaire selon l'étape actuelle
 */
const ActionButtonsSection = ({
  currentStatus,
  caseData,
  onActionClick,
  onPaymentRequestClick,
  loading = false
}) => {
  const actionConfig = WorkflowStatusService.getNotaryAction(currentStatus);

  if (!actionConfig) {
    return null;
  }

  // Obtenir l'icône correspondante
  const IconComponent = iconMap[actionConfig.icon] || Zap;

  const handleClick = () => {
    if (actionConfig.requiresPayment) {
      // Ouvrir modal de demande de paiement
      onPaymentRequestClick?.({
        paymentType: actionConfig.paymentType,
        nextStatus: actionConfig.nextStatus
      });
    } else if (actionConfig.action) {
      // Exécuter l'action
      onActionClick?.({
        action: actionConfig.action,
        nextStatus: actionConfig.nextStatus
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className={`border-l-4 border-l-${actionConfig.color}-600`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Action Requise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Carte d'action */}
            <div className={`flex items-center gap-3 p-4 bg-${actionConfig.color}-50 rounded-lg border border-${actionConfig.color}-200`}>
              <div className={`p-3 bg-${actionConfig.color}-100 rounded-xl`}>
                <IconComponent className={`w-6 h-6 text-${actionConfig.color}-600`} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">
                  {actionConfig.label}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {actionConfig.description}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Étape actuelle: {WorkflowStatusService.getLabel(currentStatus)}
                </p>
              </div>
            </div>

            {/* Bouton d'action */}
            <Button
              onClick={handleClick}
              disabled={actionConfig.disabled || loading}
              className={`w-full bg-gradient-to-r from-${actionConfig.color}-600 to-${actionConfig.color}-700 hover:from-${actionConfig.color}-700 hover:to-${actionConfig.color}-800`}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <IconComponent className="w-4 h-4 mr-2" />
                  {actionConfig.label}
                </>
              )}
            </Button>

            {/* Alert pour paiements */}
            {actionConfig.requiresPayment && (
              <Alert className="bg-amber-50 border-amber-200">
                <Info className="w-4 h-4 text-amber-600" />
                <AlertDescription className="text-sm text-amber-800">
                  Cette action déclenchera une demande de paiement à l'acheteur.
                  Il sera notifié par email et pourra payer via Wave, Orange Money ou virement bancaire.
                </AlertDescription>
              </Alert>
            )}

            {/* Prochaine étape */}
            {actionConfig.nextStatus && (
              <div className="p-3 bg-slate-50 rounded-lg text-sm">
                <p className="text-slate-600">
                  <span className="font-medium">Prochaine étape:</span>{' '}
                  {WorkflowStatusService.getLabel(actionConfig.nextStatus)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ActionButtonsSection;
