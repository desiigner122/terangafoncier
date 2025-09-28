import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target,
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
  Users,
  Send,
  Star,
  DollarSign,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ParticulierZonesCommunales = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCandidatureForm, setShowCandidatureForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    adresse: '',
    cni: '',
    profession: '',
    revenus: '',
    
    // Motivation et projet
    motivation: '',
    projet: '',
    financement: '',
    delai: ''
  });

  // Zones communales disponibles
  const zonesDisponibles = [
    {
      id: 'ZC001',
      nom: 'Zone Résidentielle Pikine Nord',
      commune: 'Pikine',
      region: 'Dakar',
      superficie: '2.5 hectares',
      nombreLots: 45,
      lotsDisponibles: 12,
      prix: '2 500 000',
      dateOuverture: '2024-02-01',
      dateLimite: '2024-03-15',
      statut: 'ouvert',
      description: 'Zone résidentielle moderne avec toutes les commodités. Lots de 200m² à 300m².',
      equipements: ['Électricité', 'Eau potable', 'Assainissement', 'Routes bitumées']
    },
    {
      id: 'ZC002',
      nom: 'Zone Mixte Guédiawaye Centre',
      commune: 'Guédiawaye',
      region: 'Dakar',
      superficie: '1.8 hectares',
      nombreLots: 30,
      lotsDisponibles: 8,
      prix: '3 200 000',
      dateOuverture: '2024-01-15',
      dateLimite: '2024-02-28',
      statut: 'ouvert',
      description: 'Zone mixte permettant habitation et commerce. Idéale pour entrepreneurs.',
      equipements: ['Électricité', 'Eau potable', 'Fibre optique', 'Transport public']
    },
    {
      id: 'ZC003',
      nom: 'Zone Résidentielle Thiès Sud',
      commune: 'Thiès',
      region: 'Thiès',
      superficie: '3.2 hectares',
      nombreLots: 60,
      lotsDisponibles: 25,
      prix: '1 800 000',
      dateOuverture: '2024-02-10',
      dateLimite: '2024-04-10',
      statut: 'ouvert',
      description: 'Nouvelle zone résidentielle calme avec vue panoramique.',
      equipements: ['Électricité', 'Eau potable', 'Espaces verts', 'École primaire']
    }
  ];

  // Mes candidatures
  const mesCandidatures = [
    {
      id: 'CAND001',
      zoneId: 'ZC001',
      zoneName: 'Zone Résidentielle Pikine Nord',
      commune: 'Pikine',
      datePostulation: '2024-01-20',
      statut: 'en_cours',
      position: 5,
      totalCandidats: 28
    },
    {
      id: 'CAND002',
      zoneId: 'ZC002',
      zoneName: 'Zone Mixte Guédiawaye Centre',
      commune: 'Guédiawaye',
      datePostulation: '2024-01-18',
      statut: 'accepte',
      position: 2,
      totalCandidats: 15
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ouvert': return 'bg-green-100 text-green-800 border-green-200';
      case 'ferme': return 'bg-red-100 text-red-800 border-red-200';
      case 'bientot': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepte': return 'bg-green-100 text-green-800 border-green-200';
      case 'refuse': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ouvert': return <CheckCircle className="w-4 h-4" />;
      case 'ferme': return <AlertCircle className="w-4 h-4" />;
      case 'bientot': return <Clock className="w-4 h-4" />;
      case 'en_cours': return <Clock className="w-4 h-4" />;
      case 'accepte': return <CheckCircle className="w-4 h-4" />;
      case 'refuse': return <AlertCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Candidature soumise:', formData);
    setShowCandidatureForm(false);
    setCurrentStep(1);
    setFormData({
      nom: '', prenom: '', telephone: '', email: '', adresse: '', cni: '',
      profession: '', revenus: '', motivation: '', projet: '', financement: '', delai: ''
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
        <p className="text-sm text-slate-600">Renseignez vos informations pour postuler</p>
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
          <Label htmlFor="adresse">Adresse actuelle *</Label>
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
        <div>
          <Label htmlFor="profession">Profession *</Label>
          <Input
            id="profession"
            value={formData.profession}
            onChange={(e) => handleInputChange('profession', e.target.value)}
            placeholder="Votre profession"
            className="mt-1"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="revenus">Revenus mensuels</Label>
          <Input
            id="revenus"
            value={formData.revenus}
            onChange={(e) => handleInputChange('revenus', e.target.value)}
            placeholder="Ex: 500 000 FCFA"
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
        <h3 className="text-lg font-bold text-slate-900">Motivation et Projet</h3>
        <p className="text-sm text-slate-600">Expliquez votre projet et motivation</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="motivation">Motivation pour cette zone *</Label>
          <Textarea
            id="motivation"
            value={formData.motivation}
            onChange={(e) => handleInputChange('motivation', e.target.value)}
            placeholder="Expliquez pourquoi vous souhaitez obtenir un lot dans cette zone..."
            className="mt-1 h-32"
          />
        </div>
        <div>
          <Label htmlFor="projet">Description de votre projet *</Label>
          <Textarea
            id="projet"
            value={formData.projet}
            onChange={(e) => handleInputChange('projet', e.target.value)}
            placeholder="Décrivez le projet que vous comptez réaliser sur ce terrain..."
            className="mt-1 h-32"
          />
        </div>
        <div>
          <Label htmlFor="financement">Mode de financement</Label>
          <Select onValueChange={(value) => handleInputChange('financement', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Comment financez-vous votre projet ?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fonds-propres">Fonds propres</SelectItem>
              <SelectItem value="credit-bancaire">Crédit bancaire</SelectItem>
              <SelectItem value="mixte">Mixte (fonds propres + crédit)</SelectItem>
              <SelectItem value="epargne">Épargne personnelle</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="delai">Délai de réalisation prévu</Label>
          <Select onValueChange={(value) => handleInputChange('delai', value)}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Dans combien de temps comptez-vous construire ?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6-mois">Dans les 6 mois</SelectItem>
              <SelectItem value="1-an">Dans l'année</SelectItem>
              <SelectItem value="2-ans">Dans les 2 ans</SelectItem>
              <SelectItem value="3-ans">Dans les 3 ans</SelectItem>
              <SelectItem value="plus-tard">Plus tard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </motion.div>
  );

  const renderCandidatureForm = () => (
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
              <CardTitle className="text-xl">Candidature Zone Communale</CardTitle>
              <CardDescription>Étape {currentStep} sur 2</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCandidatureForm(false)}
            >
              ✕
            </Button>
          </div>
          
          {/* Progress bar */}
          <div className="flex items-center space-x-2 mt-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 2 && (
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
            
            {currentStep < 2 ? (
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
                Postuler
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
          <h1 className="text-2xl font-bold text-slate-900">Zones Communales</h1>
          <p className="text-slate-600">Candidatez sur les zones communales ouvertes</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="zones-disponibles" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="zones-disponibles">Zones Disponibles</TabsTrigger>
          <TabsTrigger value="mes-candidatures">Mes Candidatures</TabsTrigger>
        </TabsList>

        <TabsContent value="zones-disponibles" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher une zone..."
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
                    <SelectItem value="ouvert">Ouvert</SelectItem>
                    <SelectItem value="bientot">Bientôt</SelectItem>
                    <SelectItem value="ferme">Fermé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Zones disponibles */}
          <div className="grid gap-6">
            {zonesDisponibles.map((zone) => (
              <Card key={zone.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                        <Target className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{zone.nom}</h3>
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {zone.commune}, {zone.region}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>{zone.superficie}</span>
                          <span>•</span>
                          <span>{zone.nombreLots} lots</span>
                          <span>•</span>
                          <span className="text-green-600 font-medium">{zone.lotsDisponibles} disponibles</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(zone.statut)} flex items-center gap-1 mb-2`}>
                        {getStatusIcon(zone.statut)}
                        {zone.statut === 'ouvert' && 'Ouvert'}
                        {zone.statut === 'ferme' && 'Fermé'}
                        {zone.statut === 'bientot' && 'Bientôt'}
                      </Badge>
                      <p className="text-lg font-bold text-slate-900">{zone.prix.toLocaleString()} FCFA</p>
                      <p className="text-xs text-slate-500">par lot</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-slate-700 mb-3">{zone.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {zone.equipements.map((equipement, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {equipement}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="text-sm text-slate-500">
                      <p>Ouvert le: {new Date(zone.dateOuverture).toLocaleDateString('fr-FR')}</p>
                      <p>Limite: {new Date(zone.dateLimite).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                      {zone.statut === 'ouvert' && (
                        <Button 
                          onClick={() => setShowCandidatureForm(true)}
                          className="bg-green-600 hover:bg-green-700"
                          size="sm"
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Postuler
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mes-candidatures" className="space-y-6">
          {/* Mes candidatures */}
          <div className="grid gap-4">
            {mesCandidatures.map((candidature) => (
              <Card key={candidature.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{candidature.zoneName}</h3>
                        <p className="text-sm text-slate-600">
                          {candidature.commune} • Position: {candidature.position}/{candidature.totalCandidats}
                        </p>
                        <p className="text-xs text-slate-500">
                          Postulé le {new Date(candidature.datePostulation).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(candidature.statut)} flex items-center gap-1`}>
                        {getStatusIcon(candidature.statut)}
                        {candidature.statut === 'en_cours' && 'En cours'}
                        {candidature.statut === 'accepte' && 'Accepté'}
                        {candidature.statut === 'refuse' && 'Refusé'}
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
      </Tabs>

      {/* Formulaire de candidature */}
      <AnimatePresence>
        {showCandidatureForm && renderCandidatureForm()}
      </AnimatePresence>
    </div>
  );
};

export default ParticulierZonesCommunales;