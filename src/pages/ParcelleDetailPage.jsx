import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { 
  ArrowLeft, MapPin, Building2, Users, Calendar, Clock, FileText,
  CheckCircle, AlertTriangle, Info, Phone, Mail, Globe, Shield,
  Download, Upload, Euro, TrendingUp, Map, Navigation, Zap,
  Heart, Star, Share2, Eye, Car, Wifi, Droplets, Camera,
  Bath, Bed, Home, Ruler, CreditCard, Bitcoin, Banknote, Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProfileLink from '@/components/common/ProfileLink';
import { supabase, fetchDirect } from '@/lib/supabaseClient';
import { supabaseService } from '@/lib/supabaseServiceClient';
import { generatePropertySlug, extractIdFromPropertySlug, isUUID as isUUIDValue } from '@/utils/propertySlug';
import { toast } from 'sonner';

const ParcelleDetailPage = () => {
  const { id: rawParam } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const baseDetailPath = location.pathname.includes('parcel-blockchain')
    ? '/parcel-blockchain'
    : '/parcelle';
  const { user } = useAuth();
  const [parcelle, setParcelle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [viewsIncremented, setViewsIncremented] = useState(false); // Track if view count has been incremented
  const [paymentMethod, setPaymentMethod] = useState('direct'); // direct, installment, bank, crypto
  // Nouvelle logique : slug = titre uniquement (pas d'id)
  const { slug: slugFromParam } = extractIdFromPropertySlug(rawParam);
  const effectiveSlug = slugFromParam || rawParam || '';
  const isSlugLookup = true;

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);

        console.log('🔍 Chargement parcelle:', {
          rawParam,
          isSlugLookup,
          slugFromParam
        });

        let property;
        let error;

        // Recherche par slug uniquement (titre)
        console.log('🔍 Using slug lookup (titre seul):', effectiveSlug);
        
        // Charger TOUTES les propriétés avec filtre sur le slug
        const { data: properties, error: slugError } = await supabase
          .from('properties')
          .select('*');
          
        if (slugError) {
          error = slugError;
        } else {
          property = properties?.find(p => {
            const baseSlug = generatePropertySlug(p.title);
            if (baseSlug === effectiveSlug) {
              return true;
            }
            if (p.slug && p.slug === effectiveSlug) {
              return true;
            }
            return false;
          });
          if (!property) {
            error = { message: `Property not found with slug: ${effectiveSlug}` };
          }
        }

        console.log('📦 Property chargée:', property);
        console.log('❌ Erreur:', error);

        let propertyData = property;

        if (error && !propertyData) {
          console.error('❌ Erreur chargement:', error);
          navigate('/404');
          return;
        }

        if (!propertyData) {
          navigate('/404');
          return;
        }

        // Charger le profil du propriétaire séparément (comme ParcellesVendeursPage)
        // Cela fonctionne même si le profil n'existe pas via le JOIN
        if (propertyData.owner_id) {
          try {
            const ownerProfiles = await fetchDirect(`profiles?select=id,full_name,email,role,phone,avatar_url,is_verified,rating,review_count,properties_sold&id=eq.${propertyData.owner_id}`);
            if (Array.isArray(ownerProfiles) && ownerProfiles.length > 0) {
              propertyData = { ...propertyData, profiles: ownerProfiles[0] };
              console.log('✅ Profil vendeur chargé:', ownerProfiles[0].full_name);
            } else {
              console.warn('⚠️  Aucun profil trouvé pour vendeur:', propertyData.owner_id);
            }
          } catch (profileError) {
            console.error('❌ Erreur récupération profil propriétaire:', profileError);
          }
        }

        if (propertyData?.title) {
          const computedCanonicalSlug = generatePropertySlug(propertyData.title);
          if (rawParam !== computedCanonicalSlug) {
            navigate(`${baseDetailPath}/${computedCanonicalSlug}`, { replace: true });
          }
        }

        // Parser les JSON fields
        const images = Array.isArray(propertyData.images) ? propertyData.images :
                      (typeof propertyData.images === 'string' ? JSON.parse(propertyData.images || '[]') : []);
        
        const features = propertyData.features && typeof propertyData.features === 'object' 
          ? propertyData.features 
          : (typeof propertyData.features === 'string' ? JSON.parse(propertyData.features || '{}') : {});
        
        const amenities = Array.isArray(propertyData.amenities) ? propertyData.amenities :
                         (typeof propertyData.amenities === 'string' ? JSON.parse(propertyData.amenities || '[]') : []);
        
        const metadata = propertyData.metadata && typeof propertyData.metadata === 'object'
          ? propertyData.metadata
          : (typeof propertyData.metadata === 'string' ? JSON.parse(propertyData.metadata || '{}') : {});

        // Mapper les données vers le format attendu par le composant
        const mappedData = {
          id: propertyData.id,
          title: propertyData.title || 'Terrain sans titre',
          location: propertyData.location || `${propertyData.city}, ${propertyData.region}`,
          region: propertyData.region,
          city: propertyData.city,
          price: propertyData.price?.toString() || '0',
          surface: propertyData.surface?.toString() || '0',
          type: propertyData.property_type || 'Terrain',
          
          seller: propertyData.profiles ? {
            id: propertyData.profiles.id,
            name: propertyData.profiles.full_name,
            type: propertyData.profiles.role,
            email: propertyData.profiles.email,
            coordinates: {
              lat: propertyData.latitude || 14.7167,
              lng: propertyData.longitude || -17.4677
            },
            verified: propertyData.profiles.is_verified || propertyData.verification_status === 'verified',
            rating: propertyData.profiles.rating || 4.5, // Real rating from profiles table
            properties_sold: propertyData.profiles.properties_sold || 0 // Real count from profiles table
          } : {
            id: propertyData.owner_id,
            name: 'Vendeur inconnu',
            type: 'particulier',
            email: '',
            coordinates: {
              lat: propertyData.latitude || 14.7167,
              lng: propertyData.longitude || -17.4677
            },
            verified: propertyData.verification_status === 'verified',
            rating: 4.5, // Default fallback
            properties_sold: 0 // Default fallback
          },

          address: {
            slug: (propertyData.title || 'terrain').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
            full: propertyData.address || propertyData.location,
            coordinates: {
              latitude: propertyData.latitude || 14.7167,
              longitude: propertyData.longitude || -17.4677
            },
            nearby_landmarks: propertyData.nearby_landmarks || []
          },

          coordinates: {
            lat: propertyData.latitude || 14.7167,
            lng: propertyData.longitude || -17.4677
          },

          features: {
            main: features.main || [],
            utilities: features.utilities || [],
            access: features.access || [
              'Route goudronnée',
              'Transport en commun à 500m',
              'Accès voiture'
            ],
            zoning: propertyData.zoning || features.zoning || 'Zone résidentielle',
            buildable_ratio: propertyData.buildable_ratio || features.buildable_ratio || 0.6,
            max_floors: propertyData.max_floors || features.max_floors || 3
          },

          amenities: amenities,

          documents: metadata.documents?.list || [
            {
              name: 'Titre de propriété',
              type: 'PDF',
              size: '2.5 MB',
              verified: !!propertyData.title_deed_number
            },
            {
              name: 'Plan cadastral',
              type: 'PDF',
              size: '1.8 MB',
              verified: propertyData.verification_status === 'verified'
            }
          ],

          financing: {
            methods: metadata.financing?.methods || ['direct'],
            bank_financing: metadata.financing?.bank_financing || {
              partner: 'BICIS',
              rate: '8.5%',
              max_duration: '20 ans'
            },
            installment: metadata.financing?.installment || {
              min_down_payment: '30%',
              monthly_payment: Math.round(propertyData.price * 0.7 / 120).toString(),
              duration: '10 ans',
              total_cost: (propertyData.price * 1.2).toString()
            },
            crypto: metadata.financing?.crypto || {
              discount: '5%',
              accepted_currencies: ['BTC', 'ETH', 'USDT', 'USDC']
            }
          },

          blockchain: {
            verified: propertyData.blockchain_verified || false,
            hash: propertyData.blockchain_hash,
            network: propertyData.blockchain_network,
            nft_token_id: propertyData.nft_token_id
          },

          nft: {
            available: !!propertyData.nft_token_id,
            token_id: propertyData.nft_token_id || null,
            blockchain: propertyData.blockchain_network || 'Polygon',
            mint_date: propertyData.nft_minted_at || propertyData.created_at,
            smart_contract: propertyData.nft_contract_address || null,
            current_owner: propertyData.nft_owner || propertyData.profiles?.full_name || 'Vendeur'
          },

          stats: {
            views: propertyData.views_count || 0,
            favorites: propertyData.favorites_count || 0,
            contact_requests: propertyData.contact_requests_count || 0,
            days_on_market: propertyData.created_at 
              ? Math.floor((new Date() - new Date(propertyData.created_at)) / (1000 * 60 * 60 * 24))
              : 0
          },

          ai_score: {
            overall: propertyData.ai_score || 8.5,
            location: propertyData.ai_location_score || 9.0,
            investment_potential: propertyData.ai_investment_score || 8.0,
            infrastructure: propertyData.ai_infrastructure_score || 8.5,
            price_vs_market: propertyData.ai_price_score || 8.0,
            growth_prediction: propertyData.ai_growth_prediction || '+15% dans les 5 prochaines années'
          },

          images: images,
          main_image: images[0] || null,
          description: propertyData.description || 'Aucune description disponible',
          status: propertyData.status,
          verification_status: propertyData.verification_status,
          legal_status: propertyData.legal_status,
          title_deed_number: propertyData.title_deed_number,
          land_registry_ref: propertyData.land_registry_ref,
          created_at: propertyData.created_at,
          updated_at: propertyData.updated_at
        };

        setParcelle(mappedData);
        
        // Charger l'état des favoris si l'utilisateur est connecté
        if (user?.id) {
          const { data: favorite } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('property_id', propertyData.id)
            .maybeSingle();
          
          setIsFavorite(!!favorite);
        }

        // Incrémenter les vues de la propriété (une seule fois par session)
        if (!viewsIncremented && propertyData?.id) {
          try {
            // Utiliser la fonction PostgreSQL pour incrémenter les vues atomiquement
            const { error } = await supabaseService
              .rpc('increment_property_views', { property_id: propertyData.id });
            
            if (error) {
              console.error('❌ Erreur incrémentation des vues:', error);
            } else {
              console.log('✅ Vue incrémentée pour la propriété:', propertyData.id);
              setViewsIncremented(true);
              
              // Mettre à jour les vues locales
              mappedData.stats.views = (mappedData.stats.views || 0) + 1;
              setParcelle(mappedData);
            }
          } catch (error) {
            console.error('❌ Erreur lors de l\'incrémentation des vues:', error);
          }
        }

        setLoading(false);

      } catch (error) {
        console.error('Erreur chargement parcelle:', error);
        setLoading(false);
      }
    };

    if (rawParam) {
      loadProperty();
    }
  }, [rawParam, navigate, user?.id, baseDetailPath]);

  // 🔍 DIAGNOSTIC: Suivi du bouton Éditer
  useEffect(() => {
    if (parcelle && user) {
      const isOwner = user.id === parcelle.owner_id;
      console.log('🔍 DEBUG BOUTON ÉDITER:', {
        user_id: user.id,
        parcelle_owner_id: parcelle.owner_id,
        is_owner: isOwner,
        should_show_edit_button: isOwner,
        parcelle_loaded: !!parcelle,
        user_logged_in: !!user
      });
    }
  }, [user, parcelle]);

  const formatPrice = (price) => {
    return parseInt(price).toLocaleString() + ' FCFA';
  };

  const formatPricePerM2 = (price, surface) => {
    return Math.round(parseInt(price) / parseInt(surface)).toLocaleString() + ' FCFA/m²';
  };

  const handleContact = () => {
    setShowContactModal(true);
  };

  const handleInitiatePurchase = () => {
    // Navigation directe vers le processus d'achat avec contexte de la parcelle
    const selectedPaymentInfo = getPaymentInfo();
    
    switch (paymentMethod) {
      case 'direct':
        navigate('/acheteur/buy/one-time', { 
          state: { 
            parcelleId: parcelle.id,
            parcelle: {
              id: parcelle.id,
              title: parcelle.title,
              price: selectedPaymentInfo.totalPrice,
              surface: parcelle.surface,
              location: parcelle.location
            },
            paymentInfo: selectedPaymentInfo
          } 
        });
        break;
      case 'installment':
        navigate('/acheteur/buy/installments', { 
          state: { 
            parcelleId: parcelle.id,
            parcelle: {
              id: parcelle.id,
              title: parcelle.title,
              price: selectedPaymentInfo.totalPrice,
              monthlyPayment: selectedPaymentInfo.monthlyPayment,
              surface: parcelle.surface,
              location: parcelle.location
            },
            paymentInfo: selectedPaymentInfo
          } 
        });
        break;
      case 'bank':
        navigate('/acheteur/buy/bank-financing', { 
          state: { 
            parcelleId: parcelle.id,
            parcelle: {
              id: parcelle.id,
              title: parcelle.title,
              price: selectedPaymentInfo.totalPrice,
              monthlyPayment: selectedPaymentInfo.monthlyPayment,
              downPayment: selectedPaymentInfo.downPayment,
              surface: parcelle.surface,
              location: parcelle.location
            },
            paymentInfo: selectedPaymentInfo
          } 
        });
        break;
      case 'crypto':
        // Pour le crypto, utiliser le flow direct avec info spécifique
        navigate('/acheteur/buy/one-time', { 
          state: { 
            parcelleId: parcelle.id,
            paymentMethod: 'crypto',
            parcelle: {
              id: parcelle.id,
              title: parcelle.title,
              price: selectedPaymentInfo.totalPrice,
              surface: parcelle.surface,
              location: parcelle.location
            },
            paymentInfo: selectedPaymentInfo
          } 
        });
        break;
      default:
        setShowContactModal(true); // Fallback vers contact
    }
  };

  const handleShowMap = () => {
    setShowMapModal(true);
  };

  const openGoogleMaps = () => {
    if (parcelle?.address?.coordinates) {
      const { latitude, longitude } = parcelle.address.coordinates;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour ajouter aux favoris');
      navigate('/login');
      return;
    }

    try {
      if (!parcelle?.id) {
        toast.error('Parcelle introuvable');
        return;
      }

      if (isFavorite) {
        // Supprimer des favoris
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', parcelle.id);

        if (error) throw error;
        
        // Mettre à jour l'état local et le compteur de favoris
        setIsFavorite(false);
        setParcelle(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            favorites: Math.max(0, (prev.stats.favorites || 0) - 1)
          }
        }));
        
        toast.success('Retiré de vos favoris');
      } else {
        // Ajouter aux favoris
        const { error } = await supabase
          .from('favorites')
          .insert([
            {
              user_id: user.id,
              property_id: parcelle.id,
              created_at: new Date().toISOString()
            }
          ]);

        if (error) throw error;
        
        // Mettre à jour l'état local et le compteur de favoris
        setIsFavorite(true);
        setParcelle(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            favorites: (prev.stats.favorites || 0) + 1
          }
        }));
        
        toast.success('Ajouté à vos favoris');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des favoris:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  // Calcul intelligent des prix selon la méthode de paiement
  const getPaymentInfo = () => {
    if (!parcelle) return null;
    
    const basePrice = parseInt(parcelle.price);
    
    switch (paymentMethod) {
      case 'direct':
        // 5% de réduction pour paiement direct
        const directPrice = basePrice * 0.95;
        return {
          totalPrice: directPrice,
          displayPrice: formatPrice(directPrice.toString()),
          savings: formatPrice((basePrice - directPrice).toString()),
          method: 'Paiement direct',
          title: 'Achat Direct Comptant',
          description: 'Paiement comptant avec 5% de réduction',
          benefits: ['5% de réduction immédiate', 'Transfert de propriété instantané', 'Aucun frais de dossier']
        };
        
      case 'installment':
        // Prix normal + 3% de frais de dossier
        const installmentPrice = basePrice * 1.03;
        const monthlyPayment = installmentPrice / 60; // 5 ans
        return {
          totalPrice: installmentPrice,
          displayPrice: formatPrice(installmentPrice.toString()),
          monthlyPayment: formatPrice(monthlyPayment.toString()),
          duration: '60 mois',
          method: 'Paiement échelonné',
          title: 'Paiement Échelonné Flexible',
          description: 'Paiement en plusieurs fois sur 5 ans',
          benefits: ['Apport minimum 20%', 'Paiement étalé sur 5 ans', 'Taux fixe garanti']
        };
        
      case 'bank':
        // Prix normal + frais bancaires
        const bankPrice = basePrice * 1.02;
        const monthlyBankPayment = (bankPrice * 0.7) / 300; // 25 ans, 70% financé
        return {
          totalPrice: bankPrice,
          displayPrice: formatPrice(bankPrice.toString()),
          monthlyPayment: formatPrice(monthlyBankPayment.toString()),
          downPayment: formatPrice((bankPrice * 0.3).toString()),
          duration: '25 ans',
          method: 'Financement bancaire',
          title: 'Financement Bancaire Partenaire',
          description: 'Crédit immobilier avec banques partenaires',
          benefits: ['Apport 30% minimum', 'Taux préférentiel', 'Accompagnement expert']
        };

      case 'crypto':
        // 3% de réduction pour paiement crypto
        const cryptoPrice = basePrice * 0.97;
        return {
          totalPrice: cryptoPrice,
          displayPrice: formatPrice(cryptoPrice.toString()),
          savings: formatPrice((basePrice - cryptoPrice).toString()),
          method: 'Paiement Crypto',
          title: 'Paiement Cryptocurrency',
          description: 'Bitcoin, Ethereum, USDT - Transaction blockchain sécurisée',
          benefits: ['3% de réduction crypto', 'Transaction instantanée', 'Anonymat préservé', 'Frais de réseau minimaux']
        };
        
      default:
        return {
          totalPrice: basePrice,
          displayPrice: formatPrice(basePrice.toString()),
          method: 'Prix de base',
          title: 'Prix Catalogue Standard',
          description: 'Prix catalogue sans options',
          benefits: []
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-lg font-medium text-gray-700">Chargement de la parcelle...</div>
          <div className="text-sm text-gray-500 mt-2">Récupération des informations blockchain</div>
        </div>
      </div>
    );
  }

  if (!parcelle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <div className="text-lg font-medium text-gray-700">Parcelle non trouvée</div>
          <div className="text-sm text-gray-500 mt-2">Cette parcelle n'existe pas ou a été supprimée</div>
          <div className="text-xs text-gray-400 mt-4 p-3 bg-gray-100 rounded font-mono break-all">
            Slug recherché: {rawParam}
          </div>
          <Button onClick={() => navigate('/parcelles-vendeurs')} className="mt-6">
            Retour aux parcelles
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="mt-2 ml-2">
            Accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>{parcelle.title} | Teranga Foncier</title>
  <meta name="description" content={`${parcelle.title} - ${parcelle.surface}m² à ${formatPrice(parcelle.price)} dans ${parcelle.location}`} />
      </Helmet>

      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/parcelles-vendeurs')}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux parcelles
            </Button>
            
            <div className="flex items-center gap-2">
              {/* Bouton Éditer pour le propriétaire */}
              {/* Vérification: parcelle chargée + user authentifié + user est propriétaire */}
              {!loading && parcelle && user && user.id === parcelle.owner_id && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => navigate(`/parcelles/${id}/edit`)}
                    className="bg-blue-600 hover:bg-blue-700"
                    title="Vous êtes propriétaire de cette parcelle"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Éditer cette parcelle
                  </Button>
                </motion.div>
              )}
              
              <Button variant="outline" size="sm" onClick={toggleFavorite}>
                <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                {isFavorite ? 'Sauvegardé' : 'Sauvegarder'}
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Partager
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Galerie d'images */}
            <Card className="overflow-hidden">
              <div className="relative h-96">
                <img
                  src={parcelle.images[activeImageIndex]}
                  alt={`${parcelle.title} - Image ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {parcelle.seller.verified && (
                    <Badge className="bg-green-500 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Vérifié
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-blue-500 text-white">
                    {parcelle.type}
                  </Badge>
                  {parcelle?.nft?.available && (
                    <Badge className="bg-purple-500 text-white">
                      <Bitcoin className="w-3 h-3 mr-1" />
                      NFT
                    </Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {parcelle.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          index === activeImageIndex ? 'border-white' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Miniature ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Informations principales */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{parcelle.title}</h1>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-5 h-5 mr-2" />
                        <span className="text-lg">{parcelle.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {formatPrice(parcelle.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPricePerM2(parcelle.price, parcelle.surface)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{parcelle.surface}</div>
                      <div className="text-sm text-gray-500">m² de terrain</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{parcelle.ai_score.overall}</div>
                      <div className="text-sm text-gray-500">Score IA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{parcelle.stats.views}</div>
                      <div className="text-sm text-gray-500">Vues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{parcelle.stats.days_on_market}</div>
                      <div className="text-sm text-gray-500">Jours en ligne</div>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <div 
                      className="text-gray-700 leading-relaxed whitespace-pre-line"
                      dangerouslySetInnerHTML={{ 
                        __html: parcelle.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      }} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localisation - Horizontal */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-100 to-blue-100 border-b-2 border-green-200">
                <CardTitle className="text-xl flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-green-600" />
                  Localisation du terrain
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Carte - Gauche */}
                  <div className="space-y-4">
                    <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg overflow-hidden border-2 border-green-200 shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
                        {/* Simulation de carte interactive */}
                        <div className="relative w-full h-full">
                          {/* Zone de terrain simulée */}
                          <div 
                            className="absolute bg-red-500 border-2 border-red-600 opacity-80 shadow-lg"
                            style={{
                              left: '45%',
                              top: '40%',
                              width: '10%',
                              height: '20%',
                              borderRadius: '2px'
                            }}
                          ></div>
                          
                          {/* Points de repère simulés */}
                          <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg border-l-4 border-green-600">
                            Terrain: {parcelle.surface} m²
                          </div>
                          
                          {/* Coordonnées GPS */}
                          <div className="absolute bottom-4 left-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-2 rounded-lg text-sm font-mono shadow-lg">
                            GPS: {parcelle.coordinates.lat.toFixed(4)}, {parcelle.coordinates.lng.toFixed(4)}
                          </div>
                          
                          {/* Contrôles de zoom simulés */}
                          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                            <button className="w-10 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center border-b font-bold text-lg">
                              +
                            </button>
                            <button className="w-10 h-10 text-gray-700 hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center font-bold text-lg">
                              −
                            </button>
                          </div>

                          {/* Échelle */}
                          <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-lg text-xs font-semibold shadow-lg border-l-2 border-green-600">
                            100m
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Détails - Droite */}
                  <div className="space-y-6 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-base text-gray-800 mb-3">Adresse exacte</div>
                      <div className="text-base text-gray-700 bg-white p-4 rounded-lg border border-green-100 shadow-sm">
                        {parcelle.address.full}
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-base text-gray-800 mb-3">Points de repère</div>
                      <div className="space-y-3 bg-white p-4 rounded-lg border border-green-100 max-h-48 overflow-y-auto">
                        {parcelle.address.nearby_landmarks.map((landmark, index) => (
                          <div key={index} className="flex items-start text-base text-gray-700">
                            <Navigation className="w-5 h-5 mr-3 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{landmark}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <Button 
                        onClick={handleShowMap} 
                        variant="outline" 
                        className="w-full text-base h-10 border-green-300 hover:bg-green-50"
                      >
                        <Map className="w-5 h-5 mr-2" />
                        Carte plein écran
                      </Button>
                      <Button 
                        onClick={openGoogleMaps} 
                        variant="outline" 
                        className="w-full text-base h-10 border-green-300 hover:bg-green-50"
                      >
                        <Navigation className="w-5 h-5 mr-2" />
                        Ouvrir dans Google Maps
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SECTION REFONDÉE: Caractéristiques & Financement */}
            {/* ═══════════════════════════════════════════════════════ */}

            {/* TAB SECTION MODERNISÉE */}
            <Card className="border-0 shadow-md">
              <Tabs defaultValue="caracteristiques" className="w-full">
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                  <TabsList className="grid w-full grid-cols-4 bg-transparent p-0 h-auto rounded-none">
                    <TabsTrigger 
                      value="caracteristiques" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-white"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Caractéristiques
                    </TabsTrigger>
                    <TabsTrigger 
                      value="financement" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-white"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Financement
                    </TabsTrigger>
                    <TabsTrigger 
                      value="nft" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-white"
                    >
                      <Bitcoin className="w-4 h-4 mr-2" />
                      NFT & Blockchain
                    </TabsTrigger>
                    <TabsTrigger 
                      value="documents" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-white"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Documents
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                {/* ═══ ONGLET 1: CARACTÉRISTIQUES MODERNISÉES ═══ */}
                <TabsContent value="caracteristiques" className="mt-0 p-6">
                  <div className="space-y-8">
                    
                    {/* Sous-section: Caractéristiques principales */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <Home className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Caractéristiques principales</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {parcelle.features.main && parcelle.features.main.length > 0 ? (
                          parcelle.features.main.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:shadow-md transition-shadow"
                            >
                              <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-700 font-medium">{feature}</span>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-6 text-gray-500">
                            Aucune caractéristique principale disponible
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sous-section: Commodités & Utilités */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Commodités & Utilités</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {parcelle.features.utilities && parcelle.features.utilities.length > 0 ? (
                          parcelle.features.utilities.map((utility, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-3 p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-100 hover:shadow-md transition-shadow"
                            >
                              <Zap className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-700 font-medium">{utility}</span>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-6 text-gray-500">
                            Aucune commodité disponible
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sous-section: Accès & Transport */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <Navigation className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Accès & Transport</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {parcelle.features.access && parcelle.features.access.length > 0 ? (
                          parcelle.features.access.map((access, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow"
                            >
                              <Navigation className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-700 font-medium">{access}</span>
                            </motion.div>
                          ))
                        ) : (
                          <div className="col-span-full text-center py-6 text-gray-500">
                            Aucun accès/transport disponible
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sous-section: Informations d'urbanisme */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-lg border-2 border-blue-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Informations d'urbanisme</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div 
                          whileHover={{ y: -4 }}
                          className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm"
                        >
                          <div className="text-sm text-gray-600 font-semibold mb-2">Zone de destination</div>
                          <div className="text-2xl font-bold text-blue-600">{parcelle.features.zoning}</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ y: -4 }}
                          className="bg-white p-4 rounded-lg border border-green-200 shadow-sm"
                        >
                          <div className="text-sm text-gray-600 font-semibold mb-2">Coefficient d'Emprise Sol (CES)</div>
                          <div className="text-2xl font-bold text-green-600">{parcelle.features.buildable_ratio * 100}%</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ y: -4 }}
                          className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm"
                        >
                          <div className="text-sm text-gray-600 font-semibold mb-2">Hauteur maximale</div>
                          <div className="text-2xl font-bold text-purple-600">{parcelle.features.max_floors} étages</div>
                        </motion.div>
                      </div>
                    </div>

                  </div>
                </TabsContent>

                {/* ═══ ONGLET 2: FINANCEMENT MODERNISÉ ═══ */}
                <TabsContent value="financement" className="mt-0 p-6">
                  <div className="space-y-8">
                    
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Options de financement disponibles</h3>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        
                        {/* OPTION 1: Paiement Direct */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <Euro className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">Paiement Direct</h4>
                                <p className="text-sm text-gray-600">Achat sans financement</p>
                              </div>
                            </div>
                            <Badge className="bg-blue-600">Recommandé</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded border border-blue-200">
                              <div className="text-xs text-gray-600 font-semibold">Prix Total</div>
                              <div className="text-2xl font-bold text-blue-600 mt-1">{formatPrice(parcelle.price)}</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-blue-200">
                              <div className="text-xs text-gray-600 font-semibold">Prix par m²</div>
                              <div className="text-2xl font-bold text-blue-600 mt-1">{formatPricePerM2(parcelle.price, parcelle.surface)}</div>
                            </div>
                          </div>
                        </motion.div>

                        {/* OPTION 2: Financement Bancaire */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                <Banknote className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">Financement Bancaire</h4>
                                <p className="text-sm text-gray-600">Avec nos partenaires bancaires</p>
                              </div>
                            </div>
                            <Badge className="bg-green-600">Partenaires</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded border border-green-200">
                              <div className="text-xs text-gray-600 font-semibold">Apport minimum</div>
                              <div className="text-lg font-bold text-green-600 mt-1">30%</div>
                              <div className="text-xs text-gray-600 mt-1">{formatPrice(Math.round(parcelle.price * 0.3))}</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-green-200">
                              <div className="text-xs text-gray-600 font-semibold">Taux d'intérêt</div>
                              <div className="text-lg font-bold text-green-600 mt-1">8.5%</div>
                              <div className="text-xs text-gray-600 mt-1">Partenaire: BICIS</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-green-200">
                              <div className="text-xs text-gray-600 font-semibold">Durée maximale</div>
                              <div className="text-lg font-bold text-green-600 mt-1">20 ans</div>
                              <div className="text-xs text-gray-600 mt-1">240 mois</div>
                            </div>
                          </div>
                        </motion.div>

                        {/* OPTION 3: Paiement Échelonné */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                                <CreditCard className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">Paiement Échelonné</h4>
                                <p className="text-sm text-gray-600">Flexible & adapté</p>
                              </div>
                            </div>
                            <Badge className="bg-amber-600">Flexible</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded border border-amber-200">
                              <div className="text-xs text-gray-600 font-semibold">Apport initial</div>
                              <div className="text-lg font-bold text-amber-600 mt-1">30%</div>
                              <div className="text-xs text-gray-600 mt-1">{formatPrice(Math.round(parcelle.price * 0.3))}</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-amber-200">
                              <div className="text-xs text-gray-600 font-semibold">Mensualité</div>
                              <div className="text-lg font-bold text-amber-600 mt-1">{formatPrice(Math.round(parcelle.price * 0.7 / 120))}</div>
                              <div className="text-xs text-gray-600 mt-1">10 ans / 120 mois</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-amber-200">
                              <div className="text-xs text-gray-600 font-semibold">Coût total</div>
                              <div className="text-lg font-bold text-amber-600 mt-1">{formatPrice(Math.round(parcelle.price * 1.2))}</div>
                              <div className="text-xs text-gray-600 mt-1">+20% d'intérêts</div>
                            </div>
                          </div>
                        </motion.div>

                        {/* OPTION 4: Crypto-monnaie */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                <Bitcoin className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">Paiement en Crypto-monnaie</h4>
                                <p className="text-sm text-gray-600">Bitcoin, Ethereum & stablecoins</p>
                              </div>
                            </div>
                            <Badge className="bg-purple-600">-5% Réduction</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded border border-purple-200">
                              <div className="text-xs text-gray-600 font-semibold">Prix avec réduction</div>
                              <div className="text-lg font-bold text-purple-600 mt-1">{formatPrice(Math.round(parcelle.price * 0.95))}</div>
                              <div className="text-xs text-green-600 font-semibold mt-1">Économies: {formatPrice(Math.round(parcelle.price * 0.05))}</div>
                            </div>
                            <div className="bg-white p-3 rounded border border-purple-200">
                              <div className="text-xs text-gray-600 font-semibold">Devises acceptées</div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">BTC</Badge>
                                <Badge variant="outline" className="text-xs">ETH</Badge>
                                <Badge variant="outline" className="text-xs">USDT</Badge>
                                <Badge variant="outline" className="text-xs">USDC</Badge>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                      </div>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Button 
                        onClick={() => navigate('/buyer/financing', { 
                          state: { 
                            parcelId: parcelle?.id,
                            parcelDetails: parcelle,
                            returnPath: window.location.pathname 
                          } 
                        })}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg font-bold rounded-lg"
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Centre de Financement Complet
                      </Button>
                    </motion.div>

                  </div>
                </TabsContent>

                <TabsContent value="nft" className="mt-6">
                  {parcelle?.nft?.available ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Propriété Tokenisée NFT</h3>
                        <Badge className="bg-purple-500 text-white">
                          <Bitcoin className="w-3 h-3 mr-1" />
                          Actif
                        </Badge>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-3">Informations NFT</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-600">Token ID:</span>
                                <div className="font-mono bg-white px-2 py-1 rounded mt-1">{parcelle.nft.token_id}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Blockchain:</span>
                                <div className="font-medium">{parcelle.nft.blockchain}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Date de mint:</span>
                                <div className="font-medium">{parcelle.nft.mint_date}</div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-3">Smart Contract</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-gray-600">Adresse du contrat:</span>
                                <div className="font-mono bg-white px-2 py-1 rounded mt-1 break-all">
                                  {parcelle.nft.smart_contract || 'Non disponible'}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-600">Propriétaire actuel:</span>
                                <div className="font-mono bg-white px-2 py-1 rounded mt-1 break-all">
                                  {parcelle.nft.current_owner}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      <div className="mt-6 flex gap-3">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Voir sur OpenSea
                        </Button>
                        <Button variant="outline" size="sm">
                          <Globe className="w-4 h-4 mr-2" />
                          Explorer Blockchain
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Avantages de la tokenisation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <Shield className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Sécurité maximale</div>
                            <div className="text-xs text-gray-600">Propriété immutable sur blockchain</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <TrendingUp className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Transfert instantané</div>
                            <div className="text-xs text-gray-600">Transaction en quelques minutes</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Globe className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Transparence totale</div>
                            <div className="text-xs text-gray-600">Historique public vérifiable</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Euro className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                          <div>
                            <div className="font-medium text-sm">Frais réduits</div>
                            <div className="text-xs text-gray-600">Pas d'intermédiaires traditionnels</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bitcoin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">NFT non disponible</h3>
                      <p className="text-gray-600">Cette propriété n'est pas encore tokenisée en NFT.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Documents légaux</h3>
                    
                    <div className="space-y-3">
                      {parcelle.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-500 mr-3" />
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-gray-500">{doc.type} • {doc.size}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.verified && (
                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Vérifié
                              </Badge>
                            )}
                            {!doc.verified && (
                              <Badge className="bg-yellow-100 text-yellow-700">
                                <Clock className="w-3 h-3 mr-1" />
                                En attente
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-medium text-blue-900 mb-1">Documents vérifiés</div>
                          <div className="text-blue-700">
                            Tous les documents marqués comme "Vérifié" ont été contrôlés par nos experts légaux 
                            et sont conformes à la réglementation sénégalaise.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* 🔒 Bloc de Sécurité et Vérification - HORIZONTAL 3 COLONNES */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-200">
                <CardTitle className="text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Sécurité et Vérification
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Colonne 1: Vérification */}
                  <div className="p-4 bg-white rounded-lg border-l-4 border-green-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">Tous nos terrains sont vérifiés</h4>
                        <p className="text-xs text-gray-600">Authentification complète</p>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-0.5 text-lg">✓</span>
                        <span>Authenticité des titres fonciers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-0.5 text-lg">✓</span>
                        <span>Conformité réglementation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-0.5 text-lg">✓</span>
                        <span>Localisation GPS vérifiée</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 font-bold mt-0.5 text-lg">✓</span>
                        <span>Absence de litiges</span>
                      </li>
                    </ul>
                  </div>

                  {/* Colonne 2: Sécurité */}
                  <div className="p-4 bg-white rounded-lg border-l-4 border-red-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">Transactionnez en sécurité</h4>
                        <p className="text-xs text-gray-600">Protection maximale</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-blue-50 border-l-4 border-blue-600 p-3 rounded text-xs">
                        <p className="font-semibold text-blue-900 mb-2">✅ À FAIRE:</p>
                        <ul className="space-y-1 text-blue-800">
                          <li>• Transactions via plateforme</li>
                          <li>• Paiements sécurisés</li>
                          <li>• Support disponible</li>
                        </ul>
                      </div>
                      <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded text-xs">
                        <p className="font-semibold text-red-900 mb-2">❌ NE PAS:</p>
                        <ul className="space-y-1 text-red-800">
                          <li>• Transactions externes</li>
                          <li>• Paiements directs</li>
                          <li>• Partager infos sensibles</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Colonne 3: Protection */}
                  <div className="p-4 bg-white rounded-lg border-l-4 border-indigo-500 shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">Nous vous protégeons</h4>
                        <p className="text-xs text-gray-600">Couverture complète</p>
                      </div>
                    </div>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>Contrats digitaux sécurisés</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>Dépôt fiduciaire notaire</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>Assurance transaction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <span>Support 24/7</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Étapes de l'Achat - Timeline Horizontale */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-200">
                <CardTitle className="text-xl flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-blue-600" />
                  Processus d'Achat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Timeline Horizontale */}
                <div className="relative mb-8">
                  {/* Ligne de connexion - Gradient line connecting stages */}
                  <div className="hidden md:block absolute top-7 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 via-green-400 via-purple-400 via-orange-400 via-indigo-400 to-red-400 rounded-full" />
                  
                  {/* Étapes horizontales */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10">
                    
                    {/* Étape 1 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white mb-3">1</div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-sm">Demande</div>
                        <div className="text-xs text-gray-600 mt-1">Vous proposez</div>
                      </div>
                    </div>

                    {/* Étape 2 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white mb-3">2</div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-sm">Acceptation</div>
                        <div className="text-xs text-gray-600 mt-1">Vendeur valide</div>
                      </div>
                    </div>

                    {/* Étape 3 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white mb-3">3</div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-sm">Notaire</div>
                        <div className="text-xs text-gray-600 mt-1">Acte préparé</div>
                      </div>
                    </div>

                    {/* Étape 4 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white mb-3">4</div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-sm">Géomètre</div>
                        <div className="text-xs text-gray-600 mt-1">Mesures validées</div>
                      </div>
                    </div>

                    {/* Étape 5 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-white mb-3">5</div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-sm">Enregistrement</div>
                        <div className="text-xs text-gray-600 mt-1">Officiel validé</div>
                      </div>
                    </div>

                    {/* Étape 6 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg border-4 border-white mb-3">✓</div>
                      <div className="text-center">
                        <div className="font-bold text-gray-900 text-sm">Propriétaire</div>
                        <div className="text-xs text-gray-600 mt-1">Finalisé</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info box */}
                <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-l-4 border-blue-600 p-5 rounded-lg">
                  <div className="flex gap-4">
                    <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-gray-900 text-base">Professionnels certifiés à chaque étape</div>
                      <p className="text-sm text-gray-700 mt-2">
                        Notaires, géomètres agréés et experts juridiques garantissent la légalité et la sécurité de votre transaction immobilière du début à la fin.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Score IA */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Analyse IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {parcelle.ai_score.overall}/10
                    </div>
                    <div className="text-sm text-gray-600">Score global</div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Localisation</span>
                        <span>{parcelle.ai_score.location}/10</span>
                      </div>
                      <Progress value={parcelle.ai_score.location * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Potentiel investissement</span>
                        <span>{parcelle.ai_score.investment_potential}/10</span>
                      </div>
                      <Progress value={parcelle.ai_score.investment_potential * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Infrastructure</span>
                        <span>{parcelle.ai_score.infrastructure}/10</span>
                      </div>
                      <Progress value={parcelle.ai_score.infrastructure * 10} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Prix vs marché</span>
                        <span>{parcelle.ai_score.price_vs_market}/10</span>
                      </div>
                      <Progress value={parcelle.ai_score.price_vs_market * 10} className="h-2" />
                    </div>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-green-800 mb-1">Prédiction de croissance</div>
                    <div className="text-sm text-green-700">{parcelle.ai_score.growth_prediction}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Système de Paiement Intelligent Blockchain */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  Paiement Intelligent Blockchain
                  <Badge className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                    IA Powered
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  {/* Options de paiement modernes */}
                  <div>
                    <h4 className="font-semibold mb-4 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-indigo-600" />
                      Modes de Paiement Sécurisés
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      
                      {/* Paiement Direct */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'direct' 
                            ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50' 
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                        }`}
                        onClick={() => setPaymentMethod('direct')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              paymentMethod === 'direct' 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                : 'bg-gray-100'
                            }`}>
                              <CreditCard className={`w-5 h-5 ${
                                paymentMethod === 'direct' ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold">Paiement Direct</div>
                              <div className="text-sm text-gray-600">Transaction instantanée</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">-5%</div>
                            <div className="text-xs text-gray-500">Réduction</div>
                          </div>
                        </div>
                        {paymentMethod === 'direct' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-indigo-200"
                          >
                            <div className="flex items-center text-sm text-indigo-700 mb-2">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Transaction blockchain sécurisée
                            </div>
                            <div className="flex items-center text-sm text-indigo-700">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Transfert de propriété immédiat
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Paiement Échelonné */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'installment' 
                            ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50' 
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                        }`}
                        onClick={() => setPaymentMethod('installment')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              paymentMethod === 'installment' 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                : 'bg-gray-100'
                            }`}>
                              <Calendar className={`w-5 h-5 ${
                                paymentMethod === 'installment' ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold">Paiement Échelonné</div>
                              <div className="text-sm text-gray-600">Jusqu’à 24 mois</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">+2%</div>
                            <div className="text-xs text-gray-500">Frais gestion</div>
                          </div>
                        </div>
                        {paymentMethod === 'installment' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-indigo-200"
                          >
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Smart contracts automatisés
                              </div>
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Propriété progressive
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Financement Bancaire */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'bank' 
                            ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50' 
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                        }`}
                        onClick={() => setPaymentMethod('bank')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              paymentMethod === 'bank' 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500' 
                                : 'bg-gray-100'
                            }`}>
                              <Banknote className={`w-5 h-5 ${
                                paymentMethod === 'bank' ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold">Financement Bancaire</div>
                              <div className="text-sm text-gray-600">Jusqu’à 80% du montant</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-purple-600">3.5%</div>
                            <div className="text-xs text-gray-500">Taux annuel</div>
                          </div>
                        </div>
                        {paymentMethod === 'bank' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-indigo-200"
                          >
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Préapprobation en 24h
                              </div>
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Partenaires bancaires certifiés
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Option Crypto */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          paymentMethod === 'crypto' 
                            ? 'border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50' 
                            : 'border-gray-200 bg-white hover:border-indigo-300'
                        }`}
                        onClick={() => setPaymentMethod('crypto')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              paymentMethod === 'crypto' 
                                ? 'bg-gradient-to-r from-orange-500 to-yellow-500' 
                                : 'bg-gray-100'
                            }`}>
                              <Bitcoin className={`w-5 h-5 ${
                                paymentMethod === 'crypto' ? 'text-white' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold flex items-center">
                                Paiement Crypto
                                <Badge className="ml-2 text-xs bg-orange-100 text-orange-600">Nouveau</Badge>
                              </div>
                              <div className="text-sm text-gray-600">Bitcoin, Ethereum, USDT</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-orange-600">-3%</div>
                            <div className="text-xs text-gray-500">Réduction</div>
                          </div>
                        </div>
                        {paymentMethod === 'crypto' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-indigo-200"
                          >
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Transaction instantanée
                              </div>
                              <div className="flex items-center text-indigo-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Anonymat préservé
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </div>

                  {/* Résumé du paiement */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl">
                    <div className="text-center">
                      <div className="text-sm opacity-90 mb-1">Prix Total</div>
                      <div className="text-3xl font-bold mb-2">
                        {getPaymentInfo()?.totalPrice.toLocaleString('fr-FR')} FCFA
                      </div>
                      <div className="text-sm opacity-90 mb-4">
                        {formatPricePerM2(parcelle.price, parcelle.surface)} • {parcelle.surface} m²
                      </div>
                      
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                        <div className="text-sm font-medium mb-2">
                          {getPaymentInfo()?.title}
                        </div>
                        <div className="text-xs opacity-90">
                          {getPaymentInfo()?.description}
                        </div>
                      </div>

                      <div className="flex items-center justify-center text-xs space-x-4">
                        <div className="flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          Sécurisé Blockchain
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          IA Optimisé
                        </div>
                        <div className="flex items-center">
                          <Globe className="w-3 h-3 mr-1" />
                          Transaction Globale
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions principales */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button onClick={handleInitiatePurchase} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg">
                    <Zap className="w-4 h-4 mr-2" />
                    Faire une offre
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                    <div className="font-medium">{getPaymentInfo()?.title}</div>
                    <div className="text-xs mt-1">{getPaymentInfo()?.description}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={handleContact}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contacter le vendeur
                    </Button>
                  </div>
                  
                  <Button onClick={handleShowMap} variant="outline" className="w-full">
                    <Map className="w-4 h-4 mr-2" />
                    Voir sur la carte
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Programmer une visite
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Dossier complet PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Informations vendeur */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <ProfileLink 
                        type={parcelle.seller.type} 
                        id={parcelle.seller.id || parcelle.id} 
                        className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                        external={true}
                      >
                        {parcelle.seller.name}
                      </ProfileLink>
                      <div className="text-sm text-gray-600">
                        {parcelle.seller.type === 'particulier' ? 'Particulier' :
                         parcelle.seller.type === 'agent-foncier' ? 'Agent Foncier' :
                         parcelle.seller.type === 'promoteur' ? 'Promoteur' :
                         parcelle.seller.type === 'vendeur' ? 'Vendeur' :
                         parcelle.seller.type?.charAt(0).toUpperCase() + parcelle.seller.type?.slice(1) || 'Professionnel'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Note vendeur:</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium">{parcelle.seller.rating}/5</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Propriétés vendues:</span>
                    <span className="font-medium">{parcelle.seller.properties_sold}</span>
                  </div>

                  {parcelle.seller.coordinates && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Coordonnées GPS du terrain:</div>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-700 bg-blue-50 p-2 rounded flex items-center justify-between">
                          <span>Lat:</span>
                          <span className="font-mono font-medium">{parcelle.seller.coordinates.lat.toFixed(4)}</span>
                        </div>
                        <div className="text-xs text-gray-700 bg-blue-50 p-2 rounded flex items-center justify-between">
                          <span>Lng:</span>
                          <span className="font-mono font-medium">{parcelle.seller.coordinates.lng.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {parcelle.seller.verified && (
                    <div className="flex items-center text-sm text-green-600">
                      <Shield className="w-4 h-4 mr-1" />
                      <span>Vendeur vérifié</span>
                    </div>
                  )}

                  {/* Note sur la confidentialité */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                      <div className="text-xs text-blue-700">
                        <div className="font-medium mb-1">Protection des données</div>
                        <div>Les informations de contact du vendeur sont protégées. Utilisez le bouton "Initier l'achat" pour commencer la transaction en toute sécurité.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>          </div>
        </div>
      </div>

      {/* Modal de contact */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter {parcelle.seller.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Votre nom</Label>
              <Input id="name" placeholder="Nom complet" />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" placeholder="+221 XX XXX XX XX" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@exemple.com" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Je suis intéressé(e) par cette parcelle..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Envoyer
              </Button>
              <Button variant="outline" className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Appeler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de carte */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Map className="w-5 h-5 mr-2 text-blue-600" />
              Localisation : {parcelle.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-1">Adresse</div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {parcelle.address.full}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-1">Coordonnées GPS</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="bg-blue-50 p-2 rounded">
                          Lat: {parcelle.address.coordinates.latitude}
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          Lng: {parcelle.address.coordinates.longitude}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-2">Points de repère</div>
                      <div className="space-y-1">
                        {parcelle.address.nearby_landmarks.map((landmark, index) => (
                          <div key={index} className="flex items-start text-xs text-gray-600">
                            <Navigation className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                            <span>{landmark}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={openGoogleMaps} 
                      className="w-full text-sm"
                      variant="outline"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Ouvrir dans Google Maps
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardContent className="p-4 h-full">
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-100 to-blue-50">
                        <div className="absolute top-20 left-0 w-full h-2 bg-gray-300 opacity-50"></div>
                        <div className="absolute top-32 left-0 w-full h-1 bg-gray-400 opacity-30"></div>
                        <div className="absolute left-20 top-0 w-2 h-full bg-gray-300 opacity-50"></div>
                        
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="relative">
                            <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                              <Home className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg border">
                              <div className="text-xs font-medium">{parcelle.surface}m²</div>
                              <div className="text-xs text-gray-500">{parcelle.type}</div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-1/4 left-1/4">
                          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-1 py-0.5 rounded text-xs shadow border">
                            Université
                          </div>
                        </div>
                        
                        <div className="absolute top-3/4 right-1/4">
                          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-1 py-0.5 rounded text-xs shadow border">
                            Plage
                          </div>
                        </div>

                        <div className="absolute top-1/3 right-1/3">
                          <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-1 py-0.5 rounded text-xs shadow border">
                            Centre Commercial
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border">
                        <div className="flex items-start">
                          <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-gray-600">
                            <strong>Carte interactive simulée</strong><br />
                            Cliquez sur "Ouvrir dans Google Maps" pour la localisation exacte avec navigation GPS.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParcelleDetailPage;

