import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin,
  Plus,
  Edit,
  Eye,
  Trash2,
  Filter,
  Search,
  Download,
  Upload,
  Users,
  Building,
  Ruler,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Euro,
  FileText,
  Settings,
  Map,
  Globe,
  Image,
  Save
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const MairieZonesCommunales = ({ dashboardStats }) => {
  const [activeTab, setActiveTab] = useState('zones');
  const [selectedZone, setSelectedZone] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    totalArea: '',
    availablePlots: '',
    pricePerM2: '',
    location: '',
    features: [],
    status: 'En_preparation',
    deadlineApplication: '',
    images: []
  });

  // Zones communales gérées par la mairie
  const [zones, setZones] = useState([
    {
      id: 'zone-001',
      title: 'Zone Résidentielle Nord',
      commune: 'Commune de Teranga',
      totalArea: '12 hectares',
      availablePlots: 48,
      soldPlots: 12,
      pricePerM2: '75000',
      status: 'Disponible',
      dateCreated: '2024-01-15',
      deadlineApplication: '2024-06-30',
      applicants: 156,
      description: 'Zone résidentielle moderne avec toutes commodités',
      features: ['Électricité', 'Eau potable', 'Routes pavées', 'Éclairage public'],
      coordinates: { lat: 14.7451, lng: -17.5069 }
    },
    {
      id: 'zone-002', 
      title: 'Zone Commerciale Centre',
      commune: 'Commune de Teranga',
      totalArea: '8 hectares',
      availablePlots: 24,
      soldPlots: 8,
      pricePerM2: '120000',
      status: 'Disponible',
      dateCreated: '2024-02-01',
      deadlineApplication: '2024-08-15',
      applicants: 89,
      description: 'Zone commerciale stratégique au centre-ville',
      features: ['Électricité', 'Eau potable', 'Assainissement', 'Parking'],
      coordinates: { lat: 14.7521, lng: -17.4851 }
    },
    {
      id: 'zone-003',
      title: 'Zone Agricole Sud',
      commune: 'Commune de Teranga',
      totalArea: '25 hectares', 
      availablePlots: 15,
      soldPlots: 3,
      pricePerM2: '25000',
      status: 'En_preparation',
      dateCreated: '2024-03-10',
      deadlineApplication: '2024-12-31',
      applicants: 23,
      description: 'Zone dédiée à l\'agriculture moderne et durable',
      features: ['Irrigation', 'Routes agricoles', 'Électricité rurale'],
      coordinates: { lat: 14.7251, lng: -17.4651 }
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'En_preparation': return 'bg-yellow-100 text-yellow-800';
      case 'Complet': return 'bg-red-100 text-red-800';
      case 'Suspendu': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'Disponible': return 'Disponible';
      case 'En_preparation': return 'En préparation';
      case 'Complet': return 'Complet';
      case 'Suspendu': return 'Suspendu';
      default: return status;
    }
  };

  const handleCreateZone = () => {
    const newZone = {
      id: `zone-${Date.now()}`,
      ...formData,
      commune: 'Commune de Teranga',
      dateCreated: new Date().toISOString().split('T')[0],
      applicants: 0,
      soldPlots: 0,
      coordinates: { lat: 14.7451, lng: -17.5069 }
    };
    
    setZones([...zones, newZone]);
    setShowCreateModal(false);
    setFormData({
      title: '',
      description: '',
      totalArea: '',
      availablePlots: '',
      pricePerM2: '',
      location: '',
      features: [],
      status: 'En_preparation',
      deadlineApplication: '',
      images: []
    });
    
    window.safeGlobalToast({
      description: 'Zone communale créée avec succès',
      variant: 'success'
    });
  };

  const handleEditZone = (zone) => {
    setSelectedZone(zone);
    setFormData({
      title: zone.title,
      description: zone.description,
      totalArea: zone.totalArea,
      availablePlots: zone.availablePlots,
      pricePerM2: zone.pricePerM2,
      location: zone.location || '',
      features: zone.features,
      status: zone.status,
      deadlineApplication: zone.deadlineApplication,
      images: zone.images || []
    });
    setShowEditModal(true);
  };

  const handleDeleteZone = (zoneId) => {
    setZones(zones.filter(zone => zone.id !== zoneId));
    window.safeGlobalToast({
      description: 'Zone communale supprimée',
      variant: 'success'
    });
  };

  const calculateProgress = (zone) => {
    return zone.availablePlots > 0 ? (zone.soldPlots / zone.availablePlots) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Zones Communales</h2>
          <p className="text-gray-600 mt-1">
            Gestion des zones communales proposées aux citoyens
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Zone
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle zone communale</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Titre de la zone</Label>
                    <Input
                      placeholder="Ex: Zone Résidentielle Nord"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="En_preparation">En préparation</SelectItem>
                        <SelectItem value="Disponible">Disponible</SelectItem>
                        <SelectItem value="Suspendu">Suspendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Description détaillée de la zone..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Superficie totale</Label>
                    <Input
                      placeholder="Ex: 15 hectares"
                      value={formData.totalArea}
                      onChange={(e) => setFormData({...formData, totalArea: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre de parcelles</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 48"
                      value={formData.availablePlots}
                      onChange={(e) => setFormData({...formData, availablePlots: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Prix par m² (FCFA)</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 75000"
                      value={formData.pricePerM2}
                      onChange={(e) => setFormData({...formData, pricePerM2: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Adresse/Localisation</Label>
                  <Input
                    placeholder="Adresse complète de la zone"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Date limite de candidature</Label>
                  <Input
                    type="date"
                    value={formData.deadlineApplication}
                    onChange={(e) => setFormData({...formData, deadlineApplication: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateZone} className="bg-teal-600 hover:bg-teal-700">
                    <Save className="h-4 w-4 mr-2" />
                    Créer la zone
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Zones Actives</p>
                <p className="text-2xl font-bold text-green-600">{zones.filter(z => z.status === 'Disponible').length}</p>
              </div>
              <Building className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Parcelles</p>
                <p className="text-2xl font-bold text-blue-600">{zones.reduce((acc, zone) => acc + zone.availablePlots, 0)}</p>
              </div>
              <Ruler className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Candidatures</p>
                <p className="text-2xl font-bold text-purple-600">{zones.reduce((acc, zone) => acc + zone.applicants, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Parcelles Vendues</p>
                <p className="text-2xl font-bold text-orange-600">{zones.reduce((acc, zone) => acc + zone.soldPlots, 0)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="zones">Mes Zones</TabsTrigger>
          <TabsTrigger value="candidatures">Candidatures</TabsTrigger>
          <TabsTrigger value="parametres">Paramètres</TabsTrigger>
        </TabsList>

        {/* Liste des zones */}
        <TabsContent value="zones" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher une zone..."
                  className="pl-10 w-80"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {zones.map((zone) => (
              <Card key={zone.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{zone.title}</h3>
                        <Badge className={getStatusColor(zone.status)}>
                          {getStatusLabel(zone.status)}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{zone.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Ruler className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{zone.totalArea}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{zone.availablePlots} parcelles</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{zone.applicants} candidatures</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Euro className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{parseInt(zone.pricePerM2).toLocaleString()} FCFA/m²</span>
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Parcelles vendues</span>
                          <span>{zone.soldPlots}/{zone.availablePlots}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${calculateProgress(zone)}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {zone.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => handleEditZone(zone)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteZone(zone.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Candidatures */}
        <TabsContent value="candidatures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidatures Récentes</CardTitle>
              <CardDescription>Gestion des demandes de parcelles communales</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Amadou DIALLO</TableCell>
                    <TableCell>Zone Résidentielle Nord</TableCell>
                    <TableCell>15 Mars 2024</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Voir</Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">Approuver</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Plus de candidatures... */}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres */}
        <TabsContent value="parametres" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres des Zones Communales</CardTitle>
              <CardDescription>Configuration générale des zones communales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Publication automatique</h4>
                  <p className="text-sm text-gray-600">Publier automatiquement les nouvelles zones</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Notifications candidatures</h4>
                  <p className="text-sm text-gray-600">Recevoir des notifications pour chaque nouvelle candidature</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Validation automatique</h4>
                  <p className="text-sm text-gray-600">Valider automatiquement les candidatures conformes</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MairieZonesCommunales;