
import React, { useState, useContext, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Link, useNavigate } from 'react-router-dom';
    import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { Heart, Maximize, MapPin, Layers, ShieldCheck, ShoppingCart, PercentSquare, Landmark, CheckCircle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast-simple';
    import { ComparisonContext } from '@/context/ComparisonContext';
    import InstallmentPaymentModal from '@/components/parcel-detail/InstallmentPaymentModal';
    import { useAuth } from '@/context/SupabaseAuthContext';
    import { supabase } from '@/lib/customSupabaseClient';

    const formatPrice = (price) => {
      if (price === null || price === undefined) return 'Sur demande';
      return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price);
    };

    const getStatusVariant = (status) => {
      switch (status) {
        case 'Disponible': return 'success';
        case 'Réservée': return 'warning';
        case 'Vendue': return 'destructive';
        case 'Attribution sur demande': return 'info';
        default: return 'secondary';
      }
    };

    const ParcelCard = ({ parcel }) => {
      const { toast } = useToast();
      const { profile } = useAuth();
      const [isFavorite, setIsFavorite] = useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isVerifiedSeller, setIsVerifiedSeller] = useState(false);
      const { comparisonList, addToCompare, removeFromCompare } = useContext(ComparisonContext);
      const navigate = useNavigate();

      const isParcelInCompare = comparisonList.includes(parcel.id);
      
      useEffect(() => {
        const checkSellerVerification = async () => {
          if (!parcel.seller_id) return;
          const { data, error } = await supabase.from('users').select('verification_status').eq('id', parcel.seller_id).single();
          if (!error && data) {
            setIsVerifiedSeller(data.verification_status === 'verified' || parcel.owner_type === 'Mairie');
          }
        };
        checkSellerVerification();
      }, [parcel.seller_id, parcel.owner_type]);

      useEffect(() => {
        if (profile) {
          setIsFavorite(profile.favorites?.includes(parcel.id));
        }
      }, [profile, parcel.id]);

      const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!profile) {
          toast({ title: 'Connectez-vous', description: 'Vous devez être connecté pour gérer vos favoris.', variant: 'destructive' });
          navigate('/login');
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
          toast({ title: "Erreur", description: "Impossible de mettre à jour les favoris.", variant: "destructive" });
        } else {
          setIsFavorite(!isFavorite);
          toast({ title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris" });
        }
      };


      const handleCompareClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isParcelInCompare) {
          removeFromCompare(parcel.id);
          toast({ title: 'Retiré du comparateur', description: `"${parcel.name}" a été retiré.` });
        } else {
          addToCompare(parcel.id);
          toast({ title: 'Ajouté au comparateur', description: `"${parcel.name}" a été ajouté.` });
        }
      };
      
      const handleInstallmentClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsModalOpen(true);
      };

      const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      };
      
      const isMunicipal = parcel.owner_type === 'Mairie';

      return (
        <>
        <motion.div variants={cardVariants}>
          <Card className="h-full flex flex-col overflow-hidden bg-card shadow-md hover:shadow-xl transition-all duration-300 border border-border/50 rounded-xl group">
            <CardHeader className="p-0 relative">
              <Link to={`/parcelles/${parcel.id}`} className="block aspect-[16/10] bg-muted overflow-hidden relative">
                <img  alt={parcel.name || 'Image de parcelle'} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" src="https://images.unsplash.com/photo-1680031668800-59686e775ee5" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10"></div>
              </Link>
              <Badge variant={getStatusVariant(parcel.status)} className="absolute top-3 right-3 shadow-sm z-20 capitalize">
                {parcel.status}
              </Badge>
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-3 left-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white z-20"
                onClick={handleToggleFavorite}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
              </Button>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <div className="flex justify-between items-start mb-2">
                 {!isMunicipal && (
                    <Badge variant={isVerifiedSeller ? 'outline_success' : 'secondary'} className="text-xs flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> {isVerifiedSeller ? 'Vendeur Vérifié' : 'Vendeur non vérifié'}
                    </Badge>
                 )}
                 {isMunicipal && (
                    <Badge variant="outline_success" className="text-xs flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Mairie
                    </Badge>
                 )}
                <Badge variant="outline" className={`text-xs`}>{parcel.owner_type}</Badge>
              </div>
              <Link to={`/parcelles/${parcel.id}`} className="block">
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate" title={parcel.name}>
                  {parcel.name}
                </h3>
              </Link>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm mt-1 mb-3 text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {parcel.zone}</span>
                <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" /> {parcel.area_sqm} m²</span>
              </div>
              <p className="text-xl font-bold text-accent_brand">
                {isMunicipal ? 'Attribution sur demande' : formatPrice(parcel.price)}
              </p>
            </CardContent>
            <CardFooter className="p-3 bg-muted/30 border-t flex flex-col gap-2">
              <div className="flex w-full gap-2">
                <Button asChild className="w-full">
                  <Link to={`/parcelles/${parcel.id}`}>
                    {isMunicipal ? <Landmark className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
                    {isMunicipal ? 'Détails & Demande' : 'Voir Détails'}
                  </Link>
                </Button>
                {!isMunicipal && parcel.is_eligible_for_installments && (
                  <Button variant="secondary" className="w-full" onClick={handleInstallmentClick}>
                    <PercentSquare className="mr-2 h-4 w-4" /> Financer
                  </Button>
                )}
              </div>
              <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleCompareClick}>
                <Layers className="mr-1.5 h-3 w-3"/>
                {isParcelInCompare ? 'Retirer du comparateur' : 'Comparer'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        {!isMunicipal && parcel.is_eligible_for_installments && (
            <InstallmentPaymentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              parcelPrice={parcel.price}
              parcelName={parcel.name}
            />
          )}
        </>
      );
    };

    export default ParcelCard;
