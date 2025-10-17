import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  DollarSign, 
  Calendar, 
  FileText,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const NegotiationModal = ({ request, isOpen, onClose, onSubmit, isSubmitting = false }) => {
  const initialPrice = request?.offered_price || request?.offer_price || 0;
  
  const [counterOffer, setCounterOffer] = useState({
    new_price: initialPrice,
    message: '',
    conditions: '',
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 jours
  });

  const priceDifference = counterOffer.new_price - initialPrice;
  const percentageDifference = initialPrice > 0 ? ((priceDifference / initialPrice) * 100).toFixed(1) : 0;

  const handleSubmit = () => {
    if (!counterOffer.new_price || counterOffer.new_price <= 0) {
      return;
    }
    onSubmit(counterOffer);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            Négociation de Prix
          </DialogTitle>
          <DialogDescription>
            Proposez une contre-offre pour <strong>{request?.parcels?.title || 'la propriété'}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Comparaison des prix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Offre acheteur */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Offre de l'acheteur</p>
              </div>
              <p className="text-3xl font-bold text-blue-700">
                {formatCurrency(initialPrice)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {request?.buyer_name || 'Acheteur'}
              </p>
            </div>
            
            {/* Votre contre-offre */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <p className="text-sm font-medium text-emerald-900">Votre contre-offre</p>
              </div>
              <p className="text-3xl font-bold text-emerald-700">
                {formatCurrency(counterOffer.new_price)}
              </p>
              {priceDifference !== 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {priceDifference > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-emerald-600 font-medium">
                        +{formatCurrency(priceDifference)} ({percentageDifference > 0 ? '+' : ''}{percentageDifference}%)
                      </span>
                    </>
                  ) : priceDifference < 0 ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-xs text-red-600 font-medium">
                        {formatCurrency(priceDifference)} ({percentageDifference}%)
                      </span>
                    </>
                  ) : (
                    <>
                      <Minus className="w-4 h-4 text-slate-600" />
                      <span className="text-xs text-slate-600 font-medium">
                        Identique
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Formulaire de contre-offre */}
          <div className="space-y-4">
            {/* Prix */}
            <div className="bg-white border rounded-xl p-4 space-y-3">
              <Label htmlFor="new_price" className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Votre contre-offre (FCFA) *
              </Label>
              <Input 
                id="new_price"
                type="number"
                step="10000"
                min="0"
                placeholder="Ex: 25000000"
                value={counterOffer.new_price}
                onChange={(e) => setCounterOffer({
                  ...counterOffer, 
                  new_price: parseInt(e.target.value) || 0
                })}
                className="text-lg h-12 border-2 focus:border-emerald-500"
                required
              />
              <p className="text-sm text-slate-600">
                Prix demandé initialement: {formatCurrency(request?.parcels?.price || 0)}
              </p>
            </div>
            
            {/* Message */}
            <div className="bg-white border rounded-xl p-4 space-y-3">
              <Label htmlFor="message" className="text-base font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Message pour l'acheteur
              </Label>
              <Textarea
                id="message"
                placeholder="Expliquez les raisons de votre contre-offre... (Ex: Prix du marché, travaux nécessaires, valeur du terrain...)"
                value={counterOffer.message}
                onChange={(e) => setCounterOffer({...counterOffer, message: e.target.value})}
                rows={4}
                className="resize-none border-2 focus:border-blue-500"
              />
            </div>
            
            {/* Conditions */}
            <div className="bg-white border rounded-xl p-4 space-y-3">
              <Label htmlFor="conditions" className="text-base font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Conditions particulières (optionnel)
              </Label>
              <Textarea
                id="conditions"
                placeholder="Ex: Paiement comptant uniquement, délai de libération 30 jours, réparations à la charge de l'acheteur..."
                value={counterOffer.conditions}
                onChange={(e) => setCounterOffer({...counterOffer, conditions: e.target.value})}
                rows={3}
                className="resize-none border-2 focus:border-blue-500"
              />
            </div>
            
            {/* Validité */}
            <div className="bg-white border rounded-xl p-4 space-y-3">
              <Label htmlFor="valid_until" className="text-base font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Valable jusqu'au
              </Label>
              <Input
                id="valid_until"
                type="date"
                value={counterOffer.valid_until}
                onChange={(e) => setCounterOffer({...counterOffer, valid_until: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="h-12 border-2 focus:border-blue-500"
              />
              <p className="text-sm text-slate-600">
                L'acheteur aura jusqu'à cette date pour accepter ou refuser votre offre
              </p>
            </div>
          </div>
          
          {/* Avertissement */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-900">
              <strong>⚠️ Important:</strong> Une fois envoyée, votre contre-offre sera notifiée à l'acheteur. 
              Vous pourrez suivre l'évolution de la négociation dans l'historique du dossier.
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={handleSubmit} 
            className="flex-1 h-12 text-base bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            disabled={isSubmitting || !counterOffer.new_price || counterOffer.new_price <= 0}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5 mr-2" />
                Envoyer la contre-offre
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="h-12 px-8 border-2"
            disabled={isSubmitting}
          >
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NegotiationModal;
