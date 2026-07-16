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
  LineChart,
  Link as LinkIcon,
  LifeBuoy
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Catalogue STATIQUE des outils digitaux réellement proposés par la plateforme.
// Aucun chiffre d'usage/note n'est codé en dur : le compteur `usageKey` pointe vers
// une vraie table Supabase (ou reste `null` quand aucune source n'existe → affichage "—").
const DIGITAL_SERVICES = [
  {
    id: 1,
    name: 'Crédit Immobilier Express',
    category: 'credit',
    description: 'Gestion digitale des dossiers de crédit immobilier',
    icon: Home,
    color: 'bg-blue-500',
    status: 'active',
    usageKey: 'loans',
    features: ['Simulation en ligne', 'Upload documents', 'Signature électronique', 'Suivi temps réel']
  },
  {
    id: 2,
    name: 'Évaluation & Risque Digitale',
    category: 'evaluation',
    description: 'Évaluation du risque et scoring des dossiers',
    icon: Calculator,
    color: 'bg-green-500',
    status: 'active',
    usageKey: 'riskAssessments',
    features: ['Scoring risque', 'Analyse dossier', 'Rapport détaillé', 'Comparaison marché']
  },
  {
    id: 3,
    name: 'Virements Immo Pro',
    category: 'payment',
    description: 'Transactions financières secteur immobilier',
    icon: Send,
    color: 'bg-purple-500',
    status: 'active',
    usageKey: 'transactions',
    features: ['Virement instantané', 'Multi-bénéficiaires', 'Traçabilité', 'API intégration']
  },
  {
    id: 4,
    name: 'Assurance Habitation+',
    category: 'insurance',
    description: 'Souscription assurance habitation digitale',
    icon: Shield,
    color: 'bg-red-500',
    status: 'coming_soon',
    usageKey: null,
    features: ['Devis instantané', 'Couverture adaptée', 'Gestion sinistres', 'Télé-expertise']
  },
  {
    id: 5,
    name: 'Épargne Logement Smart',
    category: 'savings',
    description: 'Plan épargne logement intelligent',
    icon: PiggyBank,
    color: 'bg-yellow-500',
    status: 'coming_soon',
    usageKey: null,
    features: ['Objectif personnalisé', 'Simulation prêt', 'Versements auto', 'Conseils IA']
  },
  {
    id: 6,
    name: 'Consultation Bancaire Vidéo',
    category: 'consultation',
    description: 'Rendez-vous conseiller par visioconférence',
    icon: Video,
    color: 'bg-indigo-500',
    status: 'coming_soon',
    usageKey: null,
    features: ['Réservation en ligne', 'Partage d\'écran', 'Signature électronique', 'Enregistrement']
  },
  {
    id: 7,
    name: 'Garanties & Sûretés',
    category: 'guarantees',
    description: 'Gestion digitale des garanties et sûretés',
    icon: Layers,
    color: 'bg-emerald-500',
    status: 'active',
    usageKey: 'guarantees',
    features: ['Suivi garanties', 'Alertes échéance', 'Valorisation', 'Reporting']
  },
  {
    id: 8,
    name: 'Notarisation Blockchain',
    category: 'legal',
    description: 'Certification et traçabilité blockchain des actes',
    icon: FileCheck,
    color: 'bg-orange-500',
    status: 'active',
    usageKey: 'certificates',
    features: ['Actes authentiques', 'Blockchain', 'Signatures multiples', 'Archivage sécurisé']
  }
];

