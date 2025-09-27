import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin,
  Users,
  FileText,
  TrendingUp,
  Map,
  Calculator,
  Camera,
  Target,
  Building2,
  DollarSign,
  BarChart3,
  Eye,
  Plus,
  Calendar,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const AgentFoncierOverview = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const stats = [
    {
      title: 'Terrains Gérés',
      value: '1,250',
      change: '+8.2%',
      icon: Map,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Clients Actifs',
      value: '89',
      change: '+12.1%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Documents Traités',
      value: '342',
      change: '+5.4%',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Revenus Mensuels',
      value: '45M XOF',
      change: '+15.8%',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Nouveau terrain cadastré',
      client: 'Lot 425 - Parcelles Dakar',
      time: 'Il y a 2h',
      status: 'completed',
      icon: Map
    },
    {
      id: 2,
      action: 'Évaluation terminée',
      client: 'Villa Almadies - M. Diallo',
      time: 'Il y a 4h',
      status: 'completed',
      icon: Calculator
    },
    {
      id: 3,
      action: 'Document en attente',
      client: 'Titre foncier - Entreprise ABC',
      time: 'Il y a 6h',
      status: 'pending',
      icon: FileText
    },
    {
      id: 4,
      action: 'Nouveau client',
      client: 'Mme Ndiaye - Terrain agricole',
      time: 'Il y a 1 jour',
      status: 'new',
      icon: Users
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: 'Visite terrain Rufisque',
      date: 'Aujourd\'hui 14h30',
      priority: 'high',
      client: 'M. Fall'
    },
    {
      id: 2,
      task: 'Finaliser titre foncier',
      date: 'Demain 9h00',
      priority: 'medium',
      client: 'Société Immobilière'
    },
    {
      id: 3,
      task: 'Rapport d\'évaluation',
      date: 'Vendredi 16h00',
      priority: 'low',
      client: 'Famille Seck'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-600">Tableau de bord Agent Foncier</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Rapport
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Terrain
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activités récentes */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Activités récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`p-2 rounded-lg ${
                      activity.status === 'completed' ? 'bg-green-100' :
                      activity.status === 'pending' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <activity.icon className={`h-4 w-4 ${
                        activity.status === 'completed' ? 'text-green-600' :
                        activity.status === 'pending' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.client}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      <Badge variant={
                        activity.status === 'completed' ? 'success' :
                        activity.status === 'pending' ? 'warning' : 'default'
                      } className="text-xs">
                        {activity.status === 'completed' ? 'Terminé' :
                         activity.status === 'pending' ? 'En cours' : 'Nouveau'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tâches à venir */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Prochaines tâches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{task.task}</h4>
                      <Badge variant={
                        task.priority === 'high' ? 'destructive' :
                        task.priority === 'medium' ? 'warning' : 'secondary'
                      } className="text-xs">
                        {task.priority === 'high' ? 'Urgent' :
                         task.priority === 'medium' ? 'Moyen' : 'Faible'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{task.client}</p>
                    <p className="text-xs text-gray-500">{task.date}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Voir toutes les tâches
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance mensuelle */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Objectif terrains</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Satisfaction client</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Documents traités</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentFoncierOverview;