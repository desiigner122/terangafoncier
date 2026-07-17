import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  FileText,
  MessageSquare,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  Lightbulb,
  Target,
  Send,
  BookOpen,
  Scale,
  Users,
  Shield,
  Info
} from 'lucide-react';

import { useAuth } from '@/contexts/UnifiedAuthContext';
import supabase from '@/lib/supabaseClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Contenu ÉDITORIAL statique (présentation des fonctionnalités, ne prétend pas être une métrique).
const aiFeatures = [
  {
    id: 'document_analysis',
    title: 'Analyse de documents',
    description: 'Extraction automatique des clauses et vérification juridique',
    icon: FileText,
    color: 'bg-blue-100 text-blue-700',
    category: 'analysis'
  },
  {
    id: 'legal_assistant',
    title: 'Assistant juridique',
    description: 'Réponses instantanées aux questions légales complexes',
    icon: Scale,
    color: 'bg-purple-100 text-purple-700',
    category: 'assistance'
  },
  {
    id: 'risk_prediction',
    title: 'Prédiction des risques',
    description: 'Identification proactive des risques contractuels',
    icon: Shield,
    color: 'bg-red-100 text-red-700',
    category: 'analysis'
  },
  {
    id: 'drafting_helper',
    title: 'Aide à la rédaction',
    description: 'Suggestions automatiques pour optimiser les actes',
    icon: BookOpen,
    color: 'bg-emerald-100 text-emerald-700',
    category: 'assistance'
  },
  {
    id: 'client_insights',
    title: 'Insights clients',
    description: 'Analyse comportementale et prédiction de satisfaction',
    icon: Users,
    color: 'bg-amber-100 text-amber-700',
    category: 'analytics'
  },
  {
    id: 'compliance_check',
    title: 'Contrôle conformité',
    description: 'Vérification automatique des exigences réglementaires',
    icon: CheckCircle2,
    color: 'bg-green-100 text-green-700',
    category: 'analysis'
  }
];

// Suggestions éditoriales (exemples de questions), pas des métriques.
const sampleQueries = [
  'Quelles sont les clauses essentielles pour un acte de vente immobilière ?',
  'Comment optimiser les délais de traitement d\'une succession ?',
  'Quels sont les risques juridiques liés aux servitudes ?',
  'Analyse comparative : vente classique vs. vente en l\'état futur d\'achèvement',
  'Recommandations pour améliorer la satisfaction client',
  'Résumé des obligations fiscales pour une donation entre vifs'
];

