import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Search, 
  UserCheck, 
  Users, 
  ArrowRight, 
  Check, 
  Shield,
  FileText,
  Map,
  Phone,
  Clock,
  Star,
  Building2,
  CheckCircle2,
  Eye,
  Calculator,
  MessageSquare,
  PlayCircle,
  ChevronRight
} from 'lucide-react';

const HowItWorksPage = () => {
  const [activeTab, setActiveTab] = useState('acheteur');

  const buyerSteps = [
    { 
      icon: Search, 
      title: "1. Recherchez votre terrain idéal", 
      description: "Utilisez notre moteur de recherche avancé pour trouver des terrains vérifiés dans votre zone préférée. Filtrez par prix, superficie, localisation et type de titre foncier.",
      features: ["Carte interactive", "Filtres avancés", "Photos HD", "Documents disponibles"]
    },
    { 
      icon: Eye, 
      title: "2. Vérifications approfondies", 
      description: "Tous nos terrains passent par un processus de vérification rigoureux incluant les titres fonciers, la situation cadastrale et les aspects juridiques.",
      features: ["Vérification du titre", "Contrôle cadastral", "Validation juridique", "Rapport détaillé"]
    },
    { 
      icon: Calculator, 
      title: "3. Évaluation et négociation", 
      description: "Obtenez une estimation professionnelle du terrain et bénéficiez de notre accompagnement pour négocier le meilleur prix avec le vendeur.",
      features: ["Estimation gratuite", "Accompagnement négociation", "Analyse de marché", "Conseils d'expert"]
    },
    { 
      icon: CheckCircle2, 
      title: "4. Finalisation sécurisée", 
      description: "Nous coordonnons avec nos partenaires notaires pour finaliser l'achat en toute sécurité, avec suivi complet jusqu'à la remise des clés.",
      features: ["Notaire partenaire", "Suivi temps réel", "Garanties incluses", "Support dédié"]
    }
  ];

  const sellerSteps = [
    {
      icon: FileText,
      title: "1. Évaluation gratuite",
      description: "Soumettez votre terrain pour une évaluation gratuite par nos experts. Nous analysons la valeur marchande et le potentiel de votre bien.",
      features: ["Évaluation professionnelle", "Analyse de marché", "Conseils pricing", "Rapport détaillé"]
    },
    {
      icon: Shield,
      title: "2. Vérification et validation",
      description: "Nos experts vérifient tous vos documents fonciers pour garantir la légalité et rassurer les acheteurs potentiels.",
      features: ["Audit documentaire", "Vérification cadastrale", "Validation juridique", "Certification qualité"]
    },
    {
      icon: Building2,
      title: "3. Mise en ligne optimisée",
      description: "Votre terrain est mis en ligne avec photos professionnelles, description détaillée et tous les documents vérifiés.",
      features: ["Photos HD professionnelles", "Description optimisée", "Visibilité maximale", "Référencement web"]
    },
    {
      icon: Users,
      title: "4. Accompagnement vente",
      description: "Notre équipe gère les visites, négocie avec les acheteurs et vous accompagne jusqu'à la signature finale.",
      features: ["Gestion des visites", "Négociation assistée", "Suivi administratif", "Support juridique"]
    }
  ];

  const verificationProcess = [
    "Vérification de l'identité du propriétaire",
    "Contrôle du titre foncier (TF, bail, délibération)",
    "Vérification de la situation cadastrale",
    "Recherche d'hypothèques et servitudes",
    "Contrôle de conformité urbanistique",
    "Vérification des taxes et impôts",
    "Inspection physique du terrain",
    "Validation des limites et bornage",
    "Recherche de litiges en cours",
    "Rapport de synthèse complet"
  ];

  const stats = [
    { number: "5000+", label: "Terrains vérifiés" },
    { number: "98%", label: "Taux de satisfaction" },
    { number: "24h", label: "Délai de vérification" },
    { number: "500+", label: "Transactions réussies" }
  ];

  const faqs = [
    {
      question: "Combien coûte la vérification d'un terrain ?",
      answer: "La vérification de base est gratuite pour tous les terrains listés sur notre plateforme. Pour une vérification approfondie personnalisée, nos tarifs commencent à 50 000 FCFA."
    },
    {
      question: "Combien de temps prend le processus d'achat ?",
      answer: "En moyenne, un achat prend entre 15 à 30 jours, selon la complexité du dossier et la rapidité des démarches administratives."
    },
    {
      question: "Quelles garanties offrez-vous ?",
      answer: "Nous offrons une garantie de conformité des documents, une assurance responsabilité civile professionnelle et un accompagnement juridique complet."
    },
    {
      question: "Comment puis-je suivre l'avancement de mon dossier ?",
      answer: "Vous avez accès à un tableau de bord personnalisé où vous pouvez suivre en temps réel l'avancement de votre dossier et recevoir des notifications."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Comment ça marche - Processus d'achat et vente sécurisé | Teranga Foncier</title>
        <meta name="description" content="Découvrez comment Teranga Foncier sécurise vos transactions foncières. Processus transparent d'achat et vente de terrains au Sénégal." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-20">
        
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Comment ça marche ?
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Un processus simple, transparent et sécurisé pour vos transactions foncières
              </p>
              
              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" asChild>
                <Link to="#processus">
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Voir le processus
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Tabs Section */}
        <section id="processus" className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choisissez votre parcours
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Que vous souhaitiez acheter ou vendre un terrain, nous avons conçu un processus adapté à vos besoins
              </p>
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-lg p-1 shadow-lg border">
                <Button
                  variant={activeTab === 'acheteur' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('acheteur')}
                  className="px-6 py-3 rounded-md font-medium"
                >
                  Je veux acheter
                </Button>
                <Button
                  variant={activeTab === 'vendeur' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('vendeur')}
                  className="px-6 py-3 rounded-md font-medium"
                >
                  Je veux vendre
                </Button>
              </div>
            </div>

            {/* Steps Content */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {(activeTab === 'acheteur' ? buyerSteps : sellerSteps).map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group border-t-4 border-t-blue-500">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                        <step.icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg text-gray-900">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 mb-4">{step.description}</p>
                      <div className="space-y-2">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                            <Check className="h-4 w-4 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Verification Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Notre processus de vérification
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Chaque terrain passe par 10 étapes de vérification rigoureuses pour garantir votre sécurité
                </p>
                
                <div className="space-y-3">
                  {verificationProcess.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link to="/verification-details">
                      <Shield className="h-4 w-4 mr-2" />
                      En savoir plus sur nos garanties
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
                  alt="Processus de vérification"
                  className="rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="font-semibold text-gray-900">100% Vérifiés</div>
                      <div className="text-sm text-gray-600">Garantie sécurité</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions fréquentes
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tout ce que vous devez savoir sur notre processus
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-6"
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link to="/faq">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Voir toutes les FAQ
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Prêt à commencer ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Rejoignez des milliers de Sénégalais qui nous font confiance
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" asChild>
                  <Link to="/parcelles">
                    <Search className="h-5 w-5 mr-2" />
                    Chercher un terrain
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold" asChild>
                  <Link to="/contact">
                    <Phone className="h-5 w-5 mr-2" />
                    Nous contacter
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HowItWorksPage;
