import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, MapPin, Share2, Heart, Calculator, Calendar,
  User, Phone, Mail, MessageSquare, CheckCircle, AlertTriangle,
  Database, Shield, Brain, Sparkles, Network, Globe, Building2,
  Camera, Play, Download, FileText, Star, Zap, TrendingUp,
  Clock, Users, Navigation, Coins, CreditCard, Smartphone,
  Eye, Euro, Wifi, Car, Home, ShoppingCart
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
import { supabase } from '@/lib/supabaseClient';

// Placeholder local (data URI SVG) utilisé quand la parcelle n'a aucune photo
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">' +
    '<rect width="800" height="600" fill="#e2e8f0"/>' +
    '<text x="400" y="290" font-family="sans-serif" font-size="28" fill="#64748b" text-anchor="middle">Aucune photo disponible</text>' +
    '<text x="400" y="330" font-family="sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">Teranga Foncier</text>' +
    '</svg>'
  );

const ParcelleDetailPageBlockchain = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parcelle, setParcelle] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFinancingModal, setShowFinancingModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Calculateur rapide (vraie formule d'amortissement sur le prix réel)
  const [downPayment, setDownPayment] = useState('');
  const [loanYears, setLoanYears] = useState('');
  const [annualRate, setAnnualRate] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadParcelle = async () => {
      setLoading(true);
      try {
        const { data: property, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (cancelled) return;

        if (error || !property) {
          console.error('Erreur chargement propriété:', error);
          setParcelle(null);
          setLoading(false);
          return;
        }

        setParcelle(property);

        // Galerie photos (table property_photos), photo principale en premier
        const { data: photoRows } = await supabase
          .from('property_photos')
          .select('id, url, is_primary')
          .eq('property_id', property.id)
          .order('is_primary', { ascending: false });

        if (!cancelled) {
          const urls = (photoRows || []).map((p) => p.url).filter(Boolean);
          setPhotos(urls.length > 0 ? urls : [PLACEHOLDER_IMAGE]);
        }

        // Vendeur (profiles via owner_id) — aucune note fictive
        if (property.owner_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', property.owner_id)
            .single();
          if (!cancelled) setSeller(profile || null);
        }
      } catch (err) {
        console.error('Erreur chargement parcelle:', err);
        if (!cancelled) setParcelle(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadParcelle();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(Number(price))) return '—';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const pricePerM2 =
    parcelle && parcelle.price && parcelle.surface && Number(parcelle.surface) > 0
      ? Math.round(Number(parcelle.price) / Number(parcelle.surface))
      : null;

  const isTokenized =
    parcelle &&
    (parcelle.nft_token_id ||
      parcelle.blockchain_hash ||
      parcelle.transaction_hash ||
      parcelle.smart_contract_address);

  // Mensualité: formule d'amortissement M = C * r / (1 - (1+r)^-n)
  const computeMonthly = () => {
    if (!parcelle || !parcelle.price) return null;
    const principal = Number(parcelle.price) - (Number(downPayment) || 0);
    const years = Number(loanYears);
    const rate = Number(annualRate);
    if (!years || years <= 0 || principal <= 0) return null;
    const n = years * 12;
    if (!rate || rate <= 0) return principal / n; // prêt à taux nul
    const r = rate / 100 / 12;
    return (principal * r) / (1 - Math.pow(1 + r, -n));
  };
  const monthlyPayment = computeMonthly();

  const sellerName =
    seller?.full_name || seller?.nom || seller?.name || seller?.email || 'Non renseigné';

  const handleScheduleVisit = () => {
    setShowVisitModal(true);
  };

  const handleContact = () => {
    setShowContactModal(true);
  };

  const handleFinancing = () => {
    setShowFinancingModal(true);
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
          <div className="text-sm text-gray-500 mt-2">Vérification blockchain en cours</div>
        </div>
      </div>
    );
  }

  if (!parcelle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Parcelle non trouvée</h2>
          <p className="text-gray-600 mb-4">La parcelle demandée n'existe pas ou a été supprimée.</p>
          <Button onClick={() => navigate('/parcelles-vendeurs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux parcelles
          </Button>
        </div>
      </div>
    );
  }

  const parcelleTitle = parcelle.title || parcelle.name || 'Parcelle';
  const galleryImages = photos.length > 0 ? photos : [PLACEHOLDER_IMAGE];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>{parcelleTitle} - Blockchain | Teranga Foncier</title>
        <meta
          name="description"
          content={parcelle.description ? String(parcelle.description).slice(0, 160) : parcelleTitle}
        />
      </Helmet>

      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/parcelles-vendeurs')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux parcelles
            </Button>

            <div className="flex items-center space-x-3">
              {parcelle.nft_token_id ? (
                <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  <Database className="w-3 h-3 mr-1" />
                  NFT #{parcelle.nft_token_id}
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  <Database className="w-3 h-3 mr-1" />
                  Non tokenisé
                </Badge>
              )}
              {(parcelle.verification_status || parcelle.status) && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <Shield className="w-3 h-3 mr-1" />
                  {parcelle.verification_status === 'verified' ? 'Vérifié' : (parcelle.verification_status || parcelle.status)}
                </Badge>
              )}
              {parcelle.ai_score !== null && parcelle.ai_score !== undefined && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  <Brain className="w-3 h-3 mr-1" />
                  Score IA: {parcelle.ai_score}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Colonne principale - Images et informations */}
          <div className="lg:col-span-2 space-y-6">

            {/* Galerie d'images */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={galleryImages[activeImageIndex] || galleryImages[0]}
                  alt={parcelleTitle}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black bg-opacity-70 text-white">
                    {Math.min(activeImageIndex + 1, galleryImages.length)} / {galleryImages.length}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="sm" variant="secondary" className="bg-white bg-opacity-90">
                    <Camera className="w-4 h-4 mr-1" />
                    Visite 360°
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white bg-opacity-90">
                    <Play className="w-4 h-4 mr-1" />
                    Drone
                  </Button>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Button
                    size="sm"
                    variant={isFavorite ? "default" : "secondary"}
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-white bg-opacity-90"}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                        activeImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Informations principales */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {parcelleTitle}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      {[parcelle.location, parcelle.commune, parcelle.city, parcelle.region]
                        .filter(Boolean)
                        .filter((v, i, arr) => arr.indexOf(v) === i)
                        .join(', ') || 'Localisation non renseignée'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {formatPrice(parcelle.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {pricePerM2 !== null ? `${formatPrice(pricePerM2)}/m²` : '—/m²'}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{parcelle.surface ?? '—'}</div>
                    <div className="text-sm text-gray-600">Surface (m²)</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{parcelle.ai_score ?? '—'}</div>
                    <div className="text-sm text-gray-600">Score IA</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{parcelle.nft_readiness_score ?? '—'}</div>
                    <div className="text-sm text-gray-600">Préparation NFT</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{parcelle.views_count ?? '—'}</div>
                    <div className="text-sm text-gray-600">Vues</div>
                  </div>
                </div>

                {/* Estimations réelles (colonnes properties) */}
                {(parcelle.estimated_value !== null && parcelle.estimated_value !== undefined) ||
                (parcelle.market_value !== null && parcelle.market_value !== undefined) ? (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center mb-3">
                      <Brain className="w-5 h-5 text-blue-600 mr-2" />
                      <h3 className="font-bold text-gray-900">Estimations</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                      <div>
                        <div className="text-sm text-gray-600">Valeur estimée</div>
                        <div className="font-bold text-green-600">{formatPrice(parcelle.estimated_value)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Valeur de marché</div>
                        <div className="font-bold text-purple-600">{formatPrice(parcelle.market_value)}</div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Description */}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {parcelle.description || 'Aucune description renseignée.'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onglets détaillés */}
            <Card>
              <Tabs defaultValue="blockchain" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                  <TabsTrigger value="features">Caractéristiques</TabsTrigger>
                  <TabsTrigger value="roi">ROI & Analyse</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                {/* Onglet Blockchain */}
                <TabsContent value="blockchain" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">Informations Blockchain</h3>
                      {isTokenized ? (
                        <Badge className="bg-green-500 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Tokenisé
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                          Non tokenisé
                        </Badge>
                      )}
                    </div>

                    {isTokenized ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">Token ID</div>
                          <div className="font-mono text-lg">{parcelle.nft_token_id ?? '—'}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">Adresse du Contrat</div>
                          <div className="font-mono text-sm break-all">{parcelle.smart_contract_address ?? '—'}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">Hash Blockchain</div>
                          <div className="font-mono text-sm break-all">{parcelle.blockchain_hash ?? '—'}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm text-gray-600">Hash de Transaction</div>
                          <div className="font-mono text-sm break-all">{parcelle.transaction_hash ?? '—'}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-600">
                        Cette parcelle n'est pas encore tokenisée sur la blockchain.
                        {parcelle.nft_readiness_score !== null && parcelle.nft_readiness_score !== undefined && (
                          <div className="mt-2 text-sm">
                            Score de préparation NFT :{' '}
                            <span className="font-bold text-gray-900">{parcelle.nft_readiness_score}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {parcelle.nft_readiness_score !== null && parcelle.nft_readiness_score !== undefined && isTokenized && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-900 mb-2">Score de préparation NFT</h4>
                        <div className="text-2xl font-bold text-blue-600">{parcelle.nft_readiness_score}</div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Onglet Caractéristiques */}
                <TabsContent value="features" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Caractéristiques du Terrain</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Home className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-800">Type : {parcelle.type || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-800">Région : {parcelle.region || 'Non renseignée'}</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Building2 className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-800">Commune : {parcelle.commune || parcelle.city || 'Non renseignée'}</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Navigation className="w-5 h-5 text-blue-600 mr-3" />
                        <span className="text-gray-800">
                          GPS :{' '}
                          {parcelle.latitude && parcelle.longitude
                            ? `${Number(parcelle.latitude).toFixed(5)}, ${Number(parcelle.longitude).toFixed(5)}`
                            : 'Non renseigné'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Commodités Environnantes</h4>
                      <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                        Bientôt disponible
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet ROI */}
                <TabsContent value="roi" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Analyse ROI & Rentabilité</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{formatPrice(parcelle.estimated_value)}</div>
                        <div className="text-sm text-gray-600">Valeur Estimée</div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{formatPrice(parcelle.market_value)}</div>
                        <div className="text-sm text-gray-600">Valeur de Marché</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{parcelle.ai_score ?? '—'}</div>
                        <div className="text-sm text-gray-600">Score IA</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                      Analyse ROI détaillée bientôt disponible
                    </div>

                    <Button className="w-full" onClick={handleFinancing}>
                      <Calculator className="w-4 h-4 mr-2" />
                      Calculateur ROI Personnalisé
                    </Button>
                  </div>
                </TabsContent>

                {/* Onglet Documents */}
                <TabsContent value="documents" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Documents</h3>

                    <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      Aucun document disponible pour cette parcelle.
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar - Actions et informations vendeur */}
          <div className="space-y-6">

            {/* Actions principales */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button onClick={handleContact} className="w-full bg-blue-600 hover:bg-blue-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contacter le Vendeur
                  </Button>

                  <Button onClick={handleScheduleVisit} variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Programmer une Visite
                  </Button>

                  <Button onClick={handleFinancing} variant="outline" className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Options de Financement
                  </Button>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="w-4 h-4 mr-1" />
                      Partager
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations vendeur */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations Vendeur</CardTitle>
              </CardHeader>
              <CardContent>
                {seller ? (
                  <div className="flex items-start space-x-3">
                    <img
                      src={seller.avatar_url || '/placeholder-avatar.svg'}
                      alt={sellerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{sellerName}</div>
                      <div className="text-sm text-blue-600">{seller.role || 'Vendeur'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Informations vendeur non disponibles.</div>
                )}

                <div className="mt-4 space-y-2">
                  {seller?.phone ? (
                    <a href={`tel:${seller.phone}`} className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        <Phone className="w-4 h-4 mr-2" />
                        Appeler
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      <Phone className="w-4 h-4 mr-2" />
                      Téléphone non renseigné
                    </Button>
                  )}
                  {seller?.email ? (
                    <a href={`mailto:${seller.email}`} className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" className="w-full" disabled>
                      <Mail className="w-4 h-4 mr-2" />
                      Email non renseigné
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Calculateur de financement rapide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Calculateur Rapide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm">Apport initial (FCFA)</Label>
                    <Input
                      type="number"
                      placeholder={
                        parcelle.price ? String(Math.round(Number(parcelle.price) * 0.3)) : '—'
                      }
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Taux annuel (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Ex: 7.5"
                      value={annualRate}
                      onChange={(e) => setAnnualRate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Durée (années)</Label>
                    <Select value={loanYears} onValueChange={setLoanYears}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 ans</SelectItem>
                        <SelectItem value="15">15 ans</SelectItem>
                        <SelectItem value="20">20 ans</SelectItem>
                        <SelectItem value="25">25 ans</SelectItem>
                        <SelectItem value="30">30 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Mensualité estimée</div>
                    <div className="text-lg font-bold text-blue-600">
                      {monthlyPayment !== null && isFinite(monthlyPayment)
                        ? `≈ ${formatPrice(Math.round(monthlyPayment))}/mois`
                        : '—'}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleFinancing}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcul détaillé
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modales (simplifiées pour éviter les erreurs) */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Contacter le Vendeur</h3>
            <div className="space-y-4">
              <Input placeholder="Votre nom" />
              <Input placeholder="Email" type="email" />
              <Textarea placeholder="Votre message..." rows={4} />
              <div className="flex space-x-3">
                <Button className="flex-1">Envoyer</Button>
                <Button variant="outline" onClick={() => setShowContactModal(false)}>Annuler</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showVisitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Programmer une Visite</h3>
            <div className="space-y-4">
              <Input placeholder="Votre nom" />
              <Input placeholder="Téléphone" type="tel" />
              <Input type="date" />
              <div className="flex space-x-3">
                <Button className="flex-1">Demander la visite</Button>
                <Button variant="outline" onClick={() => setShowVisitModal(false)}>Annuler</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showFinancingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Options de Financement</h3>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Prix du bien : <span className="font-bold text-gray-900">{formatPrice(parcelle.price)}</span>
              </div>
              <div className="text-sm text-gray-500">
                Utilisez le calculateur rapide pour estimer votre mensualité, ou contactez le vendeur pour
                connaître les options de financement disponibles.
              </div>
              <div className="flex space-x-3">
                <Button className="flex-1" onClick={() => { setShowFinancingModal(false); setShowContactModal(true); }}>
                  Contacter le vendeur
                </Button>
                <Button variant="outline" onClick={() => setShowFinancingModal(false)}>Fermer</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelleDetailPageBlockchain;
