import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Bot,
  Send,
  Mic,
  Paperclip,
  TrendingUp,
  Calculator,
  BarChart3,
  MapPin,
  Target,
  AlertTriangle,
  Lightbulb,
  FileText,
  Zap,
  Brain,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
// Layout géré par CompleteSidebarInvestisseurDashboard

const InvestisseurAI = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Données réelles
  const [chatMessages, setChatMessages] = useState([]);   // ai_chat_history (role, content, created_at)
  const [aiAnalyses, setAiAnalyses] = useState([]);        // ai_analyses (result jsonb, created_at, property)
  const [topProperties, setTopProperties] = useState([]);  // properties.ai_score / estimated_value

  // Catalogue d'outils IA : libellés statiques de la plateforme (aucune donnée fabriquée).
  const aiTools = [
    {
      id: 'market-analysis',
      title: 'Analyse de Marché',
      description: 'Prix moyens réels par région et valeur estimée des biens',
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-600',
      status: 'active'
    },
    {
      id: 'roi-calculator',
      title: 'Calculateur ROI',
      description: 'Estimation de rentabilité à partir de vos investissements',
      icon: Calculator,
      color: 'bg-green-100 text-green-600',
      status: 'active'
    },
    {
      id: 'risk-assessment',
      title: 'Évaluation des Risques',
      description: 'Analyse des niveaux de risque des opportunités',
      icon: AlertTriangle,
      color: 'bg-orange-100 text-orange-600',
      status: 'active'
    },
    {
      id: 'opportunity-finder',
      title: 'Détecteur d\'opportunités',
      description: 'Biens à fort score IA du catalogue',
      icon: Target,
      color: 'bg-purple-100 text-purple-600',
      status: 'active'
    },
    {
      id: 'portfolio-optimizer',
      title: 'Optimiseur de Portefeuille',
      description: 'Recommandations basées sur votre portefeuille',
      icon: Brain,
      color: 'bg-pink-100 text-pink-600',
      status: 'coming-soon'
    },
    {
      id: 'document-analyzer',
      title: 'Analyseur de Documents',
      description: 'Analyse automatique des contrats',
      icon: FileText,
      color: 'bg-indigo-100 text-indigo-600',
      status: 'coming-soon'
    }
  ];

  useEffect(() => {
    if (user?.id) {
      loadAIData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const loadAIData = async () => {
    setLoading(true);
    try {
      // Historique conversationnel réel (ai_chat_history : role, content, created_at)
      const { data: chatData, error: chatError } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (chatError) throw chatError;
      setChatMessages(chatData || []);

      // Analyses IA réelles (ai_analyses : result jsonb, created_at) + propriété liée si présente
      const { data: analysesData, error: analysesError } = await supabase
        .from('ai_analyses')
        .select('*, property:properties(id, title, name, location, region, ai_score, estimated_value, market_value, price)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (analysesError) throw analysesError;
      setAiAnalyses(analysesData || []);

      // Biens à fort score IA (properties.ai_score / estimated_value) — lecture publique du catalogue
      const { data: propsData, error: propsError } = await supabase
        .from('properties')
        .select('id, title, name, location, region, city, price, ai_score, estimated_value, market_value')
        .not('ai_score', 'is', null)
        .order('ai_score', { ascending: false })
        .limit(6);
      if (propsError) throw propsError;
      setTopProperties(propsData || []);
    } catch (error) {
      console.error('Erreur chargement données IA:', error);
      setChatMessages([]);
      setAiAnalyses([]);
      setTopProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    const content = message.trim();
    if (!content) return;
    if (!user?.id) {
      toast.error('Vous devez être connecté pour utiliser l\'assistant.');
      return;
    }

    setSending(true);
    try {
      // On enregistre RÉELLEMENT le message dans ai_chat_history.
      // Aucune intégration IA conversationnelle n'est câblée : on NE fabrique PAS de réponse.
      const { data, error } = await supabase
        .from('ai_chat_history')
        .insert({ user_id: user.id, role: 'user', content })
        .select()
        .single();
      if (error) throw error;

      setChatMessages(prev => [...prev, data]);
      setMessage('');
      toast('Message enregistré. La réponse automatique de l\'assistant arrive prochainement.', { icon: 'ℹ️' });
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Impossible d\'enregistrer votre message.');
    } finally {
      setSending(false);
    }
  };

  // Lecture sûre d'une analyse (result jsonb de forme variable)
  const readAnalysis = (analysis) => {
    const r = analysis?.result || {};
    const prop = analysis?.property;
    const title = r.title || r.type || (prop ? `Analyse : ${prop.title || prop.name}` : 'Analyse IA');
    const type = r.type || r.analysis_type || 'Analyse IA';
    const result = r.summary || r.message || r.recommendation || r.description || r.result || null;
    const score = typeof r.score === 'number' ? r.score
      : (typeof analysis?.confidence_score === 'number' ? analysis.confidence_score
      : (typeof prop?.ai_score === 'number' ? prop.ai_score : null));
    return { title, type, result, score, prop };
  };

  const formatXOF = (value) => {
    if (value === null || value === undefined || isNaN(value)) return null;
    return new Intl.NumberFormat('fr-FR').format(Math.round(value)) + ' XOF';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Statistiques réelles dérivées des analyses IA
  const now = new Date();
  const analysesThisMonth = aiAnalyses.filter((a) => {
    if (!a.created_at) return false;
    const d = new Date(a.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const scores = aiAnalyses.map((a) => readAnalysis(a).score).filter((s) => typeof s === 'number');
  const avgScore = scores.length ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : null;
  // Répartition réelle par type d'analyse
  const typeCounts = aiAnalyses.reduce((acc, a) => {
    const { type } = readAnalysis(a);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  const typeEntries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const maxTypeCount = typeEntries.length ? Math.max(...typeEntries.map(([, c]) => c)) : 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-100 text-green-800 text-xs">Actif</Badge>;
      case 'beta': return <Badge className="bg-blue-100 text-blue-800 text-xs">Bêta</Badge>;
      case 'coming-soon': return <Badge className="bg-gray-100 text-gray-800 text-xs">Bientôt</Badge>;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assistant IA Investissement</h1>
            <p className="text-gray-600">Intelligence artificielle pour optimiser vos investissements</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              <Zap className="w-3 h-3 mr-1" />
              IA Active
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Outils IA
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analyses
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Recommandations
            </TabsTrigger>
          </TabsList>

          {/* Chat IA */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="w-5 h-5 mr-2 text-blue-600" />
                      Assistant IA Investissement
                    </CardTitle>
                    <CardDescription>
                      Posez vos questions ; vos messages sont enregistrés, la réponse automatique arrive prochainement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Zone de chat */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {/* Message d'accueil (statique, pas une réponse IA fabriquée) */}
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-2 max-w-[80%]">
                          <Avatar className="w-8 h-8">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                          </Avatar>
                          <div className="rounded-lg p-3 bg-gray-100 text-gray-900">
                            <p className="text-sm whitespace-pre-line">Bonjour ! Je suis votre assistant IA investissement. Vos messages sont enregistrés ; la réponse automatique de l'assistant sera disponible prochainement.</p>
                          </div>
                        </div>
                      </div>

                      {loading ? (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Chargement de la conversation...
                        </div>
                      ) : (
                        chatMessages.map((chat) => (
                          <div
                            key={chat.id}
                            className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-start space-x-2 max-w-[80%] ${
                              chat.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                            }`}>
                              <Avatar className="w-8 h-8">
                                {chat.role !== 'user' ? (
                                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                  </div>
                                ) : (
                                  <AvatarFallback>
                                    {(user?.email || 'I').charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className={`rounded-lg p-3 ${
                                chat.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                <p className="text-sm whitespace-pre-line">{chat.content}</p>
                                <p className={`text-xs mt-1 ${
                                  chat.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {formatTime(chat.created_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Zone de saisie */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" disabled>
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 relative">
                          <Input
                            placeholder="Posez votre question sur vos investissements..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="pr-10"
                            disabled={sending}
                          />
                        </div>
                        <Button variant="outline" size="sm" disabled>
                          <Mic className="w-4 h-4" />
                        </Button>
                        <Button onClick={handleSendMessage} disabled={sending}>
                          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Suggestions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Questions Suggérées</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      'Analyse ma performance ce mois',
                      'Trouve-moi de nouvelles opportunités',
                      'Évalue le risque de mon portefeuille',
                      'Optimise ma stratégie fiscale',
                      'Compare les régions du Sénégal'
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-sm"
                        onClick={() => setMessage(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Outils IA */}
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiTools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${tool.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          {getStatusBadge(tool.status)}
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                        <Button
                          size="sm"
                          className="w-full"
                          disabled={tool.status === 'coming-soon'}
                        >
                          {tool.status === 'coming-soon' ? 'Bientôt disponible' : 'Utiliser'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Analyses */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyses Récentes</CardTitle>
                  <CardDescription>
                    Résultats de vos dernières analyses IA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Chargement...
                    </div>
                  ) : aiAnalyses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      Aucune analyse IA pour le moment.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {aiAnalyses.slice(0, 8).map((analysis) => {
                        const { title, type, result, score } = readAnalysis(analysis);
                        return (
                          <div key={analysis.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-gray-700">
                                {result || '—'}
                              </p>
                              <span className="text-xs text-gray-500">{formatDate(analysis.created_at)}</span>
                            </div>
                            {typeof score === 'number' && (
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-600">{score}% confiance</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité IA</CardTitle>
                  <CardDescription>
                    Statistiques de vos analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {avgScore !== null ? `${avgScore}%` : '—'}
                        </p>
                        <p className="text-xs text-gray-600">Score moyen IA</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{analysesThisMonth}</p>
                        <p className="text-xs text-gray-600">Analyses ce mois</p>
                      </div>
                    </div>

                    {typeEntries.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">
                        Aucune répartition disponible.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {typeEntries.map(([type, count], index) => {
                          const colors = ['bg-blue-600', 'bg-green-600', 'bg-orange-600', 'bg-purple-600'];
                          return (
                            <div key={type}>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>{type}</span>
                                <span>{count}</span>
                              </div>
                              <div className="bg-gray-200 rounded-full h-2">
                                <div
                                  className={`${colors[index % colors.length]} h-2 rounded-full`}
                                  style={{ width: `${maxTypeCount ? (count / maxTypeCount) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recommandations */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Biens à fort score IA</CardTitle>
                <CardDescription>
                  Opportunités du catalogue classées par score IA (properties.ai_score)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Chargement...
                  </div>
                ) : topProperties.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Aucun bien avec score IA disponible pour le moment.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topProperties.map((prop) => {
                      const estimated = formatXOF(prop.estimated_value ?? prop.market_value ?? prop.price);
                      const locationLabel = [prop.location, prop.city, prop.region].filter(Boolean)[0];
                      return (
                        <motion.div
                          key={prop.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <Target className="w-5 h-5 text-purple-600" />
                              <div>
                                <h4 className="font-semibold text-gray-900">{prop.title || prop.name || 'Bien'}</h4>
                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                  {locationLabel && (
                                    <>
                                      <MapPin className="w-3 h-3" />
                                      {locationLabel}
                                    </>
                                  )}
                                  {estimated && <span>· Valeur estimée : {estimated}</span>}
                                </p>
                              </div>
                            </div>
                            {typeof prop.ai_score === 'number' && (
                              <Badge className="bg-purple-100 text-purple-800">
                                Score IA {prop.ai_score}/100
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {estimated && (
                                <span className="text-sm font-medium text-green-600">
                                  {estimated}
                                </span>
                              )}
                            </div>
                            <Button size="sm" onClick={() => setActiveTab('analysis')}>
                              <ArrowUpRight className="w-4 h-4 mr-2" />
                              Analyser
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InvestisseurAI;
