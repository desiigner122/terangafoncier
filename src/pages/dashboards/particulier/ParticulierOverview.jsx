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
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const ParticulierOverview = () => {
  const navigate = useNavigate();

  // Statistiques principales - Suivi des dossiers
  const mainStats = [
    {
      title: "Dossiers en Cours",
      value: "5",
      change: "+2",
      changeType: "increase",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      description: "En traitement"
    },
    {
      title: "Demandes Approuvées",
      value: "6",
      change: "+1",
      changeType: "increase", 
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      description: "Ce mois"
    },
    {
      title: "Messages",
      value: "8",
      change: "+2",
      changeType: "increase",
      icon: MessageSquare,
      color: "from-yellow-500 to-yellow-600",
      description: "Non lus"
    },
    {
      title: "Rendez-vous",
      value: "2",
      change: "+1",
      changeType: "increase",
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      description: "Cette semaine"
    }
  ];

  // Dossiers et demandes en cours
  const activeRequests = [
    {
      id: 1,
      type: 'certificat',
      title: 'Certificat de Propriété',
      refNumber: 'CP-2024-001',
      location: 'Almadies, Dakar',
      status: 'En cours',
      progress: 75,
      nextAction: 'Validation finale',
      deadline: '2024-02-01',
      submitDate: '2024-01-15',
      service: 'Domaines',
      priority: 'Normale'
    },
    {
      id: 2,
      type: 'permis',
      title: 'Permis de Construire',
      refNumber: 'PC-2024-005',
      location: 'Plateau, Dakar',
      status: 'En attente',
      progress: 25,
      nextAction: 'Documents complémentaires',
      deadline: '2024-02-10',
      submitDate: '2024-01-10',
      service: 'Urbanisme',
      priority: 'Élevée'
    },
    {
      id: 3,
      type: 'morcellement',
      title: 'Demande de Morcellement',
      refNumber: 'MO-2024-003',
      location: 'Saly, Mbour',
      status: 'Approuvé',
      progress: 100,
      nextAction: 'Retrait document',
      deadline: '2024-01-20',
      submitDate: '2024-01-05',
      service: 'Cadastre',
      priority: 'Normale'
    }
  ];

  const getRequestTypeIcon = (type) => {
    switch (type) {
      case 'certificat': return FileText;
      case 'permis': return Building2;
      case 'morcellement': return MapPin;
      case 'autre': return Activity;
      default: return FileText;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header de bienvenue */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Suivi de vos Dossiers
          </h1>
          <p className="text-gray-600">
            Gérez et suivez toutes vos demandes administratives foncières
          </p>
        </motion.div>

        {/* Actions rapides */}
        <div className="flex flex-wrap justify-center gap-3">
          <Button 
            onClick={() => navigate('/particulier/nouvelle-demande')}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Demande
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/particulier/rendez-vous')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Prendre RDV
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate('/particulier/messages')}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Mes Messages
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <TrendingUp className={`w-3 h-3 ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600 rotate-180'
                      }`} />
                    </div>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">{stat.title}</h3>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dossiers en cours */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Dossiers en Cours</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/particulier/dossiers')}>
                Voir tout
              </Button>
            </div>
            <CardDescription>
              Suivez l'avancement de vos demandes administratives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRequests.map((request, index) => {
                const IconComponent = getRequestTypeIcon(request.type);
                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{request.title}</h4>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {request.location}
                          </p>
                          <p className="text-xs text-gray-500">Réf: {request.refNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={request.status === 'Approuvé' ? 'default' : request.status === 'En cours' ? 'secondary' : 'outline'}>
                          {request.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{request.service}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progression</span>
                        <span className="font-medium">{request.progress}%</span>
                      </div>
                      <Progress value={request.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <span>Soumis le: {request.submitDate}</span>
                      <span>Échéance: {request.deadline}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p className="text-gray-600">Prochaine action:</p>
                        <p className="font-medium">{request.nextAction}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          Priorité {request.priority}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notifications et Alertes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Notifications Importantes</CardTitle>
            <CardDescription>
              Restez informé des mises à jour de vos dossiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Documents manquants</h4>
                    <p className="text-sm text-yellow-700">
                      Votre demande PC-2024-005 nécessite des documents complémentaires
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Voir détails
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800">Dossier approuvé</h4>
                    <p className="text-sm text-green-700">
                      Votre demande MO-2024-003 a été approuvée. Document prêt au retrait.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Prendre RDV
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800">Rendez-vous programmé</h4>
                    <p className="text-sm text-blue-700">
                      RDV le 05/02/2024 à 10h pour finaliser votre demande CP-2024-001
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Voir agenda
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParticulierOverview;