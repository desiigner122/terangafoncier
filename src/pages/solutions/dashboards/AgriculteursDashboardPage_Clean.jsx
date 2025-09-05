import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { 
  Leaf, 
  MapPin, 
  Thermometer, 
  Droplets, 
  BarChart, 
  CalendarDays, 
  PlusCircle, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Filter, 
  Maximize, 
  Sprout, 
  Cloudy, 
  BookOpen, 
  Download, 
  ArrowRightLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AgriculteursDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('parcelles');
  const [parcelles, setParcelles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalParcelles: 0,
    parcellesActives: 0,
    rendementMoyen: 0,
    revenuMensuel: 0
  });

  useEffect(() => {
    loadParcelles();
  }, []);

  const loadParcelles = async () => {
    try {
      setLoading(true);
      
      // Récupérer les parcelles agricoles
      let { data: parcellesData, error: parcelsError } = await supabase
        .from('parcels')
        .select('*')
        .eq('zone_type', 'agricultural')
        .order('created_at', { ascending: false });

      if (parcelsError && parcelsError.code !== 'PGRST116') {
        console.error('Erreur lors du chargement des parcelles:', parcelsError);
        // Si pas de parcelles agricoles, récupérer toutes les parcelles
        const { data: allParcels, error: allError } = await supabase
          .from('parcels')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (allError) {
          console.error('Erreur lors du chargement de toutes les parcelles:', allError);
          return;
        }
        parcellesData = allParcels;
      }

      setParcelles(parcellesData || []);
      
      // Calculer les statistiques
      if (parcellesData && parcellesData.length > 0) {
        const totalParcelles = parcellesData.length;
        const parcellesActives = parcellesData.filter(p => p.status === 'active').length;
        const rendementMoyen = parcellesData.reduce((acc, p) => acc + (p.surface || 0), 0) / totalParcelles;
        const revenuMensuel = parcellesData.reduce((acc, p) => acc + (p.price || 0), 0) * 0.1;
        
        setStats({
          totalParcelles,
          parcellesActives,
          rendementMoyen: Math.round(rendementMoyen),
          revenuMensuel: Math.round(revenuMensuel)
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockSensorData = [
    { id: 1, type: 'Température', value: '24°C', status: 'normal', location: 'Zone A' },
    { id: 2, type: 'Humidité', value: '68%', status: 'optimal', location: 'Zone B' },
    { id: 3, type: 'pH du sol', value: '6.8', status: 'normal', location: 'Zone C' },
    { id: 4, type: 'Nutriments', value: 'Élevé', status: 'excellent', location: 'Zone D' }
  ];

  const mockCrops = [
    { id: 1, name: 'Tomates', surface: '2.5 ha', status: 'Croissance', progress: 75, nextAction: 'Arrosage dans 2 jours' },
    { id: 2, name: 'Maïs', surface: '5.0 ha', status: 'Floraison', progress: 60, nextAction: 'Fertilisation recommandée' },
    { id: 3, name: 'Riz', surface: '3.2 ha', status: 'Maturation', progress: 90, nextAction: 'Récolte dans 1 semaine' },
    { id: 4, name: 'Arachides', surface: '1.8 ha', status: 'Semis', progress: 25, nextAction: 'Surveillance croissance' }
  ];

  const tabs = [
    { id: 'parcelles', label: 'Mes Parcelles', icon: MapPin },
    { id: 'capteurs', label: 'Capteurs IoT', icon: Thermometer },
    { id: 'cultures', label: 'Suivi Cultures', icon: Sprout },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'formation', label: 'Formation', icon: BookOpen }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'optimal': return 'bg-blue-100 text-blue-800';
      case 'normal': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'parcelles':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Mes Parcelles Agricoles</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="w-4 h-4 mr-2" />
                Ajouter Parcelle
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement des parcelles...</p>
                </div>
              ) : parcelles.length > 0 ? (
                parcelles.slice(0, 6).map((parcelle) => (
                  <Card key={parcelle.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="truncate">{parcelle.title || `Parcelle ${parcelle.id}`}</span>
                      </CardTitle>
                      <CardDescription>
                        {parcelle.location || 'Localisation non définie'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Surface:</span>
                          <span className="font-medium">{parcelle.surface || 'N/A'} m²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Prix:</span>
                          <span className="font-medium text-green-600">
                            {parcelle.price ? `${parcelle.price.toLocaleString()} FCFA` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Statut:</span>
                          <Badge variant={parcelle.status === 'active' ? 'default' : 'secondary'}>
                            {parcelle.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          <ArrowRightLeft className="w-4 h-4 mr-2" />
                          Gérer Parcelle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune parcelle agricole</h3>
                  <p className="text-gray-600 mb-6">Commencez par ajouter votre première parcelle agricole</p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Ajouter ma première parcelle
                  </Button>
                </div>
              )}
            </div>
          </div>
        );

      case 'capteurs':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Capteurs IoT</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <PlusCircle className="w-4 h-4 mr-2" />
                Installer Capteur
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockSensorData.map((sensor) => (
                <Card key={sensor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{sensor.type}</span>
                      <Thermometer className="w-5 h-5 text-blue-600" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-3xl font-bold text-blue-600">{sensor.value}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{sensor.location}</span>
                        <Badge className={getStatusColor(sensor.status)}>
                          {sensor.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Connecté
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="w-5 h-5" />
                  <span>Données en Temps Réel</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Graphique des données capteurs</p>
                    <p className="text-sm text-gray-500">Visualisation en temps réel disponible</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'cultures':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Suivi des Cultures</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <PlusCircle className="w-4 h-4 mr-2" />
                Nouvelle Culture
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCrops.map((crop) => (
                <Card key={crop.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sprout className="w-5 h-5 text-green-600" />
                        <span>{crop.name}</span>
                      </div>
                      <Badge variant="outline">{crop.status}</Badge>
                    </CardTitle>
                    <CardDescription>{crop.surface}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Progression</span>
                          <span className="text-sm font-medium">{crop.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${crop.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <CalendarDays className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Prochaine action</p>
                          <p className="text-sm text-gray-600">{crop.nextAction}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics & Rapports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Rendement Moyen</p>
                      <p className="text-2xl font-bold text-green-600">2.3 T/ha</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Revenus Mensuels</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.revenuMensuel.toLocaleString()} FCFA</p>
                    </div>
                    <BarChart className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Efficacité Eau</p>
                      <p className="text-2xl font-bold text-cyan-600">87%</p>
                    </div>
                    <Droplets className="w-8 h-8 text-cyan-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Alertes Actives</p>
                      <p className="text-2xl font-bold text-orange-600">3</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution du Rendement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Graphique de rendement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rapport Météo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cloudy className="w-5 h-5 text-gray-600" />
                        <span>Aujourd'hui</span>
                      </div>
                      <span className="font-medium">28°C - Ensoleillé</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-5 h-5 text-blue-600" />
                        <span>Précipitations</span>
                      </div>
                      <span className="font-medium">5mm prévues</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span>Humidité</span>
                      </div>
                      <span className="font-medium">72%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'formation':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Formation & Ressources</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span>Agriculture Intelligente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Apprenez les techniques modernes d'agriculture avec l'IoT et l'IA
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Débutant</Badge>
                    <Button size="sm">Commencer</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Droplets className="w-5 h-5 text-cyan-600" />
                    <span>Gestion de l'Eau</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Optimisez l'utilisation de l'eau avec des systèmes d'irrigation intelligents
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Intermédiaire</Badge>
                    <Button size="sm">Commencer</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span>Optimisation Rendement</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Techniques avancées pour maximiser vos rendements agricoles
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Avancé</Badge>
                    <Button size="sm">Commencer</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>FileTextation & Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-blue-600" />
                      <span>Guide Installation Capteurs</span>
                    </div>
                    <Button size="sm" variant="outline">Télécharger</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-green-600" />
                      <span>Manuel Culture Biologique</span>
                    </div>
                    <Button size="sm" variant="outline">Télécharger</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Agriculteur</h1>
              <p className="text-gray-600 mt-2">Gérez vos terres agricoles avec des outils intelligents</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                ← Retour Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Total Parcelles</p>
                  <p className="text-3xl font-bold">{stats.totalParcelles}</p>
                </div>
                <MapPin className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Parcelles Actives</p>
                  <p className="text-3xl font-bold">{stats.parcellesActives}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Surface Moyenne</p>
                  <p className="text-3xl font-bold">{stats.rendementMoyen} m²</p>
                </div>
                <Maximize className="w-10 h-10 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Revenus Potentiels</p>
                  <p className="text-3xl font-bold">{(stats.revenuMensuel / 1000).toFixed(0)}K</p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {renderTabContent()}
        </div>
      </div>
    </motion.div>
  );
};

export default AgriculteursDashboardPage;
