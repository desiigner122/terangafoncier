import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Target,
  Search,
  Bot,
  Zap,
  DollarSign,
  MapPin,
  Building2,
  Eye,
  Heart,
  Calculator,
  Star,
  Send,
  Mic,
  Image,
  FileText,
  BarChart3,
  PieChart,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Lightbulb,
  Info,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierAI = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Données réelles
  const [chatMessages, setChatMessages] = useState([]); // ai_chat_history (role, content, created_at)
  const [aiAnalyses, setAiAnalyses] = useState([]);      // ai_analyses (result jsonb, created_at, property)

  // Suggestions IA : cartes d'action de navigation (pas de données fabriquées, contenu statique assumé)
  const aiSuggestions = [
    {
      id: 1,
      title: "Estimation automatique",
      description: "Estimez la valeur d'un bien à partir du score IA et de la valeur estimée de la plateforme",
      icon: Calculator,
      action: "Estimer un bien",
      category: "Évaluation"
    },
    {
      id: 2,
      title: "Recherche intelligente",
      description: "Trouvez le bien idéal selon vos critères",
      icon: Search,
      action: "Rechercher",
      category: "Recherche"
    },
    {
      id: 3,
      title: "Analyse de marché",
      description: "Tendances et opportunités dans votre secteur",
      icon: TrendingUp,
      action: "Analyser",
      category: "Marché"
    },
    {
      id: 4,
      title: "Conseils personnalisés",
      description: "Recommandations adaptées à votre profil",
      icon: Lightbulb,
      action: "Obtenir des conseils",
      category: "Conseil"
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
      // Historique conversationnel réel (ai_chat_history : role, content, confidence, created_at)
      // Pas de colonne session_id : on charge tout l'historique de l'utilisateur.
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
    } catch (error) {
      console.error('Erreur chargement données IA:', error);
      setChatMessages([]);
      setAiAnalyses([]);
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
      // On enregistre RÉELLEMENT le message de l'utilisateur dans ai_chat_history.
      // Aucune intégration OpenAI n'est câblée : on NE fabrique PAS de réponse IA.
      const { data, error } = await supabase
        .from('ai_chat_history')
        .insert({ user_id: user.id, role: 'user', content })
        .select()
        .single();
      if (error) throw error;

      setChatMessages(prev => [...prev, data]);
      setMessage('');
      toast('Message enregistré. La réponse automatique de l\'assistant sera disponible prochainement.', { icon: 'ℹ️' });
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Impossible d\'enregistrer votre message.');
    } finally {
      setSending(false);
    }
  };

  // Extraction sûre des champs d'une analyse (result jsonb de forme variable)
  const readAnalysis = (analysis) => {
    const r = analysis?.result || {};
    const prop = analysis?.property;
    const title = r.title || r.type || (prop ? `Analyse : ${prop.title || prop.name}` : 'Analyse IA');
    const messageText = r.summary || r.message || r.recommendation || r.description || null;
    const score = typeof r.score === 'number' ? r.score
      : (typeof prop?.ai_score === 'number' ? prop.ai_score : null);
    return { title, messageText, score, prop };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Assistant IA Immobilier</h1>
          <p className="text-slate-600 mt-1">Intelligence artificielle pour vos décisions immobilières</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            IA PRO Activée
          </Badge>
          <Button
            onClick={() => setActiveTab('chat')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Brain className="w-4 h-4 mr-2" />
            Nouvelle conversation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Chat IA
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-96">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    Conversation avec l'IA
                  </CardTitle>
                  <CardDescription>
                    Posez vos questions sur l'immobilier, je suis là pour vous aider
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col h-full p-0">
                  {/* Zone de chat */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-slate-100 rounded-2xl p-4 max-w-sm">
                          <p className="text-sm text-slate-800">Bonjour ! Je suis votre assistant IA immobilier. Vos messages sont enregistrés ; la réponse automatique arrive prochainement.</p>
                        </div>
                      </div>

                      {loading ? (
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Chargement de la conversation...
                        </div>
                      ) : (
                        chatMessages.map((msg) => (
                          msg.role === 'user' ? (
                            <div key={msg.id} className="flex items-start gap-3 justify-end">
                              <div className="bg-purple-600 text-white rounded-2xl p-4 max-w-sm">
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                          ) : (
                            <div key={msg.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                              <div className="bg-slate-100 rounded-2xl p-4 max-w-sm">
                                <p className="text-sm text-slate-800 whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                          )
                        ))
                      )}
                    </div>
                  </div>

                  {/* Input de chat */}
                  <div className="border-t p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <Textarea
                          placeholder="Posez votre question sur l'immobilier..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="resize-none pr-20"
                          rows={2}
                        />
                        <div className="absolute right-2 bottom-2 flex items-center gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" disabled>
                            <Mic className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" disabled>
                            <Image className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={sending || !message.trim()}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Note honnête : pas d'intégration conversationnelle temps réel */}
              <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                <span>
                  L'assistant conversationnel automatique n'est pas encore connecté. Vos messages sont enregistrés dans votre historique.
                  Les analyses IA déjà calculées par la plateforme (score IA, valeur estimée) sont consultables dans l'onglet « Insights ».
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('insights')}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Estimer un bien
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('suggestions')}>
                    <Search className="w-4 h-4 mr-2" />
                    Recherche intelligente
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('insights')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyse de marché
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('suggestions')}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Conseils quartier
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiSuggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <motion.div
                  key={suggestion.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="cursor-pointer hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
                          <Icon className="w-6 h-6 text-purple-600" />
                        </div>
                        <Badge variant="outline">{suggestion.category}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{suggestion.title}</h3>
                      <p className="text-slate-600 text-sm mb-4">{suggestion.description}</p>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                        {suggestion.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Chargement des analyses IA...
            </div>
          ) : aiAnalyses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="font-semibold text-lg text-slate-700 mb-1">Aucune analyse IA pour le moment</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Les analyses générées à partir du score IA et de la valeur estimée des biens que vous consultez apparaîtront ici.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {aiAnalyses.map((analysis, index) => {
                const { title, messageText, score, prop } = readAnalysis(analysis);
                return (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-purple-50">
                            <Brain className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className="font-semibold text-lg">{title}</h3>
                              {score != null && (
                                <Badge className="bg-purple-100 text-purple-800">Score IA {score}/100</Badge>
                              )}
                            </div>
                            {messageText ? (
                              <p className="text-slate-600 mb-2">{messageText}</p>
                            ) : (
                              <p className="text-slate-400 italic mb-2 text-sm">Analyse enregistrée (détails non structurés).</p>
                            )}
                            {prop && (
                              <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
                                {(prop.location || prop.region) && (
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{prop.location || prop.region}</span>
                                )}
                                {prop.estimated_value != null && (
                                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />Valeur estimée {Math.round(prop.estimated_value).toLocaleString('fr-FR')} FCFA</span>
                                )}
                              </div>
                            )}
                            <span className="text-xs text-slate-400 mt-2 block">{formatDate(analysis.created_at)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              Chargement de l'historique...
            </div>
          ) : chatMessages.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Clock className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <h3 className="font-semibold text-lg text-slate-700 mb-1">Aucune conversation enregistrée</h3>
                <p className="text-slate-500 text-sm">Vos échanges avec l'assistant IA apparaîtront ici.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {[...chatMessages].reverse().map((chat) => (
                <Card key={chat.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{chat.role === 'user' ? 'Vous' : 'Assistant IA'}</h3>
                          <Badge className={
                            chat.role === 'user'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }>
                            {chat.role === 'user' ? 'Question' : 'Réponse'}
                          </Badge>
                        </div>
                        <p className="text-slate-600 text-sm mb-2 line-clamp-2 whitespace-pre-wrap">{chat.content}</p>
                        <span className="text-xs text-slate-500">{formatDate(chat.created_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticulierAI;
