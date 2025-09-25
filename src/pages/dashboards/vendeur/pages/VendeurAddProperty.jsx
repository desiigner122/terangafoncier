import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus,
  Upload,
  MapPin,
  DollarSign,
  Home,
  Building2,
  Camera,
  FileText,
  Brain,
  Zap,
  Target,
  Lightbulb,
  Save,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const VendeurAddProperty = ({ stats }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    size: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    features: []
  });

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const propertyTypes = [
    { value: 'terrain', label: 'Terrain' },
    { value: 'villa', label: 'Villa' },
    { value: 'maison', label: 'Maison' },
    { value: 'appartement', label: 'Appartement' },
    { value: 'studio', label: 'Studio' },
    { value: 'duplex', label: 'Duplex' },
    { value: 'commercial', label: 'Commercial' }
  ];

  const locations = [
    'Dakar Plateau',
    'Almadies',
    'Sacré-Cœur',
    'Mermoz',
    'Ouakam',
    'Point E',
    'Fann',
    'Liberté',
    'Grand Dakar',
    'Parcelles Assainies'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Simulation de suggestions IA
    if (field === 'location' && value) {
      setAiSuggestions([
        {
          type: 'price',
          message: `Prix moyen dans ${value}: 45M - 65M XOF`,
          confidence: 85
        },
        {
          type: 'demand',
          message: `Forte demande dans cette zone (+23% ce mois)`,
          confidence: 92
        }
      ]);
    }
  };

  const generateAIAnalysis = async () => {
    // Simulation analyse IA
    setAiAnalysis({
      priceRecommendation: {
        min: 45000000,
        max: 65000000,
        optimal: 55000000,
        confidence: 88
      },
      marketInsights: [
        'Cette zone a une croissance de 12% sur les 6 derniers mois',
        'Les propriétés similaires se vendent en moyenne en 45 jours',
        'Recommandation: ajouter des photos de qualité professionnelle'
      ],
      optimizationTips: [
        'Utilisez des mots-clés comme "moderne", "sécurisé" dans la description',
        'Mettez en avant la proximité des commodités',
        'Prix compétitif par rapport au marché local'
      ]
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const steps = [
    { id: 1, title: 'Informations de base', icon: Home },
    { id: 2, title: 'Détails et photos', icon: Camera },
    { id: 3, title: 'Optimisation IA', icon: Brain },
    { id: 4, title: 'Publication', icon: CheckCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Ajouter une Propriété</h1>
          <p className="text-gray-600">Créez une annonce optimisée avec l'intelligence artificielle</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-purple-100 text-purple-800">
            <Brain className="h-3 w-3 mr-1" />
            IA Activée
          </Badge>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive ? 'bg-purple-600 text-white' :
                    isCompleted ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-purple-600' :
                      isCompleted ? 'text-green-600' :
                      'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions IA */}
      {aiSuggestions.length > 0 && (
        <Alert className="border-purple-200 bg-purple-50">
          <Brain className="h-4 w-4" />
          <AlertTitle>Suggestions IA</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-2">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                    {suggestion.confidence}% sûr
                  </Badge>
                  <span className="text-sm">{suggestion.message}</span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Étape 1: Informations de base */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Informations de base
                  </CardTitle>
                  <CardDescription>
                    Renseignez les informations principales de votre propriété
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre de l'annonce *
                    </label>
                    <Input
                      placeholder="Ex: Villa moderne avec piscine à Almadies"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de propriété *
                      </label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => handleInputChange('type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Localisation *
                      </label>
                      <Select 
                        value={formData.location} 
                        onValueChange={(value) => handleInputChange('location', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner la zone" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prix (XOF) *
                      </label>
                      <Input
                        type="number"
                        placeholder="Ex: 50000000"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Superficie *
                      </label>
                      <Input
                        placeholder="Ex: 200m²"
                        value={formData.size}
                        onChange={(e) => handleInputChange('size', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      placeholder="Décrivez votre propriété en détail..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Continuer
                      <Camera className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Étape 2: Photos et détails */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Photos et détails supplémentaires
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Ajoutez des photos
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Glissez-déposez vos photos ou cliquez pour sélectionner
                    </p>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Choisir les photos
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de chambres
                      </label>
                      <Input
                        type="number"
                        placeholder="Ex: 3"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de salles de bain
                      </label>
                      <Input
                        type="number"
                        placeholder="Ex: 2"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      Retour
                    </Button>
                    <Button 
                      onClick={() => {
                        setCurrentStep(3);
                        generateAIAnalysis();
                      }}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Optimiser avec IA
                      <Brain className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Étape 3: Optimisation IA */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Optimisation IA
                  </CardTitle>
                  <CardDescription>
                    L'IA analyse votre annonce et propose des améliorations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {aiAnalysis && (
                    <>
                      {/* Recommandation de prix */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="h-5 w-5 text-green-600" />
                          <h3 className="font-semibold text-green-800">
                            Recommandation de prix
                          </h3>
                          <Badge className="bg-green-100 text-green-800">
                            {aiAnalysis.priceRecommendation.confidence}% sûr
                          </Badge>
                        </div>
                        <p className="text-green-800 mb-2">
                          Prix optimal: <strong>{formatCurrency(aiAnalysis.priceRecommendation.optimal)}</strong>
                        </p>
                        <p className="text-sm text-green-700">
                          Fourchette recommandée: {formatCurrency(aiAnalysis.priceRecommendation.min)} - {formatCurrency(aiAnalysis.priceRecommendation.max)}
                        </p>
                      </div>

                      {/* Insights marché */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Lightbulb className="h-5 w-5 text-yellow-600" />
                          Insights Marché
                        </h3>
                        <div className="space-y-2">
                          {aiAnalysis.marketInsights.map((insight, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Conseils d'optimisation */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Zap className="h-5 w-5 text-purple-600" />
                          Conseils d'Optimisation
                        </h3>
                        <div className="space-y-2">
                          {aiAnalysis.optimizationTips.map((tip, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-gray-700">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      Retour
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(4)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Publier l'annonce
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Étape 4: Publication */}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Annonce publiée avec succès !
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Votre propriété est maintenant visible sur la plateforme avec optimisation IA.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir l'annonce
                    </Button>
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une autre propriété
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar d'aide */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conseils IA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Brain className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Photos de qualité</p>
                  <p className="text-xs text-gray-600">Utilisez des photos en haute résolution</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Prix compétitif</p>
                  <p className="text-xs text-gray-600">L'IA analyse le marché local</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Description détaillée</p>
                  <p className="text-xs text-gray-600">Plus d'infos = plus d'intérêt</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Annonces actives</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vues ce mois</span>
                  <span className="font-semibold">1,245</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taux de conversion</span>
                  <span className="font-semibold text-green-600">12.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendeurAddProperty;