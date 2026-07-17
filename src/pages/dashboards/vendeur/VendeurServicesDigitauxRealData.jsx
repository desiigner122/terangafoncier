import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Video, PenTool, Upload, FileText, Camera,
  MessageSquare, Calendar, Clock, CheckCircle, Eye,
  Download, Share2, Users, Monitor, Smartphone, Wifi,
  Cloud, Lock, Activity, Plus, RefreshCw, TrendingUp,
  DollarSign, Package, CreditCard, Bell, Settings,
  Award, Star, ExternalLink, Info, AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';
import VendeurSupabaseService from '@/services/VendeurSupabaseService';

// Catalogue des outils numériques réellement intégrés à la plateforme.
// Il n'existe pas de table "digital_services" / "service_subscriptions" en base :
// ces outils sont des fonctionnalités natives de Teranga Foncier. Leur "usage" est
// calculé à partir des vraies données du vendeur (documents, photos, blockchain,
// score IA des annonces, tickets support) au lieu d'un catalogue payant fictif.
const DIGITAL_TOOLS = [
  {
    id: 'documents',
    name: 'Signature & Gestion de Documents',
    description: "Centralisez, partagez et suivez le statut de vos documents fonciers (titres, contrats, actes).",
    category: 'signature',
    icon: 'PenTool',
    route: '/vendeur/properties'
  },
  {
    id: 'photos',
    name: 'Photos & Visite Virtuelle',
    description: "Ajoutez des photos géolocalisées à vos annonces pour améliorer leur visibilité.",
    category: 'visite_virtuelle',
    icon: 'Camera',
    route: '/vendeur/photos'
  },
  {
    id: 'blockchain',
    name: 'Certification Blockchain',
    description: "Certifiez vos titres fonciers sur la blockchain pour renforcer leur valeur probante.",
    category: 'juridique',
    icon: 'Activity',
    route: '/vendeur/blockchain'
  },
  {
    id: 'ai_verification',
    name: 'Vérification IA des Annonces',
    description: "Score de fiabilité calculé automatiquement pour chacune de vos annonces publiées.",
    category: 'ocr',
    icon: 'FileText',
    route: '/vendeur/properties'
  },
  {
    id: 'support',
    name: 'Support & Assistance',
    description: "Contactez notre équipe support pour toute question sur vos annonces ou transactions.",
    category: 'stockage',
    icon: 'Cloud',
    route: '/vendeur/support'
  }
];

const VendeurServicesDigitauxRealData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('overview');

  // Données réelles issues de VendeurSupabaseService
  const [documents, setDocuments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [listings, setListings] = useState([]);
  const [tickets, setTickets] = useState([]);

  // Usage total (depuis le début) et usage du mois en cours, par outil
  const [usageByTool, setUsageByTool] = useState({});
  const [monthlyUsageByTool, setMonthlyUsageByTool] = useState({});

  const [stats, setStats] = useState({
    activeTools: 0,
    totalTools: DIGITAL_TOOLS.length,
    documentsCount: 0,
    certificatesCount: 0,
    avgAiScore: null,
    verifiedListings: 0,
    totalListings: 0,
    docsThisMonth: 0,
    certsThisMonth: 0
  });

  // Fonction pour mapper les noms d'icônes vers les composants React
  const getIconComponent = (iconName) => {
    const iconMap = {
      'FileSignature': PenTool,
      'PenTool': PenTool,
      'Camera': Camera,
      'Video': Video,
      'ScanText': FileText,
      'FileText': FileText,
      'Cloud': Cloud,
      'Activity': Activity,
      'Megaphone': Share2,
      'Share2': Share2,
      'Scale': FileText,
      'default': Package
    };
    return iconMap[iconName] || iconMap['default'];
  };

  // Fonction pour obtenir la couleur selon la catégorie
  const getCategoryColor = (category) => {
    const colorMap = {
      'signature': 'blue',
      'visite_virtuelle': 'purple',
      'ocr': 'green',
      'stockage': 'orange',
      'marketing': 'pink',
      'juridique': 'red',
      'default': 'gray'
    };
    return colorMap[category] || colorMap['default'];
  };

  // Charger données services
  useEffect(() => {
    if (user) {
      loadServicesData();
    }
  }, [user]);

  const loadServicesData = async () => {
    try {
      setLoading(true);

      const [docsRes, photosRes, certsRes, listingsRes, ticketsRes] = await Promise.all([
        VendeurSupabaseService.getDocuments(user.id),
        VendeurSupabaseService.getUserPhotos(user.id),
        VendeurSupabaseService.getBlockchainCertificates(user.id),
        VendeurSupabaseService.getVendeurListings(user.id),
        VendeurSupabaseService.getSupportTickets(user.id)
      ]);

      const docsData = docsRes.success ? docsRes.data : [];
      const photosData = photosRes.success ? photosRes.data : [];
      const certsData = certsRes.success ? certsRes.data : [];
      const listingsData = listingsRes.success ? listingsRes.data : [];
      const ticketsData = ticketsRes.success ? ticketsRes.data : [];

      setDocuments(docsData);
      setPhotos(photosData);
      setCertificates(certsData);
      setListings(listingsData);
      setTickets(ticketsData);

      // Annonces avec un score IA renseigné (properties.ai_score)
      const scoredListings = listingsData.filter(p => p.ai_score !== null && p.ai_score !== undefined);
      const avgAiScore = scoredListings.length > 0
        ? Math.round(scoredListings.reduce((sum, p) => sum + Number(p.ai_score || 0), 0) / scoredListings.length)
        : null;
      const verifiedListings = listingsData.filter(p => p.verification_status === 'verified').length;

      // Usage total par outil (nombre réel d'éléments en base)
      const usageCounts = {
        documents: docsData.length,
        photos: photosData.length,
        blockchain: certsData.length,
        ai_verification: scoredListings.length,
        support: ticketsData.length
      };
      setUsageByTool(usageCounts);

      // Usage du mois en cours par outil (basé sur created_at réel)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const isThisMonth = (dateStr) => dateStr && new Date(dateStr) >= startOfMonth;

      const monthlyCounts = {
        documents: docsData.filter(d => isThisMonth(d.created_at)).length,
        photos: photosData.filter(p => isThisMonth(p.created_at)).length,
        blockchain: certsData.filter(c => isThisMonth(c.created_at)).length,
        ai_verification: scoredListings.filter(p => isThisMonth(p.created_at)).length,
        support: ticketsData.filter(t => isThisMonth(t.created_at)).length
      };
      setMonthlyUsageByTool(monthlyCounts);

      const activeTools = Object.values(usageCounts).filter(c => c > 0).length;

      setStats({
        activeTools,
        totalTools: DIGITAL_TOOLS.length,
        documentsCount: docsData.length,
        certificatesCount: certsData.length,
        avgAiScore,
        verifiedListings,
        totalListings: listingsData.length,
        docsThisMonth: monthlyCounts.documents,
        certsThisMonth: monthlyCounts.blockchain
      });

      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement services:', error);
      toast.error('Erreur lors du chargement des services');
      setLoading(false);
    }
  };

  const handleOpenTool = (route) => {
    navigate(route);
  };

  const getServiceColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      orange: 'bg-orange-100 text-orange-800',
      red: 'bg-red-100 text-red-800',
      pink: 'bg-pink-100 text-pink-800'
    };
    return colors[color] || 'bg-gray-100 text-gray-800';
  };

  // Dernière date d'activité réelle pour un outil (utilisée dans l'onglet "Outils en usage")
  const getLastActivityDate = (toolId) => {
    const sources = {
      documents,
      photos,
      blockchain: certificates,
      ai_verification: listings.filter(p => p.ai_score !== null && p.ai_score !== undefined),
      support: tickets
    };
    const items = sources[toolId] || [];
    if (items.length === 0) return null;
    const dates = items.map(i => new Date(i.created_at || i.updated_at)).filter(d => !isNaN(d));
    if (dates.length === 0) return null;
    return new Date(Math.max(...dates));
  };

  // Recommandation honnête basée sur les vraies données du vendeur (pas de pourcentage inventé)
  const getRecommendation = () => {
    if (stats.totalListings === 0) {
      return "Publiez votre première annonce pour commencer à utiliser les outils numériques (photos, IA, blockchain).";
    }
    if (stats.documentsCount === 0) {
      return "Vous n'avez pas encore de document enregistré. Centralisez vos titres et contrats pour un accès rapide.";
    }
    if (stats.certificatesCount === 0) {
      return "Aucune de vos annonces n'est certifiée sur la blockchain pour le moment. Renforcez leur valeur probante depuis l'outil Certification Blockchain.";
    }
    if (stats.avgAiScore !== null && stats.avgAiScore < 70) {
      return `Le score IA moyen de vos annonces est de ${stats.avgAiScore}/100. Complétez les informations (photos, description, localisation) pour l'améliorer.`;
    }
    return `Vous utilisez actuellement ${stats.activeTools} outil(s) sur ${stats.totalTools} disponibles.`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            Services Digitaux
          </h1>
          <p className="text-gray-600 mt-2">
            Boostez votre activité avec nos outils numériques
          </p>
        </div>
        <Button
          onClick={() => setActiveTab('services')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Découvrir les Outils
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Outils Utilisés',
            value: `${stats.activeTools}/${stats.totalTools}`,
            icon: Package,
            color: 'blue',
            trend: null
          },
          {
            label: 'Documents Gérés',
            value: stats.documentsCount,
            icon: FileText,
            color: 'green',
            trend: stats.docsThisMonth > 0 ? `+${stats.docsThisMonth} ce mois` : null
          },
          {
            label: 'Certificats Blockchain',
            value: stats.certificatesCount,
            icon: Activity,
            color: 'orange',
            trend: stats.certsThisMonth > 0 ? `+${stats.certsThisMonth} ce mois` : null
          },
          {
            label: 'Score IA Moyen',
            value: stats.avgAiScore !== null ? `${stats.avgAiScore}/100` : '—',
            icon: Award,
            color: 'purple',
            trend: stats.totalListings > 0 ? `${stats.verifiedListings}/${stats.totalListings} vérifiées` : null
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-l-4" style={{ borderLeftColor: `var(--${stat.color}-500)` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <Badge variant="outline" className="mt-2 text-green-700 bg-green-50">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                  <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <Eye className="h-4 w-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="services">
            <Package className="h-4 w-4 mr-2" />
            Tous les Outils
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <CheckCircle className="h-4 w-4 mr-2" />
            Outils en Usage
          </TabsTrigger>
          <TabsTrigger value="usage">
            <Activity className="h-4 w-4 mr-2" />
            Utilisation
          </TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Outils utilisés */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Outils Numériques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {DIGITAL_TOOLS.map((tool, index) => {
                  const IconComponent = getIconComponent(tool.icon);
                  const color = getCategoryColor(tool.category);
                  const count = usageByTool[tool.id] || 0;

                  return (
                    <motion.div
                      key={tool.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${getServiceColor(color)} rounded-lg`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tool.name}</p>
                          <p className="text-xs text-gray-500">
                            {count} élément{count !== 1 ? 's' : ''} enregistré{count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={count > 0 ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-100'}
                      >
                        {count > 0 ? 'Actif' : 'Non utilisé'}
                      </Badge>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Utilisation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Utilisation ce Mois
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.values(monthlyUsageByTool).every(c => !c) ? (
                  <p className="text-center text-gray-500 py-4">Aucune utilisation ce mois</p>
                ) : (
                  DIGITAL_TOOLS.map((tool) => {
                    const count = monthlyUsageByTool[tool.id] || 0;
                    if (count === 0) return null;
                    const maxMonthly = Math.max(...Object.values(monthlyUsageByTool), 1);
                    const percentage = (count / maxMonthly) * 100;

                    return (
                      <div key={tool.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{tool.name}</span>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recommandation (basée sur les vraies données) */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              💡 <strong>Conseil:</strong> {getRecommendation()}
            </AlertDescription>
          </Alert>
        </TabsContent>

        {/* Tous les Outils */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DIGITAL_TOOLS.map((tool, index) => {
              const IconComponent = getIconComponent(tool.icon);
              const color = getCategoryColor(tool.category);
              const count = usageByTool[tool.id] || 0;
              const isActive = count > 0;

              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-3 ${getServiceColor(color)} rounded-lg`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        {isActive && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Actif
                          </Badge>
                        )}
                      </div>
                      <CardTitle>{tool.name}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Usage réel */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-sm text-gray-600">Utilisation totale</span>
                        <span className="font-semibold">
                          {count} élément{count !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* CTA */}
                      <Button
                        onClick={() => handleOpenTool(tool.route)}
                        variant={isActive ? 'outline' : 'default'}
                        className={isActive ? 'w-full' : 'w-full bg-gradient-to-r from-blue-500 to-blue-600'}
                      >
                        {isActive ? (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            Gérer
                          </>
                        ) : (
                          'Ouvrir l\'outil'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Outils en Usage */}
        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Outils Actuellement Utilisés</CardTitle>
              <CardDescription>
                Vos outils numériques avec au moins une donnée enregistrée
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.activeTools === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Aucun outil utilisé pour l'instant</p>
                  <Button
                    onClick={() => setActiveTab('services')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                  >
                    Découvrir les Outils
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {DIGITAL_TOOLS.filter(tool => (usageByTool[tool.id] || 0) > 0).map((tool, index) => {
                    const IconComponent = getIconComponent(tool.icon);
                    const color = getCategoryColor(tool.category);
                    const count = usageByTool[tool.id] || 0;
                    const lastActivity = getLastActivityDate(tool.id);

                    return (
                      <motion.div
                        key={tool.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 ${getServiceColor(color)} rounded-lg`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                              <p className="text-sm text-gray-600">{tool.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className="bg-green-100 text-green-800">
                                  Actif
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900">
                              {count}
                            </p>
                            <p className="text-sm text-gray-600">élément{count !== 1 ? 's' : ''}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-sm text-gray-600">
                            <Clock className="h-4 w-4 inline mr-1" />
                            {lastActivity
                              ? `Dernière activité le ${lastActivity.toLocaleDateString('fr-FR')}`
                              : 'Aucune activité récente'}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenTool(tool.route)}
                            >
                              Ouvrir
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Utilisation */}
        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'Utilisation</CardTitle>
              <CardDescription>
                Suivez votre consommation mensuelle de services
              </CardDescription>
            </CardHeader>
            <CardContent>
              {DIGITAL_TOOLS.every(tool => (usageByTool[tool.id] || 0) === 0) ? (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>Aucune donnée d'utilisation pour le moment</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {DIGITAL_TOOLS.map((tool) => {
                    const IconComponent = getIconComponent(tool.icon);
                    const color = getCategoryColor(tool.category);
                    const total = usageByTool[tool.id] || 0;
                    const thisMonth = monthlyUsageByTool[tool.id] || 0;
                    const maxTotal = Math.max(...Object.values(usageByTool), 1);
                    const percentage = (total / maxTotal) * 100;

                    return (
                      <div key={tool.id} className="flex items-center gap-4">
                        <div className={`p-2 ${getServiceColor(color)} rounded-lg`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{tool.name}</span>
                            <span className="text-sm text-gray-600">
                              {total} au total{thisMonth > 0 ? ` · +${thisMonth} ce mois` : ''}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendeurServicesDigitauxRealData;
