import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  CreditCard, 
  QrCode, 
  Shield, 
  Zap, 
  Globe, 
  Download, 
  Upload, 
  FileText, 
  Send, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Activity, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Star, 
  Settings, 
  Bell, 
  Camera, 
  Scan, 
  Fingerprint, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  MessageSquare, 
  Phone, 
  Video, 
  Calendar, 
  Building, 
  Home, 
  DollarSign, 
  Percent,
  Banknote,
  Calculator,
  PiggyBank,
  Target,
  Award,
  Crown,
  Gift,
  Headphones,
  BookOpen,
  FileCheck,
  RefreshCw,
  Layers,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const BanqueServicesDigitaux = ({ dashboardStats }) => {
  const [activeService, setActiveService] = useState(null);
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('mobile');

  // Statistiques services digitaux bancaires
  const [digitalStats, setDigitalStats] = useState({
    totalTransactions: 25847,
    monthlyGrowth: 23.5,
    activeUsers: 8945,
    digitalizationRate: 78.6,
    avgTransactionValue: 850000,
    customerSatisfaction: 4.7,
    mobileAppUsers: 6745,
    webPlatformUsers: 2200
  });

  // Services digitaux bancaires
  const [digitalServices, setDigitalServices] = useState([
    {
      id: 1,
      name: 'Crédit Immobilier Express',
      category: 'credit',
      description: 'Demande de crédit immobilier 100% digitale',
      icon: Home,
      color: 'bg-blue-500',
      status: 'active',
      usage: 2847,
      rating: 4.8,
      processingTime: '24h',
      features: ['Simulation en ligne', 'Upload documents', 'Signature électronique', 'Suivi temps réel']
    },
    {
      id: 2,
      name: 'Évaluation Bien Digitale',
      category: 'evaluation',
      description: 'Estimation automatique valeur immobilière',
      icon: Calculator,
      color: 'bg-green-500',
      status: 'active',
      usage: 1654,
      rating: 4.6,
      processingTime: '2h',
      features: ['IA évaluation', 'Photos 360°', 'Rapport détaillé', 'Comparaison marché']
    },
    {
      id: 3,
      name: 'Virements Immo Pro',
      category: 'payment',
      description: 'Virements professionnels secteur immobilier',
      icon: Send,
      color: 'bg-purple-500',
      status: 'active',
      usage: 5423,
      rating: 4.9,
      processingTime: 'Instantané',
      features: ['Virement instantané', 'Multi-bénéficiaires', 'Traçabilité', 'API intégration']
    },
    {
      id: 4,
      name: 'Assurance Habitation+',
      category: 'insurance',
      description: 'Souscription assurance habitation digitale',
      icon: Shield,
      color: 'bg-red-500',
      status: 'active',
      usage: 987,
      rating: 4.4,
      processingTime: '1h',
      features: ['Devis instantané', 'Couverture adaptée', 'Gestion sinistres', 'Télé-expertise']
    },
    {
      id: 5,
      name: 'Épargne Logement Smart',
      category: 'savings',
      description: 'Plan épargne logement intelligent',
      icon: PiggyBank,
      color: 'bg-yellow-500',
      status: 'active',
      usage: 756,
      rating: 4.7,
      processingTime: '30min',
      features: ['Objectif personnalisé', 'Simulation prêt', 'Versements auto', 'Conseils IA']
    },
    {
      id: 6,
      name: 'Consultation Bancaire Vidéo',
      category: 'consultation',
      description: 'Rendez-vous conseiller par visioconférence',
      icon: Video,
      color: 'bg-indigo-500',
      status: 'active',
      usage: 1245,
      rating: 4.8,
      processingTime: 'Sur RDV',
      features: ['Réservation en ligne', 'Partage d\'écran', 'Signature électronique', 'Enregistrement']
    },
    {
      id: 7,
      name: 'Investment Tracker Pro',
      category: 'investment',
      description: 'Suivi investissements immobiliers',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      status: 'beta',
      usage: 234,
      rating: 4.5,
      processingTime: 'Temps réel',
      features: ['Dashboard personnalisé', 'Alertes marché', 'Analyse ROI', 'Reporting fiscal']
    },
    {
      id: 8,
      name: 'Notarisation Digitale',
      category: 'legal',
      description: 'Services notariaux dématérialisés',
      icon: FileCheck,
      color: 'bg-orange-500',
      status: 'coming_soon',
      usage: 0,
      rating: 0,
      processingTime: '2-5 jours',
      features: ['Actes authentiques', 'Blockchain', 'Signatures multiples', 'Archivage sécurisé']
    }
  ]);

  // Transactions récentes
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 1,
      type: 'credit_application',
      client: 'M. Amadou Diallo',
      amount: 25000000,
      service: 'Crédit Immobilier Express',
      status: 'approved',
      timestamp: '2024-01-20 14:30',
      processingTime: '18h'
    },
    {
      id: 2,
      type: 'property_valuation',
      client: 'Société Immobilière Sénégal',
      amount: 0,
      service: 'Évaluation Bien Digitale',
      status: 'completed',
      timestamp: '2024-01-20 11:15',
      processingTime: '1h45min'
    },
    {
      id: 3,
      type: 'wire_transfer',
      client: 'Coopérative Habitat',
      amount: 75000000,
      service: 'Virements Immo Pro',
      status: 'completed',
      timestamp: '2024-01-20 09:22',
      processingTime: 'Instantané'
    }
  ]);

  const getServiceIcon = (service) => {
    return service.icon;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'beta': return 'bg-yellow-100 text-yellow-800';
      case 'coming_soon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'approved': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const ServiceCard = ({ service, onClick }) => {
    const ServiceIcon = getServiceIcon(service);
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => onClick(service)}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`${service.color} p-3 rounded-lg text-white`}>
                  <ServiceIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {service.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {service.description}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`text-xs ${getStatusColor(service.status)}`}>
                  {service.status === 'active' ? 'Actif' : 
                   service.status === 'beta' ? 'Bêta' : 'Bientôt'}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Utilisations:</span>
                  <span className="ml-2 font-semibold text-blue-600">{service.usage.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Note:</span>
                  <span className="ml-2 font-semibold text-yellow-600">
                    {service.rating > 0 ? `${service.rating}/5 ⭐` : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="text-sm">
                <span className="text-gray-600">Traitement:</span>
                <span className="ml-2 font-semibold text-green-600">{service.processingTime}</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Fonctionnalités clés:</p>
                <div className="flex flex-wrap gap-1">
                  {service.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {service.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.features.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t">
                <Button 
                  size="sm" 
                  className="w-full"
                  disabled={service.status === 'coming_soon'}
                >
                  {service.status === 'coming_soon' ? 'Bientôt disponible' : 'Utiliser le service'}
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
      {/* Header avec statistiques */}
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
                  <p className="text-blue-600 text-sm font-medium">Utilisateurs Actifs</p>
                  <p className="text-2xl font-bold text-blue-900">{digitalStats.activeUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
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
                  <p className="text-green-600 text-sm font-medium">Croissance Mensuelle</p>
                  <p className="text-2xl font-bold text-green-900">+{digitalStats.monthlyGrowth}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
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
                  <p className="text-purple-600 text-sm font-medium">Taux Digitalisation</p>
                  <p className="text-2xl font-bold text-purple-900">{digitalStats.digitalizationRate}%</p>
                </div>
                <Smartphone className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Satisfaction Client</p>
                  <p className="text-2xl font-bold text-yellow-900">{digitalStats.customerSatisfaction}/5</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Interface principale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <span>Services Digitaux Bancaires</span>
          </CardTitle>
          <CardDescription>
            Plateforme complète de services bancaires digitaux pour l'immobilier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="services">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            {/* Services Digitaux */}
            <TabsContent value="services" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Services Disponibles</h3>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedPlatform === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setSelectedPlatform('mobile')}
                    size="sm"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile
                  </Button>
                  <Button
                    variant={selectedPlatform === 'web' ? 'default' : 'outline'}
                    onClick={() => setSelectedPlatform('web')}
                    size="sm"
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Web
                  </Button>
                </div>
              </div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                {digitalServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onClick={setActiveService}
                  />
                ))}
              </motion.div>
            </TabsContent>

            {/* Transactions */}
            <TabsContent value="transactions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Transactions Récentes</h3>
                <Button size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualiser
                </Button>
              </div>

              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Activity className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{transaction.service}</h4>
                            <p className="text-sm text-gray-600">{transaction.client}</p>
                            <p className="text-xs text-gray-500">{transaction.timestamp}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {transaction.amount > 0 && (
                            <div className="text-lg font-semibold text-green-600 mb-1">
                              {(transaction.amount / 1000000).toFixed(1)}M CFA
                            </div>
                          )}
                          <div className={`text-sm font-medium ${getTransactionStatusColor(transaction.status)}`}>
                            {transaction.status === 'completed' ? 'Terminé' :
                             transaction.status === 'approved' ? 'Approuvé' : 'En cours'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Traité en {transaction.processingTime}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      <span>Usage par Service</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {digitalServices.filter(s => s.usage > 0).map((service) => (
                        <div key={service.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{service.name}</span>
                            <span className="font-semibold">{service.usage.toLocaleString()}</span>
                          </div>
                          <Progress 
                            value={(service.usage / Math.max(...digitalServices.map(s => s.usage))) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-green-600" />
                      <span>Répartition Plateformes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Application Mobile</span>
                        </div>
                        <span className="font-semibold">{digitalStats.mobileAppUsers.toLocaleString()}</span>
                      </div>
                      <Progress value={75.4} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">Plateforme Web</span>
                        </div>
                        <span className="font-semibold">{digitalStats.webPlatformUsers.toLocaleString()}</span>
                      </div>
                      <Progress value={24.6} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Support */}
            <TabsContent value="support" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <Headphones className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Support Téléphonique</h3>
                    <p className="text-sm text-gray-600 mb-4">Assistance 24/7 pour services digitaux</p>
                    <Button size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Chat en Direct</h3>
                    <p className="text-sm text-gray-600 mb-4">Assistance instantanée par chat</p>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chatter
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 mb-2">Centre d'Aide</h3>
                    <p className="text-sm text-gray-600 mb-4">Guides et tutoriels détaillés</p>
                    <Button size="sm" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Consulter
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Headphones className="h-4 w-4" />
                <AlertTitle>Support Prioritaire</AlertTitle>
                <AlertDescription>
                  Les clients Premium bénéficient d'un support prioritaire avec temps de réponse garanti 
                  sous 2h pour les services digitaux bancaires.
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Paramètres */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Préférences de Notification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Notifications push</span>
                      <Button size="sm" variant="outline">Activé</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Alertes email</span>
                      <Button size="sm" variant="outline">Activé</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">SMS transactions</span>
                      <Button size="sm" variant="outline">Désactivé</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Sécurité</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Authentification 2FA</span>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Biométrie</span>
                      <Fingerprint className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Session sécurisée</span>
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BanqueServicesDigitaux;