import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Building2, 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  Clock, 
  TrendingUp, 
  Zap,
  Shield,
  Eye,
  Heart,
  Share2,
  Phone,
  Mail,
  Globe,
  Camera,
  Video,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  ArrowRight,
  Calculator,
  CreditCard,
  FileText,
  Download,
  Hammer,
  PaintBucket,
  Truck,
  HardHat,
  Wrench,
  Home,
  Layers,
  BarChart3,
  Target,
  Award,
  Navigation,
  DollarSign,
  Percent
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProfileLink from '@/components/common/ProfileLink';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPreOrderModal, setShowPreOrderModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);

  // Données mockées du projet
  useEffect(() => {
    const mockProjectData = {
      id: id || 'PROJ-001',
      title: 'Résidence Les Palmiers - Almadies',
      type: 'Immeuble d\'appartements',
      promoter: {
        id: 'promoter-001',
        name: 'Sénégal Construction SARL',
        rating: 4.8,
        projects_completed: 15,
        phone: '+221 77 123 45 67',
        email: 'contact@senegalconstruction.sn',
        website: 'www.senegalconstruction.sn',
        address: 'Avenue Bourguiba, Dakar',
        license: 'BTP-SN-2019-456',
        founded: 2015,
        specialties: ['Immeubles résidentiels', 'Villas de luxe', 'Centres commerciaux']
      },
      location: 'Almadies, Dakar',
      coordinates: { lat: 14.7645, lng: -17.4966 },
      total_units: 24,
      available_units: 18,
      sold_units: 6,
      price_range: {
        min: 45000000,
        max: 85000000
      },
      delivery_date: '2025-12-15',
      construction_start: '2024-06-01',
      construction_progress: 35,
      status: 'En construction',
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200',
        'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1200',
        'https://images.unsplash.com/photo-1502005229762-cf1b2da7c55a?q=80&w=1200',
        'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1200'
      ],
      virtual_tour: 'https://projects.terangafoncier.com/virtual/proj-001',
      drone_footage: 'https://projects.terangafoncier.com/drone/proj-001',
      
      features: [
        'Piscine communautaire avec deck',
        'Salle de sport équipée',
        'Parking souterrain sécurisé',
        'Concierge et sécurité 24h/24',
  'Espace vert privatif 500m²',
        'Système de sécurité électronique',
        'Ascenseurs Otis dernière génération',
        'Fibre optique dans tous les appartements',
        'Panneaux solaires pour parties communes',
        'Système de récupération d\'eau de pluie'
      ],
      
      // Timeline de construction détaillée
      construction_timeline: {
        phases: [
          { 
            name: 'Terrassement et fondations', 
            duration: '3 mois', 
            status: 'completed', 
            start_date: '2024-06-01',
            end_date: '2024-08-31',
            progress: 100,
            description: 'Excavation, fondations en béton armé, drainage',
            daily_reports: [
              { date: '2024-08-31', report: 'Fondations terminées, tests de résistance validés' },
              { date: '2024-08-15', report: 'Coulage des fondations principales' },
              { date: '2024-07-01', report: 'Excavation terminée, début coulage' }
            ],
            photos: ['/api/YOUR_API_KEY/400/300', '/api/YOUR_API_KEY/400/300'],
            milestone_payment: 25 // pourcentage du prix total
          },
          { 
            name: 'Structure béton et voiles', 
            duration: '4 mois', 
            status: 'in_progress', 
            start_date: '2024-09-01',
            end_date: '2024-12-31',
            progress: 75,
            description: 'Élévation des murs porteurs, dalles, escaliers',
            daily_reports: [
              { date: '2024-11-15', report: 'Coulage dalle du 4ème étage réalisé' },
              { date: '2024-11-01', report: 'Structure 3ème étage terminée' },
              { date: '2024-10-15', report: 'Élévation des voiles du 2ème étage' }
            ],
            photos: ['/api/YOUR_API_KEY/400/300', '/api/YOUR_API_KEY/400/300'],
            milestone_payment: 25
          },
          { 
            name: 'Toiture et étanchéité', 
            duration: '2 mois', 
            status: 'pending', 
            start_date: '2025-01-01',
            end_date: '2025-02-28',
            progress: 0,
            description: 'Charpente, couverture, étanchéité terrasse',
            daily_reports: [],
            photos: [],
            milestone_payment: 15
          },
          { 
            name: 'Finitions intérieures', 
            duration: '6 mois', 
            status: 'pending', 
            start_date: '2025-03-01',
            end_date: '2025-08-31',
            progress: 0,
            description: 'Cloisons, plomberie, électricité, carrelage, peinture',
            daily_reports: [],
            photos: [],
            milestone_payment: 25
          },
          { 
            name: 'Aménagements extérieurs et livraison', 
            duration: '4 mois', 
            status: 'pending', 
            start_date: '2025-09-01',
            end_date: '2025-12-15',
            progress: 0,
            description: 'Piscine, jardins, parkings, nettoyage final',
            daily_reports: [],
            photos: [],
            milestone_payment: 10
          }
        ],
        next_milestone: {
          name: 'Fin structure béton',
          date: '2024-12-31',
          payment_due: 25
        }
      },
      
      // Types d'appartements disponibles
      apartment_types: [
        {
          id: 'T2',
          type: 'T2',
          surface: '65m²',
          rooms: '2 pièces',
          price: 45000000,
          available: 6,
          sold: 2,
          description: '2 pièces avec balcon vue mer partielle',
          features: ['Balcon 8mÂ²', 'Cuisine équipée', 'Salle de bain', 'Climatisation'],
          floor_plan: '/api/YOUR_API_KEY/600/400',
          virtual_tour: '/virtual/t2',
          monthly_payment_example: 850000 // FCFA
        },
        {
          id: 'T3',
          type: 'T3',
          surface: '85m²',
          rooms: '3 pièces',
          price: 62000000,
          available: 8,
          sold: 3,
          description: '3 pièces avec terrasse et vue dégagée',
          features: ['Terrasse 12mÂ²', 'Cuisine américaine', '2 salles de bain', 'Dressing'],
          floor_plan: '/api/YOUR_API_KEY/600/400',
          virtual_tour: '/virtual/t3',
          monthly_payment_example: 1150000
        },
        {
          id: 'T4',
          type: 'T4 Duplex',
          surface: '110m²',
          rooms: '4 pièces',
          price: 85000000,
          available: 4,
          sold: 1,
          description: '4 pièces duplex avec vue panoramique océan',
          features: ['Duplex', 'Terrasse 20mÂ²', 'Suite parentale', '3 salles de bain', 'Garage privé'],
          floor_plan: '/api/YOUR_API_KEY/600/400',
          virtual_tour: '/virtual/t4',
          monthly_payment_example: 1580000
        }
      ],
      
      // Options de financement
      financing_options: {
        bank_partners: [
          { name: 'UBA Sénégal', rate: '8.5%', max_duration: '25 ans' },
          { name: 'SGBS', rate: '8.2%', max_duration: '20 ans' },
          { name: 'CBAO', rate: '8.0%', max_duration: '25 ans' }
        ],
        payment_plans: [
          { 
            name: 'Paiement comptant', 
            discount: 5, 
            description: 'Remise de 5% pour paiement intégral' 
          },
          { 
            name: 'Échelonné 24 mois', 
            down_payment: 30, 
            description: '30% à la signature, solde sur 24 mois' 
          },
          { 
            name: 'Crédit bancaire', 
            down_payment: 20, 
            description: 'Accompagnement pour obtention crédit' 
          }
        ],
        advance_payment_minimum: 30
      },
      
      description: `Résidence moderne de standing située dans le prestigieux quartier des Almadies avec vue sur l'océan Atlantique. 

Cette résidence de 24 appartements sur 6 étages offre un cadre de vie exceptionnel avec des finitions haut de gamme et des équipements modernes.

Chaque appartement bénéficie d'une exposition optimale et de prestations de qualité : carrelage italien, cuisine équipée, climatisation, système domotique.

Les espaces communs incluent une piscine avec deck, une salle de sport, des jardins paysagers et un parking souterrain sécurisé.

Idéal pour résidence principale ou investissement locatif avec un rendement estimé à 8-10% par an.`,
      
      neighborhood: {
        amenities: [
          { name: 'École française Mermoz', distance: '1.2 km', type: 'Éducation' },
          { name: 'Clinique de la Madeleine', distance: '2.1 km', type: 'Santé' },
          { name: 'Sea Plaza Shopping', distance: '800 m', type: 'Commerce' },
          { name: 'Station BRT', distance: '1.5 km', type: 'Transport' },
          { name: 'Plage des Almadies', distance: '3.2 km', type: 'Loisirs' },
          { name: 'Golf Club de Dakar', distance: '2.8 km', type: 'Sport' }
        ],
        infrastructure_score: 9.2,
        safety_score: 8.8,
        access_score: 9.0
      },
      
      guarantees: {
        delivery_guarantee: true,
        insurance_coverage: true,
        warranty_duration: '10 ans',
        quality_certifications: ['NF Habitat', 'RT 2020', 'Label E+C-']
      },
      
      documents: [
        { name: 'Permis de construire', verified: true, download_url: '/docs/permis.pdf' },
        { name: 'Plans d\'architecte', verified: true, download_url: '/docs/plans.pdf' },
        { name: 'Étude de sol', verified: true, download_url: '/docs/sol.pdf' },
        { name: 'Notice descriptive', verified: true, download_url: '/docs/notice.pdf' },
        { name: 'Cahier des charges', verified: true, download_url: '/docs/cahier.pdf' }
      ]
    };

    // Simulation du chargement
    setTimeout(() => {
      setProject(mockProjectData);
      setLoading(false);
    }, 1000);
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPhaseIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress': return <Play className="w-5 h-5 text-blue-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-gray-400" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const calculateMonthlyPayment = (price, downPayment = 30, duration = 20, rate = 8.2) => {
    const loanAmount = price * (1 - downPayment / 100);
    const monthlyRate = rate / 100 / 12;
    const numPayments = duration * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return monthlyPayment;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <div className="text-lg font-semibold text-gray-700">Chargement du projet...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Projet non trouvé</h2>
          <p className="text-gray-600 mb-4">Le projet demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/promoters-projects')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux projets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>{project.title} | Teranga Foncier</title>
        <meta name="description" content={project.description} />
      </Helmet>

      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/promoters-projects')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux projets
            </Button>
            
            <div className="flex items-center space-x-3">
              <Badge className="bg-yellow-500 text-black">
                <Building2 className="w-3 h-3 mr-1" />
                {project.available_units} disponibles
              </Badge>
              <Badge className="bg-green-500 text-white">
                <Clock className="w-3 h-3 mr-1" />
                {project.construction_progress}% terminé
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
                  src={project.images[activeImageIndex]} 
                  alt={project.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black bg-opacity-70 text-white">
                    {activeImageIndex + 1} / {project.images.length}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                      <Button size="sm" variant="secondary">
                    <Video className="w-4 h-4 mr-1" />
                        Visite 360°
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Camera className="w-4 h-4 mr-1" />
                    Drone
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {project.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Vue ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer ${
                        index === activeImageIndex ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    />
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
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {project.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Building2 className="w-4 h-4 mr-2" />
                      Par {project.promoter.name}
                      <Star className="w-4 h-4 ml-3 mr-1 text-yellow-500 fill-current" />
                      {project.promoter.rating}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      À partir de {formatPrice(project.price_range.min)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Jusqu’à {formatPrice(project.price_range.max)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Home className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-lg font-bold">{project.total_units}</div>
                    <div className="text-sm text-gray-600">Unités total</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-lg font-bold">{project.available_units}</div>
                    <div className="text-sm text-gray-600">Disponibles</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-lg font-bold">
                      {new Date(project.delivery_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-sm text-gray-600">Livraison</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <div className="text-lg font-bold">{project.construction_progress}%</div>
                    <div className="text-sm text-gray-600">Avancement</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Description du projet</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Onglets d'informations */}
            <Card>
              <Tabs defaultValue="units" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="units">Logements</TabsTrigger>
                  <TabsTrigger value="timeline">Suivi Travaux</TabsTrigger>
                  <TabsTrigger value="financing">Financement</TabsTrigger>
                  <TabsTrigger value="amenities">Quartier</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                {/* Onglet Types de logements */}
                <TabsContent value="units" className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Types de logements disponibles</h3>
                  <div className="space-y-4">
                    {project.apartment_types.map((unit) => (
                      <div 
                        key={unit.id} 
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedUnit(unit)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{unit.type} - {unit.surface}</h4>
                            <p className="text-gray-600">{unit.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">
                              {formatPrice(unit.price)}
                            </div>
                            <div className="text-sm text-gray-500">
                              ≈ {formatPrice(unit.monthly_payment_example)}/mois
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">{unit.rooms}</Badge>
                            <Badge variant="outline">{unit.surface}</Badge>
                          </div>
                          <div className="text-sm">
                            <span className="text-green-600 font-medium">{unit.available} disponibles</span>
                            {unit.sold > 0 && (
                              <span className="text-gray-500 ml-2">• {unit.sold} vendus</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {unit.features.map((feature, index) => (
                            <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Plan
                          </Button>
                          <Button size="sm" variant="outline">
                            <Video className="w-4 h-4 mr-1" />
                            Visite 3D
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPreOrderModal(true);
                            }}
                          >
                            Précommander
                          </Button>
                          <Button 
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/promoters/purchase-units', { state: { projectId: project.id, unitType: unit.type } });
                            }}
                          >
                            Acheter logement
                          </Button>
                          <Button 
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/promoters/payment-plans', { state: { projectId: project.id, unitType: unit.type } });
                            }}
                          >
                            Plan de paiement
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Onglet Suivi Travaux */}
                <TabsContent value="timeline" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">Suivi en temps réel des travaux</h3>
                      <Button size="sm" onClick={() => setShowTimelineModal(true)}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Planning détaillé
                      </Button>
                    </div>
                    
                    {/* Progress global */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Avancement global</span>
                        <span className="text-lg font-bold text-blue-600">{project.construction_progress}%</span>
                      </div>
                      <Progress value={project.construction_progress} className="h-3" />
                      <div className="text-sm text-gray-600 mt-2">
                        Livraison prévue: {new Date(project.delivery_date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>

                    {/* Timeline des phases */}
                    <div className="space-y-4">
                      {project.construction_timeline.phases.map((phase, index) => (
                        <div key={index} className="border-l-4 border-gray-200 pl-4 relative">
                          <div className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center ${
                            phase.status === 'completed' ? 'bg-green-500' :
                            phase.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                          }`}>
                            {getPhaseIcon(phase.status)}
                          </div>
                          
                          <div className="bg-white border rounded-lg p-4 ml-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{phase.name}</h4>
                              <Badge className={
                                phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                                phase.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                                'bg-gray-100 text-gray-800'
                              }>
                                {phase.status === 'completed' ? 'Terminé' :
                                 phase.status === 'in_progress' ? 'En cours' : 'À venir'}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                            
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm">
                                {new Date(phase.start_date).toLocaleDateString('fr-FR')} - 
                                {new Date(phase.end_date).toLocaleDateString('fr-FR')}
                              </span>
                              <span className="text-sm font-medium">
                                Paiement étape: {phase.milestone_payment}%
                              </span>
                            </div>
                            
                            <Progress value={phase.progress} className="mb-3" />
                            
                            {/* Rapports récents */}
                            {phase.daily_reports && phase.daily_reports.length > 0 && (
                              <div className="mt-3">
                                <h5 className="text-sm font-medium mb-2">Derniers rapports:</h5>
                                {phase.daily_reports.slice(0, 2).map((report, idx) => (
                                  <div key={idx} className="text-xs bg-gray-50 p-2 rounded mb-1">
                                    <span className="font-medium">{new Date(report.date).toLocaleDateString('fr-FR')}: </span>
                                    {report.report}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Photos */}
                            {phase.photos && phase.photos.length > 0 && (
                              <div className="flex gap-2 mt-3">
                                {phase.photos.map((photo, idx) => (
                                  <img 
                                    key={idx}
                                    src={photo} 
                                    alt={`Photo ${phase.name}`}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Financement */}
                <TabsContent value="financing" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Options de financement</h3>
                    
                    {/* Plans de paiement */}
                    <div>
                      <h4 className="font-semibold mb-3">Plans de paiement</h4>
                      <div className="grid gap-4">
                        {project.financing_options.payment_plans.map((plan, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{plan.name}</h5>
                              {plan.discount && (
                                <Badge className="bg-green-100 text-green-800">
                                  -{plan.discount}%
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{plan.description}</p>
                            {plan.down_payment && (
                              <div className="text-sm mt-2">
                                Apport minimum: <span className="font-medium">{plan.down_payment}%</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Banques partenaires */}
                    <div>
                      <h4 className="font-semibold mb-3">Nos partenaires bancaires</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {project.financing_options.bank_partners.map((bank, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <h5 className="font-medium">{bank.name}</h5>
                            <div className="text-sm text-gray-600 mt-1">
                              Taux: <span className="font-medium text-blue-600">{bank.rate}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              Durée max: {bank.max_duration}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Simulateur */}
                    <Card className="bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-lg">Simulateur de financement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Prix du bien</label>
                            <Select defaultValue="62000000">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {project.apartment_types.map((unit) => (
                                  <SelectItem key={unit.id} value={unit.price.toString()}>
                                    {unit.type} - {formatPrice(unit.price)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Apport (%)</label>
                            <Select defaultValue="30">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="20">20%</SelectItem>
                                <SelectItem value="30">30%</SelectItem>
                                <SelectItem value="40">40%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Durée</label>
                            <Select defaultValue="20">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 ans</SelectItem>
                                <SelectItem value="20">20 ans</SelectItem>
                                <SelectItem value="25">25 ans</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-sm text-gray-600">Mensualité estimée</div>
                          <div className="text-2xl font-bold text-blue-600">
                            â‰ˆ {formatPrice(calculateMonthlyPayment(62000000))}/mois
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Onglet Quartier */}
                <TabsContent value="amenities" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Environnement et commodités</h3>
                    
                    {/* Scores du quartier */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="text-center p-4">
                          <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-600">{project.neighborhood.infrastructure_score}/10</div>
                          <div className="text-sm text-gray-600">Infrastructure</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="text-center p-4">
                          <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-600">{project.neighborhood.safety_score}/10</div>
                          <div className="text-sm text-gray-600">Sécurité</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="text-center p-4">
                          <Navigation className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-600">{project.neighborhood.access_score}/10</div>
                          <div className="text-sm text-gray-600">Accessibilité</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Commodités proches */}
                    <div>
                      <h4 className="font-semibold mb-3">Commodités à proximité</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {project.neighborhood.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{amenity.name}</div>
                              <div className="text-xs text-gray-600">{amenity.type} • {amenity.distance}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Onglet Documents */}
                <TabsContent value="documents" className="p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Documents du projet</h3>
                    
                    <div className="space-y-3">
                      {project.documents.map((doc, index) => (
                        <div key={index} className="border rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-gray-600 mr-3" />
                            <div>
                              <div className="font-medium">{doc.name}</div>
                              <div className="text-sm text-gray-600">
                                {doc.verified ? (
                                  <span className="text-green-600">✓ Vérifié</span>
                                ) : (
                                  <span className="text-orange-600">En attente</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar - Actions et informations promoteur */}
          <div className="space-y-6">
            
            {/* Actions principales */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setShowPreOrderModal(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Précommander
                </Button>
                <Button 
                  className="w-full"
                  variant="secondary"
                  onClick={() => navigate('/promoters/purchase-units', { state: { projectId: project.id } })}
                >
                  Acheter logement
                </Button>
                <Button 
                  className="w-full"
                  variant="secondary"
                  onClick={() => navigate('/promoters/payment-plans', { state: { projectId: project.id } })}
                >
                  Plan de paiement
                </Button>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate('/buy/bank-financing', { state: { projectId: project.id } })}
                >
                  Financement bancaire
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowContactModal(true)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contacter le promoteur
                </Button>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    <Heart className="w-4 h-4 mr-1" />
                    Favoris
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-1" />
                    Partager
                  </Button>
                </div>

                <Button variant="ghost" className="w-full" onClick={() => setShowTimelineModal(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Planning détaillé
                </Button>
              </CardContent>
            </Card>

            {/* Informations promoteur */}
            <Card>
              <CardHeader>
                <CardTitle>Le Promoteur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <ProfileLink 
                      type="promoter" 
                      id={project.promoter.id || project.id} 
                      className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                      external={true}
                    >
                      {project.promoter.name}
                    </ProfileLink>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      {project.promoter.rating}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projets réalisés</span>
                    <span className="font-medium">{project.promoter.projects_completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fondé en</span>
                    <span className="font-medium">{project.promoter.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Licence</span>
                    <span className="font-medium text-xs">{project.promoter.license}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    {project.promoter.phone}
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Globe className="w-4 h-4 mr-2" />
                    Site web
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Prochaine échéance */}
            {project.construction_timeline.next_milestone && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="text-lg">Prochaine Échéance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {project.construction_timeline.next_milestone.payment_due}%
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {project.construction_timeline.next_milestone.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Prévu le {new Date(project.construction_timeline.next_milestone.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Garanties */}
            <Card>
              <CardHeader>
                <CardTitle>Garanties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm">Garantie de livraison</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm">Assurance dommages-ouvrage</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-sm">Garantie décennale {project.guarantees.warranty_duration}</span>
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  Certifications: {project.guarantees.quality_certifications.join(', ')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
