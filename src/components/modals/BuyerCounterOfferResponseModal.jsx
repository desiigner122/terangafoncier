/**
 * Modal de réponse de l'acheteur à une contre-offre du vendeur
 * Permet d'accepter, refuser, ou faire une nouvelle contre-offre
 */
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight
} from 'lucide-react';

const BuyerCounterOfferResponseModal = ({ 
  request, 
  negotiation, 
  isOpen, 
  onClose, 
  onAccept, 
  onReject, 
  onCounter,
  isSubmitting = false 
}) => {
  const [activeTab, setActiveTab] = useState('accept');
  const [rejectReason, setRejectReason] = useState('');
  const [counterOffer, setCounterOffer] = useState({
    new_price: negotiation?.proposed_price || 0,
    message: ''
  });

  if (!negotiation || !request) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XOF', 'FCFA');
  };

  const handleAccept = () => {
    onAccept(negotiation.id);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      return;
    }
    onReject(negotiation.id, rejectReason);
  };

  const handleCounter = () => {
    if (!counterOffer.new_price || counterOffer.new_price <= 0) {
      return;
    }
    onCounter(negotiation.id, counterOffer);
  };

  const priceDifference = negotiation.proposed_price - negotiation.original_price;
  const percentDifference = ((priceDifference / negotiation.original_price) * 100).toFixed(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            Répondre à la contre-offre
          </DialogTitle>
          <DialogDescription>
            Le vendeur a proposé une contre-offre pour <strong>{request?.property?.title || 'la propriété'}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Comparaison des prix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Votre offre initiale */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Votre offre</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(negotiation.original_price)}
              </p>
            </div>

            {/* Différence */}
            <div className={`border-2 rounded-xl p-4 ${
              priceDifference > 0 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <ArrowLeftRight className={`w-5 h-5 ${priceDifference > 0 ? 'text-red-600' : 'text-green-600'}`} />
                <p className={`text-sm font-medium ${priceDifference > 0 ? 'text-red-900' : 'text-green-900'}`}>
                  Différence
                </p>
              </div>
              <p className={`text-2xl font-bold ${priceDifference > 0 ? 'text-red-700' : 'text-green-700'}`}>
                {priceDifference > 0 ? '+' : ''}{formatCurrency(Math.abs(priceDifference))}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {priceDifference > 0 ? '+' : ''}{percentDifference}%
              </p>
            </div>

            {/* Contre-offre vendeur */}
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <p className="text-sm font-medium text-purple-900">Contre-offre vendeur</p>
              </div>
              <p className="text-2xl font-bold text-purple-700">
                {formatCurrency(negotiation.proposed_price)}
              </p>
            </div>
          </div>

          {/* Message du vendeur */}
          {negotiation.offer_message && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Message du vendeur :</p>
              <p className="text-gray-900 italic">"{negotiation.offer_message}"</p>
            </div>
          )}

          {/* Onglets de réponse */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="accept" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                <CheckCircle className="w-4 h-4 mr-2" />
                Accepter
              </TabsTrigger>
              <TabsTrigger value="reject" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                <XCircle className="w-4 h-4 mr-2" />
                Refuser
              </TabsTrigger>
              <TabsTrigger value="counter" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contre-offre
              </TabsTrigger>
            </TabsList>

            {/* Tab Accepter */}
            <TabsContent value="accept" className="space-y-4">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-emerald-900 mb-2">
                  Accepter la contre-offre
                </h3>
                <p className="text-gray-700 mb-4">
                  Vous acceptez d'acheter la propriété au prix de <strong>{formatCurrency(negotiation.proposed_price)}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Un dossier d'achat sera créé et le vendeur sera notifié de votre acceptation.
                  Vous pourrez ensuite suivre l'avancement du processus.
                </p>
                <Button
                  className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12"
                  onClick={handleAccept}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirmer l'acceptation
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Tab Refuser */}
            <TabsContent value="reject" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reject_reason" className="text-base font-semibold">
                    Raison du refus (obligatoire)
                  </Label>
                  <Textarea
                    id="reject_reason"
                    placeholder="Expliquez pourquoi vous refusez cette contre-offre..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                    className="mt-2"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Le vendeur recevra votre message. Soyez courtois et professionnel.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  className="w-full h-12"
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectReason.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Refuser la contre-offre
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Tab Contre-offre */}
            <TabsContent value="counter" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <Label htmlFor="counter_price" className="text-base font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Votre nouvelle offre (FCFA) *
                  </Label>
                  <Input 
                    id="counter_price"
                    type="number"
                    step="10000"
                    min="0"
                    placeholder="Ex: 27000000"
                    value={counterOffer.new_price}
                    onChange={(e) => setCounterOffer({
                      ...counterOffer, 
                      new_price: parseInt(e.target.value) || 0
                    })}
                    className="text-lg h-12 mt-2 border-2 focus:border-purple-500"
                    required
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                    <span>Prix vendeur : {formatCurrency(negotiation.proposed_price)}</span>
                    <span>Votre offre initiale : {formatCurrency(negotiation.original_price)}</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="counter_message" className="text-base font-semibold">
                    Message pour le vendeur
                  </Label>
                  <Textarea
                    id="counter_message"
                    placeholder="Expliquez votre nouvelle proposition..."
                    value={counterOffer.message}
                    onChange={(e) => setCounterOffer({
                      ...counterOffer, 
                      message: e.target.value
                    })}
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <Button
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700"
                  onClick={handleCounter}
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
                      Envoyer ma contre-offre
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Bouton Annuler */}
          <div className="flex justify-center pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-8"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuyerCounterOfferResponseModal;
