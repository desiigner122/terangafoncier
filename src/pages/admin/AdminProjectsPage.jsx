import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Camera, 
  Video, 
  FileText, 
  Download, 
  Eye, 
  Edit, 
  Pause, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Globe2, 
  Filter, 
  Search, 
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const AdminProjectsPage = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    const fetchProjectsData = async () => {
      setLoading(true);
      try {
        // Données des projets (simulation avec données réelles si disponibles)
        const projectsData = [
          {
            id: 1,
            title: 'Villa Almadies - Famille Diallo',
            client: 'Amadou Diallo',
            location: 'Almadies, Dakar',
            status: 'in_progress',
            progress: 65,
            budget: 125000000,
            spent: 81250000,
            start_date: '2024-06-15',
            estimated_completion: '2025-02-15',
            current_phase: 'Gros œuvre',
            diaspora_country: 'France',
            last_update: '2024-09-03'
          },
          {
            id: 2,
            title: 'Duplex Yeumbeul - Famille Sall',
            client: 'Fatou Sall',
            location: 'Yeumbeul, Keur Massar',
            status: 'FileTextation',
            progress: 25,
            budget: 85000000,
            spent: 21250000,
            start_date: '2024-08-01',
            estimated_completion: '2025-06-01',
            current_phase: 'Fondations',
            diaspora_country: 'États-Unis',
            last_update: '2024-09-04'
          },
          {
            id: 3,
            title: 'Maison Familiale Mbour - Ba',
            client: 'Ousmane Ba',
            location: 'Mbour, Thiès',
            status: 'completed',
            progress: 100,
            budget: 95000000,
            spent: 93500000,
            start_date: '2024-01-15',
            estimated_completion: '2024-08-15',
            current_phase: 'Finitions',
            diaspora_country: 'Canada',
            last_update: '2024-08-20'
          }
        ];

        setProjects(projectsData);

        // Statistiques
        const totalProjects = projectsData.length;
        const activeProjects = projectsData.filter(p => p.status === 'in_progress').length;
        const completedProjects = projectsData.filter(p => p.status === 'completed').length;
        const totalBudget = projectsData.reduce((sum, p) => sum + p.budget, 0);
        const totalSpent = projectsData.reduce((sum, p) => sum + p.spent, 0);

        setStats({
          totalProjects,
          activeProjects,
          completedProjects,
          totalBudget,
          totalSpent,
          avgProgress: Math.round(projectsData.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
        });

      } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'FileTextation': return 'bg-yellow-500';
      case 'paused': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En cours';
      case 'FileTextation': return 'FileTextation';
      case 'paused': return 'En pause';
      default: return 'Inconnu';
    }
  };

  const progressData = [
    { month: 'Jan', projets: 2, completion: 85 },
    { month: 'Fév', projets: 3, completion: 92 },
    { month: 'Mar', projets: 2, completion: 78 },
    { month: 'Avr', projets: 4, completion: 88 },
    { month: 'Mai', projets: 3, completion: 95 },
    { month: 'Jun', projets: 5, completion: 82 },
    { month: 'Jul', projets: 4, completion: 90 },
    { month: 'Aoû', projets: 6, completion: 87 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des projets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Projets</h1>
          <p className="text-muted-foreground">
            Suivi et administration des projets de construction à distance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Projet
          </Button>
        </div>
      </motion.div>

      {/* Statistiques Globales */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projets</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Tous les projets diaspora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              En cours de construction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalBudget / 1000000000).toFixed(1)}Md</div>
            <p className="text-xs text-muted-foreground">
              XOF engagés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.avgProgress}%</div>
            <p className="text-xs text-muted-foreground">
              Tous projets confondus
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets de Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="projects">Liste Projets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des Projets</CardTitle>
                  <CardDescription>Nombre de projets et taux de completion par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="projets" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="completion" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Pays Diaspora</CardTitle>
                  <CardDescription>Distribution géographique des clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>France</span>
                      </div>
                      <span className="font-medium">40%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>États-Unis</span>
                      </div>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Canada</span>
                      </div>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>Autres</span>
                      </div>
                      <span className="font-medium">15%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Liste des Projets */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Projets de Construction Diaspora</CardTitle>
                    <CardDescription>Gestion et suivi de tous les projets</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Search className="w-4 h-4 mr-2" />
                      Rechercher
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusText(project.status)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {project.client}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {project.location}
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe2 className="w-4 h-4" />
                              {project.diaspora_country}
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{project.current_phase}</span>
                              <span className="text-sm text-muted-foreground">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              {(project.budget / 1000000).toFixed(0)}M XOF
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {(project.spent / 1000000).toFixed(1)}M dépensés
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Camera className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Video className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Budgétaire</CardTitle>
                  <CardDescription>Analyse des budgets vs dépenses réelles</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projects}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="budget" fill="#8884d8" name="Budget" />
                      <Bar dataKey="spent" fill="#82ca9d" name="Dépensé" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métriques de Performance</CardTitle>
                  <CardDescription>KPIs clés des projets diaspora</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Taux de Réussite</span>
                        <span className="text-sm text-muted-foreground">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Respect des Délais</span>
                        <span className="text-sm text-muted-foreground">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Satisfaction Client</span>
                        <span className="text-sm text-muted-foreground">96%</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Respect du Budget</span>
                        <span className="text-sm text-muted-foreground">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Timeline */}
          <TabsContent value="timeline" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline des Projets</CardTitle>
                <CardDescription>Chronologie et planification des projets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={project.id} className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(project.status)}`}></div>
                        {index < projects.length - 1 && <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold truncate">{project.title}</h4>
                          <span className="text-xs text-muted-foreground">{project.last_update}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{project.current_phase}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Début: {new Date(project.start_date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            Fin prévue: {new Date(project.estimated_completion).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AdminProjectsPage;
