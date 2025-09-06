import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Eye, 
  Plus, 
  TrendingUp, 
  MessageSquare,
  Star,
  Calendar,
  Users,
  FileText,
  Camera,
  Edit,
  Share,
  BarChart3,
  Clock,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { ROLES } from '@/lib/enhancedRbacConfig';

const VendeurDashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const isProfessional = user?.role === ROLES.VENDEUR_PROFESSIONNEL;
  
  const [dashboardData, setDashboardData] = useState({
    listings: [],
    inquiries: [],
    analytics: {},
    recentActivities: [],
    marketTrends: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    setLoading(true);
    // Simulation des données
    setTimeout(() => {
      setDashboardData({
        listings: [
          { 
            id: 'L001', 
            title: 'Terrain Almadies 500m²', 
            price: 45000000, 
            location: 'Almadies, Dakar',
            status: 'active',
            views: 324,
            inquiries: 12,
            published: '2024-05-15',
            type: 'sale',
            features: ['Viabilisé', 'Titre foncier', 'Vue mer']
          },
          { 
            id: 'L002', 
            title: 'Parcelle Saly 800m²', 
            price: 32000000, 
            location: 'Saly, Mbour',
            status: 'negotiating',
            views: 156,
            inquiries: 8,
            published: '2024-06-01',
            type: 'installment',
            features: ['Proche plage', 'Zone touristique']
          },
          { 
            id: 'L003', 
            title: 'Terrain Thiès 1200m²', 
            price: 18000000, 
            location: 'Thiès',
            status: 'sold',
            views: 89,
            inquiries: 5,
            published: '2024-04-20',
            type: 'sale',
            features: ['Grande superficie', 'Accès facile']
          }
        ],
        inquiries: [
          { 
            id: 'I001', 
            listing: 'Terrain Almadies 500m²',
            buyer: 'Amadou Diallo',
            type: 'visit_request',
            message: 'Interested in visiting this property next week.',
            status: 'pending',
            created: '2024-06-05T10:30:00',
            contact: '+221 77 123 45 67'
          },
          { 
            id: 'I002', 
            listing: 'Parcelle Saly 800m²',
            buyer: 'Fatou Seck',
            type: 'price_negotiation',
            message: 'Could you consider 28M for immediate purchase?',
            status: 'responded',
            created: '2024-06-04T14:15:00',
            contact: 'fatou.seck@email.com'
          },
          { 
            id: 'I003', 
            listing: 'Terrain Almadies 500m²',
            buyer: 'Jean Baptiste',
            type: 'financing_inquiry',
            message: 'Do you offer payment plans?',
            status: 'pending',
            created: '2024-06-03T16:45:00',
            contact: '+33 6 12 34 56 78'
          }
        ],
        analytics: {
          totalViews: 569,
          totalInquiries: 25,
          conversionRate: 4.4,
          avgTimeOnListing: '3:45',
          topPerformingListing: 'Terrain Almadies 500m²'
        },
        recentActivities: [
          { id: 1, type: 'new_inquiry', message: 'Nouvelle demande pour Terrain Almadies', time: '2h', listing: 'L001' },
          { id: 2, type: 'listing_view', message: '15 nouvelles vues sur Parcelle Saly', time: '4h', listing: 'L002' },
          { id: 3, type: 'price_alert', message: 'Terrain similaire vendu 47M à Almadies', time: '1j', category: 'market' }
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

  const ListingCard = ({ listing }) => (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{listing.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {listing.location}
            </CardDescription>
          </div>
          <Badge variant={
            listing.status === 'active' ? 'default' :
            listing.status === 'negotiating' ? 'secondary' :
            listing.status === 'sold' ? 'outline' : 'destructive'
          }>
            {listing.status === 'active' ? 'Actif' :
             listing.status === 'negotiating' ? 'Négociation' :
             listing.status === 'sold' ? 'Vendu' : 'Suspendu'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-green-600">
              {(listing.price / 1000000).toFixed(1)}M XOF
            </div>
            <div className="flex gap-1">
              {listing.features.slice(0, 2).map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>{listing.views} vues</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-green-600" />
              <span>{listing.inquiries} demandes</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <BarChart3 className="w-4 h-4 mr-2" />
              Stats
            </Button>
            <Button size="sm" className="flex-1">
              <Share className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const InquiryCard = ({ inquiry }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold">{inquiry.buyer}</h4>
            <p className="text-sm text-muted-foreground">{inquiry.listing}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={
              inquiry.type === 'visit_request' ? 'default' :
              inquiry.type === 'price_negotiation' ? 'secondary' :
              'outline'
            }>
              {inquiry.type === 'visit_request' ? 'Visite' :
               inquiry.type === 'price_negotiation' ? 'Négociation' :
               'Financement'}
            </Badge>
            <Badge variant={inquiry.status === 'pending' ? 'destructive' : 'default'}>
              {inquiry.status === 'pending' ? 'En attente' : 'Répondu'}
            </Badge>
          </div>
        </div>
        
        <p className="text-sm mb-4 p-3 bg-gray-50 rounded">{inquiry.message}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {new Date(inquiry.created).toLocaleDateString('fr-FR')} • {inquiry.contact}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Phone className="w-4 h-4 mr-2" />
              Appeler
            </Button>
            <Button size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Répondre
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
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Espace Vendeur {isProfessional ? 'Pro' : ''} 🏪
          </h1>
          <p className="text-muted-foreground">
            {isProfessional ? 
              "Gérez votre portefeuille professionnel de terrains" :
              "Vendez vos terrains facilement et en sécurité"
            }
          </p>
          <div className="flex items-center mt-2 space-x-4">
            <Badge variant="secondary">
              {isProfessional ? 'Vendeur Professionnel' : 'Vendeur Particulier'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Compte Vérifié
            </Badge>
          </div>
        </div>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/vendre/nouvelle-annonce">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Annonce
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/vendre/demandes-acheteurs">
              <Users className="w-4 h-4 mr-2" />
              Demandes Acheteurs
            </Link>
          </Button>
        </div>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="listings">Mes Annonces</TabsTrigger>
          <TabsTrigger value="inquiries">Demandes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Aperçu */}
        <TabsContent value="overview" className="space-y-6">
          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <QuickAction
              title="Publier un Terrain"
              description="Créez une nouvelle annonce pour vendre votre terrain"
              icon={Plus}
              color="bg-green-600"
              action="Publier"
              link="/vendre/nouvelle-annonce"
            />
            <QuickAction
              title="Voir Demandes Acheteurs"
              description="Répondez aux demandes d'acheteurs cherchant un terrain"
              icon={Users}
              color="bg-blue-600"
              action="Parcourir"
              link="/vendre/demandes-acheteurs"
            />
            {isProfessional && (
              <>
                <QuickAction
                  title="Paiements Échelonnés"
                  description="Proposez des facilités de paiement à vos clients"
                  icon={Calendar}
                  color="bg-purple-600"
                  action="Configurer"
                  link="/vendre/paiements-echelonnes"
                />
                <QuickAction
                  title="Portfolio Professionnel"
                  description="Gérez votre portefeuille de terrains en lot"
                  icon={Building2}
                  color="bg-orange-600"
                  action="Gérer"
                  link="/vendre/portfolio"
                />
              </>
            )}
          </div>

          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Annonces Actives</p>
                    <p className="text-2xl font-bold">
                      {dashboardData.listings.filter(l => l.status === 'active').length}
                    </p>
                  </div>
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Vues Totales</p>
                    <p className="text-2xl font-bold">{dashboardData.analytics.totalViews}</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Demandes</p>
                    <p className="text-2xl font-bold">{dashboardData.analytics.totalInquiries}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taux Conversion</p>
                    <p className="text-2xl font-bold">{dashboardData.analytics.conversionRate}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activités récentes */}
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
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">Il y a {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mes annonces */}
        <TabsContent value="listings" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Mes Annonces</h2>
            <Button asChild>
              <Link to="/vendre/nouvelle-annonce">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Annonce
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </TabsContent>

        {/* Demandes */}
        <TabsContent value="inquiries" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Demandes Reçues</h2>
            <div className="flex gap-2">
              <Badge variant="destructive">
                {dashboardData.inquiries.filter(i => i.status === 'pending').length} en attente
              </Badge>
              <Badge variant="default">
                {dashboardData.inquiries.filter(i => i.status === 'responded').length} traitées
              </Badge>
            </div>
          </div>
          
          <div className="space-y-6">
            {dashboardData.inquiries.map((inquiry) => (
              <InquiryCard key={inquiry.id} inquiry={inquiry} />
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics & Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Générale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Temps moyen sur annonce</span>
                    <span className="font-medium">{dashboardData.analytics.avgTimeOnListing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Taux de conversion</span>
                    <span className="font-medium text-green-600">{dashboardData.analytics.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Annonce top</span>
                    <span className="font-medium text-blue-600 text-xs">{dashboardData.analytics.topPerformingListing}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tendances Prix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+15%</div>
                  <p className="text-sm text-muted-foreground">Prix moyen vs marché</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>• Ajoutez plus de photos</p>
                  <p>• Mettez à jour la description</p>
                  <p>• Répondez plus rapidement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurDashboard;
