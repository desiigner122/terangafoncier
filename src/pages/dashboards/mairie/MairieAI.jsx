import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  MessageSquare,
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Download,
  Settings,
  Eye,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Message honnête : l'assistant conversationnel n'est relié à aucun moteur de génération.
const NO_AI_MESSAGE = "L'assistant conversationnel IA n'est pas encore connecté à un moteur de génération. "
  + "Votre question a bien été enregistrée. Les données IA disponibles (scores IA des demandes communales et "
  + "analyses enregistrées) sont consultables dans les onglets « Suggestions IA » et « Analyses Prédictives ».";

const MairieAI = ({ dashboardStats }) => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('assistant');
  const [aiQuery, setAiQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données réelles
  const [aiAnalyses, setAiAnalyses] = useState([]);   // ai_analyses (result jsonb)
  const [requests, setRequests] = useState([]);       // communal_requests (ai_score réel)

  const communeFilter = profile?.city || null;

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1) Analyses IA enregistrées de l'utilisateur
      const { data: analysesData } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const analyses = (analysesData || []).map((a) => {
        const r = a.result || {};
        return {
          id: a.id,
          type: r.type || 'Analyse IA',
          title: r.title || r.name || 'Analyse IA',
          result: r.result || r.summary || r.description || '',
          details: r.details || '',
          accuracy: typeof r.confidence === 'number' ? `${r.confidence}%`
            : (typeof r.accuracy === 'number' ? `${r.accuracy}%` : null),
          date: a.created_at,
          raw: r
        };
      });
      setAiAnalyses(analyses);

      // 2) Demandes communales (scores IA réels), filtrées par commune du profil si dispo
      let reqQuery = supabase
        .from('communal_requests')
        .select('id, applicant_name, commune, zone, type, surface, status, priority, ai_score, created_at')
        .order('ai_score', { ascending: false, nullsFirst: false });
      if (communeFilter) {
        reqQuery = reqQuery.eq('commune', communeFilter);
      }
      const { data: reqData } = await reqQuery;
      setRequests(reqData || []);

      // 3) Historique de conversation IA réel (ai_chat_history)
      const { data: chatData } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      const mappedChat = (chatData || []).map((m) => ({
        type: m.role === 'assistant' ? 'ai' : 'user',
        message: m.content,
        timestamp: m.created_at
          ? new Date(m.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          : ''
      }));
      setChatHistory(mappedChat);
    } catch (err) {
      console.error('Erreur chargement MairieAI:', err);
      setAiAnalyses([]);
      setRequests([]);
      setChatHistory([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, communeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Métriques dérivées de données RÉELLES (jamais fabriquées) ---
  const scoredRequests = requests.filter(
    (r) => r.ai_score !== null && r.ai_score !== undefined
  );
  const avgAiScore = scoredRequests.length
    ? Math.round(scoredRequests.reduce((s, r) => s + (Number(r.ai_score) || 0), 0) / scoredRequests.length)
    : null;
  const totalAnalyses = aiAnalyses.length;
  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const getCategoryColor = (category) => {
    switch (category) {
      case 'residentiel':
      case 'Résidentiel': return 'bg-blue-100 text-blue-800';
      case 'commercial':
      case 'Commercial': return 'bg-purple-100 text-purple-800';
      case 'agricole':
      case 'Agricole': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved': return 'Approuvée';
      case 'pending': return 'En attente';
      case 'rejected': return 'Rejetée';
      default: return status || '—';
    }
  };

  const getImpactColor = (priority) => {
    switch (priority) {
      case 'high':
      case 'Haute': return 'text-red-600';
      case 'medium':
      case 'Moyenne': return 'text-orange-600';
      case 'low':
      case 'Faible': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  // Enregistre la question dans ai_chat_history (pas de fausse réponse IA générée)
  const handleSendMessage = async () => {
    const text = aiQuery.trim();
    if (!text) return;

    const userMessage = {
      type: 'user',
      message: text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    const noticeMessage = {
      type: 'ai',
      message: NO_AI_MESSAGE,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    setChatHistory((prev) => [...prev, userMessage, noticeMessage]);
    setAiQuery('');

    // Persiste la question si l'utilisateur est authentifié (aucune réponse fabriquée)
    if (user?.id) {
      try {
        await supabase.from('ai_chat_history').insert({
          user_id: user.id,
          role: 'user',
          content: text
        });
      } catch (err) {
        console.error('Erreur enregistrement question IA:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Assistant IA Municipal</h2>
          <p className="text-gray-600 mt-1">
            Intelligence artificielle pour l'aide à la décision municipale
            {communeFilter ? ` — ${communeFilter}` : ''}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Badge className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            IA Active
          </Badge>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
        </div>
      </div>

      {/* Indicateurs IA (données réelles) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Analyses IA</p>
                <p className="text-2xl font-bold text-blue-600">{totalAnalyses}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score IA moyen</p>
                <p className="text-2xl font-bold text-green-600">
                  {avgAiScore !== null ? `${avgAiScore}%` : '—'}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Demandes évaluées</p>
                <p className="text-2xl font-bold text-purple-600">{scoredRequests.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Demandes en attente</p>
                <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs IA */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assistant">Assistant Conversationnel</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions IA</TabsTrigger>
          <TabsTrigger value="analyses">Analyses Prédictives</TabsTrigger>
          <TabsTrigger value="training">Formation IA</TabsTrigger>
        </TabsList>

        {/* Assistant Conversationnel */}
        <TabsContent value="assistant" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 text-purple-600 mr-2" />
                    Assistant IA Municipal
                  </CardTitle>
                  <CardDescription>
                    Posez vos questions sur la gestion municipale et foncière
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  {/* Zone de conversation */}
                  <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                    {chatHistory.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                        <Brain className="h-10 w-10 text-gray-300 mb-3" />
                        <p className="text-sm">Aucune conversation pour le moment.</p>
                        <p className="text-xs mt-1 max-w-sm">
                          Posez une question ci-dessous. Le moteur de réponse génératif n'est pas
                          encore connecté ; vos questions sont enregistrées.
                        </p>
                      </div>
                    ) : (
                      chatHistory.map((message, index) => (
                        <div key={index} className={`mb-4 ${
                          message.type === 'user' ? 'text-right' : 'text-left'
                        }`}>
                          <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                            message.type === 'user'
                              ? 'bg-teal-600 text-white rounded-br-none'
                              : 'bg-white border rounded-bl-none'
                          }`}>
                            {message.type === 'ai' && (
                              <div className="flex items-center space-x-2 mb-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-purple-100 text-purple-600">
                                    <Brain className="h-3 w-3" />
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-gray-600">Assistant IA</span>
                              </div>
                            )}
                            <div className="whitespace-pre-line text-sm">
                              {message.message}
                            </div>
                            <div className={`text-xs mt-1 ${
                              message.type === 'user' ? 'text-teal-200' : 'text-gray-500'
                            }`}>
                              {message.timestamp}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Interface de saisie */}
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Posez votre question à l'IA municipale..."
                        value={aiQuery}
                        onChange={(e) => setAiQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsListening(!isListening)}
                      className={isListening ? 'bg-red-100 text-red-600' : ''}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsSpeaking(!isSpeaking)}
                      className={isSpeaking ? 'bg-blue-100 text-blue-600' : ''}
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    <Button onClick={handleSendMessage} className="bg-teal-600 hover:bg-teal-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Raccourcis rapides */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Questions Rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    'Analyse des délais actuels',
                    'Prévisions demandes',
                    'Optimisation ressources',
                    'Zones à surveiller',
                    'Rapport mensuel',
                    'Indicateurs performance'
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left"
                      onClick={() => setAiQuery(question)}
                    >
                      <MessageSquare className="h-3 w-3 mr-2" />
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Suggestions IA → demandes communales à fort score IA (données réelles) */}
        <TabsContent value="suggestions" className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                Chargement des demandes évaluées par l'IA…
              </CardContent>
            </Card>
          ) : scoredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Aucune demande évaluée par l'IA
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Les demandes communales scorées par l'IA apparaîtront ici, classées par priorité.
                  Le moteur de suggestions proactives sera bientôt disponible.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {scoredRequests.slice(0, 12).map((req) => (
                <Card key={req.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getCategoryColor(req.type)}>
                            {req.type || 'Demande'}
                          </Badge>
                          <Badge className={getStatusColor(req.status)}>
                            {getStatusLabel(req.status)}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">
                          {req.applicant_name || 'Demandeur'}
                        </CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {req.ai_score !== null && req.ai_score !== undefined ? `${req.ai_score}%` : '—'}
                        </div>
                        <div className="text-xs text-gray-600">score IA</div>
                      </div>
                    </div>
                    <CardDescription>
                      Demande {req.type || ''} — {req.surface ? `${req.surface} m²` : 'surface n.c.'}
                      {req.zone ? `, zone ${req.zone}` : ''}
                      {req.commune ? `, ${req.commune}` : ''}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Priorité</span>
                        <p className={`font-medium ${getImpactColor(req.priority)}`}>
                          {req.priority || '—'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Déposée le</span>
                        <p className="font-medium text-gray-900">
                          {req.created_at ? new Date(req.created_at).toLocaleDateString('fr-FR') : '—'}
                        </p>
                      </div>
                    </div>

                    {req.ai_score !== null && req.ai_score !== undefined && (
                      <Progress value={req.ai_score} className="h-2" />
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Analyses Prédictives → ai_analyses réel */}
        <TabsContent value="analyses" className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                Chargement des analyses IA…
              </CardContent>
            </Card>
          ) : aiAnalyses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Aucune analyse IA enregistrée
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Les analyses prédictives générées apparaîtront ici dès qu'elles seront disponibles.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {aiAnalyses.map((analysis) => (
                <Card key={analysis.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="secondary">{analysis.type}</Badge>
                          {analysis.date && (
                            <span className="text-sm text-gray-600">
                              {new Date(analysis.date).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {analysis.title}
                        </h3>
                        {analysis.result && (
                          <p className="text-gray-700 mb-2">{analysis.result}</p>
                        )}
                        {analysis.details && (
                          <p className="text-sm text-gray-600">{analysis.details}</p>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-green-600">
                          {analysis.accuracy || '—'}
                        </div>
                        <div className="text-xs text-gray-600">confiance</div>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Formation IA */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <RefreshCw className="h-5 w-5 text-blue-600 mr-2" />
                Entraînement et Amélioration IA
              </CardTitle>
              <CardDescription>
                Suivi des données réelles alimentant l'assistant IA
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
                  <div className="text-sm text-gray-600">Demandes analysées</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {avgAiScore !== null ? `${avgAiScore}%` : '—'}
                  </div>
                  <div className="text-sm text-gray-600">Score IA moyen</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{totalAnalyses}</div>
                  <div className="text-sm text-gray-600">Analyses enregistrées</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                La configuration avancée de l'entraînement et l'apprentissage automatique
                seront bientôt disponibles.
              </div>

              <div className="space-y-4 opacity-60 pointer-events-none">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Apprentissage automatique</span>
                  <Switch disabled />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Suggestions proactives</span>
                  <Switch disabled />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Analyse prédictive avancée</span>
                  <Switch disabled />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notifications automatiques</span>
                  <Switch disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MairieAI;
