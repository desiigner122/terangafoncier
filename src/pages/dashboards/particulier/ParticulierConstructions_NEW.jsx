import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2,
  Plus,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  FileText,
  Phone,
  Mail,
  CreditCard,
  Target,
  Send,
  Home,
  Hammer,
  Camera,
  Video,
  DollarSign,
  Users,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ParticulierConstructions = () => {
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewDemandeForm, setShowNewDemandeForm] = useState(false);
  const [showDistanceForm, setShowDistanceForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    cni: '',
    
    // Étape 2: Localisation du projet
    region: '',
    commune: '',
    quartier: '',
    adresseProjet: '',
    referenceCadastrale: '',
    
    // Étape 3: Détails du projet de construction
    typeConstruction: '',
    surface: '',
    nombreNiveaux: '',
    usage: '',
    cout: '',
    description: '',
    documents: []
  });

  const [distanceFormData, setDistanceFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresseEtranger: '',
    pays: '',
    
    // Projet de construction
    budget: '',
    typeProjet: '',
    surface: '',
    nombrePieces: '',
    styleArchitectural: '',
    delaiSouhaite: '',
    
    // Localisation au Sénégal
    regionCible: '',
    communeCible: '',
    typeZone: '',
    
    // Services souhaités
    servicesSupplementaires: [],
    description: ''
  });

  // Régions du Sénégal
  const regions = [
    { id: 'dakar', name: 'Dakar' },
    { id: 'thies', name: 'Thiès' },
    { id: 'saint-louis', name: 'Saint-Louis' },
    { id: 'diourbel', name: 'Diourbel' },
    { id: 'louga', name: 'Louga' },
    { id: 'fatick', name: 'Fatick' },
    { id: 'kaolack', name: 'Kaolack' },
    { id: 'kaffrine', name: 'Kaffrine' },
    { id: 'tambacounda', name: 'Tambacounda' },
    { id: 'kedougou', name: 'Kédougou' },
    { id: 'kolda', name: 'Kolda' },
    { id: 'sedhiou', name: 'Sédhiou' },
    { id: 'ziguinchor', name: 'Ziguinchor' },
    { id: 'matam', name: 'Matam' }
  ];

  const communesParRegion = {
    'dakar': [
      { id: 'dakar-plateau', name: 'Dakar-Plateau' },
      { id: 'grand-dakar', name: 'Grand Dakar' },
      { id: 'parcelles-assainies', name: 'Parcelles Assainies' },
      { id: 'almadies', name: 'Almadies' },
      { id: 'ngor', name: 'Ngor' },
      { id: 'ouakam', name: 'Ouakam' },
      { id: 'yoff', name: 'Yoff' },
      { id: 'patte-doie', name: "Patte d'Oie" },
      { id: 'sicap-liberte', name: 'Sicap Liberté' },
      { id: 'medina', name: 'Médina' },
      { id: 'gueule-tapee', name: 'Gueule Tapée' },
      { id: 'hann-bel-air', name: 'Hann Bel Air' },
      { id: 'grand-yoff', name: 'Grand Yoff' }
    ],
    'thies': [
      { id: 'thies-nord', name: 'Thiès Nord' },
      { id: 'thies-sud', name: 'Thiès Sud' },
      { id: 'thies-est', name: 'Thiès Est' },
      { id: 'thies-ouest', name: 'Thiès Ouest' },
      { id: 'mbour', name: 'Mbour' },
      { id: 'tivaouane', name: 'Tivaouane' }
    ]
  };

  // Pays pour diaspora
  const paysDisponibles = [
    'France', 'Italie', 'Espagne', 'États-Unis', 'Canada', 'Allemagne', 
    'Belgique', 'Suisse', 'Royaume-Uni', 'Autre'
  ];

  // Données exemple des demandes de constructions
  const demandes = [
    {
      id: 'PC001',
      type: 'Permis de Construire',
      projet: 'Villa R+1',
      commune: 'Parcelles Assainies',
      surface: '120 m²',
      statut: 'en_cours',
      dateDepot: '2024-01-15',
      dateModification: '2024-01-20'
    },
    {
      id: 'PC002',
      type: 'Autorisation de Construire',
      projet: 'Maison Individuelle',
      commune: 'Grand Yoff',
      surface: '80 m²',
      statut: 'approuve',
      dateDepot: '2024-01-10',
      dateModification: '2024-01-25'
    }
  ];

  // Projets construction à distance
  const projetsDistance = [
    {
      id: 'CD001',
      type: 'Construction à Distance',
      projet: 'Villa Moderne 4 pièces',
      promoteur: 'TERANGA CONSTRUCTION',
      budget: '25 000 000 FCFA',
      statut: 'en_cours',
      avancement: '65%',
      dateDebut: '2024-01-15',
      dateLivraison: '2024-06-15'
    },
    {
      id: 'CD002',
      type: 'Construction à Distance',
      projet: 'Maison Familiale 6 pièces',
      promoteur: 'SUNU CONSTRUCTION',
      budget: '35 000 000 FCFA',
      statut: 'termine',
      avancement: '100%',
      dateDebut: '2023-08-01',
      dateLivraison: '2024-02-01'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_cours': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approuve': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejete': return 'bg-red-100 text-red-800 border-red-200';
      case 'termine': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en_cours': return <Clock className="w-4 h-4" />;
      case 'approuve': return <CheckCircle className="w-4 h-4" />;
      case 'rejete': return <AlertCircle className="w-4 h-4" />;
      case 'termine': return <CheckCircle className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDistanceInputChange = (field, value) => {
    setDistanceFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Demande de construction soumise:', formData);
    setShowNewDemandeForm(false);
    setCurrentStep(1);
    setFormData({
      nom: '', prenom: '', telephone: '', email: '', adresse: '', cni: '',
      region: '', commune: '', quartier: '', adresseProjet: '', referenceCadastrale: '',
      typeConstruction: '', surface: '', nombreNiveaux: '', usage: '', cout: '', description: '', documents: []
    });
  };

  const handleDistanceSubmit = () => {
    console.log('Demande construction à distance soumise:', distanceFormData);
    setShowDistanceForm(false);
    setCurrentStep(1);
    setDistanceFormData({
      nom: '', prenom: '', telephone: '', email: '', adresseEtranger: '', pays: '',
      budget: '', typeProjet: '', surface: '', nombrePieces: '', styleArchitectural: '', delaiSouhaite: '',
      regionCible: '', communeCible: '', typeZone: '', servicesSupplementaires: [], description: ''
    });
  };

  // Formulaire construction à distance (simplifié)
  const renderDistanceForm = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Demande Construction à Distance
              </CardTitle>
              <CardDescription>Construisez votre maison au Sénégal depuis l'étranger</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDistanceForm(false)}
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom complet *</Label>
              <Input
                id="nom"
                value={distanceFormData.nom}
                onChange={(e) => handleDistanceInputChange('nom', e.target.value)}
                placeholder="Votre nom complet"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={distanceFormData.email}
                onChange={(e) => handleDistanceInputChange('email', e.target.value)}
                placeholder="votre@email.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="telephone">Téléphone *</Label>
              <Input
                id="telephone"
                value={distanceFormData.telephone}
                onChange={(e) => handleDistanceInputChange('telephone', e.target.value)}
                placeholder="Numéro international"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pays">Pays de résidence *</Label>
              <Select onValueChange={(value) => handleDistanceInputChange('pays', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez votre pays" />
                </SelectTrigger>
                <SelectContent>
                  {paysDisponibles.map((pays) => (
                    <SelectItem key={pays} value={pays.toLowerCase()}>
                      {pays}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="budget">Budget total (FCFA) *</Label>
              <Input
                id="budget"
                value={distanceFormData.budget}
                onChange={(e) => handleDistanceInputChange('budget', e.target.value)}
                placeholder="Ex: 25 000 000"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="typeProjet">Type de projet *</Label>
              <Select onValueChange={(value) => handleDistanceInputChange('typeProjet', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Type de construction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="villa-moderne">Villa Moderne</SelectItem>
                  <SelectItem value="maison-traditionnelle">Maison Traditionnelle</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                  <SelectItem value="maison-familiale">Maison Familiale</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="surface">Surface souhaitée *</Label>
              <Input
                id="surface"
                value={distanceFormData.surface}
                onChange={(e) => handleDistanceInputChange('surface', e.target.value)}
                placeholder="Ex: 150 m²"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="regionCible">Région cible au Sénégal *</Label>
              <Select onValueChange={(value) => handleDistanceInputChange('regionCible', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Où construire ?" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description de votre projet *</Label>
            <Textarea
              id="description"
              value={distanceFormData.description}
              onChange={(e) => handleDistanceInputChange('description', e.target.value)}
              placeholder="Décrivez votre vision, vos besoins spécifiques, délais souhaités..."
              className="mt-1 h-32"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDistanceForm(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDistanceSubmit}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Envoyer la Demande
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Formulaire permis de construire (version simplifiée pour l'espace)
  const renderNewDemandeForm = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Nouvelle Demande de Permis</CardTitle>
              <CardDescription>Demande de permis de construire</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewDemandeForm(false)}
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="Votre nom"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="votre@email.com"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="typeConstruction">Type de construction *</Label>
              <Select onValueChange={(value) => handleInputChange('typeConstruction', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Type de construction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maison-individuelle">Maison individuelle</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="immeuble">Immeuble</SelectItem>
                  <SelectItem value="local-commercial">Local commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="surface">Surface *</Label>
              <Input
                id="surface"
                value={formData.surface}
                onChange={(e) => handleInputChange('surface', e.target.value)}
                placeholder="Ex: 120 m²"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description du projet *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez votre projet de construction..."
              className="mt-1 h-24"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowNewDemandeForm(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Soumettre
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Demandes de Constructions</h1>
          <p className="text-slate-600">Permis de construire et constructions à distance</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="permis-construire" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="permis-construire">Permis de Construire</TabsTrigger>
          <TabsTrigger value="construction-distance">Construction à Distance</TabsTrigger>
        </TabsList>

        <TabsContent value="permis-construire" className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={() => setShowNewDemandeForm(true)}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Demande
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher une demande..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="approuve">Approuvé</SelectItem>
                    <SelectItem value="rejete">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Liste des demandes */}
          <div className="grid gap-4">
            {demandes.map((demande) => (
              <Card key={demande.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{demande.type}</h3>
                        <p className="text-sm text-slate-600">
                          {demande.projet} • {demande.commune} • {demande.surface}
                        </p>
                        <p className="text-xs text-slate-500">
                          Déposé le {new Date(demande.dateDepot).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(demande.statut)} flex items-center gap-1`}>
                        {getStatusIcon(demande.statut)}
                        {demande.statut === 'en_cours' && 'En cours'}
                        {demande.statut === 'approuve' && 'Approuvé'}
                        {demande.statut === 'rejete' && 'Rejeté'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="construction-distance" className="space-y-6">
          <div className="flex justify-end">
            <Button
              onClick={() => setShowDistanceForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Nouvelle Demande à Distance
            </Button>
          </div>

          {/* Info card */}
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Construction à Distance</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Idéal pour la diaspora ! Construisez votre maison au Sénégal depuis l'étranger 
                    avec un suivi professionnel en temps réel.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Camera className="w-3 h-3 mr-1" />
                      Suivi Photo Quotidien
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Video className="w-3 h-3 mr-1" />
                      Rapports Vidéo
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      Équipe Dédiée
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projets à distance */}
          <div className="grid gap-4">
            {projetsDistance.map((projet) => (
              <Card key={projet.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{projet.projet}</h3>
                        <p className="text-sm text-slate-600">
                          {projet.promoteur} • {projet.budget}
                        </p>
                        <p className="text-xs text-slate-500">
                          Début: {new Date(projet.dateDebut).toLocaleDateString('fr-FR')} • 
                          Livraison: {new Date(projet.dateLivraison).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={`${getStatusColor(projet.statut)} flex items-center gap-1 mb-1`}>
                          {getStatusIcon(projet.statut)}
                          {projet.statut === 'en_cours' && 'En cours'}
                          {projet.statut === 'termine' && 'Terminé'}
                        </Badge>
                        <p className="text-sm font-medium text-slate-600">{projet.avancement}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Formulaires */}
      <AnimatePresence>
        {showNewDemandeForm && renderNewDemandeForm()}
        {showDistanceForm && renderDistanceForm()}
      </AnimatePresence>
    </div>
  );
};

export default ParticulierConstructions;