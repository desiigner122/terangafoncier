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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileSignature, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

/**
 * Modal pour signer l'accord préliminaire (promesse de vente)
 * Utilisé par acheteur ET vendeur
 */
const SignPreliminaryAgreementModal = ({
  isOpen,
  onClose,
  caseData,
  userRole, // 'buyer' ou 'seller'
  userId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);

  const isBuyer = userRole === 'buyer';
  const roleLabel = isBuyer ? 'Acheteur' : 'Vendeur';

  /**
   * Gérer la signature
   */
  const handleSign = async () => {
    if (!termsAccepted || !signatureConfirmed) {
      toast.error('Veuillez accepter les conditions et confirmer votre signature');
      return;
    }

    setLoading(true);

    try {
      // 1. Mettre à jour le dossier avec signature
      const signatureField = isBuyer ? 'buyer_signature' : 'seller_signature';
      const signedAtField = isBuyer ? 'buyer_signed_at' : 'seller_signed_at';

      const { error: updateError } = await supabase
        .from('purchase_cases')
        .update({
          [signatureField]: {
            signed: true,
            signed_by: userId,
            signed_at: new Date().toISOString(),
            signature_type: 'electronic',
            role: roleLabel,
          },
          [signedAtField]: new Date().toISOString(),
          metadata: {
            ...caseData.metadata,
            [`${userRole}_preliminary_agreement_signed`]: true,
          },
        })
        .eq('id', caseData.id);

      if (updateError) throw updateError;

      // 2. Vérifier si les DEUX parties ont signé
      const { data: updatedCase, error: fetchError } = await supabase
        .from('purchase_cases')
        .select('buyer_signature, seller_signature')
        .eq('id', caseData.id)
        .single();

      if (fetchError) throw fetchError;

      const bothSigned = 
        updatedCase.buyer_signature?.signed && 
        updatedCase.seller_signature?.signed;

      // 3. Si les deux ont signé, avancer vers paiement des arrhes
      if (bothSigned) {
        const { error: statusError } = await supabase
          .from('purchase_cases')
          .update({
            status: 'deposit_payment',
            updated_at: new Date().toISOString(),
          })
          .eq('id', caseData.id);

        if (statusError) throw statusError;

        toast.success(
          '🎉 Accord préliminaire signé par les deux parties!',
          {
            description: 'Le dossier avance vers le versement des arrhes',
            duration: 5000,
          }
        );
      } else {
        // Signature unilatérale réussie
        const otherParty = isBuyer ? 'le vendeur' : 'l\'acheteur';
        toast.success(
          `✅ Signature ${roleLabel} enregistrée`,
          {
            description: `En attente de la signature de ${otherParty}`,
            duration: 4000,
          }
        );
      }

      // 4. Créer notification pour l'autre partie
      const notifyUserId = isBuyer ? caseData.seller_id : caseData.buyer_id;
      await supabase.from('notifications').insert({
        user_id: notifyUserId,
        type: 'document_signed',
        title: `${roleLabel} a signé l'accord préliminaire`,
        message: bothSigned 
          ? 'Les deux parties ont signé. Le dossier avance vers le paiement des arrhes.'
          : `${roleLabel} a signé l'accord préliminaire. Veuillez signer à votre tour.`,
        link: `/dossier/${caseData.case_number}`,
        metadata: {
          case_id: caseData.id,
          case_number: caseData.case_number,
          document_type: 'preliminary_agreement',
          signer_role: roleLabel,
          both_signed: bothSigned,
        },
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur signature:', error);
      toast.error('Erreur lors de la signature', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'utilisateur a déjà signé
  const alreadySigned = isBuyer 
    ? caseData.buyer_signature?.signed 
    : caseData.seller_signature?.signed;

  if (alreadySigned) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Déjà signé
            </DialogTitle>
          </DialogHeader>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>
              Vous avez déjà signé l'accord préliminaire le{' '}
              {new Date(
                isBuyer 
                  ? caseData.buyer_signed_at 
                  : caseData.seller_signed_at
              ).toLocaleDateString('fr-FR')}
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button onClick={onClose}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileSignature className="h-6 w-6 text-blue-600" />
            Signature de l'Accord Préliminaire
          </DialogTitle>
          <DialogDescription>
            Promesse de vente pour le dossier {caseData.case_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations du dossier */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm text-gray-700">
              Informations du Bien
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Prix d'achat:</span>
                <p className="font-medium">
                  {caseData.purchase_price?.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Arrhes (10%):</span>
                <p className="font-medium text-green-600">
                  {(caseData.purchase_price * 0.1)?.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
            </div>
          </div>

          {/* Contenu de l'accord */}
          <div className="border rounded-lg p-4 space-y-3 bg-white">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <FileSignature className="h-4 w-4" />
              Accord Préliminaire de Vente
            </h4>
            
            <div className="text-sm space-y-2 text-muted-foreground max-h-64 overflow-y-auto">
              <p><strong>Entre les soussignés :</strong></p>
              <p>• <strong>Le Vendeur</strong> : {caseData.seller_name || 'Vendeur'}</p>
              <p>• <strong>L'Acheteur</strong> : {caseData.buyer_name || 'Acheteur'}</p>
              
              <p className="pt-2"><strong>Il a été convenu ce qui suit :</strong></p>
              
              <p><strong>Article 1 - Objet</strong></p>
              <p>Le vendeur s'engage à vendre et l'acheteur à acheter le bien immobilier suivant : {caseData.property_details?.title}</p>
              
              <p><strong>Article 2 - Prix</strong></p>
              <p>Le prix de vente est fixé à {caseData.purchase_price?.toLocaleString('fr-FR')} FCFA</p>
              
              <p><strong>Article 3 - Arrhes</strong></p>
              <p>
                L'acheteur versera au vendeur des arrhes d'un montant de{' '}
                {(caseData.purchase_price * 0.1)?.toLocaleString('fr-FR')} FCFA,
                soit 10% du prix de vente.
              </p>
              
              <p><strong>Article 4 - Conditions suspensives</strong></p>
              <p>• Vérification des titres de propriété</p>
              <p>• Obtention des certificats requis</p>
              <p>• Situation fiscale à jour</p>
              
              <p><strong>Article 5 - Délai</strong></p>
              <p>La vente définitive devra être conclue dans un délai de 90 jours.</p>
            </div>

            {/* Bouton télécharger */}
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Télécharger le document complet
            </Button>
          </div>

          {/* Checkboxes de confirmation */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={setTermsAccepted}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                Je déclare avoir lu et compris les termes de cet accord préliminaire.
                Je m'engage à respecter toutes les clauses mentionnées.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="signature"
                checked={signatureConfirmed}
                onCheckedChange={setSignatureConfirmed}
              />
              <Label htmlFor="signature" className="text-sm leading-relaxed cursor-pointer">
                Je confirme ma signature électronique et reconnais que celle-ci a
                la même valeur qu'une signature manuscrite.
              </Label>
            </div>
          </div>

          {/* Avertissement */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              En signant cet accord préliminaire, vous vous engagez légalement.
              Les arrhes versées seront perdues en cas de désistement de l'acheteur.
            </AlertDescription>
          </Alert>
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
            onClick={handleSign}
            disabled={!termsAccepted || !signatureConfirmed || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Signature en cours...
              </>
            ) : (
              <>
                <FileSignature className="h-4 w-4 mr-2" />
                Signer l'accord
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignPreliminaryAgreementModal;
