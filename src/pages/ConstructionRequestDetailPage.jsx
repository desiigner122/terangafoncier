import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, MapPin, Building2, Users, Calendar, Clock, FileText,
  CheckCircle, AlertTriangle, Info, Phone, Mail, Globe, Shield,
  Download, Upload, Euro, TrendingUp, Map, Navigation, Zap,
  Hammer, Wrench as Tool, Coins, Activity, Eye, MessageCircle, CreditCard,
  Award, Star, Bookmark
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

const ConstructionRequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // Simulation de chargement des donnÃ©es de la demande de construction
    const mockRequestData = {
      id: parseInt(id),
      title: "Villa Moderne avec Piscine - Almadies",
      client: "Fatou Diallo",
      location: {
        address: "Almadies, Dakar, SÃ©nÃ©gal",
        coordinates: { latitude: 14.7536, longitude: -17.3159 },
        zone: "Zone rÃ©sidentielle premium"
      },
      
      // DÃ©tails du projet
      projectType: "Construction rÃ©sidentielle",
      buildingType: "Villa individuelle",
      surface: "400mÂ²",
      terrain: "800mÂ²",
      rooms: "5 chambres, 3 salles de bain",
      floors: 2,
      
      // Budget et financement
      budget: {
        estimated: 85000000,
        currency: "FCFA",
        breakdown: {
          construction: 60000000,
          finition: 15000000,
          equipement: 10000000
        },
        financing: {
          selfFunding: 30000000,
          bankLoan: 50000000,
          remainingNeeded: 5000000
        }
      },
      
      // Statut et timing
      status: "Recherche promoteur",
      priority: "Haute",
      deadline: "2025-06-01",
      submittedDate: "2024-12-15",
      lastUpdate: "2025-01-05",
      
      // SpÃ©cifications techniques
      specifications: {
        style: "Moderne contemporain",
        materials: ["BÃ©ton armÃ©", "Carrelage premium", "Aluminium"],
        features: ["Piscine", "Garage 2 voitures", "Jardin paysager", "SystÃ¨me solaire"],
        standards: ["Norme BCEAO", "Certification Ã©nergÃ©tique", "Normes sismiques"]
      },
      
      // Images et documents
      images: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop', // Plan architectural
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop', // Terrain vue
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop', // Style souhaitÃ©
        'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop'  // Inspiration
      ],
      
      documents: [
        { name: 'Titre de PropriÃ©tÃ©', type: 'PDF', size: '1.2 MB', verified: true },
        { name: 'Plans PrÃ©liminaires', type: 'PDF', size: '3.4 MB', verified: true },
        { name: 'Ã‰tude de FaisabilitÃ©', type: 'PDF', size: '2.1 MB', verified: false },
        { name: 'Dossier Bancaire', type: 'PDF', size: '0.8 MB', verified: true }
      ],
      
      // CritÃ¨res pour promoteurs
      promoterCriteria: [
        "ExpÃ©rience minimum 5 ans construction villa",
        "Portfolio projets rÃ©sidentiels premium",
        "Certification BCEAO et assurances",
        "CapacitÃ© financement partiel projet",
        "RÃ©fÃ©rences clients vÃ©rifiables"
      ],
      
      // Blockchain et sÃ©curisation
      blockchain: {
        contractAddress: "0x742d35Cc6532C02bAB11789DA4D9A87d3b8C7421",
        tokenized: true,
        nftId: "TER-CON-2024-" + id,
        smartContractActive: true,
        escrowAmount: 5000000,
        milestones: [
          { phase: "Fondations", percentage: 25, amount: 15000000, status: "pending" },
          { phase: "Ã‰lÃ©vation", percentage: 50, amount: 30000000, status: "pending" },
          { phase: "Toiture", percentage: 75, amount: 20000000, status: "pending" },
          { phase: "Finitions", percentage: 100, amount: 20000000, status: "pending" }
        ]
      },
      
      // Offres reÃ§ues
      proposals: [
        {
          promoterId: 1,
          promoterName: "SOPREC Construction",
          rating: 4.8,
          experience: "12 ans",
          proposedBudget: 82000000,
          timeline: "8 mois",
          advantages: ["Prix compÃ©titif", "DÃ©lai respectÃ©", "Garantie 10 ans"],
          status: "En nÃ©gociation"
        },
        {
          promoterId: 2,
          promoterName: "Groupe Sahel Immobilier",
          rating: 4.6,
          experience: "15 ans",
          proposedBudget: 87000000,
          timeline: "7 mois",
          advantages: ["MatÃ©riaux premium", "Design personnalisÃ©", "Service clÃ© en main"],
          status: "Proposition reÃ§ue"
        }
      ],
      
      // Contact client
      client_contact: {
        name: "Fatou Diallo",
        phone: "+221 77 123 45 67",
        email: "fatou.diallo@email.com",
        location: "Diaspora - France",
        profile: "Investisseur immobilier"
      }
    };

    setTimeout(() => {
      setRequest(mockRequestData);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Recherche promoteur':
        return { icon: <Building2 className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' };
      case 'En nÃ©gociation':
        return { icon: <MessageCircle className="w-4 h-4" />, color: 'bg-orange-100 text-orange-800', bgColor: 'bg-orange-50' };
      case 'Contrat signÃ©':
        return { icon: <CheckCircle className="w-4 h-4" />, color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' };
      case 'En construction':
        return { icon: <Hammer className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' };
      default:
        return { icon: <Clock className="w-4 h-4" />, color: 'bg-gray-100 text-gray-800', bgColor: 'bg-gray-50' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Demande non trouvÃ©e</h2>
          <Button onClick={() => navigate('/promoter-requests')}>
            Retour aux demandes
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(request.status);

  return (
    <>
      <Helmet>
        <title>{request.title} - Demande de Construction | Teranga Foncier</title>
        <meta name="description" content={`Demande de construction: ${request.title}. Budget: ${request.budget.estimated.toLocaleString()} FCFA. Blockchain sÃ©curisÃ©.`} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header Navigation */}
        <section className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/promoter-requests')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux demandes
              </Button>
              
              <div className="flex items-center gap-3">
                <Badge className={statusInfo.color}>
                  {statusInfo.icon}
                  <span className="ml-1">{request.status}</span>
                </Badge>
                <Badge className={getPriorityColor(request.priority)}>
                  PrioritÃ© {request.priority}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  {request.title}
                </h1>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4" />
                    <span>{request.location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Building2 className="w-4 h-4" />
                    <span>{request.surface}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Euro className="w-4 h-4" />
                    <span>{request.budget.estimated.toLocaleString()} FCFA</span>
                  </div>
                </div>
                <p className="text-xl opacity-90 mb-8">
                  Projet {request.buildingType.toLowerCase()} de {request.rooms} sur terrain de {request.terrain}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100"
                    onClick={() => setShowProposalModal(true)}
                  >
                    <Hammer className="mr-2 w-5 h-5" />
                    Faire une proposition
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => setShowContactModal(true)}
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Contacter le client
                  </Button>
                </div>
              </div>

              {/* Galerie d'images */}
              <div className="relative">
                <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                  <img 
                    src={request.images[activeImageIndex]} 
                    alt={`Image ${activeImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {activeImageIndex + 1} / {request.images.length}
                  </div>
                </div>
                
                {/* Miniatures */}
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {request.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`aspect-video rounded overflow-hidden border-2 transition-all ${
                        activeImageIndex === index ? 'border-white shadow-lg' : 'border-white/30'
                      }`}
                    >
                      <img src={image} alt={`Miniature ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contenu Principal */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="specifications">SpÃ©cifications</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                <TabsTrigger value="proposals">Propositions</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>

              {/* Vue d'ensemble */}
              <TabsContent value="overview" className="space-y-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Informations principales */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          DÃ©tails du Projet
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Type de construction</span>
                            <p className="font-semibold">{request.buildingType}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Surface habitable</span>
                            <p className="font-semibold">{request.surface}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Terrain</span>
                            <p className="font-semibold">{request.terrain}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Nombre d'Ã©tages</span>
                            <p className="font-semibold">{request.floors} Ã©tages</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-sm font-medium text-gray-500">Configuration</span>
                            <p className="font-semibold">{request.rooms}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Euro className="w-5 h-5" />
                          Budget et Financement
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                              {request.budget.estimated.toLocaleString()} FCFA
                            </div>
                            <p className="text-gray-600">Budget total estimÃ©</p>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-xl font-bold text-blue-600">
                                {request.budget.breakdown.construction.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Construction</div>
                            </div>
                            <div className="text-center p-4 bg-emerald-50 rounded-lg">
                              <div className="text-xl font-bold text-emerald-600">
                                {request.budget.breakdown.finition.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Finition</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <div className="text-xl font-bold text-purple-600">
                                {request.budget.breakdown.equipement.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-600">Ã‰quipement</div>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-3">Plan de financement</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span>Fonds propres:</span>
                                <span className="font-semibold text-green-600">
                                  {request.budget.financing.selfFunding.toLocaleString()} FCFA
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span>CrÃ©dit bancaire:</span>
                                <span className="font-semibold text-blue-600">
                                  {request.budget.financing.bankLoan.toLocaleString()} FCFA
                                </span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">RecherchÃ©:</span>
                                <span className="font-semibold text-orange-600">
                                  {request.budget.financing.remainingNeeded.toLocaleString()} FCFA
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Planning
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Date limite</span>
                          <p className="font-semibold text-red-600">{new Date(request.deadline).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Demande soumise</span>
                          <p className="font-semibold">{new Date(request.submittedDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">DerniÃ¨re mise Ã  jour</span>
                          <p className="font-semibold">{new Date(request.lastUpdate).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Documents
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {request.documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-blue-500" />
                                <div>
                                  <p className="font-medium text-sm">{doc.name}</p>
                                  <p className="text-xs text-gray-500">{doc.size}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {doc.verified && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* SpÃ©cifications techniques */}
              <TabsContent value="specifications" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Style et MatÃ©riaux</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Style architectural</span>
                        <p className="font-semibold">{request.specifications.style}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-2">MatÃ©riaux prÃ©fÃ©rÃ©s</span>
                        <div className="flex flex-wrap gap-2">
                          {request.specifications.materials.map((material, index) => (
                            <Badge key={index} variant="secondary">{material}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ã‰quipements SpÃ©ciaux</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {request.specifications.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Standards et Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {request.specifications.standards.map((standard, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <Shield className="w-5 h-5 text-green-600" />
                            <span className="font-medium">{standard}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Section Blockchain */}
              <TabsContent value="blockchain" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Coins className="w-5 h-5" />
                        Smart Contract
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Smart Contract Actif</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Adresse du contrat</span>
                          <p className="font-mono text-sm bg-gray-100 p-2 rounded">{request.blockchain.contractAddress}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">NFT ID</span>
                          <p className="font-semibold">{request.blockchain.nftId}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Montant en sÃ©questre</span>
                          <p className="font-semibold text-green-600">{request.blockchain.escrowAmount.toLocaleString()} FCFA</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Jalons de Paiement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {request.blockchain.milestones.map((milestone, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{milestone.phase}</span>
                              <Badge variant={milestone.status === 'pending' ? 'secondary' : 'default'}>
                                {milestone.status === 'pending' ? 'En attente' : 'ComplÃ©tÃ©'}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>{milestone.percentage}% du projet</span>
                              <span>{milestone.amount.toLocaleString()} FCFA</span>
                            </div>
                            <Progress value={milestone.status === 'pending' ? 0 : 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Propositions reÃ§ues */}
              <TabsContent value="proposals" className="space-y-6">
                <div className="space-y-6">
                  {request.proposals.map((proposal, index) => (
                    <Card key={index} className="border-2 hover:border-blue-200 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{proposal.promoterName}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <span>{proposal.rating}/5</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                <span>{proposal.experience}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={
                            proposal.status === 'En nÃ©gociation' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                          }>
                            {proposal.status}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {proposal.proposedBudget.toLocaleString()} FCFA
                            </div>
                            <div className="text-sm text-gray-600">Budget proposÃ©</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{proposal.timeline}</div>
                            <div className="text-sm text-gray-600">DÃ©lai de rÃ©alisation</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{proposal.advantages.length}</div>
                            <div className="text-sm text-gray-600">Avantages</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500 block mb-2">Points forts</span>
                          <div className="flex flex-wrap gap-2">
                            {proposal.advantages.map((advantage, i) => (
                              <Badge key={i} variant="outline" className="text-green-700 border-green-200">
                                {advantage}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button size="sm" className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir le profil
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contacter
                          </Button>
                          {proposal.status === 'Proposition reÃ§ue' && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accepter
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {request.proposals.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                          Aucune proposition reÃ§ue
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Soyez le premier promoteur Ã  proposer vos services pour ce projet
                        </p>
                        <Button onClick={() => setShowProposalModal(true)}>
                          <Hammer className="w-4 h-4 mr-2" />
                          Faire une proposition
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Contact */}
              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Informations Client
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Nom complet</span>
                        <p className="font-semibold">{request.client_contact.name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Profil</span>
                        <p className="font-semibold">{request.client_contact.profile}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Localisation</span>
                        <p className="font-semibold">{request.client_contact.location}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email</span>
                        <p className="font-semibold">{request.client_contact.email}</p>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">CritÃ¨res de SÃ©lection Promoteur</h4>
                      <div className="space-y-3">
                        {request.promoterCriteria.map((criteria, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{criteria}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-6 flex gap-4">
                      <Button onClick={() => setShowContactModal(true)} className="flex-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Appeler
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Mail className="w-4 h-4 mr-2" />
                        Envoyer email
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">IntÃ©ressÃ© par ce projet ?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contactez le client ou soumettez votre proposition dÃ¨s maintenant
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => setShowProposalModal(true)}
              >
                <Hammer className="mr-2 w-5 h-5" />
                Faire une proposition
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
                onClick={() => setShowContactModal(true)}
              >
                <MessageCircle className="mr-2 w-5 h-5" />
                Contacter le client
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contacter le Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <p className="font-semibold text-lg">{request.client_contact.phone}</p>
              <p className="text-gray-600">{request.client_contact.name}</p>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Appeler
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="w-4 h-4 mr-2" />
                SMS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProposalModal} onOpenChange={setShowProposalModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Soumettre une Proposition</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Budget proposÃ© (FCFA)</Label>
                <Input YOUR_API_KEY="75,000,000" />
              </div>
              <div>
                <Label>DÃ©lai de rÃ©alisation</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue YOUR_API_KEY="Choisir" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 mois</SelectItem>
                    <SelectItem value="7">7 mois</SelectItem>
                    <SelectItem value="8">8 mois</SelectItem>
                    <SelectItem value="9">9 mois</SelectItem>
                    <SelectItem value="10">10 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label>Message de prÃ©sentation</Label>
              <Textarea 
                YOUR_API_KEY="PrÃ©sentez votre entreprise, votre expÃ©rience et vos points forts pour ce projet..."
                rows={4}
              />
            </div>

            <div>
              <Label>Documents Ã  joindre</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Glissez vos fichiers ici ou cliquez pour parcourir</p>
                <p className="text-sm text-gray-500 mt-1">Portfolio, certifications, rÃ©fÃ©rences...</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1">
                <Hammer className="w-4 h-4 mr-2" />
                Envoyer la proposition
              </Button>
              <Button variant="outline" onClick={() => setShowProposalModal(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConstructionRequestDetailPage;
