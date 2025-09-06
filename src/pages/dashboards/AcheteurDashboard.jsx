import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2, 
  Plus, 
  Heart, 
  Search, 
  FileText, 
  Camera, 
  MessageSquare,
  Bell,
  TrendingUp,
  Shield,
  Globe,
  Phone,
  Calendar,
  Download,
  Star,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { ROLES } from '@/lib/enhancedRbacConfig';

const AcheteurDashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const isDiaspora = user?.role === ROLES.PARTICULIER_DIASPORA;
  
  const [dashboardData, setDashboardData] = useState({
    myRequests: [],
    favorites: [],
    constructionProjects: [],
    recentActivities: [],
    marketTrends: [],
    notifications: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    // Simulation des données
    setTimeout(() => {
      setDashboardData({
        myRequests: [
          { id: 1, type: 'terrain_search', location: 'Almadies, Dakar', status: 'active', responses: 3, created: '2024-06-01' },
          { id: 2, type: 'financement', amount: 25000000, status: 'pending', bank: 'CBAO', created: '2024-06-03' },
          { id: 3, type: 'construction', location: 'Saly', status: 'quotes_received', quotes: 5, created: '2024-05-28' }
        ],
        favorites: [
          { id: 'T001', title: 'Terrain Almadies 500m²', price: 45000000, location: 'Almadies', image: '/api/placeholder/300/200', saved: '2024-06-02' },
          { id: 'T002', title: 'Parcelle Saly 800m²', price: 32000000, location: 'Saly', image: '/api/placeholder/300/200', saved: '2024-06-01' }
        ],
        constructionProjects: isDiaspora ? [
          { id: 'P001', name: 'Maison Familiale Saly', progress: 65, nextUpdate: '2024-06-10', contractor: 'BTP Sénégal', phase: 'Gros œuvre' },
          { id: 'P002', name: 'Villa Almadies', progress: 30, nextUpdate: '2024-06-12', contractor: 'Construct Pro', phase: 'Fondations' }
        ] : [],
        recentActivities: [
          { id: 1, type: 'new_response', message: 'Nouvelle réponse à votre demande Almadies', time: '2h', icon: MessageSquare },
          { id: 2, type: 'price_alert', message: 'Baisse de prix sur terrain favori Saly', time: '1j', icon: TrendingUp },
          { id: 3, type: 'document_ready', message: 'Documents notariaux prêts', time: '2j', icon: FileText }
        ],
        notifications: [
          { id: 1, title: 'Nouveau terrain correspondant', message: 'Un terrain à Almadies correspond à vos critères', type: 'info', time: '1h' },
          { id: 2, title: 'Financement approuvé', message: 'Votre demande CBAO a été approuvée', type: 'success', time: '3h' },
          { id: 3, title: 'Rendez-vous géomètre', message: 'Confirmer RDV pour mesures terrain Saly', type: 'warning', time: '1j' }
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

  const ProjectCard = ({ project }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription>Phase: {project.phase}</CardDescription>
          </div>
          <Badge variant="secondary">{project.progress}%</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Entrepreneur: {project.contractor}</span>
            <span>Prochaine MAJ: {project.nextUpdate}</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Photos
            </Button>
            <Button size="sm" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
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
      {/* En-tête avec salutation personnalisée */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour {user?.full_name || 'Cher client'} 👋
          </h1>
          <p className="text-muted-foreground">
            {isDiaspora ? 
              "Gérez vos investissements au Sénégal depuis l'étranger" :
              "Trouvez et achetez votre terrain idéal au Sénégal"
            }
          </p>
          <div className="flex items-center mt-2 space-x-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {isDiaspora ? 'Diaspora' : 'Sénégal'}
            </Badge>
            {isDiaspora && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Suivi Temps Réel
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/parcelles">
              <Search className="w-4 h-4 mr-2" />
              Chercher Terrain
            </Link>
          </Button>
          {isDiaspora && (
            <Button variant="outline" asChild>
              <Link to="/construction/appel-offres">
                <Building2 className="w-4 h-4 mr-2" />
                Appel d'Offres
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Onglets principaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="requests">Mes Demandes</TabsTrigger>
          <TabsTrigger value="construction">Construction</TabsTrigger>
          <TabsTrigger value="market">Marché</TabsTrigger>
        </TabsList>

        {/* Aperçu général */}
        <TabsContent value="overview" className="space-y-6">
          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction
              title="Chercher un Terrain"
              description="Parcourez notre catalogue de 15,000+ terrains"
              icon={Search}
              color="bg-blue-600"
              action="Parcourir"
              link="/parcelles"
            />
            <QuickAction
              title="Publier une Demande"
              description="Décrivez votre terrain idéal, les vendeurs vous contacteront"
              icon={Plus}
              color="bg-green-600"
              action="Publier"
              link="/demandes/nouvelle"
            />
            <QuickAction
              title="Financement Terrain"
              description="Obtenez un crédit pour votre achat immobilier"
              icon={DollarSign}
              color="bg-purple-600"
              action="Demander"
              link="/financement/demande"
            />
            <QuickAction
              title="Terrain Communal"
              description="Faites une demande d'attribution de terrain communal"
              icon={FileText}
              color="bg-orange-600"
              action="Demander"
              link="/terrains-communaux/demande"
            />
          </div>

          {/* Statistiques personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Demandes Actives</p>
                    <p className="text-2xl font-bold">{dashboardData.myRequests.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Favoris</p>
                    <p className="text-2xl font-bold">{dashboardData.favorites.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            {isDiaspora && (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Projets Construction</p>
                        <p className="text-2xl font-bold">{dashboardData.constructionProjects.length}</p>
                      </div>
                      <Building2 className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Suivi Temps Réel</p>
                        <p className="text-2xl font-bold">24/7</p>
                      </div>
                      <Camera className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Activités récentes et notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Activités Récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <activity.icon className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">Il y a {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.notifications.map((notif) => (
                    <div key={notif.id} className={`p-3 rounded-lg border-l-4 ${
                      notif.type === 'success' ? 'bg-green-50 border-green-400' :
                      notif.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-blue-50 border-blue-400'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mes demandes */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mes Demandes</h2>
            <Button asChild>
              <Link to="/demandes/nouvelle">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Demande
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {dashboardData.myRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          request.status === 'active' ? 'default' :
                          request.status === 'pending' ? 'secondary' :
                          'outline'
                        }>
                          {request.status === 'active' ? 'Actif' :
                           request.status === 'pending' ? 'En attente' :
                           'Devis reçus'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {request.type === 'terrain_search' ? 'Recherche terrain' :
                           request.type === 'financement' ? 'Demande financement' :
                           'Appel d\'offres construction'}
                        </span>
                      </div>
                      <h3 className="font-semibold">
                        {request.location && `Location: ${request.location}`}
                        {request.amount && `Montant: ${(request.amount / 1000000).toFixed(1)}M XOF`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Créé le {new Date(request.created).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      {request.responses && (
                        <p className="text-sm text-green-600 font-medium">
                          {request.responses} réponse(s)
                        </p>
                      )}
                      {request.quotes && (
                        <p className="text-sm text-blue-600 font-medium">
                          {request.quotes} devis reçu(s)
                        </p>
                      )}
                      <Button size="sm" className="mt-2">Voir Détails</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Construction (pour diaspora) */}
        <TabsContent value="construction" className="space-y-6">
          {isDiaspora ? (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Projets de Construction</h2>
                <Button asChild>
                  <Link to="/construction/appel-offres">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau Projet
                  </Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData.constructionProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Construction à Distance</h3>
                <p className="text-muted-foreground mb-6">
                  Cette fonctionnalité est spécialement conçue pour nos clients de la diaspora
                </p>
                <Button asChild>
                  <Link to="/construction/info">En Savoir Plus</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Marché */}
        <TabsContent value="market" className="space-y-6">
          <h2 className="text-2xl font-bold">Tendances du Marché</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prix Moyen Dakar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">85,000 XOF/m²</div>
                <p className="text-sm text-green-600">↗ +12% ce mois</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nouveaux Terrains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">142</div>
                <p className="text-sm text-blue-600">Cette semaine</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Zones Populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Almadies</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Saly</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Thiès</span>
                    <span className="text-sm font-medium">23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcheteurDashboard;
