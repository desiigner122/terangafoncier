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
  Briefcase,
  Loader2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Catalogue statique des outils digitaux municipaux (outils réels de la plateforme).
// Les compteurs d'usage sont injectés depuis la vraie donnée (communal_requests / documents).
const SERVICE_CATALOG = [
  {
    id: 1,
    name: 'Signature Électronique',
    description: 'Signature numérique sécurisée pour documents officiels',
    icon: PenTool,
    category: 'signature',
    status: 'active',
    features: ['Signature biométrique', 'Horodatage', 'Certificat numérique'],
    availability: '24/7'
  },
  {
    id: 2,
    name: 'Visioconférence Officielle',
    description: 'Réunions virtuelles avec citoyens et partenaires',
    icon: Video,
    category: 'communication',
    status: 'development',
    features: ['HD Video', 'Enregistrement', 'Partage écran'],
    availability: 'Bientôt'
  },
  {
    id: 3,
    name: 'Dématérialisation Documents',
    description: 'Numérisation et archivage des documents municipaux',
    icon: FileText,
    category: 'documents',
    status: 'active',
    features: ['Archivage', 'Classification', 'Consultation'],
    availability: '24/7'
  },
  {
    id: 4,
    name: 'Télé-Services Municipaux',
    description: 'Demandes de terrains communaux et suivi à distance',
    icon: Globe,
    category: 'administration',
    status: 'active',
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
    features: ['Notifications push', 'Géolocalisation', 'Hors ligne'],
    availability: 'Bientôt'
  }
];

const MairieServicesDigitaux = ({ dashboardStats }) => {
  const { user, profile } = useAuth();
  const commune = profile?.city || null;

  const [activeService, setActiveService] = useState(null);
  const [processingRequest, setProcessingRequest] = useState(false);
  const [selectedTab, setSelectedTab] = useState('e-services');
  const [loading, setLoading] = useState(true);

  // Statistiques services digitaux (compteurs d'usage réels)
  const [digitalStats, setDigitalStats] = useState({
    totalEServices: SERVICE_CATALOG.filter((s) => s.status === 'active').length,
    activeUsers: null,
    documentsProcessed: null,
    teleServices: null
  });

  // Services digitaux disponibles (catalogue statique + compteurs réels)
  const [digitalServices, setDigitalServices] = useState(
    SERVICE_CATALOG.map((s) => ({ ...s, users: null, documentsProcessed: null, lastUsed: null }))
  );

  // Activités récentes (dernières demandes communales réelles)
  const [recentActivities, setRecentActivities] = useState([]);

  // Chargement des compteurs d'usage réels
  useEffect(() => {
    if (!user?.id) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        // Demandes communales (télé-services) — filtrées par commune si disponible
        let crBase = supabase
          .from('communal_requests')
          .select('id, applicant_name, commune, zone, type, status, created_at')
          .order('created_at', { ascending: false });
        if (commune) crBase = crBase.eq('commune', commune);
        const crResp = await crBase;

        // Documents dématérialisés
        const docResp = await supabase
          .from('documents')
          .select('id', { count: 'exact', head: true });

        // Administrés (contacts CRM de la mairie connectée)
        const contactsResp = await supabase
          .from('crm_contacts')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', user.id);

        if (!active) return;

        const requests = crResp.error ? [] : (crResp.data || []);
        const teleServices = requests.length;
        const documentsProcessed = docResp.error ? null : (docResp.count ?? 0);
        const activeUsers = contactsResp.error ? null : (contactsResp.count ?? 0);

        setDigitalStats({
          totalEServices: SERVICE_CATALOG.filter((s) => s.status === 'active').length,
          activeUsers,
          documentsProcessed,
          teleServices
        });

        // Injection des compteurs réels dans le catalogue (services adossés à une table)
        setDigitalServices(
          SERVICE_CATALOG.map((s) => {
            if (s.category === 'administration') {
              return {
                ...s,
                users: activeUsers,
                documentsProcessed: teleServices,
                lastUsed: requests[0]?.created_at || null
              };
            }
            if (s.category === 'documents') {
              return {
                ...s,
                users: null,
                documentsProcessed: documentsProcessed,
                lastUsed: null
              };
            }
            return { ...s, users: null, documentsProcessed: null, lastUsed: null };
          })
        );

        // Activités récentes = dernières demandes communales
        setRecentActivities(
          requests.slice(0, 6).map((r) => ({
            id: r.id,
            type: 'e_service',
            title: `Demande ${r.type || 'terrain communal'}`,
            user: r.applicant_name || 'Administré',
            document: [r.commune, r.zone].filter(Boolean).join(' · ') || 'Demande communale',
            timestamp: r.created_at
              ? new Date(r.created_at).toLocaleString('fr-FR')
              : '',
            status:
              r.status === 'approved'
                ? 'completed'
                : r.status === 'rejected'
                ? 'completed'
                : r.status === 'pending'
                ? 'pending'
                : 'processing'
          }))
        );
      } catch (err) {
        if (active) {
          console.error('Erreur chargement services digitaux:', err);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [user?.id, commune]);

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
                {service.users != null && (
                  <div className="text-sm font-semibold text-gray-900">
                    {service.users} administrés
                  </div>
                )}
                {service.documentsProcessed != null && service.documentsProcessed > 0 && (
                  <div className="text-xs text-gray-600">
                    {service.documentsProcessed} {service.category === 'administration' ? 'demandes' : 'docs'}
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
                  <p className="text-blue-600 text-sm font-medium">Outils Actifs</p>
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
                  <p className="text-green-600 text-sm font-medium">Administrés</p>
                  <p className="text-2xl font-bold text-green-900">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (digitalStats.activeUsers ?? '—')}
                  </p>
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
                  <p className="text-purple-600 text-sm font-medium">Documents Dématérialisés</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (digitalStats.documentsProcessed ?? '—')}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
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
                  <p className="text-orange-600 text-sm font-medium">Demandes en ligne</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (digitalStats.teleServices ?? '—')}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-orange-600" />
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
              <Alert>
                <Video className="h-4 w-4" />
                <AlertTitle>Module de visioconférence</AlertTitle>
                <AlertDescription>
                  La planification des réunions de conseil et des consultations citoyens en
                  visioconférence sera bientôt disponible. Aucune session n'est encore enregistrée.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Camera className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Enregistrements</h3>
                    <p className="text-2xl font-bold text-teal-900">—</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Participants</h3>
                    <p className="text-2xl font-bold text-blue-900">—</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Durée Totale</h3>
                    <p className="text-2xl font-bold text-green-900">—</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activités récentes */}
            <TabsContent value="activities" className="space-y-6">
              {loading && (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Chargement des activités...
                </div>
              )}

              {!loading && recentActivities.length === 0 && (
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune activité récente</p>
                </div>
              )}

              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);

                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
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