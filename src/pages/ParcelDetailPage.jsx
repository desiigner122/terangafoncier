import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/spinner';
import {
  MapPin,
  Home,
  DollarSign,
  Ruler,
  FileText,
  Calendar,
  CheckCircle,
  User,
  Phone,
  Mail,
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  MapPinned,
  Building,
  Image as ImageIcon
} from 'lucide-react';

const ParcelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [parcel, setParcel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const { data, error } = await supabase
          .from('parcels')
          .select(`
            *,
            profiles:seller_id (
              full_name,
              phone,
              email
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setParcel(data);
      } catch (error) {
        console.error('Erreur chargement terrain:', error);
        window.safeGlobalToast({
          title: 'Erreur',
          description: 'Impossible de charger les détails du terrain.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcel();
  }, [id]);

  const handleBuyNow = () => {
    if (!user) {
      window.safeGlobalToast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour initier un achat.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }
    
    // Redirection vers page de checkout
    navigate(`/dashboard/parcelles/${id}/checkout`);
  };

  const handleContactSeller = () => {
    if (!user) {
      window.safeGlobalToast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour contacter le vendeur.',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }
    
    navigate('/dashboard/messaging', { state: { recipientId: parcel.seller_id } });
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      window.safeGlobalToast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour ajouter aux favoris.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, parcel_id: id }]);

      if (error) throw error;

      window.safeGlobalToast({
        title: 'Ajouté aux favoris',
        description: 'Ce terrain a été ajouté à vos favoris.'
      });
    } catch (error) {
      window.safeGlobalToast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter aux favoris.',
        variant: 'destructive'
      });
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Prix sur demande';
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

  if (!parcel) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Terrain introuvable</h2>
        <p className="text-gray-600 mb-6">Ce terrain n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate('/parcelles')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux annonces
        </Button>
      </div>
    );
  }

  const images = parcel.images || [];
  const hasImages = images.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 px-4"
    >
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Accueil</Link>
        <span>/</span>
        <Link to="/parcelles" className="hover:text-blue-600">Parcelles</Link>
        <span>/</span>
        <span className="text-gray-900">{parcel.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images & Détails principaux */}
        <div className="lg:col-span-2 space-y-6">
          {/* Galerie photos */}
          <Card>
            <CardContent className="p-0">
              {hasImages ? (
                <div className="relative">
                  <img
                    src={images[currentImageIndex]}
                    alt={parcel.name}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
              {hasImages && images.length > 1 && (
                <div className="p-4 grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${parcel.name} - ${index + 1}`}
                      onClick={() => setCurrentImageIndex(index)}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Titre et infos */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{parcel.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {parcel.commune}, {parcel.department}, {parcel.region}
                  </CardDescription>
                </div>
                <Badge variant={parcel.status === 'available' ? 'success' : 'secondary'}>
                  {parcel.status === 'available' ? 'Disponible' : parcel.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-blue-600">
                {formatPrice(parcel.price)}
              </div>
              
              <Separator />

              {/* Caractéristiques */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Superficie</p>
                    <p className="font-semibold">{parcel.area_sqm} m²</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold">{parcel.type}</p>
                  </div>
                </div>
                {parcel.titre_foncier && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Titre Foncier</p>
                      <p className="font-semibold">Oui</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Publié le</p>
                    <p className="font-semibold">
                      {new Date(parcel.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{parcel.description}</p>
              </div>

              {parcel.is_eligible_for_installments && (
                <>
                  <Separator />
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <CheckCircle className="h-5 w-5" />
                      <p className="font-semibold">Éligible au paiement échelonné</p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Ce terrain peut être acheté avec un plan de paiement sur plusieurs mois via nos partenaires bancaires.
                    </p>
                  </div>
                </>
              )}

              {/* Localisation */}
              {parcel.address && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <MapPinned className="h-5 w-5" />
                      Adresse
                    </h3>
                    <p className="text-gray-700">{parcel.address}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Actions & Contact */}
        <div className="space-y-6">
          {/* Actions principales */}
          <Card>
            <CardHeader>
              <CardTitle>Intéressé par ce terrain ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleBuyNow}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Acheter maintenant
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleContactSeller}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contacter le vendeur
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddToFavorites}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Favoris
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info vendeur */}
          {parcel.profiles && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendeur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{parcel.profiles.full_name || 'Vendeur'}</p>
                    <p className="text-sm text-gray-600">{parcel.owner_type}</p>
                  </div>
                </div>
                {parcel.profiles.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{parcel.profiles.email}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Achat sécurisé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <p>Vérification des documents par nos experts</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <p>Paiement sécurisé via escrow</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <p>Support juridique inclus</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default ParcelDetailPage;
