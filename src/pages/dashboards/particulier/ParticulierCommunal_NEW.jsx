import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
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
  Home,
  Phone,
  Mail,
  IdCard,
  Building,
  Ruler,
  Target,
  Send
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ParticulierCommunal = () => {
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNewDemandeForm, setShowNewDemandeForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    cni: '',
    
    // Étape 2: Localisation
    region: '',
    commune: '',
    quartier: '',
    superficie: '',
    
    // Étape 3: Type de demande et détails
    typeDemande: '',
    usage: '',
    justification: '',
    documents: []
  });

  // Données des régions et communes du Sénégal
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
    ],
    'saint-louis': [
      { id: 'saint-louis-nord', name: 'Saint-Louis Nord' },
      { id: 'saint-louis-sud', name: 'Saint-Louis Sud' },
      { id: 'dagana', name: 'Dagana' },
      { id: 'podor', name: 'Podor' }
    ]
  };

  // Données exemple des demandes
  const demandes = [
    {
      id: 'DTC001',
      type: 'Terrain Résidentiel',
      commune: 'Parcelles Assainies',
      superficie: '200 m²',
      statut: 'en_cours',
      dateDepot: '2024-01-15',
      dateModification: '2024-01-20'
    },
    {
      id: 'DTC002',
      type: 'Terrain Commercial',
      commune: 'Médina',
      superficie: '150 m²',
      statut: 'approuve',
      dateDepot: '2024-01-10',
      dateModification: '2024-01-25'
    },
    {
      id: 'DTC003',
      type: 'Terrain Résidentiel',
      commune: 'Grand Yoff',
      superficie: '300 m²',
      statut: 'rejete',
      dateDepot: '2024-01-08',
      dateModification: '2024-01-22'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_cours': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approuve': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejete': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en_cours': return <Clock className="w-4 h-4" />;
      case 'approuve': return <CheckCircle className="w-4 h-4" />;
      case 'rejete': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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
    console.log('Formulaire soumis:', formData);
    setShowNewDemandeForm(false);
    setCurrentStep(1);
    setFormData({
      nom: '', prenom: '', telephone: '', email: '', adresse: '', cni: '',
      region: '', commune: '', quartier: '', superficie: '',
      typeDemande: '', usage: '', justification: '', documents: []
    });
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Informations Personnelles</h3>
        <p className="text-sm text-slate-600">Veuillez renseigner vos informations personnelles</p>
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
          <Label htmlFor="adresse">Adresse *</Label>
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
        <h3 className="text-lg font-bold text-slate-900">Localisation du Terrain</h3>
        <p className="text-sm text-slate-600">Indiquez la localisation souhaitée pour votre terrain</p>
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
          <Label htmlFor="quartier">Quartier (optionnel)</Label>
          <Input
            id="quartier"
            value={formData.quartier}
            onChange={(e) => handleInputChange('quartier', e.target.value)}
            placeholder="Nom du quartier"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="superficie">Superficie souhaitée *</Label>
          <Input
            id="superficie"
            value={formData.superficie}
            onChange={(e) => handleInputChange('superficie', e.target.value)}
            placeholder="Ex: 200 m²"
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
        <h3 className="text-lg font-bold text-slate-900">Détails de la Demande</h3>
        <p className="text-sm text-slate-600">Précisez le type et l'usage du terrain demandé</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="typeDemande">Type de demande *</Label>
          <Select onValueChange={(value) => handleInputChange('typeDemande', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sélectionnez le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="attribution">Attribution de terrain communal</SelectItem>
              <SelectItem value="regularisation">Régularisation foncière</SelectItem>
              <SelectItem value="cession">Demande de cession</SelectItem>
              <SelectItem value="location">Location de terrain</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="usage">Usage prévu *</Label>
          <Select onValueChange={(value) => handleInputChange('usage', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Usage du terrain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residentiel">Résidentiel</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industriel">Industriel</SelectItem>
              <SelectItem value="agricole">Agricole</SelectItem>
              <SelectItem value="mixte">Mixte</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="justification">Justification de la demande *</Label>
          <Textarea
            id="justification"
            value={formData.justification}
            onChange={(e) => handleInputChange('justification', e.target.value)}
            placeholder="Expliquez les raisons de votre demande..."
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
              <CardTitle className="text-xl">Nouvelle Demande Communale</CardTitle>
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
          <h1 className="text-2xl font-bold text-slate-900">Demandes Communales</h1>
          <p className="text-slate-600">Gérez vos demandes de terrains communaux</p>
        </div>
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
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{demande.type}</h3>
                    <p className="text-sm text-slate-600">
                      {demande.commune} • {demande.superficie}
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

      {/* Formulaire de nouvelle demande */}
      <AnimatePresence>
        {showNewDemandeForm && renderNewDemandeForm()}
      </AnimatePresence>
    </div>
  );
};

export default ParticulierCommunal;