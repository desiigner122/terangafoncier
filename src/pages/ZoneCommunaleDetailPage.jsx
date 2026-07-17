import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, MapPin, Building2, Users, Calendar, Clock, FileText,
  CheckCircle, AlertTriangle, Info, Phone, Mail, Globe, Shield,
  Download, Upload, Euro, TrendingUp, Map, Navigation, Zap
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
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const ZoneCommunaleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Formulaire de candidature
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    maritalStatus: '',
    monthlyIncome: '',
    parcelSize: '',
    motivation: ''
  });
  const [submittingApplication, setSubmittingApplication] = useState(false);
  const [applicationFeedback, setApplicationFeedback] = useState(null); // { type: 'success' | 'error', message }

  useEffect(() => {
    let isMounted = true;

    const fetchZone = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('communal_zones')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (isMounted) {
          setZone(data || null);
          setActiveImageIndex(0);
        }
      } catch (err) {
        console.error('Erreur chargement zone communale:', err);
        if (isMounted) setZone(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchZone();
    } else {
      setZone(null);
      setLoading(false);
    }

    return () => { isMounted = false; };
  }, [id]);

  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(Number(price))) return '—';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(Number(price));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Non renseigné';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Non renseigné';
    return d.toLocaleDateString('fr-FR');
  };

  const calculateDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) return null;
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleApply = () => {
    setApplicationFeedback(null);
    setShowApplicationModal(true);
  };

  const handleContact = () => {
    setShowContactModal(true);
  };

  const handleShowMap = () => {
    setShowMapModal(true);
  };

  const openGoogleMaps = () => {
    if (zone?.latitude != null && zone?.longitude != null) {
      const url = `https://www.google.com/maps?q=${zone.latitude},${zone.longitude}`;
      window.open(url, '_blank');
    }
  };

  const handleSubmitApplication = async () => {
    if (!user) {
      setApplicationFeedback({
        type: 'error',
        message: 'Veuillez vous connecter pour déposer votre candidature.'
      });
      return;
    }

    setSubmittingApplication(true);
    setApplicationFeedback(null);
    try {
      const { error } = await supabase
        .from('communal_requests')
        .insert({
          applicant_id: user.id,
          applicant_name: applicationForm.fullName || profile?.full_name || null,
          commune: zone?.commune || null,
          zone: zone?.nom || null,
          type: zone?.project_type || null,
          surface: applicationForm.parcelSize || null,
          status: 'pending'
        });

      if (error) throw error;

      setApplicationFeedback({
        type: 'success',
        message: 'Votre candidature a bien été enregistrée. Vous serez contacté pour la suite du processus.'
      });
      setApplicationForm({
        fullName: '',
        email: '',
        phone: '',
        maritalStatus: '',
        monthlyIncome: '',
        parcelSize: '',
        motivation: ''
      });
    } catch (err) {
      console.error('Erreur envoi candidature:', err);
      setApplicationFeedback({
        type: 'error',
        message: "Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer."
      });
    } finally {
      setSubmittingApplication(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-lg font-medium text-gray-700">Chargement de la zone communale...</div>
          <div className="text-sm text-gray-500 mt-2">Récupération des informations officielles</div>
        </div>
      </div>
    );
  }

  if (!zone) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Zone non trouvée</h2>
          <p className="text-gray-600 mb-4">La zone communale demandée n'existe pas ou n'est plus disponible.</p>
          <Button onClick={() => navigate('/parcelles-communales')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux zones communales
          </Button>
        </div>
      </div>
    );
  }

  // Normalisation des colonnes jsonb (états vides honnêtes si absentes)
  const zoneName = zone.nom || 'Zone communale';
  const images = Array.isArray(zone.images) && zone.images.length > 0
    ? zone.images
    : (zone.image_url ? [zone.image_url] : []);
  const sizeDistribution = (zone.size_distribution && typeof zone.size_distribution === 'object' && !Array.isArray(zone.size_distribution))
    ? zone.size_distribution
    : {};
  const parcelSizes = Object.keys(sizeDistribution);
  const infrastructure = (zone.infrastructure && typeof zone.infrastructure === 'object' && !Array.isArray(zone.infrastructure))
    ? zone.infrastructure
    : {};
  const infraCompleted = Array.isArray(infrastructure.completed) ? infrastructure.completed : [];
  const infraInProgress = Array.isArray(infrastructure.in_progress) ? infrastructure.in_progress : [];
  const infraPlanned = Array.isArray(infrastructure.planned) ? infrastructure.planned : [];
  const eligibilityCriteria = Array.isArray(zone.eligibility_criteria) ? zone.eligibility_criteria : [];
  const requiredDocuments = Array.isArray(zone.required_documents) ? zone.required_documents : [];
  const contactInfo = (zone.contact_info && typeof zone.contact_info === 'object') ? zone.contact_info : {};
  const documents = Array.isArray(zone.documents) ? zone.documents : [];
  const socialFacilities = Array.isArray(zone.social_facilities) ? zone.social_facilities : [];
  const transport = (zone.transport && typeof zone.transport === 'object') ? zone.transport : {};
  const busLines = Array.isArray(transport.bus_lines) ? transport.bus_lines : [];

  const attributionFeesList = Object.values(sizeDistribution)
    .map(s => s?.attribution_fees)
    .filter(v => v !== null && v !== undefined && !isNaN(Number(v)));
  const minAttributionFees = attributionFeesList.length > 0 ? Math.min(...attributionFeesList.map(Number)) : null;

  const daysUntilDeadline = calculateDaysUntilDeadline(zone.application_deadline);
  const addressText = [zoneName, zone.commune, zone.region].filter(Boolean).join(', ') || 'Non renseigné';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Helmet>
        <title>{zoneName} - {zone.commune || 'Commune'} | Teranga Foncier</title>
        <meta name="description" content={zone.description || `Zone communale ${zoneName}`} />
      </Helmet>

      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/parcelles-communales')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux zones communales
            </Button>

            <div className="flex items-center space-x-3">
              {zone.status && (
                <Badge className="bg-green-500 text-white">
                  <Building2 className="w-3 h-3 mr-1" />
                  {zone.status}
                </Badge>
              )}
              {daysUntilDeadline !== null && (
                <Badge className={`${daysUntilDeadline <= 7 ? 'bg-red-500' : daysUntilDeadline <= 30 ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}>
                  <Clock className="w-3 h-3 mr-1" />
                  {daysUntilDeadline} jours restants
                </Badge>
              )}
              <Badge className="bg-purple-500 text-white">
                <Users className="w-3 h-3 mr-1" />
                {zone.available_parcels ?? '—'} parcelles disponibles
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">

            {/* Galerie d'images */}
            <Card className="overflow-hidden">
              {images.length > 0 ? (
                <>
                  <div className="relative">
                    <img
                      src={images[activeImageIndex]}
                      alt={zoneName}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black bg-opacity-70 text-white">
                        {activeImageIndex + 1} / {images.length}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button size="sm" variant="secondary" className="bg-white bg-opacity-90" onClick={handleShowMap}>
                        <Map className="w-4 h-4 mr-1" />
                        Plan Interactif
                      </Button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex space-x-2 overflow-x-auto">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                            activeImageIndex === index ? 'border-green-500' : 'border-gray-200'
                          }`}
                        >
                          <img src={image} alt={`Vue ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-96 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                  <Building2 className="w-12 h-12 mb-3 text-gray-400" />
                  <div className="text-sm">Aucune image disponible pour cette zone</div>
                </div>
              )}
            </Card>

            {/* Informations principales */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {zoneName}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {zone.commune ? (
                        <ProfileLink
                          type="municipality"
                          id={zone.commune}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                          external={true}
                        >
                          {zone.commune}
                        </ProfileLink>
                      ) : (
                        <span>Commune non renseignée</span>
                      )}
                      {zone.region ? `, ${zone.region}` : ''}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      {zone.project_type || 'Type de projet non renseigné'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Frais d'attribution à partir de</div>
                    <div className="text-2xl font-bold text-green-600">
                      {minAttributionFees !== null
                        ? formatPrice(minAttributionFees)
                        : (zone.prix_m2 != null ? `${formatPrice(zone.prix_m2)} / m²` : '—')}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>

                {/* Statistiques principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{zone.available_parcels ?? '—'}</div>
                    <div className="text-sm text-gray-600">Parcelles Disponibles</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{zone.total_parcels ?? '—'}</div>
                    <div className="text-sm text-gray-600">Parcelles au Total</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{zone.allocated_parcels ?? '—'}</div>
                    <div className="text-sm text-gray-600">Parcelles Attribuées</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{daysUntilDeadline !== null ? daysUntilDeadline : '—'}</div>
                    <div className="text-sm text-gray-600">Jours Restants</div>
                  </div>
                </div>

                {/* Alerte deadline */}
                {daysUntilDeadline !== null && daysUntilDeadline <= 30 && (
                  <div className={`p-4 rounded-lg mb-6 ${
                    daysUntilDeadline <= 7 ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <div className="flex items-center">
                      <AlertTriangle className={`w-5 h-5 mr-2 ${
                        daysUntilDeadline <= 7 ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div>
                        <div className="font-bold">
                          {daysUntilDeadline <= 7 ? 'Attention - Délai expirant bientôt !' : 'Rappel - Date limite approche'}
                        </div>
                        <div className="text-sm">
                          Plus que {daysUntilDeadline} jours pour déposer votre dossier de candidature.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {zone.description || 'Aucune description disponible pour cette zone.'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onglets détaillés */}
            <Card>
              <Tabs defaultValue="parcels" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="parcels">Parcelles</TabsTrigger>
                  <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                  <TabsTrigger value="eligibility">Éligibilité</TabsTrigger>
                  <TabsTrigger value="process">Processus</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                {/* Onglet Parcelles */}
                <TabsContent value="parcels" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Répartition des Parcelles</h3>

                    {parcelSizes.length > 0 ? (
                      <div className="space-y-4">
                        {Object.entries(sizeDistribution).map(([size, info]) => {
                          const count = Number(info?.count);
                          const available = Number(info?.available);
                          const hasCounts = !isNaN(count) && count > 0 && !isNaN(available);
                          const attributionFees = info?.attribution_fees;
                          const developmentFees = info?.development_fees;
                          return (
                            <div key={size} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="font-bold text-lg">{size}</div>
                                  <div className="text-sm text-gray-600">
                                    {hasCounts ? `${available} disponibles sur ${count}` : 'Disponibilité non renseignée'}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-600">Frais d'attribution</div>
                                  <div className="text-lg font-bold text-green-600">{formatPrice(attributionFees)}</div>
                                  <div className="text-sm text-gray-600 mt-1">+ Viabilisation: {formatPrice(developmentFees)}</div>
                                  {attributionFees != null && developmentFees != null && (
                                    <div className="text-xs text-blue-600 font-bold">Total: {formatPrice(Number(attributionFees) + Number(developmentFees))}</div>
                                  )}
                                </div>
                              </div>
                              {hasCounts && (
                                <>
                                  <Progress value={(available / count) * 100} className="h-2" />
                                  <div className="text-xs text-gray-500 mt-1">
                                    {Math.round((available / count) * 100)}% disponible
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                        La répartition détaillée des parcelles n'est pas encore renseignée pour cette zone.
                        {(zone.superficie_min != null || zone.superficie_max != null) && (
                          <div className="mt-2 text-gray-700">
                            Superficies : {zone.superficie_min ?? '—'} m² à {zone.superficie_max ?? '—'} m²
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Modalités de Paiement des Frais</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Frais d'attribution : à payer à la signature (non remboursable)</li>
                        <li>• Frais de viabilisation : échelonnement possible selon la commune</li>
                        <li>• Modalités détaillées : disponibles auprès de la mairie</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Infrastructure */}
                <TabsContent value="infrastructure" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">État d'Avancement des Travaux</h3>

                    {(infraCompleted.length > 0 || infraInProgress.length > 0 || infraPlanned.length > 0) ? (
                      <div className="space-y-4">
                        {infraCompleted.length > 0 && (
                          <div>
                            <h4 className="font-bold text-green-600 mb-3">Travaux Terminés</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {infraCompleted.map((item, index) => (
                                <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {infraInProgress.length > 0 && (
                          <div>
                            <h4 className="font-bold text-blue-600 mb-3">Travaux en Cours</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {infraInProgress.map((item, index) => (
                                <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                                  <Zap className="w-5 h-5 text-blue-600 mr-3" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {infraPlanned.length > 0 && (
                          <div>
                            <h4 className="font-bold text-gray-600 mb-3">Travaux Planifiés</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {infraPlanned.map((item, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                  <Clock className="w-5 h-5 text-gray-600 mr-3" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                        Aucune information d'infrastructure renseignée pour le moment.
                      </div>
                    )}

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Équipements Sociaux Prévus</h4>
                      {socialFacilities.length > 0 ? (
                        <div className="space-y-3">
                          {socialFacilities.map((facility, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center">
                                <Building2 className="w-5 h-5 text-blue-600 mr-3" />
                                <div>
                                  <div className="font-medium">{facility?.type || 'Équipement'}</div>
                                  <div className="text-sm text-gray-600">Distance: {facility?.distance || '—'}</div>
                                </div>
                              </div>
                              <Badge variant={facility?.status === 'Planifié' ? 'default' : facility?.status === 'Approuvé' ? 'secondary' : 'outline'}>
                                {facility?.status || 'Non renseigné'}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                          Aucun équipement social renseigné pour le moment.
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Éligibilité */}
                <TabsContent value="eligibility" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Critères d'Éligibilité</h3>

                    {eligibilityCriteria.length > 0 ? (
                      <div className="space-y-3">
                        {eligibilityCriteria.map((criterion, index) => (
                          <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                            <span className="text-gray-800">{typeof criterion === 'string' ? criterion : (criterion?.label || '—')}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                        Les critères d'éligibilité seront bientôt disponibles. Contactez la mairie pour plus d'informations.
                      </div>
                    )}

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-start">
                        <Info className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <div className="font-bold text-yellow-800">Important</div>
                          <div className="text-yellow-700 text-sm mt-1">
                            Tous les critères doivent être respectés pour être éligible.
                            Une vérification rigoureuse sera effectuée lors de l'instruction du dossier.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Documents Requis</h4>
                      {requiredDocuments.length > 0 ? (
                        <div className="space-y-2">
                          {requiredDocuments.map((doc, index) => (
                            <div key={index} className="flex items-center p-3 border-l-4 border-green-500 bg-green-50">
                              <FileText className="w-4 h-4 text-green-600 mr-3" />
                              <span className="text-sm">{typeof doc === 'string' ? doc : (doc?.name || '—')}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                          La liste des documents requis n'est pas encore renseignée.
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Processus */}
                <TabsContent value="process" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Processus d'Attribution</h3>

                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">1</div>
                        <div>
                          <div className="font-bold">Dépôt de Candidature</div>
                          <div className="text-sm text-gray-600">
                            {zone.application_deadline ? `Avant le ${formatDate(zone.application_deadline)}` : 'Date limite non renseignée'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center mr-4">2</div>
                        <div>
                          <div className="font-bold">Instruction des Dossiers</div>
                          <div className="text-sm text-gray-600">Vérification des critères d'éligibilité</div>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mr-4">3</div>
                        <div>
                          <div className="font-bold">Sélection</div>
                          <div className="text-sm text-gray-600">
                            {zone.selection_date ? `Le ${formatDate(zone.selection_date)} en séance publique` : 'Date de sélection non renseignée'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center p-4 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-4">4</div>
                        <div>
                          <div className="font-bold">Attribution et Signature</div>
                          <div className="text-sm text-gray-600">Remise des actes d'attribution</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-3">Statistiques du Processus</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Demandes reçues</div>
                          <div className="text-lg font-bold">—</div>
                          <div className="text-xs text-gray-500">Statistiques bientôt disponibles</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Temps de traitement moyen</div>
                          <div className="text-lg font-bold">—</div>
                          <div className="text-xs text-gray-500">Statistiques bientôt disponibles</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Documents */}
                <TabsContent value="documents" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Documents Officiels</h3>

                    {documents.length > 0 ? (
                      documents.map((doc, index) => (
                        <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-blue-600 mr-3" />
                            <div>
                              <div className="font-medium">{doc?.name || 'Document'}</div>
                              <div className="text-sm text-gray-600">{doc?.type || '—'} • {doc?.size || '—'}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc?.verified && (
                              <Badge className="bg-green-500 text-white">
                                <Shield className="w-3 h-3 mr-1" />
                                Vérifié
                              </Badge>
                            )}
                            {doc?.url ? (
                              <Button size="sm" variant="outline" onClick={() => window.open(doc.url, '_blank')}>
                                <Download className="w-4 h-4 mr-1" />
                                Télécharger
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                <Download className="w-4 h-4 mr-1" />
                                Bientôt disponible
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                        Aucun document officiel n'est disponible pour le moment.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Actions principales */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button onClick={handleApply} className="w-full bg-green-600 hover:bg-green-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Déposer ma Candidature
                  </Button>

                  <Button onClick={handleContact} variant="outline" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Contacter la Mairie
                  </Button>

                  <Button onClick={handleShowMap} variant="outline" className="w-full">
                    <Map className="w-4 h-4 mr-2" />
                    Voir sur la Carte
                  </Button>

                  <Button variant="outline" className="w-full" disabled>
                    <Download className="w-4 h-4 mr-2" />
                    Dossier Complet PDF (bientôt disponible)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Mairie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Officiel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium text-gray-900">{contactInfo.responsible || 'Non renseigné'}</div>
                    <div className="text-sm text-blue-600">{contactInfo.title || 'Mairie de la commune'}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{contactInfo.phone || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{contactInfo.email || 'Non renseigné'}</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <span>{contactInfo.office_address || 'Non renseigné'}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">Horaires d'ouverture</div>
                    <div className="text-sm text-blue-700">{contactInfo.office_hours || 'Non renseigné'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Localisation et Carte */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  Localisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Adresse complète */}
                  <div>
                    <div className="font-medium text-sm text-gray-700 mb-2">Adresse</div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {addressText}
                    </div>
                  </div>

                  {/* Coordonnées GPS */}
                  <div>
                    <div className="font-medium text-sm text-gray-700 mb-2">Coordonnées GPS</div>
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <div>Latitude: {zone.latitude ?? 'Non renseigné'}</div>
                      <div>Longitude: {zone.longitude ?? 'Non renseigné'}</div>
                    </div>
                  </div>

                  {/* Points de repère */}
                  <div>
                    <div className="font-medium text-sm text-gray-700 mb-2">Points de repère</div>
                    <div className="text-sm text-gray-500">Non renseigné</div>
                  </div>

                  {/* Boutons de carte */}
                  <div className="space-y-2 pt-2">
                    <Button
                      onClick={handleShowMap}
                      variant="outline"
                      className="w-full text-sm"
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Voir la carte interactive
                    </Button>
                    <Button
                      onClick={openGoogleMaps}
                      variant="outline"
                      className="w-full text-sm"
                      disabled={zone.latitude == null || zone.longitude == null}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Ouvrir dans Google Maps
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transport et Accès */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transport & Accès</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-sm text-gray-700">Lignes de Bus</div>
                    {busLines.length > 0 ? (
                      <div className="flex space-x-1 mt-1">
                        {busLines.map((line, index) => (
                          <Badge key={index} variant="secondary">{line}</Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mt-1">Non renseigné</div>
                    )}
                  </div>

                  <div>
                    <div className="font-medium text-sm text-gray-700">Station BRT la plus proche</div>
                    <div className="text-sm text-gray-600">{transport.nearest_brt_station || 'Non renseigné'}</div>
                  </div>

                  <div>
                    <div className="font-medium text-sm text-gray-700">Qualité des routes</div>
                    <div className="text-sm text-gray-600">{transport.road_quality || 'Non renseigné'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendrier important */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dates Importantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-sm font-medium">Limite candidatures</span>
                    <span className="text-sm text-red-600">{formatDate(zone.application_deadline)}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm font-medium">Sélection</span>
                    <span className="text-sm text-blue-600">{formatDate(zone.selection_date)}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">Livraison prévue</span>
                    <span className="text-sm text-green-600">{formatDate(zone.delivery_date)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Candidature */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Déposer une Candidature</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="font-bold text-blue-900">Zone sélectionnée</div>
              <div className="text-blue-700">{zoneName}</div>
              <div className="text-sm text-blue-600">
                {zone.commune ? (
                  <ProfileLink
                    type="municipality"
                    id={zone.commune}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                    external={true}
                  >
                    {zone.commune}
                  </ProfileLink>
                ) : (
                  <span>Commune non renseignée</span>
                )}
                {zone.region ? `, ${zone.region}` : ''}
              </div>
            </div>

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <strong>Connexion requise :</strong> vous devez être connecté pour déposer une candidature.{' '}
                    <Link to="/login" className="text-blue-600 underline font-medium">Se connecter</Link>
                  </div>
                </div>
              </div>
            )}

            {applicationFeedback && (
              <div className={`p-4 rounded-lg text-sm ${
                applicationFeedback.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {applicationFeedback.message}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Prénom et Nom</Label>
                <Input
                  placeholder="Prénom NOM"
                  value={applicationForm.fullName}
                  onChange={(e) => setApplicationForm(f => ({ ...f, fullName: e.target.value }))}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  value={applicationForm.email}
                  onChange={(e) => setApplicationForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input
                  placeholder="+221 XX XXX XX XX"
                  value={applicationForm.phone}
                  onChange={(e) => setApplicationForm(f => ({ ...f, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label>Situation familiale</Label>
                <Select
                  value={applicationForm.maritalStatus}
                  onValueChange={(value) => setApplicationForm(f => ({ ...f, maritalStatus: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celibataire">Célibataire</SelectItem>
                    <SelectItem value="marie">Marié(e)</SelectItem>
                    <SelectItem value="divorce">Divorcé(e)</SelectItem>
                    <SelectItem value="veuf">Veuf/Veuve</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Revenus mensuels (FCFA)</Label>
                <Input
                  type="number"
                  placeholder="500000"
                  value={applicationForm.monthlyIncome}
                  onChange={(e) => setApplicationForm(f => ({ ...f, monthlyIncome: e.target.value }))}
                />
              </div>
              <div>
                <Label>Taille de parcelle souhaitée</Label>
                {parcelSizes.length > 0 ? (
                  <Select
                    value={applicationForm.parcelSize}
                    onValueChange={(value) => setApplicationForm(f => ({ ...f, parcelSize: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      {parcelSizes.map(size => (
                        <SelectItem key={size} value={size}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    placeholder="Ex: 300 m²"
                    value={applicationForm.parcelSize}
                    onChange={(e) => setApplicationForm(f => ({ ...f, parcelSize: e.target.value }))}
                  />
                )}
              </div>
            </div>

            <div>
              <Label>Motivation</Label>
              <Textarea
                placeholder="Expliquez pourquoi vous candidatez pour cette zone et votre projet de construction..."
                rows={4}
                value={applicationForm.motivation}
                onChange={(e) => setApplicationForm(f => ({ ...f, motivation: e.target.value }))}
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-800">
                <strong>Prochaine étape :</strong> après validation de ce formulaire, vous recevrez un email avec la liste complète des documents à fournir et les modalités de dépôt physique du dossier.
              </div>
            </div>

            <div className="flex space-x-3">
              {user ? (
                <Button className="flex-1" onClick={handleSubmitApplication} disabled={submittingApplication}>
                  <Upload className="w-4 h-4 mr-2" />
                  {submittingApplication ? 'Envoi en cours...' : 'Valider la Candidature'}
                </Button>
              ) : (
                <Button className="flex-1" onClick={() => navigate('/login')}>
                  <Upload className="w-4 h-4 mr-2" />
                  Se connecter pour candidater
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowApplicationModal(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Contact */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter la Mairie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="font-bold text-green-900">{contactInfo.responsible || 'Mairie'}</div>
              <div className="text-green-700">{contactInfo.title || (zone.commune ? `Commune de ${zone.commune}` : 'Non renseigné')}</div>
              <div className="text-sm text-green-600 mt-2">{contactInfo.office_hours || 'Horaires non renseignés'}</div>
            </div>

            <div>
              <Label>Votre nom</Label>
              <Input placeholder="Prénom NOM" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="email@exemple.com" />
            </div>
            <div>
              <Label>Sujet</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le sujet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eligibilite">Question sur l'éligibilité</SelectItem>
                  <SelectItem value="documents">Documents requis</SelectItem>
                  <SelectItem value="processus">Processus d'attribution</SelectItem>
                  <SelectItem value="visite">Demande de visite du site</SelectItem>
                  <SelectItem value="autre">Autre question</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Message</Label>
              <Textarea placeholder="Votre question..." rows={4} />
            </div>

            <div className="flex space-x-3">
              {contactInfo.email ? (
                <Button className="flex-1" onClick={() => { window.location.href = `mailto:${contactInfo.email}`; }}>
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer
                </Button>
              ) : (
                <Button className="flex-1" disabled>
                  <Mail className="w-4 h-4 mr-2" />
                  Email non renseigné
                </Button>
              )}
              {contactInfo.phone ? (
                <Button variant="outline" className="flex-1" onClick={() => { window.location.href = `tel:${contactInfo.phone}`; }}>
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler
                </Button>
              ) : (
                <Button variant="outline" className="flex-1" disabled>
                  <Phone className="w-4 h-4 mr-2" />
                  Téléphone non renseigné
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Carte Interactive */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Map className="w-5 h-5 mr-2 text-blue-600" />
              Localisation : {zoneName}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              {/* Informations de localisation */}
              <div className="lg:col-span-1 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-1">Adresse</div>
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        {addressText}
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-1">Coordonnées GPS</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="bg-blue-50 p-2 rounded">
                          Lat: {zone.latitude ?? 'Non renseigné'}
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          Lng: {zone.longitude ?? 'Non renseigné'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-2">Accessibilité</div>
                      <div className="text-sm text-gray-500">Non renseigné</div>
                    </div>

                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-2">Points de repère</div>
                      <div className="text-sm text-gray-500">Non renseigné</div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Button
                        onClick={openGoogleMaps}
                        className="w-full text-sm"
                        variant="outline"
                        disabled={zone.latitude == null || zone.longitude == null}
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Ouvrir dans Google Maps
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Carte interactive */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardContent className="p-4 h-full">
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                      {/* Aperçu de carte simplifié */}
                      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-100 to-green-50">
                        {/* Routes principales simulées */}
                        <div className="absolute top-20 left-0 w-full h-2 bg-gray-300 opacity-50"></div>
                        <div className="absolute top-32 left-0 w-full h-1 bg-gray-400 opacity-30"></div>
                        <div className="absolute left-20 top-0 w-2 h-full bg-gray-300 opacity-50"></div>

                        {/* Marker principal de la zone */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="relative">
                            <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg border">
                              <div className="text-xs font-medium">{zoneName}</div>
                              <div className="text-xs text-gray-500">{zone.commune || '—'}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message d'information */}
                      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border">
                        <div className="flex items-start">
                          <Info className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-gray-600">
                            <strong>Carte interactive simulée</strong><br />
                            Cliquez sur "Ouvrir dans Google Maps" pour voir la localisation exacte avec navigation GPS.
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

export default ZoneCommunaleDetailPage;
