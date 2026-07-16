import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Search,
  Info,
  Compass,
  Satellite,
  Ruler,
  Camera,
  Target,
  Activity,
  Wifi
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Catalogue de référence des instruments topographiques.
 *
 * NOTE HONNÊTETÉ : il n'existe aucune table "instruments/matériel" dans le
 * schéma Supabase. Ce module est donc un CATALOGUE DE RÉFÉRENCE STATIQUE des
 * équipements standards du métier (modèles + spécifications constructeur
 * factuelles). Il ne représente PAS un parc matériel réel : aucune donnée
 * temps réel (batterie, température, statut d'utilisation, affectation,
 * numéro de série, maintenance) n'est affichée car aucune n'existe en base.
 */
const GeometreInstruments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('tous');

  // Catalogue statique de référence (spécifications constructeur factuelles).
  const instruments = [
    {
      id: 1,
      name: 'Station Totale Leica TS16',
      type: 'station_totale',
      model: 'TS16 I R1000',
      icon: Compass,
      connectivity: ['Bluetooth', 'WiFi', 'USB'],
      features: ['Mesure sans réflecteur', 'Caméra intégrée', 'GNSS RTK'],
      specs: [
        { label: 'Précision angulaire', value: '1"' },
        { label: 'Précision distance', value: '1mm + 1.5ppm' },
        { label: 'Portée', value: '1000m' }
      ]
    },
    {
      id: 2,
      name: 'GPS RTK Trimble R12',
      type: 'gps_rtk',
      model: 'R12 GNSS',
      icon: Satellite,
      connectivity: ['Radio', 'Bluetooth', 'WiFi', '4G'],
      features: ['Multi-constellations', 'Correction RTK', 'Base/Rover'],
      specs: [
        { label: 'Précision horizontale', value: '8mm + 1ppm' },
        { label: 'Précision verticale', value: '15mm + 1ppm' },
        { label: 'Constellations', value: 'GPS, GLONASS, Galileo, BeiDou' }
      ]
    },
    {
      id: 3,
      name: 'Niveau Électronique Leica DNA03',
      type: 'niveau',
      model: 'DNA03',
      icon: Ruler,
      connectivity: ['USB'],
      features: ['Mesure automatique', 'Compensateur', 'Mémoire interne'],
      specs: [
        { label: 'Précision nivellement', value: '0.3mm/km' },
        { label: 'Grossissement', value: '24x' },
        { label: 'Portée', value: '0.6m à 100m' }
      ]
    },
    {
      id: 4,
      name: 'Drone DJI Phantom 4 RTK',
      type: 'drone',
      model: 'Phantom 4 RTK',
      icon: Camera,
      connectivity: ['WiFi', 'Radio 2.4/5.8GHz'],
      features: ['Caméra 4K', 'RTK intégré', 'Évitement obstacles'],
      specs: [
        { label: 'Précision RTK', value: '1cm + 1ppm' },
        { label: 'Autonomie', value: '30 minutes' },
        { label: 'Altitude max', value: '6000m' }
      ]
    },
    {
      id: 5,
      name: 'Scanner 3D Leica RTC360',
      type: 'scanner_3d',
      model: 'RTC360',
      icon: Activity,
      connectivity: ['WiFi', 'Ethernet', 'USB'],
      features: ['Scan 360°', 'HDR imaging', 'Régistration auto'],
      specs: [
        { label: 'Précision distance', value: '1mm à 10m' },
        { label: 'Vitesse de scan', value: '2M points/sec' },
        { label: 'Champ de vision', value: '360° × 300°' }
      ]
    },
    {
      id: 6,
      name: 'Télémètre Laser Leica DISTO X4',
      type: 'telemetre',
      model: 'DISTO X4',
      icon: Target,
      connectivity: ['Bluetooth', 'USB'],
      features: ['Mesure d\'angle', 'Pointeur laser', 'Mémoire 30 valeurs'],
      specs: [
        { label: 'Précision distance', value: '1mm' },
        { label: 'Portée max', value: '150m' },
        { label: 'Précision inclinaison', value: '0.1°' }
      ]
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'station_totale': return Compass;
      case 'gps_rtk': return Satellite;
      case 'niveau': return Ruler;
      case 'drone': return Camera;
      case 'scanner_3d': return Activity;
      case 'telemetre': return Target;
      default: return Settings;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'station_totale': return 'Station Totale';
      case 'gps_rtk': return 'GPS RTK';
      case 'niveau': return 'Niveau Électronique';
      case 'drone': return 'Drone/UAV';
      case 'scanner_3d': return 'Scanner 3D';
      case 'telemetre': return 'Télémètre Laser';
      default: return type;
    }
  };

  const filteredInstruments = instruments.filter(instrument => {
    const matchesSearch = instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instrument.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'tous' || instrument.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gray-50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalogue d'Instruments</h1>
          <p className="text-gray-600 mt-1">Référence des équipements topographiques standards du métier</p>
        </div>
      </div>

      {/* Bandeau honnêteté : catalogue statique, pas un parc réel */}
      <div className="mb-8 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
        <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Catalogue de référence</p>
          <p className="text-blue-700">
            Cette page présente les spécifications constructeur des instruments topographiques
            couramment utilisés. Elle ne reflète pas un inventaire matériel enregistré : le suivi
            de parc (batterie, affectation, maintenance, calibration) sera disponible prochainement.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type d'instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous types</SelectItem>
                <SelectItem value="station_totale">Station Totale</SelectItem>
                <SelectItem value="gps_rtk">GPS RTK</SelectItem>
                <SelectItem value="niveau">Niveau Électronique</SelectItem>
                <SelectItem value="drone">Drone/UAV</SelectItem>
                <SelectItem value="scanner_3d">Scanner 3D</SelectItem>
                <SelectItem value="telemetre">Télémètre Laser</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Catalogue */}
      {filteredInstruments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun instrument ne correspond à votre recherche.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredInstruments.map((instrument, index) => {
            const TypeIcon = getTypeIcon(instrument.type);

            return (
              <motion.div
                key={instrument.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <TypeIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {instrument.name}
                          </h3>
                          <p className="text-sm text-gray-600">Modèle : {instrument.model}</p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {getTypeText(instrument.type)}
                      </Badge>
                    </div>

                    {/* Spécifications constructeur */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Spécifications</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                        {instrument.specs.map((spec, idx) => (
                          <div key={idx} className="flex justify-between gap-2">
                            <span className="text-gray-500">{spec.label}</span>
                            <span className="font-medium text-gray-800 text-right">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Caractéristiques */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Caractéristiques</h4>
                      <div className="flex flex-wrap gap-1">
                        {instrument.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Connectivité */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
                        <Wifi className="h-3.5 w-3.5" /> Connectivité
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {instrument.connectivity.map((conn, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {conn}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default GeometreInstruments;