const NotaireAIModernized = () => {
  useOutletContext();
  const { user } = useAuth();

  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('assistant');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiStats, setAiStats] = useState({
    totalQueries: 0,
    documentsAnalyzed: 0,
    avgConfidence: null
  });
  const [monthlyUsage, setMonthlyUsage] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadAIData();
    }
  }, [user]);

  // Reconnexion RÉELLE : ai_chat_history + ai_analyses filtrés par user.id.
  const loadAIData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [{ data: chatData }, { count: analysesCount }] = await Promise.all([
        supabase
          .from('ai_chat_history')
          .select('id, role, content, confidence, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true }),
        supabase
          .from('ai_analyses')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ]);

      const rows = chatData || [];

      // Historique de conversation réel
      const mapped = rows.map((m) => ({
        id: m.id,
        type: m.role === 'user' ? 'user' : 'ai',
        content: m.content,
        timestamp: m.created_at,
        confidence: m.confidence != null ? Number(m.confidence) : undefined
      }));
      setChatHistory(mapped);

      // Requêtes réellement posées par l'utilisateur
      const totalQueries = rows.filter((m) => m.role === 'user').length;

      // Confiance moyenne réelle des réponses IA enregistrées
      const confVals = rows
        .filter((m) => m.role !== 'user' && m.confidence != null)
        .map((m) => Number(m.confidence));
      const avgConfidence = confVals.length
        ? (() => {
            const raw = confVals.reduce((a, b) => a + b, 0) / confVals.length;
            return Math.round(raw <= 1 ? raw * 100 : raw);
          })()
        : null;

      setAiStats({
        totalQueries,
        documentsAnalyzed: analysesCount || 0,
        avgConfidence
      });

      // Utilisation par mois calculée à partir des requêtes réelles (6 derniers mois)
      const now = new Date();
      const buckets = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
          label: d.toLocaleDateString('fr-FR', { month: 'short' }),
          value: 0
        });
      }
      rows.forEach((m) => {
        if (m.role !== 'user' || !m.created_at) return;
        const k = String(m.created_at).substring(0, 7);
        const b = buckets.find((x) => x.key === k);
        if (b) b.value += 1;
      });
      setMonthlyUsage(buckets);
    } catch (error) {
      console.error('Erreur chargement données IA notaire:', error);
      setChatHistory([]);
      setAiStats({ totalQueries: 0, documentsAnalyzed: 0, avgConfidence: null });
      setMonthlyUsage([]);
    } finally {
      setLoading(false);
    }
  };

  // Aucune intégration LLM conversationnelle n'est branchée : on enregistre la question
  // dans ai_chat_history (réel) et on répond honnêtement sans fabriquer de contenu juridique.
  const handleSendQuery = async () => {
    if (!query.trim() || !user?.id) return;

    const content = query.trim();
    const userMessage = {
      id: `local-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    const notice = {
      id: `local-${Date.now() + 1}`,
      type: 'ai',
      content:
        "L'assistant conversationnel IA n'est pas encore connecté à un moteur de langage. " +
        'Votre question a bien été enregistrée et cette fonctionnalité sera bientôt disponible.',
      timestamp: new Date().toISOString()
    };

    setChatHistory((prev) => [...prev, userMessage, notice]);
    setQuery('');

    try {
      await supabase
        .from('ai_chat_history')
        .insert({ user_id: user.id, role: 'user', content });
      setAiStats((prev) => ({ ...prev, totalQueries: prev.totalQueries + 1 }));
    } catch (error) {
      console.error('Erreur enregistrement question IA:', error);
    }

    window.safeGlobalToast?.({
      title: 'Question enregistrée',
      description: 'L\'assistant conversationnel sera bientôt disponible.',
      variant: 'default'
    });
  };

  const handleSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const featuresByCategory = useMemo(() => {
    return aiFeatures.reduce((acc, feature) => {
      if (!acc[feature.category]) acc[feature.category] = [];
      acc[feature.category].push(feature);
      return acc;
    }, {});
  }, []);

  const maxUsage = Math.max(...monthlyUsage.map((b) => b.value), 1);
  const hasUsage = monthlyUsage.some((b) => b.value > 0);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Assistant IA Notarial</h2>
          <p className="text-gray-600">
            Intelligence artificielle au service de l'expertise juridique et de l'efficacité opérationnelle
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-100 text-purple-700 flex items-center gap-1">
            <Brain className="h-4 w-4" />
            Historique connecté
          </Badge>
          <Badge className="bg-slate-100 text-slate-700 flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            Moteur conversationnel bientôt disponible
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Requêtes traitées</CardTitle>
            <MessageSquare className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '—' : aiStats.totalQueries}</div>
            <p className="text-xs text-muted-foreground">Questions enregistrées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents analysés</CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{loading ? '—' : aiStats.documentsAnalyzed}</div>
            <p className="text-xs text-muted-foreground">Analyses IA enregistrées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temps de réponse</CardTitle>
            <Zap className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Bientôt disponible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Confiance moyenne</CardTitle>
            <Target className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            {aiStats.avgConfidence != null ? (
              <>
                <div className="text-3xl font-bold">{aiStats.avgConfidence}%</div>
                <Progress value={aiStats.avgConfidence} className="mt-2" />
              </>
            ) : (
              <>
                <div className="text-3xl font-bold">—</div>
                <p className="text-xs text-muted-foreground">Aucune analyse IA notée</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temps gagné</CardTitle>
            <TrendingUp className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">—</div>
            <p className="text-xs text-muted-foreground">Bientôt disponible</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full">
          <TabsTrigger value="assistant">Assistant conversationnel</TabsTrigger>
          <TabsTrigger value="features">Fonctionnalités IA</TabsTrigger>
          <TabsTrigger value="insights">Insights & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="assistant" className="space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Conversation avec l'assistant IA</CardTitle>
                <CardDescription>
                  Vos échanges enregistrés. Le moteur de réponse automatique sera bientôt disponible.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {chatHistory.length === 0 && !loading && (
                      <div className="h-[360px] flex flex-col items-center justify-center text-center text-gray-500">
                        <MessageSquare className="h-10 w-10 mb-3 text-gray-300" />
                        <p className="text-sm font-medium">Aucune conversation enregistrée</p>
                        <p className="text-xs">Posez une question pour démarrer votre historique.</p>
                      </div>
                    )}

                    {chatHistory.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.type === 'user'
                              ? 'bg-amber-100 text-gray-900'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.type === 'ai' && <Brain className="h-5 w-5 text-purple-600 mt-1" />}
                            <div className="flex-1">
                              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                {formatDate(message.timestamp)}
                                {message.confidence != null && (
                                  <Badge variant="outline" className="text-xs">
                                    Confiance:{' '}
                                    {Math.round(
                                      message.confidence <= 1
                                        ? message.confidence * 100
                                        : message.confidence
                                    )}
                                    %
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Posez votre question juridique..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendQuery();
                        }
                      }}
                      rows={3}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendQuery}
                      disabled={!query.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Assistant en cours d'intégration</AlertTitle>
                    <AlertDescription>
                      Le moteur de réponse automatique n'est pas encore connecté. Vos questions sont
                      enregistrées et l'assistant y répondra dès sa mise en service.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questions fréquentes</CardTitle>
                <CardDescription>Exemples de requêtes pour démarrer</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {sampleQueries.map((sampleQuery, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3 px-4"
                        onClick={() => handleSampleQuery(sampleQuery)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="text-sm">{sampleQuery}</span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 mt-4">
          <Alert className="bg-purple-50 border-purple-200">
            <Brain className="h-4 w-4 text-purple-600" />
            <AlertTitle className="text-purple-900">Fonctionnalités en préparation</AlertTitle>
            <AlertDescription className="text-purple-800">
              Ces modules d'intelligence artificielle, dédiés au droit notarial sénégalais, seront
              progressivement activés. La présentation ci-dessous est indicative.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {Object.entries(featuresByCategory).map(([category, features]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
                  {category === 'analysis' && 'Analyse & Vérification'}
                  {category === 'assistance' && 'Assistance & Rédaction'}
                  {category === 'analytics' && 'Analytics & Prédiction'}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <Card
                        key={feature.id}
                        className="hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedFeature(feature)}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${feature.color}`}>
                              <FeatureIcon className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-base">{feature.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                          <Button variant="outline" size="sm" className="mt-4 w-full" disabled>
                            Bientôt disponible
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4 mt-4">
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Utilisation de l'IA par mois</CardTitle>
                <CardDescription>Requêtes enregistrées (6 derniers mois)</CardDescription>
              </CardHeader>
              <CardContent>
                {hasUsage ? (
                  <div className="h-64 flex items-end gap-3">
                    {monthlyUsage.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center justify-end">
                        <div
                          className="w-full rounded-t-md bg-gradient-to-t from-purple-500 to-purple-300"
                          style={{ height: `${(item.value / maxUsage) * 100}%` }}
                        />
                        <div className="mt-2 text-xs text-gray-700 capitalize">{item.label}</div>
                        <Badge className="mt-1 bg-slate-100 text-slate-700" variant="secondary">
                          {item.value}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500">
                    <MessageSquare className="h-10 w-10 mb-3 text-gray-300" />
                    <p className="text-sm">Aucune requête enregistrée sur la période</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catégories de requêtes</CardTitle>
                <CardDescription>Répartition par type de question</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500">
                  <Target className="h-10 w-10 mb-3 text-gray-300" />
                  <p className="text-sm font-medium">Classification bientôt disponible</p>
                  <p className="text-xs">
                    La catégorisation automatique des requêtes n'est pas encore active.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Impact et bénéfices mesurés</CardTitle>
              <CardDescription>Gains d'efficacité grâce à l'IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center text-center text-gray-500 py-10">
                <Lightbulb className="h-10 w-10 mb-3 text-gray-300" />
                <p className="text-sm font-medium">Mesure d'impact bientôt disponible</p>
                <p className="text-xs max-w-md mt-1">
                  Les indicateurs de gains (délais, précision, productivité) seront calculés à partir
                  de vos données réelles une fois l'assistant pleinement opérationnel.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default NotaireAIModernized;
