import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import ModernDashboardLayout from '@/components/dashboard/ModernDashboardLayout';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Plus,
  FileText,
  User,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Home,
  Shield,
  Wrench
} from 'lucide-react';
import ContextualAIAssistant from '@/components/dashboard/ContextualAIAssistant';
import { useNotifications } from '@/contexts/NotificationContext';

const OwnedProperties = () => {
  const { addNotification } = useNotifications();
  const [properties, setProperties] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [selectedTab, setSelectedTab] = useState('properties');

  useEffect(() => {
    // Biens possédés
    setProperties([
      {
        id: 1,
        propertyId: 'PROP001',
        title: 'Villa familiale - Sacré Cœur',
        location: 'Sacré Cœur 3, Dakar',
        type: 'Villa',
        surface: '350 m²',
        purchasePrice: '180,000,000 FCFA',
        currentValue: '220,000,000 FCFA',
        purchaseDate: '2022-03-15',
        status: 'Occupé',
        usage: 'Résidence principale',
        yearBuilt: '2018',
        rooms: '5 chambres, 3 salles de bain',
        description: 'Belle villa moderne avec jardin et piscine',
        taxesPaid: true,
        insuranceValid: true,
        lastValuation: '2023-12-01'
      },
      {
        id: 2,
        propertyId: 'PROP002',
        title: 'Appartement - Plateau',
        location: 'Plateau, Dakar',
        type: 'Appartement',
        surface: '85 m²',
        purchasePrice: '65,000,000 FCFA',
        currentValue: '75,000,000 FCFA',
        purchaseDate: '2023-06-10',
        status: 'Loué',
        usage: 'Investissement locatif',
        yearBuilt: '2020',
        rooms: '3 chambres, 2 salles de bain',
        description: 'Appartement moderne en centre-ville',
        taxesPaid: true,
        insuranceValid: false,
        lastValuation: '2023-11-15',
        rental: {
          tenant: 'Mme Sow',
          monthlyRent: '450,000 FCFA',
          leaseStart: '2023-07-01',
          leaseEnd: '2024-06-30',
          deposit: '900,000 FCFA'
        }
      },
      {
        id: 3,
        propertyId: 'PROP003',
        title: 'Terrain - Keur Massar',
        location: 'Keur Massar Extension, Dakar',
        type: 'Terrain',
        surface: '500 m²',
        purchasePrice: '25,000,000 FCFA',
        currentValue: '35,000,000 FCFA',
        purchaseDate: '2023-09-20',
        status: 'Vacant',
        usage: 'Futur projet construction',
        description: 'Terrain constructible bien situé',
        taxesPaid: false,
        insuranceValid: false,
        lastValuation: '2023-12-20'
      }
    ]);

    // Documents
    setDocuments([
      { id: 1, propertyId: 'PROP001', type: 'Titre foncier', status: 'Valide', expiryDate: null },
      { id: 2, propertyId: 'PROP001', type: 'Assurance habitation', status: 'Valide', expiryDate: '2024-03-15' },
      { id: 3, propertyId: 'PROP002', type: 'Titre foncier', status: 'Valide', expiryDate: null },
      { id: 4, propertyId: 'PROP002', type: 'Assurance habitation', status: 'Expiré', expiryDate: '2023-12-31' },
      { id: 5, propertyId: 'PROP003', type: 'Titre foncier', status: 'En cours', expiryDate: null }
    ]);

    // Maintenance
    setMaintenance([
      {
        id: 1,
        propertyId: 'PROP001',
        type: 'Réparation',
        description: 'Réparation de la pompe de piscine',
        status: 'Planifié',
        scheduledDate: '2024-01-25',
        cost: '75,000 FCFA',
        provider: 'Pool Service SARL'
      },
      {
        id: 2,
        propertyId: 'PROP002',
        type: 'Entretien',
        description: 'Nettoyage des conduits de climatisation',
        status: 'Terminé',
        completedDate: '2024-01-10',
        cost: '45,000 FCFA',
        provider: 'ClimaTech'
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Occupé': return 'bg-green-500';
      case 'Loué': return 'bg-blue-500';
      case 'Vacant': return 'bg-orange-500';
      case 'Valide': return 'bg-green-500';
      case 'Expiré': return 'bg-red-500';
      case 'En cours': return 'bg-yellow-500';
      case 'Planifié': return 'bg-blue-500';
      case 'En cours de maintenance': return 'bg-orange-500';
      case 'Terminé': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const PropertyCard = ({ property }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{property.title}</CardTitle>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {property.location}
            </p>
          </div>
          <Badge className={`${getStatusColor(property.status)} text-white`}>
            {property.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{property.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Surface</p>
              <p className="font-medium">{property.surface}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Valeur actuelle</p>
              <p className="font-medium">{property.currentValue}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Acheté le</p>
              <p className="font-medium">{property.purchaseDate}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm text-gray-600">Prix d'achat</p>
            <p className="font-bold text-lg">{property.purchasePrice}</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-sm text-gray-600">Plus-value</p>
            <p className="font-bold text-lg text-green-600">
              +{((parseFloat(property.currentValue.replace(/[^\d]/g, '')) - 
                  parseFloat(property.purchasePrice.replace(/[^\d]/g, ''))) / 1000000).toFixed(0)}M FCFA
            </p>
          </div>
        </div>

        {property.rental && (
          <div className="bg-blue-50 p-3 rounded mb-4">
            <p className="text-sm font-medium text-blue-800">Location en cours:</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <p className="text-sm text-blue-700">Locataire: {property.rental.tenant}</p>
              <p className="text-sm text-blue-700">Loyer: {property.rental.monthlyRent}</p>
              <p className="text-sm text-blue-700">Début: {property.rental.leaseStart}</p>
              <p className="text-sm text-blue-700">Fin: {property.rental.leaseEnd}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-600" />
            <span className="text-sm">Taxes foncières</span>
            {property.taxesPaid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-600" />
            <span className="text-sm">Assurance</span>
            {property.insuranceValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        {property.rooms && (
          <p className="text-gray-700 mb-2">Configuration: {property.rooms}</p>
        )}
        <p className="text-gray-700 mb-4">{property.description}</p>

        <div className="flex gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Voir détails
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Maintenance
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const DocumentsView = () => (
    <div className="space-y-4">
      {properties.map(property => {
        const propertyDocs = documents.filter(doc => doc.propertyId === property.propertyId);
        return (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle className="text-lg">{property.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {propertyDocs.map(doc => (
                  <div key={doc.id} className="border rounded p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{doc.type}</span>
                      <Badge className={`${getStatusColor(doc.status)} text-white text-xs`}>
                        {doc.status}
                      </Badge>
                    </div>
                    {doc.expiryDate && (
                      <p className="text-sm text-gray-600">Expire le: {doc.expiryDate}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const MaintenanceView = () => (
    <div className="space-y-4">
      {maintenance.map(item => (
        <Card key={item.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{item.description}</CardTitle>
                <p className="text-gray-600">
                  {properties.find(p => p.propertyId === item.propertyId)?.title}
                </p>
              </div>
              <Badge className={`${getStatusColor(item.status)} text-white`}>
                {item.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium">{item.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Coût</p>
                  <p className="font-medium">{item.cost}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Prestataire</p>
                  <p className="font-medium">{item.provider}</p>
                </div>
              </div>
            </div>
            {item.scheduledDate && (
              <p className="text-sm text-gray-600 mt-2">Prévu le: {item.scheduledDate}</p>
            )}
            {item.completedDate && (
              <p className="text-sm text-gray-600 mt-2">Terminé le: {item.completedDate}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <ModernDashboardLayout>
      <div className="space-y-6">
        {/* Header de la page */}
        <div className="bg-white rounded-lg border p-6">
          <h1 className="text-2xl font-bold text-gray-900">Biens Possédés</h1>
          <p className="text-gray-600 mt-1">Gestion de votre patrimoine immobilier</p>
        </div>

      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total biens</p>
                  <p className="text-2xl font-bold">{properties.length}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Valeur totale</p>
                  <p className="text-2xl font-bold">
                    {Math.round(properties.reduce((sum, p) => 
                      sum + parseFloat(p.currentValue.replace(/[^\d]/g, '')), 0) / 1000000)}M
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Biens loués</p>
                  <p className="text-2xl font-bold">
                    {properties.filter(p => p.status === 'Loué').length}
                  </p>
                </div>
                <Home className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Maintenances</p>
                  <p className="text-2xl font-bold">{maintenance.length}</p>
                </div>
                <Wrench className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Mes biens ({properties.length})
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              Maintenance ({maintenance.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="mt-6">
            <div className="space-y-4">
              {properties.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Aucun bien possédé
                    </h3>
                    <p className="text-gray-500">
                      Vos biens immobiliers apparaîtront ici une fois enregistrés.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <DocumentsView />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-6">
            <MaintenanceView />
          </TabsContent>
        </Tabs>
      </div>

      {/* Assistant IA contextuel */}
      <ContextualAIAssistant />
    </div>
    </ModernDashboardLayout>
  );
};

export default OwnedProperties;