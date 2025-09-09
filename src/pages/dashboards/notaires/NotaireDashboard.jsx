import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Scale, 
  FileText, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  Gavel,
  Stamp,
  Building2,
  MapPin,
  Phone,
  Mail,
  Eye,
  Edit,
  Download,
  Plus,
  TrendingUp,
  BarChart3,
  Award,
  Shield,
  BookOpen,
  Archive,
  PenTool,
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

const NotaireDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalDossiers: 245,
      dossiersMois: 18,
      actesEnCours: 12,
      revenus: 15400000,
      satisfaction: 97
    },
    actes: [
      {
        id: 1,
        numero: 'ACT-2024-0156',
        type: 'Vente Immobilière',
        vendeur: 'M. Amadou Diallo',
        acheteur: 'Mme Fatou Fall',
        bien: 'Villa Almadies - 350m²',
        valeur: 125000000,
        honoraires: 1875000,
        statut: 'En cours',
        dateCreation: '2024-03-10',
        dateSignature: '2024-03-25',
        progression: 75
      },
      {
        id: 2,
        numero: 'ACT-2024-0148',
        type: 'Donation',
        donateur: 'M. Ibrahima Sow',
        beneficiaire: 'Mme Aida Sow',
        bien: 'Terrain Thiès - 500m²',
        valeur: 35000000,
        honoraires: 525000,
        statut: 'Finalisé',
        dateCreation: '2024-02-20',
        dateSignature: '2024-03-05',
        progression: 100
      },
      {
        id: 3,
        numero: 'ACT-2024-0162',
        type: 'Succession',
        defunt: 'Feu M. Moussa Ndiaye',
        heritiers: '4 héritiers',
        bien: 'Maison Médina - 280m²',
        valeur: 95000000,
        honoraires: 1425000,
        statut: 'En attente',
        dateCreation: '2024-03-15',
        dateSignature: '2024-04-10',
        progression: 30
      }
    ],
    rdv: [
      {
        id: 1,
        client: 'M. & Mme Thiam',
        type: 'Signature Acte Vente',
        date: '2024-03-22',
        heure: '10:00',
        duree: '1h30',
        acte: 'ACT-2024-0156',
        statut: 'Confirmé'
      },
      {
        id: 2,
        client: 'Famille Ndiaye',
        type: 'Conseil Succession',
        date: '2024-03-23',
        heure: '14:00',
        duree: '2h',
        acte: 'ACT-2024-0162',
        statut: 'À confirmer'
      }
    ],
    clients: [
      {
        id: 1,
        nom: 'M. Amadou Diallo',
        email: 'amadou.diallo@email.com',
        telephone: '+221 77 123 45 67',
        typeClient: 'Particulier',
        nbActes: 3,
        valeurTotale: 185000000,
        dernierActe: '2024-03-10'
      },
      {
        id: 2,
        nom: 'SCI Almadies',
        email: 'contact@sci-almadies.sn',
        telephone: '+221 33 825 12 34',
        typeClient: 'Société',
        nbActes: 8,
        valeurTotale: 450000000,
        dernierActe: '2024-02-28'
      }
    ],
    analytics: {
      typesActes: {
        'Ventes': 45,
        'Donations': 20,
        'Successions': 15,
        'Hypothèques': 12,
        'Baux': 8
      },
      evolution: [12, 15, 18, 16, 20, 18],
      satisfaction: 97,
      delaisMoyens: 15
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const stats = [
    { value: dashboardData.stats.totalDossiers, label: 'Total Dossiers' },
    { value: dashboardData.stats.dossiersMois, label: 'Dossiers ce Mois' },
    { value: dashboardData.stats.actesEnCours, label: 'Actes en Cours' },
    { value: `${dashboardData.stats.satisfaction}%`, label: 'Satisfaction' }
  ];

  const getStatutColor = (statut) => {
    const colors = {
      'En cours': 'bg-blue-500',
      'Finalisé': 'bg-green-500',
      'En attente': 'bg-yellow-500',
      'Suspendu': 'bg-red-500',
      'Confirmé': 'bg-green-500',
      'À confirmer': 'bg-yellow-500'
    };
    return colors[statut] || 'bg-gray-500';
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre étude notariale...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Étude Notariale"
      subtitle="Gestion des actes et formalités juridiques"
      userRole="Notaire"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Notaire" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Notaire" />
        </div>

        {/* Métriques Notariales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Revenus Mensuels</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {formatCurrency(dashboardData.stats.revenus)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+12% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Délai Moyen</p>
                  <p className="text-lg font-bold text-blue-600">
                    {dashboardData.analytics.delaisMoyens} jours
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-2">
                <Progress value={75} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Taux Réussite</p>
                  <p className="text-lg font-bold text-green-600">98%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Progress value={98} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Certifications</p>
                  <p className="text-lg font-bold text-purple-600">5</p>
                </div>
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Shield className="h-4 w-4 text-purple-600 mr-1" />
                <span className="text-purple-600">Toutes à jour</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu Principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="actes">Actes</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Actions Rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scale className="h-5 w-5 mr-2 text-indigo-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel Acte
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planifier RDV
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Générer Rapport
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Rechercher Acte
                  </Button>
                </CardContent>
              </Card>

              {/* Actes en Cours */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Gavel className="h-5 w-5 mr-2 text-blue-600" />
                      Actes en Cours
                    </span>
                    <Button size="sm" variant="outline">Voir tout</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.actes.filter(a => a.statut === 'En cours').slice(0, 3).map((acte) => (
                      <div key={acte.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{acte.numero}</h4>
                            <p className="text-sm text-gray-600">{acte.type}</p>
                          </div>
                          <Badge className={`${getStatutColor(acte.statut)} text-white`}>
                            {acte.statut}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Valeur: {formatCurrency(acte.valeur)}</span>
                          <span>Honoraires: {formatCurrency(acte.honoraires)}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progression</span>
                            <span>{acte.progression}%</span>
                          </div>
                          <Progress value={acte.progression} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prochains RDV */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-green-600" />
                    Prochains Rendez-vous
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.rdv.slice(0, 3).map((rdv) => (
                      <div key={rdv.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-sm">{rdv.client}</h4>
                            <p className="text-xs text-gray-600">{rdv.type}</p>
                          </div>
                          <Badge className={`${getStatutColor(rdv.statut)} text-white text-xs`}>
                            {rdv.statut}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          <p>{new Date(rdv.date).toLocaleDateString('fr-FR')} à {rdv.heure}</p>
                          <p>Durée: {rdv.duree}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Performance ce Mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nouveaux dossiers</span>
                      <span className="font-bold text-green-600">+{dashboardData.stats.dossiersMois}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Actes finalisés</span>
                      <span className="font-bold text-blue-600">16</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Revenus générés</span>
                      <span className="font-bold text-purple-600">{formatCurrency(dashboardData.stats.revenus)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Satisfaction client</span>
                      <span className="font-bold text-orange-600">{dashboardData.stats.satisfaction}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Actes Tab */}
          <TabsContent value="actes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Actes</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvel Acte
                </Button>
              </div>
            </div>

            {/* Statistiques Actes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {dashboardData.actes.filter(a => a.statut === 'En cours').length}
                    </p>
                    <p className="text-sm text-gray-600">En Cours</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {dashboardData.actes.filter(a => a.statut === 'En attente').length}
                    </p>
                    <p className="text-sm text-gray-600">En Attente</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {dashboardData.actes.filter(a => a.statut === 'Finalisé').length}
                    </p>
                    <p className="text-sm text-gray-600">Finalisés</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(dashboardData.actes.reduce((sum, a) => sum + a.honoraires, 0))}
                    </p>
                    <p className="text-sm text-gray-600">Honoraires Total</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des Actes */}
            <div className="grid gap-6">
              {dashboardData.actes.map((acte) => (
                <Card key={acte.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{acte.numero}</h3>
                          <Badge className={`${getStatutColor(acte.statut)} text-white`}>
                            {acte.statut}
                          </Badge>
                          <Badge variant="outline">
                            {acte.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Bien</p>
                            <p className="font-medium">{acte.bien}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Valeur</p>
                            <p className="font-medium text-green-600">{formatCurrency(acte.valeur)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Honoraires</p>
                            <p className="font-medium text-blue-600">{formatCurrency(acte.honoraires)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Signature</p>
                            <p className="font-medium">{new Date(acte.dateSignature).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progression</span>
                            <span>{acte.progression}%</span>
                          </div>
                          <Progress value={acte.progression} className="h-3" />
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Parties: {acte.vendeur || acte.donateur || acte.defunt} → {acte.acheteur || acte.beneficiaire || acte.heritiers}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Imprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Base Clients</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Rechercher
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Client
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {dashboardData.clients.map((client) => (
                <Card key={client.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{client.nom}</h3>
                          <Badge variant="outline">
                            {client.typeClient}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium">{client.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Téléphone</p>
                            <p className="font-medium">{client.telephone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Nb Actes</p>
                            <p className="font-medium">{client.nbActes}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Valeur Totale</p>
                            <p className="font-medium text-green-600">{formatCurrency(client.valeurTotale)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Dernier acte: {new Date(client.dernierActe).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Appeler
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Dossier
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Planning & Rendez-vous</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau RDV
              </Button>
            </div>

            <div className="grid gap-4">
              {dashboardData.rdv.map((rdv) => (
                <Card key={rdv.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{rdv.client}</h3>
                          <Badge className={`${getStatutColor(rdv.statut)} text-white`}>
                            {rdv.statut}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="font-medium">{rdv.type}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Date</p>
                            <p className="font-medium">{new Date(rdv.date).toLocaleDateString('fr-FR')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Heure</p>
                            <p className="font-medium">{rdv.heure}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Durée</p>
                            <p className="font-medium">{rdv.duree}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" />
                          Appeler
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analytics Notariales</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter Rapport
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Types d'Actes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.typesActes).map(([type, percentage]) => (
                      <div key={type}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{type}</span>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Évolution Mensuelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{dashboardData.stats.dossiersMois}</p>
                      <p className="text-sm text-gray-600">Dossiers ce mois</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">+15%</p>
                      <p className="text-sm text-gray-600">vs mois dernier</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default NotaireDashboard;
