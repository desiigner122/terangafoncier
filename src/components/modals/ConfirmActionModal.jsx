import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import PurchaseWorkflowService from '@/services/PurchaseWorkflowService';

/**
 * Modal générique pour confirmation d'actions simples
 * (autoriser visite, confirmer rendez-vous, etc.)
 */
const ConfirmActionModal = ({
  isOpen,
  onClose,
  caseData,
  action, // L'objet action complet
  userId,
  userRole,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  if (!action) return null;

  /**
   * Gérer la confirmation
   */
  const handleConfirm = async () => {
    setLoading(true);

    try {
      // Mettre à jour le statut du dossier
      const result = await PurchaseWorkflowService.updateCaseStatus(
        caseData.id,
        action.nextStatus,
        {
          action_by: userId,
          action_role: userRole,
          action_type: action.action,
          action_notes: notes,
          action_timestamp: new Date().toISOString(),
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la mise à jour');
      }

      // Créer notification pour les autres parties
      const notificationPromises = [];

      // Notifier le notaire
      if (caseData.notaire_id && caseData.notaire_id !== userId) {
        notificationPromises.push(
          supabase.from('notifications').insert({
            user_id: caseData.notaire_id,
            type: 'case_action',
            title: `Action effectuée: ${action.label}`,
            message: `${userRole === 'buyer' ? 'L\'acheteur' : 'Le vendeur'} a effectué: ${action.label}`,
            link: `/notaire/dossier/${caseData.case_number}`,
            metadata: {
              case_id: caseData.id,
              case_number: caseData.case_number,
              action: action.action,
              actor_role: userRole,
            },
          })
        );
      }

      // Notifier l'autre partie
      const otherPartyId = userRole === 'buyer' ? caseData.seller_id : caseData.buyer_id;
      if (otherPartyId && otherPartyId !== userId) {
        notificationPromises.push(
          supabase.from('notifications').insert({
            user_id: otherPartyId,
            type: 'case_action',
            title: `Mise à jour dossier ${caseData.case_number}`,
            message: `${userRole === 'buyer' ? 'L\'acheteur' : 'Le vendeur'} a effectué: ${action.label}`,
            link: userRole === 'buyer' 
              ? `/vendeur/dossier/${caseData.case_number}`
              : `/acheteur/dossier/${caseData.case_number}`,
            metadata: {
              case_id: caseData.id,
              case_number: caseData.case_number,
              action: action.action,
              actor_role: userRole,
            },
          })
        );
      }

      await Promise.all(notificationPromises);

      toast.success(`✅ ${action.label}`, {
        description: action.nextStatus 
          ? 'Le dossier avance vers l\'étape suivante'
          : 'Action enregistrée avec succès',
        duration: 4000,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur confirmation action:', error);
      toast.error('Erreur', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            {action.label}
          </DialogTitle>
          <DialogDescription>
            Dossier: {caseData.case_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Description de l'action */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {action.description}
            </AlertDescription>
          </Alert>

          {/* Zone de notes optionnelle */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes ou commentaires (optionnel)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ajoutez des détails si nécessaire..."
              rows={3}
            />
          </div>

          {/* Info sur la suite */}
          {action.nextStatus && (
            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">
              Après cette action, le dossier passera à l'étape suivante.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Traitement...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmActionModal;
