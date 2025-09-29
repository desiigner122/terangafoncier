import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText,
  Clock,
  MapPin,
  Calendar,
  Bell,
  MessageSquare,
  Star,
  Plus,
  ArrowRight,
  Activity,
  CheckCircle,
  AlertCircle,
  Users,
  Building2,
  Target,
  Eye,
  Phone,
  TrendingUp,
  Heart,
  Award,
  Home,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import TerangaLogo from '../../../components/ui/TerangaLogo';

const ParticulierOverview = () => {
  const navigate = useNavigate();

  // Statistiques principales - Focus sur les trois domaines principaux
  const mainStats = [
    {
      title: "Demandes en Cours",
      value: "4",
      change: "+1",
      changeType: "increase",
      icon: Clock,
      color: "from-amber-500 to-yellow-600",
      description: "Zones & Terrains",
      details: "2 zones communales, 2 terrains privés"
    },
    {
      title: "Favoris Actifs",
      value: "8",
      change: "+3",
      changeType: "increase",
      icon: Heart,
      color: "from-rose-500 to-pink-600",
      description: "Sauvegardés",
      details: "3 terrains, 2 zones, 3 projets"
    },
    {
      title: "Projets Suivis",
      value: "3",
      change: "0",
      changeType: "neutral",
      icon: Award,
      color: "from-purple-500 to-indigo-600",
      description: "Promoteurs",
      details: "1 en construction, 2 pré-commercialisation"
    },
    {
      title: "Rendez-vous",
      value: "2",
      change: "+2",
      changeType: "increase",
      icon: Calendar,
      color: "from-blue-500 to-cyan-600",
      description: "Cette semaine",
      details: "Signatures et visites"
    }
  ];

  // Activités récentes - Adaptées au nouveau contexte
  const recentActivities = [
    {
      id: 1,
      type: 'zone_communale',
      title: 'Demande Zone Communale approuvée',
      description: 'Votre demande pour la Zone Résidentielle Pikine Nord a été approuvée',
      time: '2h',
      status: 'success',
      icon: CheckCircle,
      action: 'Voir les détails'
    },
    {
      id: 2,
      type: 'terrain_prive',
      title: 'Nouveau terrain ajouté aux favoris',
      description: 'Terrain Commercial - Plateau (300m²) ajouté à vos favoris',
      time: '5h',
      status: 'info',
      icon: Heart,
      action: 'Voir le terrain'
    },
    {
      id: 3,
      type: 'projet_promoteur',
      title: 'Avancement projet Teranga Development',
      description: 'Villa Moderne - Cité Keur Gorgui: 65% d\'avancement',
      time: '1j',
      status: 'progress',
      icon: TrendingUp,
      action: 'Suivre le projet'
    },
    {
      id: 4,
      type: 'rendez_vous',
      title: 'Rappel rendez-vous',
      description: 'Signature contrat Zone Mixte Guédiawaye demain à 10h00',
      time: '1j',
      status: 'warning',
      icon: Calendar,
      action: 'Confirmer'
    }
  ];

  // Actions rapides - Adaptées au nouveau contexte
  const quickActions = [
    {
      title: 'Nouvelle Demande',
      description: 'Zone communale ou terrain privé',
      icon: Plus,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      action: () => navigate('/particulier/demandes')
    },
    {
      title: 'Mes Favoris',
      description: 'Terrains, zones et projets sauvegardés',
      icon: Heart,
      color: 'bg-gradient-to-r from-rose-500 to-pink-600',
      action: () => navigate('/particulier/favoris')
    },
    {
      title: 'Projets Promoteurs',
      description: 'Villas et appartements disponibles',
      icon: Award,
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      action: () => navigate('/particulier/promoteurs')
    },
    {
      title: 'Mes Documents',
      description: 'Contrats et certificats',
      icon: FileText,
      color: 'bg-gradient-to-r from-green-500 to-emerald-600',
      action: () => navigate('/particulier/documents')
    }
  ];

  // Prochains rendez-vous
  const upcomingAppointments = [
    {
      id: 1,
      title: 'Signature contrat Zone Communale',
      description: 'Zone Mixte Guédiawaye Centre',
      date: '2024-03-05',
      time: '10:00',
      type: 'signature',
      contact: 'M. Ousmane DIOP',
      phone: '77 987 65 43'
    },
    {
      id: 2,
      title: 'Visite terrain Almadies',
      description: 'Terrain Résidentiel - 500m²',
      date: '2024-03-07',
      time: '15:30',
      type: 'visite',
      contact: 'Mme Aïssatou FALL',
      phone: '77 123 45 67'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'progress': return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Header avec logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <TerangaLogo className="h-12 w-12" showText={false} />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-yellow-700 to-orange-700 bg-clip-text text-transparent">
              Tableau de Bord
            </h1>
            <p className="text-slate-600">Gérez vos demandes foncières et projets immobiliers</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Demande
        </Button>
      </motion.div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.details}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                {stat.change !== "0" && (
                  <div className="mt-3 flex items-center">
                    <Badge 
                      variant={stat.changeType === 'increase' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {stat.change} ce mois
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-600" />
                Actions Rapides
              </CardTitle>
              <CardDescription>
                Accédez rapidement à vos fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${action.color} p-4 rounded-xl text-white cursor-pointer transition-transform`}
                    onClick={action.action}
                  >
                    <action.icon className="w-6 h-6 mb-2" />
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activités récentes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Activités Récentes
              </CardTitle>
              <CardDescription>
                Dernières mises à jour sur vos dossiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{activity.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-400">il y a {activity.time}</span>
                        <Button variant="ghost" size="sm" className="text-xs">
                          {activity.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Prochains rendez-vous */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Prochains Rendez-vous
            </CardTitle>
            <CardDescription>
              Ne manquez aucun de vos rendez-vous importants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{appointment.title}</h3>
                      <p className="text-sm text-slate-600">{appointment.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                          {appointment.date} à {appointment.time}
                        </span>
                        <span className="text-xs text-slate-500">
                          {appointment.contact} - {appointment.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-1" />
                      Appeler
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-green-500 to-emerald-600">
                      Confirmer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParticulierOverview;