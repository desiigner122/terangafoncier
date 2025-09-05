
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ParcelImageGallery from '@/components/parcel-detail/ParcelImageGallery';
import ParcelHeaderSection from '@/components/parcel-detail/ParcelHeaderSection';
import ParcelDescriptionCard from '@/components/parcel-detail/ParcelDescriptionCard';
import ParcelLocationCard from '@/components/parcel-detail/ParcelLocationCard';
import ParcelActionsCard from '@/components/parcel-detail/ParcelActionsCard';
import SimilarParcels from '@/components/parcel-detail/SimilarParcels';
import ParcelDetailSkeleton from '@/components/parcel-detail/ParcelDetailSkeleton';
import ParcelFeeCalculator from '@/components/parcel-detail/ParcelFeeCalculator';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { 
  Home, 
  MapPin, 
  School, 
  ShoppingCart, 
  Hotel as Hospital, 
  Users, 
  Shield, 
  User, 
  Award, 
  FileText, 
  Landmark, 
  PercentSquare
} from 'lucide-react';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/SupabaseAuthContext';
import { useContext } from 'react';
import { ComparisonContext } from '@/context/ComparisonContext';
import { Helmet } from 'react-helmet-async';
import InstallmentPaymentModal from '@/components/parcel-detail/InstallmentPaymentModal';
import { supabase } from '@/lib/customSupabaseClient';

