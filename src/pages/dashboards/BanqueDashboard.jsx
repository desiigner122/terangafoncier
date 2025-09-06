import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Banknote, 
  TrendingUp, 
  Users, 
  FileText, 
  Calculator, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  CreditCard,
  PieChart,
  BarChart3,
  Phone,
  Mail,
  Download,
  Plus,
  Search,
  Filter,
  UserCheck,
  Globe,
  Home,
  Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

const BanqueDashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const [dashboardData, setDashboardData] = useState({
    creditRequests: [],
    activeLoans: [],
    clientPortfolio: [],
    performance: {},
    marketOpportunities: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    setTimeout(() => {
      setDashboardData({
        creditRequests: [
          {
            id: 'CR001',
            applicant: 'Amadou Diallo',
            amount: 35000000,
            purpose: 'Achat terrain Almadies',
            status: 'under_review',
            submitted: '2024-06-03',
            creditScore: 720,
            monthlyIncome: 850000,
            requestedTerm: 15,
            propertyValue: 45000000,
            downPayment: 10000000,
            diaspora: true,
            country: 'France'
          },
          {
            id: 'CR002',
            applicant: 'Fatou Seck',
            amount: 25000000,
            purpose: 'Construction maison Saly',
            status: 'approved',
            submitted: '2024-05-28',
            creditScore: 780,
            monthlyIncome: 1200000,
            requestedTerm: 20,
            propertyValue: 40000000,
            downPayment: 15000000,
            diaspora: false,
            country: 'Sénégal'
          },
          {
            id: 'CR003',
            applicant: 'Jean Baptiste',
            amount: 18000000,
            purpose: 'Achat terrain Thiès',
            status: 'rejected',
            submitted: '2024-06-01',
            creditScore: 580,
            monthlyIncome: 450000,
            requestedTerm: 10,
            propertyValue: 22000000,
            downPayment: 4000000,
            diaspora: false,
            country: 'Sénégal'
          }
        ],
        activeLoans: [
          {
            id: 'L001',
            client: 'Papa Sow',
            originalAmount: 40000000,
            remainingBalance: 28000000,
            monthlyPayment: 380000,
            interestRate: 8.5,
            remainingTerms: 84,
            nextPayment: '2024-06-15',
            status: 'current',
            propertyType: 'Terrain Dakar'
          },
          {
            id: 'L002',
            client: 'Awa Fall (Diaspora)',
            originalAmount: 60000000,
            remainingBalance: 52000000,
            monthlyPayment: 450000,
            interestRate: 7.8,
            remainingTerms: 156,
            nextPayment: '2024-06-20',
            status: 'current',
            propertyType: 'Villa Almadies'
          },
          {
            id: 'L003',
            client: 'Moussa Cissé',
            originalAmount: 20000000,
            remainingBalance: 8000000,
            monthlyPayment: 285000,
            interestRate: 9.2,
            remainingTerms: 32,
            nextPayment: '2024-06-10',
            status: 'late',
            propertyType: 'Terrain Rufisque'
          }
        ],
        clientPortfolio: [
          {
            segment: 'Diaspora Premium',
            count: 156,
            totalLoans: 8500000000,
            avgLoanSize: 54487179,
            defaultRate: 2.1,
            profitability: 'high'
          },
          {
            segment: 'Particuliers Locaux',
            count: 342,
            totalLoans: 4200000000,
            avgLoanSize: 12280701,
            defaultRate: 4.8,
            profitability: 'medium'
          },
          {
            segment: 'Professionnels',
            count: 89,
            totalLoans: 6800000000,
            avgLoanSize: 76404494,
            defaultRate: 1.5,
            profitability: 'high'
          }
        ],
        performance: {
          totalPortfolio: 19500000000,
          monthlyRevenue: 145000000,
          newClientsThisMonth: 23,
          approvalRate: 72,
          avgProcessingTime: 5.2,
          defaultRate: 2.8,
          profitMargin: 24.5
        },
        marketOpportunities: [
          {
            id: 'OP001',
            title: 'Financement Terrains Communaux',
            potential: '500M XOF',
            description: 'Nouveau partenariat avec mairies pour terrains communaux',
            priority: 'high',
            deadline: '2024-06-30'
          },
          {
            id: 'OP002',
            title: 'Crédits Construction Diaspora',
            potential: '1.2B XOF',
            description: 'Expansion vers nouveaux pays diaspora',
            priority: 'medium',
            deadline: '2024-07-15'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const QuickAction = ({ title, description, icon: Icon, color, action, link }) => (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button asChild size="sm">
              <Link to={link}>{action}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const CreditRequestCard = ({ request }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold flex items-center gap-2">
              {request.applicant}
              {request.diaspora && <Globe className="w-4 h-4 text-blue-600" />}
            </h4>
            <p className="text-sm text-muted-foreground">{request.purpose}</p>
          </div>
          <Badge variant={
            request.status === 'under_review' ? 'secondary' :
            request.status === 'approved' ? 'default' :
            'destructive'
          }>
            {request.status === 'under_review' ? 'En révision' :
             request.status === 'approved' ? 'Approuvé' :
             'Rejeté'}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <span className="text-muted-foreground">Montant demandé:</span>
            <p className="font-medium">{(request.amount / 1000000).toFixed(0)}M XOF</p>
          </div>
          <div>
            <span className="text-muted-foreground">Score crédit:</span>
            <p className={`font-medium ${request.creditScore >= 700 ? 'text-green-600' : 
                                      request.creditScore >= 600 ? 'text-yellow-600' : 'text-red-600'}`}>
              {request.creditScore}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Revenus mensuels:</span>
            <p className="font-medium">{(request.monthlyIncome / 1000).toFixed(0)}K XOF</p>
          </div>
          <div>
            <span className="text-muted-foreground">Apport personnel:</span>
            <p className="font-medium">{((request.downPayment / request.propertyValue) * 100).toFixed(0)}%</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Dossier
          </Button>
          <Button size="sm" className="flex-1">
            <Calculator className="w-4 h-4 mr-2" />
            Évaluer
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const LoanCard = ({ loan }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold">{loan.client}</h4>
            <p className="text-sm text-muted-foreground">{loan.propertyType}</p>
          </div>
          <Badge variant={loan.status === 'current' ? 'default' : 'destructive'}>
            {loan.status === 'current' ? 'À jour' : 'En retard'}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Solde restant</span>
              <span className="font-medium">{(loan.remainingBalance / 1000000).toFixed(1)}M XOF</span>
            </div>
            <Progress 
              value={((loan.originalAmount - loan.remainingBalance) / loan.originalAmount) * 100} 
              className="h-2" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Mensualité:</span>
              <p className="font-medium">{(loan.monthlyPayment / 1000).toFixed(0)}K XOF</p>
            </div>
            <div>
              <span className="text-muted-foreground">Taux:</span>
              <p className="font-medium">{loan.interestRate}%</p>
            </div>
          </div>
          
          <div className="text-sm">
            <span className="text-muted-foreground">Prochain paiement:</span>
            <p className="font-medium">{new Date(loan.nextPayment).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" className="flex-1">
            <Phone className="w-4 h-4 mr-2" />
            Contacter
          </Button>
          <Button size="sm" className="flex-1">
            <FileText className="w-4 h-4 mr-2" />
            Historique
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Banknote className="w-8 h-8" />
            Espace Bancaire 🏦
          </h1>
          <p className="text-muted-foreground">
            Gérez vos crédits immobiliers et développez votre portefeuille client
          </p>
          <div className="flex items-center mt-2 space-x-4">
            <Badge variant="secondary">
              {dashboardData.performance.newClientsThisMonth} nouveaux clients ce mois
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {dashboardData.performance.approvalRate}% taux d'approbation
            </Badge>
          </div>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/banque/nouvelle-offre">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Offre
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/banque/prospects">
              <Search className="w-4 h-4 mr-2" />
              Chercher Prospects
            </Link>
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="loans">Prêts Actifs</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
        </TabsList>

        {/* Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction
              title="Évaluer Demandes"
              description="Nouvelles demandes de crédit à examiner"
              icon={FileText}
              color="bg-blue-600"
              action="Évaluer"
              link="/banque/demandes"
            />
            <QuickAction
              title="Prospects Immobilier"
              description="Nouveaux acheteurs de terrains à contacter"
              icon={Users}
              color="bg-green-600"
              action="Voir"
              link="/banque/prospects"
            />
            <QuickAction
              title="Simulateur Crédit"
              description="Configurez vos barèmes et conditions"
              icon={Calculator}
              color="bg-purple-600"
              action="Configurer"
              link="/banque/simulateur"
            />
            <QuickAction
              title="Reporting Analytics"
              description="Analyse de performance et rentabilité"
              icon={BarChart3}
              color="bg-orange-600"
              action="Analyser"
              link="/banque/analytics"
            />
          </div>

          {/* KPIs Performance */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Portfolio Total</p>
                    <p className="text-2xl font-bold">{(dashboardData.performance.totalPortfolio / 1000000000).toFixed(1)}B</p>
                    <p className="text-xs text-muted-foreground">XOF</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenus Mensuels</p>
                    <p className="text-2xl font-bold">{(dashboardData.performance.monthlyRevenue / 1000000).toFixed(0)}M</p>
                    <p className="text-xs text-muted-foreground">XOF</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taux Défaut</p>
                    <p className="text-2xl font-bold">{dashboardData.performance.defaultRate}%</p>
                    <p className="text-xs text-green-600">Très faible</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Marge Profit</p>
                    <p className="text-2xl font-bold">{dashboardData.performance.profitMargin}%</p>
                    <p className="text-xs text-green-600">Excellent</p>
                  </div>
                  <PieChart className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segments clients et activité récente */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Segments Clients</CardTitle>
                <CardDescription>Performance par type de clientèle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.clientPortfolio.map((segment, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{segment.segment}</h4>
                        <Badge variant={
                          segment.profitability === 'high' ? 'default' :
                          segment.profitability === 'medium' ? 'secondary' : 'outline'
                        }>
                          {segment.profitability === 'high' ? 'Rentable' :
                           segment.profitability === 'medium' ? 'Moyen' : 'Faible'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Clients:</span>
                          <p className="font-medium">{segment.count}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Prêt moyen:</span>
                          <p className="font-medium">{(segment.avgLoanSize / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Total prêts:</span>
                          <p className="font-medium">{(segment.totalLoans / 1000000000).toFixed(1)}B</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Défaut:</span>
                          <p className={`font-medium ${segment.defaultRate <= 3 ? 'text-green-600' : 'text-red-600'}`}>
                            {segment.defaultRate}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demandes Urgentes</CardTitle>
                <CardDescription>Dossiers nécessitant une attention immédiate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.creditRequests.filter(r => r.status === 'under_review').slice(0, 3).map((request) => (
                    <div key={request.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{request.applicant}</h4>
                        <Badge variant="secondary">En révision</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{request.purpose}</p>
                      <div className="flex justify-between text-sm">
                        <span>Montant: {(request.amount / 1000000).toFixed(0)}M XOF</span>
                        <span>Score: {request.creditScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demandes de crédit */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Demandes de Crédit</h2>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {dashboardData.creditRequests.filter(r => r.status === 'under_review').length} en révision
              </Badge>
              <Badge variant="default">
                {dashboardData.creditRequests.filter(r => r.status === 'approved').length} approuvées
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.creditRequests.map((request) => (
              <CreditRequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        {/* Prêts actifs */}
        <TabsContent value="loans" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Prêts Actifs</h2>
            <div className="flex gap-2">
              <Badge variant="default">
                {dashboardData.activeLoans.filter(l => l.status === 'current').length} à jour
              </Badge>
              <Badge variant="destructive">
                {dashboardData.activeLoans.filter(l => l.status === 'late').length} en retard
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.activeLoans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        </TabsContent>

        {/* Portfolio */}
        <TabsContent value="portfolio" className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics Portfolio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Répartition Géographique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Dakar</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Thiès</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Mbour</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Autres</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Types de Financement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Achat terrain</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Construction</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rénovation</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Clientèle Diaspora</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600">35%</div>
                  <p className="text-sm text-muted-foreground">du portefeuille</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>France</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>USA</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Autres</span>
                    <span className="font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Opportunités */}
        <TabsContent value="opportunities" className="space-y-6">
          <h2 className="text-2xl font-bold">Opportunités Marché</h2>
          
          <div className="space-y-6">
            {dashboardData.marketOpportunities.map((opportunity) => (
              <Card key={opportunity.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{opportunity.title}</h4>
                      <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-600 font-medium">Potentiel: {opportunity.potential}</span>
                        <span className="text-muted-foreground">
                          Deadline: {new Date(opportunity.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={
                        opportunity.priority === 'high' ? 'destructive' :
                        opportunity.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {opportunity.priority === 'high' ? 'Priorité Haute' :
                         opportunity.priority === 'medium' ? 'Priorité Moyenne' : 'Priorité Basse'}
                      </Badge>
                      <Button className="mt-2 w-full">
                        Analyser
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueDashboard;
