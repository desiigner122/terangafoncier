import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  CreditCard, 
  FileText, 
  Users, 
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Calendar,
  PieChart,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';

const ModernBanqueDashboard = () => {
  const [activeTab, setActiveTab] = useState('financing');
  const [loading, setLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalLoans: 2850000000,
      activeClients: 145,
      monthlyVolume: 380000000,
      approvalRate: 73,
      pendingApplications: 28,
      portfolioRisk: 4.2
    },
    loanApplications: [
      {
        id: 1,
        clientName: 'Famille Diallo',
        project: 'Achat Villa Almadies',
        amount: 85000000,
        purpose: 'Résidentiel',
        status: 'En révision',
        riskScore: 6.8,
        submittedDate: '2024-12-15',
        documents: 8
      },
      {
        id: 2,
        clientName: 'Sahel Construction',
        project: 'Complexe Résidentiel Thiès',
        amount: 450000000,
        purpose: 'Promoteur',
        status: 'Approuvé',
        riskScore: 7.2,
        submittedDate: '2024-12-10',
        documents: 15
      },
      {
        id: 3,
        clientName: 'Urban Developers',
        project: 'Centre Commercial Dakar',
        amount: 680000000,
        purpose: 'Commercial',
        status: 'En attente documents',
        riskScore: 5.9,
        submittedDate: '2024-12-18',
        documents: 12
      }
    ],
    clients: [
      {
        id: 1,
        name: 'Atlantique Capital',
        type: 'Investisseur',
        totalLoans: 850000000,
        activeLoans: 3,
        paymentStatus: 'À jour',
        riskLevel: 'Faible'
      },
      {
        id: 2,
        name: 'Teranga Immobilier',
        type: 'Agent Foncier',
        totalLoans: 150000000,
        activeLoans: 2,
        paymentStatus: 'À jour',
        riskLevel: 'Faible'
      },
      {
        id: 3,
        name: 'Heritage Fall',
        type: 'Particulier',
        totalLoans: 45000000,
        activeLoans: 1,
        paymentStatus: 'Retard 15j',
        riskLevel: 'Modéré'
      }
    ]
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  const stats = [
    { value: `${(dashboardData.stats.totalLoans / 1000000000).toFixed(1)}Md`, label: 'Prêts Total (FCFA)' },
    { value: dashboardData.stats.activeClients, label: 'Clients Actifs' },
    { value: `${dashboardData.stats.approvalRate}%`, label: 'Taux d\'Approbation' },
    { value: dashboardData.stats.pendingApplications, label: 'Demandes en Cours' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'En révision': 'bg-yellow-500',
      'Approuvé': 'bg-green-500',
      'Rejeté': 'bg-red-500',
      'En attente documents': 'bg-orange-500',
      'À jour': 'bg-green-500',
      'Retard 15j': 'bg-orange-500',
      'Retard 30j': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getRiskColor = (risk) => {
    if (typeof risk === 'string') {
      const colors = {
        'Faible': 'text-green-600 bg-green-100',
        'Modéré': 'text-yellow-600 bg-yellow-100',
        'Élevé': 'text-red-600 bg-red-100'
      };
      return colors[risk] || 'text-gray-600 bg-gray-100';
    }
    if (risk < 5) return 'text-green-600';
    if (risk < 7) return 'text-yellow-600';
    return 'text-red-600';
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
          <p className="text-gray-600">Chargement de votre espace bancaire...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="Espace Bancaire"
      subtitle="Gestion des Financements Immobiliers"
      userRole="Banque"
      stats={stats}
    >
      <div className="space-y-6">
        {/* Widgets IA & Blockchain */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AIAssistantWidget userRole="Banque" dashboardData={dashboardData} />
          <BlockchainWidget userRole="Banque" />
        </div>

        {/* Status & Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Monthly Volume */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Volume Mensuel</p>
                  <p className="text-lg font-bold text-indigo-600">
                    {formatCurrency(dashboardData.stats.monthlyVolume)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Risk */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Risque Portfolio</p>
                  <p className={`text-lg font-bold ${getRiskColor(dashboardData.stats.portfolioRisk)}`}>
                    {dashboardData.stats.portfolioRisk}/10
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          {/* Calculator */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Simulateur Prêt</p>
                  <Button size="sm" variant="outline" className="mt-1">
                    <Calculator className="h-4 w-4 mr-1" />
                    Calculer
                  </Button>
                </div>
                <Calculator className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financing">Financement</TabsTrigger>
            <TabsTrigger value="applications">Dossiers</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Financing Tab */}
          <TabsContent value="financing" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                    Performance Financière
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Prêts Accordés (Mois)</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(dashboardData.stats.monthlyVolume)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taux d'Approbation</span>
                      <span className="font-semibold">{dashboardData.stats.approvalRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Créances Douteuses</span>
                      <span className="font-semibold text-orange-600">2.1%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Marge Nette</span>
                      <span className="font-semibold text-blue-600">4.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Répartition Secteurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Résidentiel</span>
                        <span>55%</span>
                      </div>
                      <Progress value={55} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Commercial</span>
                        <span>30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Industriel</span>
                        <span>15%</span>
                      </div>
                      <Progress value={15} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-orange-600" />
                  Demandes de Financement
                </CardTitle>
                <CardDescription>
                  Gestion des dossiers de prêt en cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.loanApplications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{application.clientName}</h3>
                          <p className="text-gray-600">{application.project}</p>
                          <p className="text-sm text-gray-500">
                            Soumis le {new Date(application.submittedDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(application.status)} text-white`}>
                            {application.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{application.purpose}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Montant Demandé</p>
                          <p className="font-semibold text-blue-600">{formatCurrency(application.amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Score de Risque</p>
                          <p className={`font-semibold ${getRiskColor(application.riskScore)}`}>
                            {application.riskScore}/10
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Documents</p>
                          <p className="font-semibold">{application.documents}/15</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Statut</p>
                          <p className="font-semibold">{application.status}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          <Eye className="h-4 w-4 mr-1" />
                          Examiner
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Documents
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calculator className="h-4 w-4 mr-1" />
                          Simuler
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
                  Suivi des clients et de leurs engagements
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
                        </div>
                        <div className="text-right">
                          <Badge className={getRiskColor(client.riskLevel)}>
                            {client.riskLevel}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Total Prêts</p>
                          <p className="font-semibold">{formatCurrency(client.totalLoans)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Prêts Actifs</p>
                          <p className="font-semibold">{client.activeLoans}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Statut Paiement</p>
                          <Badge className={`${getStatusColor(client.paymentStatus)} text-white`}>
                            {client.paymentStatus}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Risque</p>
                          <p className="font-semibold">{client.riskLevel}</p>
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
                          Échéancier
                        </Button>
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
                <CardTitle>Paramètres Bancaires</CardTitle>
                <CardDescription>
                  Configuration des critères de financement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Taux d'Intérêt Base</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded-md" 
                      placeholder="Ex: 6.5" 
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Score de Risque Max</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>7.0</option>
                      <option>7.5</option>
                      <option>8.0</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Montant Maximum (FCFA)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 border rounded-md" 
                      placeholder="Ex: 500000000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Durée Maximum (années)</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>15</option>
                      <option>20</option>
                      <option>25</option>
                      <option>30</option>
                    </select>
                  </div>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
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

export default ModernBanqueDashboard;
