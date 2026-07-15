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
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { supabase } from '@/lib/supabaseClient';
import ParticulierSupabaseService from '@/services/ParticulierSupabaseService';

// ===== Helpers de classification de statut (aucune donnée fabriquée) =====
const EN_COURS = ['pending', 'en_cours', 'en cours', 'en_attente', 'en attente', 'attente', 'submitted', 'in_progress', 'processing', 'nouveau', 'new', 'review', 'traitement'];
const ACCEPTE = ['accepted', 'acceptee', 'acceptée', 'approved', 'approuve', 'approuvé', 'approuvée', 'completed', 'complete', 'validated', 'valide', 'validé', 'validée', 'termine', 'terminé', 'terminée', 'signed'];
const REFUSE = ['rejected', 'refusee', 'refusée', 'refused', 'cancelled', 'canceled', 'annule', 'annulee', 'annulée', 'declined'];
const DOC_VALIDE = ['valide', 'validé', 'validée', 'validated', 'approved', 'approuve', 'approuvé', 'verified', 'verifie', 'vérifié', 'active', 'signed'];

const classify = (status) => {
  const s = (status || '').toString().toLowerCase().trim();
  if (ACCEPTE.includes(s)) return 'accepte';
  if (REFUSE.includes(s)) return 'refuse';
  if (EN_COURS.includes(s)) return 'encours';
  return 'autre';
};

const EMPTY_ANALYTICS = {
  overview: { totalDemandes: 0, demandesEnCours: 0, demandesAcceptees: 0, demandesRefusees: 0, tauxSucces: 0, documentsTotal: 0 },
  activiteMensuelle: [],
  repartitionTypes: [],
  performances: { documentsValides: 0, documentsTotal: 0, messagesTotal: 0, demandesEnCours: 0, favoris: 0 },
  tendances: [],
  tendanceDelta: null,
  objectifs: {},
  insights: []
};

