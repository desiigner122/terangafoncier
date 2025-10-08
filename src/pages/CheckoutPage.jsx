import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/spinner';
import {
  ShoppingCart,
  CreditCard,
  Calendar,
  Building2,
  Check,
  ArrowLeft,
  FileText,
  Shield,
  AlertCircle
} from 'lucide-react';

const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [parcel, setParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('one-time');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    address: '',
    message: ''
  });

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const { data, error } = await supabase
          .from('parcels')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data.status !== 'available') {
          window.safeGlobalToast({
            title: 'Terrain indisponible',
            description: 'Ce terrain n\'est plus disponible à la vente.',
            variant: 'destructive'
          });
          navigate(`/dashboard/parcelles/${id}`);
          return;
        }

        setParcel(data);
        
        // Pré-remplir avec les données de l'utilisateur
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, phone, email')
            .eq('id', user.id)
            .single();
          
          if (profile) {
            setFormData(prev => ({
              ...prev,
              full_name: profile.full_name || '',
              phone: profile.phone || '',
              email: profile.email || user.email || ''
            }));
          }
        }
      } catch (error) {
        console.error('Erreur chargement terrain:', error);
        window.safeGlobalToast({
          title: 'Erreur',
          description: 'Impossible de charger le terrain.',
          variant: 'destructive'
        });
        navigate('/parcelles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcel();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      window.safeGlobalToast({
        title: 'Conditions requises',
        description: 'Vous devez accepter les conditions générales.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer la transaction
      const transactionData = {
        buyer_id: user.id,
        seller_id: parcel.seller_id,
        parcel_id: parcel.id,
        amount: parcel.price,
        payment_method: paymentMethod,
        status: 'pending',
        buyer_info: formData,
        transaction_type: 'purchase',
        created_at: new Date().toISOString()
      };

      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Créer une notification pour le vendeur
      await supabase
        .from('notifications')
        .insert([{
          user_id: parcel.seller_id,
          type: 'new_offer',
          title: 'Nouvelle offre d\'achat',
          message: `${formData.full_name} est intéressé par votre terrain "${parcel.name}"`,
          related_id: transaction.id,
          read: false
        }]);

      // Mettre à jour le statut du terrain si paiement immédiat
      if (paymentMethod === 'one-time') {
        await supabase
          .from('parcels')
          .update({ status: 'reserved' })
          .eq('id', id);
      }

      window.safeGlobalToast({
        title: 'Demande envoyée !',
        description: 'Votre demande d\'achat a été transmise au vendeur. Vous serez contacté sous 48h.'
      });

      // Rediriger vers la page de transaction
      navigate(`/dashboard/acheteur/transaction-history`);

    } catch (error) {
      console.error('Erreur création transaction:', error);
      window.safeGlobalToast({
        title: 'Erreur',
        description: 'Impossible de finaliser votre demande. Réessayez.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!parcel) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(`/dashboard/parcelles/${id}`)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au terrain
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de commande */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Finaliser votre achat
              </CardTitle>
              <CardDescription>
                Complétez vos informations pour initier la procédure d'achat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations personnelles */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Informations de contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Nom complet *</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Moussa Diallo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="Ex: +221 77 123 45 67"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="ex@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Adresse actuelle *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Dakar, Plateau"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message au vendeur (optionnel)</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Parlez de votre projet, posez vos questions..."
                      rows={4}
                    />
                  </div>
                </div>

                <Separator />

                {/* Mode de paiement */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Mode de paiement
                  </h3>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 border p-4 rounded-lg">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <Label htmlFor="one-time" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Paiement comptant</div>
                        <div className="text-sm text-gray-600">
                          Paiement intégral immédiat
                        </div>
                      </Label>
                    </div>
                    {parcel.is_eligible_for_installments && (
                      <div className="flex items-center space-x-2 border p-4 rounded-lg">
                        <RadioGroupItem value="installments" id="installments" />
                        <Label htmlFor="installments" className="flex-1 cursor-pointer">
                          <div className="font-semibold flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Paiement échelonné
                          </div>
                          <div className="text-sm text-gray-600">
                            Jusqu'à 36 mois via nos partenaires bancaires
                          </div>
                        </Label>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 border p-4 rounded-lg">
                      <RadioGroupItem value="bank-financing" id="bank-financing" />
                      <Label htmlFor="bank-financing" className="flex-1 cursor-pointer">
                        <div className="font-semibold flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Financement bancaire
                        </div>
                        <div className="text-sm text-gray-600">
                          Demande de crédit immobilier
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                {/* Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3 border p-4 rounded-lg bg-blue-50">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-2">Transaction sécurisée</p>
                      <ul className="space-y-1 text-xs">
                        <li>✓ Vérification juridique incluse</li>
                        <li>✓ Paiement sécurisé via escrow</li>
                        <li>✓ Accompagnement notarial</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={setAcceptedTerms}
                    />
                    <Label htmlFor="terms" className="text-sm cursor-pointer">
                      J'accepte les{' '}
                      <Link to="/conditions" className="text-blue-600 hover:underline">
                        conditions générales d'utilisation
                      </Link>{' '}
                      et la{' '}
                      <Link to="/privacy" className="text-blue-600 hover:underline">
                        politique de confidentialité
                      </Link>
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || !acceptedTerms}
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Confirmer la demande d'achat
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Récapitulatif */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{parcel.name}</h4>
                <p className="text-sm text-gray-600">{parcel.commune}, {parcel.region}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Superficie</span>
                  <span className="font-semibold">{parcel.area_sqm} m²</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type</span>
                  <span className="font-semibold">{parcel.type}</span>
                </div>
                {parcel.titre_foncier && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Titre foncier</span>
                    <span className="font-semibold text-green-600">Oui</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-semibold">Prix total</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(parcel.price)}
                  </span>
                </div>
                {paymentMethod === 'installments' && (
                  <div className="text-xs text-gray-600 mt-2">
                    * Soit environ {formatPrice(parcel.price / 36)} /mois sur 36 mois
                  </div>
                )}
              </div>

              <Separator />

              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    Cette demande ne constitue pas un engagement d'achat définitif. 
                    Le vendeur vous contactera pour finaliser la transaction.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