const BanqueServicesDigitaux = ({ dashboardStats }) => {
  const { user } = useAuth();
  const [activeService, setActiveService] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('mobile');
  const [isLoading, setIsLoading] = useState(false);

  // Compteurs d'usage RÉELS (aucun Math.random, aucun chiffre codé en dur)
  const [counts, setCounts] = useState({
    clients: 0,
    loans: 0,
    guarantees: 0,
    transactions: 0,
    tickets: 0,
    certificates: 0,
    riskAssessments: 0,
    documents: 0
  });

  // Transactions récentes réelles (financial_transactions)
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadDigitalData();
    }
  }, [user?.id]);

  const loadDigitalData = async () => {
    setIsLoading(true);
    try {
      const bankId = user.id;

      const [
        clientsRes,
        loansRes,
        guaranteesRes,
        riskRes,
        blockchainRes,
        ticketsRes,
        txRes
      ] = await Promise.all([
        supabase.from('bank_clients').select('*', { count: 'exact', head: true }).eq('bank_id', bankId),
        supabase.from('loans').select('*', { count: 'exact', head: true }).eq('bank_id', bankId),
        supabase.from('guarantees').select('*', { count: 'exact', head: true }).eq('bank_id', bankId),
        supabase.from('risk_assessments').select('*', { count: 'exact', head: true }).eq('bank_id', bankId),
        supabase.from('blockchain_transactions').select('*', { count: 'exact', head: true }).eq('user_id', bankId),
        supabase.from('support_tickets').select('*', { count: 'exact', head: true }).eq('user_id', bankId),
        supabase
          .from('financial_transactions')
          .select('*')
          .eq('user_id', bankId)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      const txList = txRes.data || [];

      // Comptage best-effort des documents dans le bucket de stockage réel
      let documentsCount = 0;
      try {
        const { data: files } = await supabase.storage
          .from('documents')
          .list('', { limit: 1000 });
        documentsCount = Array.isArray(files) ? files.length : 0;
      } catch (e) {
        documentsCount = 0;
      }

      setCounts({
        clients: clientsRes.count || 0,
        loans: loansRes.count || 0,
        guarantees: guaranteesRes.count || 0,
        transactions: txRes.error ? 0 : txList.length,
        tickets: ticketsRes.count || 0,
        certificates: blockchainRes.count || 0,
        riskAssessments: riskRes.count || 0,
        documents: documentsCount
      });

      setRecentTransactions(txList);
    } catch (error) {
      console.error('Erreur chargement services digitaux:', error);
      setCounts({
        clients: 0, loans: 0, guarantees: 0, transactions: 0,
        tickets: 0, certificates: 0, riskAssessments: 0, documents: 0
      });
      setRecentTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceIcon = (service) => service.icon;

  // Usage réel d'un service (ou null si aucune source réelle)
  const getServiceUsage = (service) =>
    service.usageKey ? (counts[service.usageKey] ?? 0) : null;

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
      case 'rejected':
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTransactionStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'approved': return 'Approuvé';
      case 'pending': return 'En cours';
      case 'rejected': return 'Rejeté';
      case 'failed': return 'Échec';
      default: return status || '—';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const ServiceCard = ({ service, onClick }) => {
    const ServiceIcon = getServiceIcon(service);
    const usage = getServiceUsage(service);

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
              <div className="text-sm">
                <span className="text-gray-600">Utilisations:</span>
                <span className="ml-2 font-semibold text-blue-600">
                  {usage === null ? '—' : usage.toLocaleString()}
                </span>
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

  // Répartition réelle des usages (uniquement des compteurs réels)
  const usageBreakdown = [
    { label: 'Documents', value: counts.documents, icon: FileText, color: 'text-blue-600' },
    { label: 'Certificats Blockchain', value: counts.certificates, icon: LinkIcon, color: 'text-green-600' },
    { label: 'Tickets Support', value: counts.tickets, icon: LifeBuoy, color: 'text-purple-600' }
  ];
  const usageBreakdownTotal = usageBreakdown.reduce((s, u) => s + (u.value || 0), 0);

  // Services disposant d'un compteur réel non nul (pour l'onglet Analytics)
  const servicesWithUsage = DIGITAL_SERVICES
    .map((s) => ({ ...s, usage: getServiceUsage(s) }))
    .filter((s) => s.usage !== null);
  const maxServiceUsage = Math.max(1, ...servicesWithUsage.map((s) => s.usage));

  return (
    <div className="space-y-6">
      {/* Header avec compteurs d'usage RÉELS */}
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
                  <p className="text-blue-600 text-sm font-medium">Clients Digitaux</p>
                  <p className="text-2xl font-bold text-blue-900">{counts.clients.toLocaleString()}</p>
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
                  <p className="text-green-600 text-sm font-medium">Dossiers de Crédit</p>
                  <p className="text-2xl font-bold text-green-900">{counts.loans.toLocaleString()}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
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
                  <p className="text-purple-600 text-sm font-medium">Certificats Blockchain</p>
                  <p className="text-2xl font-bold text-purple-900">{counts.certificates.toLocaleString()}</p>
                </div>
                <LinkIcon className="h-8 w-8 text-purple-600" />
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
                  <p className="text-yellow-600 text-sm font-medium">Tickets Support</p>
                  <p className="text-2xl font-bold text-yellow-900">{counts.tickets.toLocaleString()}</p>
                </div>
                <LifeBuoy className="h-8 w-8 text-yellow-600" />
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
                {DIGITAL_SERVICES.map((service) => (
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
                <Button size="sm" onClick={loadDigitalData} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
              </div>

              <div className="space-y-4">
                {recentTransactions.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center text-gray-500">
                      <Activity className="h-8 w-8 mx-auto mb-3 text-gray-300" />
                      Aucune transaction pour le moment
                    </CardContent>
                  </Card>
                ) : (
                  recentTransactions.map((transaction) => {
                    const amount = Number(transaction.amount) || 0;
                    const label = transaction.description
                      || transaction.category
                      || transaction.transaction_type
                      || transaction.type
                      || 'Transaction';
                    return (
                      <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <Activity className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{label}</h4>
                                <p className="text-sm text-gray-600">
                                  {transaction.client_name || '—'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatDate(transaction.created_at)}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              {amount > 0 && (
                                <div className="text-lg font-semibold text-green-600 mb-1">
                                  {(amount / 1000000).toFixed(1)}M {transaction.currency || 'CFA'}
                                </div>
                              )}
                              <div className={`text-sm font-medium ${getTransactionStatusColor(transaction.status)}`}>
                                {getTransactionStatusLabel(transaction.status)}
                              </div>
                              {transaction.category && (
                                <div className="text-xs text-gray-500">
                                  {transaction.category}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
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
                    {servicesWithUsage.length === 0 ? (
                      <p className="text-sm text-gray-500 py-4 text-center">
                        Aucune donnée d'usage disponible
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {servicesWithUsage.map((service) => (
                          <div key={service.id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">{service.name}</span>
                              <span className="font-semibold">{service.usage.toLocaleString()}</span>
                            </div>
                            <Progress
                              value={(service.usage / maxServiceUsage) * 100}
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <PieChart className="h-5 w-5 text-green-600" />
                      <span>Répartition des Usages</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usageBreakdownTotal === 0 ? (
                      <p className="text-sm text-gray-500 py-4 text-center">
                        Aucun usage enregistré
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {usageBreakdown.map((item) => {
                          const ItemIcon = item.icon;
                          const pct = usageBreakdownTotal > 0
                            ? (item.value / usageBreakdownTotal) * 100
                            : 0;
                          return (
                            <div key={item.label} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <ItemIcon className={`h-4 w-4 ${item.color}`} />
                                  <span className="text-sm text-gray-600">{item.label}</span>
                                </div>
                                <span className="font-semibold">{item.value.toLocaleString()}</span>
                              </div>
                              <Progress value={pct} className="h-2" />
                            </div>
                          );
                        })}
                      </div>
                    )}
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
                    <p className="text-sm text-gray-600 mb-4">Assistance pour les services digitaux</p>
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
                <LifeBuoy className="h-4 w-4" />
                <AlertTitle>Tickets de support</AlertTitle>
                <AlertDescription>
                  {counts.tickets > 0
                    ? `${counts.tickets.toLocaleString()} ticket(s) de support enregistré(s) pour votre établissement.`
                    : "Aucun ticket de support ouvert pour le moment."}
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
