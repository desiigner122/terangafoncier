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
  X
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUserAction, canUserAct } from '@/config/userWorkflowActions';

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
};

/**
 * Composant pour afficher les boutons d'action pour Acheteur/Vendeur
 * Similaire à ActionButtonsSection pour notaire
 * 
 * @param {Object} props
 * @param {string} props.userRole - 'buyer' ou 'seller'
 * @param {string} props.currentStatus - Statut actuel du dossier
 * @param {Object} props.caseData - Données complètes du dossier
 * @param {string} props.userId - ID de l'utilisateur connecté
 * @param {Function} props.onActionClick - Callback quand action cliquée
 * @param {Function} props.onPaymentClick - Callback pour actions de paiement
 * @param {Function} props.onDocumentUpload - Callback pour upload documents
 * @param {Function} props.onCancelClick - Callback pour annulation
 * @param {boolean} props.loading - État de chargement
 */
const UserActionButtonsSection = ({
  userRole,
  currentStatus,
  caseData,
  userId,
  onActionClick,
  onPaymentClick,
  onDocumentUpload,
  onCancelClick,
  loading = false,
}) => {
  // Récupérer l'action disponible pour cet utilisateur à cette étape
  const action = getUserAction(userRole, currentStatus);
  
  // Vérifier si l'utilisateur peut agir
  const canAct = canUserAct(userRole, currentStatus, userId, caseData);

  // Si pas d'action disponible, ne rien afficher
  if (!action) {
    return null;
  }

  // Récupérer l'icône
  const IconComponent = iconMap[action.icon] || Clock;

  /**
   * Handler du click sur le bouton principal
   */
  const handleClick = () => {
    if (action.disabled || loading) return;

    // Si action nécessite un paiement
    if (action.requiresPayment) {
      onPaymentClick?.({
        action: action.action,
        nextStatus: action.nextStatus,
        paymentType: action.paymentType,
        paymentMethods: action.paymentMethods,
      });
      return;
    }

    // Si action nécessite upload documents
    if (action.requiresDocuments || action.requiresDocument) {
      onDocumentUpload?.({
        action: action.action,
        nextStatus: action.nextStatus,
        documentTypes: action.documentTypes || [action.documentType],
      });
      return;
    }

    // Action standard
    onActionClick?.({
      action: action.action,
      nextStatus: action.nextStatus,
      requiresAppointment: action.requiresAppointment,
      requiresProof: action.requiresProof,
    });
  };

  /**
   * Handler pour annulation
   */
  const handleCancel = () => {
    onCancelClick?.();
  };

  // Couleur du badge selon le rôle
  const roleBadgeColor = userRole === 'buyer' 
    ? 'bg-blue-100 text-blue-800' 
    : 'bg-green-100 text-green-800';

  const roleLabel = userRole === 'buyer' ? 'Acheteur' : 'Vendeur';

  return (
    <Card className="border-l-4 border-l-primary shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header avec rôle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${action.disabled ? 'bg-gray-100' : `bg-${action.color}-50`}`}>
                <IconComponent 
                  className={`h-5 w-5 ${action.disabled ? 'text-gray-400' : `text-${action.color}-600`}`} 
                />
              </div>
              <div>
                <Badge variant="outline" className={roleBadgeColor}>
                  {roleLabel}
                </Badge>
                <h3 className="text-lg font-semibold mt-1">
                  {action.label}
                </h3>
              </div>
            </div>

            {/* Badge statut */}
            {action.disabled && (
              <Badge variant="secondary" className="bg-gray-100">
                En attente
              </Badge>
            )}
            {action.criticalAction && !action.disabled && (
              <Badge variant="destructive" className="animate-pulse">
                Action requise
              </Badge>
            )}
          </div>

          {/* Description */}
          <Alert className={action.disabled ? 'bg-gray-50' : ''}>
            <AlertDescription className="text-sm text-muted-foreground">
              {action.description}
            </AlertDescription>
          </Alert>

          {/* Informations additionnelles */}
          {action.requiresPayment && (
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span className="text-muted-foreground">
                Paiement requis • Montant calculé selon le prix d'achat
              </span>
            </div>
          )}

          {action.requiresDocuments && (
            <div className="flex items-center gap-2 text-sm">
              <Upload className="h-4 w-4 text-blue-600" />
              <span className="text-muted-foreground">
                Documents à fournir : {action.documentTypes?.length || 1} fichier(s)
              </span>
            </div>
          )}

          {action.requiresAppointment && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-muted-foreground">
                Confirmation de rendez-vous requise
              </span>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-2">
            {/* Bouton principal */}
            <Button
              onClick={handleClick}
              disabled={!canAct || action.disabled || loading}
              className={`flex-1 ${action.criticalAction ? 'bg-red-600 hover:bg-red-700' : ''}`}
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Traitement...
                </>
              ) : (
                <>
                  <IconComponent className="h-4 w-4 mr-2" />
                  {action.label}
                </>
              )}
            </Button>

            {/* Bouton annuler (si disponible) */}
            {action.canCancel && !action.disabled && (
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={loading}
                size="lg"
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
            )}

            {/* Bouton décliner (pour vendeur) */}
            {action.canDecline && !action.disabled && (
              <Button
                onClick={handleCancel}
                variant="destructive"
                disabled={loading}
                size="lg"
              >
                <X className="h-4 w-4 mr-2" />
                Décliner
              </Button>
            )}
          </div>

          {/* Note pour actions désactivées */}
          {action.disabled && (
            <p className="text-xs text-muted-foreground italic text-center">
              Aucune action requise de votre part pour le moment. Vous serez notifié lorsque votre intervention sera nécessaire.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActionButtonsSection;
