import React, { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Sparkles,
  FileText,
  MessageSquare,
  Search,
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lightbulb,
  Target,
  BarChart3,
  Send,
  RefreshCw,
  Download,
  History,
  BookOpen,
  Scale,
  Users,
  Shield,
  Activity
} from 'lucide-react';

import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

const sampleQueries = [
  'Quelles sont les clauses essentielles pour un acte de vente immobilière ?',
  'Comment optimiser les délais de traitement d\'une succession ?',
  'Quels sont les risques juridiques liés aux servitudes ?',
  'Analyse comparative : vente classique vs. vente en l\'état futur d\'achèvement',
  'Recommandations pour améliorer la satisfaction client',
  'Résumé des obligations fiscales pour une donation entre vifs'
];

const NotaireAIModernized = () => {
  const { dashboardStats } = useOutletContext() || {};
  const { user } = useAuth();

  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('assistant');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [aiStats, setAiStats] = useState({
    totalQueries: 0,
    documentsAnalyzed: 0,
    avgResponseTime: 0,
    satisfactionRate: 0,
    savedHours: 0
  });

  useEffect(() => {
    if (user) {
      loadAIData();
    }
  }, [user]);

  const loadAIData = async () => {
    // Simuler le chargement des statistiques IA
    // Dans une vraie application, ces données viendraient de Supabase
    setAiStats({
      totalQueries: Math.floor(Math.random() * 500) + 100,
      documentsAnalyzed: Math.floor(Math.random() * 200) + 50,
      avgResponseTime: Math.random() * 2 + 0.5,
      satisfactionRate: Math.floor(Math.random() * 20) + 80,
      savedHours: Math.floor(Math.random() * 100) + 50
    });

    // Simuler un historique de conversation
    setChatHistory([
      {
        id: 1,
        type: 'user',
        content: 'Quelles sont les clauses obligatoires pour un acte de vente ?',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 2,
        type: 'ai',
        content:
          'Pour un acte de vente immobilière au Sénégal, les clauses obligatoires incluent :\n\n1. **Identification des parties** : Identité complète du vendeur et de l\'acheteur\n2. **Désignation du bien** : Description précise avec références cadastrales\n3. **Prix de vente** : Montant en FCFA et modalités de paiement\n4. **Origine de propriété** : Titre foncier ou acte de propriété antérieur\n5. **Servitudes et charges** : Mention explicite des éventuelles servitudes\n6. **Garantie d\'éviction** : Engagement du vendeur sur la propriété du bien\n7. **Déclarations fiscales** : Conformité aux obligations de la DGI\n\nJe peux vous assister pour rédiger un modèle adapté à votre dossier.',
        timestamp: new Date(Date.now() - 3599000),
        confidence: 0.95
      }
    ]);
  };

  const handleSendQuery = async () => {
    if (!query.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setQuery('');
    setIsProcessing(true);

    // Simuler un délai de réponse de l'IA
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateAIResponse(query),
        timestamp: new Date(),
        confidence: Math.random() * 0.2 + 0.8
      };

      setChatHistory((prev) => [...prev, aiResponse]);
      setIsProcessing(false);

      window.safeGlobalToast?.({
        title: 'Réponse générée',
        description: 'L\'assistant IA a analysé votre requête.',
        variant: 'success'
      });
    }, 2000);
  };

  const generateAIResponse = (userQuery) => {
    // Simuler une réponse intelligente basée sur la requête
    const responses = {
      default: `Merci pour votre question. Voici une analyse détaillée basée sur ma connaissance du droit notarial sénégalais :\n\n**Points clés :**\n- Analyse juridique approfondie requise\n- Vérification des documents nécessaires\n- Respect des délais légaux\n\nPour plus de précision, pourriez-vous me fournir des détails supplémentaires sur votre dossier ?`,
      succession:
        'Concernant les successions au Sénégal, voici les étapes principales :\n\n1. **Certificat de décès** : Document obligatoire\n2. **Inventaire des biens** : Liste exhaustive du patrimoine\n3. **Dévolution successorale** : Détermination des héritiers légaux\n4. **Droits de succession** : Calcul et paiement des taxes\n5. **Acte de partage** : Répartition entre héritiers\n\nDélai moyen : 45-60 jours selon la complexité.',
      vente: 'Pour une vente immobilière optimale :\n\n**Étapes critiques :**\n- Vérification du titre foncier (2-3 semaines)\n- Obtention du certificat de non-hypothèque\n- Rédaction de l\'avant-contrat\n- Signature de l\'acte authentique\n- Enregistrement à la Conservation Foncière\n\n**Frais estimés :** 15-20% du prix (droits d\'enregistrement + honoraires)',
      risque:
        '**Analyse des risques identifiés :**\n\n🔴 **Risques élevés :**\n- Défaut de purge hypothécaire\n- Servitudes non déclarées\n- Litiges fonciers en cours\n\n🟡 **Risques modérés :**\n- Retards administratifs\n- Documentation incomplète\n\n✅ **Recommandations :**\n- Audit juridique préalable\n- Garantie bancaire de paiement\n- Clause suspensive adaptée'
    };

    const lowerQuery = userQuery.toLowerCase();

    if (lowerQuery.includes('succession') || lowerQuery.includes('héritage')) {
      return responses.succession;
    } else if (lowerQuery.includes('vente') || lowerQuery.includes('immobilier')) {
      return responses.vente;
    } else if (lowerQuery.includes('risque') || lowerQuery.includes('danger')) {
      return responses.risque;
    } else {
      return responses.default;
    }
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
            IA active
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-700 flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            GPT-4 Turbo
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
            <div className="text-3xl font-bold">{aiStats.totalQueries}</div>
            <p className="text-xs text-muted-foreground">Questions analysées ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents analysés</CardTitle>
            <FileText className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{aiStats.documentsAnalyzed}</div>
            <p className="text-xs text-muted-foreground">Analyses automatiques effectuées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temps de réponse</CardTitle>
            <Zap className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{aiStats.avgResponseTime.toFixed(1)}s</div>
            <p className="text-xs text-muted-foreground">Moyenne par requête</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Target className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{aiStats.satisfactionRate}%</div>
            <Progress value={aiStats.satisfactionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temps gagné</CardTitle>
            <TrendingUp className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{aiStats.savedHours}h</div>
            <p className="text-xs text-muted-foreground">Économisées ce mois</p>
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
                  Posez vos questions juridiques et obtenez des réponses instantanées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
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
                                {message.confidence && (
                                  <Badge variant="outline" className="text-xs">
                                    Confiance: {Math.round(message.confidence * 100)}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-600 animate-pulse" />
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                              <div
                                className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                              />
                              <div
                                className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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
                      disabled={!query.trim() || isProcessing}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  <Alert>
                    <Lightbulb className="h-4 w-4" />
                    <AlertTitle>Conseil</AlertTitle>
                    <AlertDescription>
                      Pour des réponses plus précises, mentionnez le type d'acte, les parties concernées et le
                      contexte juridique.
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
            <AlertTitle className="text-purple-900">Intelligence artificielle avancée</AlertTitle>
            <AlertDescription className="text-purple-800">
              Notre assistant IA utilise des modèles de langage de dernière génération, entraînés sur le droit
              notarial sénégalais et les meilleures pratiques internationales.
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
                          <Button variant="outline" size="sm" className="mt-4 w-full">
                            Activer
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
                <CardDescription>Volume de requêtes traitées</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end gap-3">
                  {[65, 82, 95, 120, 145, 178].map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-purple-500 to-purple-300"
                        style={{ height: `${(value / 178) * 100}%` }}
                      />
                      <div className="mt-2 text-xs text-gray-700">
                        {['Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov'][index]}
                      </div>
                      <Badge className="mt-1 bg-slate-100 text-slate-700" variant="secondary">
                        {value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catégories de requêtes</CardTitle>
                <CardDescription>Répartition par type de question</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Ventes immobilières', value: 35, color: 'bg-blue-500' },
                  { label: 'Successions', value: 28, color: 'bg-purple-500' },
                  { label: 'Donations', value: 18, color: 'bg-emerald-500' },
                  { label: 'Sociétés', value: 12, color: 'bg-amber-500' },
                  { label: 'Autres', value: 7, color: 'bg-gray-500' }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      <Badge variant="outline">{item.value}%</Badge>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Impact et bénéfices mesurés</CardTitle>
              <CardDescription>Gains d'efficacité grâce à l'IA</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                    <Clock className="h-4 w-4" /> Réduction délais
                  </div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">-42%</div>
                  <p className="text-xs text-gray-500 mt-1">Traitement des dossiers</p>
                </div>

                <div className="p-4 rounded-lg border bg-gradient-to-br from-emerald-50 to-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" /> Précision
                  </div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">98.5%</div>
                  <p className="text-xs text-gray-500 mt-1">Analyses juridiques</p>
                </div>

                <div className="p-4 rounded-lg border bg-gradient-to-br from-purple-50 to-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                    <Activity className="h-4 w-4" /> Productivité
                  </div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">+67%</div>
                  <p className="text-xs text-gray-500 mt-1">Gains par notaire</p>
                </div>

                <div className="p-4 rounded-lg border bg-gradient-to-br from-amber-50 to-white">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <Target className="h-4 w-4" /> Satisfaction
                  </div>
                  <div className="mt-2 text-3xl font-bold text-gray-900">94%</div>
                  <p className="text-xs text-gray-500 mt-1">Utilisateurs satisfaits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default NotaireAIModernized;
