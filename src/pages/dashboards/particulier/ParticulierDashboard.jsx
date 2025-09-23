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

// Import des nouveaux widgets interactifs
import { 
  UpcomingDeadlinesWidget,
  UrgentActionsWidget, 
  GlobalProgressWidget,
  MiniCalendarWidget
} from '@/components/dashboard/InteractiveWidgets';
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
      { label: 'Terrains privés', value: 3, href: '/dashboard/acheteur/private-interests', icon: MapPin },
      { label: 'Demandes communales', value: 2, href: '/dashboard/acheteur/municipal-applications', icon: Building },
      { label: 'Projets VEFA', value: 1, href: '/dashboard/acheteur/promoter-reservations', icon: Home },
      { label: 'Propriétés NFT', value: 2, href: '/dashboard/acheteur/owned-properties', icon: Award }
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
      <div className="space-y-6">
        
        {/* Résumé d'activité - Remplacé par widgets interactifs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <UpcomingDeadlinesWidget className="md:col-span-1 lg:col-span-2" />
          <UrgentActionsWidget />
          <MiniCalendarWidget />
        </div>

        {/* Progression et statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlobalProgressWidget className="md:col-span-2" />
          
          {/* Résumé numérique conservé */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm">Dossiers actifs</span>
                  </div>
                  <span className="font-bold">{dashboardData.summary.activeDossiers}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                    <span className="text-sm">Actions requises</span>
                  </div>
                  <span className="font-bold">{dashboardData.summary.pendingActions}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm">RDV à venir</span>
                  </div>
                  <span className="font-bold">{dashboardData.summary.upcomingAppointments}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-sm">Paiements dus</span>
                  </div>
                  <span className="font-bold">{dashboardData.summary.paymentsDue}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projets en cours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Mes Projets en Cours
            </CardTitle>
            <CardDescription>
              Suivi de vos acquisitions et dossiers actifs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.activeProjects.map((project) => {
                const IconComponent = getTypeIcon(project.type);
                return (
                  <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-blue-100">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{project.title}</h4>
                          <Badge className={`mt-1 ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                          <div className="mt-2 flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{project.nextAction} - Échéance: {new Date(project.deadline).toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progression</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {project.amount.toLocaleString()} FCFA
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
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

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dashboardData.quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Link key={index} to={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Notifications importantes - Remplacées par le système de notifications intégré */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Système de Notifications Activé
            </CardTitle>
            <CardDescription>
              Les notifications importantes apparaissent maintenant en temps réel dans l'interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mr-4" />
              <div>
                <p className="font-medium">Notifications temps réel activées</p>
                <p className="text-sm">Consultez la cloche en haut à droite pour voir vos notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assistant IA contextuel - Always available */}
        <ContextualAIAssistant />

      </div>
    </ModernDashboardLayout>
  );
};

export default ParticulierDashboard;
