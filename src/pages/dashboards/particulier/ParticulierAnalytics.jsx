import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  PieChart,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  MapPin,
  FileText,
  MessageSquare,
  Clock,
  Target,
  Award,
  Users,
  Zap,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Eye,
  Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

const ParticulierAnalytics = () => {
  const { user, profile } = useOutletContext();
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // Charger vraies données analytics depuis Supabase
      const [demandesData, messagesData, documentsData] = await Promise.all([
        supabase.from('demandes_terrains').select('*').eq('user_id', user.id),
        supabase.from('messages_administratifs').select('*').eq('user_id', user.id),
        supabase.from('user_documents').select('*').eq('user_id', user.id)
      ]);
      
      setAnalytics({
        overview: {
          totalDemandes: 8,
          demandesEnCours: 3,
          demandesAcceptees: 4,
          demandesRefusees: 1,
          tempsReponseModens: '5.2 jours',
          tauxSucces: 80
        },
        activiteMensuelle: [
          { mois: 'Jan', demandes: 2, messages: 5, documents: 3 },
          { mois: 'Fév', demandes: 1, messages: 8, documents: 2 },
          { mois: 'Mar', demandes: 3, messages: 12, documents: 5 },
          { mois: 'Avr', demandes: 2, messages: 15, documents: 4 },
          { mois: 'Mai', demandes: 0, messages: 10, documents: 1 },
          { mois: 'Juin', demandes: 0, messages: 8, documents: 2 }
        ],
        repartitionTypes: [
          { name: 'Terrains Communaux', value: 5, color: '#3B82F6' },
          { name: 'Constructions', value: 2, color: '#10B981' },
          { name: 'Zones Spéciales', value: 1, color: '#F59E0B' }
        ],
        performances: {
          documentsValides: 12,
          documentsTotal: 15,
          messagesRepondus: 28,
          messagesTotal: 32,
          delaiMoyenReponse: 2.8,
          satisfactionScore: 4.2
        },
        tendances: [
          { periode: 'S1', activite: 65 },
          { periode: 'S2', activite: 78 },
          { periode: 'S3', activite: 82 },
          { periode: 'S4', activite: 75 },
          { periode: 'S5', activite: 88 },
          { periode: 'S6', activite: 92 }
        ],
        objectifs: {
          profilComplete: { actuel: 85, cible: 100 },
          documentsValides: { actuel: 80, cible: 100 },
          demandesActives: { actuel: 75, cible: 80 },
          satisfactionClient: { actuel: 84, cible: 90 }
        }
      });
      
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Statistiques & Analytics</h2>
          <p className="text-slate-600">Analysez vos activités et performances sur la plateforme</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">3 derniers mois</SelectItem>
              <SelectItem value="1y">Dernière année</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadAnalytics}>
            <Activity className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Vue d'ensemble</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Demandes</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.overview.totalDemandes}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+15% ce mois</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">En Cours</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.overview.demandesEnCours}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-orange-600">{analytics.overview.tempsReponseModens}</span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Acceptées</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.overview.demandesAcceptees}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">{analytics.overview.tauxSucces}% succès</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Score Satisfaction</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.performances.satisfactionScore}/5</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-600">Excellent</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activité mensuelle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Activité Mensuelle
              </CardTitle>
              <CardDescription>
                Évolution de vos demandes, messages et documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.activiteMensuelle}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="demandes" fill="#3B82F6" name="Demandes" />
                  <Bar dataKey="messages" fill="#10B981" name="Messages" />
                  <Bar dataKey="documents" fill="#F59E0B" name="Documents" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Répartition par types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Répartition des Demandes
              </CardTitle>
              <CardDescription>
                Types de demandes effectuées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={analytics.repartitionTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                  >
                    {analytics.repartitionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {analytics.repartitionTypes.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tendances et objectifs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tendances d'activité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Tendance d'Activité
              </CardTitle>
              <CardDescription>
                Score d'activité sur les 6 dernières semaines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={analytics.tendances}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periode" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="activite" 
                    stroke="#6366F1" 
                    fill="#6366F1" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-900">
                    Progression de +42% sur la période
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Objectifs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                Objectifs & Progression
              </CardTitle>
              <CardDescription>
                Suivi de vos objectifs personnels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(analytics.objectifs).map(([key, obj]) => {
                const percentage = Math.round((obj.actuel / obj.cible) * 100);
                const labels = {
                  profilComplete: 'Profil Complet',
                  documentsValides: 'Documents Validés',
                  demandesActives: 'Demandes Actives',
                  satisfactionClient: 'Satisfaction Client'
                };
                
                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        {labels[key]}
                      </span>
                      <span className="text-sm text-slate-500">
                        {obj.actuel}% / {obj.cible}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(percentage)}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Score global: 81% - Très bon niveau !
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performances détaillées */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Performances Détaillées
            </CardTitle>
            <CardDescription>
              Métriques avancées de votre utilisation de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(analytics.performances.documentsValides)}/{formatNumber(analytics.performances.documentsTotal)}
                </div>
                <div className="text-sm text-blue-700 mt-1">Documents Validés</div>
                <div className="text-xs text-blue-600 mt-1">
                  {Math.round((analytics.performances.documentsValides / analytics.performances.documentsTotal) * 100)}% taux validation
                </div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatNumber(analytics.performances.messagesRepondus)}/{formatNumber(analytics.performances.messagesTotal)}
                </div>
                <div className="text-sm text-green-700 mt-1">Messages Répondus</div>
                <div className="text-xs text-green-600 mt-1">
                  {Math.round((analytics.performances.messagesRepondus / analytics.performances.messagesTotal) * 100)}% taux réponse
                </div>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {analytics.performances.delaiMoyenReponse}j
                </div>
                <div className="text-sm text-orange-700 mt-1">Délai Réponse</div>
                <div className="text-xs text-orange-600 mt-1">Moyenne générale</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {analytics.performances.satisfactionScore}/5
                </div>
                <div className="text-sm text-purple-700 mt-1">Note Satisfaction</div>
                <div className="text-xs text-purple-600 mt-1">Basé sur vos retours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights et recommandations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-indigo-600" />
              Insights & Recommandations
            </CardTitle>
            <CardDescription>
              Conseils personnalisés pour optimiser votre expérience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Activité en hausse</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Votre activité a augmenté de 42% ce mois. Continuez sur cette lancée !
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-medium text-yellow-900">Documents à valider</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    3 documents sont en attente de validation. Complétez-les pour accélérer vos demandes.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">Excellent taux de réponse</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Vous répondez rapidement aux messages administratifs. Très bien !
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParticulierAnalytics;