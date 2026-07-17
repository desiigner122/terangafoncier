import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Activity,
  MessageSquare,
  Send,
  Bot,
  TrendingUp,
  Info,
  CheckCircle,
  Zap,
  Target,
  Eye,
  RefreshCw,
  Lightbulb,
  Sparkles,
  Cpu,
  Clock,
  DollarSign,
  MapPin,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const BanqueAI = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // Données réelles
  const [analyses, setAnalyses] = useState([]);      // ai_analyses
  const [properties, setProperties] = useState([]);  // properties évaluées (ai_score / estimated_value)

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear()
      && d.getMonth() === now.getMonth()
      && d.getDate() === now.getDate();
  };

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // 1) Analyses IA de la banque
      const analysesRes = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // 2) Historique de conversation IA
      const chatRes = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      // 3) Biens liés aux dossiers de la banque (pour les scores/estimations IA réels)
      const loansRes = await supabase
        .from('loans')
        .select('property_id')
        .eq('bank_id', user.id);

      const propertyIds = Array.from(
        new Set((loansRes.data || []).map(l => l.property_id).filter(Boolean))
      );

      let props = [];
      if (propertyIds.length > 0) {
        const propsRes = await supabase
          .from('properties')
          .select('id, title, name, location, region, city, ai_score, estimated_value, market_value, price')
          .in('id', propertyIds);
        props = propsRes.data || [];
      }

      setAnalyses(analysesRes.data || []);
      setProperties(props);

      const mappedChat = (chatRes.data || []).map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.created_at ? new Date(m.created_at) : new Date()
      }));
      setChatHistory(mappedChat);
    } catch (err) {
      console.error('Erreur chargement BanqueAI:', err);
      setAnalyses([]);
      setProperties([]);
      setChatHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Statistiques dérivées de données RÉELLES
  const totalAnalyses = analyses.length;
  const analysesToday = analyses.filter(a => isToday(a.created_at)).length;
  const scoredProps = properties.filter(p => p.ai_score !== null && p.ai_score !== undefined);
  const evaluatedProps = properties.length;
  const avgAiScore = scoredProps.length > 0
    ? Math.round(scoredProps.reduce((s, p) => s + (Number(p.ai_score) || 0), 0) / scoredProps.length)
    : null;
  const totalEstimated = properties.reduce(
    (s, p) => s + (Number(p.estimated_value) || Number(p.market_value) || 0), 0
  );

  const formatCurrency = (value) => {
    const num = Number(value) || 0;
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}Md XOF`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M XOF`;
    return `${num.toLocaleString('fr-FR')} XOF`;
  };

  const predefinedQuestions = [
    "Quel est le risque de défaut sur mon portefeuille terrain ?",
    "Comment optimiser la diversification géographique ?",
    "Quelle est la tendance du marché foncier à Dakar ?",
    "Quel LTV recommander pour un terrain commercial ?"
  ];

  const NO_AI_MESSAGE = "L'assistant conversationnel IA n'est pas encore connecté à un moteur de génération. "
    + "Votre question a bien été enregistrée. Les analyses IA disponibles (scores et estimations) "
    + "sont consultables dans les onglets \"Analyses IA\" et \"Évaluations foncières\".";

  const handleSendMessage = async () => {
    const text = chatMessage.trim();
    if (!text || !user?.id) return;

    const userMessage = { role: 'user', content: text, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsSending(true);

    try {
      // Persistance réelle de la question dans ai_chat_history
      await supabase.from('ai_chat_history').insert({
        user_id: user.id,
        role: 'user',
        content: text
      });
    } catch (err) {
      console.error('Erreur enregistrement message IA:', err);
    }

    // Réponse honnête : aucune intégration LLM disponible (pas de fabrication)
    const aiResponse = {
      role: 'assistant',
      content: NO_AI_MESSAGE,
      timestamp: new Date(),
      info: true
    };
    setChatHistory(prev => [...prev, aiResponse]);
    setIsSending(false);
  };

  const handlePredefinedQuestion = (question) => {
    setChatMessage(question);
  };

  const getRiskLabel = (result) => {
    if (!result) return null;
    return result.risk_level || result.riskLevel || result.recommendation || result.summary || null;
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Intelligence Artificielle</h2>
          <p className="text-gray-600 mt-1">
            Analyses IA, scores et estimations foncières de votre portefeuille
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques IA (données réelles) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Analyses IA</p>
                <p className="text-xl font-bold">{loading ? '—' : totalAnalyses.toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Aujourd'hui</p>
                <p className="text-xl font-bold">{loading ? '—' : analysesToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Biens évalués</p>
                <p className="text-xl font-bold">{loading ? '—' : evaluatedProps}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Score IA moyen</p>
                <p className="text-xl font-bold">{loading || avgAiScore === null ? '—' : `${avgAiScore}/100`}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Valeur estimée</p>
                <p className="text-xl font-bold">{loading || totalEstimated === 0 ? '—' : formatCurrency(totalEstimated)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat">Assistant IA</TabsTrigger>
          <TabsTrigger value="analyses">Analyses IA</TabsTrigger>
          <TabsTrigger value="evaluations">Évaluations foncières</TabsTrigger>
        </TabsList>

        {/* --- Assistant IA (honnête, sans fabrication) --- */}
        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Assistant IA
                  </CardTitle>
                  <CardDescription>
                    Posez vos questions. Vos messages sont enregistrés dans votre historique.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {chatHistory.length === 0 && (
                      <div className="text-center text-gray-500 py-8">
                        <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Aucune conversation pour le moment.</p>
                        <p className="text-sm">La génération de réponses IA sera bientôt disponible.</p>
                      </div>
                    )}

                    {chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border shadow-sm'
                        }`}>
                          {message.role === 'assistant' && (
                            <div className="flex items-center mb-2">
                              <Info className="h-4 w-4 mr-2 text-amber-600" />
                              <span className="text-xs text-gray-500">Assistant IA</span>
                            </div>
                          )}
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.timestamp instanceof Date
                              ? message.timestamp.toLocaleTimeString()
                              : ''}
                          </p>
                        </div>
                      </div>
                    ))}

                    {isSending && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm p-3 rounded-lg">
                          <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Tapez votre question..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isSending || !chatMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                    Questions Suggérées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {predefinedQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePredefinedQuestion(question)}
                        className="w-full text-left justify-start h-auto p-3 text-wrap"
                      >
                        <div className="text-xs">{question}</div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* --- Analyses IA (ai_analyses réel) --- */}
        <TabsContent value="analyses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-indigo-600" />
                Analyses IA récentes
              </CardTitle>
              <CardDescription>
                Analyses générées et enregistrées pour votre établissement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement...
                </div>
              ) : analyses.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune analyse IA enregistrée pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analyses.map((rec) => {
                    const label = getRiskLabel(rec.result);
                    return (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <Cpu className="h-4 w-4 text-indigo-600" />
                            <h3 className="font-semibold">
                              Analyse {rec.property_id ? `bien ${String(rec.property_id).slice(0, 8)}` : ''}
                            </h3>
                          </div>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {rec.created_at ? new Date(rec.created_at).toLocaleDateString('fr-FR') : '—'}
                          </span>
                        </div>
                        {label ? (
                          <p className="text-sm text-gray-600">{label}</p>
                        ) : rec.result ? (
                          <pre className="text-xs text-gray-500 whitespace-pre-wrap break-words">
                            {JSON.stringify(rec.result, null, 2)}
                          </pre>
                        ) : (
                          <p className="text-sm text-gray-400">Résultat non disponible</p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Évaluations foncières (properties.ai_score / estimated_value réels) --- */}
        <TabsContent value="evaluations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Évaluations foncières IA
              </CardTitle>
              <CardDescription>
                Scores IA et valeurs estimées des biens liés à vos dossiers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> Chargement...
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucun bien évalué pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {properties.map((p) => (
                    <div key={p.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">{p.title || p.name || 'Bien'}</h3>
                        {p.ai_score !== null && p.ai_score !== undefined && (
                          <Badge variant="outline">{p.ai_score}/100</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 flex items-center mb-3">
                        <MapPin className="h-3 w-3 mr-1" />
                        {[p.city, p.region].filter(Boolean).join(', ') || p.location || '—'}
                      </p>
                      {p.ai_score !== null && p.ai_score !== undefined && (
                        <Progress value={Number(p.ai_score)} className="h-2 mb-3" />
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Valeur estimée</span>
                        <span className="font-medium">
                          {p.estimated_value || p.market_value
                            ? formatCurrency(p.estimated_value || p.market_value)
                            : '—'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueAI;