const ParcelFileTextsCard = ({ FileTexts }) => {
  if (!FileTexts || typeof FileTexts !== 'object' || Object.keys(FileTexts).length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>FileTexts</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">Aucun FileText disponible.</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle>FileTexts Disponibles</CardTitle></CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {Object.entries(FileTexts).map(([key, url]) => (
            <li key={key} className="flex items-center justify-between text-sm">
              <span className="flex items-center font-medium capitalize">
                <FileText className="h-4 w-4 mr-2" />
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <Button asChild variant="link" size="sm">
                <a href={url} target="_blank" rel="noopener noreferrer">Voir</a>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const ParcelDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // toast remplacÃ© par window.safeGlobalToast
  const { user, profile } = useAuth();
  const { comparisonList, addToCompare, removeFromCompare } = useContext(ComparisonContext);
  
  const [parcel, setParcel] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const isParcelInCompare = comparisonList.includes(id);

  useEffect(() => {
    const fetchParcelData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const { data: parcelData, error: parcelError } = await supabase
          .from('parcels')
          .select('*')
          .eq('id', id)
          .single();

        if (parcelError || !parcelData) {
          throw new Error("Parcelle non trouvée ou indisponible.");
        }

        setParcel(parcelData);

        if (parcelData.seller_id) {
          const { data: sellerData, error: sellerError } = await supabase
               .from('users')
            .select('*')
            .eq('id', parcelData.seller_id)
            .single();
          
          if (sellerError) {
            console.warn("Could not fetch seller details:", sellerError.message);
            setSeller({ full_name: 'Vendeur Inconnu', verification_status: 'unverified' });
          } else {
            setSeller(sellerData);
          }
        }
      } catch (err) {
        setError(err.message);
        window.safeGlobalToast({
          title: "Erreur",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchParcelData();
  }, [id, toast]);

  useEffect(() => {
    if (profile && parcel) {
      setIsFavorite(profile.favorites?.includes(parcel.id));
    }
  }, [profile, parcel]);

  const handleAction = (message, details) => {
    window.safeGlobalToast({
      title: "Action Simulée",
      description: message,
    });
    if (details?.action === 'initiateBuy') {
       navigate('/messaging', { state: { parcelId: parcel.id, parcelName: parcel.name, contactUser: parcel.seller_id }});
    }
  };

  const handleCompareChange = (checked) => {
     if(checked) {
       addToCompare(id);
        window.safeGlobalToast({ title: 'Ajouté au comparateur', description: `"${parcel.name}" a été ajouté.` });
     } else {
       removeFromCompare(id);
        window.safeGlobalToast({ title: 'Retiré du comparateur', description: `"${parcel.name}" a été retiré.` });
     }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    window.safeGlobalToast({
      title: "Lien Copié!",
      description: "Le lien de la parcelle a été copié dans le presse-papiers.",
    });
  };

  const handleToggleFavorite = async () => {
    if (!profile) {
      window.safeGlobalToast({ title: "Connectez-vous", description: "Vous devez être connecté pour gérer vos favoris.", variant: "destructive" });
      return;
    }
    const newFavorites = isFavorite 
      ? profile.favorites.filter(favId => favId !== parcel.id)
      : [...(profile.favorites || []), parcel.id];

    const { error: updateError } = await supabase
  .from('users')
      .update({ favorites: newFavorites })
      .eq('id', profile.id);

    if (updateError) {
      window.safeGlobalToast({ title: "Erreur", description: "Impossible de mettre à jour les favoris.", variant: "destructive" });
    } else {
      setIsFavorite(!isFavorite);
      window.safeGlobalToast({ title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris" });
    }
  };

  const nearbyPointsOfInterest = [
    { icon: School, name: "École Primaire", distance: "500m" },
    { icon: ShoppingCart, name: "Marché Local", distance: "1.2km" },
    { icon: Hospital, name: "Centre de Santé", distance: "2km" },
    { icon: MapPin, name: "Arrêt de Bus", distance: "300m" },
  ];

  const servicePacks = [
      { icon: Users, title: "Pack Diaspora", description: "Mandataire de confiance pour visites, démarches et signatures.", link: "/contact?subject=Pack+Diaspora" },
      { icon: Shield, title: "Pack Sécurité Juridique", description: "Accompagnement complet par un notaire partenaire, de A à Z.", link: "/contact?subject=Pack+Securite" },
  ];

  if (loading) return <div className="container mx-auto py-8 px-2 sm:px-4"><ParcelDetailSkeleton /></div>;
  if (error) return (
    <div className="container mx-auto py-10 text-center">
      <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
      <Link to="/parcelles" className="text-primary hover:underline mt-4 inline-block">Retourner à la liste des parcelles</Link>
    </div>
  );
  if (!parcel) return null;

  const isMunicipal = parcel.owner_type === 'Mairie';

  return (
    <>
    <Helmet>
        <title>{`${parcel.name} - ${parcel.zone}`} | Teranga Foncier</title>
        <meta name="description" content={`Détails pour la parcelle ${parcel.name} de ${parcel.area_sqm} m² située à ${parcel.zone}.`} />
        <meta property="og:title" content={`${parcel.name} | Teranga Foncier`} />
        <meta property="og:description" content={parcel.description} />
        <meta property="og:image" content={parcel.images ? parcel.images[0] : "https://images.unsplash.com/photo-1542364041-2cada653f4ee"} />
        <link rel="canonical" href={`https://www.terangafoncier.com/parcelles/${parcel.id}`} />
    </Helmet>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-muted/30"
    >
      <div className="container mx-auto py-8 px-2 sm:px-4">
        <ParcelHeaderSection 
          parcel={parcel}
          isFavorite={isFavorite}
          isParcelInCompare={isParcelInCompare}
          user={user}
          onToggleFavorite={handleToggleFavorite}
          onShare={handleShare}
          onCompareChange={handleCompareChange}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <ParcelImageGallery images={parcel.images || []} parcelName={parcel.name} parcelId={parcel.id} />
            
            {seller && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            {isMunicipal ? <Landmark className="h-5 w-5 mr-2 text-primary"/> : <Award className="h-5 w-5 mr-2 text-primary"/>}
                            {isMunicipal ? 'Information sur la Commune' : 'Vendeur & Confiance'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-4">
                        {isMunicipal ? <Landmark className="h-8 w-8 text-muted-foreground"/> : <User className="h-8 w-8 text-muted-foreground"/>}
                        <div>
                            <p className="font-semibold">{seller.full_name}</p>
                            {!isMunicipal && (
                                <Badge variant={seller.verification_status === 'verified' ? 'success' : 'secondary'}>
                                    {seller.verification_status === 'verified' ? "Vendeur Certifié" : "Vérification en cours"}
                                </Badge>
                            )}
                             {isMunicipal && (
                                <Badge variant="success">Partenaire Officiel</Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <ParcelDescriptionCard description={parcel.description} />
            
            {isMunicipal && parcel.attribution_conditions && (
                <Card>
                    <CardHeader><CardTitle>Conditions d'Attribution</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{parcel.attribution_conditions}</p></CardContent>
                </Card>
            )}

            {parcel.is_eligible_for_installments && !isMunicipal && (
                <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                    <CardHeader>
                        <CardTitle className="flex items-center text-blue-800 dark:text-blue-300"><PercentSquare className="mr-2"/>Financement Disponible</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-blue-700 dark:text-blue-400 mb-4">Ce terrain est éligible au paiement échelonné via nos banques partenaires. Simulez votre crédit et faites une demande en quelques clics.</p>
                        <Button onClick={() => setIsInstallmentModalOpen(true)}>Simuler et Demander un Financement</Button>
                    </CardContent>
                </Card>
            )}

            {!isMunicipal && <ParcelFileTextsCard FileTexts={parcel.FileTexts} />}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-card p-6 rounded-lg shadow border"
            >
              <h3 className="text-xl font-semibold mb-4 text-primary flex items-center">
                <MapPin className="mr-2 h-5 w-5" /> Points d'Intérêt à Proximité
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {nearbyPointsOfInterest.map((poi, index) => (
                  <div key={index} className="flex flex-col items-center text-center p-3 bg-muted/50 rounded-md border border-dashed">
                    <poi.icon className="h-7 w-7 mb-1.5 text-primary/80" />
                    <p className="text-xs font-medium text-foreground">{poi.name}</p>
                    <p className="text-xs text-muted-foreground">{poi.distance}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <ParcelLocationCard coordinates={parcel.coordinates} locationName={parcel.name} />
          </div>

          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24 self-start">
             <ParcelActionsCard 
                parcel={parcel}
                onRequestInfo={() => handleAction(`Demande d'information pour ${parcel.name}.`)}
                onInitiateBuy={() => handleAction(`Initiation de la procédure d'achat pour ${parcel.name}.`, { action: 'initiateBuy' })}
                onRequestVisit={() => handleAction(`Demande de visite pour ${parcel.name}.`)}
            />
            {!isMunicipal && <ParcelFeeCalculator price={parcel.price} />}
             <Card>
                <CardHeader>
                    <CardTitle>Services d'Accompagnement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {servicePacks.map(pack => (
                        <div key={pack.title} className="flex items-start">
                            <pack.icon className="h-8 w-8 mr-3 text-primary flex-shrink-0 mt-1"/>
                            <div>
                                <h4 className="font-semibold">{pack.title}</h4>
                                <p className="text-sm text-muted-foreground">{pack.description}</p>
                                <Button asChild variant="link" size="sm" className="p-0 h-auto">
                                    <Link to={pack.link}>En savoir plus</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <SimilarParcels currentParcelId={parcel.id} currentParcelZone={parcel.zone} />
        </div>
        
        <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
                <Link to="/parcelles"><Home className="mr-2 h-5 w-5"/> Retour à toutes les parcelles</Link>
            </Button>
        </div>
      </div>
    </motion.div>
    {parcel.is_eligible_for_installments && !isMunicipal && (
        <InstallmentPaymentModal
          isOpen={isInstallmentModalOpen}
          onClose={() => setIsInstallmentModalOpen(false)}
          parcelPrice={parcel.price}
          parcelName={parcel.name}
        />
      )}
    </>
  );
};

export default ParcelDetailPage;

