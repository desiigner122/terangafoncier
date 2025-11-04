import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  AlertCircle,
  Info,
  Calendar,
  Loader2,
  CheckCircle
} from 'lucide-react';
import NotaryFeesCalculator from '@/services/NotaryFeesCalculator';
import NotificationService from '@/services/NotificationService';
import PurchaseWorkflowService from '@/services/PurchaseWorkflowService';
import { toast } from 'sonner';

/**
 * Modal de création de demande de paiement par le notaire
 */
const PaymentRequestModal = ({
  isOpen,
  onClose,
  caseData,
  paymentType,
  nextStatus,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [calculation, setCalculation] = useState(null);
  const [customAmount, setCustomAmount] = useState(false);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isOpen && caseData && paymentType) {
      calculateFees();
    }
  }, [isOpen, caseData, paymentType]);

  const calculateFees = () => {
    if (!caseData?.purchase_price) {
      toast.error('Prix de vente non défini');
      return;
    }

    let calc;
    switch (paymentType) {
      case 'deposit':
        calc = NotaryFeesCalculator.calculateDeposit(caseData.purchase_price);
        setDescription('Versement des arrhes (10% du prix de vente)');
        setInstructions('Veuillez effectuer le virement des arrhes dans les 7 jours.');
        break;
      
      case 'notary_fees':
        calc = NotaryFeesCalculator.calculateNotaryFees(caseData.purchase_price);
        setDescription('Paiement des frais de notaire (droits, honoraires, taxes)');
        setInstructions('Ces frais doivent être réglés avant la signature de l\'acte.');
        break;
      
      case 'final_payment':
        calc = NotaryFeesCalculator.calculateFinalPayment(
          caseData.purchase_price,
          0 // TODO: Récupérer le montant des arrhes déjà versées
        );
        setDescription('Paiement du solde du prix de vente');
        setInstructions('Le solde sera versé le jour de la signature chez le notaire.');
        break;
      
      default:
        toast.error('Type de paiement invalide');
        return;
    }

    setCalculation(calc);
    setAmount(calc.total || calc.deposit || calc.final_balance || 0);

    // Date limite par défaut : 7 jours
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7);
    setDueDate(defaultDueDate.toISOString().split('T')[0]);
  };

  const getPaymentTypeLabel = (type) => {
    const labels = {
      deposit: 'Arrhes (10%)',
      notary_fees: 'Frais de notaire',
      final_payment: 'Solde du prix'
    };
    return labels[type] || type;
  };

  const handleSubmit = async () => {
    if (!caseData || !paymentType) {
      toast.error('Données manquantes');
      return;
    }

    if (!amount || amount <= 0) {
      toast.error('Montant invalide');
      return;
    }

    setLoading(true);

    try {
      // Créer la demande de paiement
      const result = await NotaryFeesCalculator.createPaymentRequest({
        caseId: caseData.id,
        requestType: paymentType,
        payerId: caseData.buyer_id,
        payerRole: 'buyer',
        notaryId: caseData.notaire_id,
        purchasePrice: caseData.purchase_price,
        description: description,
        instructions: instructions,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('✅ [PAYMENT REQUEST] Demande créée:', result.data.id);

      // Mettre à jour le statut du dossier
      if (nextStatus) {
        const statusUpdate = await PurchaseWorkflowService.updateCaseStatus(
          caseData.id,
          nextStatus,
          caseData.notaire_id,
          `Demande de paiement envoyée: ${getPaymentTypeLabel(paymentType)}`
        );

        if (!statusUpdate.success) {
          console.warn('⚠️ [PAYMENT REQUEST] Erreur mise à jour statut:', statusUpdate.error);
        }
      }

      // Envoyer notification à l'acheteur
      try {
        await NotificationService.sendPaymentRequest({
          buyerId: caseData.buyer_id,
          buyerEmail: caseData.buyer?.email || caseData.buyer_email,
          caseNumber: caseData.case_number,
          amount: amount,
          paymentType: paymentType,
          dueDate: dueDate,
          notaryName: caseData.notaire?.first_name + ' ' + caseData.notaire?.last_name
        });
        console.log('✅ [PAYMENT REQUEST] Notification envoyée à l\'acheteur');
      } catch (notifError) {
        console.warn('⚠️ [PAYMENT REQUEST] Erreur notification (non bloquante):', notifError);
      }

      toast.success(
        '✅ Demande de paiement envoyée !',
        {
          description: `L'acheteur a été notifié et peut procéder au paiement.`,
          duration: 5000
        }
      );

      onSuccess?.();
      onClose();

    } catch (error) {
      console.error('❌ [PAYMENT REQUEST] Erreur:', error);
      toast.error('Erreur lors de la création de la demande', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (!calculation) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Demande de Paiement
          </DialogTitle>
          <DialogDescription>
            Créer une demande de paiement pour le dossier{' '}
            <span className="font-semibold">{caseData.case_number}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Type de paiement */}
          <div>
            <Label className="text-sm text-slate-600">Type de paiement</Label>
            <Badge className="mt-2 bg-blue-100 text-blue-800 border-blue-200 text-base px-4 py-2">
              {getPaymentTypeLabel(paymentType)}
            </Badge>
          </div>

          {/* Détails du calcul */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Détails du calcul
            </h4>

            <div className="space-y-3">
              {calculation.breakdown && Object.entries(calculation.breakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">{key}</span>
                  <span className="font-medium text-slate-900">
                    {NotaryFeesCalculator.formatCurrency(value)}
                  </span>
                </div>
              ))}

              <Separator className="my-3" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Montant total</span>
                <span className="font-bold text-2xl text-emerald-600">
                  {NotaryFeesCalculator.formatCurrency(amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la demande de paiement"
              rows={3}
              className="mt-2"
            />
          </div>

          {/* Instructions */}
          <div>
            <Label htmlFor="instructions">Instructions pour l'acheteur</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instructions spécifiques (optionnel)"
              rows={2}
              className="mt-2"
            />
          </div>

          {/* Date limite */}
          <div>
            <Label htmlFor="dueDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date limite de paiement
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-2"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Alert information */}
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-sm text-amber-800">
              <strong>Important :</strong> L'acheteur recevra une notification par email
              et pourra effectuer le paiement via Wave, Orange Money ou virement bancaire.
              Le statut du dossier passera automatiquement à l'étape suivante une fois le paiement confirmé.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Envoyer la demande
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentRequestModal;
