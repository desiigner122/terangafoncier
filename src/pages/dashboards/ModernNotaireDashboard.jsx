import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Scale, 
  Users, 
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Calendar,
  MapPin,
  Building,
  Stamp,
  Archive,
  FileText as Document
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const ModernNotaireDashboard = () => {
  const [activeTab, setActiveTab] = useState('actes');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalActes: 234,
      clientsActifs: 89,
      actesEnCours: 15,
      verificationsComplete: 178,
      revenuMensuel: 18500000,
      dossiersSigmatis: 56
    },
    actes: [
      {
        id: 1,
        type: 'Vente Immobilière',
        client: 'Famille Diallo',
        property: 'Villa Almadies - 350m²',
        value: 185000000,
        status: 'En préparation',
        createdDate: '2024-12-15',
        signingDate: '2024-12-28',
        documents: 12,
        verification: 85
      },
      {
        id: 2,
        type: 'Hypothèque',
        client: 'Sahel Construction',
        property: 'Terrain Industriel Diamniadio - 2000m²',
        value: 450000000,
        status: 'Prêt à signer',
        createdDate: '2024-12-10',
        signingDate: '2024-12-20',
        documents: 18,
        verification: 100
      },
      {
        id: 3,
        type: 'Donation',
        client: 'Famille Seck',
        property: 'Maison Rufisque - 200m²',
        value: 75000000,
        status: 'Vérifications',
        createdDate: '2024-12-18',
        signingDate: '2024-12-30',
        documents: 8,
        verification: 45
      }
    ],
    clients: [
      {
        id: 1,
        name: 'Heritage Fall',
        type: 'Vendeur Particulier',
        totalActes: 3,
        lastActe: '2024-12-01',
        status: 'Actif',
        rating: 'Excellent'
      },
      {
        id: 2,
        name: 'Urban Developers',
        type: 'Promoteur',
        totalActes: 12,
        lastActe: '2024-12-15',
        status: 'Actif',
        rating: 'Très bien'
      },
      {
        id: 3,
        name: 'Atlantique Capital',
        type: 'Investisseur',
        totalActes: 8,
        lastActe: '2024-11-28',
        status: 'Inactif',
        rating: 'Bien'
      }
    ],
    verifications: [
      {
        id: 1,
        property: 'Villa Les Palmiers',
        owner: 'Diallo Family',
        type: 'Vérification Titre',
        status: 'Complète',
        issues: 0,
        lastCheck: '2024-12-15'
      },
      {
        id: 2,
        property: 'Terrain Commercial Plateau',
        owner: 'Commercial Corp',
        type: 'Vérification Cadastrale',
        status: 'En cours',
        issues: 2,
        lastCheck: '2024-12-18'
      }
    ]
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const stats = [
    { value: dashboardData.stats.totalActes, label: 'Actes Rédigés' },
    { value: dashboardData.stats.clientsActifs, label: 'Clients Actifs' },
    { value: dashboardData.stats.actesEnCours, label: 'En Cours' },
    { value: dashboardData.stats.verificationsComplete, label: 'Vérifications OK' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'En préparation': 'bg-yellow-500',
      'Prêt à signer': 'bg-green-500',
      'Signé': 'bg-blue-500',
      'Vérifications': 'bg-orange-500',
      'Complète': 'bg-green-500',
      'En cours': 'bg-yellow-500',
      'Actif': 'bg-green-500',
      'Inactif': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getRatingColor = (rating) => {
    const colors = {
      'Excellent': 'text-green-600 bg-green-100',
      'Très bien': 'text-blue-600 bg-blue-100',
      'Bien': 'text-yellow-600 bg-yellow-100',
      'Moyen': 'text-orange-600 bg-orange-100'
    };
    return colors[rating] || 'text-gray-600 bg-gray-100';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre étude notariale...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Étude Notariale"
      subtitle="Gestion des Actes & Authentifications"
      userRole="Notaire"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Notaire" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Notaire" />
        </div>

        {/* Status & Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Monthly Revenue */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Revenus Mensuel</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(dashboardData.stats.revenuMensuel)}
                  </p>
                </div>
                <Scale className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* SIGMATIS Integration */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dossiers SIGMATIS</p>
                  <p className="text-lg font-bold text-purple-600">
                    {dashboardData.stats.dossiersSigmatis}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          {/* Document Archive */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Archives Numériques</p>
                  <Button size="sm" variant="outline" className="mt-1">
                    <Archive className="h-4 w-4 mr-1" />
                    Accéder
                  </Button>
                </div>
                <Archive className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="actes">Actes</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="verifications">Vérifications</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Actes Tab */}
          <TabsContent value="actes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-purple-600" />
                  Actes en Cours
                </CardTitle>
                <CardDescription>
                  Gestion des actes notariés en préparation et signature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.actes.map((acte) => (
                    <div key={acte.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{acte.type}</h3>
                          <p className="text-gray-600">Client: {acte.client}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {acte.property}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(acte.status)} text-white`}>
                            {acte.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            Signature: {new Date(acte.signingDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Valeur Acte</p>
                          <p className="font-semibold text-blue-600">{formatCurrency(acte.value)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Documents</p>
                          <p className="font-semibold">{acte.documents}/20</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Vérification</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={acte.verification} className="flex-1 h-2" />
                            <span className="text-sm font-semibold">{acte.verification}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Statut</p>
                          <p className="font-semibold">{acte.status}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Eye className="h-4 w-4 mr-1" />
                          Ouvrir
                        </Button>
                        <Button size="sm" variant="outline">
                          <Document className="h-4 w-4 mr-1" />
                          Documents
                        </Button>
                        <Button size="sm" variant="outline">
                          <Stamp className="h-4 w-4 mr-1" />
                          Authentifier
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Portfolio Clients
                </CardTitle>
                <CardDescription>
                  Suivi des clients et de leur historique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.clients.map((client) => (
                    <div key={client.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{client.name}</h3>
                          <p className="text-gray-600">{client.type}</p>
                          <p className="text-sm text-gray-500">
                            Dernier acte: {new Date(client.lastActe).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getRatingColor(client.rating)}>
                            {client.rating}
                          </Badge>
                          <Badge className={`${getStatusColor(client.status)} text-white mt-1`}>
                            {client.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Actes Réalisés</p>
                          <p className="font-semibold">{client.totalActes}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Évaluation</p>
                          <p className="font-semibold">{client.rating}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Statut</p>
                          <p className="font-semibold">{client.status}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Profil
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Historique
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

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-orange-600" />
                  Vérifications en Cours
                </CardTitle>
                <CardDescription>
                  Contrôle des titres de propriété et vérifications cadastrales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.verifications.map((verification) => (
                    <div key={verification.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{verification.property}</h3>
                          <p className="text-gray-600">Propriétaire: {verification.owner}</p>
                          <p className="text-sm text-gray-500">{verification.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(verification.status)} text-white`}>
                            {verification.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Statut</p>
                          <p className="font-semibold">{verification.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Problèmes Détectés</p>
                          <p className={`font-semibold ${verification.issues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {verification.issues} {verification.issues > 0 ? 'problèmes' : 'aucun'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Dernière Vérification</p>
                          <p className="font-semibold">
                            {new Date(verification.lastCheck).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <Shield className="h-4 w-4 mr-1" />
                          Re-vérifier
                        </Button>
                        {verification.issues > 0 && (
                          <Button size="sm" variant="outline" className="text-red-600 border-red-600">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Problèmes
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
                <CardTitle>Paramètres Étude Notariale</CardTitle>
                <CardDescription>
                  Configuration de votre étude et tarification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tarif Acte de Vente (%)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded-md" 
                      placeholder="Ex: 1.2" 
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tarif Hypothèque (%)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded-md" 
                      placeholder="Ex: 0.8" 
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Délai Standard (jours)</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>15</option>
                      <option>21</option>
                      <option>30</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Intégration SIGMATIS</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Activée</option>
                      <option>Désactivée</option>
                    </select>
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
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

export default ModernNotaireDashboard;
