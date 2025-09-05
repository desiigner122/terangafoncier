import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast-simple';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Building2, 
  Globe2, 
  Calendar as CalendarIcon, 
  FileSpreadsheet, 
  Filter, 
  RefreshCcw, 
  Eye, 
  Share, 
  Printer, 
  Mail, 
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: new Date(2024, 5, 1), // Juin 2024
    to: new Date()
  });
  const [selectedPeriod, setSelectedPeriod] = useState('3months');
  const { toast } = useToast();

  // Données analytiques simulées
  const analyticsData = {
    overview: {
      totalRevenue: 45800000,
      totalProjects: 23,
      activeUsers: 1247,
      completionRate: 94.2,
      growthRate: 15.8
    },
    revenueData: [
      { month: 'Jan', revenue: 8500000, projects: 3, profit: 1700000 },
      { month: 'Fév', revenue: 12300000, projects: 5, profit: 2460000 },
      { month: 'Mar', revenue: 15200000, projects: 4, profit: 3040000 },
      { month: 'Avr', revenue: 18700000, projects: 6, profit: 3740000 },
      { month: 'Mai', revenue: 22100000, projects: 8, profit: 4420000 },
      { month: 'Jun', revenue: 25600000, projects: 7, profit: 5120000 },
      { month: 'Jul', revenue: 32400000, projects: 9, profit: 6480000 },
      { month: 'Aoû', revenue: 45800000, projects: 12, profit: 9160000 }
    ],
    userGrowth: [
      { month: 'Jan', nouveaux: 45, actifs: 234, diaspora: 18 },
      { month: 'Fév', nouveaux: 67, actifs: 301, diaspora: 29 },
      { month: 'Mar', nouveaux: 89, actifs: 390, diaspora: 41 },
      { month: 'Avr', nouveaux: 123, actifs: 513, diaspora: 58 },
      { month: 'Mai', nouveaux: 156, actifs: 669, diaspora: 72 },
      { month: 'Jun', nouveaux: 189, actifs: 858, diaspora: 91 },
      { month: 'Jul', nouveaux: 234, actifs: 1092, diaspora: 118 },
      { month: 'Aoû', nouveaux: 267, actifs: 1247, diaspora: 145 }
    ],
    projectsByType: [
      { name: 'Villa individuelle', value: 35, color: '#8884d8' },
      { name: 'Duplex/Triplex', value: 28, color: '#82ca9d' },
      { name: 'Immeuble locatif', value: 20, color: '#ffc658' },
      { name: 'Commercial', value: 12, color: '#ff7300' },
      { name: 'Terrain nu', value: 5, color: '#00ff88' }
    ],
    diasporaCountries: [
      { country: 'France', projects: 12, revenue: 18500000 },
      { country: 'États-Unis', projects: 8, revenue: 12300000 },
      { country: 'Canada', projects: 5, revenue: 8900000 },
      { country: 'Italie', projects: 4, revenue: 4200000 },
      { country: 'Espagne', projects: 3, revenue: 1900000 }
    ]
  };

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const exportToExcel = (type) => {
    // Simulation de l'export Excel
    toast({ title: "Succès", description: `Export Excel ${type} généré avec succès` });
    
    // Ici vous pourriez intégrer une vraie librairie d'export comme:
    // - xlsx (SheetJS)
    // - exceljs
    // - react-excel-export
    
    // Exemple fictif de données d'export
    const exports = {
      revenue: 'Rapport_Revenus_' + format(new Date(), 'yyyy-MM-dd') + '.xlsx',
      projects: 'Rapport_Projets_' + format(new Date(), 'yyyy-MM-dd') + '.xlsx',
      users: 'Rapport_Utilisateurs_' + format(new Date(), 'yyyy-MM-dd') + '.xlsx',
      complete: 'Rapport_Complet_' + format(new Date(), 'yyyy-MM-dd') + '.xlsx'
    };
    
    console.log(`Downloading: ${exports[type]}`);
  };

  const shareReport = () => {
    toast({ title: "Succès", description: "Lien de partage copié dans le presse-papiers" });
  };

  const printReport = () => {
    window.print();
    toast({ title: "Succès", description: "Rapport envoyé vers l'imprimante" });
  };

  const sendByEmail = () => {
    toast({ title: "Succès", description: "Rapport envoyé par email aux destinataires" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des analytics...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Analytics & Rapports</h1>
          <p className="text-muted-foreground">
            Tableaux de bord analytiques et exports de données
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 mois</SelectItem>
              <SelectItem value="3months">3 mois</SelectItem>
              <SelectItem value="6months">6 mois</SelectItem>
              <SelectItem value="1year">1 an</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </motion.div>

      {/* KPIs Principaux */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus Totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analyticsData.overview.totalRevenue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              +{analyticsData.overview.growthRate}% ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projets Totaux</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              Projets diaspora
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.overview.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Réussite</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.overview.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Projets terminés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pays Diaspora</CardTitle>
            <Globe2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.diasporaCountries.length}</div>
            <p className="text-xs text-muted-foreground">
              Pays couverts
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Exports Rapides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Exports Excel
            </CardTitle>
            <CardDescription>
              Téléchargez vos rapports au format Excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => exportToExcel('revenue')}
              >
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">Rapport Revenus</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => exportToExcel('projects')}
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">Rapport Projets</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => exportToExcel('users')}
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">Rapport Utilisateurs</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center gap-2"
                onClick={() => exportToExcel('complete')}
              >
                <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium">Rapport Complet</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-6 pt-6 border-t">
              <Button variant="outline" size="sm" onClick={shareReport}>
                <Share className="w-4 h-4 mr-2" />
                Partager
              </Button>
              <Button variant="outline" size="sm" onClick={printReport}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
              <Button variant="outline" size="sm" onClick={sendByEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Envoyer par Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Onglets Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="revenue">Revenus</TabsTrigger>
            <TabsTrigger value="projects">Projets</TabsTrigger>
            <TabsTrigger value="diaspora">Diaspora</TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des Revenus</CardTitle>
                  <CardDescription>Progression des revenus sur 8 mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Croissance Utilisateurs</CardTitle>
                  <CardDescription>Nouveaux utilisateurs vs utilisateurs actifs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analyticsData.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="nouveaux" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="actifs" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="diaspora" stroke="#ffc658" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Revenus */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenus vs Profits</CardTitle>
                  <CardDescription>Analyse de la rentabilité mensuelle</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8884d8" name="Revenus" />
                      <Bar dataKey="profit" fill="#82ca9d" name="Profits" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Type de Frais</CardTitle>
                  <CardDescription>Sources de revenus principales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Frais de Gestion (8%)</span>
                      <span className="font-bold">18.5M XOF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Supervision Technique</span>
                      <span className="font-bold">12.3M XOF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Services Premium</span>
                      <span className="font-bold">8.9M XOF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Reporting & FileTextation</span>
                      <span className="font-bold">4.2M XOF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Autres Services</span>
                      <span className="font-bold">1.9M XOF</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projets */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Types de Projets</CardTitle>
                  <CardDescription>Distribution par type de construction</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.projectsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.projectsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance par Mois</CardTitle>
                  <CardDescription>Nombre de projets lancés mensuellement</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="projects" fill="#8884d8" name="Projets" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Diaspora */}
          <TabsContent value="diaspora" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Pays Diaspora</CardTitle>
                <CardDescription>Revenus et projets par pays de résidence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.diasporaCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Globe2 className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{country.country}</p>
                          <p className="text-sm text-muted-foreground">{country.projects} projets</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{(country.revenue / 1000000).toFixed(1)}M XOF</p>
                        <p className="text-sm text-muted-foreground">
                          {((country.revenue / analyticsData.overview.totalRevenue) * 100).toFixed(1)}% du total
                        </p>
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

export default AdminAnalyticsPage;
