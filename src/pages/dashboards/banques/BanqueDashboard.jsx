import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Building2, 
  Users,
  Calculator,
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  PieChart,
  BarChart3,
  Target,
  Phone,
  Mail,
  Eye,
  Edit,
  Download,
  Plus,
  Award,
  Shield,
  Briefcase,
  Home,
  Banknote,
  CreditCard as Card,
  Search,
  Filter,
  Percent,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const BanqueDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      portefeuille: 2450000000,
      creditsMois: 156,
      tauxApprob: 78,
      nouveauxClients: 24,
      satisfaction: 94
    },
    credits: [
      {
        id: 1,
        numero: 'CR-2024-0245',
        client: 'M. Amadou Diallo',
        typeCredit: 'Crédit Habitat',
        montant: 85000000,
        duree: 240, // mois
        taux: 6.5,
        bien: 'Villa Almadies - 350m²',
        statut: 'En cours évaluation',
        dateDepot: '2024-03-10',
        echeance: '2024-03-25',
        progression: 45,
        apportPersonnel: 25500000,
        revenuMensuel: 2800000
      },
      {
        id: 2,
        numero: 'CR-2024-0238',
        client: 'ABC Promotion',
        typeCredit: 'Crédit Professionnel',
        montant: 450000000,
        duree: 120,
        taux: 7.2,
        bien: 'Lotissement Saly - 50 lots',
        statut: 'Approuvé',
        dateDepot: '2024-02-20',
        echeance: '2024-03-15',
        progression: 100,
        apportPersonnel: 135000000,
        revenuMensuel: 15000000
      },
      {
        id: 3,
        numero: 'CR-2024-0251',
        client: 'Mme Fatou Fall',
        typeCredit: 'Crédit Acquisition',
        montant: 35000000,
        duree: 180,
        taux: 6.8,
        bien: 'Appartement Médina - 120m²',
        statut: 'En attente documents',
        dateDepot: '2024-03-15',
        echeance: '2024-04-05',
        progression: 25,
        apportPersonnel: 10500000,
        revenuMensuel: 1200000
      }
    ],
    clients: [
      {
        id: 1,
        nom: 'M. Amadou Diallo',
        email: 'amadou.diallo@email.com',
        telephone: '+221 77 123 45 67',
        typeClient: 'Particulier',
        scoreBanque: 750,
        anciennete: '2020-05-15',
        nbCredits: 2,
        encours: 85000000,
        statut: 'Premium'
      },
      {
        id: 2,
        nom: 'ABC Promotion',
        email: 'finance@abc-promotion.sn',
        telephone: '+221 33 825 12 34',
        typeClient: 'Entreprise',
        scoreBanque: 820,
        anciennete: '2018-03-10',
        nbCredits: 8,
        encours: 450000000,
        statut: 'Corporate'
      }
    ],
    portefeuille: [
      {
        type: 'Crédit Habitat',
        montant: 1200000000,
        pourcentage: 49,
        nbCredits: 95,
        tauxDefaut: 2.1
      },
      {
        type: 'Crédit Professionnel',
        montant: 800000000,
        pourcentage: 33,
        nbCredits: 35,
        tauxDefaut: 3.2
      },
      {
        type: 'Crédit Acquisition',
        montant: 450000000,
        pourcentage: 18,
        nbCredits: 68,
        tauxDefaut: 1.8
      }
    ],
    analytics: {
      evolutionCA: [180, 220, 195, 245, 210, 245],
      typesCredits: {
        'Crédit Habitat': 49,
        'Crédit Professionnel': 33,
        'Crédit Acquisition': 18
      },
      satisfactionClient: 94,
      delaisTraitement: 12,
      tauxApprob: 78,
      revenus: 45000000
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const stats = [
    { value: formatCurrency(dashboardData.stats.portefeuille), label: 'Portefeuille Global' },
    { value: dashboardData.stats.creditsMois, label: 'Crédits ce Mois' },
    { value: `${dashboardData.stats.tauxApprob}%`, label: 'Taux Approbation' },
    { value: `${dashboardData.stats.satisfaction}%`, label: 'Satisfaction' }
  ];

  const getStatutColor = (statut) => {
    const colors = {
      'En cours évaluation': 'bg-blue-500',
      'Approuvé': 'bg-green-500',
      'En attente documents': 'bg-yellow-500',
      'Refusé': 'bg-red-500',
      'Premium': 'bg-purple-500',
      'Corporate': 'bg-blue-500',
      'Standard': 'bg-green-500',
      'À risque': 'bg-orange-500'
    };
    return colors[statut] || 'bg-gray-500';
  };

  function formatCurrency(amount) {
    if (typeof amount === 'string') return amount;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  const calculateMensualite = (montant, duree, taux) => {
    const tauxMensuel = taux / 100 / 12;
    const mensualite = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
    return formatCurrency(mensualite);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace bancaire...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Espace Bancaire"
      subtitle="Gestion des crédits immobiliers et financement"
      userRole="Banque"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Banque" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Banque" />
        </div>

        {/* Métriques Bancaires */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Revenus Mensuels</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {formatCurrency(dashboardData.analytics.revenus)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">+22% vs mois dernier</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Délai Traitement</p>
                  <p className="text-lg font-bold text-blue-600">
                    {dashboardData.analytics.delaisTraitement} jours
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
                  <p className="font-medium">Nouveaux Clients</p>
                  <p className="text-lg font-bold text-green-600">
                    +{dashboardData.stats.nouveauxClients}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-2">
                <Progress value={85} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Risque Portfolio</p>
                  <p className="text-lg font-bold text-orange-600">2.4%</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">-0.3% ce mois</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu Principal */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="credits">Crédits</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="portefeuille">Portefeuille</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Actions Rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-indigo-600" />
                    Actions Rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Crédit
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calculator className="h-4 w-4 mr-2" />
                    Simulateur
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Rapport Risque
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* Crédits en Cours */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                      Dossiers en Cours
                    </span>
                    <Button size="sm" variant="outline">Voir tout</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.credits.filter(c => c.statut !== 'Approuvé').slice(0, 3).map((credit) => (
                      <div key={credit.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{credit.numero}</h4>
                            <p className="text-sm text-gray-600">{credit.typeCredit} - {credit.client}</p>
                          </div>
                          <Badge className={`${getStatutColor(credit.statut)} text-white`}>
                            {credit.statut}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Montant: {formatCurrency(credit.montant)}</span>
                          <span>Taux: {credit.taux}%</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progression</span>
                            <span>{credit.progression}%</span>
                          </div>
                          <Progress value={credit.progression} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Portfolio & Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-green-600" />
                    Répartition Portefeuille
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.portefeuille.map((item, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-sm">{item.type}</h4>
                            <p className="text-xs text-gray-600">{item.nbCredits} crédits</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">{formatCurrency(item.montant)}</p>
                            <p className="text-xs text-gray-600">{item.pourcentage}%</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress value={item.pourcentage} className="h-2" />
                        </div>
                        <p className="text-xs text-orange-600 mt-1">Défaut: {item.tauxDefaut}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-purple-600" />
                    Performance ce Mois
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nouveaux crédits</span>
                      <span className="font-bold text-green-600">+{dashboardData.stats.creditsMois}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Taux approbation</span>
                      <span className="font-bold text-blue-600">{dashboardData.stats.tauxApprob}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Revenus générés</span>
                      <span className="font-bold text-purple-600">{formatCurrency(dashboardData.analytics.revenus)}</span>
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

          {/* Credits Tab */}
          <TabsContent value="credits" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des Crédits</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Crédit
                </Button>
              </div>
            </div>

            {/* Statistiques Crédits */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {dashboardData.credits.filter(c => c.statut === 'En cours évaluation').length}
                    </p>
                    <p className="text-sm text-gray-600">En Évaluation</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {dashboardData.credits.filter(c => c.statut === 'En attente documents').length}
                    </p>
                    <p className="text-sm text-gray-600">Documents Manquants</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {dashboardData.credits.filter(c => c.statut === 'Approuvé').length}
                    </p>
                    <p className="text-sm text-gray-600">Approuvés</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatCurrency(dashboardData.credits.reduce((sum, c) => sum + c.montant, 0))}
                    </p>
                    <p className="text-sm text-gray-600">Montant Total</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des Crédits */}
            <div className="grid gap-6">
              {dashboardData.credits.map((credit) => (
                <Card key={credit.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="font-semibold text-lg">{credit.numero}</h3>
                          <Badge className={`${getStatutColor(credit.statut)} text-white`}>
                            {credit.statut}
                          </Badge>
                          <Badge variant="outline">
                            {credit.typeCredit}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Client</p>
                            <p className="font-medium">{credit.client}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Montant</p>
                            <p className="font-medium text-green-600">{formatCurrency(credit.montant)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Taux</p>
                            <p className="font-medium text-blue-600">{credit.taux}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Mensualité</p>
                            <p className="font-medium">{calculateMensualite(credit.montant, credit.duree, credit.taux)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Bien</p>
                            <p className="font-medium">{credit.bien}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Apport Personnel</p>
                            <p className="font-medium">{formatCurrency(credit.apportPersonnel)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Revenu Mensuel</p>
                            <p className="font-medium">{formatCurrency(credit.revenuMensuel)}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progression dossier</span>
                            <span>{credit.progression}%</span>
                          </div>
                          <Progress value={credit.progression} className="h-3" />
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Durée: {credit.duree} mois</span>
                          <span>Échéance: {new Date(credit.echeance).toLocaleDateString('fr-FR')}</span>
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
                          <Calculator className="h-4 w-4 mr-1" />
                          Simulation
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
                          <Badge className={`${getStatutColor(client.statut)} text-white`}>
                            {client.statut}
                          </Badge>
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
                            <p className="text-sm text-gray-600">Score Crédit</p>
                            <p className="font-medium text-green-600">{client.scoreBanque}/850</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Encours</p>
                            <p className="font-medium text-blue-600">{formatCurrency(client.encours)}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Client depuis: {new Date(client.anciennete).toLocaleDateString('fr-FR')}</span>
                          <span>Nb crédits: {client.nbCredits}</span>
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

          {/* Portefeuille Tab */}
          <TabsContent value="portefeuille" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analyse du Portefeuille</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.portefeuille.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="font-semibold text-lg">{item.type}</h3>
                      <p className="text-3xl font-bold text-blue-600 mt-2">{formatCurrency(item.montant)}</p>
                      <p className="text-sm text-gray-600">{item.pourcentage}% du portefeuille</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Nombre de crédits</span>
                        <span className="font-medium">{item.nbCredits}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux de défaut</span>
                        <span className="font-medium text-orange-600">{item.tauxDefaut}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Montant moyen</span>
                        <span className="font-medium">{formatCurrency(item.montant / item.nbCredits)}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Progress value={item.pourcentage} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analytics Bancaires</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter Rapport
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Croissance CA</p>
                      <p className="text-2xl font-bold text-blue-600">+22%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Taux Défaut</p>
                      <p className="text-2xl font-bold text-orange-600">2.4%</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">ROE</p>
                      <p className="text-2xl font-bold text-green-600">18.5%</p>
                    </div>
                    <Percent className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(dashboardData.analytics.typesCredits).map(([type, percentage]) => (
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
                  <CardTitle>Indicateurs Clés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{dashboardData.analytics.delaisTraitement}j</p>
                      <p className="text-sm text-gray-600">Délai moyen traitement</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{dashboardData.analytics.tauxApprob}%</p>
                      <p className="text-sm text-gray-600">Taux d'approbation</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{dashboardData.analytics.satisfactionClient}%</p>
                      <p className="text-sm text-gray-600">Satisfaction client</p>
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

export default BanqueDashboard;
