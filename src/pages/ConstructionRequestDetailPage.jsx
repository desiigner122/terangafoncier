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
import { supabase } from '@/lib/supabaseClient';

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
    let isMounted = true;

    const fetchRequest = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('construction_requests')
          .select('*, property:properties(id,title,name,location)')
          .eq('id', id)
          .single();

        if (!isMounted) return;

        if (error || !data) {
          setRequest(null);
        } else {
          setRequest(data);
        }
      } catch (err) {
        if (isMounted) setRequest(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRequest();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Recherche promoteur':
        return { icon: <Building2 className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' };
      case 'En négociation':
        return { icon: <MessageCircle className="w-4 h-4" />, color: 'bg-orange-100 text-orange-800', bgColor: 'bg-orange-50' };
      case 'Contrat signé':
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

  const formatAmount = (value) =>
    value !== null && value !== undefined && value !== '' && !Number.isNaN(Number(value))
      ? Number(value).toLocaleString('fr-FR')
      : null;

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
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Demande non trouvée</h2>
          <Button onClick={() => navigate('/promoter-requests')}>
            Retour aux demandes
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(request.status);
  const propertyName = request.property?.title || request.property?.name || null;
  const propertyLocation = request.property?.location || null;
  const budgetFormatted = formatAmount(request.budget);
  // Pas de colonnes sources pour ces données : états vides honnêtes
  const images = [];
  const documents = [];
  const proposals = [];

  return (
    <>
      <Helmet>
        <title>{request.title || 'Demande de construction'} - Demande de Construction | Teranga Foncier</title>
        <meta name="description" content={`Demande de construction: ${request.title || ''}.${budgetFormatted ? ` Budget: ${budgetFormatted} FCFA.` : ''}`} />
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
                  <span className="ml-1">{request.status || 'Non renseigné'}</span>
                </Badge>
                {request.priority && (
                  <Badge className={getPriorityColor(request.priority)}>
                    Priorité {request.priority}
                  </Badge>
                )}
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
                  {request.title || 'Demande de construction'}
                </h1>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <MapPin className="w-4 h-4" />
                    <span>{propertyLocation || 'Localisation non renseignée'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Building2 className="w-4 h-4" />
                    <span>{propertyName || 'Terrain non renseigné'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Euro className="w-4 h-4" />
                    <span>{budgetFormatted ? `${budgetFormatted} FCFA` : 'Budget non renseigné'}</span>
                  </div>
                </div>
                <p className="text-xl opacity-90 mb-8">
                  {request.created_at
                    ? `Demande soumise le ${new Date(request.created_at).toLocaleDateString('fr-FR')}`
                    : 'Date de soumission non renseignée'}
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
                {images.length > 0 ? (
                  <>
                    <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                      <img
                        src={images[activeImageIndex]}
                        alt={`Image ${activeImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {activeImageIndex + 1} / {images.length}
                      </div>
                    </div>

                    {/* Miniatures */}
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {images.map((image, index) => (
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
                  </>
                ) : (
                  <div className="aspect-video rounded-lg overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                    <Building2 className="w-12 h-12 mb-3 opacity-70" />
                    <p className="font-medium">Aucune image disponible</p>
                  </div>
                )}
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
                <TabsTrigger value="specifications">Spécifications</TabsTrigger>
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
                          Détails du Projet
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Titre de la demande</span>
                            <p className="font-semibold">{request.title || 'Non renseigné'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Terrain associé</span>
                            <p className="font-semibold">{propertyName || 'Non renseigné'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Localisation</span>
                            <p className="font-semibold">{propertyLocation || 'Non renseigné'}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-500">Statut</span>
                            <p className="font-semibold">{request.status || 'Non renseigné'}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-sm font-medium text-gray-500">Configuration</span>
                            <p className="font-semibold">Non renseigné</p>
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
                              {budgetFormatted ? `${budgetFormatted} FCFA` : 'Non renseigné'}
                            </div>
                            <p className="text-gray-600">Budget total estimé</p>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                              <div className="text-xl font-bold text-blue-600">—</div>
                              <div className="text-sm text-gray-600">Construction</div>
                            </div>
                            <div className="text-center p-4 bg-emerald-50 rounded-lg">
                              <div className="text-xl font-bold text-emerald-600">—</div>
                              <div className="text-sm text-gray-600">Finition</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <div className="text-xl font-bold text-purple-600">—</div>
                              <div className="text-sm text-gray-600">Équipement</div>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-3">Plan de financement</h4>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span>Fonds propres:</span>
                                <span className="font-semibold text-gray-500">Non renseigné</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Crédit bancaire:</span>
                                <span className="font-semibold text-gray-500">Non renseigné</span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="font-semibold">Recherché:</span>
                                <span className="font-semibold text-gray-500">Non renseigné</span>
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
                          <p className="font-semibold text-gray-500">Non renseigné</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Demande soumise</span>
                          <p className="font-semibold">
                            {request.created_at
                              ? new Date(request.created_at).toLocaleDateString('fr-FR')
                              : 'Non renseigné'}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Dernière mise à jour</span>
                          <p className="font-semibold text-gray-500">Non renseigné</p>
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
                          {documents.map((doc, index) => (
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
                          {documents.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">Aucun document</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Spécifications techniques */}
              <TabsContent value="specifications" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Style et Matériaux</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Style architectural</span>
                        <p className="font-semibold text-gray-500">Non renseigné</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500 block mb-2">Matériaux préférés</span>
                        <p className="text-sm text-gray-500">Non renseigné</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Équipements Spéciaux</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500">Aucun équipement renseigné</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Standards et Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Non renseigné</p>
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
                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-600">Aucun smart contract associé pour le moment</span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Adresse du contrat</span>
                          <p className="font-mono text-sm bg-gray-100 p-2 rounded text-gray-500">Non renseigné</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">NFT ID</span>
                          <p className="font-semibold text-gray-500">Non renseigné</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-500">Montant en séquestre</span>
                          <p className="font-semibold text-gray-500">—</p>
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
                        <p className="text-sm text-gray-500 text-center py-4">Aucun jalon défini</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Propositions reçues */}
              <TabsContent value="proposals" className="space-y-6">
                <div className="space-y-6">
                  {proposals.map((proposal, index) => (
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
                            proposal.status === 'En négociation' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                          }>
                            {proposal.status}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {proposal.proposedBudget?.toLocaleString('fr-FR')} FCFA
                            </div>
                            <div className="text-sm text-gray-600">Budget proposé</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{proposal.timeline}</div>
                            <div className="text-sm text-gray-600">Délai de réalisation</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{proposal.advantages?.length}</div>
                            <div className="text-sm text-gray-600">Avantages</div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className="text-sm font-medium text-gray-500 block mb-2">Points forts</span>
                          <div className="flex flex-wrap gap-2">
                            {(proposal.advantages || []).map((advantage, i) => (
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
                          {proposal.status === 'Proposition reçue' && (
                            <Button size="sm" variant="outline" className="flex-1">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Accepter
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {proposals.length === 0 && (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                          Aucune proposition reçue
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Soyez le premier promoteur à proposer vos services pour ce projet
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
                        <p className="font-semibold text-gray-500">Non renseigné</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Profil</span>
                        <p className="font-semibold text-gray-500">Non renseigné</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Localisation</span>
                        <p className="font-semibold text-gray-500">Non renseigné</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email</span>
                        <p className="font-semibold text-gray-500">Non renseigné</p>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold mb-4">Critères de Sélection Promoteur</h4>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-500">Aucun critère renseigné</p>
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
            <h2 className="text-3xl font-bold mb-4">Intéressé par ce projet ?</h2>
            <p className="text-xl mb-8 opacity-90">
              Contactez le client ou soumettez votre proposition dès maintenant
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
              <p className="font-semibold text-lg text-gray-500">Non renseigné</p>
              <p className="text-gray-600">Coordonnées du client bientôt disponibles</p>
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
                <Label>Budget proposé (FCFA)</Label>
                <Input placeholder="75,000,000" />
              </div>
              <div>
                <Label>Délai de réalisation</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir" />
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
              <Label>Message de présentation</Label>
              <Textarea
                placeholder="Présentez votre entreprise, votre expérience et vos points forts pour ce projet..."
                rows={4}
              />
            </div>

            <div>
              <Label>Documents à joindre</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Glissez vos fichiers ici ou cliquez pour parcourir</p>
                <p className="text-sm text-gray-500 mt-1">Portfolio, certifications, références...</p>
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
