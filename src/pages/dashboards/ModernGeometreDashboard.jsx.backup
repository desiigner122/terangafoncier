import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Map, 
  MapPin, 
  Calculator, 
  Settings,
  TrendingUp,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  Target,
  Ruler,
  Building,
  Star,
  Calendar,
  Download,
  Upload,
  Globe,
  Layers
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';

const ModernGeometreDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('surveys');

  // Stats du header pour Géomètre
  const stats = [
    { 
      label: 'Levées Actives', 
      value: '23', 
      icon: MapPin, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Cartes Produites', 
      value: '156', 
      icon: Map, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Précision Moyenne', 
      value: '98.2%', 
      icon: Target, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Projets Terminés', 
      value: '89', 
      icon: CheckCircle, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const DashboardHeader = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const SurveysTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Levées en cours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Levées en Cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { client: 'Société TERANGA', zone: 'Zone Industrielle Diamniadio', progress: 75, status: 'En cours' },
              { client: 'Ministère Urbanisme', zone: 'Quartier Médina', progress: 40, status: 'Mesures' },
              { client: 'Promoteur SAHEL', zone: 'Extension Almadies', progress: 90, status: 'Finalisation' }
            ].map((survey, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{survey.client}</h4>
                    <p className="text-sm text-gray-600">{survey.zone}</p>
                  </div>
                  <Badge variant="outline">{survey.status}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{survey.progress}%</span>
                  </div>
                  <Progress value={survey.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Équipements et matériel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-blue-600" />
            Équipements Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { equipment: 'Théodolite Leica TS16', status: 'Disponible', battery: 85, lastCalib: '15/01/2024' },
              { equipment: 'GPS RTK Trimble R12', status: 'En mission', battery: 60, lastCalib: '10/01/2024' },
              { equipment: 'Niveau automatique AT-B4', status: 'Maintenance', battery: 0, lastCalib: '05/01/2024' }
            ].map((item, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">{item.equipment}</h5>
                  <Badge 
                    variant={item.status === 'Disponible' ? 'default' : 
                            item.status === 'En mission' ? 'secondary' : 'destructive'}
                  >
                    {item.status}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600">
                  <p>Batterie: {item.battery}% | Dernière calibration: {item.lastCalib}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mesures récentes */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            Mesures et Points Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Point</th>
                  <th className="text-left p-2">Coordonnées X</th>
                  <th className="text-left p-2">Coordonnées Y</th>
                  <th className="text-left p-2">Altitude Z</th>
                  <th className="text-left p-2">Précision</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { point: 'PT-001', x: '28.5647821', y: '15.3569874', z: '23.456', precision: '±2mm', date: '20/01/2024' },
                  { point: 'PT-002', x: '28.5648124', y: '15.3570125', z: '23.512', precision: '±1mm', date: '20/01/2024' },
                  { point: 'PT-003', x: '28.5649785', y: '15.3571456', z: '23.678', precision: '±3mm', date: '19/01/2024' }
                ].map((point, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{point.point}</td>
                    <td className="p-2 font-mono text-sm">{point.x}</td>
                    <td className="p-2 font-mono text-sm">{point.y}</td>
                    <td className="p-2 font-mono text-sm">{point.z}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="text-xs">{point.precision}</Badge>
                    </td>
                    <td className="p-2 text-sm">{point.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MapsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cartes produites */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-blue-600" />
            Cartes et Plans Produits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { 
                title: 'Plan Cadastral - Lot 2547', 
                scale: '1:500', 
                format: 'A1', 
                date: '18/01/2024',
                status: 'Validé',
                downloads: 12
              },
              { 
                title: 'Levé Topographique - Zone B', 
                scale: '1:1000', 
                format: 'A0', 
                date: '16/01/2024',
                status: 'En révision',
                downloads: 3
              },
              { 
                title: 'Plan de Bornage - Parcelle 156', 
                scale: '1:200', 
                format: 'A2', 
                date: '14/01/2024',
                status: 'Livré',
                downloads: 8
              },
              { 
                title: 'Carte d\'Assemblage - Secteur 7', 
                scale: '1:2000', 
                format: 'A1', 
                date: '12/01/2024',
                status: 'Validé',
                downloads: 25
              }
            ].map((map, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{map.title}</h4>
                  <Badge variant={map.status === 'Validé' ? 'default' : 'secondary'}>
                    {map.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Échelle: {map.scale} | Format: {map.format}</p>
                  <p>Date: {map.date}</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      {map.downloads} téléchargements
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      Ouvrir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Systèmes de coordonnées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-green-600" />
            Systèmes de Référence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">UTM Zone 28N (EPSG:32628)</h5>
              <p className="text-sm text-gray-600">Système principal utilisé</p>
              <div className="mt-2">
                <Badge variant="default">Actif</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">WGS84 Géographique</h5>
              <p className="text-sm text-gray-600">Pour GPS et applications mobiles</p>
              <div className="mt-2">
                <Badge variant="outline">Secondaire</Badge>
              </div>
            </div>
            <div className="p-3 border rounded-lg">
              <h5 className="font-medium mb-2">Lambert Conforme</h5>
              <p className="text-sm text-gray-600">Archives et compatibilité</p>
              <div className="mt-2">
                <Badge variant="outline">Archive</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Couches cartographiques */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            Couches Cartographiques Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { layer: 'Fond de plan', type: 'Raster', size: '450 MB', updated: 'Janvier 2024' },
              { layer: 'Parcellaire', type: 'Vector', size: '12 MB', updated: 'Décembre 2023' },
              { layer: 'Topographie', type: 'Vector', size: '85 MB', updated: 'Janvier 2024' },
              { layer: 'Bâti', type: 'Vector', size: '28 MB', updated: 'Novembre 2023' },
              { layer: 'Voirie', type: 'Vector', size: '15 MB', updated: 'Décembre 2023' },
              { layer: 'Hydrographie', type: 'Vector', size: '8 MB', updated: 'Octobre 2023' },
              { layer: 'Limites administratives', type: 'Vector', size: '2 MB', updated: 'Septembre 2023' },
              { layer: 'Points géodésiques', type: 'Vector', size: '1 MB', updated: 'Janvier 2024' }
            ].map((layer, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <h5 className="font-medium mb-1">{layer.layer}</h5>
                <p className="text-xs text-gray-600 mb-2">
                  {layer.type} • {layer.size}
                </p>
                <p className="text-xs text-gray-500">MAJ: {layer.updated}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CalculationsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calculs récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-600" />
            Calculs et Compensations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                calc: 'Compensation réseau triangulation',
                points: 15,
                precision: '±0.8mm',
                date: '20/01/2024',
                status: 'Terminé'
              },
              { 
                calc: 'Calcul de superficie - Lot 2547',
                points: 8,
                result: '2,547.82 m²',
                date: '19/01/2024',
                status: 'Validé'
              },
              { 
                calc: 'Transformation coordonnées WGS84',
                points: 120,
                precision: '±2.1mm',
                date: '18/01/2024',
                status: 'En cours'
              }
            ].map((calc, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{calc.calc}</h4>
                  <Badge variant={calc.status === 'Validé' ? 'default' : 'outline'}>
                    {calc.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Points: {calc.points}</p>
                  {calc.precision && <p>Précision: {calc.precision}</p>}
                  {calc.result && <p>Résultat: {calc.result}</p>}
                  <p>Date: {calc.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outils de calcul */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Outils de Calcul Rapide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium mb-2">Calcul de Distance</h4>
              <p className="text-sm text-gray-600">
                Entre deux points avec correction d'altitude
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium mb-2">Calcul de Surface</h4>
              <p className="text-sm text-gray-600">
                Polygone fermé avec correction topographique
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium mb-2">Gisement et Distance</h4>
              <p className="text-sm text-gray-600">
                Calcul inverse entre coordonnées
              </p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <h4 className="font-medium mb-2">Transformation</h4>
              <p className="text-sm text-gray-600">
                Changement de système de coordonnées
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Précision et qualité */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Contrôle Qualité et Précision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">98.2%</div>
              <p className="text-sm text-gray-600">Précision moyenne mensuelle</p>
              <Progress value={98.2} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">±1.5mm</div>
              <p className="text-sm text-gray-600">Écart-type moyen</p>
              <Progress value={85} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">156</div>
              <p className="text-sm text-gray-600">Points validés ce mois</p>
              <Progress value={78} className="mt-2" />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Standards de Précision Respectés</h4>
            <div className="text-sm text-green-700">
              <p>✓ Classe A: Levés cadastraux (±2cm)</p>
              <p>✓ Classe B: Topographie générale (±5cm)</p>
              <p>✓ Classe C: Reconnaissance (±10cm)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SettingsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Paramètres généraux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Paramètres Généraux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Système de coordonnées par défaut</label>
              <select className="w-full p-2 border rounded-lg">
                <option>UTM Zone 28N (EPSG:32628)</option>
                <option>WGS84 Géographique</option>
                <option>Lambert Conforme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Unités de mesure</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Mètres</option>
                <option>Centimètres</option>
                <option>Millimètres</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Précision d'affichage</label>
              <select className="w-full p-2 border rounded-lg">
                <option>3 décimales (mm)</option>
                <option>2 décimales (cm)</option>
                <option>1 décimale (dm)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration équipements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5 text-blue-600" />
            Configuration Équipements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Théodolite Leica TS16</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Constante d'addition:</span>
                  <span className="font-mono">+0.5mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Erreur angulaire:</span>
                  <span className="font-mono">±1"</span>
                </div>
                <div className="flex justify-between">
                  <span>Dernière calibration:</span>
                  <span>15/01/2024</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">GPS RTK Trimble R12</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Précision horizontale:</span>
                  <span className="font-mono">±8mm + 1ppm</span>
                </div>
                <div className="flex justify-between">
                  <span>Précision verticale:</span>
                  <span className="font-mono">±15mm + 1ppm</span>
                </div>
                <div className="flex justify-between">
                  <span>Station de base:</span>
                  <span>DAKAR-CORS</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sauvegardes et exports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Sauvegardes et Exports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Sauvegarde automatique</h4>
                <p className="text-sm text-gray-600">Toutes les 30 minutes</p>
              </div>
              <div className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span className="text-sm">Activée</span>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Formats d'export</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">DXF/DWG (AutoCAD)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">Shapefile (SHP)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">KML/KMZ (Google Earth)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className="text-sm">PDF (Plans)</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Notifications et Rappels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Calibration équipements</h4>
                <p className="text-sm text-gray-600">Rappel mensuel</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Fin de mission</h4>
                <p className="text-sm text-gray-600">Notification client</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Sauvegarde échouée</h4>
                <p className="text-sm text-gray-600">Alerte immédiate</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Batterie faible</h4>
                <p className="text-sm text-gray-600">Seuil: 20%</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Géomètre</h1>
          <p className="text-gray-600 mb-6">Gestion des levées topographiques, cartographie et calculs</p>
          
          <DashboardHeader />
        </div>

        {/* Tabs navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger 
              value="surveys" 
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Levées
            </TabsTrigger>
            <TabsTrigger 
              value="maps" 
              className="flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              Cartes
            </TabsTrigger>
            <TabsTrigger 
              value="calculations" 
              className="flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Calculs
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="surveys">
            <SurveysTab />
          </TabsContent>

          <TabsContent value="maps">
            <MapsTab />
          </TabsContent>

          <TabsContent value="calculations">
            <CalculationsTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default ModernGeometreDashboard;
