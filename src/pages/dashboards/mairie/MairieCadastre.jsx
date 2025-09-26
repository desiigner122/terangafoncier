import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Map,
  Layers,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Eye,
  MapPin,
  Building,
  Ruler,
  Navigation,
  Compass,
  Zap,
  Camera,
  Satellite,
  Grid,
  Target,
  Settings,
  Plus,
  Trash2,
  RefreshCw,
  Users,
  Home,
  TreePine,
  Factory
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';

// Composant Carte Interactive pour le Cadastre
const InteractiveMap = ({ parcels, onParcelSelect, selectedParcel }) => {
  const [mapView, setMapView] = useState('satellite');
  const [showParcels, setShowParcels] = useState(true);
  const [showZones, setShowZones] = useState(true);
  
  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden border">
      {/* Contrôles de la carte */}
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
        <div className="bg-white rounded-lg shadow-md p-2">
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={mapView === 'satellite' ? 'default' : 'outline'}
              onClick={() => setMapView('satellite')}
            >
              <Satellite className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={mapView === 'terrain' ? 'default' : 'outline'}
              onClick={() => setMapView('terrain')}
            >
              <Map className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant={mapView === 'grid' ? 'default' : 'outline'}
              onClick={() => setMapView('grid')}
            >
              <Grid className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-2">
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2 text-sm">
              <Switch
                checked={showParcels}
                onCheckedChange={setShowParcels}
                size="sm"
              />
              <span>Parcelles</span>
            </label>
            <label className="flex items-center space-x-2 text-sm">
              <Switch
                checked={showZones}
                onCheckedChange={setShowZones}
                size="sm"
              />
              <span>Zones</span>
            </label>
          </div>
        </div>
      </div>

      {/* Contrôles de navigation */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-md p-2">
          <div className="flex flex-col space-y-1">
            <Button size="sm" variant="outline">
              <Plus className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline">
              <Target className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline">
              <Navigation className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Zone de la carte modernisée */}
      <div className="w-full h-full bg-gradient-to-br from-green-50 to-blue-50 relative">
        {/* Grille cadastrale de fond */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="modernGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#6b7280" strokeWidth="1"/>
              </pattern>
            </defs>
            {mapView === 'grid' && <rect width="100%" height="100%" fill="url(#modernGrid)" />}
          </svg>
        </div>

        {/* Parcelles interactives avec style moderne */}
        {showParcels && (
          <div className="absolute inset-0">
            {parcels.slice(0, 6).map((parcel, index) => {
              const positions = [
                { top: '10%', left: '15%', width: '120px', height: '100px' },
                { top: '25%', left: '45%', width: '100px', height: '90px' },
                { top: '15%', left: '70%', width: '110px', height: '80px' },
                { top: '55%', left: '20%', width: '130px', height: '70px' },
                { top: '60%', left: '50%', width: '95px', height: '85px' },
                { top: '70%', left: '75%', width: '105px', height: '75px' }
              ];
              
              const position = positions[index] || positions[0];
              const isSelected = selectedParcel?.id === parcel.id;
              
              const getParcelColor = (status) => {
                switch(status) {
                  case 'Disponible': return 'bg-green-200 border-green-400 hover:bg-green-300';
                  case 'Occupée': return 'bg-amber-200 border-amber-400 hover:bg-amber-300';
                  case 'Vendue': return 'bg-blue-200 border-blue-400 hover:bg-blue-300';
                  default: return 'bg-gray-200 border-gray-400 hover:bg-gray-300';
                }
              };
              
              return (
                <div
                  key={parcel.id}
                  className={`absolute rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-blue-300 border-blue-600 shadow-lg scale-105 z-10' 
                      : getParcelColor(parcel.status)
                  } border-2 shadow-md`}
                  style={position}
                  onClick={() => onParcelSelect(parcel)}
                >
                  <div className="p-2 h-full flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-gray-800">
                        {parcel.reference}
                      </div>
                      <div className="text-xs text-gray-600">
                        {parcel.surface}
                      </div>
                    </div>
                    <div className={`text-xs font-medium ${
                      parcel.status === 'Disponible' ? 'text-green-700' :
                      parcel.status === 'Occupée' ? 'text-amber-700' :
                      'text-blue-700'
                    }`}>
                      {parcel.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Zones cadastrales modernes */}
        {showZones && (
          <div className="absolute inset-0">
            {/* Zone résidentielle */}
            <div className="absolute border-4 border-blue-400 border-dashed rounded-xl opacity-40"
                 style={{ top: '5%', left: '10%', width: '35%', height: '40%' }}>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full inline-block m-2">
                <Home className="inline w-3 h-3 mr-1" />
                Zone Résidentielle
              </div>
            </div>
            
            {/* Zone commerciale */}
            <div className="absolute border-4 border-orange-400 border-dashed rounded-xl opacity-40"
                 style={{ top: '5%', left: '55%', width: '40%', height: '40%' }}>
              <div className="bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full inline-block m-2">
                <Building className="inline w-3 h-3 mr-1" />
                Zone Commerciale
              </div>
            </div>
            
            {/* Zone agricole */}
            <div className="absolute border-4 border-green-400 border-dashed rounded-xl opacity-40"
                 style={{ top: '50%', left: '10%', width: '35%', height: '40%' }}>
              <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full inline-block m-2">
                <TreePine className="inline w-3 h-3 mr-1" />
                Zone Agricole
              </div>
            </div>
            
            {/* Zone industrielle */}
            <div className="absolute border-4 border-gray-400 border-dashed rounded-xl opacity-40"
                 style={{ top: '50%', left: '55%', width: '40%', height: '40%' }}>
              <div className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full inline-block m-2">
                <Factory className="inline w-3 h-3 mr-1" />
                Zone Industrielle
              </div>
            </div>
          </div>
        )}

        {/* Routes principales stylisées */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full opacity-30">
            <path d="M 0 50% L 100% 50%" stroke="#64748b" strokeWidth="4" strokeDasharray="20,10" />
            <path d="M 50% 0 L 50% 100%" stroke="#64748b" strokeWidth="3" strokeDasharray="15,8" />
          </svg>
        </div>
      </div>

      {/* Légende */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-white rounded-lg shadow-md p-3">
          <h4 className="text-sm font-medium mb-2">Légende</h4>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs">Disponible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span className="text-xs">Occupée</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs">Litige</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs">Sélectionnée</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coordonnées */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white rounded-lg shadow-md p-2">
          <div className="text-xs text-gray-600">
            <div>Lat: 14.6928°N</div>
            <div>Lon: 17.4467°W</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MairieCadastre = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('cadastre');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [filterZone, setFilterZone] = useState('all');

  // Données cadastrales
  const cadastralParcels = [
    {
      id: 'CAD-2024-001',
      parcelNumber: 'P-154/2024',
      title: 'TF 5647/R',
      area: '1200m²',
      zone: 'Zone Résidentielle Nord',
      owner: 'Amadou Diallo',
      ownerType: 'Privé',
      status: 'Régularisé',
      lastSurvey: '2024-01-15',
      coordinates: {
        lat: 14.6937,
        lng: -17.4441
      },
      boundaries: 'Délimitées par bornes',
      landUse: 'Résidentiel',
      restrictions: ['Servitude passage', 'Zone non aedificandi'],
      value: '85M FCFA',
      taxStatus: 'À jour',
      blockchainHash: '0x7a8b9c...def456',
      nftStatus: 'Tokenisé'
    },
    {
      id: 'CAD-2024-002',
      parcelNumber: 'P-289/2024',
      title: 'TF 3421/R',
      area: '800m²',
      zone: 'Zone Commerciale Centre',
      owner: 'Fatou Seck Entreprise',
      ownerType: 'Entreprise',
      status: 'En Révision',
      lastSurvey: '2023-12-20',
      coordinates: {
        lat: 14.6955,
        lng: -17.4425
      },
      boundaries: 'En cours de bornage',
      landUse: 'Commercial',
      restrictions: ['Hauteur limitée', 'Parking obligatoire'],
      value: '120M FCFA',
      taxStatus: 'En attente',
      blockchainHash: '0x2f3e4d...abc123',
      nftStatus: 'En cours'
    },
    {
      id: 'CAD-2024-003',
      parcelNumber: 'P-067/2024',
      title: 'TF 8934/R',
      area: '2500m²',
      zone: 'Zone Agricole Est',
      owner: 'Coopérative Agricole',
      ownerType: 'Coopérative',
      status: 'Régularisé',
      lastSurvey: '2024-01-10',
      coordinates: {
        lat: 14.6882,
        lng: -17.4387
      },
      boundaries: 'Délimitées par bornes',
      landUse: 'Agricole',
      restrictions: ['Protection sols', 'Usage agricole exclusif'],
      value: '45M FCFA',
      taxStatus: 'Exonéré',
      blockchainHash: '0x9g8h7i...789xyz',
      nftStatus: 'Tokenisé'
    }
  ];

  // Données des zones cadastrales
  const cadastralZones = [
    {
      id: 'zone-cad-1',
      name: 'Secteur Résidentiel Nord',
      totalParcels: 1247,
      titledParcels: 1098,
      pendingParcels: 149,
      area: '3.2km²',
      averageParcelSize: '850m²',
      completionRate: 88
    },
    {
      id: 'zone-cad-2',
      name: 'Secteur Commercial Centre',
      totalParcels: 456,
      titledParcels: 421,
      pendingParcels: 35,
      area: '1.8km²',
      averageParcelSize: '600m²',
      completionRate: 92
    },
    {
      id: 'zone-cad-3',
      name: 'Secteur Agricole Est',
      totalParcels: 324,
      titledParcels: 289,
      pendingParcels: 35,
      area: '5.1km²',
      averageParcelSize: '1850m²',
      completionRate: 89
    }
  ];

  // Services cadastraux
  const cadastralServices = [
    {
      id: 'service-1',
      name: 'Certificat de Propriété',
      description: 'Délivrance de certificats officiels',
      price: '15,000 FCFA',
      processingTime: '5 jours',
      documentsRequired: ['Titre foncier', 'Pièce identité'],
      digitalAvailable: true
    },
    {
      id: 'service-2',
      name: 'Levé Topographique',
      description: 'Relevé précis des limites parcellaires',
      price: '75,000 FCFA',
      processingTime: '10 jours',
      documentsRequired: ['Demande officielle', 'Accord voisins'],
      digitalAvailable: false
    },
    {
      id: 'service-3',
      name: 'Modification Cadastrale',
      description: 'Mise à jour des données cadastrales',
      price: '25,000 FCFA',
      processingTime: '15 jours',
      documentsRequired: ['Justificatifs modification', 'Plan nouveau'],
      digitalAvailable: true
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Régularisé': return 'bg-green-100 text-green-800';
      case 'En Révision': return 'bg-yellow-100 text-yellow-800';
      case 'Suspendu': return 'bg-red-100 text-red-800';
      case 'En Attente': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaxStatusColor = (status) => {
    switch (status) {
      case 'À jour': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'En retard': return 'bg-red-100 text-red-800';
      case 'Exonéré': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNFTStatusColor = (status) => {
    switch (status) {
      case 'Tokenisé': return 'bg-blue-100 text-blue-800';
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      case 'Non tokenisé': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredParcels = cadastralParcels.filter(parcel => {
    const matchesSearch = parcel.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         parcel.parcelNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         parcel.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = filterZone === 'all' || parcel.zone === filterZone;
    
    return matchesSearch && matchesZone;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Cadastre Municipal</h2>
          <p className="text-gray-600 mt-1">
            Gestion numérique du cadastre et des titres fonciers
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Cadastre
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Données
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Parcelle
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Parcelles</p>
                <p className="text-2xl font-bold text-gray-900">2,027</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Titrées</p>
                <p className="text-2xl font-bold text-green-600">1,808</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">NFT Tokenisées</p>
                <p className="text-2xl font-bold text-purple-600">1,245</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Surface Totale</p>
                <p className="text-2xl font-bold text-orange-600">10.1km²</p>
              </div>
              <Map className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cadastre">Carte Interactive</TabsTrigger>
          <TabsTrigger value="parcels">Parcelles</TabsTrigger>
          <TabsTrigger value="zones">Zones Cadastrales</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain NFT</TabsTrigger>
        </TabsList>

        {/* Carte Interactive */}
        <TabsContent value="cadastre" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 text-blue-600 mr-2" />
                Cadastre Numérique Interactif
              </CardTitle>
              <CardDescription>
                Visualisation et gestion interactive des parcelles municipales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveMap 
                parcels={cadastralParcels}
                onParcelSelect={setSelectedParcel}
                selectedParcel={selectedParcel}
              />
            </CardContent>
          </Card>

          {/* Outils de gestion */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Plus className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-medium">Ajouter Parcelle</h3>
                    <p className="text-sm text-gray-600">Créer une nouvelle parcelle</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Edit className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">Modifier Zone</h3>
                    <p className="text-sm text-gray-600">Éditer les zones cadastrales</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Download className="h-8 w-8 text-purple-600" />
                  <div>
                    <h3 className="font-medium">Exporter Plan</h3>
                    <p className="text-sm text-gray-600">Télécharger le cadastre</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations parcelle sélectionnée */}
          {selectedParcel && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 text-red-600 mr-2" />
                  Parcelle Sélectionnée: {selectedParcel.reference}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Surface</span>
                    <p className="font-medium">{selectedParcel.surface}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Zone</span>
                    <p className="font-medium">{selectedParcel.zone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Statut</span>
                    <Badge className={selectedParcel.status === 'Disponible' ? 'bg-green-100 text-green-800' : selectedParcel.status === 'Occupée' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}>
                      {selectedParcel.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    Détails
                  </Button>
                  <Button size="sm" variant="outline">
                    <Zap className="h-3 w-3 mr-1" />
                    Tokeniser NFT
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Parcelles */}
        <TabsContent value="parcels" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Rechercher par propriétaire, numéro ou titre..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterZone} onValueChange={setFilterZone}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrer par zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les zones</SelectItem>
                    <SelectItem value="Zone Résidentielle Nord">Résidentielle Nord</SelectItem>
                    <SelectItem value="Zone Commerciale Centre">Commerciale Centre</SelectItem>
                    <SelectItem value="Zone Agricole Est">Agricole Est</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Plus de filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Table des parcelles */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parcelle</TableHead>
                    <TableHead>Propriétaire</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Surface</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>NFT</TableHead>
                    <TableHead>Valeur</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParcels.map((parcel) => (
                    <TableRow key={parcel.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{parcel.parcelNumber}</div>
                          <div className="text-sm text-gray-600">{parcel.title}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{parcel.owner}</div>
                          <div className="text-sm text-gray-600">{parcel.ownerType}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{parcel.zone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{parcel.area}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(parcel.status)}>
                          {parcel.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getNFTStatusColor(parcel.nftStatus)}>
                          {parcel.nftStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">{parcel.value}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedParcel(parcel)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Zones Cadastrales */}
        <TabsContent value="zones" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {cadastralZones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Map className="h-5 w-5 text-blue-600 mr-2" />
                    {zone.name}
                  </CardTitle>
                  <CardDescription>Surface: {zone.area}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total parcelles</span>
                      <p className="font-medium text-gray-900">{zone.totalParcels}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Titrées</span>
                      <p className="font-medium text-green-600">{zone.titledParcels}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">En attente</span>
                      <p className="font-medium text-orange-600">{zone.pendingParcels}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Taille moyenne</span>
                      <p className="font-medium text-gray-900">{zone.averageParcelSize}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Complétude</span>
                      <span className="text-sm font-medium text-gray-900">{zone.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${zone.completionRate}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Services Cadastraux */}
        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {cadastralServices.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Prix</span>
                    <span className="font-medium text-gray-900">{service.price}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Délai</span>
                    <span className="font-medium text-gray-900">{service.processingTime}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Service numérique</span>
                    <Switch checked={service.digitalAvailable} />
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm text-gray-600">Documents requis:</span>
                    <div className="space-y-1">
                      {service.documentsRequired.map((doc, index) => (
                        <div key={index} className="text-sm text-gray-700 flex items-center">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                          {doc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Demander ce service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Blockchain NFT */}
        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 text-purple-600 mr-2" />
                Gestion Blockchain des Titres Fonciers
              </CardTitle>
              <CardDescription>
                Tokenisation NFT et authentification blockchain
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 text-center">
                <Zap className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  TerangaChain Integration
                </h3>
                <p className="text-gray-600 mb-4">
                  Tous les titres fonciers sont automatiquement tokenisés en NFT sur la blockchain TerangaChain
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">1,245</div>
                    <div className="text-gray-600">NFT Tokenisés</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">456</div>
                    <div className="text-gray-600">En Cours</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.8%</div>
                    <div className="text-gray-600">Fiabilité</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog détails parcelle */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Parcelle {selectedParcel.parcelNumber}
              </h3>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedParcel(null)}
                className="text-gray-600"
              >
                ×
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations Générales</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Titre foncier</span>
                    <p className="font-medium text-gray-900">{selectedParcel.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Propriétaire</span>
                    <p className="font-medium text-gray-900">{selectedParcel.owner}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Surface</span>
                    <p className="font-medium text-gray-900">{selectedParcel.area}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Usage</span>
                    <p className="font-medium text-gray-900">{selectedParcel.landUse}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Valeur estimée</span>
                    <p className="font-medium text-gray-900">{selectedParcel.value}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Blockchain & NFT */}
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain & NFT</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Hash Blockchain</span>
                    <p className="font-mono text-sm text-gray-900">{selectedParcel.blockchainHash}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Statut NFT</span>
                    <Badge className={getNFTStatusColor(selectedParcel.nftStatus)}>
                      {selectedParcel.nftStatus}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Coordonnées</span>
                    <p className="text-sm text-gray-900">
                      {selectedParcel.coordinates.lat}, {selectedParcel.coordinates.lng}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Bornage</span>
                    <p className="text-sm text-gray-900">{selectedParcel.boundaries}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MairieCadastre;