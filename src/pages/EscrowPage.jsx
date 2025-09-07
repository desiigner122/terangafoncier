import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  CheckCircle,
  ArrowRight,
  Clock,
  DollarSign,
  Users,
  AlertTriangle,
  Zap,
  Globe,
  Award,
  FileText
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Helmet } from 'react-helmet-async';

const EscrowPage = () => {
  const escrowTypes = [
    {
      icon: DollarSign,
      title: "Escrow Vente Standard",
      description: "Protection acheteur-vendeur avec libération conditionnelle des fonds",
      conditions: ["Vérification des documents", "Inspection technique", "Transfert légal"],
      timeline: "15-30 jours"
    },
    {
      icon: Clock,
      title: "Escrow Construction",
      description: "Déblocage progressif selon l'avancement des travaux",
      conditions: ["Étapes de construction", "Validation architecte", "Conformité"],
      timeline: "6-18 mois"
    },
    {
      icon: Users,
      title: "Escrow Investissement",
      description: "Gestion sécurisée des fonds d'investissement collaboratif",
      conditions: ["Objectif de collecte", "Validation projet", "Distribution profits"],
      timeline: "Flexible"
    },
    {
      icon: Award,
      title: "Escrow Location",
      description: "Séquestre automatisé pour les cautions et loyers",
      conditions: ["État des lieux", "Paiement mensuel", "Restitution caution"],
      timeline: "Durée du bail"
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Multi-Signature",
      description: "Plusieurs signatures requises pour débloquer les fonds"
    },
    {
      icon: Lock,
      title: "Cryptage AES-256",
      description: "Chiffrement militaire pour toutes les transactions"
    },
    {
      icon: Globe,
      title: "Audit Blockchain",
      description: "Toutes les opérations sont vérifiables publiquement"
    },
    {
      icon: AlertTriangle,
      title: "Système d'Alerte",
      description: "Notifications en temps réel de tous les événements"
    }
  ];

  const advantages = [
    "Fonds sécurisés jusqu'à la livraison complète",
    "Aucun risque de fraude ou d'escroquerie",
    "Libération automatique selon conditions prédéfinies",
    "Frais transparents et réduits (0.5% vs 2-3% traditionnel)",
    "Résolution automatique des litiges simples",
    "Accessible 24h/24, 7j/7 depuis le monde entier"
  ];

  const processSteps = [
    {
      step: "01",
      title: "Création Escrow",
      description: "Configuration des conditions et montants"
    },
    {
      step: "02",
      title: "Dépôt Fonds",
      description: "L'acheteur dépose les fonds sécurisés"
    },
    {
      step: "03",
      title: "Vérifications",
      description: "Validation automatique des conditions"
    },
    {
      step: "04",
      title: "Libération",
      description: "Transfert automatique vers le vendeur"
    }
  ];

  const stats = [
    { value: "15M€", label: "Volume Sécurisé", description: "Depuis le lancement" },
    { value: "99.9%", label: "Fiabilité", description: "Uptime du système" },
    { value: "< 30s", label: "Temps Moyen", description: "Pour les transactions" },
    { value: "0.5%", label: "Frais", description: "Le plus bas du marché" }
  ];

  return (
    <>
      <Helmet>
        <title>Escrow Décentralisé - Séquestre Blockchain | Teranga Foncier</title>
        <meta name="description" content="Système d'escrow décentralisé pour l'immobilier. Sécurité maximale, frais réduits, automatisation complète des transactions." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Hero Section */}
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Sécurité Maximale
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Escrow Décentralisé
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Système de séquestre intelligent qui protège acheteurs et vendeurs. 
                Vos fonds sont sécurisés jusqu'à la livraison complète.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  Créer un Escrow
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline">
                  Voir Comment Ça Marche
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-3xl font-bold text-emerald-600 mb-2">{stat.value}</h3>
                      <p className="text-lg font-semibold mb-1">{stat.label}</p>
                      <p className="text-sm text-gray-600">{stat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Escrow Types */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">Types d'Escrow Disponibles</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des solutions adaptées à tous vos besoins immobiliers
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {escrowTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                          <p className="text-gray-600 mb-4">{type.description}</p>
                          <div className="space-y-2 mb-4">
                            {type.conditions.map((condition, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" />
                                {condition}
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center text-sm text-emerald-600">
                            <Clock className="w-4 h-4 mr-2" />
                            Durée: {type.timeline}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Sécurité de Niveau Bancaire</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Votre tranquillité d'esprit est notre priorité
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl font-bold mb-6">Pourquoi Choisir Notre Escrow ?</h2>
                <div className="space-y-4">
                  {advantages.map((advantage, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{advantage}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-6">Comment Ça Marche ?</h3>
                </div>
                <div className="space-y-6">
                  {processSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{step.step}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{step.title}</h4>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Sécurisez Vos Transactions Dès Aujourd'hui
              </h2>
              <p className="text-xl text-emerald-100 mb-8">
                Rejoignez des milliers d'utilisateurs qui font confiance à notre escrow décentralisé
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                  Créer Mon Premier Escrow
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                  Contacter Support
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EscrowPage;
