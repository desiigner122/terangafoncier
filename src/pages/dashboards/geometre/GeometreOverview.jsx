import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Ruler,
  Calculator,
  FileText, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Calendar,
  Camera,
  Map,
  Building2,
  Target,
  TrendingUp,
  Award,
  Layers,
  Route,
  Satellite
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const GeometreOverview = () => {
  // Missions récentes
  // recentMissions RÉEL depuis Supabase (aucune donnée fictive)
  const [recentMissions, setRecentMissions] = useState([]);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.from('field_measurements').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (active) setRecentMissions(data || []);
      } catch (err) {
        console.warn('recentMissions indisponible:', err?.message);
        if (active) setRecentMissions([]);
      }
    })();
    return () => { active = false; };
  }, []);

  // Stats données RÉEL calculées depuis Supabase (défaut 0)
  const stats = [
    {
      title: "Missions Actives",
      value: recentMissions.filter(m => m.status === 'En cours' || m.status === 'en_cours').length,
      change: "",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Levés Terminés",
      value: recentMissions.filter(m => m.status === 'Terminé' || m.status === 'complete').length,
      change: "",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Surface Mesurée",
      value: "—",
      change: "",
      icon: Layers,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Revenus",
      value: "—",
      change: "",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  // Activités récentes
  const recentActivities = []; // démo retirée

  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'topographie': return Compass;
      case 'bornage': return Target;
      case 'cadastral': return Map;
      default: return FileText;
    }
  };

  return (
    <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
            <p className="text-gray-600 mt-1">Tableau de bord géomètre - Activités en cours</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Planning
            </Button>
            <Button>
              <Target className="w-4 h-4 mr-2" />
              Nouvelle Mission
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Missions en cours */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Missions en cours
                </CardTitle>
                <CardDescription>
                  Suivi de vos projets actifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMissions.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Aucune donnée</p>
                  )}
                  {recentMissions.map((mission) => {
                    const TypeIcon = getTypeIcon(mission.type);
                    return (
                      <div key={mission.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <TypeIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{mission.title}</h3>
                              <p className="text-sm text-gray-600">Client: {mission.client}</p>
                              <div className="flex items-center mt-1 text-sm text-gray-500">
                                <MapPin className="w-3 h-3 mr-1" />
                                {mission.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(mission.status)}>
                              {mission.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              Échéance: {mission.deadline}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progression</span>
                              <span className="text-gray-900 font-medium">{mission.progress}%</span>
                            </div>
                            <Progress value={mission.progress} className="h-2" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="w-3 h-3 mr-1" />
                            Voir
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activités récentes */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-green-600" />
                  Activités récentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Aucune donnée</p>
                  )}
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <Icon className={`w-4 h-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {activity.details}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Compass className="w-4 h-4 mr-2" />
                    Nouveau levé GPS
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="w-4 h-4 mr-2" />
                    Calcul surface
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Générer rapport
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Camera className="w-4 h-4 mr-2" />
                    Ajouter photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
              Performance mensuelle
            </CardTitle>
            <CardDescription>
              Évolution de vos missions et revenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Graphique de performance</p>
                <p className="text-gray-500 text-sm">Interface à développer avec Recharts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default GeometreOverview;