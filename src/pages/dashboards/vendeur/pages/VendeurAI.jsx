import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Target,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Camera,
  FileText,
  DollarSign,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Send,
  Mic,
  Image,
  BarChart3,
  Shield,
  Sparkles
} from 'lucide-react';

const VendeurAI = () => {
  const [activeTab, setActiveTab] = useState('assistant');
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const aiTabs = [
    { id: 'assistant', name: 'Assistant IA', icon: MessageSquare },
    { id: 'optimization', name: 'Optimisation', icon: Target },
    { id: 'predictions', name: 'Prédictions', icon: TrendingUp },
    { id: 'content', name: 'Contenu IA', icon: FileText }
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: 'Analyse Prédictive',
      description: 'Prédictions de prix et tendances marché',
      status: 'active',
      accuracy: '—'
    },
    {
      icon: Camera,
      title: 'Optimisation Photos',
      description: 'Amélioration automatique des images',
      status: 'active',
      accuracy: '—'
    },
    {
      icon: FileText,
      title: 'Rédaction Automatique',
      description: 'Génération de descriptions optimisées',
      status: 'active',
      accuracy: '—'
    },
    {
      icon: DollarSign,
      title: 'Pricing Intelligent',
      description: 'Suggestions de prix basées sur l\'IA',
      status: 'beta',
      accuracy: '—'
    }
  ];

  const chatHistory = []; // données graphiques réelles requises

  const optimizationSuggestions = [];

  const predictions = [];

  const contentTemplates = []; // données graphiques réelles requises

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setIsTyping(true);
    setMessage('');
    
    // Simulation de réponse IA
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const getSuggestionColor = (type) => {
    const colors = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
      low: 'border-l-blue-500 bg-blue-50'
    };
    return colors[type] || colors.low;
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'assistant':
        return (
          <div className="space-y-6">
            {/* Chat Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  Assistant IA Personnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chat History */}
                  <div className="h-96 bg-gray-50 rounded-lg p-4 overflow-y-auto space-y-4">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          chat.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white border shadow-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{chat.message}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className={`text-xs ${chat.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                              {chat.timestamp}
                            </span>
                            {chat.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {chat.confidence}% confiance
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border shadow-sm px-4 py-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-xs text-gray-500">IA réfléchit...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Input */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Posez votre question à l'IA..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Mic className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Image className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button onClick={handleSendMessage} className="bg-purple-600 hover:bg-purple-700">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'optimization':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {optimizationSuggestions.map((suggestion, index) => (
                <Card key={index} className={`border-l-4 ${getSuggestionColor(suggestion.type)}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <suggestion.icon className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold">{suggestion.title}</h3>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {suggestion.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.property}</p>
                    <p className="text-sm mb-4">{suggestion.suggestion}</p>
                    <Button size="sm" className="w-full">
                      {suggestion.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'predictions':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {predictions.map((prediction, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{prediction.metric}</h3>
                        <Badge variant="outline">{prediction.confidence}%</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Actuel:</span>
                          <span className="font-medium">{prediction.current}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Prédit ({prediction.period}):</span>
                          <span className="font-medium text-green-600">{prediction.predicted}</span>
                        </div>
                        <div className="text-center">
                          <Badge className="bg-green-100 text-green-800">
                            {prediction.change}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Tendances Marché IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Graphique prédictif des tendances marché</p>
                    <p className="text-sm text-gray-500 mt-2">Analyse basée sur 10,000+ transactions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {contentTemplates.map((template, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{template.title}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          SEO: {template.seoScore}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {template.preview}
                      </p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{template.words} mots</span>
                        <span>Optimisé IA</span>
                      </div>
                      <Button size="sm" className="w-full">
                        <Sparkles className="h-4 w-4 mr-1" />
                        Générer Contenu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assistant IA Avancé</h1>
          <p className="text-gray-600">Intelligence artificielle pour optimiser vos ventes immobilières</p>
        </div>
        
        <Button className="bg-purple-600 hover:bg-purple-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser IA
        </Button>
      </div>

      {/* AI Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <feature.icon className="h-6 w-6 text-purple-600" />
                <Badge 
                  className={
                    feature.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {feature.status === 'active' ? 'Actif' : 'Bêta'}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
              <p className="text-xs text-gray-600 mb-3">{feature.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Précision:</span>
                <span className="text-sm font-semibold text-purple-600">{feature.accuracy}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b">
        {aiTabs.map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.name}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default VendeurAI;