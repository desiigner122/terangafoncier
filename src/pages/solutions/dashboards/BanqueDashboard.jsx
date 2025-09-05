import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Banknote, 
  FileSignature, 
  MapPin, 
  FileCheckIcon, 
  TrendingUp, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  CreditCard, 
  Building
} from 'lucide-react';

const BanqueDashboard = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFundingRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    totalLoans: 0,
    activeGuarantees: 0,
    portfolioValue: 0
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Récupérer les statistiques réelles depuis Supabase
      const { data: fundingRequests } = await supabase
        .from('funding_requests')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: guarantees } = await supabase
        .from('guarantees')
        .select('*')
        .eq('status', 'active');

      const { data: portfolioData } = await supabase
        .from('bank_portfolio')
        .select('*')
        .eq('bank_id', profile?.id);

      // Calculer les statistiques
      const pendingCount = fundingRequests?.filter(req => req.status === 'pending').length || 0;
      const approvedCount = fundingRequests?.filter(req => req.status === 'approved').length || 0;
      const totalValue = portfolioData?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;

      setStats({
        totalFundingRequests: fundingRequests?.length || 0,
        pendingRequests: pendingCount,
        approvedRequests: approvedCount,
        totalLoans: approvedCount,
        activeGuarantees: guarantees?.length || 0,
        portfolioValue: totalValue
      });

      setRecentRequests(fundingRequests?.slice(0, 5) || []);
      setPortfolioItems(portfolioData || []);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Banque</h1>
          <p className="text-muted-foreground">
            Bienvenue {profile?.full_name}, gérez vos financements et garanties
          </p>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Building className="w-4 h-4 mr-1" />
          {profile?.user_type}
        </Badge>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes de Financement</CardTitle>
            <FileSignature className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFundingRequests}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingRequests} en attente
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prêts Accordés</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedRequests}</div>
            <p className="text-xs text-muted-foreground">
              Taux d'approbation: {stats.totalFundingRequests > 0 ? Math.round((stats.approvedRequests / stats.totalFundingRequests) * 100) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garanties Actives</CardTitle>
            <FileCheckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeGuarantees}</div>
            <p className="text-xs text-muted-foreground">
              Sécurisant le portefeuille
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur du Portefeuille</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.portfolioValue)}</div>
            <p className="text-xs text-muted-foreground">
              Investissement total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenu principal avec onglets */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Demandes de Financement</TabsTrigger>
          <TabsTrigger value="portfolio">Portefeuille</TabsTrigger>
          <TabsTrigger value="guarantees">Garanties</TabsTrigger>
          <TabsTrigger value="analytics">Analyse Risque</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demandes Récentes</CardTitle>
              <CardDescription>
                Dernières demandes de financement reçues
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentRequests.length > 0 ? (
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{request.project_name || 'Projet Immobilier'}</p>
                        <p className="text-sm text-muted-foreground">
                          Montant: {formatCurrency(request.amount || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(request.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(request.status)}>
                          {request.status === 'pending' ? 'En attente' : 
                           request.status === 'approved' ? 'Approuvé' : 
                           request.status === 'rejected' ? 'Rejeté' : request.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Examiner
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileSignature className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">Aucune demande</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Aucune demande de financement pour le moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Portefeuille d'Investissements</CardTitle>
              <CardDescription>
                Vue d'ensemble de vos investissements fonciers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {portfolioItems.length > 0 ? (
                <div className="space-y-4">
                  {portfolioItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{item.property_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ROI: {item.roi || 0}% annuel
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.value || 0)}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.investment_type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">Portefeuille vide</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Aucun investissement dans le portefeuille actuellement.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guarantees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Garanties et Sûretés</CardTitle>
              <CardDescription>
                Gestion des garanties pour les prêts accordés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">Gestion des garanties</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fonctionnalité de gestion des garanties en cours de développement.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse de Risque</CardTitle>
              <CardDescription>
                Évaluation des risques du portefeuille
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Risque Portfolio</span>
                    <span>Faible (15%)</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Diversification</span>
                    <span>Bonne (75%)</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Liquidité</span>
                    <span>Modérée (60%)</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default BanqueDashboard;
