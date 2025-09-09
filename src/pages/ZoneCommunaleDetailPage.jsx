import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const ZoneCommunaleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zone, setZone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [applicationProgress, setApplicationProgress] = useState(0);

  useEffect(() => {
    // Simulation de chargement des données de la zone communale
    const mockZoneData = {
      id: parseInt(id),
      name: "Zone Résidentielle Keur Massar Phase 2",
      commune: "Keur Massar",
      communeId: "keur-massar-001",
      region: "Dakar",
      project_type: "Lotissement Social",
      status: "En cours d'attribution",
      
      // Localisation et coordonnées GPS
      location: {
        address: "Keur Massar Phase 2, Route de Rufisque, Dakar, Sénégal",
        coordinates: {
          latitude: 14.7536,
          longitude: -17.3159
        },
        nearby_landmarks: [
          "Université Cheikh Anta Diop (15 km)",
          "Aéroport International Blaise Diagne (25 km)",
          "Centre commercial Keur Massar (2 km)",
          "Hôpital Régional de Keur Massar (3 km)"
        ],
        accessibility: {
          main_roads: ["Route Nationale N1", "Route de Rufisque"],
          public_transport: ["Bus TATA Ma Gueule", "Cars rapides", "Taxi collectif"],
          distance_to_city_center: "30 km de Dakar centre"
        }
      },
      
      // Informations générales
      total_parcels: 200,
      available_parcels: 147,
      allocated_parcels: 53,
      reserved_parcels: 12,
      
      // Superficie et frais
      parcel_sizes: ["300m²", "400m²", "500m²"],
      size_distribution: {
        "300m²": { count: 80, available: 58, attribution_fees: 450000, development_fees: 2800000 },
        "400m²": { count: 80, available: 61, attribution_fees: 600000, development_fees: 3600000 },
        "500m²": { count: 40, available: 28, attribution_fees: 750000, development_fees: 4500000 }
      },
      
      // Calendrier et processus
      application_deadline: "2025-03-15",
      selection_date: "2025-03-25",
      allocation_method: "Tirage au sort transparent avec critères sociaux",
      delivery_date: "2025-09-30",
      
      // Infrastructure et équipements
      infrastructure: {
        completed: ["Voiries principales", "Évacuation eaux pluviales", "Bornage parcelles"],
        in_progress: ["Réseau électrique", "Adduction d'eau", "Éclairage public"],
        planned: ["Fibres optiques", "Espaces verts", "Équipements sociaux"]
      },
      
      // Critères d'éligibilité
      eligibility_criteria: [
        "Nationalité sénégalaise ou résidence de 5 ans minimum",
        "Revenus familiaux entre 200,000 et 800,000 FCFA/mois",
        "Ne pas posséder de terrain ou logement dans la région",
        "Engagement à construire dans les 3 ans",
        "Résidence principale obligatoire"
      ],
      
      // Documents requis
      required_documents: [
        "Copie certifiée carte d'identité nationale",
        "Certificat de résidence récent (moins de 3 mois)",
        "Justificatifs de revenus (3 derniers bulletins de salaire)",
        "Attestation de non-propriété foncière",
        "Certificat de célibat ou extrait d'acte de mariage",
        "Acte de naissance des enfants à charge",
        "Projet architectural sommaire"
      ],
      
      // Contact et informations mairie
      contact_info: {
        responsible: "Mme Fatou NDIAYE",
        title: "Directrice de l'Urbanisme",
        phone: "+221 33 834 67 89",
        email: "urbanisme@keurmassar.sn",
        office_address: "Mairie de Keur Massar, Avenue Léopold Sédar Senghor",
        office_hours: "Lundi à Vendredi: 8h00 - 17h00, Samedi: 8h00 - 12h00"
      },
      
      // Images et documentation
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop', // Plan de masse
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop', // Vue aérienne
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop', // Infrastructure en cours
        'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop'  // Équipements prévus
      ],
      
      documents: [
        { name: 'Plan de Lotissement Officiel', type: 'PDF', size: '2.3 MB', verified: true },
        { name: 'Arrêté de Création de la Zone', type: 'PDF', size: '0.8 MB', verified: true },
        { name: 'Étude d\'Impact Environnemental', type: 'PDF', size: '5.1 MB', verified: true },
        { name: 'Cahier des Charges', type: 'PDF', size: '1.2 MB', verified: true },
        { name: 'Guide de Construction', type: 'PDF', size: '3.4 MB', verified: false }
      ],
      
      // Statistiques et suivi
      statistics: {
        applications_received: 1247,
        applications_validated: 892,
        waiting_list_position: null,
        success_rate: "12%",
        average_processing_time: "45 jours"
      },
      
      // Équipements sociaux prévus
      social_facilities: [
        { type: "École primaire", status: "Planifié", distance: "500m" },
        { type: "Centre de santé", status: "En étude", distance: "800m" },
        { type: "Marché de proximité", status: "Approuvé", distance: "1.2km" },
        { type: "Terrain de sport", status: "Planifié", distance: "600m" },
        { type: "Mosquée", status: "Site réservé", distance: "400m" }
      ],
      
      // Transport et accessibilité
      transport: {
        bus_lines: ["Ligne 12", "Ligne 23"],
        nearest_brt_station: "Keur Massar Centre - 2.1km",
        taxi_availability: "Très bonne",
        road_quality: "Routes principales pavées, secondaires en cours"
      },
      
      description: `🏘️ **Projet de Lotissement Social Keur Massar Phase 2**

Cette nouvelle zone résidentielle s'inscrit dans le programme national de facilitation de l'accès au logement pour les familles à revenus moyens. Située dans la commune dynamique de Keur Massar, cette zone offre un cadre de vie moderne avec toutes les commodités nécessaires.

🌍 **Développement Durable**
Le projet intègre les principes du développement durable avec des espaces verts, une gestion écologique des eaux pluviales et l'utilisation d'énergies renouvelables pour l'éclairage public.

🏗️ **Infrastructure Moderne**
Toutes les parcelles bénéficieront d'un accès direct à l'électricité, l'eau courante, l'assainissement et la fibre optique. Les voiries sont conçues selon les normes internationales.

👨‍👩‍👧‍👦 **Priorité aux Familles**
Le processus d'attribution privilégie les familles avec enfants, les jeunes couples et les primo-accédants, dans un souci d'équité sociale et de mixité générationnelle.

📋 **Processus Transparent**
L'attribution se fait par tirage au sort public, avec vérification préalable des critères d'éligibilité et notation selon une grille objective.`
    };

    // Simulation du chargement
    setTimeout(() => {
      setZone(mockZoneData);
      setLoading(false);
    }, 1200);
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleApply = () => {
    setShowApplicationModal(true);
  };

  const handleContact = () => {
    setShowContactModal(true);
  };

  const handleShowMap = () => {
    setShowMapModal(true);
  };

  const openGoogleMaps = () => {
    if (zone?.location?.coordinates) {
      const { latitude, longitude } = zone.location.coordinates;
      const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(url, '_blank');
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

  const daysUntilDeadline = calculateDaysUntilDeadline(zone.application_deadline);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Helmet>
        <title>{zone.name} - {zone.commune} | Teranga Foncier</title>
        <meta name="description" content={zone.description} />
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
              <Badge className="bg-green-500 text-white">
                <Building2 className="w-3 h-3 mr-1" />
                {zone.status}
              </Badge>
              <Badge className={`${daysUntilDeadline <= 7 ? 'bg-red-500' : daysUntilDeadline <= 30 ? 'bg-yellow-500' : 'bg-blue-500'} text-white`}>
                <Clock className="w-3 h-3 mr-1" />
                {daysUntilDeadline} jours restants
              </Badge>
              <Badge className="bg-purple-500 text-white">
                <Users className="w-3 h-3 mr-1" />
                {zone.available_parcels} parcelles disponibles
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
              <div className="relative">
                <img 
                  src={zone.images[activeImageIndex]} 
                  alt={zone.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black bg-opacity-70 text-white">
                    {activeImageIndex + 1} / {zone.images.length}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Button size="sm" variant="secondary" className="bg-white bg-opacity-90">
                    <Map className="w-4 h-4 mr-1" />
                    Plan Interactif
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {zone.images.map((image, index) => (
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
            </Card>

            {/* Informations principales */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {zone.name}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <ProfileLink 
                        type="municipality" 
                        id={zone.communeId} 
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        external={true}
                      >
                        {zone.commune}
                      </ProfileLink>
                      , {zone.region}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      {zone.project_type}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">Frais d'attribution à partir de</div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPrice(Math.min(...Object.values(zone.size_distribution).map(s => s.attribution_fees)))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                
                {/* Statistiques principales */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{zone.available_parcels}</div>
                    <div className="text-sm text-gray-600">Parcelles Disponibles</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{zone.statistics.applications_received}</div>
                    <div className="text-sm text-gray-600">Demandes Reçues</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{zone.statistics.success_rate}</div>
                    <div className="text-sm text-gray-600">Taux d'Attribution</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{daysUntilDeadline}</div>
                    <div className="text-sm text-gray-600">Jours Restants</div>
                  </div>
                </div>

                {/* Alerte deadline */}
                {daysUntilDeadline <= 30 && (
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
                    {zone.description}
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
                    
                    <div className="space-y-4">
                      {Object.entries(zone.size_distribution).map(([size, info]) => (
                        <div key={size} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-bold text-lg">{size}</div>
                              <div className="text-sm text-gray-600">{info.available} disponibles sur {info.count}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Frais d'attribution</div>
                              <div className="text-lg font-bold text-green-600">{formatPrice(info.attribution_fees)}</div>
                              <div className="text-sm text-gray-600 mt-1">+ Viabilisation: {formatPrice(info.development_fees)}</div>
                              <div className="text-xs text-blue-600 font-bold">Total: {formatPrice(info.attribution_fees + info.development_fees)}</div>
                            </div>
                          </div>
                          <Progress value={(info.available / info.count) * 100} className="h-2" />
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round((info.available / info.count) * 100)}% disponible
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-2">Modalités de Paiement des Frais</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Frais d'attribution : À payer à la signature (non remboursable)</li>
                        <li>• Frais de viabilisation : Échelonnement possible sur 3 ans</li>
                        <li>• Taux d'intérêt viabilisation : 2% par an</li>
                        <li>• Pénalités de retard : 0.5% par mois</li>
                        <li>• Délai de construction : Maximum 3 ans après attribution</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Infrastructure */}
                <TabsContent value="infrastructure" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">État d'Avancement des Travaux</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-green-600 mb-3">✅ Travaux Terminés</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {zone.infrastructure.completed.map((item, index) => (
                            <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-blue-600 mb-3">🔄 Travaux en Cours</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {zone.infrastructure.in_progress.map((item, index) => (
                            <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                              <Zap className="w-5 h-5 text-blue-600 mr-3" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-gray-600 mb-3">📋 Travaux Planifiés</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {zone.infrastructure.planned.map((item, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <Clock className="w-5 h-5 text-gray-600 mr-3" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Équipements Sociaux Prévus</h4>
                      <div className="space-y-3">
                        {zone.social_facilities.map((facility, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <Building2 className="w-5 h-5 text-blue-600 mr-3" />
                              <div>
                                <div className="font-medium">{facility.type}</div>
                                <div className="text-sm text-gray-600">Distance: {facility.distance}</div>
                              </div>
                            </div>
                            <Badge variant={facility.status === 'Planifié' ? 'default' : facility.status === 'Approuvé' ? 'secondary' : 'outline'}>
                              {facility.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Éligibilité */}
                <TabsContent value="eligibility" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Critères d'Éligibilité</h3>
                    
                    <div className="space-y-3">
                      {zone.eligibility_criteria.map((criterion, index) => (
                        <div key={index} className="flex items-start p-4 bg-blue-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                          <span className="text-gray-800">{criterion}</span>
                        </div>
                      ))}
                    </div>

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
                      <div className="space-y-2">
                        {zone.required_documents.map((doc, index) => (
                          <div key={index} className="flex items-center p-3 border-l-4 border-green-500 bg-green-50">
                            <FileText className="w-4 h-4 text-green-600 mr-3" />
                            <span className="text-sm">{doc}</span>
                          </div>
                        ))}
                      </div>
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
                          <div className="text-sm text-gray-600">Avant le {new Date(zone.application_deadline).toLocaleDateString('fr-FR')}</div>
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
                          <div className="font-bold">Tirage au Sort</div>
                          <div className="text-sm text-gray-600">Le {new Date(zone.selection_date).toLocaleDateString('fr-FR')} en séance publique</div>
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
                          <div className="text-lg font-bold">{zone.statistics.applications_received}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Temps de traitement moyen</div>
                          <div className="text-lg font-bold">{zone.statistics.average_processing_time}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Documents */}
                <TabsContent value="documents" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Documents Officiels</h3>
                    
                    {zone.documents.map((doc, index) => (
                      <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-600 mr-3" />
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-gray-600">{doc.type} • {doc.size}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {doc.verified && (
                            <Badge className="bg-green-500 text-white">
                              <Shield className="w-3 h-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    ))}
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
                  
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Dossier Complet PDF
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
                    <div className="font-medium text-gray-900">{zone.contact_info.responsible}</div>
                    <div className="text-sm text-blue-600">{zone.contact_info.title}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{zone.contact_info.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{zone.contact_info.email}</span>
                    </div>
                    <div className="flex items-start text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <span>{zone.contact_info.office_address}</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-blue-900">Horaires d'ouverture</div>
                    <div className="text-sm text-blue-700">{zone.contact_info.office_hours}</div>
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
                    <div className="font-medium text-sm text-gray-700 mb-2">Adresse exacte</div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {zone.location.address}
                    </div>
                  </div>

                  {/* Coordonnées GPS */}
                  <div>
                    <div className="font-medium text-sm text-gray-700 mb-2">Coordonnées GPS</div>
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <div>Latitude: {zone.location.coordinates.latitude}</div>
                      <div>Longitude: {zone.location.coordinates.longitude}</div>
                    </div>
                  </div>

                  {/* Points de repère */}
                  <div>
                    <div className="font-medium text-sm text-gray-700 mb-2">Points de repère</div>
                    <div className="space-y-2">
                      {zone.location.nearby_landmarks.map((landmark, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <Navigation className="w-3 h-3 mr-2 text-gray-400" />
                          {landmark}
                        </div>
                      ))}
                    </div>
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
                    <div className="flex space-x-1 mt-1">
                      {zone.transport.bus_lines.map((line, index) => (
                        <Badge key={index} variant="secondary">{line}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm text-gray-700">Station BRT la plus proche</div>
                    <div className="text-sm text-gray-600">{zone.transport.nearest_brt_station}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium text-sm text-gray-700">Qualité des routes</div>
                    <div className="text-sm text-gray-600">{zone.transport.road_quality}</div>
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
                    <span className="text-sm text-red-600">{new Date(zone.application_deadline).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <span className="text-sm font-medium">Tirage au sort</span>
                    <span className="text-sm text-blue-600">{new Date(zone.selection_date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">Livraison prévue</span>
                    <span className="text-sm text-green-600">{new Date(zone.delivery_date).toLocaleDateString('fr-FR')}</span>
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
              <div className="text-blue-700">{zone.name}</div>
              <div className="text-sm text-blue-600">
                <ProfileLink 
                  type="municipality" 
                  id={zone.communeId} 
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                  external={true}
                >
                  {zone.commune}
                </ProfileLink>
                , {zone.region}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Prénom et Nom</Label>
                <Input placeholder="Prénom NOM" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="email@exemple.com" />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input placeholder="+221 XX XXX XX XX" />
              </div>
              <div>
                <Label>Situation familiale</Label>
                <Select>
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
                <Input type="number" placeholder="500000" />
              </div>
              <div>
                <Label>Taille de parcelle souhaitée</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    {zone.parcel_sizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Motivation</Label>
              <Textarea 
                placeholder="Expliquez pourquoi vous candidatez pour cette zone et votre projet de construction..."
                rows={4}
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-800">
                <strong>Prochaine étape :</strong> Après validation de ce formulaire, vous recevrez un email avec la liste complète des documents à fournir et les modalités de dépôt physique du dossier.
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Valider la Candidature
              </Button>
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
              <div className="font-bold text-green-900">{zone.contact_info.responsible}</div>
              <div className="text-green-700">{zone.contact_info.title}</div>
              <div className="text-sm text-green-600 mt-2">{zone.contact_info.office_hours}</div>
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

      {/* Modal de Carte Interactive */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl w-full h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Map className="w-5 h-5 mr-2 text-blue-600" />
              Localisation : {zone?.name}
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
                        {zone?.location?.address}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-1">Coordonnées GPS</div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="bg-blue-50 p-2 rounded">
                          Lat: {zone?.location?.coordinates?.latitude}
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          Lng: {zone?.location?.coordinates?.longitude}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-2">Accessibilité</div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs text-gray-500">Routes principales</div>
                          {zone?.location?.accessibility?.main_roads?.map((road, index) => (
                            <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                              {road}
                            </Badge>
                          ))}
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Distance centre-ville</div>
                          <div className="text-sm text-gray-600">
                            {zone?.location?.accessibility?.distance_to_city_center}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium text-sm text-gray-700 mb-2">Points de repère</div>
                      <div className="space-y-1">
                        {zone?.location?.nearby_landmarks?.map((landmark, index) => (
                          <div key={index} className="flex items-start text-xs text-gray-600">
                            <Navigation className="w-3 h-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                            <span>{landmark}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Button 
                        onClick={openGoogleMaps} 
                        className="w-full text-sm"
                        variant="outline"
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
                      {/* Simulation d'une carte */}
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
                              <div className="text-xs font-medium">{zone?.name}</div>
                              <div className="text-xs text-gray-500">{zone?.commune}</div>
                            </div>
                          </div>
                        </div>

                        {/* Points de repère simulés */}
                        <div className="absolute top-1/4 left-1/4">
                          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-1 py-0.5 rounded text-xs shadow border">
                            Université
                          </div>
                        </div>
                        
                        <div className="absolute top-3/4 right-1/4">
                          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-1 py-0.5 rounded text-xs shadow border">
                            Hôpital
                          </div>
                        </div>

                        <div className="absolute top-1/3 right-1/3">
                          <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow"></div>
                          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-white px-1 py-0.5 rounded text-xs shadow border">
                            Centre Commercial
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