const ParticulierAnalytics = () => {
  const { user, profile } = useOutletContext();
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (user?.id) loadAnalytics();
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Sources RÉELLES : communal_requests, construction_requests, demandes_financement,
      // documents, favorites (via ParticulierSupabaseService) + messages (sender_id).
      const [communalRes, constructionRes, financingRes, documentsRes, favoritesRes] = await Promise.all([
        ParticulierSupabaseService.getCommunalRequests(user.id),
        ParticulierSupabaseService.getConstructionRequests(user.id),
        ParticulierSupabaseService.getFinancingRequests(user.id),
        ParticulierSupabaseService.getDocuments(user.id),
        ParticulierSupabaseService.getFavorites(user.id)
      ]);

      const communal = communalRes?.data || [];
      const construction = constructionRes?.data || [];
      const financing = financingRes?.data || [];
      const documents = documentsRes?.data || [];
      const favoris = favoritesRes?.data || [];

      // Messages envoyés par l'utilisateur (table réelle 'messages')
      let messages = [];
      try {
        const { data: msgData } = await supabase
          .from('messages')
          .select('created_at')
          .eq('sender_id', user.id);
        messages = msgData || [];
      } catch (e) {
        messages = [];
      }

      // ===== Vue d'ensemble (toutes les demandes réelles de l'acheteur) =====
      const allDemandes = [...communal, ...construction, ...financing];
      const totalDemandes = allDemandes.length;
      let demandesEnCours = 0, demandesAcceptees = 0, demandesRefusees = 0;
      allDemandes.forEach(d => {
        const c = classify(d.status || d.statut);
        if (c === 'encours') demandesEnCours++;
        else if (c === 'accepte') demandesAcceptees++;
        else if (c === 'refuse') demandesRefusees++;
      });
      const tauxSucces = totalDemandes > 0 ? Math.round((demandesAcceptees / totalDemandes) * 100) : 0;

      // ===== Documents (validés vs total) =====
      const documentsTotal = documents.length;
      const documentsValides = documents.filter(d => DOC_VALIDE.includes((d.status || '').toString().toLowerCase().trim())).length;
      const documentsEnAttente = documents.filter(d => classify(d.status) === 'encours').length;

      // ===== Activité mensuelle réelle (6 derniers mois par created_at) =====
      const now = new Date();
      const monthBuckets = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthBuckets.push({
          key: `${d.getFullYear()}-${d.getMonth()}`,
          mois: d.toLocaleDateString('fr-FR', { month: 'short' }),
          demandes: 0,
          messages: 0,
          documents: 0
        });
      }
      const bucketOf = (dateStr) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        if (isNaN(d)) return null;
        return monthBuckets.find(b => b.key === `${d.getFullYear()}-${d.getMonth()}`);
      };
      allDemandes.forEach(x => { const b = bucketOf(x.created_at); if (b) b.demandes++; });
      messages.forEach(x => { const b = bucketOf(x.created_at); if (b) b.messages++; });
      documents.forEach(x => { const b = bucketOf(x.created_at); if (b) b.documents++; });
      const activiteMensuelle = monthBuckets.map(({ key, ...rest }) => rest);

      // ===== Répartition réelle par type de demande =====
      const repartitionTypes = [
        { name: 'Terrains Communaux', value: communal.length, color: '#3B82F6' },
        { name: 'Constructions', value: construction.length, color: '#10B981' },
        { name: 'Financement', value: financing.length, color: '#F59E0B' }
      ].filter(t => t.value > 0);

      // ===== Tendance d'activité réelle (événements par semaine, 6 dernières semaines) =====
      const weekBuckets = [];
      for (let i = 5; i >= 0; i--) {
        const start = new Date(now);
        start.setDate(now.getDate() - (i + 1) * 7);
        const end = new Date(now);
        end.setDate(now.getDate() - i * 7);
        weekBuckets.push({ start, end, periode: `S${6 - i}`, activite: 0 });
      }
      const countInWeeks = (dateStr) => {
        if (!dateStr) return;
        const d = new Date(dateStr);
        if (isNaN(d)) return;
        const wb = weekBuckets.find(w => d >= w.start && d < w.end);
        if (wb) wb.activite++;
      };
      allDemandes.forEach(x => countInWeeks(x.created_at));
      messages.forEach(x => countInWeeks(x.created_at));
      documents.forEach(x => countInWeeks(x.created_at));
      const tendances = weekBuckets.map(({ start, end, ...rest }) => rest);
      const firstWeek = tendances[0]?.activite || 0;
      const lastWeek = tendances[tendances.length - 1]?.activite || 0;
      const tendanceDelta = firstWeek > 0 ? Math.round(((lastWeek - firstWeek) / firstWeek) * 100) : null;

      // ===== Objectifs réels (ratios calculés, cible 100%) =====
      const profileFields = ['full_name', 'phone', 'email', 'address', 'city', 'region', 'nationality', 'profession', 'avatar_url'];
      const filled = profileFields.filter(f => profile && profile[f]).length;
      const profilComplete = profileFields.length > 0 ? Math.round((filled / profileFields.length) * 100) : 0;
      const objectifs = {
        profilComplete: { actuel: profilComplete, cible: 100 },
        documentsValides: { actuel: documentsTotal > 0 ? Math.round((documentsValides / documentsTotal) * 100) : 0, cible: 100 },
        tauxReussite: { actuel: tauxSucces, cible: 100 }
      };

      // ===== Insights dynamiques honnêtes (dérivés des vraies données) =====
      const insights = [];
      if (tendanceDelta !== null && tendanceDelta !== 0) {
        insights.push({
          type: tendanceDelta > 0 ? 'positif' : 'neutre',
          title: tendanceDelta > 0 ? 'Activité en hausse' : 'Activité en baisse',
          text: `Votre activité a ${tendanceDelta > 0 ? 'augmenté' : 'diminué'} de ${Math.abs(tendanceDelta)}% sur les 6 dernières semaines.`
        });
      }
      if (documentsEnAttente > 0) {
        insights.push({
          type: 'attention',
          title: 'Documents à valider',
          text: `${documentsEnAttente} document(s) en attente de validation. Complétez-les pour accélérer vos demandes.`
        });
      }
      if (demandesEnCours > 0) {
        insights.push({
          type: 'positif',
          title: 'Demandes en cours',
          text: `${demandesEnCours} demande(s) en cours de traitement.`
        });
      }
      if (profilComplete < 100) {
        insights.push({
          type: 'attention',
          title: 'Complétez votre profil',
          text: `Votre profil est complété à ${profilComplete}%. Un profil complet facilite le traitement de vos demandes.`
        });
      }

      setAnalytics({
        overview: { totalDemandes, demandesEnCours, demandesAcceptees, demandesRefusees, tauxSucces, documentsTotal },
        activiteMensuelle,
        repartitionTypes,
        performances: { documentsValides, documentsTotal, messagesTotal: messages.length, demandesEnCours, favoris: favoris.length },
        tendances,
        tendanceDelta,
        objectifs,
        insights
      });

    } catch (error) {
      console.error('Erreur chargement analytics:', error);
      setAnalytics(EMPTY_ANALYTICS);
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
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-slate-500">Communaux, construction & financement</span>
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
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm text-orange-600">{analytics.overview.demandesRefusees} refusée(s)</span>
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
                  <p className="text-sm font-medium text-slate-600">Documents</p>
                  <p className="text-3xl font-bold text-slate-900">{analytics.overview.documentsTotal}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-purple-600">{analytics.performances.documentsValides} validé(s)</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
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
              {analytics.repartitionTypes.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-16 text-slate-400">
                  <PieChart className="h-10 w-10 mb-3" />
                  <p className="text-sm">Aucune demande enregistrée pour l'instant</p>
                </div>
              ) : (
                <>
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
                </>
              )}
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
              {analytics.tendanceDelta !== null && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {analytics.tendanceDelta >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-indigo-600" />
                    )}
                    <span className="text-sm font-medium text-indigo-900">
                      {analytics.tendanceDelta >= 0 ? 'Progression' : 'Recul'} de {analytics.tendanceDelta >= 0 ? '+' : ''}{analytics.tendanceDelta}% sur la période
                    </span>
                  </div>
                </div>
              )}
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
                  tauxReussite: 'Taux de Réussite Demandes'
                };

                return (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        {labels[key] || key}
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

              {(() => {
                const vals = Object.values(analytics.objectifs);
                if (vals.length === 0) return null;
                const scoreGlobal = Math.round(vals.reduce((s, o) => s + o.actuel, 0) / vals.length);
                return (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">
                        Score global: {scoreGlobal}%
                      </span>
                    </div>
                  </div>
                );
              })()}
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
                  {formatNumber(analytics.performances.messagesTotal)}
                </div>
                <div className="text-sm text-green-700 mt-1">Messages Envoyés</div>
                <div className="text-xs text-green-600 mt-1">Sur la messagerie</div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {formatNumber(analytics.performances.demandesEnCours)}
                </div>
                <div className="text-sm text-orange-700 mt-1">Demandes en Cours</div>
                <div className="text-xs text-orange-600 mt-1">En attente de traitement</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {formatNumber(analytics.performances.favoris)}
                </div>
                <div className="text-sm text-purple-700 mt-1">Biens Favoris</div>
                <div className="text-xs text-purple-600 mt-1">Enregistrés</div>
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
            {analytics.insights.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-10 text-slate-400">
                <Eye className="h-8 w-8 mb-3" />
                <p className="text-sm">Pas encore assez d'activité pour générer des recommandations.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.insights.map((insight, index) => {
                  const styles = {
                    positif: { bg: 'bg-green-50', iconBg: 'bg-green-100', iconColor: 'text-green-600', title: 'text-green-900', text: 'text-green-700', Icon: CheckCircle },
                    attention: { bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', title: 'text-yellow-900', text: 'text-yellow-700', Icon: AlertTriangle },
                    neutre: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', title: 'text-blue-900', text: 'text-blue-700', Icon: TrendingUp }
                  };
                  const s = styles[insight.type] || styles.neutre;
                  const Icon = s.Icon;
                  return (
                    <div key={index} className={`flex items-start gap-3 p-4 ${s.bg} rounded-lg`}>
                      <div className={`p-2 ${s.iconBg} rounded-lg`}>
                        <Icon className={`h-4 w-4 ${s.iconColor}`} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${s.title}`}>{insight.title}</h4>
                        <p className={`text-sm ${s.text} mt-1`}>{insight.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParticulierAnalytics;