/**
 * ðŸ§  PAGE CONFIGURATION IA ASSISTÉE POUR TERRAINS
 * Système 100% autonome pour configuration de veille et alertes
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast-simple';
import { 
  Brain, 
  MapPin, 
  Bell, 
  Target, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Zap,
  Settings,
  Search,
  Filter,
  DollarSign,
  Clock,
  Home,
  Building,
  TreePine
} from 'lucide-react';
import { autonomousAI } from '@/services/AutonomousAIService';

const AIAssistedTerrainConfigPage = () => {
  const [step, setStep] = useState(1);
  const [configuration, setConfiguration] = useState({
    zones: [],
    budget: '',
    surface: '',
    type: '',
    urgency: 'normale',
    notifications: {
      newListings: true,
      priceDrops: true,
      communalLands: true,
      opportunities: true
    },
    aiPersonalization: true
  });
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configComplete, setConfigComplete] = useState(false);
  const { toast } = useToast();

  // Zones populaires au Sénégal
  const popularZones = [
    { name: 'Liberté 6', demand: 'Très élevée', priceRange: '25-45M', availability: 'Rare' },
    { name: 'Almadies', demand: 'Élevée', priceRange: '40-80M', availability: 'Limitée' },
    { name: 'Sicap Liberté', demand: 'Élevée', priceRange: '20-35M', availability: 'Modérée' },
    { name: 'Guédiawaye', demand: 'Modérée', priceRange: '15-25M', availability: 'Bonne' },
    { name: 'Pikine', demand: 'Modérée', priceRange: '10-20M', availability: 'Bonne' },
    { name: 'Rufisque', demand: 'Modérée', priceRange: '8-15M', availability: 'Très bonne' },
    { name: 'Thiès', demand: 'Moyenne', priceRange: '5-12M', availability: 'Excellente' },
    { name: 'Diamniadio', demand: 'Croissante', priceRange: '12-25M', availability: 'Bonne' }
  ];

  const terrainTypes = [
    { id: 'residentiel', name: 'Résidentiel', icon: Home, description: 'Pour construction de maison' },
    { id: 'commercial', name: 'Commercial', icon: Building, description: 'Pour activités commerciales' },
    { id: 'industriel', name: 'Industriel', icon: Settings, description: 'Pour activités industrielles' },
    { id: 'agricole', name: 'Agricole', icon: TreePine, description: 'Pour exploitation agricole' },
    { id: 'mixte', name: 'Mixte', icon: Target, description: 'Usage multiple possible' }
  ];

  useEffect(() => {
    // Démarrage de l'analyse IA en arrière-plan
    if (step === 1) {
      performInitialAIAnalysis();
    }
  }, []);

  const performInitialAIAnalysis = async () => {
    try {
      const analysis = await autonomousAI.generateAutonomousMarketInsights();
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Erreur analyse IA:', error);
    }
  };

  const handleZoneSelection = (zone) => {
    setConfiguration(prev => ({
      ...prev,
      zones: prev.zones.includes(zone.name) 
        ? prev.zones.filter(z => z !== zone.name)
        : [...prev.zones, zone.name]
    }));
  };

  const handleConfigurationComplete = async () => {
    setIsConfiguring(true);
    
    try {
      // L'IA configure automatiquement le système de veille
      const aiConfig = await autonomousAI.createAssistedConfiguration({
        userPreferences: configuration,
        requestType: 'TERRAIN_MONITORING',
        autonomousMode: true
      });

      // Configuration spéciale pour Liberté 6 si sélectionné
      if (configuration.zones.includes('Liberté 6')) {
        const liberte6Alert = await autonomousAI.createLiberte6AlertSystem(configuration);
        console.log('Configuration Liberté 6:', liberte6Alert);
      }

      setConfigComplete(true);
      toast({
        title: "ðŸ§  Configuration IA Terminée !",
        description: "L'IA surveille maintenant vos zones d'intérêt de manière autonome",
      });

    } catch (error) {
      toast({
        title: "Erreur",
        description: "Problème lors de la configuration IA",
        variant: "destructive"
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  if (configComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-green-600" />
              </motion.div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ðŸ§  Configuration IA Terminée !
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                L'Intelligence Artificielle surveille maintenant <strong>{configuration.zones.length} zone(s)</strong> de manière autonome
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-blue-600" />
                      Alertes Actives
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {configuration.zones.map(zone => (
                        <div key={zone} className="flex items-center justify-between">
                          <span>{zone}</span>
                          <Badge variant="secondary">Surveillé IA</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-purple-600" />
                      IA Autonome
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Analyse de marché continue
                      </div>
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Détection d'opportunités
                      </div>
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Notifications intelligentes
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  ðŸ¤– Promesse de l'IA Autonome
                </h3>
                <p className="text-blue-800">
                  "Je vais analyser le marché 24h/24, détecter les nouvelles opportunités dans vos zones d'intérêt, 
                  et vous notifier instantanément. Quand une parcelle apparaîtra Ï  <strong>Liberté 6</strong> ou dans vos autres zones, 
                  vous serez le premier informé avec mon analyse complète."
                </p>
              </div>

              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.location.href = '/dashboard'}
              >
                Voir Mon Dashboard IA
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ðŸ§  Configuration IA Assistée
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              L'Intelligence Artificielle va configurer automatiquement votre système de veille personnalisé. 
              Plus besoin d'attendre, l'IA vous notifiera dès qu'une opportunité apparaît !
            </p>
          </motion.div>

          {/* Stepper */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && <div className={`w-16 h-1 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                      1. Sélectionnez vos zones d'intérêt
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {popularZones.map((zone) => (
                        <motion.div
                          key={zone.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleZoneSelection(zone)}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            configuration.zones.includes(zone.name)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{zone.name}</h3>
                            {configuration.zones.includes(zone.name) && (
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>Demande: {zone.demand}</div>
                            <div>Prix: {zone.priceRange} FCFA</div>
                            <div>Disponibilité: {zone.availability}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {configuration.zones.includes('Liberté 6') && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl"
                      >
                        <div className="flex items-start">
                          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3" />
                          <div>
                            <h4 className="font-semibold text-amber-800">ðŸŽ¯ Zone Prioritaire Détectée !</h4>
                            <p className="text-amber-700 text-sm mt-1">
                              <strong>Liberté 6</strong> est une zone très demandée avec peu de disponibilités. 
                              L'IA va activer une surveillance renforcée et vous notifiera instantanément 
                              dès qu'une parcelle ou qu'une demande communale sera disponible.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <div></div>
                  <Button 
                    onClick={() => setStep(2)}
                    disabled={configuration.zones.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Continuer
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="w-6 h-6 mr-2 text-green-600" />
                        2. Préférences de terrain
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Type de terrain */}
                      <div>
                        <Label className="text-base font-medium mb-3 block">Type de terrain</Label>
                        <div className="grid grid-cols-1 gap-3">
                          {terrainTypes.map((type) => (
                            <div
                              key={type.id}
                              onClick={() => setConfiguration(prev => ({ ...prev, type: type.id }))}
                              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                configuration.type === type.id
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                            >
                              <div className="flex items-center">
                                <type.icon className="w-5 h-5 mr-3 text-gray-600" />
                                <div>
                                  <div className="font-medium">{type.name}</div>
                                  <div className="text-sm text-gray-500">{type.description}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Budget */}
                      <div>
                        <Label htmlFor="budget" className="text-base font-medium">Budget maximum (FCFA)</Label>
                        <Input
                          id="budget"
                          placeholder="Ex: 30000000"
                          value={configuration.budget}
                          onChange={(e) => setConfiguration(prev => ({ ...prev, budget: e.target.value }))}
                          className="mt-2"
                        />
                      </div>

                      {/* Surface */}
                      <div>
                        <Label htmlFor="surface" className="text-base font-medium">Surface souhaitée (mÂ²)</Label>
                        <Input
                          id="surface"
                          placeholder="Ex: 300"
                          value={configuration.surface}
                          onChange={(e) => setConfiguration(prev => ({ ...prev, surface: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bell className="w-6 h-6 mr-2 text-purple-600" />
                        3. Configuration des alertes IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { key: 'newListings', label: 'Nouvelles annonces', icon: 'ðŸ†•' },
                        { key: 'priceDrops', label: 'Baisses de prix', icon: 'ðŸ“‰' },
                        { key: 'communalLands', label: 'Terrains communaux', icon: 'ðŸ›ï¸' },
                        { key: 'opportunities', label: 'Opportunités IA', icon: 'ðŸ’Ž' }
                      ].map((alert) => (
                        <div key={alert.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <span className="text-xl mr-3">{alert.icon}</span>
                            <span className="font-medium">{alert.label}</span>
                          </div>
                          <Button
                            variant={configuration.notifications[alert.key] ? "default" : "outline"}
                            size="sm"
                            onClick={() => setConfiguration(prev => ({
                              ...prev,
                              notifications: {
                                ...prev.notifications,
                                [alert.key]: !prev.notifications[alert.key]
                              }
                            }))}
                          >
                            {configuration.notifications[alert.key] ? 'Activé' : 'Désactivé'}
                          </Button>
                        </div>
                      ))}

                      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Brain className="w-5 h-5 text-purple-600 mr-2" />
                          <span className="font-semibold text-purple-800">IA Personnalisée</span>
                        </div>
                        <p className="text-sm text-purple-700">
                          L'IA apprendra de vos préférences et ajustera automatiquement 
                          la pertinence des alertes pour vous proposer les meilleures opportunités.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Retour
                  </Button>
                  <Button onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700">
                    Continuer
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="w-6 h-6 mr-2 text-purple-600" />
                      Récapitulatif et Activation IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold text-lg mb-4">Configuration sélectionnée</h3>
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium">Zones surveillées:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {configuration.zones.map(zone => (
                                <Badge key={zone} variant="secondary">{zone}</Badge>
                              ))}
                            </div>
                          </div>
                          {configuration.type && (
                            <div>
                              <span className="font-medium">Type:</span> {terrainTypes.find(t => t.id === configuration.type)?.name}
                            </div>
                          )}
                          {configuration.budget && (
                            <div>
                              <span className="font-medium">Budget max:</span> {parseInt(configuration.budget).toLocaleString()} FCFA
                            </div>
                          )}
                          {configuration.surface && (
                            <div>
                              <span className="font-medium">Surface:</span> {configuration.surface} mÂ²
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                        <h3 className="font-semibold text-lg mb-4 text-blue-900">ðŸ¤– L'IA va maintenant:</h3>
                        <div className="space-y-3">
                          {[
                            'Surveiller vos zones 24h/24',
                            'Analyser toutes les nouvelles annonces',
                            'Détecter les opportunités uniques',
                            'Vous notifier instantanément',
                            'Négocier les meilleurs prix',
                            'Gérer vos demandes communales'
                          ].map((action, index) => (
                            <motion.div
                              key={action}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center text-blue-800"
                            >
                              <Zap className="w-4 h-4 mr-2 text-blue-600" />
                              {action}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Retour
                  </Button>
                  <Button 
                    onClick={handleConfigurationComplete}
                    disabled={isConfiguring}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                  >
                    {isConfiguring ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Configuration IA...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Activer l'IA Autonome
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIAssistedTerrainConfigPage;

