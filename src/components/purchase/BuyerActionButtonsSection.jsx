import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap, CheckCircle, FileText, DollarSign, Shield, FileCheck,
  Calendar, CreditCard, CheckCircle2, Info, Loader2, UserPlus,
  Upload, Eye
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import WorkflowStatusService from '@/services/WorkflowStatusService';
import ContextualActionsService from '@/services/ContextualActionsService';

// Map des icônes Lucide
const iconMap = {
  CheckCircle,
  FileText,
  DollarSign,
  Shield,
  FileCheck,
  Calendar,
  CreditCard,
  CheckCircle2,
  UserPlus,
  Upload,
  Eye
};

/**
 * Composant affichant les boutons d'action de l'acheteur selon l'étape actuelle
 */
const BuyerActionButtonsSection = ({
  currentStatus,
  caseData,
  onActionClick,
  loading = false
}) => {
  if (!caseData || !currentStatus) {
    return null;
  }

  // Obtenir les actions contextuelles pour l'acheteur
  const actions = ContextualActionsService.getBuyerActions(caseData, {
    canSelectNotary: true,
    canUploadDocuments: true,
    canPayDeposit: true,
    canPayNotaryFees: true,
    canReviewContract: true,
    canConfirmAppointment: true,
    canPayBalance: true
  });

  // Récupérer toutes les actions disponibles
  const allActions = [
    ...(actions.validations || []),
    ...(actions.documents || []),
    ...(actions.payments || []),
    ...(actions.appointments || []),
    ...(actions.optional || [])
  ];

  if (allActions.length === 0) {
    return null;
  }

  // Séparer les actions prioritaires et obligatoires
  const priorityActions = allActions.filter(a => a.priority === 'high' || a.required);
  const regularActions = allActions.filter(a => a.priority !== 'high' && !a.required);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Actions Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Actions prioritaires (notaire) */}
            {priorityActions.length > 0 && (
              <div className="space-y-2">
                {priorityActions.map((action) => {
                  const IconComponent = iconMap[action.icon] || Zap;
                  
                  return (
                    <div key={action.id}>
                      {/* Carte d'action prioritaire */}
                      <div className={`flex items-center gap-3 p-4 ${action.className?.includes('bg-red') ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'} rounded-lg border`}>
                        <div className={`p-3 ${action.className?.includes('bg-red') ? 'bg-red-100' : 'bg-orange-100'} rounded-xl`}>
                          <IconComponent className={`w-6 h-6 ${action.className?.includes('bg-red') ? 'text-red-600' : 'text-orange-600'}`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {action.label}
                          </p>
                          {action.description && (
                            <p className="text-sm text-slate-600 mt-1">
                              {action.description}
                            </p>
                          )}
                          {action.required && (
                            <p className="text-xs text-red-600 mt-1 font-medium">
                              ⚠️ OBLIGATOIRE pour continuer
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bouton d'action */}
                      <Button
                        onClick={() => onActionClick?.(action)}
                        disabled={loading}
                        className={action.className || "w-full mt-2"}
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
                            {action.label}
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions régulières */}
            {regularActions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                {regularActions.map((action) => {
                  const IconComponent = iconMap[action.icon] || FileText;

                  return (
                    <Button
                      key={action.id}
                      onClick={() => onActionClick?.(action)}
                      disabled={loading}
                      variant="outline"
                      className="justify-start"
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {action.label}
                      {action.amount && (
                        <span className="ml-auto text-xs font-semibold">
                          {action.amount.toLocaleString()} FCFA
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Étape actuelle */}
            <div className="p-3 bg-slate-50 rounded-lg text-sm mt-4">
              <p className="text-slate-600">
                <span className="font-medium">Étape actuelle:</span>{' '}
                {WorkflowStatusService.getLabel(currentStatus)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BuyerActionButtonsSection;
