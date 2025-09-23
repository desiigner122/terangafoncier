import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  MapPin, 
  Heart, 
  Search, 
  FileText, 
  CreditCard,
  Building2,
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Bell,
  User,
  Bookmark,
  Eye,
  MessageSquare,
  Building,
  Award,
  Shield,
  Lock,
  Banknote,
  History
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ModernDashboardLayout from '@/components/dashboard/ModernDashboardLayout';
import AIAssistantWidget from '@/components/dashboard/ai/AIAssistantWidget';
import BlockchainWidget from '@/components/dashboard/blockchain/BlockchainWidget';
import { AIEstimationWidget, AIMarketInsights } from '@/components/AIComponents';

import ContextualAIAssistant from '@/components/dashboard/ContextualAIAssistant';

const ParticulierDashboard = () => {
  const [loading, setLoading] = useState(true);

  // Données simulées du dashboard
  const [dashboardData, setDashboardData] = useState({
    // Résumé d'activité
    summary: {
      activeDossiers: 8,
      pendingActions: 3,
      upcomingAppointments: 2,
      paymentsDue: 1
    },
    
    // Projets en cours
    activeProjects: [
      {
        id: 1,
        type: 'private',
        title: 'Terrain Almadies 500m²',
        status: 'Négociation en cours',
        progress: 60,
        nextAction: 'Réponse à l\'offre',
        deadline: '2025-10-05',
        amount: 15000000
      },
      {
        id: 2,
        type: 'municipal',
        title: 'Demande Zone Communale Thiès',
        status: 'Dossier en instruction',
        progress: 40,
        nextAction: 'Documents manquants',
        deadline: '2025-09-30',
        amount: 8500000
      },
      {
        id: 3,
        type: 'promoter',
        title: 'Villa VEFA Cité Jardin',
        status: 'Construction en cours',
        progress: 75,
        nextAction: 'Visite de chantier',
        deadline: '2025-11-15',
        amount: 45000000
      }
    ],

    // Notifications importantes
    notifications: [
      { id: 1, type: 'payment', message: 'Échéance paiement Villa VEFA dans 3 jours', urgent: true },
      { id: 2, type: 'document', message: '2 documents manquants pour demande communale', urgent: false },
      { id: 3, type: 'appointment', message: 'RDV notaire confirmé pour demain 14h', urgent: false }
    ],

    // Actions rapides
    quickStats: [
      { label: 'Terrains privés', value: 3, href: '/acheteur/private-interests', icon: MapPin },
      { label: 'Demandes communales', value: 2, href: '/acheteur/municipal-applications', icon: Building },
      { label: 'Projets VEFA', value: 1, href: '/acheteur/promoter-reservations', icon: Home },
      { label: 'Propriétés NFT', value: 2, href: '/acheteur/owned-properties', icon: Award }
    ]
  });

  useEffect(() => {
    // Simulation chargement des données
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  // Fonction helper pour le statut
  const getStatusColor = (status) => {
    const colors = {
      'Négociation en cours': 'bg-blue-100 text-blue-800',
      'Dossier en instruction': 'bg-yellow-100 text-yellow-800',
      'Construction en cours': 'bg-green-100 text-green-800',
      'En attente': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      'private': MapPin,
      'municipal': Building,
      'promoter': Home
    };
    return icons[type] || FileText;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <ModernDashboardLayout
      title="Tableau de Bord"
      subtitle="Suivi de vos projets immobiliers"
      userRole="Particulier"
    >
      <div className="max-w-full mx-auto space-y-8">
        
        {/* Statistiques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Dossiers actifs</p>
                  <p className="text-2xl font-bold">{dashboardData.summary.activeDossiers}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Actions requises</p>
                  <p className="text-2xl font-bold">{dashboardData.summary.pendingActions}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">RDV à venir</p>
                  <p className="text-2xl font-bold">{dashboardData.summary.upcomingAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Paiements dus</p>
                  <p className="text-2xl font-bold">{dashboardData.summary.paymentsDue}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Link key={index} to={stat.href} className="block">
                <Card className="hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200 group">
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Projets en cours */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                  Mes Projets en Cours
                </CardTitle>
                <CardDescription className="mt-2">
                  Suivi détaillé de vos acquisitions et dossiers actifs
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {dashboardData.activeProjects.map((project) => {
                const IconComponent = getTypeIcon(project.type);
                return (
                  <div key={project.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                      
                      {/* Info projet */}
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-3 rounded-lg bg-white shadow-sm">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-lg mb-1">{project.title}</h4>
                          <Badge className={`${getStatusColor(project.status)} mb-3`}>
                            {project.status}
                          </Badge>
                          <div className="flex items-center text-sm text-gray-600 mb-3">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{project.nextAction}</span>
                            <span className="mx-2">•</span>
                            <span>Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}</span>
                          </div>
                          
                          {/* Barre de progression */}
                          <div className="w-full">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium">Progression</span>
                              <span className="text-gray-600">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-3" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Prix et action */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-gray-900 mb-2">
                          {project.amount.toLocaleString()} FCFA
                        </p>
                        <Button variant="outline" size="sm">
                          Voir détails
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notifications et alertes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-600" />
                Notifications Récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.notifications.slice(0, 3).map((notif) => (
                  <div key={notif.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className={`p-1 rounded-full ${notif.urgent ? 'bg-red-100' : 'bg-blue-100'}`}>
                      <Bell className={`h-4 w-4 ${notif.urgent ? 'text-red-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                      <p className="text-xs text-gray-500">Il y a 2h</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Système Opérationnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notifications temps réel</span>
                  <Badge className="bg-green-100 text-green-800">Activé</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Assistant IA</span>
                  <Badge className="bg-green-100 text-green-800">Disponible</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Synchronisation</span>
                  <Badge className="bg-green-100 text-green-800">En ligne</Badge>
                </div>
                <div className="text-center pt-4">
                  <p className="text-xs text-gray-500">
                    Tous les systèmes fonctionnent normalement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assistant IA contextuel */}
        <ContextualAIAssistant />

      </div>
    </ModernDashboardLayout>
  );
};

export default ParticulierDashboard;
