import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  FileText, 
  Video, 
  PenTool, 
  Cloud, 
  Smartphone,
  Monitor,
  Globe,
  Lock,
  Unlock,
  Download,
  Upload,
  Share2,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  Mail,
  Phone,
  Camera,
  Mic,
  Settings,
  Archive,
  Search,
  Filter,
  Plus,
  Activity,
  Target,
  Award,
  Briefcase
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MairieServicesDigitaux = ({ dashboardStats }) => {
  const [activeService, setActiveService] = useState(null);
  const [processingRequest, setProcessingRequest] = useState(false);
  const [selectedTab, setSelectedTab] = useState('e-services');

  // Statistiques services digitaux
  const [digitalStats, setDigitalStats] = useState({
    totalEServices: 156,
    activeUsers: 2847,
    documentsProcessed: 891,
    videoConferences: 45,
    digitalSignatures: 234,
    satisfactionRate: 92.3
  });

  // Services digitaux disponibles
  const [digitalServices, setDigitalServices] = useState([
    {
      id: 1,
      name: 'Signature Électronique',
      description: 'Signature numérique sécurisée pour documents officiels',
      icon: PenTool,
      category: 'signature',
      status: 'active',
      users: 1247,
      documentsProcessed: 456,
      lastUsed: '2024-01-20',
      features: ['Signature biométrique', 'Horodatage', 'Certificat numérique'],
      availability: '24/7'
    },
    {
      id: 2,
      name: 'Visioconférence Officielle',
      description: 'Réunions virtuelles avec citoyens et partenaires',
      icon: Video,
      category: 'communication',
      status: 'active',
      users: 342,
      documentsProcessed: 0,
      lastUsed: '2024-01-19',
      features: ['HD Video', 'Enregistrement', 'Partage écran'],
      availability: '8h-18h'
    },
    {
      id: 3,
      name: 'Dématérialisation Documents',
      description: 'Numérisation et OCR automatique des documents',
      icon: FileText,
      category: 'documents',
      status: 'active',
      users: 89,
      documentsProcessed: 1247,
      lastUsed: '2024-01-20',
      features: ['OCR Intelligence', 'Classification auto', 'Archivage'],
      availability: '24/7'
    },
    {
      id: 4,
      name: 'Télé-Services Municipaux',
      description: 'Services administratifs à distance',
      icon: Globe,
      category: 'administration',
      status: 'active',
      users: 1869,
      documentsProcessed: 234,
      lastUsed: '2024-01-20',
      features: ['Demandes en ligne', 'Suivi temps réel', 'Notifications'],
      availability: '24/7'
    },
    {
      id: 5,
      name: 'Cloud Municipal',
      description: 'Stockage sécurisé des données municipales',
      icon: Cloud,
      category: 'storage',
      status: 'active',
      users: 45,
      documentsProcessed: 0,
      lastUsed: '2024-01-20',
      features: ['Backup automatique', 'Chiffrement', 'Accès contrôlé'],
      availability: '24/7'
    },
    {
      id: 6,
      name: 'Application Mobile Citoyen',
      description: 'App mobile pour services municipaux',
      icon: Smartphone,
      category: 'mobile',
      status: 'development',
      users: 0,
      documentsProcessed: 0,
      lastUsed: null,
      features: ['Notifications push', 'Géolocalisation', 'Hors ligne'],
      availability: 'Bientôt'
    }
  ]);

  // Activités récentes
  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'signature',
      title: 'Document signé électroniquement',
      user: 'M. Mamadou Seck',
      document: 'Autorisation commerciale #AR-2024-045',
      timestamp: '2024-01-20 14:30',
      status: 'completed'
    },
    {
      id: 2,
      type: 'video_conference',
      title: 'Réunion conseil municipal',
      user: 'Équipe municipale',
      document: 'Session du 20/01/2024',
      timestamp: '2024-01-20 10:00',
      status: 'completed'
    },
    {
      id: 3,
      type: 'document_processing',
      title: 'Dématérialisation automatique',
      user: 'Système IA',
      document: 'Lot de 15 documents cadastraux',
      timestamp: '2024-01-20 09:15',
      status: 'processing'
    },
    {
      id: 4,
      type: 'e_service',
      title: 'Demande télé-service',
      user: 'Mme Fatou Diallo',
      document: 'Certificat de résidence',
      timestamp: '2024-01-19 16:45',
      status: 'pending'
    }
  ]);

  const getServiceIcon = (category) => {
    switch (category) {
      case 'signature': return PenTool;
      case 'communication': return Video;
      case 'documents': return FileText;
      case 'administration': return Globe;
      case 'storage': return Cloud;
      case 'mobile': return Smartphone;
      default: return Zap;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'signature': return PenTool;
      case 'video_conference': return Video;
      case 'document_processing': return FileText;
      case 'e_service': return Globe;
      default: return Activity;
    }
  };

  const getActivityStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'processing': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const ServiceCard = ({ service, onClick }) => {
    const ServiceIcon = service.icon;
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => onClick(service)}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <ServiceIcon className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {service.name}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <Badge className={`text-xs ${getStatusColor(service.status)}`}>
                      {service.status === 'active' ? 'Actif' :
                       service.status === 'development' ? 'Développement' : service.status}
                    </Badge>
                    <Badge className="text-xs bg-gray-100 text-gray-800">
                      {service.availability}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {service.users} utilisateurs
                </div>
                {service.documentsProcessed > 0 && (
                  <div className="text-xs text-gray-600">
                    {service.documentsProcessed} docs
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <p className="text-sm text-gray-600">{service.description}</p>
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-900">Fonctionnalités:</p>
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  {service.lastUsed ? 
                    `Utilisé le ${new Date(service.lastUsed).toLocaleDateString('fr-FR')}` :
                    'Pas encore utilisé'
                  }
                </span>
                <Button size="sm" disabled={service.status !== 'active'}>
                  <Zap className="h-4 w-4 mr-1" />
                  {service.status === 'active' ? 'Utiliser' : 'Indisponible'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques services digitaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">E-Services Actifs</p>
                  <p className="text-2xl font-bold text-blue-900">{digitalStats.totalEServices}</p>
                </div>
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold text-green-900">{digitalStats.activeUsers}</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Signatures Digitales</p>
                  <p className="text-2xl font-bold text-purple-900">{digitalStats.digitalSignatures}</p>
                </div>
                <PenTool className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Satisfaction</p>
                  <p className="text-2xl font-bold text-orange-900">{digitalStats.satisfactionRate}%</p>
                </div>
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interface principale services digitaux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-teal-600" />
            <span>Services Digitaux et Télé-Administration</span>
          </CardTitle>
          <CardDescription>
            Plateforme complète de dématérialisation et services municipaux numériques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="e-services">E-Services</TabsTrigger>
              <TabsTrigger value="signature">Signature</TabsTrigger>
              <TabsTrigger value="video">Visio</TabsTrigger>
              <TabsTrigger value="activities">Activités</TabsTrigger>
            </TabsList>

            {/* E-Services */}
            <TabsContent value="e-services" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {digitalServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onClick={setActiveService}
                  />
                ))}
              </div>

              {digitalServices.length === 0 && (
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun service disponible</p>
                </div>
              )}
            </TabsContent>

            {/* Signature électronique */}
            <TabsContent value="signature" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <PenTool className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Nouveau Document</h3>
                    <p className="text-sm text-gray-600 mb-4">Créer signature électronique</p>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Documents Signés</h3>
                    <p className="text-sm text-gray-600 mb-4">Consulter historique</p>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Settings className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Configuration</h3>
                    <p className="text-sm text-gray-600 mb-4">Paramètres signature</p>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurer
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertTitle>Sécurité Renforcée</AlertTitle>
                <AlertDescription>
                  Toutes les signatures électroniques sont protégées par chiffrement et horodatage 
                  certifié pour garantir leur validité légale.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Visioconférence */}
            <TabsContent value="video" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Video className="h-5 w-5 text-blue-600" />
                      <span>Réunion Conseil</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <p>Prochaine session: 25 janvier 2024 à 14h00</p>
                      <p>Participants: 12 membres du conseil</p>
                    </div>
                    <Button className="w-full">
                      <Video className="h-4 w-4 mr-2" />
                      Rejoindre la réunion
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span>Consultations Citoyens</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm text-gray-600">
                      <p>Créneaux disponibles: 8 slots cette semaine</p>
                      <p>Durée: 30 minutes par consultation</p>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Planifier consultation
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Camera className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Enregistrements</h3>
                    <p className="text-2xl font-bold text-teal-900">23</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Participants</h3>
                    <p className="text-2xl font-bold text-blue-900">156</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Durée Totale</h3>
                    <p className="text-2xl font-bold text-green-900">47h</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activités récentes */}
            <TabsContent value="activities" className="space-y-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: activity.id * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-teal-100 p-2 rounded-lg">
                                <ActivityIcon className="h-5 w-5 text-teal-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                <p className="text-sm text-gray-600">{activity.user}</p>
                                <p className="text-sm text-gray-600">{activity.document}</p>
                                <p className="text-xs text-gray-500">{activity.timestamp}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <Badge className={`${
                                activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                activity.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {activity.status === 'completed' ? 'Terminé' :
                                 activity.status === 'processing' ? 'En cours' : 'En attente'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <div className="text-center">
                <Button variant="outline">
                  <Archive className="h-4 w-4 mr-2" />
                  Voir toutes les activités
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-teal-50 to-teal-100">
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold text-teal-900 mb-2">Nouveau Service</h3>
              <p className="text-sm text-teal-700">Ajouter un service digital</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Rapport Usage</h3>
              <p className="text-sm text-blue-700">Statistiques d'utilisation</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <Settings className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Configuration</h3>
              <p className="text-sm text-purple-700">Paramétrer les services</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MairieServicesDigitaux;