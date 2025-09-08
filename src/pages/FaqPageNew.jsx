import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone,
  Search,
  Mail,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
  FileText,
  Users,
  Globe,
  Building2
} from 'lucide-react';

const FaqPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Toutes les questions', icon: HelpCircle },
    { id: 'general', name: 'Questions générales', icon: MessageSquare },
    { id: 'verification', name: 'Vérification', icon: Shield },
    { id: 'achat', name: 'Processus d\'achat', icon: Building2 },
    { id: 'vente', name: 'Vendre un terrain', icon: FileText },
    { id: 'diaspora', name: 'Diaspora', icon: Globe },
    { id: 'juridique', name: 'Aspects juridiques', icon: CheckCircle2 }
  ];

  const faqData = [
    {
      id: 1,
      category: 'verification',
      question: "Comment Teranga Foncier vérifie-t-il l'authenticité des parcelles ?",
      answer: "Notre processus de vérification comprend 10 étapes rigoureuses : vérification de l'identité du propriétaire, contrôle du titre foncier (TF, bail, délibération), vérification cadastrale, recherche d'hypothèques, contrôle urbanistique, vérification des taxes, inspection physique, validation des limites, recherche de litiges et rapport de synthèse complet. Nous travaillons avec des partenaires certifiés pour garantir l'authenticité."
    },
    {
      id: 2,
      category: 'general',
      question: "Quels sont les frais de service de Teranga Foncier ?",
      answer: "Nos frais sont transparents et communiqués avant toute transaction. Ils couvrent la vérification approfondie, l'accompagnement par nos agents, la sécurisation administrative, l'accès à notre plateforme et la mise en relation avec des professionnels. Les tarifs varient selon le type de service (pourcentage ou forfait). Demandez un devis personnalisé gratuit."
    },
    {
      id: 3,
      category: 'diaspora',
      question: "Je vis à l'étranger, puis-je acheter un terrain via Teranga Foncier ?",
      answer: "Absolument ! Teranga Foncier est spécialement conçu pour la diaspora sénégalaise. Nous gérons l'achat à distance : procurations sécurisées, transferts de fonds, représentation locale, suivi en temps réel. Notre équipe vous accompagne comme si vous étiez au Sénégal, avec des outils numériques avancés."
    },
    {
      id: 4,
      category: 'achat',
      question: "Quels documents sont nécessaires pour acheter un terrain ?",
      answer: "Documents requis : pièce d'identité valide (CNI ou passeport), justificatif de domicile récent, justificatifs de revenus. Pour les sociétés : registre de commerce, statuts, K-bis. Notre équipe vous fournit une liste précise et vous aide à constituer votre dossier complet pour le notaire."
    },
    {
      id: 5,
      category: 'vente',
      question: "Comment vendre mon terrain sur votre plateforme ?",
      answer: "Processus simple : créez un compte vendeur, utilisez la section 'Vendre un terrain', fournissez les informations détaillées (localisation, superficie, titre), téléchargez les documents de propriété. Notre équipe vérifie avant publication et vous accompagne jusqu'à la vente finale."
    },
    {
      id: 6,
      category: 'juridique',
      question: "Quel est le rôle du notaire dans une transaction ?",
      answer: "Le notaire est un officier public qui sécurise la transaction : vérification légale des documents, rédaction de l'acte de vente, paiement des taxes et droits d'enregistrement, inscription au conservatoire foncier. Il protège acheteur et vendeur. Nous travaillons avec un réseau de notaires partenaires certifiés."
    },
    {
      id: 7,
      category: 'verification',
      question: "Quelles garanties contre les litiges ?",
      answer: "Notre vérification approfondie minimise drastiquement les risques : contrôle des antécédents, vérification des charges et hypothèques, recherche de litiges existants. Nous proposons une assurance responsabilité civile professionnelle et un accompagnement juridique complet. En cas de doute, nous suspendons la transaction."
    },
    {
      id: 8,
      category: 'achat',
      question: "Combien de temps prend l'achat d'un terrain ?",
      answer: "En moyenne 15 à 30 jours selon la complexité du dossier. Délai de vérification : 24-48h. Négociation et compromis : 3-7 jours. Finalisation notariale : 7-15 jours. Notre tableau de bord vous permet de suivre l'avancement en temps réel à chaque étape."
    },
    {
      id: 9,
      category: 'general',
      question: "Comment contacter le support client ?",
      answer: "Plusieurs canaux disponibles : chat en direct sur le site, email contact@terangafoncier.com, téléphone +221 77 593 42 41, centre d'aide en ligne. Notre équipe répond sous 2h en moyenne. Pour les urgences, utilisez le chat direct disponible 24h/7j."
    },
    {
      id: 10,
      category: 'diaspora',
      question: "Quels moyens de paiement pour la diaspora ?",
      answer: "Paiements sécurisés adaptés : virements bancaires internationaux, Western Union, MoneyGram, crypto-monnaies (Bitcoin, USDT), cartes de crédit internationales. Nous proposons un service d'escrow (séquestre) pour sécuriser les fonds jusqu'à finalisation."
    }
  ];

  const filteredFaqs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = [
    { icon: HelpCircle, number: "500+", label: "Questions résolues" },
    { icon: Users, number: "95%", label: "Satisfaction client" },
    { icon: Clock, number: "2h", label: "Temps de réponse moyen" },
    { icon: MessageSquare, number: "24/7", label: "Support disponible" }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - Questions fréquentes | Teranga Foncier</title>
        <meta name="description" content="Trouvez toutes les réponses à vos questions sur l'achat, la vente et la vérification de terrains au Sénégal. Support expert disponible 24h/7j." />
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
                Questions Fréquentes
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Trouvez rapidement les réponses à toutes vos questions
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Rechercher une question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-xl"
                />
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <stat.icon className="h-8 w-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.number}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-1">
                    {category.id === 'all' 
                      ? faqData.length 
                      : faqData.filter(faq => faq.category === category.id).length
                    }
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <AccordionItem value={`item-${faq.id}`} className="bg-white rounded-lg shadow-sm border">
                        <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <HelpCircle className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="text-gray-900 font-medium">{faq.question}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className="ml-12 text-gray-600 leading-relaxed">
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune question trouvée</h3>
                  <p className="text-gray-600">Essayez de modifier votre recherche ou contactez notre support.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Vous ne trouvez pas votre réponse ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Notre équipe d'experts est là pour vous aider
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle>Chat en direct</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      Obtenez une réponse immédiate via notre chat en ligne disponible 24h/7j
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Démarrer le chat
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle>Email</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      Envoyez-nous vos questions détaillées par email, réponse sous 2h
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="mailto:contact@terangafoncier.com">
                        contact@terangafoncier.com
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-8 w-8 text-orange-600" />
                    </div>
                    <CardTitle>Téléphone</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-600 mb-6">
                      Appelez directement nos experts pour un accompagnement personnalisé
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="tel:+221775934241">
                        +221 77 593 42 41
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
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
                Prêt à commencer votre projet foncier ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Des milliers de terrains vérifiés vous attendent
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold" asChild>
                  <Link to="/parcelles">
                    <Search className="h-5 w-5 mr-2" />
                    Chercher un terrain
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold" asChild>
                  <Link to="/how-it-works">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Comment ça marche
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

export default FaqPage;
