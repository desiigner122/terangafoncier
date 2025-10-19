import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard,
  Calendar,
  Banknote,
  Bitcoin,
  MessageSquare,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const MakeOfferModal = ({ property, open, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    offer_price: property?.price ? Math.round(property.price * 0.95) : 0,
    financing_method: 'direct',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!user) {
      toast.error('Vous devez être connecté pour faire une offre');
      return;
    }

    if (!formData.offer_price || formData.offer_price <= 0) {
      toast.error('Le montant de l\'offre doit être supérieur à 0');
      return;
    }

    setLoading(true);

    try {
      console.log('📝 [OFFER] Création offre:', {
        property_id: property.id,
        buyer_id: user.id,
        offer_price: formData.offer_price,
        financing_method: formData.financing_method,
        message: formData.message
      });

      // 1. Créer l'offre dans purchase_requests (light version)
      const { data: offer, error: offerError } = await supabase
        .from('purchase_requests')
        .insert([
          {
            property_id: property.id,
            buyer_id: user.id,
            offer_price: formData.offer_price,
            financing_method: formData.financing_method,
            proposed_terms: formData.message,
            status: 'pending',
            urgency: 'medium',
            notes: `Offre initiale - Méthode: ${formData.financing_method}`
          }
        ])
        .select()
        .single();

      if (offerError) {
        console.error('❌ Erreur création offre:', offerError);
        throw offerError;
      }

      console.log('✅ Offre créée:', offer);

      // 2. Créer notification pour le vendeur
      const { error: notifError } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: property.owner_id,
            type: 'new_offer',
            title: 'Nouvelle offre d\'achat',
            message: `Offre de ${formData.offer_price.toLocaleString('fr-FR')} FCFA pour ${property.title}`,
            action_url: `/vendeur/purchase-requests/${offer.id}`,
            metadata: {
              offer_id: offer.id,
              property_id: property.id,
              buyer_id: user.id,
              offer_price: formData.offer_price,
              financing_method: formData.financing_method
            }
          }
        ]);

      if (notifError) {
        console.warn('⚠️ Erreur création notification (non-bloquant):', notifError);
        // On continue même si la notification échoue
      }

      toast.success('✅ Offre envoyée avec succès !');
      console.log('🎉 Offre créée et notification envoyée');

      // 3. Appeler callback succès avec l'offre créée
      if (onSuccess) {
        onSuccess(offer);
      }

      // 4. Fermer le modal
      onClose();

    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'offre:', error);
      toast.error('Erreur lors de l\'envoi de l\'offre: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return parseInt(price).toLocaleString('fr-FR') + ' FCFA';
  };

  const priceDifference = formData.offer_price - (property?.price || 0);
  const percentageDiff = property?.price ? ((priceDifference / property.price) * 100).toFixed(1) : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="w-6 h-6 text-blue-600" />
            Faire une offre
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Infos propriété */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-lg mb-2">{property?.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{property?.location}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Prix demandé:</span>
                <p className="font-bold text-lg">{formatPrice(property?.price)}</p>
              </div>
              <div>
                <span className="text-gray-600">Surface:</span>
                <p className="font-bold text-lg">{property?.surface} m²</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Montant offre */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-4 space-y-3">
              <Label htmlFor="offer_price" className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Votre offre (FCFA) *
              </Label>
              <Input
                id="offer_price"
                type="number"
                step="10000"
                min="0"
                placeholder="Ex: 25000000"
                value={formData.offer_price}
                onChange={(e) => setFormData({ ...formData, offer_price: parseInt(e.target.value) || 0 })}
                className="text-lg h-12 border-2 focus:border-blue-500"
                required
              />

              {/* Comparaison */}
              <div className="grid grid-cols-2 gap-4 text-sm mt-3 pt-3 border-t">
                <div>
                  <span className="text-gray-600">Votre offre</span>
                  <p className="font-bold text-blue-600">{formatPrice(formData.offer_price)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Différence</span>
                  <p className={`font-bold ${priceDifference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {priceDifference >= 0 ? '+' : ''}{formatPrice(priceDifference)} ({percentageDiff}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Méthode de paiement */}
            <div className="bg-white border-2 border-green-200 rounded-xl p-4 space-y-4">
              <Label className="text-base font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Méthode de paiement *
              </Label>

              <div className="space-y-3">
                {/* Paiement Direct */}
                <div
                  onClick={() => setFormData({ ...formData, financing_method: 'direct' })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.financing_method === 'direct'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="financing"
                        value="direct"
                        checked={formData.financing_method === 'direct'}
                        onChange={(e) => setFormData({ ...formData, financing_method: e.target.value })}
                        className="w-5 h-5"
                      />
                      <div>
                        <div className="font-semibold">Paiement Direct</div>
                        <div className="text-sm text-gray-600">Comptant immédiat</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">-5%</Badge>
                  </div>
                </div>

                {/* Paiement Échelonné */}
                <div
                  onClick={() => setFormData({ ...formData, financing_method: 'installment' })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.financing_method === 'installment'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="financing"
                        value="installment"
                        checked={formData.financing_method === 'installment'}
                        onChange={(e) => setFormData({ ...formData, financing_method: e.target.value })}
                        className="w-5 h-5"
                      />
                      <div>
                        <div className="font-semibold">Paiement Échelonné</div>
                        <div className="text-sm text-gray-600">Jusqu'à 24 mois</div>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">+2%</Badge>
                  </div>
                </div>

                {/* Financement Bancaire */}
                <div
                  onClick={() => setFormData({ ...formData, financing_method: 'bank' })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.financing_method === 'bank'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="financing"
                        value="bank"
                        checked={formData.financing_method === 'bank'}
                        onChange={(e) => setFormData({ ...formData, financing_method: e.target.value })}
                        className="w-5 h-5"
                      />
                      <div>
                        <div className="font-semibold">Financement Bancaire</div>
                        <div className="text-sm text-gray-600">Crédit immobilier partenaire</div>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700">3.5%</Badge>
                  </div>
                </div>

                {/* Paiement Crypto */}
                <div
                  onClick={() => setFormData({ ...formData, financing_method: 'crypto' })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.financing_method === 'crypto'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="financing"
                        value="crypto"
                        checked={formData.financing_method === 'crypto'}
                        onChange={(e) => setFormData({ ...formData, financing_method: e.target.value })}
                        className="w-5 h-5"
                      />
                      <div>
                        <div className="font-semibold">Paiement Crypto</div>
                        <div className="text-sm text-gray-600">Bitcoin, Ethereum, USDT</div>
                      </div>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700">-3%</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-3">
              <Label htmlFor="message" className="text-base font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Message pour le vendeur (optionnel)
              </Label>
              <Textarea
                id="message"
                placeholder="Présentez votre offre, expliquez votre situation... (Ex: Paiement rapide, sérieux, etc.)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="resize-none border-2 focus:border-blue-500"
              />
            </div>

            {/* Info importante - MVP Flow */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <div className="font-semibold mb-1">📋 Votre flux MVP</div>
                  <ul className="space-y-1 text-xs">
                    <li>1️⃣ Vous envoyez cette offre (prix + méthode de paiement)</li>
                    <li>2️⃣ Le vendeur répond (accepte/refuse/négocie)</li>
                    <li>3️⃣ Une fois approuvé, vous complétez les détails de paiement</li>
                    <li>4️⃣ Le géomètre & notaire valident</li>
                    <li>5️⃣ Le paiement est déclenché</li>
                  </ul>
                  <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-blue-700">
                    💡 Vous aurez 7 jours pour confirmer vos détails de paiement après approbation du vendeur
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {loading ? (
                  <>Envoi en cours...</>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Envoyer l'offre
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-12 text-base"
              >
                Annuler
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferModal;
