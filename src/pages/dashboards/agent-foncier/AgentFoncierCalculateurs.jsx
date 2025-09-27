import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  TrendingUp, 
  MapPin, 
  Building2, 
  Ruler, 
  DollarSign,
  Percent,
  BarChart3,
  PieChart,
  LineChart,
  Home,
  TreePine,
  Zap,
  Target,
  Activity,
  Layers,
  Grid3X3,
  Triangle,
  Square,
  Circle,
  Compass,
  Scale,
  Calendar,
  Clock,
  ArrowUpDown,
  RotateCcw,
  Save,
  Download,
  Share2,
  History,
  Settings,
  Info,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AgentFoncierCalculateurs = () => {
  const [loading, setLoading] = useState(true);
  const [activeCalculator, setActiveCalculator] = useState('evaluateur');
  const [calculationHistory, setCalculationHistory] = useState([]);

  // États pour l'évaluateur de terrain
  const [terrainData, setTerrainData] = useState({
    superficie: '',
    zone: 'almadies',
    type: 'residentiel',
    viabilisation: true,
    proximiteRoute: 'directe',
    vueMer: false,
    services: [],
    etatTerrain: 'bon'
  });

  // États pour calculateur superficie
  const [superficieData, setSuperficieData] = useState({
    forme: 'rectangle',
    dimensions: {
      longueur: '',
      largeur: '',
      rayon: '',
      cotes: ['', '', '', '']
    }
  });

  // États pour estimateur loyer
  const [loyerData, setLoyerData] = useState({
    typeBien: 'appartement',
    superficie: '',
    chambres: 2,
    sallesDeBain: 1,
    zone: 'almadies',
    standing: 'moyen',
    equipements: [],
    parking: false
  });

  // États pour analyseur zone
  const [zoneData, setZoneData] = useState({
    zone1: 'almadies',
    zone2: 'parcelles_assainies',
    criteres: ['prix_m2', 'accessibilite', 'services']
  });

  const [results, setResults] = useState({
    evaluateur: null,
    superficie: null,
    loyer: null,
    zone: null
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const calculateurs = [
    {
      id: 'evaluateur',
      nom: 'Évaluateur Terrain',
      description: 'Estimation automatisée de la valeur foncière',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
      category: 'Évaluation'
    },
    {
      id: 'superficie',
      nom: 'Calculateur Superficie',
      description: 'Calcul précis des superficies et périmètres',
      icon: Ruler,
      color: 'bg-blue-100 text-blue-600',
      category: 'Mesures'
    },
    {
      id: 'loyer',
      nom: 'Estimateur Loyer',
      description: 'Estimation des loyers de marché',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
      category: 'Finance'
    },
    {
      id: 'zone',
      nom: 'Analyseur Zone',
      description: 'Analyse comparative des zones géographiques',
      icon: MapPin,
      color: 'bg-orange-100 text-orange-600',
      category: 'Analyse'
    },
    {
      id: 'rentabilite',
      nom: 'Calculateur Rentabilité',
      description: 'ROI et rendement locatif',
      icon: Percent,
      color: 'bg-indigo-100 text-indigo-600',
      category: 'Finance'
    },
    {
      id: 'taxes',
      nom: 'Calculateur Taxes',
      description: 'Taxes foncières et droits d\'enregistrement',
      icon: Calculator,
      color: 'bg-red-100 text-red-600',
      category: 'Fiscal'
    }
  ];

  const zones = [
    { value: 'almadies', label: 'Almadies', prixM2: 1200000 },
    { value: 'dakar_plateau', label: 'Dakar Plateau', prixM2: 850000 },
    { value: 'parcelles_assainies', label: 'Parcelles Assainies', prixM2: 420000 },
    { value: 'rufisque', label: 'Rufisque', prixM2: 280000 },
    { value: 'thiès', label: 'Thiès', prixM2: 180000 },
    { value: 'mbour', label: 'Mbour', prixM2: 320000 }
  ];

  const services = [
    { id: 'ecole', label: 'École à proximité', bonus: 0.05 },
    { id: 'hopital', label: 'Hôpital proche', bonus: 0.03 },
    { id: 'transport', label: 'Transport public', bonus: 0.04 },
    { id: 'commerce', label: 'Centres commerciaux', bonus: 0.02 },
    { id: 'securite', label: 'Zone sécurisée', bonus: 0.06 }
  ];

  // Fonctions de calcul
  const calculateTerrainValue = () => {
    if (!terrainData.superficie) return;

    const baseZone = zones.find(z => z.value === terrainData.zone);
    let prixBase = baseZone.prixM2;
    
    // Ajustements selon le type
    const typeMultipliers = {
      'residentiel': 1.0,
      'commercial': 1.8,
      'industriel': 0.6,
      'agricole': 0.3
    };
    
    prixBase *= typeMultipliers[terrainData.type];
    
    // Ajustements selon les caractéristiques
    if (terrainData.viabilisation) prixBase *= 1.15;
    if (terrainData.vueMer) prixBase *= 1.25;
    
    // Bonus services
    terrainData.services.forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      if (service) prixBase *= (1 + service.bonus);
    });
    
    // Ajustement proximité route
    const routeMultipliers = {
      'directe': 1.0,
      'proche': 0.95,
      'eloignee': 0.85
    };
    prixBase *= routeMultipliers[terrainData.proximiteRoute];
    
    const valeurTotale = Math.round(prixBase * parseFloat(terrainData.superficie));
    
    setResults(prev => ({
      ...prev,
      evaluateur: {
        prixM2: Math.round(prixBase),
        valeurTotale,
        details: {
          superficie: terrainData.superficie,
          zone: baseZone.label,
          type: terrainData.type
        }
      }
    }));
  };

  const calculateSuperficie = () => {
    let superficie = 0;
    let perimetre = 0;
    
    switch (superficieData.forme) {
      case 'rectangle':
        const l = parseFloat(superficieData.dimensions.longueur) || 0;
        const w = parseFloat(superficieData.dimensions.largeur) || 0;
        superficie = l * w;
        perimetre = 2 * (l + w);
        break;
      case 'cercle':
        const r = parseFloat(superficieData.dimensions.rayon) || 0;
        superficie = Math.PI * r * r;
        perimetre = 2 * Math.PI * r;
        break;
      case 'triangle':
        // Triangle équilatéral pour simplifier
        const cote = parseFloat(superficieData.dimensions.cotes[0]) || 0;
        superficie = (Math.sqrt(3) / 4) * cote * cote;
        perimetre = 3 * cote;
        break;
    }
    
    setResults(prev => ({
      ...prev,
      superficie: {
        superficie: Math.round(superficie * 100) / 100,
        perimetre: Math.round(perimetre * 100) / 100,
        forme: superficieData.forme
      }
    }));
  };

  const calculateLoyer = () => {
    if (!loyerData.superficie) return;
    
    const baseZone = zones.find(z => z.value === loyerData.zone);
    let loyerM2 = Math.round(baseZone.prixM2 * 0.008); // ~0.8% du prix d'achat
    
    // Ajustements selon le type
    const typeMultipliers = {
      'appartement': 1.0,
      'villa': 1.2,
      'studio': 0.8,
      'bureau': 1.5
    };
    
    loyerM2 *= typeMultipliers[loyerData.typeBien];
    
    // Ajustements standing
    const standingMultipliers = {
      'economique': 0.7,
      'moyen': 1.0,
      'haut': 1.5,
      'luxe': 2.2
    };
    
    loyerM2 *= standingMultipliers[loyerData.standing];
    
    const loyerTotal = Math.round(loyerM2 * parseFloat(loyerData.superficie));
    
    setResults(prev => ({
      ...prev,
      loyer: {
        loyerM2,
        loyerTotal,
        details: {
          superficie: loyerData.superficie,
          zone: baseZone.label,
          type: loyerData.typeBien,
          standing: loyerData.standing
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Calculator className="h-8 w-8 mr-3 text-blue-600" />
            Calculateurs Fonciers
          </h1>
          <p className="text-gray-600">Suite d'outils d'évaluation et d'analyse professionnels</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            Historique
          </Button>
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Sélection des calculateurs */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Outils de Calcul</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {calculateurs.map((calc, index) => (
                  <motion.button
                    key={calc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveCalculator(calc.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      activeCalculator === calc.id ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${calc.color}`}>
                        <calc.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{calc.nom}</div>
                        <div className="text-xs text-gray-500">{calc.category}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Interface de calcul */}
        <div className="lg:col-span-3">
          <Tabs value={activeCalculator} onValueChange={setActiveCalculator}>
            {/* Évaluateur de Terrain */}
            <TabsContent value="evaluateur">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Évaluateur de Terrain
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Superficie (m²)
                        </label>
                        <Input
                          type="number"
                          value={terrainData.superficie}
                          onChange={(e) => setTerrainData({...terrainData, superficie: e.target.value})}
                          placeholder="Ex: 500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zone géographique
                        </label>
                        <select
                          value={terrainData.zone}
                          onChange={(e) => setTerrainData({...terrainData, zone: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          {zones.map(zone => (
                            <option key={zone.value} value={zone.value}>
                              {zone.label} ({zone.prixM2.toLocaleString()} XOF/m²)
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type de terrain
                        </label>
                        <select
                          value={terrainData.type}
                          onChange={(e) => setTerrainData({...terrainData, type: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="residentiel">Résidentiel</option>
                          <option value="commercial">Commercial</option>
                          <option value="industriel">Industriel</option>
                          <option value="agricole">Agricole</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Caractéristiques spéciales
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={terrainData.viabilisation}
                              onChange={(e) => setTerrainData({...terrainData, viabilisation: e.target.checked})}
                              className="mr-2"
                            />
                            Terrain viabilisé
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={terrainData.vueMer}
                              onChange={(e) => setTerrainData({...terrainData, vueMer: e.target.checked})}
                              className="mr-2"
                            />
                            Vue sur mer
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Services à proximité
                        </label>
                        <div className="space-y-2">
                          {services.map(service => (
                            <label key={service.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={terrainData.services.includes(service.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setTerrainData({
                                      ...terrainData,
                                      services: [...terrainData.services, service.id]
                                    });
                                  } else {
                                    setTerrainData({
                                      ...terrainData,
                                      services: terrainData.services.filter(s => s !== service.id)
                                    });
                                  }
                                }}
                                className="mr-2"
                              />
                              {service.label} <span className="text-green-600 text-sm">(+{Math.round(service.bonus * 100)}%)</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={calculateTerrainValue}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculer la valeur
                    </Button>
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                  
                  {results.evaluateur && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50 border border-green-200 rounded-lg p-6"
                    >
                      <h3 className="font-semibold text-green-900 mb-4">Résultat de l'évaluation</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-green-700">Prix au m²</p>
                          <p className="text-2xl font-bold text-green-900">
                            {results.evaluateur.prixM2.toLocaleString()} XOF
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-green-700">Valeur totale</p>
                          <p className="text-2xl font-bold text-green-900">
                            {results.evaluateur.valeurTotale.toLocaleString()} XOF
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Exporter PDF
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Partager
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calculateur de Superficie */}
            <TabsContent value="superficie">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Ruler className="h-5 w-5 mr-2" />
                    Calculateur de Superficie
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Forme du terrain
                        </label>
                        <div className="flex gap-2">
                          {[
                            { value: 'rectangle', icon: Square, label: 'Rectangle' },
                            { value: 'cercle', icon: Circle, label: 'Cercle' },
                            { value: 'triangle', icon: Triangle, label: 'Triangle' }
                          ].map(forme => (
                            <button
                              key={forme.value}
                              onClick={() => setSuperficieData({...superficieData, forme: forme.value})}
                              className={`p-3 border rounded-lg flex flex-col items-center gap-2 ${
                                superficieData.forme === forme.value 
                                  ? 'border-green-500 bg-green-50' 
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <forme.icon className="h-6 w-6" />
                              <span className="text-sm">{forme.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {superficieData.forme === 'rectangle' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Longueur (m)
                            </label>
                            <Input
                              type="number"
                              value={superficieData.dimensions.longueur}
                              onChange={(e) => setSuperficieData({
                                ...superficieData,
                                dimensions: {...superficieData.dimensions, longueur: e.target.value}
                              })}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Largeur (m)
                            </label>
                            <Input
                              type="number"
                              value={superficieData.dimensions.largeur}
                              onChange={(e) => setSuperficieData({
                                ...superficieData,
                                dimensions: {...superficieData.dimensions, largeur: e.target.value}
                              })}
                              placeholder="0"
                            />
                          </div>
                        </div>
                      )}
                      
                      {superficieData.forme === 'cercle' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rayon (m)
                          </label>
                          <Input
                            type="number"
                            value={superficieData.dimensions.rayon}
                            onChange={(e) => setSuperficieData({
                              ...superficieData,
                              dimensions: {...superficieData.dimensions, rayon: e.target.value}
                            })}
                            placeholder="0"
                          />
                        </div>
                      )}
                      
                      {superficieData.forme === 'triangle' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Côté (m) - Triangle équilatéral
                          </label>
                          <Input
                            type="number"
                            value={superficieData.dimensions.cotes[0]}
                            onChange={(e) => setSuperficieData({
                              ...superficieData,
                              dimensions: {
                                ...superficieData.dimensions,
                                cotes: [e.target.value, '', '', '']
                              }
                            })}
                            placeholder="0"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="bg-gray-100 rounded-lg p-6 h-64 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Grid3X3 className="h-12 w-12 mx-auto mb-2" />
                          <p>Aperçu de la forme</p>
                          <p className="text-sm">{superficieData.forme}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={calculateSuperficie}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculer superficie
                    </Button>
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                  
                  {results.superficie && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-6"
                    >
                      <h3 className="font-semibold text-blue-900 mb-4">Résultats du calcul</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-blue-700">Superficie</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {results.superficie.superficie} m²
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-blue-700">Périmètre</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {results.superficie.perimetre} m
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Estimateur de Loyer */}
            <TabsContent value="loyer">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Estimateur de Loyer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type de bien
                        </label>
                        <select
                          value={loyerData.typeBien}
                          onChange={(e) => setLoyerData({...loyerData, typeBien: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="appartement">Appartement</option>
                          <option value="villa">Villa</option>
                          <option value="studio">Studio</option>
                          <option value="bureau">Bureau</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Superficie (m²)
                        </label>
                        <Input
                          type="number"
                          value={loyerData.superficie}
                          onChange={(e) => setLoyerData({...loyerData, superficie: e.target.value})}
                          placeholder="Ex: 80"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chambres
                          </label>
                          <Input
                            type="number"
                            value={loyerData.chambres}
                            onChange={(e) => setLoyerData({...loyerData, chambres: parseInt(e.target.value)})}
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Salles de bain
                          </label>
                          <Input
                            type="number"
                            value={loyerData.sallesDeBain}
                            onChange={(e) => setLoyerData({...loyerData, sallesDeBain: parseInt(e.target.value)})}
                            min="0"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zone géographique
                        </label>
                        <select
                          value={loyerData.zone}
                          onChange={(e) => setLoyerData({...loyerData, zone: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          {zones.map(zone => (
                            <option key={zone.value} value={zone.value}>
                              {zone.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Standing
                        </label>
                        <select
                          value={loyerData.standing}
                          onChange={(e) => setLoyerData({...loyerData, standing: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                          <option value="economique">Économique</option>
                          <option value="moyen">Moyen</option>
                          <option value="haut">Haut standing</option>
                          <option value="luxe">Luxe</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={loyerData.parking}
                            onChange={(e) => setLoyerData({...loyerData, parking: e.target.checked})}
                            className="mr-2"
                          />
                          Parking inclus
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={calculateLoyer}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Estimer le loyer
                    </Button>
                    <Button variant="outline">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                  
                  {results.loyer && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-purple-50 border border-purple-200 rounded-lg p-6"
                    >
                      <h3 className="font-semibold text-purple-900 mb-4">Estimation du loyer</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-purple-700">Loyer au m²</p>
                          <p className="text-2xl font-bold text-purple-900">
                            {results.loyer.loyerM2.toLocaleString()} XOF/m²
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-purple-700">Loyer mensuel total</p>
                          <p className="text-2xl font-bold text-purple-900">
                            {results.loyer.loyerTotal.toLocaleString()} XOF
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-purple-700">
                        <p><strong>Rendement annuel estimé:</strong> {Math.round((results.loyer.loyerTotal * 12) / (zones.find(z => z.value === loyerData.zone).prixM2 * parseFloat(loyerData.superficie)) * 100 * 100) / 100}%</p>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analyseur de Zone */}
            <TabsContent value="zone">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Analyseur de Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Analyseur de Zone
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Comparaison avancée entre différentes zones géographiques
                    </p>
                    <Badge className="bg-orange-100 text-orange-800">
                      Disponible prochainement
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calculateur Rentabilité */}
            <TabsContent value="rentabilite">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="h-5 w-5 mr-2" />
                    Calculateur de Rentabilité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Calculateur de Rentabilité
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Calcul du ROI et du rendement locatif
                    </p>
                    <Badge className="bg-indigo-100 text-indigo-800">
                      En développement
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calculateur Taxes */}
            <TabsContent value="taxes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculateur de Taxes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Calculateur de Taxes
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Calcul des taxes foncières et droits d'enregistrement
                    </p>
                    <Badge className="bg-red-100 text-red-800">
                      Version bêta
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentFoncierCalculateurs;