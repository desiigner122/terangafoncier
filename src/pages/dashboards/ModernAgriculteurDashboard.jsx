import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sprout, MapPin, DollarSign, Clock, Tractor, Plus, TrendingUp, 
  FileText, Camera, MessageSquare, Bell, Droplets, Sun, CloudRain,
  Phone, Calendar, Download, Star, AlertCircle, Eye, BarChart3,
  Users, Target, Award, Filter, ChevronRight, Leaf, Wheat,
  Thermometer, Wind, Package, Truck, Factory, PieChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ModernSidebar from '@/components/layout/ModernSidebar';
import { useUser } from '@/hooks/useUser';
import { ROLES } from '@/lib/enhancedRbacConfig';

const ModernAgriculteurDashboard = () => {
  const { user, profile } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalLands: 15,
      activeCrops: 8,
      totalRevenue: 12500000,
      cropYield: 85,
      marketPrice: 2500,
      waterUsage: 75
    },
    farmingProjects: [
      {
        id: 1,
        name: 'Riziculture Kaolack',
        location: 'Kaolack, Sénégal',
        size: '50 hectares',
        crop: 'Riz',
        status: 'En cours',
        progress: 65,
        expectedYield: '150 tonnes',
        image: '/images/rice-field.jpg',
        weather: 'Favorable'
      },
      {
        id: 2,
        name: 'Maraîchage Niayes',
        location: 'Niayes, Dakar',
        size: '25 hectares',
        crop: 'Légumes',
        status: 'Récolte',
        progress: 90,
        expectedYield: '80 tonnes',
        image: '/images/vegetables.jpg',
        weather: 'Sec'
      }
    ],
    weatherData: {
      temperature: 28,
      humidity: 65,
      precipitation: 15,
      windSpeed: 12,
      forecast: 'Partiellement nuageux'
    },
    marketPrices: [
      { crop: 'Riz', price: 450, change: '+5%', trend: 'up' },
      { crop: 'Maïs', price: 380, change: '-2%', trend: 'down' },
      { crop: 'Tomate', price: 850, change: '+8%', trend: 'up' },
      { crop: 'Oignon', price: 720, change: '+3%', trend: 'up' }
    ],
    equipment: [
      { name: 'Tracteur John Deere', status: 'Opérationnel', maintenance: 'Dans 45 jours' },
      { name: 'Système irrigation', status: 'Maintenance', maintenance: 'En cours' },
      { name: 'Moissonneuse', status: 'Opérationnel', maintenance: 'Dans 120 jours' }
    ],
    notifications: [
      { id: 1, type: 'weather', message: 'Risque de pluie dans 3 jours', time: '2h' },
      { id: 2, type: 'market', message: 'Prix du riz en hausse (+5%)', time: '5h' },
      { id: 3, type: 'maintenance', message: 'Maintenance tracteur programmée', time: '1j' }
    ]
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const sidebarItems = [
    { icon: BarChart3, label: 'Tableau de bord', href: '/dashboard', active: true },
    { icon: Sprout, label: 'Mes Cultures', href: '/dashboard/crops' },
    { icon: MapPin, label: 'Mes Terrains', href: '/dashboard/lands' },
    { icon: TrendingUp, label: 'Marché', href: '/dashboard/market' },
    { icon: Droplets, label: 'Irrigation', href: '/dashboard/irrigation' },
    { icon: Tractor, label: 'Équipements', href: '/dashboard/equipment' },
    { icon: FileText, label: 'Rapports', href: '/dashboard/reports' },
    { icon: Phone, label: 'Support', href: '/dashboard/support' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 rounded-full animate-spin border-t-green-600"></div>
            <Sprout className="absolute inset-0 m-auto w-6 h-6 text-green-600" />
          </div>
          <p className="text-lg font-medium text-green-800">Chargement de votre exploitation...</p>
        </motion.div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend === 'up' ? '+' : '-'}
          </div>
        )}
      </div>
    </motion.div>
  );

  const ProjectCard = ({ project }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Sprout className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-500">{project.location}</p>
          </div>
        </div>
        <Badge variant={project.status === 'En cours' ? 'default' : 'secondary'}>
          {project.status}
        </Badge>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Surface: {project.size}</span>
          <span className="text-gray-600">Culture: {project.crop}</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progression</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-gray-600">Rendement prévu: {project.expectedYield}</span>
          <div className="flex items-center space-x-1">
            <Sun className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-gray-500">{project.weather}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          icon={MapPin}
          title="Terrains Totaux"
          value={dashboardData.stats.totalLands}
          subtitle="hectares en exploitation"
          color="bg-green-600"
        />
        <StatCard
          icon={Sprout}
          title="Cultures Actives"
          value={dashboardData.stats.activeCrops}
          subtitle="projets en cours"
          color="bg-emerald-600"
        />
        <StatCard
          icon={DollarSign}
          title="Revenus"
          value={`${(dashboardData.stats.totalRevenue / 1000000).toFixed(1)}M`}
          subtitle="FCFA cette saison"
          color="bg-yellow-600"
          trend="up"
        />
        <StatCard
          icon={TrendingUp}
          title="Rendement"
          value={`${dashboardData.stats.cropYield}%`}
          subtitle="de l'objectif"
          color="bg-blue-600"
          trend="up"
        />
        <StatCard
          icon={Package}
          title="Prix Marché"
          value={`${dashboardData.stats.marketPrice}`}
          subtitle="FCFA/kg (moyenne)"
          color="bg-purple-600"
        />
        <StatCard
          icon={Droplets}
          title="Eau Utilisée"
          value={`${dashboardData.stats.waterUsage}%`}
          subtitle="de la capacité"
          color="bg-cyan-600"
        />
      </div>

      {/* Weather Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sun className="w-5 h-5 text-yellow-500" />
              <span>Météo Actuelle</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {dashboardData.weatherData.temperature}°C
                </div>
                <p className="text-gray-600">{dashboardData.weatherData.forecast}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>{dashboardData.weatherData.humidity}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span>{dashboardData.weatherData.windSpeed} km/h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CloudRain className="w-4 h-4 text-blue-600" />
                  <span>{dashboardData.weatherData.precipitation}mm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  <span>Humidité: {dashboardData.weatherData.humidity}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Prices */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span>Prix du Marché</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.marketPrices.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Wheat className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="font-medium">{item.crop}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="font-bold">{item.price} FCFA/kg</span>
                    <Badge variant={item.trend === 'up' ? 'default' : 'destructive'}>
                      {item.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-green-500" />
            <span>Projets Agricoles Actifs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dashboardData.farmingProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Helmet>
        <title>Dashboard Agriculteur - Teranga Foncier</title>
        <meta name="description" content="Gérez votre exploitation agricole avec Teranga Foncier" />
      </Helmet>

      <ModernSidebar 
        sidebarItems={sidebarItems} 
        currentPage="agriculteur-dashboard" 
      />

      <motion.div 
        className="flex-1 ml-64 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Agriculteur
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez et optimisez votre exploitation agricole
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Rapport</span>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Nouveau Projet</span>
            </Button>
          </div>
        </div>

        {/* Notifications */}
        {dashboardData.notifications.length > 0 && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-3">
                <Bell className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-800">Notifications importantes</span>
              </div>
              <div className="space-y-2">
                {dashboardData.notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm text-gray-700">{notification.message}</span>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="equipment">Équipements</TabsTrigger>
            <TabsTrigger value="market">Marché</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Projets Agricoles</CardTitle>
                <CardDescription>
                  Suivez et gérez tous vos projets agricoles en cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {dashboardData.farmingProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipment">
            <Card>
              <CardHeader>
                <CardTitle>Équipements Agricoles</CardTitle>
                <CardDescription>
                  Gérez et maintenez vos équipements agricoles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.equipment.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Tractor className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.maintenance}</p>
                        </div>
                      </div>
                      <Badge variant={item.status === 'Opérationnel' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="market">
            <Card>
              <CardHeader>
                <CardTitle>Analyse du Marché</CardTitle>
                <CardDescription>
                  Suivez les tendances et prix du marché agricole
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.marketPrices.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Wheat className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">{item.crop}</p>
                          <p className="text-sm text-gray-500">Prix actuel</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{item.price} FCFA/kg</p>
                        <Badge variant={item.trend === 'up' ? 'default' : 'destructive'}>
                          {item.change}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Rapports et Analytics</CardTitle>
                <CardDescription>
                  Analysez les performances de votre exploitation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
                    <h3 className="text-lg font-semibold mb-2">Rendement Total</h3>
                    <p className="text-3xl font-bold">{dashboardData.stats.cropYield}%</p>
                    <p className="text-green-100">de l'objectif annuel</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg text-white">
                    <h3 className="text-lg font-semibold mb-2">Revenus</h3>
                    <p className="text-3xl font-bold">{(dashboardData.stats.totalRevenue / 1000000).toFixed(1)}M</p>
                    <p className="text-blue-100">FCFA cette saison</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ModernAgriculteurDashboard;
