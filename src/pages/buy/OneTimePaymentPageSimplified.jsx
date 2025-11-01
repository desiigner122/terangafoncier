import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Send, 
  Home, 
  AlertCircle, 
  CheckCircle, 
  MapPin,
  Maximize,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

/**
 * Page simplifiée de demande d'achat - One Time Payment
 * 
 * Cette page permet à l'acheteur de :
 * 1. Voir le terrain sélectionné
 * 2. Proposer un prix d'achat (négociation)
 * 3. Ajouter un message au vendeur
 * 4. Soumettre sa demande
 * 
 * LES FRAIS ET PAIEMENTS SERONT DEMANDÉS PLUS TARD dans le workflow après acceptation
 */
const OneTimePaymentPageSimplified = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const context = state || {};
  const parcelle = context.parcelle || {};
  const marketPrice = parcelle.price || 0;

  // États
  const [offeredPrice, setOfferedPrice] = useState(marketPrice.toString());
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Validation
  const isValid = () => {
    if (!offeredPrice || parseInt(offeredPrice.replace(/\D/g, '')) === 0) {
      toast.error('Veuillez proposer un prix');
      return false;
    }
    if (!user?.id) {
      toast.error('Vous devez être connecté');
      return false;
    }
    if (!context.parcelleId) {
      toast.error('Aucune parcelle sélectionnée');
      return false;
    }
    return true;
  };

  // Soumission de la demande
  const handleSubmitOffer = async () => {
    if (!isValid()) return;

    try {
      setSubmitting(true);

      const offeredPriceInt = parseInt(offeredPrice.replace(/\D/g, ''), 10);

      // 1. Créer la demande dans 'requests'
      const { data: request, error: requestError } = await supabase
        .from('requests')
        .insert({
          user_id: user.id,
          type: 'one_time',
          status: 'pending',
          parcel_id: context.parcelleId,
          offered_price: offeredPriceInt,
          message: message || 'Je suis intéressé par cette propriété.',
          metadata: {
            market_price: marketPrice,
            parcelle_info: {
              title: parcelle.title,
              location: parcelle.location,
              surface: parcelle.surface
            },
            payment_type: 'one_time'
          }
        })
        .select()
        .single();

      if (requestError) throw requestError;

      console.log('✅ Demande créée:', request);

      // 2. Récupérer le vendeur et notifier
      const { data: parcelData } = await supabase
        .from('parcels')
        .select('seller_id')
        .eq('id', context.parcelleId)
        .single();

      if (parcelData?.seller_id) {
        await supabase.from('notifications').insert({
          user_id: parcelData.seller_id,
          type: 'new_purchase_request',
          title: 'Nouvelle demande d\'achat',
          message: `${profile?.full_name || user.email} propose ${offeredPriceInt.toLocaleString()} FCFA pour ${parcelle.title || 'votre propriété'}`,
          link: `/vendeur/demandes`,
          metadata: {
            request_id: request.id,
            buyer_id: user.id,
            buyer_name: profile?.full_name || user.email,
            offered_price: offeredPriceInt,
            parcel_id: context.parcelleId,
            parcel_title: parcelle.title
          }
        });

        console.log('✅ Vendeur notifié');
      }

      // 3. Créer une transaction de suivi
      await supabase.from('transactions').insert({
        user_id: user.id,
        buyer_id: user.id,
        seller_id: parcelData?.seller_id,
        parcel_id: context.parcelleId,
        request_id: request.id,
        transaction_type: 'purchase',
        status: 'pending',
        amount: offeredPriceInt,
        description: `Demande d'achat pour ${parcelle.title || 'terrain'}`,
        metadata: {
          type: 'purchase_request',
          payment_method: 'one_time'
        }
      });

      // 4. Succès !
      toast.success('Demande envoyée avec succès !', {
        description: 'Le vendeur sera notifié et pourra répondre à votre offre.',
        duration: 5000
      });

      // Rediriger vers la page de suivi des achats
      setTimeout(() => {
        navigate('/acheteur/mes-achats');
      }, 2000);

    } catch (error) {
      console.error('❌ Erreur soumission:', error);
      toast.error('Erreur lors de l\'envoi', {
        description: error.message || 'Veuillez réessayer'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Calcul de la différence de prix
  const priceDifference = marketPrice - parseInt(offeredPrice.replace(/\D/g, '') || '0');
  const percentageDiff = marketPrice > 0 ? ((priceDifference / marketPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header avec retour */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <span>/</span>
            <Link to="/acheteur" className="hover:text-blue-600">Dashboard</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Demande d'achat</span>
          </div>
          <Link 
            to={`/parcelle/${context.parcelleId}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à la parcelle
          </Link>
        </div>

        {/* Titre principal */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Faire une demande d'achat
          </h1>
          <p className="text-gray-600">
            Proposez votre offre au vendeur et commencez la négociation
          </p>
        </div>

        {/* Info workflow */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Comment ça marche ?</strong>
            <ol className="mt-2 space-y-1 text-sm list-decimal list-inside">
              <li>Vous soumettez votre offre au vendeur</li>
              <li>Le vendeur accepte ou propose un contre-prix</li>
              <li>Une fois d'accord, un dossier d'achat est créé</li>
              <li>Les paiements et frais seront demandés étape par étape</li>
            </ol>
          </AlertDescription>
        </Alert>

        {/* Carte principale - Informations terrain */}
        <Card className="border-2 border-blue-200 bg-white shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Home className="h-6 w-6" />
              Propriété Sélectionnée
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Titre terrain */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {parcelle.title || 'Terrain'}
              </h2>
            </div>

            {/* Détails */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {parcelle.location && (
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span>{parcelle.location}</span>
                </div>
              )}
              {parcelle.surface && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Maximize className="h-5 w-5 text-green-600" />
                  <span>{parcelle.surface} m²</span>
                </div>
              )}
              {marketPrice > 0 && (
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">{marketPrice.toLocaleString()} FCFA</span>
                </div>
              )}
            </div>

            {/* Prix du marché */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Prix affiché par le vendeur:</span>
                <span className="text-2xl font-bold text-gray-900">
                  {marketPrice.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire d'offre */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Votre Offre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Prix proposé */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix que vous proposez (FCFA) *
              </label>
              <Input
                type="text"
                value={offeredPrice.toLocaleString()}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setOfferedPrice(value);
                }}
                placeholder="Votre offre en FCFA"
                className="text-lg font-semibold"
              />
              
              {/* Indication négociation */}
              {priceDifference !== 0 && (
                <div className={`mt-2 text-sm ${priceDifference > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {priceDifference > 0 ? (
                    <>
                      ✓ Vous proposez {Math.abs(priceDifference).toLocaleString()} FCFA de moins ({Math.abs(percentageDiff).toFixed(1)}% de réduction)
                    </>
                  ) : (
                    <>
                      ⚠ Vous proposez {Math.abs(priceDifference).toLocaleString()} FCFA de plus ({Math.abs(percentageDiff).toFixed(1)}% au-dessus du prix)
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Message au vendeur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message au vendeur (optionnel)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Bonjour, je suis très intéressé par votre propriété..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Présentez-vous et expliquez pourquoi vous êtes intéressé
              </p>
            </div>

            {/* Info acheteur */}
            {user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <CheckCircle className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">
                      {profile?.full_name || profile?.name || 'Acheteur'}
                    </div>
                    <div className="text-sm">{user.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Bouton de soumission */}
            <Button
              onClick={handleSubmitOffer}
              disabled={submitting || !offeredPrice}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg shadow-lg"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer ma demande d'achat
                </>
              )}
            </Button>

            {/* Note importante */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs text-gray-600">
                <strong>Important :</strong> En soumettant cette demande, vous ne vous engagez à rien. 
                Le vendeur pourra accepter, refuser ou négocier. Les frais et paiements seront demandés 
                plus tard si vous êtes tous les deux d'accord.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default OneTimePaymentPageSimplified;
