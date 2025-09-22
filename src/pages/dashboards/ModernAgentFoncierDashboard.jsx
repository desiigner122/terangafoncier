import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Home, 
  Users, 
  DollarSign,
  Building,
  TrendingUp,
  Eye,
  Heart,
  Clock,
  CheckCircle,
  Calendar,
  Phone,
  Mail,
  FileText,
  Calculator,
  Star,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const ModernAgentFoncierDashboard = () => {
  const [activeTab, setActiveTab] = useState('clients');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      activeClients: 45,
      propertiesManaged: 128,
      monthlyCommissions: 12500000,
      salesCompleted: 18,
      averagePropertyValue: 85000000,
      clientSatisfaction: 4.8
    },
    clients: [
      {
        id: 1,
        name: 'Famille Diallo',
        type: 'Acheteur',
        budget: 150000000,
        preferences: 'Villa, Almadies',
        status: 'Actif',
        lastContact: '2024-12-15',
        visits: 3,
        satisfaction: 5
      },
      {
        id: 2,
        name: 'Heritage Fall',
        type: 'Vendeur',
        propertyValue: 200000000,
        property: 'Villa 400m² - Mermoz',
        status: 'En vente',
        lastContact: '2024-12-18',
        visits: 8,
        satisfaction: 4.5
      },
      {
        id: 3,
        name: 'Urban Developers',
        type: 'Promoteur',
        properties: 15,
        totalValue: 2500000000,
        status: 'Partenaire',
        lastContact: '2024-12-12',
        visits: 25,
        satisfaction: 4.8
      }
    ],
    properties: [
      {
        id: 1,
        title: 'Villa Moderne Almadies',
        location: 'Almadies, Dakar',
        price: 185000000,
        size: '350m²',
        rooms: 5,
        status: 'Disponible',
        type: 'Villa',
        owner: 'M. Seck',
        visits: 12,
        inquiries: 8,
        listingDate: '2024-11-15'
      },
      {
        id: 2,
        title: 'Appartement Standing Plateau',
        location: 'Plateau, Dakar',
        price: 95000000,
        size: '120m²',
        rooms: 3,
        status: 'Sous compromis',
        type: 'Appartement',
        owner: 'Mme Fall',
        visits: 18,
        inquiries: 15,
        listingDate: '2024-10-28'
      },
      {
        id: 3,
        title: 'Terrain Constructible Thiès',
        location: 'Thiès',
        price: 45000000,
        size: '800m²',
        rooms: 0,
        status: 'Disponible',
        type: 'Terrain',
        owner: 'Domaine Seck',
        visits: 5,
        inquiries: 3,
        listingDate: '2024-12-01'
      }
    ],
    commissions: [
      {
        id: 1,
        property: 'Villa Mermoz - 250m²',
        client: 'Famille Ba',
        amount: 120000000,
        commission: 3600000,
        rate: 3.0,
        status: 'Payée',
        date: '2024-12-10'
      },
      {
        id: 2,
        property: 'Appartement Sacré-Cœur',
        client: 'M. Ndiaye',
        amount: 80000000,
        commission: 2400000,
        rate: 3.0,
        status: 'En attente',
        date: '2024-12-15'
      }
    ]
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const stats = [
    { value: dashboardData.stats.activeClients, label: 'Clients Actifs' },
    { value: dashboardData.stats.propertiesManaged, label: 'Propriétés Gérées' },
    { value: `${(dashboardData.stats.monthlyCommissions / 1000000).toFixed(1)}M`, label: 'Commissions (FCFA)' },
    { value: dashboardData.stats.salesCompleted, label: 'Ventes Réalisées' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'Disponible': 'bg-green-500',
      'Sous compromis': 'bg-yellow-500',
      'Vendu': 'bg-blue-500',
      'Retiré': 'bg-gray-500',
      'Actif': 'bg-green-500',
      'En vente': 'bg-blue-500',
      'Partenaire': 'bg-purple-500',
      'Payée': 'bg-green-500',
      'En attente': 'bg-orange-500',
      'En retard': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Villa': 'text-purple-600 bg-purple-100',
      'Appartement': 'text-blue-600 bg-blue-100',
      'Terrain': 'text-green-600 bg-green-100',
      'Bureau': 'text-orange-600 bg-orange-100',
      'Acheteur': 'text-blue-600 bg-blue-100',
      'Vendeur': 'text-green-600 bg-green-100',
      'Promoteur': 'text-purple-600 bg-purple-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre agence...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Agence Immobilière"
      subtitle="Gestion Clients & Propriétés"
      userRole="Agent Foncier"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Agent Foncier" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Agent Foncier" />
        </div>

        {/* Status & Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Monthly Commissions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Commissions Mensuelles</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(dashboardData.stats.monthlyCommissions)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Client Satisfaction */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Satisfaction Client</p>
                  <div className="flex items-center space-x-1">
                    {renderStars(dashboardData.stats.clientSatisfaction)}
                    <span className="text-lg font-bold text-yellow-600 ml-2">
                      {dashboardData.stats.clientSatisfaction}/5
                    </span>
                  </div>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          {/* Average Property Value */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Valeur Moy. Propriétés</p>
                  <p className="text-lg font-bold text-cyan-600">
                    {formatCurrency(dashboardData.stats.averagePropertyValue)}
                  </p>
                </div>
                <Building className="h-8 w-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="properties">Propriétés</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-cyan-600" />
                  Portfolio Clients
                </CardTitle>
                <CardDescription>
                  Gestion de vos clients acheteurs, vendeurs et partenaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.clients.map((client) => (
                    <div key={client.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{client.name}</h3>
                          <Badge className={getTypeColor(client.type)}>
                            {client.type}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            Dernier contact: {new Date(client.lastContact).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(client.status)} text-white`}>
                            {client.status}
                          </Badge>
                          <div className="flex items-center mt-1">
                            {renderStars(client.satisfaction)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">
                            {client.type === 'Acheteur' ? 'Budget' : 
                             client.type === 'Vendeur' ? 'Valeur Propriété' : 'Valeur Portfolio'}
                          </p>
                          <p className="font-semibold text-blue-600">
                            {client.budget && formatCurrency(client.budget)}
                            {client.propertyValue && formatCurrency(client.propertyValue)}
                            {client.totalValue && formatCurrency(client.totalValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Visites Organisées</p>
                          <p className="font-semibold">{client.visits}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Préférences/Propriété</p>
                          <p className="font-semibold text-sm">
                            {client.preferences || client.property || `${client.properties} propriétés`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                          <Eye className="h-4 w-4 mr-1" />
                          Profil
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Appeler
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          RDV
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-blue-600" />
                  Propriétés en Gestion
                </CardTitle>
                <CardDescription>
                  Suivi de votre portefeuille immobilier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.properties.map((property) => (
                    <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.location}
                          </p>
                          <p className="text-sm text-gray-500">Propriétaire: {property.owner}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(property.status)} text-white`}>
                            {property.status}
                          </Badge>
                          <Badge className={`${getTypeColor(property.type)} mt-1`}>
                            {property.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Prix</p>
                          <p className="font-semibold text-green-600">{formatCurrency(property.price)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Surface</p>
                          <p className="font-semibold">{property.size}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Visites</p>
                          <p className="font-semibold">{property.visits}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Intérêts</p>
                          <p className="font-semibold text-orange-600">{property.inquiries}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-4 w-4 mr-1" />
                          Planifier Visite
                        </Button>
                        <Button size="sm" variant="outline">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Statistiques
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commissions Tab */}
          <TabsContent value="commissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                  Suivi des Commissions
                </CardTitle>
                <CardDescription>
                  Historique et état des commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.commissions.map((commission) => (
                    <div key={commission.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{commission.property}</h3>
                          <p className="text-gray-600">Client: {commission.client}</p>
                          <p className="text-sm text-gray-500">
                            Vente du {new Date(commission.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(commission.status)} text-white`}>
                            {commission.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Montant Vente</p>
                          <p className="font-semibold">{formatCurrency(commission.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Taux Commission</p>
                          <p className="font-semibold">{commission.rate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Commission</p>
                          <p className="font-semibold text-green-600">{formatCurrency(commission.commission)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Statut</p>
                          <p className="font-semibold">{commission.status}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Facture
                        </Button>
                        {commission.status === 'En attente' && (
                          <Button size="sm" variant="outline" className="text-orange-600 border-orange-600">
                            <Clock className="h-4 w-4 mr-1" />
                            Relancer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Agence</CardTitle>
                <CardDescription>
                  Configuration de votre agence immobilière
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Taux Commission Vente (%)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded-md" 
                      placeholder="Ex: 3.0" 
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Taux Commission Location (%)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded-md" 
                      placeholder="Ex: 10.0" 
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Zone de Couverture</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Dakar</option>
                      <option>Thiès</option>
                      <option>Saint-Louis</option>
                      <option>Tout le Sénégal</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Langue par Défaut</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Français</option>
                      <option>Wolof</option>
                      <option>Anglais</option>
                    </select>
                  </div>
                </div>
                <Button className="bg-cyan-600 hover:bg-cyan-700">
                  Sauvegarder les Paramètres
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ModernAgentFoncierDashboard;
