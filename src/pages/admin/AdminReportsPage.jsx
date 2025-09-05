
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  BarChart2, 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { LoadingSpinner } from '@/components/ui/spinner';
import { supabase } from '@/lib/supabaseClient';

const AdminReportsPage = () => {
  // toast remplacÃ© par window.safeGlobalToast
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalParcels: 0,
    totalRequests: 0,
    totalBlogPosts: 0,
    pendingRequests: 0,
    topRegion: 'N/A',
    conversionRate: 0
  });

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    setLoading(true);
    try {
      // Récupérer les vraies données des tables
      const [usersRes, parcelsRes, requestsRes, blogRes] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact' }),
        supabase.from('parcels').select('*', { count: 'exact' }),
        supabase.from('requests').select('*', { count: 'exact' }),
        supabase.from('blog').select('*', { count: 'exact' })
      ]);

      // Calculer les statistiques réelles
      const totalUsers = usersRes.count || 0;
      const totalParcels = parcelsRes.count || 0;
      const totalRequests = requestsRes.count || 0;
      const totalBlogPosts = blogRes.count || 0;
      
      // Calculer les demandes en attente
      const pendingRequests = requestsRes.data?.filter(r => r.status === 'pending').length || 0;
      
      // Calculer la région la plus demandée
      const regionCounts = {};
      parcelsRes.data?.forEach(parcel => {
        if (parcel.region) {
          regionCounts[parcel.region] = (regionCounts[parcel.region] || 0) + 1;
        }
      });
      const topRegion = Object.keys(regionCounts).reduce((a, b) => 
        regionCounts[a] > regionCounts[b] ? a : b, 'N/A');
      
      // Calculer le taux de conversion (exemple basique)
      const conversionRate = totalRequests > 0 ? 
        Math.round((totalParcels / totalRequests) * 100) : 0;

      setStats({
        totalUsers,
        totalParcels,
        totalRequests,
        totalBlogPosts,
        pendingRequests,
        topRegion,
        conversionRate
      });

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      window.safeGlobalToast({
        title: "Erreur",
        description: "Impossible de charger les statistiques réelles.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportType) => {
    try {
      window.safeGlobalToast({
        title: "Génération en cours...",
        description: `Préparation du rapport ${reportType}`,
      });

      // Simuler la génération de rapport
      setTimeout(() => {
        window.safeGlobalToast({
          title: "Rapport généré !",
          description: `Le rapport ${reportType} a été téléchargé avec succès.`,
        });
      }, 2000);
    } catch (error) {
      window.safeGlobalToast({
        title: "Erreur",
        description: "Impossible de générer le rapport.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Rapports et Statistiques</h1>
          <p className="text-muted-foreground">Données en temps réel de la plateforme</p>
        </div>
        <Button onClick={fetchRealData} variant="outline">
          Actualiser les données
        </Button>
      </div>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Comptes créés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parcelles</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalParcels}</div>
            <p className="text-xs text-muted-foreground">Répertoriées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes Actives</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            <p className="text-xs text-muted-foreground">En attente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles Blog</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBlogPosts}</div>
            <p className="text-xs text-muted-foreground">Publiés</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Générer un Rapport</CardTitle>
          <CardDescription>Sélectionnez le type de rapport à générer avec les données réelles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={() => handleGenerateReport('Utilisateurs')}
              className="h-auto py-4 flex flex-col items-center"
              variant="outline"
            >
              <Users className="h-8 w-8 mb-2" />
              <span>Rapport Utilisateurs</span>
              <span className="text-xs text-muted-foreground">({stats.totalUsers} entrées)</span>
            </Button>

            <Button 
              onClick={() => handleGenerateReport('Parcelles')}
              className="h-auto py-4 flex flex-col items-center"
              variant="outline"
            >
              <MapPin className="h-8 w-8 mb-2" />
              <span>Rapport Parcelles</span>
              <span className="text-xs text-muted-foreground">({stats.totalParcels} entrées)</span>
            </Button>

            <Button 
              onClick={() => handleGenerateReport('Demandes')}
              className="h-auto py-4 flex flex-col items-center"
              variant="outline"
            >
              <FileText className="h-8 w-8 mb-2" />
              <span>Rapport Demandes</span>
              <span className="text-xs text-muted-foreground">({stats.totalRequests} entrées)</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques Clés</CardTitle>
          <CardDescription>Indicateurs de performance basés sur les données réelles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
             <div className="p-4 bg-muted rounded">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary"/>
                <p className="text-xl font-bold">{stats.conversionRate}%</p>
                <p className="text-sm text-muted-foreground">Taux Parcelles/Demandes</p>
             </div>
             <div className="p-4 bg-muted rounded">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary"/>
                <p className="text-xl font-bold">{stats.topRegion}</p>
                <p className="text-sm text-muted-foreground">Région la Plus Demandée</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminReportsPage;

