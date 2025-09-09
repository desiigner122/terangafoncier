import React from 'react';
import { Brain, Zap, Target, TrendingUp, Shield, Users, Eye, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

const AIFeaturesPage = () => {
  const features = [
    {
      icon: Brain,
      title: "Intelligence Autonome",
      subtitle: "L'IA est le cerveau de la plateforme",
      description: "Notre IA analyse en temps réel le marché foncier sénégalais pour prendre des décisions éclairées et optimiser chaque transaction.",
      benefits: [
        "Analyse prédictive des tendances du marché",
        "Évaluation automatique des biens immobiliers",
        "Recommandations personnalisées pour chaque utilisateur"
      ]
    },
    {
      icon: Target,
      title: "Matching Intelligent",
      subtitle: "Connecte les bonnes personnes au bon moment",
      description: "L'IA comprend vos besoins et trouve automatiquement les meilleures correspondances entre acheteurs, vendeurs et promoteurs.",
      benefits: [
        "Correspondance précise selon vos critères",
        "Recommandations contextuelles",
        "Gain de temps considérable dans vos recherches"
      ]
    },
    {
      icon: TrendingUp,
      title: "Analyse Prédictive",
      subtitle: "Anticipe les évolutions du marché",
      description: "Grâce à l'analyse de données massives, l'IA prédit les tendances futures pour vous aider à prendre les meilleures décisions d'investissement.",
      benefits: [
        "Prévision des prix immobiliers",
        "Identification des zones d'investissement prometteuses",
        "Alertes sur les opportunités du marché"
      ]
    },
    {
      icon: Shield,
      title: "Sécurité Renforcée",
      subtitle: "Protection intelligente des transactions",
      description: "L'IA surveille en permanence les transactions pour détecter les fraudes et garantir la sécurité de tous les échanges.",
      benefits: [
        "Détection automatique des fraudes",
        "Vérification des documents en temps réel",
        "Protection des données personnelles"
      ]
    },
    {
      icon: Users,
      title: "Gestion Collaborative",
      subtitle: "Coordonne tous les acteurs",
      description: "L'IA facilite la collaboration entre particuliers, promoteurs, agents et institutions bancaires pour fluidifier le processus.",
      benefits: [
        "Communication automatisée entre parties",
        "Suivi intelligent des dossiers",
        "Coordination optimisée des intervenants"
      ]
    },
    {
      icon: MessageSquare,
      title: "Assistant Conversationnel",
      subtitle: "Support 24/7 intelligent",
      description: "Un chatbot IA disponible à tout moment pour répondre à vos questions et vous guider dans vos démarches immobilières.",
      benefits: [
        "Réponses instantanées à vos questions",
        "Guidance personnalisée",
        "Support multilingue (Français, Wolof, Pulaar)"
      ]
    }
  ];

  const advantages = [
    {
      icon: Zap,
      title: "Rapidité",
      description: "Transactions 10x plus rapides grâce à l'automatisation intelligente"
    },
    {
      icon: Eye,
      title: "Transparence",
      description: "Processus transparent avec traçabilité complète de chaque étape"
    },
    {
      icon: CheckCircle,
      title: "Fiabilité",
      description: "Réduction de 95% des erreurs grâce à l'intelligence artificielle"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="relative py-20 px-4 text-center bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Brain className="h-16 w-16 mx-auto mb-4 text-blue-200" />
          </div>
          <h1 className="text-5xl font-bold mb-6">
            L'Intelligence Artificielle au Cœur de 
            <span className="text-yellow-300"> Teranga Foncier</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Découvrez comment notre IA révolutionne le secteur immobilier sénégalais en automatisant, 
            optimisant et sécurisant chaque aspect de votre expérience foncière.
          </p>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Pourquoi l'IA fait la différence ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <advantage.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Fonctionnalités IA Intégrées
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Chaque fonctionnalité est alimentée par l'intelligence artificielle pour vous offrir 
            une expérience unique et personnalisée.
          </p>
          
          <div className="space-y-12">
            {features.map((feature, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2">
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 h-full">
                    <div className="flex items-center mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-green-500 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                        <p className="text-sm text-blue-600 font-medium">{feature.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                    
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-2xl p-8 text-white">
                    <div className="space-y-4">
                      <div className="h-2 bg-blue-400 rounded-full w-3/4"></div>
                      <div className="h-2 bg-green-400 rounded-full w-1/2"></div>
                      <div className="h-2 bg-yellow-400 rounded-full w-2/3"></div>
                      <div className="mt-6 p-4 bg-black/20 rounded-lg">
                        <div className="flex items-center text-green-400 text-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                          IA en cours d'analyse...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à Expérimenter l'IA Immobilière ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez la révolution du foncier sénégalais et découvrez comment l'IA 
            peut transformer votre expérience immobilière.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 inline-flex items-center">
            Commencer Maintenant
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIFeaturesPage;
