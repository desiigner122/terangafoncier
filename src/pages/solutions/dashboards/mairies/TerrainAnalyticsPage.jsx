import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, MapPin, Calendar, FileText, Download, Users, DollarSign } from 'lucide-react';
import { sampleParcels, sampleUsers } from '@/data';
import { LoadingSpinner } from '@/components/ui/spinner';

const TerrainAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({});
  const [timeRange, setTimeRange] = useState('3months');
  const [selectedZone, setSelectedZone] = useState('all');

  // Simulation de la mairie connectée
  const currentMairie = "Saly";

  useEffect(() => {
    const generateAnalytics = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simuler des données analytiques
      const localTerrains = sampleParcels.filter(parcel => parcel.zone === currentMairie);
      
      // Données par mois
      const monthlyData = [
        { month: 'Jan', nouvelles_annonces: 8, ventes_conclues: 5, valeur_total: 250000000 },
        { month: 'Fév', nouvelles_annonces: 12, ventes_conclues: 7, valeur_total: 340000000 },
        { month: 'Mar', nouvelles_annonces: 15, ventes_conclues: 9, valeur_total: 430000000 },
        { month: 'Avr', nouvelles_annonces: 10, ventes_conclues: 8, valeur_total: 380000000 },
        { month: 'Mai', nouvelles_annonces: 18, ventes_conclues: 12, valeur_total: 520000000 },
        { month: 'Jun', nouvelles_annonces: 14, ventes_conclues: 10, valeur_total: 480000000 }
      ];

      // Répartition par type de terrain
      const typeDistribution = [
        { name: 'Résidentiel', value: 65, count: 13, color: '#3B82F6' },
        { name: 'Commercial', value: 20, count: 4, color: '#EF4444' },
        { name: 'Agricole', value: 10, count: 2, color: '#10B981' },
        { name: 'Industriel', value: 5, count: 1, color: '#F59E0B' }
      ];

      // Répartition par type de vendeur
      const sellerDistribution = [
        { name: 'Particuliers', value: 70, count: 14, color: '#8B5CF6' },
        { name: 'Professionnels', value: 25, count: 5, color: '#06B6D4' },
        { name: 'Mairie', value: 5, count: 1, color: '#84CC16' }
      ];

      // Évolution des prix
      const priceEvolution = [
        { month: 'Jan', prix_moyen: 12500000, prix_median: 10000000 },
        { month: 'Fév', prix_moyen: 13200000, prix_median: 10500000 },
        { month: 'Mar', prix_moyen: 13800000, prix_median: 11000000 },
        { month: 'Avr', prix_moyen: 14100000, prix_median: 11200000 },
        { month: 'Mai', prix_moyen: 14500000, prix_median: 11500000 },
        { month: 'Jun', prix_moyen: 15000000, prix_median: 12000000 }
      ];

      // Statistiques de surveillance
      const surveillanceStats = {
        totalTerrains: localTerrains.length,
        nouveauxCetteSemaine: 3,
        signalements: 2,
        terrainsVerifies: 18,
        vendeursSuspects: 1,
        documentsManquants: 1
      };

      setAnalyticsData({
        monthlyData,
        typeDistribution,
        sellerDistribution,
        priceEvolution,
        surveillanceStats
      });
      setLoading(false);
    };

    generateAnalytics();
  }, [timeRange, selectedZone]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('fr-FR').format(value);
  };

  const exportReport = () => {
    window.safeGlobalToast({
      title: "Rapport exporté",
      description: "Le rapport d'analyse a été exporté avec succès.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const { monthlyData, typeDistribution, sellerDistribution, priceEvolution, surveillanceStats } = analyticsData;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            Analytics Terrain - {currentMairie}
          </h1>
          <p className="text-muted-foreground mt-2">
            Analyse détaillée du marché foncier dans votre commune
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques de surveillance */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terrains</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveillanceStats.totalTerrains}</div>
            <p className="text-xs text-muted-foreground">en surveillance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveillanceStats.nouveauxCetteSemaine}</div>
            <p className="text-xs text-muted-foreground">cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signalements</CardTitle>
            <FileText className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveillanceStats.signalements}</div>
            <p className="text-xs text-muted-foreground">en cours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vérifiés</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveillanceStats.terrainsVerifies}</div>
            <p className="text-xs text-muted-foreground">conformes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspects</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveillanceStats.vendeursSuspects}</div>
            <p className="text-xs text-muted-foreground">vendeur(s)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Docs Manquants</CardTitle>
            <FileText className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{surveillanceStats.documentsManquants}</div>
            <p className="text-xs text-muted-foreground">terrain(s)</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques principaux */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Évolution mensuelle */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Évolution du Marché</CardTitle>
            <CardDescription>Nouvelles annonces et ventes conclues par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="nouvelles_annonces" fill="#3B82F6" name="Nouvelles annonces" />
                <Bar dataKey="ventes_conclues" fill="#10B981" name="Ventes conclues" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par type */}
        <Card>
          <CardHeader>
            <CardTitle>Types de Terrains</CardTitle>
            <CardDescription>Répartition par type d'usage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Répartition par vendeur */}
        <Card>
          <CardHeader>
            <CardTitle>Types de Vendeurs</CardTitle>
            <CardDescription>Répartition par profil de vendeur</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sellerDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sellerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Évolution des prix */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Évolution des Prix</CardTitle>
            <CardDescription>Prix moyen et médian par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceEvolution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line 
                  type="monotone" 
                  dataKey="prix_moyen" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Prix moyen"
                />
                <Line 
                  type="monotone" 
                  dataKey="prix_median" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Prix médian"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tableaux détaillés */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Zones d'Activité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { zone: 'Centre-ville', count: 8, trend: '+15%' },
                { zone: 'Bord de mer', count: 6, trend: '+25%' },
                { zone: 'Périphérie', count: 4, trend: '-5%' },
                { zone: 'Zone industrielle', count: 2, trend: '+10%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <div className="font-medium">{item.zone}</div>
                    <div className="text-sm text-muted-foreground">{item.count} terrains</div>
                  </div>
                  <Badge variant={item.trend.startsWith('+') ? 'default' : 'destructive'}>
                    {item.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes Récentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'Prix suspect', details: 'Terrain 30% sous marché', priority: 'high' },
                { type: 'Nouveau vendeur', details: 'Première vente dans la commune', priority: 'medium' },
                { type: 'Document manquant', details: 'Titre foncier non fourni', priority: 'high' },
                { type: 'Activité rapide', details: '3 ventes en 1 semaine', priority: 'low' }
              ].map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded border">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.priority === 'high' ? 'bg-red-500' :
                    alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium text-sm">{alert.type}</div>
                    <div className="text-xs text-muted-foreground">{alert.details}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TerrainAnalyticsPage;
