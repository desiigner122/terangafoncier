import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Building, 
  Users, 
  MessageSquare, 
  Eye, 
  Star, 
  DollarSign,
  Calendar,
  ArrowUp,
  ArrowDown,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  Brain,
  Shield,
  Bitcoin
} from 'lucide-react';

const VendeurOverview = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalProperties: 12,
    activeProperties: 9,
    totalViews: 3247,
    totalVisitors: 1892,
    totalMessages: 24,
    totalRevenue: 450000000,
    monthlyGrowth: 15.2,
    conversionRate: 8.5,
    averagePrice: 125000000,
    pendingInquiries: 7
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'new_inquiry',
      message: 'Nouvelle demande pour Villa Almadies',
      time: '2h',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'property_view',
      message: '45 nouvelles vues sur Terrain Sacré-Cœur',
      time: '4h',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'ai_optimization',
      message: 'Optimisation IA terminée pour 3 propriétés',
      time: '6h',
      icon: Brain,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'nft_created',
      message: 'NFT créé pour Appartement Plateau',
      time: '1j',
      icon: Bitcoin,
      color: 'text-orange-600'
    }
  ]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace('XOF', 'FCFA');
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-600 mt-1">
            Tableau de bord principal de votre activité vendeur
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Rapport
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau bien
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Biens</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalProperties}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {dashboardStats.activeProperties} actifs
                    </Badge>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vues Total</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.totalViews.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
                    <span className="text-xs text-green-600">+{dashboardStats.monthlyGrowth}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenus Total</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatPrice(dashboardStats.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-600">Moy: {formatPrice(dashboardStats.averagePrice)}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Messages</p>
                  <p className="text-2xl font-bold text-orange-600">{dashboardStats.totalMessages}</p>
                  <div className="flex items-center mt-1">
                    <Badge variant="destructive" className="text-xs">
                      {dashboardStats.pendingInquiries} en attente
                    </Badge>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activité récente */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center`}>
                      <activity.icon className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance et objectifs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Taux de conversion</span>
                  <span className="font-medium">{dashboardStats.conversionRate}%</span>
                </div>
                <Progress value={dashboardStats.conversionRate} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Objectif mensuel</span>
                  <span className="font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium">Score IA Global</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">8.7/10</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium">Propriétés tokenisées</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Vues par propriété
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <PieChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Graphique des vues disponible bientôt</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Évolution des revenus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Analyse des revenus disponible bientôt</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VendeurOverview;