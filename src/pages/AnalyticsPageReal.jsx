import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Users, 
  Eye, 
  MousePointerClick, 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  FileCheck, 
  DollarSign
} from 'lucide-react';
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { LoadingSpinner } from '@/components/ui/spinner';
import { RoleProtectedRoute } from '@/components/layout/ProtectedRoute';
import { supabase } from '@/lib/supabaseClient';
import { EmptyState } from '@/components/ui/EmptyState';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsPageComponent = () => {
  const { user, loading: authLoading } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealAnalyticsData = async () => {
      if (!user) return;

      try {
        // Récupérer les données réelles depuis Supabase
        const [usersResult, propertiesResult, requestsResult, blogResult] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('properties').select('*', { count: 'exact', head: true }),
          supabase.from('demandes_financement').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true })
        ]);

        const totalUsers = usersResult.count || 0;
        const totalParcels = propertiesResult.count || 0;
        const totalRequests = requestsResult.count || 0;
        const totalBlogPosts = blogResult.count || 0;

        // Calculer les données analytiques basées sur les vraies données
        const kpis = [
          { title: 'Total Utilisateurs', value: totalUsers.toString(), trend: 'Données réelles', trendUp: true, icon: Users },
          { title: 'Parcelles Actives', value: totalParcels.toString(), trend: 'Base de données', trendUp: true, icon: FileCheck },
          { title: 'Demandes Totales', value: totalRequests.toString(), trend: 'Temps réel', trendUp: true, icon: MousePointerClick },
          { title: 'Articles Blog', value: totalBlogPosts.toString(), trend: 'Contenu actuel', trendUp: true, icon: Globe },
        ];

        setAnalyticsData({
          kpis,
          totalUsers,
          totalParcels,
          totalRequests,
          totalBlogPosts
        });

      } catch (error) {
        console.error('Error fetching real analytics data:', error);
        // Fallback avec données vides
        setAnalyticsData({
          kpis: [
            { title: 'Erreur de connexion', value: '—', trend: 'Vérifiez la base', trendUp: false, icon: Users }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    if (user && !authLoading) {
      fetchRealAnalyticsData();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune donnée d'analyse disponible.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <BarChart className="mr-3 h-8 w-8 text-primary"/>
          Analyse d'Audience Réelle ({user.role})
        </h1>
        <p className="text-muted-foreground">Données en temps réel depuis votre base de données Supabase.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {analyticsData.kpis.map(kpi => (
          <Card key={kpi.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1"/>
                {kpi.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visites sur 7 jours */}
        <Card>
          <CardHeader>
            <CardTitle>Trafic (7 jours)</CardTitle>
            <CardDescription>Nécessite un suivi d'audience connecté</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={BarChart}
              title="Aucun suivi de trafic disponible"
              description="Le suivi des visites n'est pas encore connecté à une source de données réelle."
            />
          </CardContent>
        </Card>

        {/* Sources du trafic */}
        <Card>
          <CardHeader>
            <CardTitle>Sources du Trafic</CardTitle>
            <CardDescription>Nécessite un suivi d'audience connecté</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Globe}
              title="Aucune donnée de source disponible"
              description="La répartition des sources de trafic n'est pas encore connectée à une source de données réelle."
            />
          </CardContent>
        </Card>
      </div>

      {/* Résumé des données */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé des Données Réelles</CardTitle>
          <CardDescription>État actuel de votre plateforme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-muted rounded">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary"/>
              <p className="text-xl font-bold">{analyticsData.totalUsers}</p>
              <p className="text-sm text-muted-foreground">Utilisateurs Enregistrés</p>
            </div>
            <div className="p-4 bg-muted rounded">
              <FileCheck className="h-8 w-8 mx-auto mb-2 text-primary"/>
              <p className="text-xl font-bold">{analyticsData.totalParcels}</p>
              <p className="text-sm text-muted-foreground">Parcelles Listées</p>
            </div>
            <div className="p-4 bg-muted rounded">
              <MousePointerClick className="h-8 w-8 mx-auto mb-2 text-primary"/>
              <p className="text-xl font-bold">{analyticsData.totalRequests}</p>
              <p className="text-sm text-muted-foreground">Demandes Reçues</p>
            </div>
            <div className="p-4 bg-muted rounded">
              <Globe className="h-8 w-8 mx-auto mb-2 text-primary"/>
              <p className="text-xl font-bold">{analyticsData.totalBlogPosts}</p>
              <p className="text-sm text-muted-foreground">Articles Publiés</p>
            </div>
          </div>
          <p className="mt-6 text-center text-muted-foreground">
            ✅ Données mises à jour en temps réel depuis Supabase
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AnalyticsPage = () => (
  <RoleProtectedRoute allowedRoles={['Admin', 'Mairie', 'Vendeur Particulier', 'Vendeur Pro']}>
    <AnalyticsPageComponent />
  </RoleProtectedRoute>
);

export default AnalyticsPage;

