import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin,
  Building,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Calendar,
  Phone,
  Mail,
  Search,
  Filter,
  Plus,
  Eye,
  MessageSquare,
  Target,
  Award,
  Star,
  DollarSign,
  Send,
  ArrowRight,
  ArrowLeft,
  Upload,
  Download,
  Activity,
  Heart,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ParticulierZonesCommunales = ({ dashboardStats }) => {
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('demandes');
  const [currentStep, setCurrentStep] = useState(1);
  const [showCandidatureForm, setShowCandidatureForm] = useState(false);
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

  // Mes demandes de zones communales
  const mesDemandesZones = [
    {
      id: 'DZC001',
      nom: 'Zone Résidentielle Pikine Nord',
      commune: 'Pikine',
      region: 'Dakar',
      superficie: '200m²',
      prix: '2 500 000',
      dateDemande: '2024-02-15',
      statut: 'en_attente',
      numeroReference: 'REF-ZC-2024-001',
      description: 'Demande de lot résidentiel pour construction familiale.',
      etapeActuelle: 'Évaluation du dossier',
      documentsManquants: ['Certificat de revenus récent'],
      prochainRendezVous: '2024-03-10 à 14h00',
      contactResponsable: {
        nom: 'Mme Fatou NDIAYE',
        telephone: '77 123 45 67',
        email: 'f.ndiaye@teranga.sn'
      }
    },
    {
      id: 'DZC002',
      nom: 'Zone Mixte Guédiawaye Centre',
      commune: 'Guédiawaye',
      region: 'Dakar',
      superficie: '150m²',
      prix: '1 800 000',
      dateDemande: '2024-01-20',
      statut: 'approuve',
      numeroReference: 'REF-ZC-2024-002',
      description: 'Demande approuvée pour lot commercial.',
      etapeActuelle: 'Signature du contrat',
      prochainRendezVous: '2024-03-05 à 10h00',
      contactResponsable: {
        nom: 'M. Ousmane DIOP',
        telephone: '77 987 65 43',
        email: 'o.diop@teranga.sn'
      }
    }
  ];

  // Zones favorites (venant de la page favoris)
  const zonesFavorites = [
    {
      id: 'ZF001',
      nom: 'Zone Résidentielle Thiès Sud',
      commune: 'Thiès',
      region: 'Thiès',
      prix: '1 800 000',
      superficie: '250m²',
      dateAjoutFavoris: '2024-02-20',
      description: 'Zone résidentielle calme avec vue panoramique.',
      disponible: true
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
          <h1 className="text-2xl font-bold text-slate-900">Mes Zones Communales</h1>
          <p className="text-slate-600">Gérez vos demandes et zones favorites</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demandes">Mes Demandes</TabsTrigger>
          <TabsTrigger value="favoris">Zones Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="demandes" className="space-y-6">
          {/* Mes Demandes de Zones */}
          <div className="grid gap-6">
            {mesDemandesZones.map((demande) => (
              <Card key={demande.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center">
                        <Building className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{demande.nom}</h3>
                        <p className="text-sm text-slate-600 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {demande.commune}, {demande.region}
                        </p>
                        <p className="text-sm font-medium text-amber-600 mt-1">
                          Réf: {demande.numeroReference}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      className={`${
                        demande.statut === 'approuve' ? 'bg-green-100 text-green-800' :
                        demande.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {demande.statut === 'approuve' ? 'Approuvé' :
                       demande.statut === 'en_attente' ? 'En attente' : 'Refusé'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-500">Superficie demandée</p>
                      <p className="font-semibold">{demande.superficie}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Prix</p>
                      <p className="font-semibold text-green-600">{parseInt(demande.prix).toLocaleString()} FCFA</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Date de demande</p>
                      <p className="font-semibold">{demande.dateDemande}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Étape actuelle</p>
                      <p className="font-semibold text-blue-600">{demande.etapeActuelle}</p>
                    </div>
                  </div>

                  {demande.prochainRendezVous && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 text-blue-800 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">Prochain rendez-vous</span>
                      </div>
                      <p className="text-blue-700">{demande.prochainRendezVous}</p>
                    </div>
                  )}

                  {demande.documentsManquants && demande.documentsManquants.length > 0 && (
                    <div className="bg-amber-50 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 text-amber-800 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-semibold">Documents manquants</span>
                      </div>
                      <ul className="text-amber-700 text-sm space-y-1">
                        {demande.documentsManquants.map((doc, index) => (
                          <li key={index}>• {doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                      <span className="font-medium">Contact: </span>
                      {demande.contactResponsable.nom} - {demande.contactResponsable.telephone}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDemande(demande)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contacter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favoris" className="space-y-6">
          {/* Mes Zones Favorites */}
          <div className="grid gap-6">
            {zonesFavorites.length > 0 ? (
              zonesFavorites.map((zone) => (
                <Card key={zone.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
                          <Star className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{zone.nom}</h3>
                          <p className="text-sm text-slate-600 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {zone.commune}, {zone.region}
                          </p>
                          <p className="text-sm text-amber-600 mt-1">
                            Ajouté aux favoris le {zone.dateAjoutFavoris}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className={`${
                          zone.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {zone.disponible ? 'Disponible' : 'Non disponible'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-slate-500">Superficie</p>
                        <p className="font-semibold">{zone.superficie}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Prix estimé</p>
                        <p className="font-semibold text-green-600">{parseInt(zone.prix).toLocaleString()} FCFA</p>
                      </div>
                    </div>

                    <p className="text-slate-600 mb-4">{zone.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>Zone favorite</span>
                      </div>
                      <div className="flex gap-2">
                        {zone.disponible && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Faire une demande
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Retirer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune zone favorite</h3>
                  <p className="text-slate-600 mb-4">
                    Vous n'avez pas encore ajouté de zones à vos favoris.
                  </p>
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Parcourir les zones disponibles
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticulierZonesCommunales;
