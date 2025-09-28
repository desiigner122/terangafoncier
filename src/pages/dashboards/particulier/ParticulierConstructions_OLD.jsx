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
    },
    {
      id: 'PC003',
      type: 'Permis de Construire',
      projet: 'Immeuble R+2',
      commune: 'Médina',
      surface: '200 m²',
      statut: 'rejete',
      dateDepot: '2024-01-08',
      dateModification: '2024-01-22'
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

  const handleDistanceInputChange = (field, value) => {
    setDistanceFormData(prev => ({
      ...prev,
      [field]: value
    }));
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

  // Données pour le formulaire à distance
  const paysDisponibles = [
    'France', 'Espagne', 'Italie', 'États-Unis', 'Canada', 'Maroc', 'Côte d\'Ivoire', 
    'Mali', 'Burkina Faso', 'Gambie', 'Guinée', 'Mauritanie', 'Allemagne', 'Belgique',
    'Pays-Bas', 'Royaume-Uni', 'Arabie Saoudite', 'Émirats Arabes Unis', 'Qatar'
  ];

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
                Construction à Distance
              </CardTitle>
              <CardDescription>Construisez depuis l'étranger avec un suivi professionnel</CardDescription>
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
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations Personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distanceNom">Nom complet *</Label>
                <Input
                  id="distanceNom"
                  value={distanceFormData.nom}
                  onChange={(e) => handleDistanceInputChange('nom', e.target.value)}
                  placeholder="Votre nom complet"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="distancePrenom">Prénom *</Label>
                <Input
                  id="distancePrenom"
                  value={distanceFormData.prenom}
                  onChange={(e) => handleDistanceInputChange('prenom', e.target.value)}
                  placeholder="Votre prénom"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="distanceTelephone">Téléphone *</Label>
                <Input
                  id="distanceTelephone"
                  value={distanceFormData.telephone}
                  onChange={(e) => handleDistanceInputChange('telephone', e.target.value)}
                  placeholder="+33 6 12 34 56 78"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="distanceEmail">Email *</Label>
                <Input
                  id="distanceEmail"
                  type="email"
                  value={distanceFormData.email}
                  onChange={(e) => handleDistanceInputChange('email', e.target.value)}
                  placeholder="votre@email.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="distancePays">Pays de résidence *</Label>
                <Select onValueChange={(value) => handleDistanceInputChange('pays', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionnez votre pays" />
                  </SelectTrigger>
                  <SelectContent>
                    {paysDisponibles.map((pays) => (
                      <SelectItem key={pays} value={pays}>{pays}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="distanceAdresse">Adresse actuelle</Label>
                <Input
                  id="distanceAdresse"
                  value={distanceFormData.adresseEtranger}
                  onChange={(e) => handleDistanceInputChange('adresseEtranger', e.target.value)}
                  placeholder="Votre adresse actuelle"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Projet de construction */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Détails du Projet</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distanceBudget">Budget disponible *</Label>
                <Select onValueChange={(value) => handleDistanceInputChange('budget', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Votre budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15-25M">15 - 25 millions FCFA</SelectItem>
                    <SelectItem value="25-40M">25 - 40 millions FCFA</SelectItem>
                    <SelectItem value="40-60M">40 - 60 millions FCFA</SelectItem>
                    <SelectItem value="60-100M">60 - 100 millions FCFA</SelectItem>
                    <SelectItem value="100M+">Plus de 100 millions FCFA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="distanceTypeProjet">Type de projet *</Label>
                <Select onValueChange={(value) => handleDistanceInputChange('typeProjet', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Type de construction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa-moderne">Villa Moderne</SelectItem>
                    <SelectItem value="maison-traditionnelle">Maison Traditionnelle</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="immeuble">Petit Immeuble</SelectItem>
                    <SelectItem value="commercial">Bâtiment Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="distanceSurface">Surface souhaitée (m²) *</Label>
                <Input
                  id="distanceSurface"
                  type="number"
                  value={distanceFormData.surface}
                  onChange={(e) => handleDistanceInputChange('surface', e.target.value)}
                  placeholder="200"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="distanceNombrePieces">Nombre de pièces *</Label>
                <Select onValueChange={(value) => handleDistanceInputChange('nombrePieces', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Nombre de pièces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 pièces</SelectItem>
                    <SelectItem value="3">3 pièces</SelectItem>
                    <SelectItem value="4">4 pièces</SelectItem>
                    <SelectItem value="5">5 pièces</SelectItem>
                    <SelectItem value="6+">6+ pièces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Localisation au Sénégal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Localisation au Sénégal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="distanceRegion">Région cible *</Label>
                <Select onValueChange={(value) => handleDistanceInputChange('regionCible', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Région souhaitée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dakar">Dakar</SelectItem>
                    <SelectItem value="thies">Thiès</SelectItem>
                    <SelectItem value="saint-louis">Saint-Louis</SelectItem>
                    <SelectItem value="diourbel">Diourbel</SelectItem>
                    <SelectItem value="kaolack">Kaolack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="distanceCommune">Commune préférée</Label>
                <Input
                  id="distanceCommune"
                  value={distanceFormData.communeCible}
                  onChange={(e) => handleDistanceInputChange('communeCible', e.target.value)}
                  placeholder="Nom de la commune"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="distanceDescription">Description du projet</Label>
            <textarea
              id="distanceDescription"
              value={distanceFormData.description}
              onChange={(e) => handleDistanceInputChange('description', e.target.value)}
              placeholder="Décrivez votre projet en détail..."
              rows={4}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md resize-none"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowDistanceForm(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleDistanceSubmit}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Soumettre la Demande
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Informations Personnelles</h3>
        <p className="text-sm text-slate-600">Informations du demandeur du permis</p>
      </div>

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
          <Label htmlFor="prenom">Prénom *</Label>
          <Input
            id="prenom"
            value={formData.prenom}
            onChange={(e) => handleInputChange('prenom', e.target.value)}
            placeholder="Votre prénom"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="telephone">Téléphone *</Label>
          <Input
            id="telephone"
            value={formData.telephone}
            onChange={(e) => handleInputChange('telephone', e.target.value)}
            placeholder="+221 XX XXX XX XX"
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
        <div className="md:col-span-2">
          <Label htmlFor="adresse">Adresse du demandeur *</Label>
          <Input
            id="adresse"
            value={formData.adresse}
            onChange={(e) => handleInputChange('adresse', e.target.value)}
            placeholder="Votre adresse complète"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="cni">Numéro CNI *</Label>
          <Input
            id="cni"
            value={formData.cni}
            onChange={(e) => handleInputChange('cni', e.target.value)}
            placeholder="1 XXXX XXXX XXXXX X"
            className="mt-1"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Localisation du Projet</h3>
        <p className="text-sm text-slate-600">Où se situe votre projet de construction ?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="region">Région *</Label>
          <Select onValueChange={(value) => handleInputChange('region', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionnez une région" />
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
        <div>
          <Label htmlFor="commune">Commune *</Label>
          <Select 
            onValueChange={(value) => handleInputChange('commune', value)}
            disabled={!formData.region}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionnez une commune" />
            </SelectTrigger>
            <SelectContent>
              {formData.region && communesParRegion[formData.region]?.map((commune) => (
                <SelectItem key={commune.id} value={commune.id}>
                  {commune.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="quartier">Quartier</Label>
          <Input
            id="quartier"
            value={formData.quartier}
            onChange={(e) => handleInputChange('quartier', e.target.value)}
            placeholder="Nom du quartier"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="referenceCadastrale">Référence cadastrale</Label>
          <Input
            id="referenceCadastrale"
            value={formData.referenceCadastrale}
            onChange={(e) => handleInputChange('referenceCadastrale', e.target.value)}
            placeholder="Ex: TF 1234/R"
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="adresseProjet">Adresse précise du projet *</Label>
          <Input
            id="adresseProjet"
            value={formData.adresseProjet}
            onChange={(e) => handleInputChange('adresseProjet', e.target.value)}
            placeholder="Adresse exacte du projet de construction"
            className="mt-1"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Détails du Projet</h3>
        <p className="text-sm text-slate-600">Décrivez votre projet de construction</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <SelectItem value="batiment-industriel">Bâtiment industriel</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="surface">Surface à construire *</Label>
            <Input
              id="surface"
              value={formData.surface}
              onChange={(e) => handleInputChange('surface', e.target.value)}
              placeholder="Ex: 120 m²"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="nombreNiveaux">Nombre de niveaux *</Label>
            <Select onValueChange={(value) => handleInputChange('nombreNiveaux', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Nombre de niveaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rdc">RDC uniquement</SelectItem>
                <SelectItem value="r+1">R+1 (2 niveaux)</SelectItem>
                <SelectItem value="r+2">R+2 (3 niveaux)</SelectItem>
                <SelectItem value="r+3">R+3 (4 niveaux)</SelectItem>
                <SelectItem value="plus">Plus de 4 niveaux</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="usage">Usage prévu *</Label>
            <Select onValueChange={(value) => handleInputChange('usage', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Usage du bâtiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="habitation">Habitation</SelectItem>
                <SelectItem value="commerce">Commerce</SelectItem>
                <SelectItem value="bureau">Bureau</SelectItem>
                <SelectItem value="industrie">Industrie</SelectItem>
                <SelectItem value="mixte">Mixte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="cout">Coût estimé du projet</Label>
          <Input
            id="cout"
            value={formData.cout}
            onChange={(e) => handleInputChange('cout', e.target.value)}
            placeholder="Ex: 15 000 000 FCFA"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="description">Description du projet *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Décrivez en détail votre projet de construction..."
            className="mt-1 h-32"
          />
        </div>
      </div>
    </motion.div>
  );

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
              <CardTitle className="text-xl">Nouvelle Demande de Construction</CardTitle>
              <CardDescription>Étape {currentStep} sur 3</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewDemandeForm(false)}
            >
              ✕
            </Button>
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center space-x-2 mt-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Précédent
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4" />
                Soumettre
              </Button>
            )}
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