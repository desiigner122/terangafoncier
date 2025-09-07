
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  MessageSquare, 
  BarChart2, 
  Bell, 
  User, 
  PlusCircle, 
  Eye, 
  Edit, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Activity, 
  Target, 
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthProvider';
import { sampleRequests, sampleUsers, sampleParcels } from '@/data';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const VendeurDashboardPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [listings, setListings] = useState([]);

    // Données analytiques avancées pour le vendeur
    const [salesAnalytics, setSalesAnalytics] = useState({
        totalRevenue: 2450000,
        monthlyRevenue: 350000,
        conversionRate: 23.5,
        averageTimeToSale: 45,
        totalViews: 1247,
        inquiriesThisMonth: 18,
        activeBuyers: 12,
        completedSales: 3,
        performanceScore: 87,
        salesTarget: 500000,
        salesProgress: 70,
        topPerformingListing: "Villa Moderne Almadies"
    });

    // Données graphiques pour les analytics
    const [chartData, setChartData] = useState({
        salesTrend: [
          { month: 'Jan', ventes: 150000, demandes: 8 },
          { month: 'Fév', ventes: 200000, demandes: 12 },
          { month: 'Mar', ventes: 180000, demandes: 10 },
          { month: 'Avr', ventes: 350000, demandes: 18 },
          { month: 'Mai', ventes: 280000, demandes: 15 },
          { month: 'Juin', ventes: 420000, demandes: 22 }
        ],
        listingPerformance: [
          { name: 'Vues', value: 456, color: '#8884d8' },
          { name: 'Demandes', value: 78, color: '#82ca9d' },
          { name: 'Visites', value: 23, color: '#ffc658' },
          { name: 'Offres', value: 12, color: '#ff7300' }
        ],
        revenueDistribution: [
          { type: 'Résidentiel', revenue: 1200000, percentage: 49 },
          { type: 'Commercial', revenue: 800000, percentage: 33 },
          { type: 'Terrain', revenue: 450000, percentage: 18 }
        ]
    });

    // Timeline des activités récentes
    const [recentActivities, setRecentActivities] = useState([
        {
            id: 1,
            type: 'sale',
            title: 'Vente finalisée',
            description: 'Villa Moderne Almadies vendue à 180M FCFA',
            time: 'Il y a 2 heures',
            status: 'success'
        },
        {
            id: 2,
            type: 'inquiry',
            title: 'Nouvelle demande',
            description: 'Demande d\'information pour Terrain Yoff',
            time: 'Il y a 4 heures',
            status: 'pending'
        },
        {
            id: 3,
            type: 'view',
            title: 'Pic de vues',
            description: 'Appartement Plateau: +45 vues aujourd\'hui',
            time: 'Il y a 6 heures',
            status: 'info'
        },
        {
            id: 4,
            type: 'offer',
            title: 'Offre reçue',
            description: 'Offre de 75M FCFA pour Bureau Dakar Centre',
            time: 'Hier',
            status: 'warning'
        }
    ]);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'sale': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'inquiry': return <MessageSquare className="h-4 w-4 text-blue-500" />;
            case 'view': return <Eye className="h-4 w-4 text-purple-500" />;
            case 'offer': return <DollarSign className="h-4 w-4 text-yellow-500" />;
            default: return <Activity className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'success': return <Badge className="bg-green-100 text-green-800">Finalisé</Badge>;
            case 'pending': return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
            case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">À traiter</Badge>;
            case 'info': return <Badge variant="secondary">Info</Badge>;
            default: return <Badge variant="outline">Normal</Badge>;
        }
    };

    useEffect(() => {
        if (!user) return;
        const timer = setTimeout(() => {
            const sellerParcels = sampleParcels.filter(p => p.seller_id === user.id);
            const sellerRequests = sampleRequests.filter(req => sellerParcels.some(p => p.id === req.parcel_id));
            setRequests(sellerRequests);
            setListings(sellerParcels);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [user]);

    const handleRequestAction = (requestId, action) => {
        const actionText = action === 'approve' ? 'approuvée' : 'rejetée';
        const newStatus = action === 'approve' ? 'En attente de paiement' : 'Rejetée';

        setRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            )
        );

        window.safeGlobalToast({
            title: `Demande ${actionText}`,
            description: `La demande ${requestId} a été ${actionText}. L'acheteur a été notifié.`,
        });
    };
    
    const handleListingAction = (listingId, action) => {
        window.safeGlobalToast({
            title: `Action sur l'annonce ${listingId}`,
            description: `L'action "${action}" a été simulée.`,
        });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <LoadingSpinner size="xl" />
            </div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 p-4 md:p-6 lg:p-8"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center">
                        <User className="h-8 w-8 mr-3 text-accent_brand"/>
                        Tableau de Bord Vendeur
                    </h1>
                    <p className="text-muted-foreground">Gérez vos biens, vos demandes et vos ventes.</p>
                </div>
                <Button asChild>
                    <Link to="/add-parcel"><PlusCircle className="mr-2 h-4 w-4"/>Ajouter un nouveau bien</Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-green-700">Revenus Totaux</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-800">
                                {(salesAnalytics.totalRevenue / 1000000).toFixed(1)}M FCFA
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                                <Badge variant="secondary" className="bg-green-200 text-green-800">
                                    +{((salesAnalytics.monthlyRevenue / salesAnalytics.totalRevenue) * 100).toFixed(1)}% ce mois
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-blue-700">Taux de Conversion</CardTitle>
                            <Target className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-800">{salesAnalytics.conversionRate}%</div>
                            <div className="flex items-center space-x-2 mt-1">
                                <TrendingUp className="h-3 w-3 text-blue-600" />
                                <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                                    +2.3% vs mois dernier
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-purple-700">Biens Actifs</CardTitle>
                            <Home className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-800">
                                {listings.filter(l => l.status === 'Disponible').length}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                                <Eye className="h-3 w-3 text-purple-600" />
                                <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                                    {salesAnalytics.totalViews} vues totales
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                    <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-orange-700">Performance</CardTitle>
                            <Zap className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-800">{salesAnalytics.performanceScore}%</div>
                            <div className="flex items-center space-x-2 mt-1">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${salesAnalytics.performanceScore}%` }}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            
            {/* Objectifs et Progrès */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center">
                                    <BarChart2 className="mr-2 h-5 w-5"/>
                                    Analytics de Vente
                                </CardTitle>
                                <CardDescription>Évolution de vos revenus et demandes sur les 6 derniers mois</CardDescription>
                            </div>
                            <Badge variant="secondary">Temps réel</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData.salesTrend}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value, name) => [
                                            name === 'ventes' ? `${(value / 1000).toFixed(0)}K FCFA` : value,
                                            name === 'ventes' ? 'Revenus' : 'Demandes'
                                        ]}
                                    />
                                    <Area type="monotone" dataKey="ventes" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                    <Area type="monotone" dataKey="demandes" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Target className="mr-2 h-5 w-5"/>
                            Objectifs Mensuels
                        </CardTitle>
                        <CardDescription>Progression vers vos objectifs de vente</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Revenus</span>
                                <span className="text-sm text-muted-foreground">
                                    {(salesAnalytics.monthlyRevenue / 1000).toFixed(0)}K / {(salesAnalytics.salesTarget / 1000).toFixed(0)}K FCFA
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${salesAnalytics.salesProgress}%` }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{salesAnalytics.salesProgress}% de l'objectif atteint</p>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Temps moyen de vente</span>
                                <Badge className="bg-blue-100 text-blue-800">{salesAnalytics.averageTimeToSale} jours</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Acheteurs actifs</span>
                                <Badge className="bg-green-100 text-green-800">{salesAnalytics.activeBuyers}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Top listing</span>
                                <Badge variant="secondary" className="max-w-[120px] truncate">
                                    {salesAnalytics.topPerformingListing}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance des Annonces et Timeline */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Eye className="mr-2 h-5 w-5"/>
                            Performance Annonces
                        </CardTitle>
                        <CardDescription>Répartition de l'engagement sur vos listings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.listingPerformance}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                                    >
                                        {chartData.listingPerformance.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Activity className="mr-2 h-5 w-5"/>
                            Timeline d'Activité
                        </CardTitle>
                        <CardDescription>Vos dernières actions et événements importants</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentActivities.map(activity => (
                                <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/30">
                                    {getActivityIcon(activity.type)}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">{activity.title}</p>
                                            {getStatusBadge(activity.status)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Home className="mr-2 h-5 w-5"/>
                            Mes Annonces
                        </CardTitle>
                        <CardDescription>Aperçu rapide de vos biens en vente avec métriques.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {listings.slice(0, 4).map(listing => (
                                <li key={listing.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-semibold text-sm">{listing.name}</p>
                                            <Badge variant="outline" className="text-xs">
                                                {Math.floor(Math.random() * 50) + 10} vues
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{listing.zone} - {listing.area_sqm} m²</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <Badge className="bg-green-100 text-green-800 text-xs">
                                                {(listing.price / 1000000).toFixed(0)}M FCFA
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {Math.floor(Math.random() * 5) + 1} demandes
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 ml-3">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleListingAction(listing.id, 'edit')}>
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                            <Link to={`/parcelles/${listing.id}`}>
                                                <Eye className="h-4 w-4"/>
                                            </Link>
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link to="/my-listings">
                                <BarChart2 className="mr-2 h-4 w-4"/>
                                Analytics détaillées de mes annonces
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <MessageSquare className="mr-2 h-5 w-5"/>
                            Demandes Récentes des Acheteurs
                        </CardTitle>
                        <CardDescription>Gérez les demandes pour vos biens avec suivi des performances.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {requests.length > 0 ? requests.slice(0, 3).map(req => {
                                const acheteur = sampleUsers.find(u => u.id === req.user_id);
                                const bien = listings.find(l => l.id === req.parcel_id);
                                return (
                                    <div key={req.id} className="flex items-start justify-between p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold text-sm">{acheteur?.name || 'Inconnu'}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {new Date().toLocaleDateString()}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">{bien?.name || 'N/A'}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                                    {(bien?.price / 1000000).toFixed(0)}M FCFA
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    Intérêt: {Math.floor(Math.random() * 100)}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            {req.status === 'Nouvelle' ? (
                                                <div className="flex flex-col gap-1">
                                                    <Button size="xs" onClick={() => handleRequestAction(req.id, 'approve')}>
                                                        <CheckCircle className="h-3 w-3 mr-1"/>
                                                        Approuver
                                                    </Button>
                                                    <Button size="xs" variant="destructive" onClick={() => handleRequestAction(req.id, 'reject')}>
                                                        <AlertCircle className="h-3 w-3 mr-1"/>
                                                        Rejeter
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Badge variant={req.status === 'En attente de paiement' ? 'default' : 'secondary'}>
                                                    {req.status}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="p-6 text-center text-muted-foreground">
                                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>Aucune demande pour le moment.</p>
                                    <p className="text-xs mt-1">Les nouvelles demandes apparaîtront ici.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link to="/my-requests">
                                <Users className="mr-2 h-4 w-4"/>
                                Gérer toutes les demandes ({requests.length})
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </motion.div>
    );
};

export default VendeurDashboardPage;



