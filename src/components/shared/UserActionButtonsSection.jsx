import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  FileSignature, 
  CreditCard, 
  Upload, 
  Key,
  FileCheck,
  Calendar,
  Banknote,
  Landmark,
  Receipt,
  MapPin,
  Calculator,
  Hourglass,
  ArrowRightLeft,
  FileText,
  Bell,
  Shield,
  Search,
  X,
  Zap,
  Eye,
  UserPlus,
  DollarSign
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ContextualActionsService from '@/services/ContextualActionsService';

/**
 * Mapping des icônes par nom
 */
const iconMap = {
  Clock,
  CheckCircle,
  FileSignature,
  CreditCard,
  Upload,
  Key,
  FileCheck,
  Calendar,
  Banknote,
  Landmark,
  Receipt,
  MapPin,
  Calculator,
  Hourglass,
  ArrowRightLeft,
  FileText,
  Bell,
  Shield,
  Search,
  X,
  Zap,
  Eye,
  UserPlus,
  DollarSign,
  CheckCircle2: CheckCircle
};

/**
 * Composant pour afficher les boutons d'action pour Acheteur/Vendeur
 * Utilise ContextualActionsService pour déterminer les actions disponibles
 * 
 * @param {Object} props
 * @param {string} props.userRole - 'buyer' ou 'seller'
 * @param {string} props.currentStatus - Statut actuel du dossier
 * @param {Object} props.caseData - Données complètes du dossier
 * @param {string} props.userId - ID de l'utilisateur connecté
 * @param {Function} props.onActionClick - Callback quand action cliquée
 * @param {boolean} props.loading - État de chargement
 */
const UserActionButtonsSection = ({
  userRole,
  currentStatus,
  caseData,
  userId,
  onActionClick,
  loading = false,
}) => {
  console.log('🎬 [UserActionButtonsSection] Rendu', { userRole, currentStatus, caseDataId: caseData?.id });

  if (!caseData || !currentStatus) {
    console.log('⚠️ [UserActionButtonsSection] Missing data');
    return null;
  }

  // Récupérer les actions selon le rôle
  const getActions = () => {
    const permissions = {
      canSelectNotary: true,
      canUploadDocuments: true,
      canPayDeposit: true,
      canPayNotaryFees: true,
      canReviewContract: true,
      canConfirmAppointment: true,
      canPayBalance: true
    };

    if (userRole === 'buyer') {
      return ContextualActionsService.getBuyerActions(caseData, permissions);
    } else if (userRole === 'seller') {
      return ContextualActionsService.getSellerActions(caseData, permissions);
    }
    return { validations: [], documents: [], payments: [], appointments: [], optional: [] };
  };

  const actions = getActions();

  // Regrouper toutes les actions
  const allActions = [
    ...(actions.validations || []),
    ...(actions.documents || []),
    ...(actions.payments || []),
    ...(actions.appointments || []),
    ...(actions.optional || [])
  ];

  console.log('📋 [UserActionButtonsSection] Actions disponibles:', allActions.length, allActions);

  // Si pas d'action disponible, ne rien afficher
  if (allActions.length === 0) {
    console.log('⚠️ [UserActionButtonsSection] Aucune action - composant masqué');
    return null;
  }

  // Séparer les actions prioritaires et régulières
  const priorityActions = allActions.filter(a => a.priority === 'high' || a.required);
  const regularActions = allActions.filter(a => a.priority !== 'high' && !a.required);

  const roleLabel = userRole === 'buyer' ? 'Acheteur' : 'Vendeur';
  const roleBadgeColor = userRole === 'buyer' 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-green-100 text-green-800';

  return (
    <Card className="border-l-4 border-l-primary shadow-sm mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header avec rôle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={roleBadgeColor}>
                {roleLabel}
              </Badge>
              <h3 className="text-lg font-semibold">
                Actions Disponibles
              </h3>
            </div>
          </div>

          {/* Actions prioritaires */}
          {priorityActions.length > 0 && (
            <div className="space-y-3">
              {priorityActions.map((action) => {
                const IconComponent = iconMap[action.icon] || Zap;
                
                return (
                  <div key={action.id} className="space-y-2">
                    {/* Carte d'action prioritaire */}
                    <Alert className={action.className?.includes('bg-red') ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}>
                      <AlertDescription>
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-5 w-5 ${action.className?.includes('bg-red') ? 'text-red-600' : 'text-orange-600'}`} />
                          <div>
                            <p className="font-semibold">{action.label}</p>
                            {action.description && (
                              <p className="text-sm text-muted-foreground mt-1">
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
                      </AlertDescription>
                    </Alert>

                    {/* Bouton d'action */}
                    <Button
                      onClick={() => {
                        console.log('🖱️ [UserActionButtons] Clic:', action.id, action.label);
                        onActionClick?.(action);
                      }}
                      disabled={loading}
                      className={action.className || "w-full"}
                      size="lg"
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      {action.label}
                      {action.amount && (
                        <span className="ml-auto">
                          {action.amount.toLocaleString()} FCFA
                        </span>
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
                    onClick={() => {
                      console.log('🖱️ [UserActionButtons Regular] Clic:', action.id, action.label);
                      onActionClick?.(action);
                    }}
                    disabled={loading}
                    variant="outline"
                    className="justify-start"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
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
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActionButtonsSection;
