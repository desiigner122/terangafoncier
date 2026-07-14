import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building, 
  BarChart3, 
  PieChart,
  Target,
  Calendar,
  MapPin,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Filter,
  Download
} from 'lucide-react';
// Layout géré par CompleteSidebarInvestisseurDashboard

const InvestisseurOverview = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // Données du portefeuille
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    monthlyGrowth: 0,
    totalInvestments: 0,
    activeProjects: 0,
    monthlyReturn: 0,
    yearlyReturn: 0
  });

  // Investissements actifs
  const [activeInvestments, setActiveInvestments] = useState([]);

  // Opportunités récentes
  const [recentOpportunities, setRecentOpportunities] = useState([]);

  // Activités récentes
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        setLoading(true);

        const [txRes, propRes] = await Promise.all([
          user?.id
            ? supabase
                .from('financial_transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
            : Promise.resolve({ data: [] }),
          supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(4)
        ]);

        const transactions = txRes?.data || [];
        const totalValue = transactions.reduce(
          (sum, t) => sum + (Number(t.amount) || 0),
          0
        );

        setPortfolioStats((prev) => ({
          ...prev,
          totalValue,
          totalInvestments: transactions.length,
          activeProjects: transactions.filter(
            (t) => t.status === 'active' || t.status === 'pending'
          ).length
        }));

        setRecentActivities(
          transactions.slice(0, 3).map((t) => ({
            id: t.id,
            type: t.type || 'investment',
            title: t.description || t.type || 'Transaction',
            description: t.description || '',
            time: t.created_at
              ? new Date(t.created_at).toLocaleDateString('fr-FR')
              : '',
            amount: Math.abs(Number(t.amount) || 0),
            positive: (Number(t.amount) || 0) >= 0
          }))
        );

        setRecentOpportunities(
          (propRes?.data || []).map((p) => ({
            id: p.id,
            title: p.title || p.name || 'Propriété',
            location: p.location || p.city || '',
            type: p.type || p.property_type || '',
            minInvestment: Number(p.price) || 0,
            expectedRoi: 0,
            duration: '',
            riskLevel: '',
            status: p.status || ''
          }))
        );
      } catch (error) {
        console.error("Erreur chargement vue d'ensemble investisseur:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOverviewData();
  }, [user?.id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En construction': return 'bg-blue-100 text-blue-800';
      case 'Opérationnel': return 'bg-green-100 text-green-800';
      case 'Disponible': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Faible': return 'bg-green-100 text-green-800';
      case 'Modéré': return 'bg-yellow-100 text-yellow-800';
      case 'Élevé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* En-tête avec statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Portefeuille Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(portfolioStats.totalValue)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{portfolioStats.monthlyGrowth}%
                </span>
                <span className="text-sm text-gray-500 ml-1">ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Investissements</p>
                  <p className="text-2xl font-bold text-gray-900">{portfolioStats.totalInvestments}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">
                  {portfolioStats.activeProjects} projets actifs
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rendement Mensuel</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(portfolioStats.monthlyReturn)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">
                  +{portfolioStats.yearlyReturn}%
                </span>
                <span className="text-sm text-gray-500 ml-1">annuel</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Performance</p>
                  <p className="text-2xl font-bold text-gray-900">{portfolioStats.yearlyReturn}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={portfolioStats.yearlyReturn * 5} className="h-2" />
                <span className="text-sm text-gray-600 mt-1">Objectif: 18%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Investissements actifs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Mes Investissements Actifs</CardTitle>
                    <CardDescription>
                      Performance de vos investissements en cours
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Tout voir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeInvestments.length === 0 && !loading && (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Aucun investissement actif pour le moment.
                    </p>
                  )}
                  {activeInvestments.map((investment) => (
                    <motion.div
                      key={investment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{investment.title}</h3>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {investment.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(investment.status)}>
                            {investment.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{investment.type}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Investi</p>
                          <p className="font-semibold">{formatCurrency(investment.invested)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Valeur actuelle</p>
                          <p className="font-semibold">{formatCurrency(investment.currentValue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ROI actuel</p>
                          <p className="font-semibold text-green-600">+{investment.roi}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">ROI attendu</p>
                          <p className="font-semibold">{investment.expectedReturn}%</p>
                        </div>
                      </div>

                      {investment.status === 'En construction' && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progression</span>
                            <span className="font-medium">{investment.completion}%</span>
                          </div>
                          <Progress value={investment.completion} className="h-2" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Opportunités récentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Nouvelles Opportunités
                  <Badge variant="secondary">{recentOpportunities.length} nouvelles</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOpportunities.length === 0 && !loading && (
                    <p className="text-sm text-gray-500 text-center py-6">
                      Aucune opportunité disponible.
                    </p>
                  )}
                  {recentOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{opportunity.title}</h4>
                        {opportunity.status === 'Nouveau' && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            Nouveau
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{opportunity.location}</p>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Min. investissement:</span>
                          <span className="font-medium">{formatCurrency(opportunity.minInvestment)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">ROI attendu:</span>
                          <span className="font-medium text-green-600">{opportunity.expectedRoi}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Durée:</span>
                          <span className="font-medium">{opportunity.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Risque:</span>
                          <Badge className={`${getRiskColor(opportunity.riskLevel)} text-xs`}>
                            {opportunity.riskLevel}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full mt-3">
                        <Plus className="w-3 h-3 mr-1" />
                        Investir
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Activités récentes */}
            <Card>
              <CardHeader>
                <CardTitle>Activités Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.length === 0 && !loading && (
                    <p className="text-sm text-gray-500 text-center py-6">
                      Aucune activité récente.
                    </p>
                  )}
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.positive ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {activity.positive ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          activity.positive ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {activity.positive ? '+' : '-'}{formatCurrency(activity.amount)}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
            <CardDescription>
              Gérez rapidement vos investissements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col">
                <Plus className="w-6 h-6 mb-2" />
                Nouvel Investissement
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <BarChart3 className="w-6 h-6 mb-2" />
                Analyser Marché
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Download className="w-6 h-6 mb-2" />
                Exporter Rapport
              </Button>
              <Button variant="outline" className="h-20 flex flex-col">
                <Calendar className="w-6 h-6 mb-2" />
                Planifier RDV
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestisseurOverview;