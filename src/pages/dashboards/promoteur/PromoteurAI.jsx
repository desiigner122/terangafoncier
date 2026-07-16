import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import {
  MessageSquare,
  Bot,
  Send,
  FileText,
  Settings,
  Lightbulb,
  BarChart3,
  Target,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain,
  Filter,
  Download,
  Loader2
} from 'lucide-react';

const PromoteurAI = () => {
  const { user } = useAuth();

  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Conversation réelle (ai_chat_history : user_id, role, content, confidence, created_at)
  const [conversation, setConversation] = useState([]);
  // Analyses IA réelles (ai_analyses : user_id, property_id, result jsonb, created_at)
  const [aiAnalyses, setAiAnalyses] = useState([]);
  // Métriques dérivées de données réelles ; null => état honnête "—"
  const [aiMetrics, setAiMetrics] = useState({
    totalAnalyses: 0,
    scoredProperties: 0,
    accuracy: null
  });

  const formatTime = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Analyses IA réelles du promoteur
      const { data: analysesData } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const analyses = (analysesData || []).map((a) => {
        const r = a.result || {};
        return {
          id: a.id,
          title: r.title || r.name || 'Analyse IA',
          description: r.description || r.summary || '',
          confidence: typeof r.confidence === 'number' ? r.confidence : null,
          status: r.status || 'Disponible',
          insights: Array.isArray(r.insights) ? r.insights : [],
          actions: Array.isArray(r.actions) ? r.actions : [],
          lastUpdate: a.created_at,
          raw: r
        };
      });
      setAiAnalyses(analyses);

      // Score IA moyen réel sur les annonces du promoteur (properties.ai_score)
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('ai_score')
        .eq('owner_id', user.id);

      const scored = (propertiesData || []).filter(
        (p) => typeof p.ai_score === 'number' && p.ai_score !== null
      );
      const avgScore = scored.length
        ? Math.round(scored.reduce((s, p) => s + p.ai_score, 0) / scored.length)
        : null;

      setAiMetrics({
        totalAnalyses: analyses.length,
        scoredProperties: scored.length,
        accuracy: avgScore
      });

      // Historique de conversation réel
      const { data: chatData } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      const chat = (chatData || []).map((c) => ({
        id: c.id,
        type: c.role === 'assistant' || c.role === 'ai' ? 'ai' : 'user',
        message: c.content,
        timestamp: formatTime(c.created_at),
        avatar: c.role === 'assistant' || c.role === 'ai' ? '🤖' : '👤'
      }));
      setConversation(chat);
    } catch (e) {
      setAiAnalyses([]);
      setConversation([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id || sending) return;
    setSending(true);

    const content = message.trim();
    const localMessage = {
      id: `local-${Date.now()}`,
      type: 'user',
      message: content,
      timestamp: formatTime(new Date().toISOString()),
      avatar: '👤'
    };
    setConversation((prev) => [...prev, localMessage]);
    setMessage('');

    try {
      // On enregistre le message réel de l'utilisateur.
      // Aucune réponse IA n'est fabriquée : le moteur conversationnel n'est pas encore branché.
      await supabase.from('ai_chat_history').insert({
        user_id: user.id,
        role: 'user',
        content
      });
    } catch (e) {
      // silencieux : le message reste affiché localement
    } finally {
      setSending(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Nouveau': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Assistant IA Promoteur</h1>
            <p className="text-gray-600">Intelligence artificielle pour optimiser vos projets immobiliers</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-100 text-purple-800">
              <Brain className="w-3 h-3 mr-1" />
              {aiMetrics.accuracy !== null ? `${aiMetrics.accuracy}% score IA moyen` : 'Score IA —'}
            </Badge>
            <Button>
              <Sparkles className="w-4 h-4 mr-2" />
              Nouvelle analyse
            </Button>
          </div>
        </div>

        {/* Métriques IA (données réelles ; état honnête quand pas de source) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Analyses Réalisées</p>
                  <p className="text-2xl font-bold text-gray-900">{aiMetrics.totalAnalyses}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-purple-600 font-medium">
                  {aiMetrics.scoredProperties} annonces analysées
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Temps Économisé</p>
                  <p className="text-2xl font-bold text-gray-900">—</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500 font-medium">
                  Bientôt disponible
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coûts Optimisés</p>
                  <p className="text-2xl font-bold text-gray-900">—</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-500 font-medium">
                  Bientôt disponible
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Score IA Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {aiMetrics.accuracy !== null ? `${aiMetrics.accuracy}%` : '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                {aiMetrics.accuracy !== null ? (
                  <>
                    <Progress value={aiMetrics.accuracy} className="h-2" />
                    <span className="text-xs text-gray-500 mt-1">Sur vos annonces analysées</span>
                  </>
                ) : (
                  <span className="text-xs text-gray-500">Aucune annonce analysée</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat IA
            </TabsTrigger>
            <TabsTrigger value="analyses" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analyses
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configuration
            </TabsTrigger>
          </TabsList>

          {/* Chat IA */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-purple-600" />
                  Assistant IA Promoteur
                </CardTitle>
                <CardDescription>
                  Vos messages sont enregistrés. Le moteur de réponse conversationnel est bientôt disponible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Zone de conversation */}
                <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
                  {loading ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Chargement...
                    </div>
                  ) : conversation.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                      <Bot className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="text-sm">Aucune conversation pour le moment.</p>
                      <p className="text-xs text-gray-400 mt-1">Posez votre première question ci-dessous.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversation.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-200'
                          }`}>
                            <div className="flex items-start space-x-2">
                              <span className="text-lg">{msg.avatar}</span>
                              <div className="flex-1">
                                <p className="text-sm whitespace-pre-line">{msg.message}</p>
                                <p className={`text-xs mt-1 ${
                                  msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {msg.timestamp}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Tapez votre message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                    disabled={sending}
                  />
                  <Button onClick={handleSendMessage} disabled={sending || !message.trim()}>
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Suggestions rapides (pré-remplissage du champ) */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Suggestions :</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Analyse ROI projets',
                      'Optimisation coûts',
                      'Prévisions ventes',
                      'Benchmark concurrence',
                      'Satisfaction clients'
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setMessage(suggestion)}
                        className="text-xs"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analyses IA */}
          <TabsContent value="analyses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Analyses IA Disponibles</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-12 flex items-center justify-center text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Chargement...
                  </div>
                ) : aiAnalyses.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    <Brain className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium">Aucune analyse IA disponible</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Vos analyses apparaîtront ici dès qu'elles seront générées.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {aiAnalyses.map((analysis) => (
                      <motion.div
                        key={analysis.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="border rounded-lg p-6 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => setSelectedAnalysis(analysis)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                              <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{analysis.title}</h3>
                              {analysis.description && (
                                <p className="text-sm text-gray-600">{analysis.description}</p>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(analysis.status)}>
                            {analysis.status}
                          </Badge>
                        </div>

                        {/* Niveau de confiance (réel si présent dans result) */}
                        {analysis.confidence !== null && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Confiance IA</span>
                              <span className="font-medium">{analysis.confidence}%</span>
                            </div>
                            <Progress value={analysis.confidence} className="h-2" />
                          </div>
                        )}

                        {/* Insights clés */}
                        {analysis.insights.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Insights clés :</p>
                            <ul className="space-y-1">
                              {analysis.insights.slice(0, 2).map((insight, index) => (
                                <li key={index} className="text-xs text-gray-600 flex items-start">
                                  <CheckCircle className="w-3 h-3 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                                  {typeof insight === 'string' ? insight : JSON.stringify(insight)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Actions recommandées */}
                        {analysis.actions.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Actions recommandées :</p>
                            <div className="flex flex-wrap gap-1">
                              {analysis.actions.slice(0, 2).map((action, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {typeof action === 'string' ? action : JSON.stringify(action)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {analysis.lastUpdate
                              ? `Mis à jour: ${new Date(analysis.lastUpdate).toLocaleDateString('fr-FR')}`
                              : ''}
                          </span>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <ArrowRight className="w-4 h-4 mr-1" />
                            Voir détails
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suggestions IA */}
          <TabsContent value="suggestions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                  Recommandations IA
                </CardTitle>
                <CardDescription>
                  Suggestions personnalisées pour optimiser vos performances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-12 text-center text-gray-500">
                  <Lightbulb className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-medium">Bientôt disponible</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Le moteur de recommandations personnalisées est en cours de préparation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration IA */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration de l'IA</CardTitle>
                <CardDescription>
                  Personnalisez les paramètres de votre assistant IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Modèles */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Modèles IA</h3>
                    <div className="py-8 text-center text-gray-500 border rounded-lg">
                      <Settings className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-medium">Bientôt disponible</p>
                      <p className="text-xs text-gray-400 mt-1">
                        La gestion des modèles sera activée prochainement.
                      </p>
                    </div>
                  </div>

                  {/* Récapitulatif réel */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Vos données IA</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{aiMetrics.totalAnalyses}</p>
                        <p className="text-sm text-purple-700">Analyses enregistrées</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{aiMetrics.scoredProperties}</p>
                        <p className="text-sm text-blue-700">Annonces avec score IA</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Détail analyse sélectionnée */}
        {selectedAnalysis && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedAnalysis(null)}
          >
            <Card className="max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  {selectedAnalysis.title}
                </CardTitle>
                {selectedAnalysis.description && (
                  <CardDescription>{selectedAnalysis.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedAnalysis.insights.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Insights :</p>
                    <ul className="space-y-1">
                      {selectedAnalysis.insights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {typeof insight === 'string' ? insight : JSON.stringify(insight)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button variant="outline" className="w-full" onClick={() => setSelectedAnalysis(null)}>
                  Fermer
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
  );
};

export default PromoteurAI;
