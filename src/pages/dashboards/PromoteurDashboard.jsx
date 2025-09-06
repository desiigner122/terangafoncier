import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Hammer, 
  Building2, 
  Users, 
  Camera, 
  Calendar, 
  DollarSign, 
  Clock, 
  FileText, 
  Phone, 
  Mail,
  Upload,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MapPin,
  Plus,
  Edit,
  MessageSquare,
  Star,
  BarChart3,
  Globe,
  HardHat,
  PenTool
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { ROLES } from '@/lib/enhancedRbacConfig';

const PromoteurDashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const userRole = user?.role;
  const isPromoter = userRole === ROLES.PROMOTEUR;
  const isArchitect = userRole === ROLES.ARCHITECTE;
  const isConstructor = userRole === ROLES.CONSTRUCTEUR;
  
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    newBuyers: [],
    quotes: [],
    timeline: [],
    performance: {},
    opportunities: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    setTimeout(() => {
      setDashboardData({
        projects: [
          {
            id: 'P001',
            name: 'Villa Moderne Almadies',
            client: 'Amadou Diallo (Diaspora France)',
            status: 'in_progress',
            progress: 65,
            phase: 'Gros œuvre',
            budget: 85000000,
            startDate: '2024-03-15',
            expectedEnd: '2024-10-15',
            location: 'Almadies, Dakar',
            nextMilestone: 'Coulage dalle étage',
            lastUpdate: '2024-06-05'
          },
          {
            id: 'P002',
            name: 'Maison Familiale Saly',
            client: 'Fatou Seck (Diaspora USA)',
            status: 'planning',
            progress: 15,
            phase: 'Études préliminaires',
            budget: 45000000,
            startDate: '2024-06-01',
            expectedEnd: '2024-12-01',
            location: 'Saly, Mbour',
            nextMilestone: 'Validation plans',
            lastUpdate: '2024-06-04'
          },
          {
            id: 'P003',
            name: 'Duplex Thiès',
            client: 'Jean Baptiste',
            status: 'completed',
            progress: 100,
            phase: 'Livré',
            budget: 35000000,
            startDate: '2023-08-01',
            expectedEnd: '2024-04-01',
            location: 'Thiès',
            nextMilestone: 'Projet terminé',
            lastUpdate: '2024-04-01'
          }
        ],
        newBuyers: [
          {
            id: 'B001',
            name: 'Moussa Cissé',
            location: 'Terrain acheté à Rufisque',
            projectType: 'Maison R+1',
            budget: '40-50M XOF',
            timeline: 'ASAP',
            contact: '+221 77 888 99 00',
            email: 'moussa.cisse@email.com',
            purchaseDate: '2024-06-03',
            status: 'new',
            diaspora: false
          },
          {
            id: 'B002',
            name: 'Marie Diagne',
            location: 'Terrain acheté à Saly',
            projectType: 'Villa moderne',
            budget: '60-80M XOF',
            timeline: '8-12 mois',
            contact: '+33 6 12 34 56 78',
            email: 'marie.diagne@email.fr',
            purchaseDate: '2024-06-01',
            status: 'contacted',
            diaspora: true
          }
        ],
        quotes: [
          {
            id: 'Q001',
            project: 'Maison moderne Dakar',
            client: 'Papa Sow',
            amount: 55000000,
            status: 'pending',
            submitted: '2024-06-02',
            deadline: '2024-06-15',
            type: 'construction_complete',
            details: 'R+1, 4 chambres, piscine'
          },
          {
            id: 'Q002',
            project: 'Rénovation villa Almadies',
            client: 'Awa Fall (Diaspora)',
            amount: 25000000,
            status: 'accepted',
            submitted: '2024-05-28',
            deadline: '2024-06-10',
            type: 'renovation',
            details: 'Modernisation complète'
          }
        ],
        performance: {
          totalProjects: 23,
          activeProjects: 8,
          completedProjects: 15,
          averageRating: 4.8,
          clientSatisfaction: 96,
          onTimeDelivery: 87,
          monthlyRevenue: 45000000
        },
        opportunities: [
          {
            id: 'O001',
            title: 'Appel d\'offres - Complexe résidentiel Thiès',
            budget: '150-200M XOF',
            deadline: '2024-06-20',
            client: 'Société Immobilière du Sénégal',
            type: 'public_tender'
          },
          {
            id: 'O002',
            title: 'Projet privé - Villa de luxe Ngor',
            budget: '80-120M XOF',
            deadline: '2024-06-25',
            client: 'Particulier (Diaspora)',
            type: 'private_project'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const getRoleTitle = () => {
    if (isPromoter) return 'Promoteur Immobilier';
    if (isArchitect) return 'Architecte';
    if (isConstructor) return 'Constructeur';
    return 'Professionnel BTP';
  };

  const getRoleIcon = () => {
    if (isPromoter) return Hammer;
    if (isArchitect) return PenTool;
    if (isConstructor) return HardHat;
    return Building2;
  };

  const getRoleDescription = () => {
    if (isPromoter) return 'Gérez vos projets de promotion immobilière et suivez vos chantiers';
    if (isArchitect) return 'Concevez et supervisez vos projets architecturaux';
    if (isConstructor) return 'Gérez vos chantiers et équipes de construction';
    return 'Gérez vos projets de construction';
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

  const ProjectCard = ({ project }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {project.location}
            </CardDescription>
          </div>
          <Badge variant={
            project.status === 'in_progress' ? 'default' :
            project.status === 'planning' ? 'secondary' :
            project.status === 'completed' ? 'outline' : 'destructive'
          }>
            {project.status === 'in_progress' ? 'En cours' :
             project.status === 'planning' ? 'Planification' :
             project.status === 'completed' ? 'Terminé' : 'Suspendu'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span>Client: {project.client}</span>
            <span className="font-medium">{(project.budget / 1000000).toFixed(0)}M XOF</span>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Phase: {project.phase}</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Prochaine étape: {project.nextMilestone}</p>
            <p>MAJ: {new Date(project.lastUpdate).toLocaleDateString('fr-FR')}</p>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Photos
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Mise à jour
            </Button>
            <Button size="sm" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Client
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const NewBuyerCard = ({ buyer }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold flex items-center gap-2">
              {buyer.name}
              {buyer.diaspora && <Globe className="w-4 h-4 text-blue-600" />}
            </h4>
            <p className="text-sm text-muted-foreground">{buyer.location}</p>
          </div>
          <Badge variant={buyer.status === 'new' ? 'destructive' : 'default'}>
            {buyer.status === 'new' ? 'Nouveau' : 'Contacté'}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm mb-4">
          <p><strong>Projet:</strong> {buyer.projectType}</p>
          <p><strong>Budget:</strong> {buyer.budget}</p>
          <p><strong>Délai:</strong> {buyer.timeline}</p>
          <p><strong>Achat:</strong> {new Date(buyer.purchaseDate).toLocaleDateString('fr-FR')}</p>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Phone className="w-4 h-4 mr-2" />
            Appeler
          </Button>
          <Button size="sm" className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            Contacter
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

  const RoleIcon = getRoleIcon();

  return (
    <div className="space-y-8 p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <RoleIcon className="w-8 h-8" />
            {getRoleTitle()} 🏗️
          </h1>
          <p className="text-muted-foreground">{getRoleDescription()}</p>
          <div className="flex items-center mt-2 space-x-4">
            <Badge variant="secondary">
              {dashboardData.performance.activeProjects} projets actifs
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {dashboardData.performance.averageRating}/5 étoiles
            </Badge>
          </div>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/promoteur/nouveau-projet">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Projet
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/promoteur/appels-offres">
              <FileText className="w-4 h-4 mr-2" />
              Appels d'Offres
            </Link>
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="projects">Projets</TabsTrigger>
          <TabsTrigger value="buyers">Nouveaux Acheteurs</TabsTrigger>
          <TabsTrigger value="quotes">Devis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction
              title="Voir Nouveaux Acheteurs"
              description="Acheteurs récents ayant acheté un terrain"
              icon={Users}
              color="bg-blue-600"
              action="Voir"
              link="/promoteur/nouveaux-acheteurs"
            />
            <QuickAction
              title="Soumettre un Devis"
              description="Répondre à un appel d'offres ou projet"
              icon={FileText}
              color="bg-green-600"
              action="Soumettre"
              link="/promoteur/nouveau-devis"
            />
            <QuickAction
              title="Mettre à jour Projet"
              description="Ajouter photos et progression chantier"
              icon={Camera}
              color="bg-orange-600"
              action="Mettre à jour"
              link="/promoteur/mise-a-jour"
            />
            <QuickAction
              title="Portfolio Projets"
              description="Gérer votre portefeuille de réalisations"
              icon={Building2}
              color="bg-purple-600"
              action="Gérer"
              link="/promoteur/portfolio"
            />
          </div>

          {/* Statistiques performance */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Projets Actifs</p>
                    <p className="text-2xl font-bold">{dashboardData.performance.activeProjects}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Note Moyenne</p>
                    <p className="text-2xl font-bold">{dashboardData.performance.averageRating}/5</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Livraison à Temps</p>
                    <p className="text-2xl font-bold">{dashboardData.performance.onTimeDelivery}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Revenus Mensuels</p>
                    <p className="text-2xl font-bold">{(dashboardData.performance.monthlyRevenue / 1000000).toFixed(0)}M</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projets récents et opportunités */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projets en Cours</CardTitle>
                <CardDescription>Vos chantiers actifs nécessitant votre attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.projects.filter(p => p.status === 'in_progress').slice(0, 3).map((project) => (
                    <div key={project.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant="outline">{project.progress}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{project.client}</p>
                      <Progress value={project.progress} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opportunités</CardTitle>
                <CardDescription>Nouveaux appels d'offres et projets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.opportunities.map((opportunity) => (
                    <div key={opportunity.id} className="p-3 border rounded-lg">
                      <h4 className="font-medium mb-1">{opportunity.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Budget: {opportunity.budget}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Deadline: {new Date(opportunity.deadline).toLocaleDateString('fr-FR')}
                        </span>
                        <Button size="sm">Répondre</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Projets */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mes Projets</h2>
            <Button asChild>
              <Link to="/promoteur/nouveau-projet">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Projet
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        {/* Nouveaux acheteurs */}
        <TabsContent value="buyers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Nouveaux Acheteurs</h2>
            <Badge variant="secondary">
              {dashboardData.newBuyers.filter(b => b.status === 'new').length} nouveaux
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.newBuyers.map((buyer) => (
              <NewBuyerCard key={buyer.id} buyer={buyer} />
            ))}
          </div>
        </TabsContent>

        {/* Devis */}
        <TabsContent value="quotes" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mes Devis</h2>
            <div className="flex gap-2">
              <Badge variant="secondary">
                {dashboardData.quotes.filter(q => q.status === 'pending').length} en attente
              </Badge>
              <Badge variant="default">
                {dashboardData.quotes.filter(q => q.status === 'accepted').length} acceptés
              </Badge>
            </div>
          </div>
          
          <div className="space-y-6">
            {dashboardData.quotes.map((quote) => (
              <Card key={quote.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{quote.project}</h4>
                      <p className="text-sm text-muted-foreground">Client: {quote.client}</p>
                      <p className="text-sm">{quote.details}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Soumis: {new Date(quote.submitted).toLocaleDateString('fr-FR')}</span>
                        <span>Deadline: {new Date(quote.deadline).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {(quote.amount / 1000000).toFixed(0)}M XOF
                      </div>
                      <Badge variant={quote.status === 'pending' ? 'secondary' : 'default'}>
                        {quote.status === 'pending' ? 'En attente' : 'Accepté'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-6">
          <h2 className="text-2xl font-bold">Performance & Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Satisfaction Client</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {dashboardData.performance.clientSatisfaction}%
                  </div>
                  <p className="text-sm text-muted-foreground">Taux de satisfaction</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Projets Complétés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {dashboardData.performance.completedProjects}
                  </div>
                  <p className="text-sm text-muted-foreground">Total réalisations</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ponctualité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {dashboardData.performance.onTimeDelivery}%
                  </div>
                  <p className="text-sm text-muted-foreground">Livraison à temps</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PromoteurDashboard;
